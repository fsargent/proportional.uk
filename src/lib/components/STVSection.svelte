<script lang="ts">
	import MethodSection from './MethodSection.svelte';
	import STVBallotDemo from './STVBallotDemo.svelte';
	import STVWorkedExample from './STVWorkedExample.svelte';
	import STVTradeoffs from './STVTradeoffs.svelte';
</script>

<MethodSection slot="mechanics">
	<STVBallotDemo />
</MethodSection>

<MethodSection slot="worked-example">
	<STVWorkedExample />
</MethodSection>

<MethodSection slot="strengths" customTitle="Where STV sits in the design space">
	<div class="summary-grid">
		<article class="summary-card">
			<h3>Ballot</h3>
			<p>Rank candidates in order of preference, usually 1, 2, 3, 4 and so on.</p>
		</article>
		<article class="summary-card">
			<h3>Districts</h3>
			<p>Needs <a href="/visualiser">multi-member districts</a>, which means district magnitude and geography matter a lot.</p>
		</article>
		<article class="summary-card">
			<h3>Allocation</h3>
			<p>Uses quotas, transfers, eliminations, and surplus distribution to turn rankings into seats.</p>
		</article>
		<article class="summary-card">
			<h3>Political appeal</h3>
			<p>Strong for reformers who want proportionality without party lists and who value candidate choice highly.</p>
		</article>
	</div>
</MethodSection>

<MethodSection slot="tradeoffs">
	<STVTradeoffs />
</MethodSection>

<!-- spine-slot:where-used absent: needs research -->
<!-- spine-slot:compares absent: nav links cover for now; deferred to comparison-block work -->
<!-- spine-slot:faq absent: no FAQ on this page yet -->
<!-- spine-slot:bottom-line absent: editorial-slant pass owns this -->

<style>
	.summary-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:1rem; }
	.summary-card {
		padding:1.25rem;
		border:1px solid var(--border-color);
		border-radius:var(--radius-md);
		background:var(--surface-raised);
		box-shadow:var(--shadow-soft);
	}
	.summary-card h3 { margin-top:0; }
</style>
