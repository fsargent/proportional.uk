<script lang="ts">
	import RankingProblems from '$lib/components/RankingProblems.svelte';

	type Candidate = {
		id: string;
		name: string;
		party: string;
		description: string;
	};

	const candidates: Candidate[] = [
		{
			id: 'stv-1',
			name: 'Alice Morgan',
			party: 'Labour',
			description: 'Centre-left local campaigner with strong neighbourhood profile'
		},
		{
			id: 'stv-2',
			name: 'Ben Clarke',
			party: 'Conservative',
			description: 'Traditional conservative candidate with a safe-core vote'
		},
		{
			id: 'stv-3',
			name: 'Chloe Rahman',
			party: 'Liberal Democrats',
			description: 'Cross-party appeal candidate with moderate local base'
		},
		{
			id: 'stv-4',
			name: 'Daniel Okoro',
			party: 'Green',
			description: 'Environment-first candidate with loyal issue-based support'
		},
		{
			id: 'stv-5',
			name: 'Ella Hughes',
			party: 'Independent',
			description: 'Popular independent focused on local services and planning'
		}
	];

	const rankChoices = [1, 2, 3, 4, 5];
	let rankings = $state<Record<string, number | null>>({});

	function assignedCandidate(rank: number) {
		return candidates.find((candidate) => rankings[candidate.id] === rank);
	}

	function setRank(candidateId: string, rank: number) {
		const currentHolder = assignedCandidate(rank);
		if (currentHolder && currentHolder.id !== candidateId) {
			rankings[currentHolder.id] = null;
		}

		rankings[candidateId] = rankings[candidateId] === rank ? null : rank;
	}

	function clearBallot() {
		rankings = {};
	}

	const rankedCandidates = $derived(
		[...candidates]
			.filter((candidate) => rankings[candidate.id] != null)
			.sort((a, b) => (rankings[a.id] ?? 999) - (rankings[b.id] ?? 999))
	);

	const rankedCount = $derived(rankedCandidates.length);
	const nextRank = $derived(rankedCount < candidates.length ? rankedCount + 1 : null);
	const hasGaps = $derived(
		rankedCount > 0 &&
			rankChoices
				.slice(0, rankedCount)
				.some((rank) => !candidates.some((candidate) => rankings[candidate.id] === rank))
	);

	const firstChoice = $derived(rankedCandidates[0] ?? null);
	const secondChoice = $derived(rankedCandidates[1] ?? null);
	const transferPreview = $derived(
		firstChoice && secondChoice
			? `If ${firstChoice.name} is eliminated or elected with surplus, your vote can continue to ${secondChoice.name}.`
			: 'Add a second preference to see how transfers continue your ballot if your first choice cannot use your full vote.'
	);
</script>

<svelte:head>
	<title>STV for the UK</title>
	<meta name="description" content="Understand STV, its strengths, its tradeoffs, and how it compares with approval-based multi-member systems." />
</svelte:head>

