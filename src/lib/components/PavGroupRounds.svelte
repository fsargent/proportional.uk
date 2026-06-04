<script lang="ts">
	// Group-centric SPAV round-by-round: the electorate as ONE bar of group
	// slots (sized by share of all ballots). Each round the winner's backing
	// groups are reweighted, so their slot fill is "consumed" in the next bar.
	// Hover any slot for the group's identity, share, and current weight.
	//
	// Shared by /dev/pav-results and the live /proportional-approval page.
	import {
		runSPAVGrouped,
		buildGroupRoundViews,
		weightLabel,
		pctLabel,
		SAINTE_LAGUE,
		type Divisor
	} from '$lib/pav';
	import type { Candidate, Group, Voter, ApprovalTotal } from '$lib/data/synthetic-election';

	type Props = {
		voters: Voter[];
		candidates: Candidate[];
		groups: Group[];
		approvalTotals: ApprovalTotal[];
		seats: number;
		divisor?: Divisor;
	};
	let {
		voters,
		candidates,
		groups,
		approvalTotals,
		seats,
		divisor = SAINTE_LAGUE
	}: Props = $props();

	const electorateN = $derived(voters.length);
	const findGroup = (id: string) => groups.find((g) => g.id === id)!;
	const findCandidate = (id: string) => candidates.find((c) => c.id === id)!;

	const groupRoundViews = $derived(
		buildGroupRoundViews(
			runSPAVGrouped(voters, candidates, groups, seats, divisor).rounds,
			groups,
			approvalTotals,
			electorateN
		)
	);

	// Floating hover tooltip (same pattern as electionresults.uk PartyBars:
	// pointer-positioned bubble, segments tagged with data-seg-idx).
	type GeTip = {
		x: number;
		y: number;
		color: string;
		label: string;
		approves: string;
		voters: number;
		share: number;
		fill: number;
		backs: boolean;
	};
	let geTip = $state<GeTip | null>(null);

	function geMove(event: PointerEvent, ri: number) {
		const target = event.target;
		if (!(target instanceof Element)) {
			geTip = null;
			return;
		}
		const el = target.closest('[data-seg-idx]');
		if (!el) {
			geTip = null;
			return;
		}
		const slot = groupRoundViews[ri]?.slots[Number(el.getAttribute('data-seg-idx'))];
		if (!slot) {
			geTip = null;
			return;
		}
		const g = findGroup(slot.groupId);
		geTip = {
			x: event.clientX + window.scrollX,
			y: event.clientY + window.scrollY,
			color: slot.color,
			label: g.label,
			approves:
				g.approvals.map((id) => findCandidate(id).name.split(' ')[0]).join(', ') ||
				'mixed patterns',
			voters: g.voterIds.length,
			share: slot.share,
			fill: slot.fill,
			backs: slot.backsWinner
		};
	}

	function geLeave() {
		geTip = null;
	}
</script>

