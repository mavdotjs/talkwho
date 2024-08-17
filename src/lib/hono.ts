import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import z from "zod"
import { HTTPException } from 'hono/http-exception'
import { db } from "./db"
import { alphabet, generateRandomString } from "oslo/crypto"
import { text } from "@sveltejs/kit"

type Bindings = {
    locals: App.Locals
}

const api = new Hono<{ Bindings: Bindings }>()
    .use(async (ctx, next) => {
        if(!ctx.env.locals.session) throw new HTTPException(401)
        await next()
    })
    .post('/rooms/create', zValidator('json', z.object({
        name: z.string()
    })), async ({ req, env: { locals: { user } } }) => {
        const body = req.valid('json')
        const roomId = generateRandomString(10, alphabet('0-9', 'a-z'))
        await db.chat.data.set(roomId, {
            createdAt: new Date(),
            creator: user?.id!,
            name: body.name
        })
        return text(roomId)
    })
export type api = typeof api

export const hono = new Hono<{ Bindings: Bindings }>().route('/api', api)