<script lang="ts">
	import MMDVisualiser from '$lib/components/MMDVisualiser.svelte';

	let {
		title = 'Explore multi-member districts in practice',
		introText = 'If you want to understand STV or fully proportional approval systems, you eventually have to ask a geography question: how big should districts be, and what happens as they get bigger?',
		bodyText = 'That is what the visualiser is for. It lets you group today’s Westminster constituencies into larger districts and see how district size changes proportionality, local scale, and ballot pressure.',
		initialMagnitude = 8
	}: {
		title?: string;
		introText?: string;
		bodyText?: string;
		initialMagnitude?: number;
	} = $props();
</script>

<section class="mmd-visualiser-section" aria-labelledby="mmd-visualiser-title">
	<div class="copy">
		<h2 id="mmd-visualiser-title" class="section-header">{title}</h2>
		<p class="intro-text">{introText}</p>
		<p>{bodyText}</p>
	</div>

	<MMDVisualiser showHero={false} showAssumptions={false} {initialMagnitude} />
</section>

<style>
	.mmd-visualiser-section { display: grid; gap: 1.5rem; }
	.copy { max-width: 54rem; }
</style>
