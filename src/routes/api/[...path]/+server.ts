import { hono } from '$lib/hono.js';

export async function fallback({ request, locals }) {
    return hono.fetch(request, { locals })
}