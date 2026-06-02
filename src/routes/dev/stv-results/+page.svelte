<script lang="ts">
	import SampleBallot from '$lib/components/SampleBallot.svelte';
	import STVSankey from '$lib/components/STVSankey.svelte';
	import {
		candidates,
		voters,
		seats,
		groups,
		spectrumOrder,
		findCandidate,
		TOP_K
	} from '$lib/data/synthetic-election';
	import { runSTV } from '$lib/stv';

	const stv = runSTV(voters, candidates, seats);
	const stvWinners = new Set(stv.elected);

	// FPTP / "Choose One" comparison: count each voter's FIRST preference only.
	// These are ranked ballots, so the natural baseline is plurality on first
	// preferences (not approval totals — there are no approvals).
	const firstPrefTotals = candidates
		.map((c) => ({
			id: c.id,
			count: voters.reduce((s, v) => s + (v.ranking[0] === c.id ? 1 : 0), 0)
		}))
		.sort((a, b) => b.count - a.count || a.id.localeCompare(b.id));
	const fptpWinners = new Set(firstPrefTotals.slice(0, seats).map((t) => t.id));

	// Re-order first-preference totals to spectrum order for the chart.
	const spectrumFirstPrefs = spectrumOrder.map(
		(id) => firstPrefTotals.find((t) => t.id === id)!
	);
	const spectrumMax = Math.max(...spectrumFirstPrefs.map((t) => t.count));

	// For the Sankey: it takes a `Candidate` type with id, name, party.
	const sankeyCandidates = candidates.map((c) => ({ id: c.id, name: c.name, party: c.party }));

	// Pick a representative voter to show as a sample ballot — the largest group's
	// first voter.
	const sampleVoter = voters.find((v) => v.id === groups[0].voterIds[0])!;

	// Per-round summaries (concise English).
	function summariseRound(r: (typeof stv.rounds)[number], idx: number): string {
		const num = idx + 1;
		if (r.electedThisRound && r.electedThisRound.length > 0) {
			const names = r.electedThisRound.map((id) => findCandidate(id).name).join(', ');
			if (r.transfers.length > 0) {
				const surplusTotal = r.transfers.reduce((s, t) => s + t.count, 0);
				return `Round ${num}: ${names} elected with ≥ quota (${stv.quota}). Surplus of ${surplusTotal} votes transferred to next preferences.`;
			}
			return `Round ${num}: ${names} elected (final remaining-seat fill).`;
		}
		if (r.eliminatedThisRound && r.eliminatedThisRound.length > 0) {
			const name = findCandidate(r.eliminatedThisRound[0]).name;
			const transferTotal = r.transfers.reduce((s, t) => s + t.count, 0);
			return `Round ${num}: No one over quota. ${name} eliminated; ${transferTotal} ballots transferred.`;
		}
		return `Round ${num}: no action.`;
	}
</script>

