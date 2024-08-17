import { hono } from '$lib/hono.js';

export async function fallback({ request }) {
    return hono.fetch(request)
}