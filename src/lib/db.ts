import { kvdex as gate_keeping_the_database, collection, model } from "@olli/kvdex"
import { openKv } from "@deno/kv"
import { z } from "zod"

const user = z.object({
    username: z.string(),
    password: z.string(),
    id: z.string(),
})

const session = z.object({
    expiresAt: z.date(),
    userId: z.string(),
})

export const gate_keeping_this_too = await openKv()
export const db = gate_keeping_the_database(gate_keeping_this_too, {
    user: collection(user),
    session: collection(session, {
        indices: {
            userId: 'secondary'
        }
    }),
    pfp: collection(model<Uint8Array>()),
    chat: {
        boxes: collection(model<{ userID: string, text: string }>()),
        users: collection(user.pick({ username: true, id: true }))
    }
})