import {
	Google,
	Discord,
	GitHub,
	generateState,
	generateCodeVerifier,
	type GitHubTokens,
	type DiscordTokens
} from 'arctic'
import { error, redirect, type Actions, type RequestHandler, type ServerLoad } from '@sveltejs/kit'
import { z } from 'zod'
import { db, publicUser } from './db'
import { env } from '$env/dynamic/private'
import { dev } from '$app/environment'
import { alphabet, generateRandomString } from 'oslo/crypto'
import { decodeJwt } from 'jose'
import { superValidate, type SuperForm } from 'sveltekit-superforms'
import { zod, type ValidationAdapter } from 'sveltekit-superforms/adapters'
import { cookieController, createSessionForUser } from './auth'

const {
	DISCORD_CLIENT_ID,
	DISCORD_CLIENT_SECRET,
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET
} = env

//TODO: oauth

const DEVURL = (prov: string) => `http://localhost:5173/oauth/${prov}/callback`
const PRODURL = (prov: string) => `https://spiel.place/oauth/${prov}/callback`

export const github = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, {
	redirectURI: dev ? DEVURL('github') : PRODURL('github')
})
export const discord = new Discord(
	DISCORD_CLIENT_ID,
	DISCORD_CLIENT_SECRET,
	dev ? DEVURL('discord') : PRODURL('discord')
)
export const google = new Google(
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	dev ? DEVURL('google') : PRODURL('google')
)

export function oauth_handler(): RequestHandler<{ provider: string }> {
	return async ({ cookies, params: { provider: providerID }, url }) => {
		let provider: Google | Discord | GitHub
		let scopes: string[]
		let noop = false
		switch (providerID) {
			case 'discord': {
				provider = discord
				scopes = ['identify']
				break
			}
			case 'google': {
				provider = google
				scopes = ['profile']
				break
			}
			case 'github': {
				provider = github
				scopes = []
				break
			}
			default: {
				noop = true
				break
			}
		}
		// @ts-expect-error: I know im using it before assignment that's the point
		if (noop || !provider || !scopes) error(404, 'provider not found')
		let redir: URL
		const state = generateState()
		let codeVerifier: string
		if (provider instanceof Google) {
			codeVerifier = generateCodeVerifier()
			redir = await provider.createAuthorizationURL(state, codeVerifier, {
				scopes
			})
		} else {
			redir = await provider.createAuthorizationURL(state, {
				scopes
			})
		}
		cookies.set('state', state, {
			secure: true,
			path: '/',
			httpOnly: true,
			maxAge: 60 * 10
		})
		// @ts-expect-error: I know im using it before assignment that's the point
		if (codeVerifier) {
			cookies.set('code_verifier', codeVerifier, {
				secure: true,
				path: '/',
				httpOnly: true,
				maxAge: 60 * 10
			})
		}
		redirect(302, redir)
	}
}

export function oauth_callback(): ServerLoad<
	{ provider: string },
	any,
	{
		type: 'create' | 'link'
		name: string
		user: z.infer<typeof publicUser>
		form: SuperForm<
			ValidationAdapter<
				{
					token: string
				},
				{
					token: string
				}
			>,
			any
		>
		prov: string
	}
> {
	return async ({ cookies, params: { provider: providerID }, locals, url }) => {
		let provider: Google | Discord | GitHub
		let scopes: string[]
		let noop = false
		switch (providerID) {
			case 'discord': {
				provider = discord
				scopes = ['identify']
				break
			}
			case 'google': {
				provider = google
				scopes = ['profile']
				break
			}
			case 'github': {
				provider = github
				scopes = []
				break
			}
			default: {
				noop = true
				break
			}
		}
		// @ts-expect-error: I know im using it before assignment that's the point
		if (noop || !provider || !scopes) error(404, 'provider not found')
		const code = url.searchParams.get('code')
		const state = url.searchParams.get('state')

		const storedState = cookies.get('state')
		const storedCodeVerifier = cookies.get('code_verifier')
		if (
			!code ||
			!storedState ||
			state !== storedState ||
			(provider instanceof Google && !storedCodeVerifier)
		) {
			error(400, 'Invalid request')
		}
		let id: string
		let name: string
		if (provider instanceof Google) {
			const tokens = await provider.validateAuthorizationCode(code, storedCodeVerifier)
			console.log(tokens.idToken)
			const { sub, name: Uname } = decodeJwt(tokens.idToken)
			id = sub!
			name = Uname as string
		} else {
			const tokens: GitHubTokens | DiscordTokens = await provider.validateAuthorizationCode(code)
			if (providerID === 'discord') {
				const response = await fetch('https://discord.com/api/users/@me', {
					headers: {
						Authorization: `Bearer ${tokens.accessToken}`
					}
				})
				if (!response.ok) error(500, 'Unable to contact provider')
				const { id: userId, username } = await response.json()
				id = userId
				name = username
			} else if (providerID === 'github') {
				const response = await fetch('https://api.github.com/user', {
					headers: {
						Authorization: `Bearer ${tokens.accessToken}`
					}
				})
				if (!response.ok) error(500, 'Unable to contact provider')
				const { id: userId, login } = await response.json()
				id = userId
				name = login
			}
		}
        const existingUser = (await db.user.getOneBySecondaryIndex(`oauth_${providerID}_id`, id))?.flat()
        if(existingUser) {
            const session = await createSessionForUser(existingUser.id)
            const sessionCookie = cookieController.createCookie(session.unwrap().id)
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			})
			redirect(302, '/app')
        }
		const formToken = generateRandomString(12, alphabet('0-9', 'a-z'))
		const form = await superValidate({ token: formToken }, zod(z.object({ token: z.string() })))
		if (locals.user) {
			// the user is already logged in, ask them if they want to link the account to their existing account, or log out and try again
			await db.saved_oauth_data.set(formToken, {
				oauth_id: id,
				type: 'link'
			})
			return {
				type: 'link',
				name,
				prov: providerID,
				user: publicUser.safeParse(locals.user).data!,
				form
			}
		} else {
			// the user is NOT logged in, log them in, if there is no account linked to that provided user, ask them if they want to create an account
			await db.saved_oauth_data.set(formToken, {
				oauth_id: id,
				type: 'create'
			})
			return {
				type: 'create',
				name,
				prov: providerID,
				user: publicUser.safeParse(locals.user).data!,
				form
			}
		}
	}
}

export function oauth_callback_actions(): Actions<{ provider: string }> {
	return {
		link: ({ request, locals,  }) => {
            // get existing account and link it
        },
        create: ({ request }) => {
            // create new account with 
        }
	}
}
