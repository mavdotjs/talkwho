import { Google, Discord, GitHub, type OAuth2Provider, type OAuth2ProviderWithPKCE, generateState, generateCodeVerifier } from "arctic"
import { error, redirect, type Actions, type RequestHandler, type ServerLoad } from "@sveltejs/kit";
import type { z } from "zod";
import type { publicUser } from "./db";

//TODO: oauth

export const google = new Google();
export const discord = new Discord();
export const github = new GitHub();

export function oauth_handler(): RequestHandler<{ provider: string }> {
    return async ({ cookies, params: { provider: providerID }, url }) => {
        let provider: Google | Discord | GitHub;
        let scopes: string[]
        let noop = false;
        switch(providerID) {
            case "discord": {
                provider = discord
                scopes = ['identify']
                break
            }
            case "google": {
                provider = google
                scopes = ['profile']
                break
            }
            case "github": {
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
        if(noop || !provider || !scopes) error(404, "provider not found")
        let redir: URL;
        const state = generateState();
        let codeVerifier: string;
        if(provider instanceof Google) {
            codeVerifier = generateCodeVerifier()
            redir = await provider.createAuthorizationURL(state, codeVerifier, {
                scopes
            })
        } else {
            redir = await provider.createAuthorizationURL(state, {
                scopes
            })
        }
        cookies.set("state", state, {
            secure: true,
            path: "/",
            httpOnly: true,
            maxAge: 60 * 10
        });
        // @ts-expect-error: I know im using it before assignment that's the point
        if(codeVerifier) {
            cookies.set("code_verifier", codeVerifier, {
                secure: true,
                path: "/",
                httpOnly: true,
                maxAge: 60 * 10
            });
        }
        redirect(302, redir);
    }
}

export function oauth_callback(): ServerLoad<{ provider: string }, any, { type: "create" | "link", name: string, user: z.infer<typeof publicUser> }> {
    return async ({ cookies, params: { provider: providerID }, locals, url }) => {
        let provider: Google | Discord | GitHub;
        let scopes: string[]
        let noop = false;
        switch(providerID) {
            case "discord": {
                provider = discord
                scopes = ['identify']
                break
            }
            case "google": {
                provider = google
                scopes = ['profile']
                break
            }
            case "github": {
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
        if(noop || !provider || !scopes) error(404, "provider not found")
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");
        
        const storedState = cookies.get("state");
        const storedCodeVerifier = cookies.get("code_verifier");
        if (!code || !storedState || state !== storedState || (provider instanceof Google && !storedCodeVerifier)) {
            error(400, "Invalid request")
        }
        let tokens
        if(provider instanceof Google) {
            tokens = await provider.validateAuthorizationCode(code, storedCodeVerifier)
        } else {
            tokens = await provider.validateAuthorizationCode(code)
        }
        if(locals.user) {
            // the user is already logged in, ask them if they want to link the account to their existing account, or log out and try again
            return {
                type: 'create',

            }
        } else {
            // the user is NOT logged in, log them in, if there is no account linked to that provided user, ask them if they want to create an account
            
        }
    }
}

export function callback_actions(): Actions<{ provider: string }> {
    return {

    }
}