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
	<header class="page-header">
		<h1>Single Transferable Vote: proportional, local, and more demanding on the ballot</h1>
		<p class="lede">
			Single Transferable Vote, usually shortened to STV, offers proportional representation without closed lists.
			The trade-off is also clear: it asks more of voters and more of the count.
		</p>
		<JustChanged destination="stv" />
		<ComposeBadgeRow method="stv" />
	</header>
	<div class="page-grid">
		<aside class="rail">
			<MethodNav current="stv" />
		</aside>
		<div class="page-body">
			<STVSection />
			<SiblingStrip method="stv" />
		</div>
	</div>
</section>

<style>
	.method-page { display: grid; gap: 2rem; }
	.page-header { display: grid; gap: 1rem; }
	.lede { max-width: 52rem; font-size: 1.1rem; line-height: 1.7; margin: 0; }
	.page-grid { display: grid; gap: 1.5rem; }
	.page-body { display: grid; gap: 2rem; min-width: 0; }
	@media (min-width: 1024px) {
		.page-grid { grid-template-columns: 16rem minmax(0, 1fr); align-items: start; }
		.rail { position: sticky; top: 1rem; }
	}
</style>
