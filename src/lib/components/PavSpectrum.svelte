<script lang="ts">
	// "Approvals across the political spectrum": candidates ordered left→right by
	// political position, bars = raw approvals. Dashed gold lines bracket the
	// group straight Approval Voting would elect (top-N by raw approvals); the ▼
	// marks the proportional (PAV) winners, which spread across the spectrum.
	import { runSPAVGrouped, SAINTE_LAGUE, type Divisor } from '$lib/pav';
	import type { Candidate, Group, Voter, ApprovalTotal } from '$lib/data/synthetic-election';

	type Props = {
		voters: Voter[];
		candidates: Candidate[];
		groups: Group[];
		approvalTotals: ApprovalTotal[];
		spectrumTotals: ApprovalTotal[];
		seats: number;
		divisor?: Divisor;
	};
	let {
		voters,
		candidates,
		groups,
		approvalTotals,
		spectrumTotals,
		seats,
		divisor = SAINTE_LAGUE
	}: Props = $props();

	const findCandidate = (id: string) => candidates.find((c) => c.id === id)!;
	const avWinners = $derived(new Set(approvalTotals.slice(0, seats).map((t) => t.id)));
	const pavWinners = $derived(
		new Set(runSPAVGrouped(voters, candidates, groups, seats, divisor).elected)
	);
	const spectrumMax = $derived(Math.max(...spectrumTotals.map((t) => t.count)));
</script>

<div class="spectrum-chart">
	{#each spectrumTotals as t, i}
		{@const c = findCandidate(t.id)}
		{@const isPAV = pavWinners.has(c.id)}
		{@const prevIsAV = i > 0 && avWinners.has(findCandidate(spectrumTotals[i - 1].id).id)}
		{@const showPartition = i > 0 && avWinners.has(c.id) !== prevIsAV}
		<div class="spectrum-col" class:partition-before={showPartition}>
			<div class="spectrum-marker">
				{#if isPAV}<span class="pav-mark" title="Proportional (PAV) winner">▼</span>{/if}
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
		<span class="legend-swatch legend-swatch-av"></span>Dashed lines bracket Approval Voting's winning
		group (top {seats} by raw approvals)
	</span>
	<span class="legend-chip">
		<span class="legend-swatch legend-swatch-pav">▼</span>Proportional winners (after reweighting)
	</span>
</div>

<style>
	.spectrum-chart {
		display: flex;
		align-items: flex-end;
		gap: 0.5rem;
		margin: 1.25rem 0 0.4rem;
		padding-bottom: 0.3rem;
		border-bottom: 2px solid var(--border-strong);
		min-width: 0;
		max-width: 100%;
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

	/* Dashed vertical line marking the AV-winning group boundary, in the gap to
	   the LEFT of this column. */
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
		gap: 0.5rem;
		font-size: 0.75rem;
		color: var(--text-soft);
		margin-top: 0.3rem;
		letter-spacing: 0.02em;
	}

	.spectrum-axis span {
		min-width: 0;
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

	@media (max-width: 640px) {
		.spectrum-chart {
			gap: 0.35rem;
		}

		.spectrum-bar {
			height: 160px;
		}

		.spectrum-label strong {
			font-size: 0.72rem;
		}

		.spectrum-label small {
			font-size: 0.62rem;
		}

		.spectrum-axis {
			font-size: 0.68rem;
		}
	}
</style>
