<script lang="ts">
	import FPTPSection from '$lib/components/FPTPSection.svelte';
	import MethodNav from '$lib/components/MethodNav.svelte';
	import ComposeBadgeRow from '$lib/components/ComposeBadgeRow.svelte';
	import SiblingStrip from '$lib/components/SiblingStrip.svelte';
</script>

<svelte:head>
	<title>First Past the Post — How It Works and Why It Matters</title>
	<meta
		name="description"
		content="How First Past the Post works in the UK, why it produces the results it does, and the structural problems that have driven decades of reform debate."
	/>
</svelte:head>

<section class="method-page">
	<aside class="rail">
		<MethodNav current="fptp" />
	</aside>
	<div class="page-body">
		<header class="page-header">
			<h1>First Past the Post</h1>
			<p class="lede">
				First Past the Post is the simplest way to run an election and the system Britain has used
				for centuries. One candidate wins each constituency, and you get one vote. That simplicity
				comes with trade-offs that grow more visible as the number of parties increases.
			</p>
			<ComposeBadgeRow method="fptp" />
		</header>
		<FPTPSection />
		<SiblingStrip method="fptp" />
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
