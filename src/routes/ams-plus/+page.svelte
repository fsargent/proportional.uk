<script lang="ts">
	import AMSPlusSection from '$lib/components/AMSPlusSection.svelte';
	import MethodNav from '$lib/components/MethodNav.svelte';
	import ComposeBadgeRow from '$lib/components/ComposeBadgeRow.svelte';
	import SiblingStrip from '$lib/components/SiblingStrip.svelte';
</script>

<svelte:head>
	<title>AMS+ for Westminster</title>
	<meta name="description" content="Explore AMS+: an approval-based mixed system that keeps local MPs and adds proportional representation." />
</svelte:head>

<section class="method-page">
	<h1>AMS+: the easiest proportional route from here</h1>
	<p class="lede">
		AMS+ keeps the mixed-member structure the UK already knows from Scotland and Wales, but replaces the
		local FPTP ballot with approval voting. That makes it the clearest near-term approval-based route to
		Westminster proportionality.
	</p>
	<ComposeBadgeRow method="ams-plus" />
	<MethodNav current="ams-plus" />
	<AMSPlusSection />
	<SiblingStrip method="ams-plus" />
</section>

<style>
	.method-page { display:grid; gap:2rem; }
	.lede { max-width: 52rem; font-size: 1.1rem; line-height: 1.7; margin: 0; }
</style>
