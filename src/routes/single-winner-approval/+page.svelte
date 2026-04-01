<script lang="ts">
	import SingleWinnerApprovalSection from '$lib/components/SingleWinnerApprovalSection.svelte';
</script>

<svelte:head>
	<title>Single-Winner Approval for Westminster</title>
	<meta name="description" content="Explore the simplest approval-voting path for Westminster: one MP per constituency, but a better ballot." />
</svelte:head>

<section class="method-page">
	<p class="eyebrow">Method page</p>
	<h1>Single-Winner Approval: the smallest ballot fix</h1>
	<p class="lede">
		Keep one MP per constituency. Keep the familiar Westminster map. Change only the instruction on the
		ballot: approve every candidate you would genuinely be happy to elect.
	</p>
	<nav class="method-links" aria-label="Method links">
		<a href="/">← Back to overview</a>
		<a href="/ams-plus">See AMS+ →</a>
	</nav>
	<SingleWinnerApprovalSection />
</section>

<style>
	.method-page { display:grid; gap:2rem; }
	.eyebrow { margin:0; color:var(--accent-text); font-weight:700; text-transform:uppercase; letter-spacing:.05em; }
	.lede { max-width: 52rem; font-size: 1.1rem; line-height: 1.7; margin: 0; }
	.method-links { display:flex; flex-wrap:wrap; gap:1rem; }
	.method-links a { color: var(--link-color); text-decoration:none; font-weight:600; }
	.method-links a:hover { text-decoration:underline; }
</style>
