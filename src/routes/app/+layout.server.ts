import { publicUser } from '$lib/server/db'
import { redirect } from '@sveltejs/kit'

export async function load({ locals }) {
	if (!locals.session) {
		return redirect(302, '/auth')
	}
	return publicUser.safeParse(locals.user).data!
}

export const csr = true
export const ssr = false
