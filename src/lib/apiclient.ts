import { type api } from "./hono"
import { hc } from "hono/client"
export const client = hc<api>('/api', {
    async fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
        return await fetch(input, {
            ...init,
            credentials: 'include',
        })
    }
})