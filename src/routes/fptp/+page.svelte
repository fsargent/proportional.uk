<script lang="ts">
	import FPTPSection from '$lib/components/FPTPSection.svelte';
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
	<nav class="method-links" aria-label="Method links">
		<a href="/">← Back to overview</a>
		<a href="/single-winner-approval">Compare with Approval Voting</a>
		<a href="/stv">Compare with the Single Transferable Vote →</a>
	</nav>
	<FPTPSection />
</section>

<style>
	.method-page { display: grid; gap: 2rem; }
	.lede { font-size: 1.1rem; line-height: 1.7; margin: 0; }
	.method-links { display: flex; flex-wrap: wrap; gap: 1rem; }
	.method-links a { color: var(--link-color); text-decoration: none; font-weight: 600; }
	.method-links a:hover { text-decoration: underline; }
</style>
