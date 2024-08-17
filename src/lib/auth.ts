import type { z } from "zod"
import { db, session } from "./db"
import { Err, Ok, Result } from "@oxi/result"
import type { FlatDocumentData } from "@olli/kvdex"
import { nanoid } from "nanoid"
import { TimeSpan, createDate } from "oslo"
import { alphabet, generateRandomString } from "oslo/crypto"

const sessionTimeSpan = new TimeSpan(1, 'w')

async function createSessionForUser(userId: string): Promise<Result<FlatDocumentData<z.infer<typeof session>, string>, null>> {
    const user = (await db.user.find(userId))?.flat()
    if(!user) return Err(null)
    const sessionId = generateRandomString(10, alphabet("0-9", "a-z"))
    const createdSession = (await db.session.set(sessionId, {
        expiresAt: createDate(sessionTimeSpan),
        userId
    }, { expireIn: sessionTimeSpan.milliseconds() }))
    if(!createdSession.ok) return Err(null)
    return Ok((await db.session.find(sessionId))?.flat()!)
}

async function deleteSession(sessionId: string): Promise<void> {
    await db.session.delete(sessionId)
}

export {
    createSessionForUser,
    deleteSession
}