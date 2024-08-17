import { kvdex as kvdex, collection, model } from "@olli/kvdex"
import { openKv } from "@deno/kv"
import { z } from "zod"

export const user = z.object({
    displayName: z.string(),
    username: z.string(),
    id: z.string(),
    password: z.optional(z.string()),
    oauth_github_id: z.optional(z.string()),
    oauth_google_id: z.optional(z.string()),
    oauth_discord_id: z.optional(z.string())
})

export const publicUser = user.pick({ displayName: true, id: true })

export const session = z.object({
    expiresAt: z.date(),
    userId: z.string(),
})

export const kv = await openKv()
export const db = kvdex(kv, {
    user: collection(user, {
        idGenerator: ({ id }) => id,
        indices: {
            username: 'primary',
            oauth_github_id: 'primary',
            oauth_google_id: 'primary',
            oauth_discord_id: 'primary'
        }
    }),
    session: collection(session, {
        indices: {
            userId: 'secondary'
        }
    }),
    pfp: collection(model<Uint8Array>()),
    chat: {
        boxes: collection(model<{ userID: string, text: string }>()),
        users: collection(publicUser)
    }
})