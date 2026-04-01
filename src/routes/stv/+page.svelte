<script lang="ts">
	import RankingProblems from '$lib/components/RankingProblems.svelte';
</script>

<svelte:head>
	<title>STV for the UK</title>
	<meta name="description" content="Understand STV, its strengths, its tradeoffs, and how it compares with approval-based multi-member systems." />
</svelte:head>

<section class="method-page">
	<p class="eyebrow">Serious comparator</p>
	<h1>STV: proportional, local, and more demanding on the ballot</h1>
	<p class="lede">
		STV is one of the strongest and most important reform options in British politics. If Westminster ever
		moves to multi-member districts, STV will be one of the first systems many reformers reach for.
	</p>
	<p class="lede">
		Its big strength is clear: it offers proportional representation without closed lists. Its big tradeoff
		is also clear: it asks more of voters and more of the count.
	</p>

	<nav class="method-links" aria-label="Method links">
		<a href="/">← Back to overview</a>
		<a href="/visualiser">Open district visualiser</a>
		<a href="/proportional-approval">Compare with Proportional Approval →</a>
	</nav>

	<RankingProblems showMMP={false} />

	<section class="page-section">
		<h2 class="section-header">Where STV sits in the design space</h2>
		<div class="summary-grid">
			<article class="summary-card">
				<h3>Ballot</h3>
				<p>Rank candidates in order of preference.</p>
			</article>
			<article class="summary-card">
				<h3>Districts</h3>
				<p>Needs multi-member districts, which means district magnitude and geography matter a lot.</p>
			</article>
			<article class="summary-card">
				<h3>Allocation</h3>
				<p>Uses transfers as candidates are elected or eliminated, which helps fairness but adds opacity.</p>
			</article>
		</div>
	</section>
</section>

<style>
	.method-page { display:grid; gap:2rem; }
	.eyebrow { margin:0; color:var(--accent-text); font-weight:700; text-transform:uppercase; letter-spacing:.05em; }
	.lede { max-width: 52rem; font-size: 1.1rem; line-height: 1.7; margin: 0; }
	.method-links { display:flex; flex-wrap:wrap; gap:1rem; }
	.method-links a { color: var(--link-color); text-decoration:none; font-weight:600; }
	.method-links a:hover { text-decoration:underline; }
	.page-section { display:grid; gap:1rem; }
	.summary-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:1rem; }
	.summary-card { padding:1.2rem; border:1px solid var(--border-color); border-radius:var(--radius-md); background:var(--surface-raised); box-shadow:var(--shadow-soft); }
	.summary-card h3 { margin-top:0; }
</style>
