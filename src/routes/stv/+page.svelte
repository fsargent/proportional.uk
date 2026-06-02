<script lang="ts">
	import MethodPageBody from '$lib/components/MethodPageBody.svelte';
	import MethodNav from '$lib/components/MethodNav.svelte';
	import STVBallotDemo from '$lib/components/STVBallotDemo.svelte';
	import STVWorkedExample from '$lib/components/STVWorkedExample.svelte';
	import STVTradeoffs from '$lib/components/STVTradeoffs.svelte';
	import FAQItem from '$lib/components/FAQItem.svelte';
</script>

<svelte:head>
	<title>Single Transferable Vote for the UK</title>
	<meta name="description" content="Understand Single Transferable Vote, its strengths, its tradeoffs, and how it compares with approval-based multi-member systems." />
</svelte:head>

<section class="method-page">
	<aside class="rail">
		<MethodNav current="stv" />
	</aside>
	<div class="page-body">
		<MethodPageBody
			methodId="stv"
			title="Single Transferable Vote: proportional, local, and more demanding on the ballot"
		>
			{#snippet mechanics()}
				<STVBallotDemo />
			{/snippet}

			{#snippet workedExample()}
				<STVWorkedExample />
			{/snippet}

			<!-- strengths: no override — renders data-driven strengthHeadlines from
			     methods.ts. Placeholder copy for now; enrich in the copy pass to
			     balance the depth of the Trade-offs section below. -->

			{#snippet tradeoffs()}
				<STVTradeoffs />
			{/snippet}

			{#snippet faq()}
				<FAQItem question="Didn't we already decide this in 2011?">
					<p>
						In May 2011, voters were asked whether to replace First Past the Post with the
						<a
							href="https://en.wikipedia.org/wiki/2011_United_Kingdom_Alternative_Vote_referendum"
							target="_blank"
							rel="noopener noreferrer">Alternative Vote</a
						>
						— a single-winner ranked ballot, the simplest version of "rank candidates" that exists. It
						was rejected <strong>67.9% to 32.1%</strong> in a national referendum. Turnout was 42%.
					</p>
					<p>
						This is the strongest political objection to STV in the UK, and it is not abstract. The
						country has been asked, recently, whether ranking candidates is acceptable — and the answer
						was a landslide no, with "too complicated" the dominant message of the Yes side's defeat.
						Any STV campaign would have to win that argument back, against opponents who can simply
						point to 2011.
					</p>
					<p>
						This matters most when a simpler proportional alternative exists.
						<a href="/proportional-approval">Proportional Approval</a> uses a tick-box ballot that asks
						no more of voters than today's, and reaches the same proportional Parliament. The case for
						STV has to be made not just against the status quo, but against an approval-based path that
						has none of ranking's political baggage.
					</p>
				</FAQItem>
			{/snippet}
		</MethodPageBody>
	</div>
</section>

<style>
	.method-page { display: grid; gap: 2rem; max-width: 54rem; margin: 0 auto; }
	.page-body { display: grid; gap: 2rem; min-width: 0; }
	.rail { display: none; }

	@media (min-width: 1280px) {
		.method-page {
			max-width: none;
			grid-template-columns: minmax(16rem, 1fr) minmax(0, 54rem) minmax(0, 1fr);
			column-gap: 2rem;
			align-items: start;
		}
		.rail { display: block; grid-column: 3; grid-row: 1; justify-self: start; width: 16rem; position: sticky; top: 1rem; }
		.page-body { grid-column: 2; grid-row: 1; }
	}
</style>
