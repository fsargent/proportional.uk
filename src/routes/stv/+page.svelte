<script lang="ts">
	import STVSection from '$lib/components/STVSection.svelte';
	import MethodNav from '$lib/components/MethodNav.svelte';
	import ComposeBadgeRow from '$lib/components/ComposeBadgeRow.svelte';
	import SiblingStrip from '$lib/components/SiblingStrip.svelte';
	import JustChanged from '$lib/components/JustChanged.svelte';
</script>

<svelte:head>
	<title>Single Transferable Vote for the UK</title>
	<meta name="description" content="Understand Single Transferable Vote, its strengths, its tradeoffs, and how it compares with approval-based multi-member systems." />
</svelte:head>

<section class="method-page">
	<aside class="rail">
		<MethodNav current="stv" />
	</aside>
	<div class="page-body">
		<header class="page-header">
			<h1>Single Transferable Vote: proportional, local, and more demanding on the ballot</h1>
			<p class="lede">
				Single Transferable Vote, usually shortened to STV, offers proportional representation without closed lists.
				The trade-off is also clear: it asks more of voters and more of the count.
			</p>
			<JustChanged destination="stv" />
			<ComposeBadgeRow method="stv" />
		</header>
		<STVSection />
		<SiblingStrip method="stv" />
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
		.rail { display: block; grid-column: 1; justify-self: end; width: 16rem; position: sticky; top: 1rem; }
		.page-body { grid-column: 2; }
	}
</style>
