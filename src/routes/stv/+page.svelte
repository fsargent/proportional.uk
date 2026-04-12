<script lang="ts">
	import RankingProblems from '$lib/components/RankingProblems.svelte';
	import MMDVisualiserSection from '$lib/components/MMDVisualiserSection.svelte';

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

	function setRank(candidateId: string, rank: number) {
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
	const rankUsage = $derived(
		rankChoices.map((rank) => ({
			rank,
			candidates: candidates.filter((candidate) => rankings[candidate.id] === rank)
		}))
	);
	const duplicatedRanks = $derived(rankUsage.filter(({ candidates }) => candidates.length > 1));
	const hasDuplicateRanks = $derived(duplicatedRanks.length > 0);
	const hasGaps = $derived(
		rankedCount > 0 &&
			rankChoices
				.slice(0, rankedCount)
				.some((rank) => !candidates.some((candidate) => rankings[candidate.id] === rank))
	);
	const ballotHasError = $derived(hasGaps || hasDuplicateRanks);

	const firstChoice = $derived(
		hasDuplicateRanks || hasGaps ? null : rankedCandidates.find((candidate) => rankings[candidate.id] === 1) ?? null
	);
	const secondChoice = $derived(
		hasDuplicateRanks || hasGaps ? null : rankedCandidates.find((candidate) => rankings[candidate.id] === 2) ?? null
	);
	const transferPreview = $derived(
		ballotHasError
			? 'This ballot currently contains an error. In an STV count, equal rankings or broken numbering can cause the ballot to stop counting once the problem is reached, depending on the election rules.'
			: firstChoice && secondChoice
				? `If ${firstChoice.name} is eliminated or elected with surplus, your vote can continue to ${secondChoice.name}.`
				: 'Add a second preference to see how transfers continue your ballot if your first choice cannot use your full vote.'
	);
</script>

<svelte:head>
	<title>Single Transferable Vote for the UK</title>
	<meta name="description" content="Understand Single Transferable Vote, its strengths, its tradeoffs, and how it compares with approval-based multi-member systems." />
</svelte:head>

<section class="method-page">
	<h1>Single Transferable Vote: proportional, local, and more demanding on the ballot</h1>
	<p class="lede">
		Single Transferable Vote, usually shortened to STV, is one of the best-known proportional reform options in British politics. If Westminster ever
		moves to multi-member districts, Single Transferable Vote will be one of the first systems many reformers and commentators reach for.
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
			<h2 id="stv-demo-title" class="section-header">Try a Single Transferable Vote ballot</h2>
			<p class="intro-text">
				A Single Transferable Vote ballot asks you to put candidates in order: 1 for your favourite, 2 for your next choice,
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
						{#if hasDuplicateRanks}
							<p class="warning-text">
								Your current ballot gives the same rank to more than one candidate.
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

				{#if ballotHasError}
					<div class="explanation-card warning-card">
						<h4>How the error would be treated</h4>
						{#if hasDuplicateRanks}
							<p>
								If two candidates are given the same ranking, the ballot becomes ambiguous at that point.
								Different STV rule sets handle this differently, but the usual effect is that the ballot is
								counted up to the last clear preference, then stops transferring once the tie is reached.
							</p>
						{/if}
						{#if hasGaps}
							<p>
								If rankings skip a number, some rule sets continue from the next available preference while
								others may treat the later part of the ballot as exhausted. The safe version is always a
								clean 1, 2, 3, 4 sequence.
							</p>
						{/if}
						<ul>
							{#each duplicatedRanks as duplicated}
								<li>
									Rank <strong>{duplicated.rank}</strong> is currently shared by
									{duplicated.candidates.map((candidate) => candidate.name).join(' and ')}.
								</li>
							{/each}
						</ul>
					</div>
				{/if}

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
		<MMDVisualiserSection
			title="Why multi-member districts matter for STV"
			introText="STV only becomes proportional because several seats are filled in the same contest. That makes district magnitude one of the most important design choices in the whole system."
			bodyText="Use the live visualiser below to see what different multi-member district sizes look like in a Westminster setting, and how that changes the balance between local link and meaningful proportionality."
			initialMagnitude={5}
		/>
	</section>

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
	.explanation-card.warning-card {
		background: color-mix(in srgb, var(--warning-bg, #fff4d6) 65%, white);
		border-color: color-mix(in srgb, var(--warning-text, #a15c00) 35%, var(--border-color));
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
