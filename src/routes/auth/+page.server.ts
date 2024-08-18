import { alphabet, generateRandomString } from 'oslo/crypto'
import { fail, message, setError, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { z } from 'zod'
import { hash, verify } from '@ts-rex/argon2'
import { db } from '$lib/server/db'
import { cookieController, cookieExpiration, createSessionForUser } from '$lib/server/auth'
import { createDate } from 'oslo'
import { redirect } from '@sveltejs/kit'

const schema = z.object({
	username: z
		.string()
		.min(4, 'must be atleast 4 characters')
		.max(32, 'must be less than 32 characters')
		.regex(/^[a-z0-9_\-]+$/i, `must be alphanumeric, with the exception of "_" and "-"`),
	password: z.string().min(8, 'must be atleast 8 characters').max(255)
})

export async function load({ locals }) {
	if (locals.session) {
		return redirect(302, '/app')
	}
	const form = await superValidate(zod(schema))
	return { form }
}

export const actions = {
	login: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(schema))

		if (!form.valid) return fail(400, { form })
		const { username, password } = form.data
		const user = (await db.user.findByPrimaryIndex('username', username))?.flat()
		if (!user) return setError(form, 'user does not exist')
		if (!user.password)
			return setError(form, 'this account does not have a password, maybe try a different method?')
		const isvalid = verify(password, user.password)
		if (!isvalid) return setError(form, 'incorrect password')
		const session = await createSessionForUser(user.id)
		if (session.isSome()) {
			const sessionCookie = cookieController.createCookie(session.unwrap().id)
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			})
			return redirect(302, '/app')
		} else {
			return fail(500, { form })
		}
	},
	signup: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(schema))
		if (!form.valid) return fail(400, { form })
		const { username, password } = form.data

		const userId = generateRandomString(10, alphabet('0-9', 'a-z'))
		const passwordHash = hash(password)

		const user = (await db.user.findByPrimaryIndex('username', username))?.flat()
		if (user) return setError(form, 'username', 'username already exists')
		await db.user.set(userId, {
			displayName: username,
			username,
			id: userId,
			password: passwordHash
		})
		const session = await createSessionForUser(userId)
		if (session.isSome()) {
			const sessionCookie = cookieController.createCookie(session.unwrap().id)
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			})
			return redirect(302, '/app')
		} else {
			return fail(500, { form })
		}
	}
}
