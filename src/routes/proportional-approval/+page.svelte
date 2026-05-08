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
	<h1>Proportional Approval: the cleanest fully proportional version</h1>
	<p class="lede">
		If you want to carry the simple approval ballot all the way through to a proportional Parliament,
		this is the destination. The price is not ballot complexity. It is the move to multi-member
		districts and the design choices that come with them.
	</p>
	<ComposeBadgeRow method="proportional-approval" />
	<MethodNav current="proportional-approval" />
	<ProportionalApprovalSection />
	<SiblingStrip method="proportional-approval" />
</section>

<style>
	.method-page { display:grid; gap:2rem; }
	.lede { max-width: 52rem; font-size: 1.1rem; line-height: 1.7; margin: 0; }
</style>
