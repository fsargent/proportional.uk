<script lang="ts">
	import STVSection from '$lib/components/STVSection.svelte';
</script>

<svelte:head>
	<title>Single Transferable Vote for the UK</title>
	<meta name="description" content="Understand Single Transferable Vote, its strengths, its tradeoffs, and how it compares with approval-based multi-member systems." />
</svelte:head>

<section class="method-page">
	<h1>Single Transferable Vote: proportional, local, and more demanding on the ballot</h1>
	<p class="lede">
		Single Transferable Vote, usually shortened to STV, offers proportional representation without closed lists.
		The trade-off is also clear: it asks more of voters and more of the count.
	</p>

	<nav class="method-links" aria-label="Method links">
		<a href="/">← Back to overview</a>
		<a href="/visualiser">Open district visualiser</a>
		<a href="/proportional-approval">Compare with Proportional Approval →</a>
	</nav>

	<STVSection />
</section>

<style>
	.method-page { display:grid; gap:2rem; }
	.lede { max-width: 52rem; font-size: 1.1rem; line-height: 1.7; margin: 0; }
	.method-links { display:flex; flex-wrap:wrap; gap:1rem; }
	.method-links a { color: var(--link-color); text-decoration:none; font-weight:600; }
	.method-links a:hover { text-decoration:underline; }
</style>
