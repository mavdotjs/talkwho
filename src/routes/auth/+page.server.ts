import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const schema = z.object({
    username: z.string().min(4, "must be atleast 4 characters").max(32, "must be less than 32 characters").regex(/^[a-z0-9_\-]{4,32}$/i, `must be alphanumeric, with the exception of "_" and "-"`),
    password: z.string().min(8, "must be atleast 8 characters")
});

export async function load() {
    const form = await superValidate(zod(schema));
    return { form };
};

export const actions = {
    login: async ({ request }) => {
        const form = await superValidate(request, zod(schema));

        if (!form.valid) return fail(400, { form });
    
        // TODO: Login user
        return message(form, 'Login form submitted');
    },
    signup: async ({ request }) => {
        const form = await superValidate(request, zod(schema));

        if (!form.valid) return fail(400, { form });
    
        // TODO: Login user
        return message(form, 'Signup form submitted');

    }
}