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
				'When two similar candidates run, the Alternative Vote stops them splitting first preferences and handing the seat to a third the majority opposed — the Nader/Gore problem. (It does not protect a squeezed centrist — see the trade-offs.)'
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
				'Ranking 1-2-3 captures more than a single X, and the Alternative Vote is proven at scale: Australia has used it for its House for over a century, with a growing list of US cities and states.'
		}
	];

	// --- "How you vote": interactive ranked-ballot demo -------------------------
	const ballotCandidates = [
		{ id: 'av-d1', name: 'Sarah Johnson', party: 'Labour' },
		{ id: 'av-d2', name: 'James Mitchell', party: 'Conservative' },
		{ id: 'av-d3', name: 'Emma Williams', party: 'Liberal Democrats' },
		{ id: 'av-d4', name: 'David Chen', party: 'Green' },
		{ id: 'av-d5', name: 'Aisha Patel', party: 'Independent' }
	];
	let ranks = $state<Record<string, number>>({});
	const rankedCount = $derived(Object.keys(ranks).length);
	function toggleRank(id: string) {
		if (ranks[id]) {
			// Un-rank this candidate and close the gap in the ordering.
			const removed = ranks[id];
			const next: Record<string, number> = {};
			for (const [k, v] of Object.entries(ranks)) {
				if (k === id) continue;
				next[k] = v > removed ? v - 1 : v;
			}
			ranks = next;
		} else {
			ranks = { ...ranks, [id]: rankedCount + 1 };
		}
	}
	function resetRanks() {
		ranks = {};
	}

	// --- Worked example: instant-runoff over a small electorate ------------------
	// Deliberately a center-squeeze case: the centrist would beat both rivals
	// one-to-one, yet is eliminated first for too few first preferences.
	type AvCand = { id: string; name: string; lean: string; colour: string };
	const avCands: AvCand[] = [
		{ id: 'L', name: 'Lena Park', lean: 'Left', colour: '#d62728' },
		{ id: 'C', name: 'Chris Bell', lean: 'Centre', colour: '#7a4d2f' },
		{ id: 'R', name: 'Rosa Quinn', lean: 'Right', colour: '#1f77b4' }
	];
	const avGroups: { id: string; count: number; ranking: string[] }[] = [
		{ id: 'A', count: 40, ranking: ['L', 'C', 'R'] },
		{ id: 'B', count: 35, ranking: ['R', 'C', 'L'] },
		{ id: 'C1', count: 15, ranking: ['C', 'L', 'R'] },
		{ id: 'C2', count: 10, ranking: ['C', 'R', 'L'] }
	];
	const avTotal = avGroups.reduce((s, g) => s + g.count, 0);

	type AvRound = {
		tally: { id: string; votes: number }[];
		continuing: number;
		eliminated: string | null; // who gets eliminated AFTER this round
		winner: string | null;
	};

	function computeIRV(): AvRound[] {
		const rounds: AvRound[] = [];
		const out = new Set<string>();
		// guard against infinite loops
		for (let safety = 0; safety < avCands.length; safety++) {
			const counts: Record<string, number> = {};
			avCands.forEach((c) => {
				if (!out.has(c.id)) counts[c.id] = 0;
			});
			for (const g of avGroups) {
				const choice = g.ranking.find((id) => !out.has(id));
				if (choice) counts[choice] += g.count;
			}
			const continuing = Object.values(counts).reduce((s, n) => s + n, 0);
			const tally = Object.entries(counts)
				.map(([id, votes]) => ({ id, votes }))
				.sort((a, b) => b.votes - a.votes || a.id.localeCompare(b.id));
			const leader = tally[0];
			const winner = leader.votes > continuing / 2 ? leader.id : null;
			let eliminated: string | null = null;
			if (!winner) {
				eliminated = tally[tally.length - 1].id;
				out.add(eliminated);
			}
			rounds.push({ tally, continuing, eliminated, winner });
			if (winner) break;
		}
		return rounds;
	}
	const avRounds = computeIRV();
	const avCand = (id: string) => avCands.find((c) => c.id === id)!;

	let roundIdx = $state(0);
	const round = $derived(avRounds[roundIdx]);
	const maxVotes = $derived(Math.max(...round.tally.map((t) => t.votes)));
</script>

