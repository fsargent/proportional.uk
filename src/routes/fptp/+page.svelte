<script lang="ts">
	import FPTPSection from '$lib/components/FPTPSection.svelte';
	import MethodNav from '$lib/components/MethodNav.svelte';
	import ComposeBadgeRow from '$lib/components/ComposeBadgeRow.svelte';
	import SiblingStrip from '$lib/components/SiblingStrip.svelte';
	import JustChanged from '$lib/components/JustChanged.svelte';
</script>

<svelte:head>
	<title>First Past the Post — How It Works and Why It Matters</title>
	<meta
		name="description"
		content="How First Past the Post works in the UK, why it produces the results it does, and the structural problems that have driven decades of reform debate."
	/>
</svelte:head>

<section class="method-page">
	<header class="page-header">
		<h1>First Past the Post</h1>
		<p class="lede">
			First Past the Post is the simplest way to run an election and the system Britain has used
			for centuries. One candidate wins each constituency, and you get one vote. That simplicity
			comes with trade-offs that grow more visible as the number of parties increases.
		</p>
		<JustChanged destination="fptp" />
		<ComposeBadgeRow method="fptp" />
	</header>
	<div class="page-grid">
		<aside class="rail">
			<MethodNav current="fptp" />
		</aside>
		<div class="page-body">
			<FPTPSection />
			<SiblingStrip method="fptp" />
		</div>
	</div>
</section>

<style>
	.method-page { display: grid; gap: 2rem; }
	.page-header { display: grid; gap: 1rem; }
	.lede { font-size: 1.1rem; line-height: 1.7; margin: 0; }
	.page-grid { display: grid; gap: 1.5rem; }
	.page-body { display: grid; gap: 2rem; min-width: 0; }
	@media (min-width: 1024px) {
		.page-grid { grid-template-columns: 16rem minmax(0, 1fr); align-items: start; }
		.rail { position: sticky; top: 1rem; }
	}
</style>
