import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		esbuildOptions: {
			loader: {
				'.node': 'empty'
			},
			target: ['deno1.45.5']
		}
	}
})
