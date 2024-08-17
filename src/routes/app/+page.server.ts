import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
    if(!locals.session) {
        return redirect(302, "/auth")
    }
}