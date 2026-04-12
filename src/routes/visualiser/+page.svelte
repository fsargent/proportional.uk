<script lang="ts">
	import MMDVisualiser from '$lib/components/MMDVisualiser.svelte';
</script>

<svelte:head>
	<title>Multi-Member District Visualiser</title>
	<meta
		name="description"
		content="Explore how grouped Westminster constituencies behave as multi-member districts, and how district size changes scale, proportionality, and ballot pressure."
	/>
</svelte:head>

<MMDVisualiser
	title="How district size reshapes Westminster"
	intro="This page groups current Westminster constituencies into larger multi-member districts, then shows how district magnitude changes local scale, party balance, ballot pressure, and the practicality of using stable UK boundaries."
	showHero={true}
	showAssumptions={true}
	initialMagnitude={8}
/>
