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
	<aside class="rail">
		<MethodNav current="single-winner-approval" />
	</aside>
	<div class="page-body">
		<header class="page-header">
			<h1>Single-Winner Approval: the smallest ballot fix</h1>
			<p class="lede">
				Keep one MP per constituency. Keep the familiar Westminster map. Change only the instruction on the
				ballot: approve every candidate you would genuinely be happy to elect.
			</p>
			<JustChanged destination="single-winner-approval" />
			<ComposeBadgeRow method="single-winner-approval" />
		</header>
		<SingleWinnerApprovalSection />
		<SiblingStrip method="single-winner-approval" />
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
