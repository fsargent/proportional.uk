<script lang="ts">
	import ProportionalApprovalSection from '$lib/components/ProportionalApprovalSection.svelte';
	import MethodNav from '$lib/components/MethodNav.svelte';
	import ComposeBadgeRow from '$lib/components/ComposeBadgeRow.svelte';
	import SiblingStrip from '$lib/components/SiblingStrip.svelte';
</script>

<svelte:head>
	<title>Proportional Approval for Westminster</title>
	<meta name="description" content="Explore a fully proportional Westminster built from approval ballots and multi-member districts." />
</svelte:head>

<section class="method-page">
	<aside class="rail">
		<MethodNav current="proportional-approval" />
	</aside>
	<div class="page-body">
		<header class="page-header">
			<h1>Proportional Approval: the cleanest fully proportional version</h1>
			<p class="lede">
				If you want to carry the simple approval ballot all the way through to a proportional Parliament,
				this is the destination. The price is not ballot complexity. It is the move to multi-member
				districts and the design choices that come with them.
			</p>
			<ComposeBadgeRow method="proportional-approval" />
		</header>
		<ProportionalApprovalSection />
		<SiblingStrip method="proportional-approval" />
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
