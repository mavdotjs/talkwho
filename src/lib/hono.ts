import { Hono } from "hono"

type Bindings = {
    locals: App.Locals
}

const api = new Hono<{ Bindings: Bindings }>()
export type api = typeof api

export const hono = new Hono<{ Bindings: Bindings }>().route('/api', api)