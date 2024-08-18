import { hono } from '$lib/server/hono.js';

export async function fallback({ request, locals }) {
    return hono.fetch(request, { locals })
}