<div class="ge-rounds">
	{#each groupRoundViews as gr, ri (gr.seat)}
		<div class="ge-round">
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="ge-bar" onpointermove={(e) => geMove(e, ri)} onpointerleave={geLeave}>
				{#each gr.slots as s, i (s.groupId)}
					<div
						class="ge-slot"
						class:backs={s.backsWinner}
						data-seg-idx={i}
						style="flex:{s.share} 0 0;{s.backsWinner
							? ` border-bottom-color:${gr.winner.color};`
							: ''}"
					>
						<div class="ge-slot-track">
							<div class="ge-fill" style="width:{s.fill * 100}%; background:{s.color};"></div>
						</div>
					</div>
				{/each}
			</div>
			<div class="ge-round-head">
				<span class="ge-seat">{gr.seat}</span>
				<span class="ge-winner">
					<strong style="color:{gr.winner.color};">{gr.winner.name}</strong>
					<small>{gr.winner.party}</small> wins
				</span>
				<span class="ge-stats">
					<span
						class="ge-stat"
						title="Share of the reweighted electorate this round (reweighted score in parentheses)"
					>
						reweighted <strong>{pctLabel(gr.winnerShare)}</strong>
						<span class="ge-count">({gr.liveScore.toFixed(1)})</span>
					</span>
					<span
						class="ge-stat ge-stat-raw"
						title="Share of all ballots (approval count in parentheses)"
					>
						raw <strong>{pctLabel(gr.rawShare)}</strong>
						<span class="ge-count">({gr.rawApprovals})</span>
					</span>
				</span>
			</div>
		</div>
	{/each}
</div>
<p class="ge-foot">
	A slot outlined below in the winner's colour is a group that backed that seat's winner — watch
	those slots lose fill in the next round as their weight is spent. Hover any slot for its group.
</p>

{#if geTip}
	<div class="ge-tip" style:left={`${geTip.x}px`} style:top={`${geTip.y}px`} role="tooltip">
		<div class="ge-tip-head">
			<span class="ge-tip-swatch" style:background-color={geTip.color}></span>
			{geTip.label}
		</div>
		<dl class="ge-tip-stats">
			<dt>Approves</dt>
			<dd>{geTip.approves}</dd>
			<dt>Of all ballots</dt>
			<dd>{pctLabel(geTip.share)} <span class="of">·</span> {geTip.voters} voters</dd>
			<dt>Weight now</dt>
			<dd>
				{weightLabel(geTip.fill)} <span class="of">·</span>
				{pctLabel(geTip.share * geTip.fill)} of electorate
			</dd>
			<dt>Backs winner</dt>
			<dd>{geTip.backs ? 'yes' : 'no'}</dd>
		</dl>
	</div>
{/if}

<style>
	.ge-rounds {
		display: flex;
		flex-direction: column;
		gap: 1.1rem;
	}

	.ge-round {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.ge-round-head {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		font-size: 0.88rem;
		color: var(--text-color);
	}

	.ge-seat {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 50%;
		background: var(--header-bg);
		color: var(--text-inverse, white);
		font-weight: 700;
		font-size: 0.8rem;
		flex-shrink: 0;
	}

	.ge-winner {
		flex: 1;
		min-width: 0;
	}

	.ge-winner small {
		color: var(--text-soft);
		font-size: 0.78rem;
	}

	.ge-stats {
		display: flex;
		gap: 0.75rem;
		font-size: 0.8rem;
		color: var(--text-soft);
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.ge-stat strong {
		color: var(--text-dark);
		font-size: 0.92rem;
	}

	.ge-stat-raw {
		color: var(--text-soft);
	}

	.ge-count {
		font-size: 0.72rem;
		opacity: 0.75;
	}

	.ge-bar {
		display: flex;
		gap: 2px;
		height: 30px;
	}

	.ge-slot {
		min-width: 0;
		border-bottom: 3px solid transparent;
		padding-bottom: 2px;
		cursor: help;
	}

	.ge-slot-track {
		height: 100%;
		background: color-mix(in srgb, var(--surface-color) 60%, transparent);
		border: 1px solid var(--border-color);
		border-radius: 3px;
		overflow: hidden;
	}

	.ge-fill {
		height: 100%;
		transition: width 0.25s ease;
	}

	.ge-foot {
		margin: 0.9rem 0 0;
		font-size: 0.85rem;
		color: var(--text-soft);
		max-width: 52rem;
	}

	/* Floating hover tooltip (pattern adapted from electionresults.uk PartyBars) */
	.ge-tip {
		position: absolute;
		pointer-events: none;
		transform: translate(0.9rem, -100%);
		margin-top: -0.4rem;
		background: var(--header-bg);
		color: var(--text-inverse, white);
		padding: 0.5rem 0.7rem;
		border-radius: 6px;
		font-size: 0.85rem;
		line-height: 1.25;
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.22);
		z-index: 50;
		min-width: 12rem;
		max-width: 18rem;
	}

	.ge-tip-head {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-weight: 600;
		padding-bottom: 0.35rem;
		margin-bottom: 0.35rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.18);
	}

	.ge-tip-swatch {
		display: inline-block;
		width: 0.7rem;
		height: 0.7rem;
		border-radius: 2px;
		border: 1px solid rgba(255, 255, 255, 0.35);
		flex-shrink: 0;
	}

	.ge-tip-stats {
		display: grid;
		grid-template-columns: auto 1fr;
		column-gap: 0.7rem;
		row-gap: 0.15rem;
		margin: 0;
		font-size: 0.78rem;
		font-variant-numeric: tabular-nums;
	}

	.ge-tip-stats dt {
		opacity: 0.7;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		font-size: 0.7rem;
		align-self: center;
	}

	.ge-tip-stats dd {
		margin: 0;
		text-align: right;
		font-weight: 500;
	}

	.ge-tip-stats .of {
		opacity: 0.55;
		font-weight: 400;
	}

	@media (hover: none) {
		.ge-tip {
			display: none;
		}
	}
</style>
