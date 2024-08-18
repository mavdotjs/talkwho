import { cookieController, cookieExpiration, getUserAndSession } from '$lib/server/auth'
import type { Handle } from '@sveltejs/kit'
import { createDate } from 'oslo'

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('auth_session')
	if (!sessionId) {
		event.locals.user = null
		event.locals.session = null
		return resolve(event)
	}

	const res = await getUserAndSession(sessionId)
	if (res.isNone()) {
		const sessionCookie = cookieController.createBlankCookie()
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		})
		event.locals.user = null
		event.locals.session = null
		return resolve(event)
	}
	const { session, user } = res.unwrap()
	const sessionCookie = cookieController.createCookie(session.id)
	event.cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	})
	event.locals.user = user
	event.locals.session = session
	return resolve(event)
}
