<script>
	const { data } = $props()
</script>

{#if data.type === 'create'}
	do you want to create a new account using <code class="font-bold">{data.name}</code> from {data.prov}?
	<button>yes</button> <button>no</button>
{:else if data.type === 'link'}{/if}
