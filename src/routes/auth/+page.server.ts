import { alphabet, generateRandomString } from 'oslo/crypto';
import { fail, message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { hash } from "@ts-rex/argon2"
import { db } from '$lib/db.js';

const schema = z.object({
    username: z.string().min(4, "must be atleast 4 characters").max(32, "must be less than 32 characters").regex(/^[a-z0-9_\-]+$/i, `must be alphanumeric, with the exception of "_" and "-"`),
    password: z.string().min(8, "must be atleast 8 characters").max(255)
});

export async function load() {
    const form = await superValidate(zod(schema));
    return { form };
};

export const actions = {
    login: async ({ request }) => {
        const form = await superValidate(request, zod(schema));

        if (!form.valid) return fail(400, { form });
        const { username, password } = form.data

        // TODO: Login user
        return message(form, 'Login form submitted');
    },
    signup: async ({ request }) => {
        const form = await superValidate(request, zod(schema));
        console.log(form)
        if (!form.valid) return fail(400, { form });
        const { username, password } = form.data

        const userId = generateRandomString(10, alphabet("0-9", "a-z"))
        const passwordHash = hash(password)

        const user = (await db.user.findByPrimaryIndex('username', username))?.flat()
        if(user) return setError(form, 'Username already exists')
        console.log(userId, password, passwordHash);
        console.log(await db.user.set(userId, {
            displayName: username,
            username,
            id: userId,
            password: passwordHash
        }))

        return message(form, 'Signup form submitted');
    }
}