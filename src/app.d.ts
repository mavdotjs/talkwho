// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { FlatDocumentData } from '@olli/kvdex'
import { user, session } from '$lib/server/db'
import z from 'zod'
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface Locals {
			user: FlatDocumentData<z.infer<typeof user>, string> | null
			session: FlatDocumentData<z.infer<typeof session>, string> | null
		}
	}
}

export {}
