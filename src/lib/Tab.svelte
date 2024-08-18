<script lang="ts">
	import type { Snippet } from 'svelte'

	let {
		tab = $bindable(),
		disabled = $bindable(false),
		map,
		...props
	}: {
		tab: string | undefined
		disabled?: boolean
		map?: Record<string, string>
		class?: string
		[x: `_${string}`]: Snippet<[]>
	} = $props()
	const tabs = Object.fromEntries(
		Object.entries(props)
			.filter((v) => v[0].startsWith('_'))
			.map(([name, snippet]): [string, Snippet<[]>] => [name.replace('_', ''), snippet])
	)
</script>

<div role="tablist" class="tabs tabs-boxed {props.class}">
	{#each Object.entries(tabs) as [tabID]}
		<!-- svelte-ignore a11y_interactive_supports_focus -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_missing_attribute -->
		<a
			class:cursor-not-allowed={disabled}
			class:pointer-events-none={disabled}
			class:tab-disabled={disabled}
			role="tab"
			class="tab uppercase"
			onclick={() => (tab = tabID)}
			class:tab-active={tabID == tab}>{@render tabs[tabID]()}</a
		>
	{/each}
</div>
