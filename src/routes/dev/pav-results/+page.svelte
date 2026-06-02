<script lang="ts">
	import SampleBallot from '$lib/components/SampleBallot.svelte';
	import {
		candidates as largeCandidates,
		voters as largeVoters,
		seats as largeSeats,
		groups,
		approvalTotals,
		spectrumTotals,
		findCandidate as findLargeCandidate,
		TOP_K,
		type Candidate,
		type Group
	} from '$lib/data/synthetic-election';

	type Voter = { id: string; approvals: string[]; bloc?: string; blocColor?: string };

	const candidates: Candidate[] = [
		{ id: 'sj', name: 'Sarah Johnson', party: 'Labour', color: '#c8102e' },
		{ id: 'ap', name: 'Aisha Patel', party: 'Liberal Democrats', color: '#fdbb30' },
		{ id: 'jm', name: 'James Mitchell', party: 'Conservative', color: '#0087dc' },
		{ id: 'ps', name: 'Priya Sharma', party: 'Reform UK', color: '#12b6cf' },
		{ id: 'tw', name: 'Tom Wright', party: 'Green', color: '#6ab023' },
		{ id: 'dc', name: 'David Chen', party: 'Independent', color: '#7f7f7f' }
	];

	const voters: Voter[] = [
		...Array.from({ length: 5 }, (_, i) => ({
			id: `L${i + 1}`,
			approvals: ['sj', 'ap'],
			bloc: 'Left bloc',
			blocColor: '#fde2e4'
		})),
		...Array.from({ length: 4 }, (_, i) => ({
			id: `R${i + 1}`,
			approvals: ['jm', 'ps'],
			bloc: 'Right bloc',
			blocColor: '#dbe9f6'
		})),
		...Array.from({ length: 3 }, (_, i) => ({
			id: `G${i + 1}`,
			approvals: ['tw', 'dc'],
			bloc: 'Green bloc',
			blocColor: '#e1f0d8'
		}))
	];

	const blocs = ['Left bloc', 'Right bloc', 'Green bloc'];
	const seats = 3;

	type Round = {
		winner: Candidate;
		scores: Array<{ id: string; score: number }>;
		weights: Record<string, number>;
	};

	function runSPAV(): { rounds: Round[]; elected: string[] } {
		const elected: string[] = [];
		const rounds: Round[] = [];

		for (let r = 0; r < seats; r++) {
			const weights: Record<string, number> = {};
			voters.forEach((v) => {
				const k = v.approvals.filter((a) => elected.includes(a)).length;
				weights[v.id] = 1 / (1 + k);
			});

			const scores = candidates
				.filter((c) => !elected.includes(c.id))
				.map((c) => ({
					id: c.id,
					score: voters.reduce(
						(sum, v) => sum + (v.approvals.includes(c.id) ? weights[v.id] : 0),
						0
					)
				}))
				.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));

			const winner = candidates.find((c) => c.id === scores[0].id)!;
			elected.push(winner.id);
			rounds.push({ winner, scores, weights });
		}

		return { rounds, elected };
	}

	const { rounds, elected } = runSPAV();
	const findCandidate = (id: string) => candidates.find((c) => c.id === id)!;
	const weightLabel = (w: number) =>
		w === 1 ? '×1' : w === 0.5 ? '×½' : w === 1 / 3 ? '×⅓' : `×${w.toFixed(2)}`;

	const weightHeight = (w: number) => `${Math.max(w * 100, 4)}%`;

	// =========================================================================
	// Realistic-scale example: data + helpers imported from synthetic-election.
	// Only the SPAV-specific computation lives here.
	// =========================================================================

	type GroupRound = {
		winner: Candidate;
		groupMeanWeights: Record<string, number>;
		scores: Array<{
			id: string;
			score: number;
			segments: Array<{ groupId: string; value: number }>;
		}>;
	};

	function runSPAVGrouped(): { rounds: GroupRound[]; elected: string[] } {
		const voterMap = new Map(largeVoters.map((v) => [v.id, v]));
		const elected: string[] = [];
		const rounds: GroupRound[] = [];

		for (let r = 0; r < largeSeats; r++) {
			const perVoterWeights: Record<string, number> = {};
			largeVoters.forEach((v) => {
				const k = v.approvals.filter((a) => elected.includes(a)).length;
				perVoterWeights[v.id] = 1 / (1 + k);
			});

			const groupMeanWeights: Record<string, number> = {};
			groups.forEach((grp) => {
				const totalW = grp.voterIds.reduce((s, vid) => s + perVoterWeights[vid], 0);
				groupMeanWeights[grp.id] = totalW / grp.voterIds.length;
			});

			const scores = largeCandidates
				.filter((c) => !elected.includes(c.id))
				.map((c) => {
					const segments = groups.map((grp) => {
						const value = grp.voterIds.reduce((s, vid) => {
							const v = voterMap.get(vid)!;
							return s + (v.approvals.includes(c.id) ? perVoterWeights[vid] : 0);
						}, 0);
						return { groupId: grp.id, value };
					});
					const score = segments.reduce((s, seg) => s + seg.value, 0);
					return { id: c.id, score, segments };
				})
				.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));

			const winner = largeCandidates.find((c) => c.id === scores[0].id)!;
			elected.push(winner.id);
			rounds.push({ winner, groupMeanWeights, scores });
		}

		return { rounds, elected };
	}

	const { rounds: largeRounds, elected: largeElected } = runSPAVGrouped();
	const findGroup = (id: string) => groups.find((c) => c.id === id)!;

	const avWinners = new Set(approvalTotals.slice(0, largeSeats).map((t) => t.id));
	const pavWinners = new Set(largeElected);

	const spectrumMax = Math.max(...spectrumTotals.map((t) => t.count));