<section class="method-page">
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

	<section class="interactive-section" aria-labelledby="stv-demo-title">
		<div class="section-copy">
			<h2 id="stv-demo-title" class="section-header">Try an STV ballot</h2>
			<p class="intro-text">
				An STV ballot asks you to put candidates in order: 1 for your favourite, 2 for your next choice,
				and so on. That is perfectly workable, but it is a meaningfully bigger ask than simply ticking every
				candidate you find acceptable.
			</p>
			<p class="intro-text">
				Click the rank buttons below to build a ballot. As you do, the explanation panel updates to show
				what your ranking means and how transfers work.
			</p>
		</div>

		<div class="demo-grid">
			<div class="ballot-panel">
				<div class="panel-header">
					<h3>Your STV ballot</h3>
					<button type="button" class="ghost-button" onclick={clearBallot}>Clear ballot</button>
				</div>
				<p class="ballot-instruction">Give candidates numbers in the order you prefer them.</p>

				<div class="candidate-list">
					{#each candidates as candidate (candidate.id)}
						<div class="candidate-row">
							<div class="candidate-main">
								<div class="rank-badge" aria-label={rankings[candidate.id] ? `Rank ${rankings[candidate.id]}` : 'Unranked'}>
									{rankings[candidate.id] ?? '–'}
								</div>
								<div class="candidate-copy">
									<div class="candidate-line">
										<span class="candidate-name">{candidate.name}</span>
										<span class="candidate-party">{candidate.party}</span>
									</div>
									<p>{candidate.description}</p>
								</div>
							</div>
							<div class="rank-controls" aria-label={`Rank ${candidate.name}`}>
								{#each rankChoices as rank}
									<button
										type="button"
										class:selected={rankings[candidate.id] === rank}
										onclick={() => setRank(candidate.id, rank)}
									>
										{rank}
									</button>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			</div>

			<div class="explanation-panel">
				<h3>What your ballot currently says</h3>

				{#if rankedCount === 0}
					<p class="status-message">Start by choosing a first preference.</p>
				{:else}
					<div class="summary-card">
						<p>
							You have ranked <strong>{rankedCount}</strong>
							{rankedCount === 1 ? 'candidate' : 'candidates'}.
							{#if nextRank}
								Next available rank: <strong>{nextRank}</strong>
							{/if}
						</p>
						{#if hasGaps}
							<p class="warning-text">
								Your current ballot has a gap in the sequence. STV ballots are clearest when ranks run 1,
								2, 3, 4 without skipping.
							</p>
						{/if}
					</div>

					<div class="ordered-preferences">
						<h4>Your ranking so far</h4>
						<ol>
							{#each rankedCandidates as candidate (candidate.id)}
								<li>
									<strong>{candidate.name}</strong>
									<span>{candidate.party}</span>
								</li>
							{/each}
						</ol>
					</div>
				{/if}

				<div class="explanation-card">
					<h4>Transfer preview</h4>
					<p>{transferPreview}</p>
				</div>

				<div class="explanation-card subtle">
					<h4>Why this is more demanding</h4>
					<ul>
						<li>You are not just saying who is acceptable — you are putting people in a complete order.</li>
						<li>That gets harder as ballots get longer and parties run multiple candidates.</li>
						<li>The count must then track eliminations, surplus transfers, and later preferences.</li>
					</ul>
				</div>
			</div>
		</div>
	</section>

	<RankingProblems showMMP={false} />

	<section class="page-section">
		<h2 class="section-header">Where STV sits in the design space</h2>
		<div class="summary-grid">
			<article class="summary-card">
				<h3>Ballot</h3>
				<p>Rank candidates in order of preference, usually 1, 2, 3, 4 and so on.</p>
			</article>
			<article class="summary-card">
				<h3>Districts</h3>
				<p>Needs multi-member districts, which means district magnitude and geography matter a lot.</p>
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
	</section>
</section>

<style>
	.method-page { display:grid; gap:2rem; }
	.lede { max-width: 52rem; font-size: 1.1rem; line-height: 1.7; margin: 0; }
	.method-links { display:flex; flex-wrap:wrap; gap:1rem; }
	.method-links a { color: var(--link-color); text-decoration:none; font-weight:600; }
	.method-links a:hover { text-decoration:underline; }
	.page-section, .interactive-section { display:grid; gap:1rem; }
	.section-copy { max-width: 54rem; }
	.demo-grid { display:grid; grid-template-columns: minmax(0,1.35fr) minmax(320px,0.9fr); gap:1.5rem; align-items:start; }
	.ballot-panel, .explanation-panel, .summary-card {
		padding:1.25rem;
		border:1px solid var(--border-color);
		border-radius:var(--radius-md);
		background:var(--surface-raised);
		box-shadow:var(--shadow-soft);
	}
	.panel-header { display:flex; justify-content:space-between; gap:1rem; align-items:center; }
	.panel-header h3, .explanation-panel h3 { margin:0; }
	.ghost-button {
		border:1px solid var(--border-color);
		background:var(--surface-panel);
		border-radius:999px;
		padding:.55rem .9rem;
		font:inherit;
		cursor:pointer;
	}
	.ghost-button:hover { border-color:var(--border-strong); }
	.ballot-instruction { margin:.4rem 0 0 0; color:var(--text-soft); }
	.candidate-list { display:grid; gap:.9rem; margin-top:1rem; }
	.candidate-row {
		display:grid;
		gap:.85rem;
		padding:1rem;
		border:1px solid var(--border-color);
		border-radius:var(--radius-md);
		background:var(--surface-panel);
	}
	.candidate-main { display:flex; gap:.9rem; align-items:flex-start; }
	.rank-badge {
		width:2.25rem;
		height:2.25rem;
		border-radius:999px;
		background:var(--surface-info-gradient);
		border:1px solid var(--accent-border);
		display:flex;
		align-items:center;
		justify-content:center;
		font-weight:700;
		flex:0 0 auto;
	}
	.candidate-copy { display:grid; gap:.25rem; }
	.candidate-line { display:flex; flex-wrap:wrap; gap:.5rem; align-items:baseline; }
	.candidate-name { font-weight:700; }
	.candidate-party { color:var(--accent-text); font-size:.92rem; }
	.candidate-copy p { margin:0; color:var(--text-soft); line-height:1.5; }
	.rank-controls { display:flex; flex-wrap:wrap; gap:.45rem; }
	.rank-controls button {
		width:2.3rem;
		height:2.3rem;
		border-radius:999px;
		border:1px solid var(--border-color);
		background:white;
		font:inherit;
		font-weight:700;
		cursor:pointer;
	}
	.rank-controls button.selected {
		background:linear-gradient(180deg, var(--header-bg) 0%, var(--header-bg-strong) 100%);
		color:var(--text-inverse);
		border-color:transparent;
	}
	.status-message, .warning-text { margin:0; }
	.warning-text { color:var(--warning-text); }
	.ordered-preferences ol { margin:.5rem 0 0 1.25rem; padding:0; }
	.ordered-preferences li { margin-bottom:.45rem; }
	.ordered-preferences span { color:var(--text-soft); margin-left:.4rem; }
	.explanation-card {
		margin-top:1rem;
		padding:1rem 1.05rem;
		border-radius:var(--radius-md);
		background:var(--surface-info-gradient);
		border:1px solid var(--accent-border);
	}
	.explanation-card.subtle {
		background:var(--surface-subtle-gradient);
		border-color:var(--border-color);
	}
	.explanation-card h4 { margin:.1rem 0 .5rem 0; }
	.explanation-card p, .explanation-card ul { margin:0; }
	.explanation-card ul { padding-left:1.2rem; }
	.explanation-card li { margin-bottom:.45rem; line-height:1.45; }
	.summary-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:1rem; }
	.summary-card h3 { margin-top:0; }

	@media (max-width: 900px) {
		.demo-grid { grid-template-columns: 1fr; }
	}

	@media (max-width: 640px) {
		.panel-header { align-items:flex-start; flex-direction:column; }
		.candidate-main { align-items:flex-start; }
	}
</style>
