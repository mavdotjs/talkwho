import { cookieController, deleteSession } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export async function GET({ locals, cookies }) {
    if(locals.session) {
        await deleteSession(locals.session.id)
        const sessionCookie = cookieController.createBlankCookie();
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});
    }
    return redirect(302, '/')
}