</script>

<svelte:head>
	<title>Dev — PAV results sketch</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main>
		<header class="page-header">
			<h1>Proportional Approval — results sketch</h1>
			<p class="subtitle">
				Two views of the same algorithm: a small, clean teaching example with three blocs, and an
				auto-grouped view at realistic scale. Both use SPAV reweighting (1 / (1 + k)).
			</p>
		</header>

		<section class="example-divider">
			<h2>1. Teaching example — three clean blocs</h2>
			<p>
				A toy 3-seat, 12-voter election with three coalitions of unequal size. Every voter in a
				bloc casts an identical ballot, so the mechanic is easy to see at the individual level.
			</p>
			<p class="setup">
				<strong>{seats} seats</strong> · {voters.length} voters · {candidates.length} candidates
			</p>
		</section>

		<section class="ballots">
			<h3>The ballots</h3>
			<div class="bloc-grid">
				{#each blocs as bloc}
					{@const blocVoters = voters.filter((v) => v.bloc === bloc)}
					{@const approvals = blocVoters[0].approvals.map(findCandidate)}
					<div class="bloc-card" style="background:{blocVoters[0].blocColor}">
						<header>
							<strong>{bloc}</strong>
							<span class="count">{blocVoters.length} voters</span>
						</header>
						<p class="approves">Approves:</p>
						<ul>
							{#each approvals as c}
								<li><span class="dot" style="background:{c.color}"></span>{c.name}</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</section>

		<section class="rounds">
			<h3>How each seat was filled</h3>
			{#each rounds as round, r}
				<article class="round-card">
					<header class="round-header">
						<span class="round-tag">Round {r + 1}</span>
						<p class="round-winner">
							Winner: <strong style="color:{round.winner.color}">{round.winner.name}</strong>
							<span class="winner-party">({round.winner.party})</span>
						</p>
					</header>

					<div class="round-body">
						<div class="voter-panel">
							<p class="panel-label">Voter weights this round</p>
							<div class="voter-rows">
								{#each blocs as bloc}
									{@const blocVoters = voters.filter((v) => v.bloc === bloc)}
									{@const w = round.weights[blocVoters[0].id]}
									<div class="voter-bloc-row">
										<span class="bloc-name">{bloc} <span class="bloc-weight">{weightLabel(w)}</span></span>
										<div class="pill-strip">
											{#each blocVoters as v}
												<div
													class="voter-pill"
													style="background:{v.blocColor}; height:{w * 40}px;"
													title="Voter {v.id} · weight {w.toFixed(2)}"
												></div>
											{/each}
										</div>
									</div>
								{/each}
							</div>
						</div>

						<div class="score-panel">
							<p class="panel-label">Reweighted approvals</p>
							<div class="score-list">
								{#each round.scores as s}
									{@const c = findCandidate(s.id)}
									{@const winning = c.id === round.winner.id}
									{@const maxScore = round.scores[0].score}
									<div class="score-row" class:winning>
										<span class="score-name">{c.name}</span>
										<div class="bar-track">
											<div
												class="bar-fill"
												style="width:{(s.score / maxScore) * 100}%; background:{c.color}"
											></div>
										</div>
										<span class="score-value">
											{s.score.toFixed(2)}{winning ? ' ✓' : ''}
										</span>
									</div>
								{/each}
							</div>
						</div>
					</div>

					<p class="caption">
						{#if r < rounds.length - 1}
							→ The voters who approved <strong>{round.winner.name}</strong> drop to
							<strong>½ weight</strong> in round {r + 2}. That lets a different coalition take the next
							seat.
						{:else}
							→ One seat per bloc, even though the left bloc had nearly twice the voters of the green
							bloc. That's proportionality.
						{/if}
					</p>
					{#if r === 0}
						<p class="tie-note">
							In this toy example, <strong>Sarah Johnson</strong> and <strong>Aisha Patel</strong> tie on
							5.00 in round 1. We break ties alphabetically by candidate id/name for the demo, so Sarah
							Johnson is shown winning first. The same tie-break explains James Mitchell over Priya
							Sharma in round 2 and Tom Wright over David Chen in round 3. A real election would need
							a formal published tie-break rule.
						</p>
					{/if}
				</article>
			{/each}
		</section>

		<section class="final">
			<h3>Final result</h3>
			<ol class="winner-list">
				{#each elected as winnerId, i}
					{@const c = findCandidate(winnerId)}
					<li class="winner-card">
						<span class="seat-badge" style="background:{c.color}">{i + 1}</span>
						<div>
							<strong>{c.name}</strong>
							<small>{c.party}</small>
						</div>
					</li>
				{/each}
			</ol>
		</section>

		<section class="example-divider">
			<h2>2. At realistic scale — auto-grouped</h2>
			<p>
				A 5-seat, {largeVoters.length}-voter election with {largeCandidates.length} candidates and
				overlapping approval patterns (some voters add or drop one candidate from their bloc's
				default). Voters are auto-grouped by their exact approval set; the top {TOP_K} patterns get
				distinct colors and the long tail is collapsed into "Other". This scales to thousands of
				voters and dozens of candidates without changing the visual.
			</p>
			<p class="setup">
				<strong>{largeSeats} seats</strong> · {largeVoters.length} voters ·
				{largeCandidates.length} candidates · grouped into {groups.length} groups
			</p>
		</section>

		<section class="sample-ballot-section">
			<h3>What a voter sees</h3>
			<p class="section-intro">
				A single ballot — voters tick any number of candidates they approve. This example shows the
				most common approval pattern ({groups[0].voterIds.length} voters cast this exact ballot).
			</p>
			<SampleBallot candidates={largeCandidates} approvals={groups[0].approvals} />
		</section>

		<section class="totals-section">
			<h3>Total approvals</h3>
			<p class="section-intro">
				If we just counted ticks — the top {largeSeats} candidates with the most approvals would win
				under straight Approval Voting. PAV instead reweights ballots round by round so that
				different coalitions get a seat, even when one coalition is the largest.
			</p>
			<div class="totals-list">
				{#each approvalTotals as t}
					{@const c = findLargeCandidate(t.id)}
					{@const isAV = avWinners.has(c.id)}
					{@const isPAV = pavWinners.has(c.id)}
					{@const maxCount = approvalTotals[0].count}
					<div class="totals-row" class:av-winner={isAV}>
						<span class="totals-name">
							{c.name}
							<small>{c.party}</small>
						</span>
						<span class="totals-tags">
							{#if isAV}<span class="tag tag-av">AV winner</span>{/if}
							{#if isPAV}<span class="tag tag-pav">PAV winner</span>{/if}
						</span>
						<div class="bar-track">
							<div
								class="bar-fill"
								style="width:{(t.count / maxCount) * 100}%; background:{c.color};"
							></div>
						</div>
						<span class="totals-value">{t.count}</span>
					</div>
				{/each}
			</div>
		</section>

		<section class="spectrum-section">
			<h3>Approvals across the political spectrum</h3>
			<p class="section-intro">
				The same totals, but ordered left-to-right by political position (Independents sit with the
				Centrists). Under straight Approval Voting, the {largeSeats} winners cluster around the
				larger left/centrist bulge — the dashed lines mark exactly which candidates AV would
				elect. PAV's winners (▼ marker) spread across the whole spectrum, electing one from each
				of the Far Left, Left, Centrist, Right, and Far Right.
			</p>
			<div class="spectrum-chart">
				{#each spectrumTotals as t, i}
					{@const c = findLargeCandidate(t.id)}
					{@const isAV = avWinners.has(c.id)}
					{@const isPAV = pavWinners.has(c.id)}
					{@const prevIsAV =
						i > 0 &&
						avWinners.has(findLargeCandidate(spectrumTotals[i - 1].id).id)}
					{@const showPartition = i > 0 && isAV !== prevIsAV}
					<div class="spectrum-col" class:partition-before={showPartition}>
						<div class="spectrum-marker">
							{#if isPAV}<span class="pav-mark" title="PAV winner">▼</span>{/if}
						</div>
						<div class="spectrum-bar">
							<span class="spectrum-count">{t.count}</span>
							<div
								class="spectrum-fill"
								style="height:{(t.count / spectrumMax) * 100}%; background:{c.color};"
							></div>
						</div>
						<div class="spectrum-label">
							<strong>{c.name.split(' ')[0]}</strong>
							<small>{c.party}</small>
						</div>
					</div>
				{/each}
			</div>
			<div class="spectrum-axis">
				<span>← Far Left</span>
				<span>Centrist · Independent</span>
				<span>Far Right →</span>
			</div>
			<div class="spectrum-legend">
				<span class="legend-chip">
					<span class="legend-swatch legend-swatch-av"></span>Dashed lines bracket AV's winning
					group (top {largeSeats} by raw approvals)
				</span>
				<span class="legend-chip">
					<span class="legend-swatch legend-swatch-pav">▼</span>PAV winners (after reweighting)
				</span>
			</div>
		</section>

		<section class="ballots">
			<h3>Groups of ballots</h3>
			<p class="section-intro">
				Each card is a grouping of ballots that mark the same candidates. The colored strip is the
				group’s color, used in the bars below to trace its contribution through every round.
			</p>
			<div class="bloc-grid">
				{#each groups as grp}
					<div class="group-card" style="border-left:6px solid {grp.color};">
						<header>
							<span class="group-swatch" style="background:{grp.color}"></span>
							<div class="group-title">
								<strong>{grp.label}</strong>
								<small>{grp.voterIds.length} voters</small>
							</div>
						</header>
						{#if grp.id === 'other'}
							<p class="group-meta">
								Long-tail patterns not in the top {TOP_K}. Each contains a handful of voters with
								unique approval sets.
							</p>
						{:else}
							{@const approvals = grp.approvals.map(findLargeCandidate)}
							<p class="approves">Approves:</p>
							<ul>
								{#each approvals as c}
									<li><span class="dot" style="background:{c.color}"></span>{c.name}</li>
								{/each}
							</ul>
						{/if}
					</div>
				{/each}
			</div>
		</section>

		<section class="rounds">
			<h3>How each seat was filled</h3>
			{#each largeRounds as round, r}
				<article class="round-card">
					<header class="round-header">
						<span class="round-tag">Round {r + 1}</span>
						<p class="round-winner">
							Winner: <strong style="color:{round.winner.color}">{round.winner.name}</strong>
							<span class="winner-party">({round.winner.party})</span>
						</p>
					</header>

					<div class="group-lanes">
						<p class="panel-label">Group voice remaining</p>
						<div class="lanes-row">
							{#each groups as grp}
								{@const w = round.groupMeanWeights[grp.id]}
								<div class="lane" style="flex: {grp.voterIds.length} 0 0;">
									<div class="lane-track">
										<div
											class="lane-fill"
											style="height:{Math.max(w * 100, 4)}%; background:{grp.color};"
											title="{grp.label}: {grp.voterIds.length} voters at ×{w.toFixed(2)}"
										></div>
									</div>
									<span class="lane-label">{grp.voterIds.length} ×{weightLabel(w).slice(1)}</span>
								</div>
							{/each}
						</div>
					</div>

					<div class="score-panel">
						<p class="panel-label">Reweighted scores (segmented by group)</p>
						<div class="score-list">
							{#each round.scores as s}
								{@const c = findLargeCandidate(s.id)}
								{@const winning = c.id === round.winner.id}
								{@const maxScore = round.scores[0].score}
								<div class="score-row" class:winning>
									<span class="score-name">
										{c.name}
										<small>{c.party}</small>
									</span>
									<div class="bar-track segmented">
										{#each s.segments as seg}
											{#if seg.value > 0}
												{@const grp = findGroup(seg.groupId)}
												<div
													class="bar-seg"
													style="width:{(seg.value / maxScore) * 100}%; background:{grp.color};"
													title="{grp.label}: {seg.value.toFixed(1)}"
												></div>
											{/if}
										{/each}
									</div>
									<span class="score-value">
										{s.score.toFixed(1)}{winning ? ' ✓' : ''}
									</span>
								</div>
							{/each}
						</div>
					</div>

					<p class="caption">
						{#if r < largeRounds.length - 1}
							→ The groups whose ballots include <strong>{round.winner.name}</strong> drop in
							voice for round {r + 2}. The next winner emerges from whichever groups still have
							full-strength support.
						{:else}
							→ Five seats, allocated across distinct coalitions in rough proportion to their
							remaining voice each round.
						{/if}
					</p>
				</article>
			{/each}
		</section>

		<section class="final">
			<h3>Final result</h3>
			<ol class="winner-list">
				{#each largeElected as winnerId, i}
					{@const c = findLargeCandidate(winnerId)}
					<li class="winner-card">
						<span class="seat-badge" style="background:{c.color}">{i + 1}</span>
						<div>
							<strong>{c.name}</strong>
							<small>{c.party}</small>
						</div>
					</li>
				{/each}
			</ol>
		</section>
	</main>

<style>
	main {
		max-width: 64rem;
		margin: 0 auto;
		padding: 2.5rem 1.5rem 4rem;
		color: var(--text-color);
	}

	.page-header h1 {
		margin: 0 0 0.4rem;
		color: var(--text-dark);
		font-size: 2rem;
		line-height: 1.2;
	}

	.subtitle {
		color: var(--text-soft);
		max-width: 50rem;
		margin: 0 0 0.4rem;
	}

	.setup {
		font-size: 0.9rem;
		color: var(--text-soft);
		margin: 0 0 2rem;
	}

	h2 {
		font-size: 1.6rem;
		color: var(--text-dark);
		margin: 3rem 0 0.75rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid var(--border-color);
		font-weight: 700;
		line-height: 1.25;
	}

	h3 {
		font-size: 1.1rem;
		color: var(--text-dark);
		margin: 2rem 0 0.75rem;
		padding-bottom: 0.4rem;
		border-bottom: 1px solid var(--border-color);
		font-weight: 600;
	}

	.section-intro {
		color: var(--text-soft);
		margin: 0 0 1rem;
		max-width: 52rem;
	}

	/* Ballots */
	.bloc-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1rem;
	}

	.bloc-card {
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		padding: 1rem 1.2rem;
	}

	.bloc-card header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 0.5rem;
	}

	.bloc-card .count {
		font-size: 0.85rem;
		color: var(--text-soft);
	}

	.bloc-card .approves {
		font-size: 0.85rem;
		color: var(--text-soft);
		margin: 0.25rem 0;
	}

	.bloc-card ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.bloc-card li {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.95rem;
	}

	.dot {
		width: 0.7rem;
		height: 0.7rem;
		border-radius: 50%;
		flex-shrink: 0;
	}

	/* Group ballot cards (realistic-scale section) */
	.group-card {
		background: var(--surface-raised);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		padding: 1rem 1.2rem;
	}

	.group-card header {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin-bottom: 0.6rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px dashed var(--border-color);
	}

	.group-swatch {
		width: 1rem;
		height: 1rem;
		border-radius: 3px;
		flex-shrink: 0;
		border: 1px solid rgba(0, 0, 0, 0.15);
	}

	.group-title {
		display: flex;
		flex-direction: column;
		min-width: 0;
		flex: 1;
	}

	.group-title strong {
		color: var(--text-dark);
		font-size: 0.95rem;
		font-weight: 600;
	}

	.group-title small {
		color: var(--text-soft);
		font-size: 0.78rem;
	}

	.group-card .approves {
		font-size: 0.85rem;
		color: var(--text-soft);
		margin: 0 0 0.4rem;
	}

	.group-card ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.group-card li {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
		color: var(--text-dark);
	}

	.group-meta {
		font-size: 0.85rem;
		color: var(--text-soft);
		margin: 0;
		font-style: italic;
	}

	/* Rounds */
	.rounds {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.round-card {
		background: var(--surface-raised);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		padding: 1.5rem;
		box-shadow: var(--shadow-soft);
	}

	.round-header {
		display: flex;
		align-items: baseline;
		gap: 1rem;
		margin-bottom: 1.2rem;
		padding-bottom: 0.8rem;
		border-bottom: 1px dashed var(--border-color);
	}

	.round-tag {
		background: var(--header-bg);
		color: var(--text-inverse);
		padding: 0.2rem 0.7rem;
		border-radius: 999px;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.round-winner {
		margin: 0;
		font-size: 1rem;
	}

	.winner-party {
		color: var(--text-soft);
		font-size: 0.9rem;
		margin-left: 0.25rem;
	}

	.round-body {
		display: grid;
		grid-template-columns: 1fr 1.3fr;
		gap: 2rem;
	}

	@media (max-width: 720px) {
		.round-body {
			grid-template-columns: 1fr;
		}
	}

	.panel-label {
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-soft);
		margin: 0 0 0.75rem;
	}

	/* Voter pills */
	.voter-rows {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.voter-bloc-row {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.bloc-name {
		font-size: 0.85rem;
		color: var(--text-dark);
	}

	.bloc-weight {
		color: var(--text-soft);
		margin-left: 0.4rem;
		font-variant-numeric: tabular-nums;
	}

	.pill-strip {
		display: flex;
		align-items: flex-end;
		gap: 3px;
		height: 44px;
		border-bottom: 1px solid var(--border-color);
		padding-bottom: 2px;
	}

	.voter-pill {
		width: 14px;
		min-height: 4px;
		border-radius: 2px 2px 0 0;
		border: 1px solid rgba(0, 0, 0, 0.12);
		transition: height 0.2s ease;
	}

	/* Score bars */
	.score-list {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.score-row {
		display: grid;
		grid-template-columns: 9rem 1fr 3rem;
		align-items: center;
		gap: 0.6rem;
		padding: 0.3rem 0.5rem;
		border-radius: var(--radius-sm);
		transition: background-color 0.2s ease;
	}

	.score-row.winning {
		background: var(--field-hover, rgba(0, 0, 0, 0.04));
		font-weight: 600;
	}

	.score-name {
		font-size: 0.9rem;
		color: var(--text-dark);
	}

	.bar-track {
		height: 12px;
		background: var(--surface-color);
		border-radius: 999px;
		overflow: hidden;
		border: 1px solid var(--border-color);
	}

	/* Total approvals section */
	.totals-list {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.totals-row {
		display: grid;
		grid-template-columns: 11rem 12rem 1fr 2.5rem;
		align-items: center;
		gap: 0.75rem;
		padding: 0.4rem 0.6rem;
		border-radius: var(--radius-sm);
	}

	.totals-row.av-winner {
		background: var(--field-hover, rgba(0, 0, 0, 0.04));
	}

	.totals-name {
		display: flex;
		flex-direction: column;
		font-size: 0.9rem;
		color: var(--text-dark);
		min-width: 0;
	}

	.totals-name small {
		color: var(--text-soft);
		font-size: 0.75rem;
	}

	.totals-value {
		font-variant-numeric: tabular-nums;
		font-weight: 600;
		color: var(--text-dark);
		text-align: right;
	}

	.totals-tags {
		display: flex;
		gap: 0.35rem;
		flex-wrap: wrap;
	}

	.tag {
		font-size: 0.7rem;
		font-weight: 600;
		padding: 0.15rem 0.5rem;
		border-radius: 999px;
		letter-spacing: 0.03em;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.tag-av {
		background: var(--surface-color);
		color: var(--text-soft);
		border: 1px solid var(--border-color);
	}

	.tag-pav {
		background: var(--header-bg);
		color: var(--text-inverse);
	}

	/* ===== Spectrum chart ===== */
	.spectrum-section {
		margin-bottom: 1rem;
	}

	.spectrum-chart {
		display: flex;
		align-items: flex-end;
		gap: 0.5rem;
		margin: 1.25rem 0 0.4rem;
		padding-bottom: 0.3rem;
		border-bottom: 2px solid var(--border-strong);
	}

	.spectrum-col {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		min-width: 0;
		gap: 0.25rem;
		position: relative;
	}

	/* Dashed vertical line marking the AV-winning group boundary. The line sits
	   in the gap to the LEFT of this column. */
	.spectrum-col.partition-before::before {
		content: '';
		position: absolute;
		top: 0;
		bottom: -2.4rem;
		left: -0.3rem;
		border-left: 2px dashed #d4af37;
		pointer-events: none;
	}

	.spectrum-marker {
		height: 1.2rem;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		color: var(--header-bg);
		font-size: 1.1rem;
		line-height: 1;
	}

	.pav-mark {
		font-weight: 700;
	}

	.spectrum-bar {
		height: 200px;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: flex-end;
		position: relative;
	}

	.spectrum-count {
		font-size: 0.75rem;
		color: var(--text-dark);
		text-align: center;
		margin-bottom: 2px;
		font-variant-numeric: tabular-nums;
		font-weight: 600;
	}

	.spectrum-fill {
		width: 100%;
		min-height: 4px;
		border-radius: 4px 4px 0 0;
		border: 1px solid rgba(0, 0, 0, 0.15);
		border-bottom: none;
		transition: height 0.25s ease;
	}

	.spectrum-label {
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 1px;
		padding-top: 0.25rem;
		border-top: 1px dashed var(--border-color);
		min-width: 0;
	}

	.spectrum-label strong {
		font-size: 0.8rem;
		color: var(--text-dark);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.spectrum-label small {
		font-size: 0.68rem;
		color: var(--text-soft);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.spectrum-axis {
		display: flex;
		justify-content: space-between;
		font-size: 0.75rem;
		color: var(--text-soft);
		margin-top: 0.3rem;
		letter-spacing: 0.02em;
	}

	.spectrum-legend {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-top: 1rem;
		font-size: 0.8rem;
		color: var(--text-color);
	}

	.legend-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.legend-swatch {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.1rem;
		height: 1.1rem;
		border-radius: 3px;
	}

	.legend-swatch-av {
		width: 1.4rem;
		height: 1.2rem;
		background: transparent;
		border-left: 2px dashed #d4af37;
		border-right: 2px dashed #d4af37;
		border-top: none;
		border-bottom: none;
		border-radius: 0;
	}

	.legend-swatch-pav {
		color: var(--header-bg);
		font-size: 1rem;
		font-weight: 700;
	}

	.bar-fill {
		height: 100%;
		border-radius: 999px;
		transition: width 0.3s ease;
	}

	.score-value {
		font-size: 0.9rem;
		color: var(--text-dark);
		font-variant-numeric: tabular-nums;
		text-align: right;
	}

	.caption {
		margin: 1.2rem 0 0;
		padding: 0.75rem 1rem;
		background: var(--surface-subtle-gradient, var(--surface-color));
		border-left: 3px solid var(--header-bg);
		border-radius: var(--radius-sm);
		font-size: 0.95rem;
		color: var(--text-color);
	}

	.tie-note {
		margin: 0.75rem 0 0;
		padding: 0.75rem 1rem;
		background: color-mix(in srgb, var(--surface-color) 88%, white);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
		font-size: 0.92rem;
		color: var(--text-soft);
	}

	/* Final winners */
	.winner-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 1rem;
	}

	.winner-card {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem 1.2rem;
		background: var(--surface-raised);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-soft);
	}

	.seat-badge {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.2rem;
		height: 2.2rem;
		border-radius: 50%;
		color: white;
		font-weight: bold;
		flex-shrink: 0;
	}

	.winner-card strong {
		display: block;
		color: var(--text-dark);
	}

	.winner-card small {
		color: var(--text-soft);
	}

	/* ===== Example divider & scale section ===== */
	.example-divider {
		margin-top: 3rem;
		padding-top: 1.5rem;
		border-top: 2px solid var(--border-color);
	}

	.example-divider:first-of-type {
		margin-top: 1.5rem;
		padding-top: 0;
		border-top: none;
	}

	.example-divider h2 {
		margin: 0 0 0.6rem;
		padding-bottom: 0.6rem;
		font-size: 1.7rem;
		border-bottom: 2px solid var(--header-bg);
	}

	.example-divider p {
		color: var(--text-soft);
		max-width: 52rem;
		margin: 0 0 0.4rem;
	}

	.example-divider .setup {
		font-size: 0.9rem;
		margin: 0;
	}

	/* ===== Group lanes (per-round voice panel) ===== */
	.group-lanes {
		margin-bottom: 1.25rem;
	}

	.lanes-row {
		display: flex;
		align-items: flex-end;
		gap: 4px;
	}

	.lane {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		min-width: 0;
	}

	.lane-track {
		height: 56px;
		display: flex;
		align-items: flex-end;
		border: 1px solid var(--border-color);
		border-radius: 4px 4px 0 0;
		background: color-mix(in srgb, var(--surface-color) 85%, white);
		overflow: hidden;
	}

	.lane-fill {
		width: 100%;
		min-height: 3px;
		border-top: 1px solid rgba(0, 0, 0, 0.12);
		transition: height 0.25s ease;
	}

	.lane-label {
		font-size: 0.65rem;
		color: var(--text-soft);
		text-align: center;
		margin-top: 3px;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: clip;
	}

	/* ===== Segmented score bar ===== */
	.bar-track.segmented {
		display: flex;
		padding: 0;
		overflow: hidden;
	}

	.bar-seg {
		height: 100%;
		border-right: 1px solid rgba(255, 255, 255, 0.7);
	}

	.bar-seg:last-child {
		border-right: none;
	}
</style>
