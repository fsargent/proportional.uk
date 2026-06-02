<script lang="ts">
	import MethodPageBody from '$lib/components/MethodPageBody.svelte';
	import MethodNav from '$lib/components/MethodNav.svelte';
	import BenefitCard from '$lib/components/BenefitCard.svelte';

	const benefits = [
		{
			emoji: '🗳️',
			title: 'Rank your favourite first',
			description:
				'Put a small party or independent at the top without wasting your vote: if they are eliminated, your ballot transfers to your next choice. No more holding your nose for the "least-bad" candidate who can actually win.'
		},
		{
			emoji: '🔀',
			title: 'Ends classic vote-splitting',
			description:
				'When two similar candidates run, AV stops them splitting first preferences and handing the seat to a third the majority opposed — the Nader/Gore problem. (It does not protect a squeezed centrist — see the trade-offs.)'
		},
		{
			emoji: '🏛️',
			title: 'Keeps your local MP',
			description:
				'Single-member constituencies stay exactly as they are. You still have one named representative for your area.'
		},
		{
			emoji: '⬆️',
			title: 'Expressive and well tested',
			description:
				'Ranking 1-2-3 captures more than a single X, and AV is proven at scale: Australia has used it for its House for over a century, with a growing list of US cities and states.'
		}
	];
</script>

<svelte:head>
	<title>The Alternative Vote (AV / Ranked-Choice) — and why it isn't proportional</title>
	<meta
		name="description"
		content="What the Alternative Vote is, how instant-runoff counting works, why it removes the spoiler effect but does not make Parliament proportional, and what the 2011 UK referendum actually settled."
	/>
</svelte:head>

<section class="method-page">
	<aside class="rail">
		<MethodNav current="alternative-vote" />
	</aside>
	<div class="page-body">
		<MethodPageBody
			methodId="alternative-vote"
			title="The Alternative Vote: a better single winner, but not proportional"
		>
			{#snippet strengths()}
				<div class="card-stack">
					{#each benefits as benefit (benefit.title)}
						<BenefitCard emoji={benefit.emoji} title={benefit.title} description={benefit.description} />
					{/each}
				</div>
			{/snippet}

			{#snippet tradeoffs()}
				<div class="card-stack">
					<article class="con-card">
						<h4>Not proportional</h4>
						<p>
							AV elects one winner per seat, so national seat shares can still diverge sharply from
							votes. Australia's AV-elected House of Representatives has stayed a two-party chamber for
							over a century. This is the decisive limitation — and the reason AV is not on this site's
							proportional shortlist.
						</p>
					</article>
					<article class="con-card">
						<h4>Center squeeze — the spoiler that remains</h4>
						<p>
							AV is not a Condorcet method. A broadly-liked centrist can be eliminated early simply
							because too few voters rank them <em>first</em>, even when they would beat every rival in a
							head-to-head. That is a real spoiler effect — just a different one from First Past the
							Post's vote-splitting. (AV can also be non-monotonic: in rare cases, ranking a candidate
							higher actually makes them lose.)
						</p>
					</article>
					<article class="con-card">
						<h4>The "majority" is manufactured</h4>
						<p>
							AV's winner only crosses 50% after other candidates are eliminated and exhausted ballots
							are set aside. It builds a majority from the ballots still in play — it cannot conjure
							majority support that was never there. In some real elections, exhausted ballots have
							outnumbered the winner's eventual margin.
						</p>
					</article>
					<article class="con-card">
						<h4>The system rejected in 2011</h4>
						<p>
							UK voters turned AV down 67.9% to 32.1% in the 2011 referendum. Any AV proposal has to win
							back an argument the public has already heard — and "too complicated" was the message that
							beat it. Crucially, that vote was about AV, not about proportional representation.
						</p>
					</article>
				</div>
			{/snippet}
		</MethodPageBody>
	</div>
</section>

<style>
	.method-page { display: grid; gap: 2rem; max-width: 54rem; margin: 0 auto; }
	.page-body { display: grid; gap: 2rem; min-width: 0; }
	.rail { display: none; }

	/* Single-column card stack — cards never sit two-up. */
	.card-stack {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	.con-card {
		background: var(--surface-subtle-gradient);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		padding: 1.25rem;
		box-shadow: var(--shadow-soft);
	}

	.con-card h4 {
		margin: 0 0 0.5rem;
		color: var(--accent-text);
		font-size: 1.1rem;
	}

	.con-card p {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.65;
	}

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
