<script>
	import { superForm } from 'sveltekit-superforms'

	const { data } = $props()
	const { enhance } = superForm(data.form)
</script>

<form action="POST" use:enhance>
	{#if data.type === 'create'}
		do you want to create a new account using <code class="font-bold">{data.name}</code> from {data.prov}?
		<button formaction="?/create">yes</button> <a href="/">no</a>
	{:else if data.type === 'link'}
		do you want to link <code class="font-bold">{data.name}</code> from {data.prov} to your existing
		account {data.user.displayName}?
		<button formaction="?/link">yes</button> <a href="/">no</a>
		<a href="/auth/signout">Sign me out and try again</a>
	{/if}
</form>
