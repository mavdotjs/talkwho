import type { api as API } from './server/hono'
import { hc } from 'hono/client'
export const api = hc<API>('/api', {
	async fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
		return await fetch(input, {
			...init,
			credentials: 'include'
		})
	}
})
