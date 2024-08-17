import type { z } from 'zod'
import { db, session } from './db'
import { Err, Ok, Result } from '@oxi/result'
import { Option, None, Some } from '@oxi/option'
import type { FlatDocumentData } from '@olli/kvdex'
import { nanoid } from 'nanoid'
import { TimeSpan, createDate } from 'oslo'
import { alphabet, generateRandomString } from 'oslo/crypto'
import { CookieController } from "oslo/cookie"

const sessionTimeSpan = new TimeSpan(1, 'w')

async function createSessionForUser(
	userId: string
): Promise<Option<FlatDocumentData<z.infer<typeof session>, string>>> {
	const user = (await db.user.find(userId))?.flat()
	if (!user) return None
	const sessionId = generateRandomString(21, alphabet('0-9', 'a-z'))
	const createdSession = await db.session.set(
		sessionId,
		{
			expiresAt: createDate(sessionTimeSpan),
			userId
		},
		{ expireIn: sessionTimeSpan.milliseconds() }
	)
	if (!createdSession.ok) return None
	return Some((await db.session.find(sessionId))?.flat()!)
}

async function deleteSession(sessionId: string): Promise<void> {
	await db.session.delete(sessionId)
}

async function getUserAndSession(
	sessionId: string
): Promise<
	Option<{
		user: FlatDocumentData<z.infer<(typeof import('$lib/db'))['user']>, string>
		session: FlatDocumentData<z.infer<(typeof import('$lib/db'))['session']>, string>
	}>
> {
	const session = (await db.session.find(sessionId))?.flat()
	if (!session) return None
	const user = (await db.user.find(session.userId))?.flat()
	if (!user) return None
    await db.session.update(sessionId, {
        expiresAt: createDate(sessionTimeSpan)
    }, { expireIn: sessionTimeSpan.milliseconds() })
    return Some({ user, session })
}

export const cookieExpiration = new TimeSpan(365 * 2, 'd')
export const cookieController = new CookieController('auth_session', {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: ".",
}, { expiresIn: cookieExpiration })
export { createSessionForUser, deleteSession, getUserAndSession }
