<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
    import { page } from "$app/stores"
	const { data } = $props();
	const { enhance, message, constraints, errors, form } = superForm(data.form);
</script>

<div class="h-[100vh] flex items-center justify-center">
	<div class="card bg-base-200 w-96 shadow-xl p-4">
		<h1 class="text-xl mb-2 font-bold">sign up/in</h1>
		<div class="join">
			<a href="{$page.url.pathname}/oauth/google" class="btn grow btn-outline join-item">
				<svg
					class="size-4"
					viewBox="-3 0 262 262"
					xmlns="http://www.w3.org/2000/svg"
					preserveAspectRatio="xMidYMid"
					fill="#000000"
					><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
						id="SVGRepo_tracerCarrier"
						stroke-linecap="round"
						stroke-linejoin="round"></g
					><g id="SVGRepo_iconCarrier"
						><path
							d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
							fill="#4285F4"></path
						><path
							d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
							fill="#34A853"></path
						><path
							d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
							fill="#FBBC05"></path
						><path
							d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
							fill="#EB4335"></path
						></g
					></svg>
			</a>
			<a href="{$page.url.pathname}/oauth/discord" class="btn grow btn-outline join-item">
				<svg class="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36"
					><path
						fill="#5865f2"
						d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"
					></path
					></svg>
			</a>
			<a href="{$page.url.pathname}/oauth/github" class="btn grow btn-outline join-item">
				<svg class="size-5" viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg"
					><path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
						fill="#24292f"></path
					></svg>
			</a>
		</div>
		<span class="divider">or</span>
		<form class="flex-col flex gap-y-4" method="post" use:enhance>
			<label class="input input-bordered flex items-center gap-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 16 16"
					fill="currentColor"
					class="size-4">
					<path
						fill-rule="evenodd"
						d="M11.89 4.111a5.5 5.5 0 1 0 0 7.778.75.75 0 1 1 1.06 1.061A7 7 0 1 1 15 8a2.5 2.5 0 0 1-4.083 1.935A3.5 3.5 0 1 1 11.5 8a1 1 0 0 0 2 0 5.48 5.48 0 0 0-1.61-3.889ZM10 8a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z"
						clip-rule="evenodd"></path>
				</svg>

				<input
					bind:value={$form.username}
					aria-invalid={$errors.username ? 'true' : undefined}
					type="text"
					class="grow placeholder:text-base-content/20"
					placeholder="kaii" />
			</label>
			<span
				class="opacity-0 hidden transition-opacity duration-1000 text-error"
				class:showerror={$errors.username}>^ {$errors.username?.join(' & ')}</span>
			<label class="input input-bordered flex items-center gap-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 16 16"
					fill="currentColor"
					class="size-4">
					<path
						fill-rule="evenodd"
						d="M8 1a3.5 3.5 0 0 0-3.5 3.5V7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7V4.5A3.5 3.5 0 0 0 8 1Zm2 6V4.5a2 2 0 1 0-4 0V7h4Z"
						clip-rule="evenodd"></path>
				</svg>
				<input
					bind:value={$form.password}
					aria-invalid={$errors.password ? 'true' : undefined}
					type="password"
					class="grow placeholder:text-base-content/20"
					placeholder="verygoodpassword" />
			</label>
			<span
				class="opacity-0 hidden transition-opacity duration-1000 text-error"
				class:showerror={$errors.password}>^ {$errors.password}</span>
			<div class="flex flex-row gap-x-4">
				<button formaction="?/signup" type="submit" class="btn btn-secondary flex-grow">
					sign up
				</button>
				<button formaction="?/login" type="submit" class="btn btn-secondary btn-outline flex-grow">
					sign in
				</button>
			</div>
			{#if $message}<span class="text-xs">{$message}</span>{/if}
		</form>
	</div>
</div>

<style lang="postcss">
	.showerror {
		@apply block opacity-100;
	}
</style>
