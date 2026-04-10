<script lang="ts">
	import PartyListSection from '$lib/components/PartyListSection.svelte';
</script>

<svelte:head>
	<title>Party-List Proportional Representation — How It Works</title>
	<meta
		name="description"
		content="A comprehensive guide to party-list proportional representation: open vs closed lists, electoral thresholds, D'Hondt vs Sainte-Laguë allocation, and where it is used around the world."
	/>
</svelte:head>

<section class="method-page">
	<h1>Party-List Proportional Representation</h1>
	<p class="lede">
		Party-list systems are the most common form of proportional representation worldwide. Voters
		choose a party, seats are divided in proportion to each party's vote share, and the details —
		open or closed lists, thresholds, allocation formulas — determine how much power voters have
		over which candidates actually take those seats.
	</p>
	<nav class="method-links" aria-label="Method links">
		<a href="/">← Back to overview</a>
		<a href="/stv">Compare with the Single Transferable Vote</a>
		<a href="/proportional-approval">See Proportional Approval Voting →</a>
	</nav>
	<PartyListSection />
</section>

<style>
	.method-page { display: grid; gap: 2rem; }
	.lede { font-size: 1.1rem; line-height: 1.7; margin: 0; }
	.method-links { display: flex; flex-wrap: wrap; gap: 1rem; }
	.method-links a { color: var(--link-color); text-decoration: none; font-weight: 600; }
	.method-links a:hover { text-decoration: underline; }
</style>
