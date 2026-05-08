<script lang="ts">
	import ProportionalApprovalSection from '$lib/components/ProportionalApprovalSection.svelte';
	import MethodNav from '$lib/components/MethodNav.svelte';
	import ComposeBadgeRow from '$lib/components/ComposeBadgeRow.svelte';
	import SiblingStrip from '$lib/components/SiblingStrip.svelte';
	import JustChanged from '$lib/components/JustChanged.svelte';
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
			<JustChanged destination="proportional-approval" />
			<ComposeBadgeRow method="proportional-approval" />
		</header>
		<ProportionalApprovalSection />
		<SiblingStrip method="proportional-approval" />
	</div>
</section>

<style>
	.method-page { display: grid; gap: 2rem; }
	.page-body { display: grid; gap: 2rem; min-width: 0; }
	.page-header { display: grid; gap: 1rem; }
	.lede { max-width: 52rem; font-size: 1.1rem; line-height: 1.7; margin: 0; }

	@media (min-width: 1500px) {
		.method-page {
			grid-template-columns: 16rem minmax(0, 1fr);
			column-gap: 2rem;
			align-items: start;
		}
		.rail { position: sticky; top: 1rem; }
	}
</style>
