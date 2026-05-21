<script lang="ts">
	import SampleBallot from '$lib/components/SampleBallot.svelte';

	type Candidate = { id: string; name: string; party: string; color: string };
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
				.sort((a, b) => b.score - a.score);

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

	// =========================================================================
	// Realistic-scale example: 240 voters, 10 candidates, auto-clustered
	// =========================================================================

	const TOP_K = 6;
	const clusterPalette = [
		'#4e79a7',
		'#f28e2b',
		'#59a14f',
		'#e15759',
		'#edc948',
		'#af7aa1',
		'#76b7b2',
		'#9c9c9c' // reserved for "Other"
	];

	const largeCandidates: Candidate[] = [
		{ id: 'a1', name: 'Anna Reid', party: 'Progressive', color: '#c8102e' },
		{ id: 'a2', name: 'Marcus Lee', party: 'Progressive', color: '#c8102e' },
		{ id: 'b1', name: 'Joanna Hart', party: 'Centrist', color: '#fdbb30' },
		{ id: 'b2', name: 'Daniel Owen', party: 'Centrist', color: '#fdbb30' },
		{ id: 'c1', name: 'Richard Black', party: 'Conservative', color: '#0087dc' },
		{ id: 'c2', name: 'Margaret Pike', party: 'Conservative', color: '#0087dc' },
		{ id: 'd1', name: 'Naomi Ford', party: 'Green', color: '#6ab023' },
		{ id: 'd2', name: 'Eli Park', party: 'Green', color: '#6ab023' },
		{ id: 'e1', name: 'Hassan Roe', party: 'Reform', color: '#12b6cf' },
		{ id: 'e2', name: 'Linda Vale', party: 'Independent', color: '#7f7f7f' }
	];

	const largeSeats = 5;

	const archetypes: Array<{ count: number; approvals: string[] }> = [
		{ count: 50, approvals: ['a1', 'a2', 'd1'] },
		{ count: 40, approvals: ['a1', 'b1'] },
		{ count: 35, approvals: ['c1', 'c2'] },
		{ count: 25, approvals: ['b1', 'c1'] },
		{ count: 30, approvals: ['c2', 'e1'] },
		{ count: 20, approvals: ['d1', 'd2'] },
		{ count: 15, approvals: ['b2', 'a2'] },
		{ count: 15, approvals: ['e2', 'd1'] },
		{ count: 10, approvals: ['e2', 'b1'] }
	];
	// Total: 240 voters

	function mulberry32(seed: number) {
		return function () {
			let t = (seed += 0x6d2b79f5);
			t = Math.imul(t ^ (t >>> 15), t | 1);
			t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};
	}

	function generateLargeVoters(): Voter[] {
		const rng = mulberry32(7);
		const out: Voter[] = [];
		let id = 1;
		for (const arch of archetypes) {
			for (let i = 0; i < arch.count; i++) {
				const set = new Set(arch.approvals);
				if (rng() < 0.15) {
					set.add(largeCandidates[Math.floor(rng() * largeCandidates.length)].id);
				}
				if (rng() < 0.1 && set.size > 1) {
					const arr = [...set];
					set.delete(arr[Math.floor(rng() * arr.length)]);
				}
				out.push({ id: `LV${id++}`, approvals: [...set].sort() });
			}
		}
		return out;
	}

	const largeVoters = generateLargeVoters();

	type Cluster = {
		id: string;
		approvals: string[];
		voterIds: string[];
		color: string;
		label: string;
	};

	function buildClusters(): Cluster[] {
		const groups = new Map<string, string[]>();
		largeVoters.forEach((v) => {
			const key = v.approvals.join(',');
			if (!groups.has(key)) groups.set(key, []);
			groups.get(key)!.push(v.id);
		});
		const sorted = [...groups.entries()].sort((a, b) => b[1].length - a[1].length);
		const out: Cluster[] = [];
		sorted.slice(0, TOP_K).forEach(([key, voterIds], i) => {
			const approvals = key.split(',').filter(Boolean);
			const names = approvals
				.map((id) => largeCandidates.find((c) => c.id === id)?.name.split(' ')[0] ?? '?')
				.join(' + ');
			out.push({
				id: `c${i}`,
				approvals,
				voterIds,
				color: clusterPalette[i],
				label: names
			});
		});
		const rest = sorted.slice(TOP_K);
		if (rest.length > 0) {
			out.push({
				id: 'other',
				approvals: [],
				voterIds: rest.flatMap(([, v]) => v),
				color: clusterPalette[clusterPalette.length - 1],
				label: `Other (${rest.length} patterns)`
			});
		}
		return out;
	}

	const clusters = buildClusters();

	type ClusterRound = {
		winner: Candidate;
		clusterMeanWeights: Record<string, number>;
		scores: Array<{
			id: string;
			score: number;
			segments: Array<{ clusterId: string; value: number }>;
		}>;
	};

	function runSPAVClustered(): { rounds: ClusterRound[]; elected: string[] } {
		const voterMap = new Map(largeVoters.map((v) => [v.id, v]));
		const elected: string[] = [];
		const rounds: ClusterRound[] = [];

		for (let r = 0; r < largeSeats; r++) {
			const perVoterWeights: Record<string, number> = {};
			largeVoters.forEach((v) => {
				const k = v.approvals.filter((a) => elected.includes(a)).length;
				perVoterWeights[v.id] = 1 / (1 + k);
			});

			const clusterMeanWeights: Record<string, number> = {};
			clusters.forEach((cl) => {
				const totalW = cl.voterIds.reduce((s, vid) => s + perVoterWeights[vid], 0);
				clusterMeanWeights[cl.id] = totalW / cl.voterIds.length;
			});

			const scores = largeCandidates
				.filter((c) => !elected.includes(c.id))
				.map((c) => {
					const segments = clusters.map((cl) => {
						const value = cl.voterIds.reduce((s, vid) => {
							const v = voterMap.get(vid)!;
							return s + (v.approvals.includes(c.id) ? perVoterWeights[vid] : 0);
						}, 0);
						return { clusterId: cl.id, value };
					});
					const score = segments.reduce((s, seg) => s + seg.value, 0);
					return { id: c.id, score, segments };
				})
				.sort((a, b) => b.score - a.score);

			const winner = largeCandidates.find((c) => c.id === scores[0].id)!;
			elected.push(winner.id);
			rounds.push({ winner, clusterMeanWeights, scores });
		}

		return { rounds, elected };
	}

	const { rounds: largeRounds, elected: largeElected } = runSPAVClustered();
	const findLargeCandidate = (id: string) => largeCandidates.find((c) => c.id === id)!;
	const findCluster = (id: string) => clusters.find((c) => c.id === id)!;
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
				auto-clustered view at realistic scale. Both use SPAV reweighting (1 / (1 + k)).
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
			<h2>2. At realistic scale — auto-clustered</h2>
			<p>
				A 5-seat, {largeVoters.length}-voter election with {largeCandidates.length} candidates and
				overlapping approval patterns (some voters add or drop one candidate from their bloc's
				default). Voters are auto-grouped by their exact approval set; the top {TOP_K} patterns get
				distinct colors and the long tail is collapsed into "Other". This scales to thousands of
				voters and dozens of candidates without changing the visual.
			</p>
			<p class="setup">
				<strong>{largeSeats} seats</strong> · {largeVoters.length} voters ·
				{largeCandidates.length} candidates · clustered into {clusters.length} groups
			</p>
		</section>

		<section class="sample-ballot-section">
			<h3>What a voter sees</h3>
			<p class="section-intro">
				A single ballot — voters tick any number of candidates they approve. This example shows the
				most common approval pattern ({clusters[0].voterIds.length} voters cast this exact ballot).
			</p>
			<SampleBallot candidates={largeCandidates} approvals={clusters[0].approvals} />
		</section>

		<section class="ballots">
			<h3>The ballots — top {TOP_K} approval patterns</h3>
			<p class="section-intro">
				Each card shows what a coalition of voters approved. The colored strip is the cluster's
				color, used in the bars below to trace its contribution through every round.
			</p>
			<div class="bloc-grid">
				{#each clusters as cl}
					<div class="cluster-card" style="border-left:6px solid {cl.color};">
						<header>
							<span class="cluster-swatch" style="background:{cl.color}"></span>
							<div class="cluster-title">
								<strong>{cl.label}</strong>
								<small>{cl.voterIds.length} voters</small>
							</div>
						</header>
						{#if cl.id === 'other'}
							<p class="cluster-meta">
								Long-tail patterns not in the top {TOP_K}. Each contains a handful of voters with
								unique approval sets.
							</p>
						{:else}
							{@const approvals = cl.approvals.map(findLargeCandidate)}
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

					<div class="cluster-lanes">
						<p class="panel-label">Cluster voice remaining</p>
						<div class="lanes-row">
							{#each clusters as cl}
								{@const w = round.clusterMeanWeights[cl.id]}
								<div class="lane" style="flex: {cl.voterIds.length} 0 0;">
									<div class="lane-track">
										<div
											class="lane-fill"
											style="height:{Math.max(w * 100, 4)}%; background:{cl.color};"
											title="{cl.label}: {cl.voterIds.length} voters at ×{w.toFixed(2)}"
										></div>
									</div>
									<span class="lane-label">{cl.voterIds.length} ×{weightLabel(w).slice(1)}</span>
								</div>
							{/each}
						</div>
					</div>

					<div class="score-panel">
						<p class="panel-label">Reweighted scores (segmented by cluster)</p>
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
												{@const cl = findCluster(seg.clusterId)}
												<div
													class="bar-seg"
													style="width:{(seg.value / maxScore) * 100}%; background:{cl.color};"
													title="{cl.label}: {seg.value.toFixed(1)}"
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
							→ The clusters whose ballots include <strong>{round.winner.name}</strong> drop in
							voice for round {r + 2}. The next winner emerges from whichever clusters still have
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

	/* Cluster ballot cards (realistic-scale section) */
	.cluster-card {
		background: var(--surface-raised);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		padding: 1rem 1.2rem;
	}

	.cluster-card header {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin-bottom: 0.6rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px dashed var(--border-color);
	}

	.cluster-swatch {
		width: 1rem;
		height: 1rem;
		border-radius: 3px;
		flex-shrink: 0;
		border: 1px solid rgba(0, 0, 0, 0.15);
	}

	.cluster-title {
		display: flex;
		flex-direction: column;
		min-width: 0;
		flex: 1;
	}

	.cluster-title strong {
		color: var(--text-dark);
		font-size: 0.95rem;
		font-weight: 600;
	}

	.cluster-title small {
		color: var(--text-soft);
		font-size: 0.78rem;
	}

	.cluster-card .approves {
		font-size: 0.85rem;
		color: var(--text-soft);
		margin: 0 0 0.4rem;
	}

	.cluster-card ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.cluster-card li {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
		color: var(--text-dark);
	}

	.cluster-meta {
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

	/* ===== Cluster lanes (per-round voice panel) ===== */
	.cluster-lanes {
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
		border-bottom: 1px solid var(--border-color);
	}

	.lane-fill {
		width: 100%;
		min-height: 3px;
		border-radius: 3px 3px 0 0;
		border: 1px solid rgba(0, 0, 0, 0.12);
		border-bottom: none;
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
