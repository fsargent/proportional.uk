<script lang="ts">
	import SystemFinder from '$lib/components/SystemFinder.svelte';
</script>

<svelte:head>
	<title>System Finder — Which voting system fits your preferences?</title>
	<meta name="description" content="Answer a few questions about what you value in an electoral system and find which voting methods match your preferences." />
</svelte:head>

<section class="method-page">
	<h1>Which voting system fits your preferences?</h1>
	<p class="lede">
		There's no single "best" electoral system — it depends on what you value. Answer a few
		quick questions below and we'll show you which systems match. Skip any question you don't
		have a strong opinion on.
	</p>
	<nav class="method-links" aria-label="Method links">
		<a href="/">← Back to overview</a>
	</nav>
	<SystemFinder />
</section>