<svelte:head>
	<title>Dev — STV results sketch</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main>
	<header class="page-header">
		<h1>Single Transferable Vote — results sketch</h1>
		<p class="subtitle">
			Same {voters.length}-voter, {candidates.length}-candidate, {seats}-seat election as
			<a href="/dev/pav-results/">/dev/pav-results</a>, but counted with STV instead of PAV. The
			ballots are auto-grouped the same way; only the algorithm differs.
		</p>
		<p class="setup">
			<strong>{seats} seats</strong> · {voters.length} voters · {candidates.length} candidates ·
			Droop quota = <strong>{stv.quota}</strong>
		</p>
	</header>

	<section>
		<h2>A voter's ballot — ranking, not approval</h2>
		<p class="section-intro">
			STV uses ordered rankings (1, 2, 3 …) rather than an unordered approval set. We derive each
			voter's ranking from their archetype's preference order, so the same voter who appears as the
			top group in PAV appears here with the same candidates ranked.
		</p>
		<SampleBallot
			candidates={sankeyCandidates}
			ranking={sampleVoter.ranking}
			title="Sample ranked ballot"
		/>
	</section>

	<section>
		<h2>First-preference counts vs FPTP / Choose One</h2>
		<p class="section-intro">
			Each voter's FIRST preference only — what plurality (FPTP / Choose One, where you pick exactly
			one candidate) would count. The dashed gold lines bracket the {seats} candidates FPTP would
			elect (the top {seats} by first-preference count). The ★ marker shows STV winners — they
			spread across the spectrum by using subsequent preferences as transfers, instead of letting
			the largest first-preference bloc sweep.
		</p>
		<div class="spectrum-chart">
			{#each spectrumFirstPrefs as t, i}
				{@const c = findCandidate(t.id)}
				{@const isFPTP = fptpWinners.has(c.id)}
				{@const isSTV = stvWinners.has(c.id)}
				{@const prevIsFPTP =
					i > 0 && fptpWinners.has(findCandidate(spectrumFirstPrefs[i - 1].id).id)}
				{@const showPartition = i > 0 && isFPTP !== prevIsFPTP}
				<div class="spectrum-col" class:partition-before={showPartition}>
					<div class="spectrum-marker">
						{#if isSTV}<span class="stv-mark" title="STV winner">★</span>{/if}
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
	</section>

	<section>
		<h2>How each seat was filled — STV count</h2>
		<p class="section-intro">
			Round-by-round Sankey diagram. Each candidate's first-preference vote total is shown for each
			round; transfers (surplus or elimination) move between rounds. Exhausted ballots (no further
			preferences) land in the grey "Exhausted" column.
		</p>
		<STVSankey
			candidates={sankeyCandidates}
			rounds={stv.rounds}
			{seats}
			totalVotes={voters.length}
			ariaLabel="STV count flow diagram for the synthetic election"
		/>

		<ol class="round-summary">
			{#each stv.rounds as r, i (i)}
				<li>{summariseRound(r, i)}</li>
			{/each}
		</ol>
	</section>

	<section>
		<h2>Final winners</h2>
		<ol class="winner-list">
			{#each stv.elected as id, i}
				{@const c = findCandidate(id)}
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

	<section>
		<h2>Voter groups</h2>
		<p class="section-intro">
			For reference — the same auto-grouping by exact ballot pattern used in the PAV view (top {TOP_K}
			patterns + "Other").
		</p>
		<div class="group-grid">
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
							Long-tail patterns not in the top {TOP_K}.
						</p>
					{:else}
						<p class="approves">Ranks (in order):</p>
						<ol class="ranking-list">
							{#each grp.approvals as id}
								{@const c = findCandidate(id)}
								<li>
									<span class="dot" style="background:{c.color}"></span>{c.name}
								</li>
							{/each}
						</ol>
					{/if}
				</div>
			{/each}
		</div>
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
	}

	.section-intro {
		color: var(--text-soft);
		margin: 0 0 1rem;
		max-width: 52rem;
	}

	/* Spectrum chart */
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

	.stv-mark {
		font-weight: 700;
		color: #d4af37;
		font-size: 1.3rem;
	}

	.spectrum-bar {
		height: 200px;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: flex-end;
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

	/* Round summary list */
	.round-summary {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		margin: 1.25rem 0 0;
		padding-left: 1.25rem;
		color: var(--text-color);
		font-size: 0.92rem;
		line-height: 1.55;
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

	/* Group grid (compact reference) */
	.group-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1rem;
	}

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
	}

	.group-title small {
		color: var(--text-soft);
		font-size: 0.78rem;
	}

	.approves {
		font-size: 0.85rem;
		color: var(--text-soft);
		margin: 0 0 0.4rem;
	}

	.ranking-list {
		margin: 0;
		padding-left: 1.4rem;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		font-size: 0.9rem;
		color: var(--text-dark);
	}

	.dot {
		display: inline-block;
		width: 0.7rem;
		height: 0.7rem;
		border-radius: 50%;
		margin-right: 0.4rem;
		vertical-align: middle;
	}

	.group-meta {
		font-size: 0.85rem;
		color: var(--text-soft);
		margin: 0;
		font-style: italic;
	}
</style>
