<script lang="ts">
	import GlitchSpotB from '$lib/components/glitch/GlitchSpotB.svelte';
</script>

<svelte:head>
	<title>Export — Glitch Spot B</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="export-capture">
	<div class="scale-wrapper">
		<GlitchSpotB mode="export" />
	</div>
</div>

<style>
	:global(html), :global(body) {
		margin: 0;
		padding: 0;
		background: #000;
		overflow: hidden;
	}

	.export-capture {
		width: 1080px;
		height: 1920px;
		overflow: hidden;
	}

	.scale-wrapper {
		width: 360px;
		height: 640px;
		transform: scale(3);
		transform-origin: top left;
	}
</style>
