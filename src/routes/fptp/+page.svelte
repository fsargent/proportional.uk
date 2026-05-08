<script lang="ts">
	import FPTPSection from '$lib/components/FPTPSection.svelte';
	import MethodNav from '$lib/components/MethodNav.svelte';
</script>

<svelte:head>
	<title>First Past the Post — How It Works and Why It Matters</title>
	<meta
		name="description"
		content="How First Past the Post works in the UK, why it produces the results it does, and the structural problems that have driven decades of reform debate."
	/>
</svelte:head>

<section class="method-page">
	<h1>First Past the Post</h1>
	<p class="lede">
		First Past the Post is the simplest way to run an election and the system Britain has used
		for centuries. One candidate wins each constituency, and you get one vote. That simplicity
		comes with trade-offs that grow more visible as the number of parties increases.
	</p>
	<MethodNav current="fptp" />
	<FPTPSection />
</section>

<style>
	.method-page { display: grid; gap: 2rem; }
	.lede { font-size: 1.1rem; line-height: 1.7; margin: 0; }
</style>
