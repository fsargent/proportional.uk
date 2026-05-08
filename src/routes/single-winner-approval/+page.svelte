<script lang="ts">
	import SingleWinnerApprovalSection from '$lib/components/SingleWinnerApprovalSection.svelte';
	import MethodNav from '$lib/components/MethodNav.svelte';
	import ComposeBadgeRow from '$lib/components/ComposeBadgeRow.svelte';
	import SiblingStrip from '$lib/components/SiblingStrip.svelte';
	import JustChanged from '$lib/components/JustChanged.svelte';
</script>

<svelte:head>
	<title>Single-Winner Approval for Westminster</title>
	<meta name="description" content="Explore the simplest approval-voting path for Westminster: one MP per constituency, but a better ballot." />
</svelte:head>

<section class="method-page">
	<header class="page-header">
		<h1>Single-Winner Approval: the smallest ballot fix</h1>
		<p class="lede">
			Keep one MP per constituency. Keep the familiar Westminster map. Change only the instruction on the
			ballot: approve every candidate you would genuinely be happy to elect.
		</p>
		<JustChanged destination="single-winner-approval" />
		<ComposeBadgeRow method="single-winner-approval" />
	</header>
	<div class="page-grid">
		<aside class="rail">
			<MethodNav current="single-winner-approval" />
		</aside>
		<div class="page-body">
			<SingleWinnerApprovalSection />
			<SiblingStrip method="single-winner-approval" />
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
