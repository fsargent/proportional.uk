<script lang="ts">
	import SingleWinnerApprovalSection from '$lib/components/SingleWinnerApprovalSection.svelte';
	import MethodNav from '$lib/components/MethodNav.svelte';
</script>

<svelte:head>
	<title>Single-Winner Approval for Westminster</title>
	<meta name="description" content="Explore the simplest approval-voting path for Westminster: one MP per constituency, but a better ballot." />
</svelte:head>

<section class="method-page">
	<h1>Single-Winner Approval: the smallest ballot fix</h1>
	<p class="lede">
		Keep one MP per constituency. Keep the familiar Westminster map. Change only the instruction on the
		ballot: approve every candidate you would genuinely be happy to elect.
	</p>
	<MethodNav current="single-winner-approval" />
	<SingleWinnerApprovalSection />
</section>

<style>
	.method-page { display:grid; gap:2rem; }
	.lede { max-width: 52rem; font-size: 1.1rem; line-height: 1.7; margin: 0; }
</style>