<svelte:head>
	<title>The Alternative Vote (Ranked-Choice / Instant-Runoff) — and why it isn't proportional</title>
	<meta
		name="description"
		content="What the Alternative Vote is, how instant-runoff counting works, why it ends classic vote-splitting but is not proportional and not a Condorcet method, and what the 2011 UK referendum actually settled."
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
			{#snippet mechanics()}
				<p class="intro-text">
					You get one ballot in a single-member seat — but instead of one X, you rank the candidates
					in order: 1 for your favourite, 2 for your next, and so on. You can rank as few or as many as
					you like. The count then eliminates the lowest candidate and transfers their ballots to the
					next-ranked name still in the race, repeating until one candidate holds more than half of the
					ballots still in play.
				</p>

				<h3 class="subsection-header">How you vote</h3>
				<div class="rank-demo">
					<div class="rank-ballot">
						<p class="rank-instruction">Tap candidates in your order of preference:</p>
						<ul class="rank-list">
							{#each ballotCandidates as c (c.id)}
								<li>
									<button
										type="button"
										class="rank-row"
										class:ranked={!!ranks[c.id]}
										aria-pressed={!!ranks[c.id]}
										onclick={() => toggleRank(c.id)}
									>
										<span class="rank-badge" aria-hidden="true">{ranks[c.id] ?? ''}</span>
										<span class="rank-copy">
											<span class="rank-name">{c.name}</span>
											<span class="rank-party">{c.party}</span>
										</span>
										<span class="rank-state">
											{ranks[c.id] ? `Preference ${ranks[c.id]}` : 'Tap to rank'}
										</span>
									</button>
								</li>
							{/each}
						</ul>
						<div class="rank-foot">
							{#if rankedCount === 0}
								<p>Rank at least your first choice. Unranked candidates simply get no preference.</p>
							{:else}
								<p>You've ranked <strong>{rankedCount}</strong> of {ballotCandidates.length}.</p>
								<button type="button" class="rank-reset" onclick={resetRanks}>Reset</button>
							{/if}
						</div>
					</div>
					<p class="rank-aside">
						There's no penalty for ranking honestly: a lower preference is only ever consulted if every
						candidate you ranked above them is already eliminated. Ranking a backup can never hurt your
						favourite.
					</p>
				</div>
			{/snippet}

			{#snippet workedExample()}
				<p class="intro-text">
					Here is the count in motion — one seat, 100 voters, three candidates. Watch how the centre
					gets squeezed out even though most voters are happy with them.
				</p>

				<div class="irv">
					<div class="irv-groups">
						{#each avGroups as g (g.id)}
							<div class="irv-group">
								<strong>{g.count} voters</strong>
								<span class="irv-ranking">
									{#each g.ranking as id, i (id)}
										<span class="irv-pref" style="--c:{avCand(id).colour}">{i + 1}. {avCand(id).name}</span>
									{/each}
								</span>
							</div>
						{/each}
					</div>

					<div class="irv-count">
						<div class="irv-roundhead">
							<span class="irv-round-tag">Round {roundIdx + 1} of {avRounds.length}</span>
							<span class="irv-threshold">Majority of continuing ballots = more than {round.continuing / 2}</span>
						</div>

						<ul class="irv-bars">
							{#each round.tally as t (t.id)}
								{@const c = avCand(t.id)}
								{@const isWinner = round.winner === t.id}
								{@const isElim = round.eliminated === t.id}
								<li class:winner={isWinner} class:elim={isElim}>
									<span class="irv-name">
										{c.name}<small>{c.lean}</small>
									</span>
									<span class="irv-bar">
										<span class="irv-bar-fill" style="width:{(t.votes / maxVotes) * 100}%; background:{c.colour}"></span>
									</span>
									<span class="irv-val">
										{t.votes}{isWinner ? ' ✓' : ''}{isElim ? ' ✗' : ''}
									</span>
								</li>
							{/each}
						</ul>

						<p class="irv-note">
							{#if round.winner}
								<strong>{avCand(round.winner).name} wins</strong> with {round.tally[0].votes} of
								{round.continuing} continuing ballots — a majority of the ballots still in play, not of
								all 100 voters.
							{:else if round.eliminated}
								No candidate has a majority. <strong>{avCand(round.eliminated).name}</strong>
								({avCand(round.eliminated).lean}) is lowest and is eliminated; those ballots transfer to
								each voter's next choice.
							{/if}
						</p>

						<div class="irv-controls">
							<button type="button" onclick={() => (roundIdx = Math.max(0, roundIdx - 1))} disabled={roundIdx === 0}>
								← Previous round
							</button>
							<button
								type="button"
								onclick={() => (roundIdx = Math.min(avRounds.length - 1, roundIdx + 1))}
								disabled={roundIdx === avRounds.length - 1}
							>
								Next round →
							</button>
						</div>
					</div>

					<div class="irv-squeeze">
						<h4>This is center squeeze</h4>
						<p>
							Chris Bell (Centre) is the second choice of nearly everyone and would beat both Lena and
							Rosa one-to-one — yet they are eliminated in the very first round for too few
							<em>first</em> preferences. The Alternative Vote is not a <a href="https://en.wikipedia.org/wiki/Condorcet_method" target="_blank" rel="noopener">Condorcet method</a>: it can pass over the candidate
							most voters actually prefer. That is a real spoiler effect, just a different one from First
							Past the Post's.
						</p>
					</div>
				</div>
			{/snippet}

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
							The Alternative Vote elects one winner per seat, so national seat shares can still diverge
							sharply from votes. Australia's House of Representatives, elected this way for over a
							century, has stayed a two-party chamber. This is the decisive limitation — and the reason
							the Alternative Vote is not on this site's proportional shortlist.
						</p>
					</article>
					<article class="con-card">
						<h4>Center squeeze — the spoiler that remains</h4>
						<p>
							The Alternative Vote is not a <a href="https://en.wikipedia.org/wiki/Condorcet_method" target="_blank" rel="noopener">Condorcet method</a>. A broadly-liked centrist can be eliminated early simply
							because too few voters rank them <em>first</em>, even when they would beat every rival in a
							head-to-head. That is a real spoiler effect — just a different one from First Past the
							Post's vote-splitting. (The Alternative Vote can also be non-monotonic: in rare cases, ranking a candidate
							higher actually makes them lose.)
						</p>
					</article>
					<article class="con-card">
						<h4>The "majority" is manufactured</h4>
						<p>
							The Alternative Vote's winner only crosses 50% after other candidates are eliminated and exhausted ballots
							are set aside. It builds a majority from the ballots still in play — it cannot conjure
							majority support that was never there. In some real elections, exhausted ballots have
							outnumbered the winner's eventual margin.
						</p>
					</article>
					<article class="con-card">
						<h4>The system rejected in 2011</h4>
						<p>
							UK voters turned the Alternative Vote down 67.9% to 32.1% in the 2011 referendum. Any
							Alternative Vote proposal has to win back an argument the public has already heard — and
							"too complicated" was the message that beat it. Crucially, that vote was about the
							Alternative Vote, not about proportional representation.
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

	.intro-text { font-size: 1.1rem; line-height: 1.7; max-width: 800px; }

	.subsection-header {
		font-size: 1.4rem;
		color: var(--text-dark);
		margin: 1.5rem 0 1rem 0;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid var(--border-color);
	}

	/* Single-column card stack — cards never sit two-up. */
	.card-stack { display: grid; grid-template-columns: 1fr; gap: 1rem; }

	.con-card {
		background: var(--surface-subtle-gradient);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		padding: 1.25rem;
		box-shadow: var(--shadow-soft);
	}
	.con-card h4 { margin: 0 0 0.5rem; color: var(--accent-text); font-size: 1.1rem; }
	.con-card p { margin: 0; font-size: 0.95rem; line-height: 1.65; }

	/* ===== Ranked-ballot demo ===== */
	.rank-demo {
		display: grid;
		gap: 1rem;
		grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
		align-items: start;
	}
	.rank-ballot {
		background: var(--surface-subtle-gradient);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		padding: 1.25rem;
		box-shadow: var(--shadow-soft);
	}
	.rank-instruction { margin: 0 0 0.85rem; font-weight: 600; color: var(--accent-text); }
	.rank-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5rem; }
	.rank-row {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.85rem;
		padding: 0.6rem 0.75rem;
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
		background: var(--surface-color);
		font: inherit;
		text-align: left;
		cursor: pointer;
		transition: border-color 0.15s ease, background-color 0.15s ease;
	}
	.rank-row:hover { border-color: var(--border-strong); background: var(--field-hover); }
	.rank-row.ranked { border-color: var(--accent-border-strong); background: var(--surface-info-gradient); }
	.rank-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.9rem;
		height: 1.9rem;
		flex-shrink: 0;
		border-radius: 999px;
		border: 1.5px solid var(--border-strong);
		font-weight: 700;
		color: var(--accent-text);
		background: var(--surface-color);
	}
	.rank-row.ranked .rank-badge { background: var(--header-bg); color: var(--text-inverse); border-color: transparent; }
	.rank-copy { display: flex; flex-direction: column; flex: 1; min-width: 0; }
	.rank-name { font-weight: 600; color: var(--text-dark); }
	.rank-party { font-size: 0.83rem; color: var(--text-soft); }
	.rank-state { font-size: 0.8rem; color: var(--text-soft); white-space: nowrap; }
	.rank-foot { margin-top: 0.85rem; display: flex; align-items: center; gap: 0.85rem; }
	.rank-foot p { margin: 0; font-size: 0.9rem; color: var(--text-color); }
	.rank-reset {
		font: inherit;
		font-size: 0.83rem;
		padding: 0.25rem 0.7rem;
		border-radius: 999px;
		border: 1px solid var(--border-color);
		background: var(--surface-color);
		cursor: pointer;
	}
	.rank-aside { margin: 0; font-size: 0.95rem; line-height: 1.6; color: var(--text-color); }

	/* ===== Instant-runoff worked example ===== */
	.irv { display: grid; gap: 1rem; }
	.irv-groups { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.6rem; }
	.irv-group {
		padding: 0.6rem 0.8rem;
		background: var(--surface-color);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
		display: grid;
		gap: 0.3rem;
	}
	.irv-group > strong { font-size: 0.9rem; }
	.irv-ranking { display: flex; flex-direction: column; gap: 0.1rem; }
	.irv-pref { font-size: 0.8rem; color: var(--text-color); border-left: 3px solid var(--c); padding-left: 0.4rem; }

	.irv-count {
		padding: 1.25rem;
		background: var(--surface-subtle-gradient);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-soft);
		display: grid;
		gap: 0.85rem;
	}
	.irv-roundhead { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 0.4rem; }
	.irv-round-tag {
		background: var(--header-bg);
		color: var(--text-inverse);
		padding: 0.15rem 0.6rem;
		border-radius: 999px;
		font-size: 0.74rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	.irv-threshold { font-size: 0.83rem; color: var(--text-soft); }
	.irv-bars { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.4rem; }
	.irv-bars li {
		display: grid;
		grid-template-columns: 9rem 1fr 3.5rem;
		align-items: center;
		gap: 0.6rem;
		padding: 0.3rem 0.5rem;
		border-radius: var(--radius-sm);
	}
	.irv-bars li.winner { background: var(--highlight-bg, rgba(45,122,89,0.12)); font-weight: 600; }
	.irv-bars li.elim { opacity: 0.55; }
	.irv-name { display: flex; flex-direction: column; color: var(--text-dark); min-width: 0; }
	.irv-name small { color: var(--text-soft); font-size: 0.72rem; font-weight: 400; }
	.irv-bar { height: 14px; background: var(--surface-color); border: 1px solid var(--border-color); border-radius: 999px; overflow: hidden; }
	.irv-bar-fill { display: block; height: 100%; border-radius: 999px; transition: width 0.3s ease; }
	.irv-val { font-variant-numeric: tabular-nums; text-align: right; color: var(--text-dark); }
	.irv-note { margin: 0; font-size: 0.92rem; line-height: 1.6; color: var(--text-color); }
	.irv-controls { display: flex; gap: 0.6rem; }
	.irv-controls button {
		font: inherit;
		font-weight: 600;
		padding: 0.45rem 0.9rem;
		border-radius: var(--radius-sm);
		border: 1px solid var(--border-color);
		background: var(--surface-color);
		cursor: pointer;
	}
	.irv-controls button:disabled { opacity: 0.4; cursor: default; }
	.irv-controls button:not(:disabled):hover { border-color: var(--accent-border-strong); }

	.irv-squeeze {
		padding: 1rem 1.25rem;
		border: 1px solid var(--accent-border);
		border-left-width: 4px;
		border-left-color: var(--accent-text);
		border-radius: var(--radius-md);
		background: var(--surface-emphasis);
	}
	.irv-squeeze h4 { margin: 0 0 0.4rem; color: var(--text-dark); }
	.irv-squeeze p { margin: 0; font-size: 0.95rem; line-height: 1.6; }

	@media (max-width: 768px) {
		.rank-demo { grid-template-columns: 1fr; }
		.irv-bars li { grid-template-columns: 7rem 1fr 3rem; }
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
