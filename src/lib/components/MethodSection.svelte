<script lang="ts">
	import type { Snippet } from 'svelte';
	import { SLOT_TITLES, type SpineSlot } from './spine';

	type Props = {
		slot: SpineSlot;
		customTitle?: string;
		id?: string;
		children: Snippet;
	};

	let { slot, customTitle, id, children }: Props = $props();

	const headingId = $derived(id ?? `method-${slot}`);
</script>

<section class="method-section method-section--{slot}" aria-labelledby={headingId}>
	<h2 id={headingId} class="section-header">{customTitle ?? SLOT_TITLES[slot]}</h2>
	{@render children()}
</section>

<style>
	.method-section {
		display: grid;
		gap: 1rem;
	}
</style>
