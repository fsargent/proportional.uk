<script lang="ts">
	import STVSection from '$lib/components/STVSection.svelte';
	import MethodNav from '$lib/components/MethodNav.svelte';
	import ComposeBadgeRow from '$lib/components/ComposeBadgeRow.svelte';
	import SiblingStrip from '$lib/components/SiblingStrip.svelte';
</script>

<svelte:head>
	<title>Single Transferable Vote for the UK</title>
	<meta name="description" content="Understand Single Transferable Vote, its strengths, its tradeoffs, and how it compares with approval-based multi-member systems." />
</svelte:head>

<section class="method-page">
	<h1>Single Transferable Vote: proportional, local, and more demanding on the ballot</h1>
	<p class="lede">
		Single Transferable Vote, usually shortened to STV, offers proportional representation without closed lists.
		The trade-off is also clear: it asks more of voters and more of the count.
	</p>
	<ComposeBadgeRow method="stv" />
	<MethodNav current="stv" />
	<STVSection />
	<SiblingStrip method="stv" />
</section>

<style>
	.method-page { display:grid; gap:2rem; }
	.lede { max-width: 52rem; font-size: 1.1rem; line-height: 1.7; margin: 0; }
</style>
