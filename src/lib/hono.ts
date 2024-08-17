import { Hono } from "hono"

const api = new Hono()
export type api = typeof api

export const hono = new Hono().route('/api', api)