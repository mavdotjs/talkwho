import { hono } from '$lib/server/hono'

export async function fallback({ request, locals }) {
	return hono.fetch(request, { locals })
}
