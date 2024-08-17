<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

	const { data } = $props();
	const { enhance, message, constraints, errors, form } = superForm(data.form);
</script>

<div class="h-[100vh] flex items-center justify-center">
	<div class="card bg-base-100 w-96 shadow-xl">
		<form class="m-2 flex-col flex gap-y-4" method="post" use:enhance>
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
            class:showerror={$errors.username}>^ {$errors.username?.join(" & ")}</span>
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
					Signup
				</button>
				<button formaction="?/login" type="submit" class="btn btn-secondary btn-outline flex-grow">
					Login
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
