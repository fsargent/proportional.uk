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
	<aside class="rail">
		<MethodNav current="ams-plus" />
	</aside>
	<div class="page-body">
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
		<AMSPlusSection />
		<SiblingStrip method="ams-plus" />
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
		.rail { display: block; grid-column: 1; justify-self: end; width: 16rem; position: sticky; top: 1rem; }
		.page-body { grid-column: 2; }
	}
</style>
