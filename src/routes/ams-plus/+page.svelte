<script lang="ts">
	import AMSPlusSection from '$lib/components/AMSPlusSection.svelte';
	import MethodNav from '$lib/components/MethodNav.svelte';
	import ComposeBadgeRow from '$lib/components/ComposeBadgeRow.svelte';
	import SiblingStrip from '$lib/components/SiblingStrip.svelte';
	import JustChanged from '$lib/components/JustChanged.svelte';
</script>

<svelte:head>
	<title>AMS+ for Westminster</title>
	<meta name="description" content="Explore AMS+: an approval-based mixed system that keeps local MPs and adds proportional representation." />
</svelte:head>

<section class="method-page">
	<header class="page-header">
		<h1>AMS+: the easiest proportional route from here</h1>
		<p class="lede">
			AMS+ keeps the mixed-member structure the UK already knows from Scotland and Wales, but replaces the
			local FPTP ballot with approval voting. That makes it the clearest near-term approval-based route to
			Westminster proportionality.
		</p>
		<JustChanged destination="ams-plus" />
		<ComposeBadgeRow method="ams-plus" />
	</header>
	<div class="page-grid">
		<aside class="rail">
			<MethodNav current="ams-plus" />
		</aside>
		<div class="page-body">
			<AMSPlusSection />
			<SiblingStrip method="ams-plus" />
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
