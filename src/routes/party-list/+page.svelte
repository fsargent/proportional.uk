<script lang="ts">
	import PartyListSection from '$lib/components/PartyListSection.svelte';
	import MethodNav from '$lib/components/MethodNav.svelte';
	import ComposeBadgeRow from '$lib/components/ComposeBadgeRow.svelte';
	import SiblingStrip from '$lib/components/SiblingStrip.svelte';
	import JustChanged from '$lib/components/JustChanged.svelte';
</script>

<svelte:head>
	<title>Party-List Proportional Representation — How It Works</title>
	<meta
		name="description"
		content="A comprehensive guide to party-list proportional representation: open vs closed lists, electoral thresholds, D'Hondt vs Sainte-Laguë allocation, and where it is used around the world."
	/>
</svelte:head>

<section class="method-page">
	<header class="page-header">
		<h1>Party-List Proportional Representation</h1>
		<p class="lede">
			Party-list systems are the most common form of proportional representation worldwide. Voters
			choose a party, seats are divided in proportion to each party's vote share, and the details —
			open or closed lists, thresholds, allocation formulas — determine how much power voters have
			over which candidates actually take those seats.
		</p>
		<JustChanged destination="party-list" />
		<ComposeBadgeRow method="party-list" />
	</header>
	<div class="page-grid">
		<aside class="rail">
			<MethodNav current="party-list" />
		</aside>
		<div class="page-body">
			<PartyListSection />
			<SiblingStrip method="party-list" />
		</div>
	</div>
</section>

<style>
	.method-page { display: grid; gap: 2rem; }
	.page-header { display: grid; gap: 1rem; }
	.lede { font-size: 1.1rem; line-height: 1.7; margin: 0; }
	.page-grid { display: grid; gap: 1.5rem; }
	.page-body { display: grid; gap: 2rem; min-width: 0; }
	@media (min-width: 1024px) {
		.page-grid { grid-template-columns: 16rem minmax(0, 1fr); align-items: start; }
		.rail { position: sticky; top: 1rem; }
	}
</style>
