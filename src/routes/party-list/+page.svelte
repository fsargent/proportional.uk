<script lang="ts">
	import PartyListSection from '$lib/components/PartyListSection.svelte';
	import MethodNav from '$lib/components/MethodNav.svelte';
	import ComposeBadgeRow from '$lib/components/ComposeBadgeRow.svelte';
	import SiblingStrip from '$lib/components/SiblingStrip.svelte';
</script>

<svelte:head>
	<title>Party-List Proportional Representation — How It Works</title>
	<meta
		name="description"
		content="A comprehensive guide to party-list proportional representation: open vs closed lists, electoral thresholds, D'Hondt vs Sainte-Laguë allocation, and where it is used around the world."
	/>
</svelte:head>

<section class="method-page">
	<aside class="rail">
		<MethodNav current="party-list" />
	</aside>
	<div class="page-body">
		<header class="page-header">
			<h1>Party-List Proportional Representation</h1>
			<p class="lede">
				Party-list systems are the most common form of proportional representation worldwide. Voters
				choose a party, seats are divided in proportion to each party's vote share, and the details —
				open or closed lists, thresholds, allocation formulas — determine how much power voters have
				over which candidates actually take those seats.
			</p>
			<ComposeBadgeRow method="party-list" />
		</header>
		<PartyListSection />
		<SiblingStrip method="party-list" />
	</div>
</section>

<style>
	.method-page { display: grid; gap: 2rem; max-width: 54rem; margin: 0 auto; }
	.page-body { display: grid; gap: 2rem; min-width: 0; }
	.page-header { display: grid; gap: 1rem; }
	.lede { font-size: 1.1rem; line-height: 1.7; margin: 0; }
	.rail { display: none; }

	@media (min-width: 1280px) {
		.method-page {
			max-width: none;
			grid-template-columns: minmax(16rem, 1fr) minmax(0, 54rem) minmax(0, 1fr);
			column-gap: 2rem;
			align-items: start;
		}
		.rail { display: block; grid-column: 3; justify-self: start; width: 16rem; position: sticky; top: 1rem; }
		.page-body { grid-column: 2; }
	}
</style>
