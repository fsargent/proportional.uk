<script lang="ts">
	// "Who represents whom" — the fairness view. For each winner: how much of the
	// electorate it represents (each voter assigned to the first winner they
	// approved). For each high-approval near-miss: why it missed (its voters are
	// already represented). Plus the raw-count counterfactual.
	import { runSPAVGrouped, buildGroupRoundViews, pctLabel, SAINTE_LAGUE, type Divisor } from '$lib/pav';
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

	const findCandidate = (id: string) => candidates.find((c) => c.id === id)!;
	const findGroup = (id: string) => groups.find((g) => g.id === id)!;
	const rawApprovalOf = (id: string) => approvalTotals.find((t) => t.id === id)?.count ?? 0;

	const model = $derived.by(() => {
		const electorateN = voters.length;
		const { rounds, elected } = runSPAVGrouped(voters, candidates, groups, seats, divisor);
		const groupRoundViews = buildGroupRoundViews(rounds, groups, approvalTotals, electorateN);
		const pavWinners = new Set(elected);
		const avWinners = new Set(approvalTotals.slice(0, seats).map((t) => t.id));

		const groupOfVoter = new Map<string, string>();
		groups.forEach((g) => g.voterIds.forEach((vid) => groupOfVoter.set(vid, g.id)));

		// Each voter is represented by the FIRST winner (in seat order) they approved.
		const repOfVoter = new Map<string, string | null>();
		voters.forEach((v) =>
			repOfVoter.set(v.id, elected.find((id) => v.approvals.includes(id)) ?? null)
		);
		const unrepresented = voters.filter((v) => repOfVoter.get(v.id) === null).length;

		const winnerReps = elected.map((id, i) => {
			const repd = voters.filter((v) => repOfVoter.get(v.id) === id);
			const byGroupMap = new Map<string, number>();
			repd.forEach((v) => {
				const gid = groupOfVoter.get(v.id) ?? 'other';
				byGroupMap.set(gid, (byGroupMap.get(gid) ?? 0) + 1);
			});
			return {
				id,
				candidate: findCandidate(id),
				rawShare: rawApprovalOf(id) / electorateN,
				reweightedShare: groupRoundViews[i].winnerShare,
				represented: repd.length,
				byGroup: [...byGroupMap.entries()]
					.map(([groupId, count]) => ({ groupId, color: findGroup(groupId).color, count }))
					.sort((a, b) => b.count - a.count)
			};
		});

		// Near-misses: non-winners whose RAW approvals beat at least one winner's.
		const minWinnerApprovals = Math.min(...winnerReps.map((w) => rawApprovalOf(w.id)));
		const nearMisses = approvalTotals
			.filter((t) => !pavWinners.has(t.id) && t.count > minWinnerApprovals)
			.map((t) => {
				const approvers = voters.filter((v) => v.approvals.includes(t.id));
				const byRepMap = new Map<string, number>();
				approvers.forEach((v) => {
					const r = repOfVoter.get(v.id);
					if (r) byRepMap.set(r, (byRepMap.get(r) ?? 0) + 1);
				});
				return {
					candidate: findCandidate(t.id),
					approvals: t.count,
					totalApprovers: approvers.length,
					alreadyRepresented: approvers.filter((v) => repOfVoter.get(v.id) !== null).length,
					byRep: [...byRepMap.entries()]
						.map(([id, count]) => ({ candidate: findCandidate(id), count }))
						.sort((a, b) => b.count - a.count)
				};
			});

		const droppedByPav = approvalTotals
			.slice(0, seats)
			.filter((t) => !pavWinners.has(t.id))
			.map((t) => findCandidate(t.id));
		const addedByPav = elected.filter((id) => !avWinners.has(id)).map(findCandidate);

		return { winnerReps, nearMisses, droppedByPav, addedByPav, unrepresented };
	});
</script>

<p class="re-subhead">Each seat's mandate</p>
<div class="rep-grid">
	{#each model.winnerReps as w (w.id)}
		<div class="rep-card" style="border-left:5px solid {w.candidate.color};">
			<div class="rep-head">
				<strong>{w.candidate.name}</strong>
				<small>{w.candidate.party}</small>
			</div>
			<p class="rep-stat">
				raw approval <strong>{pctLabel(w.rawShare)}</strong> · reweighted
				<strong>{pctLabel(w.reweightedShare)}</strong>
				<span class="rep-sub">· represents {w.represented} voters</span>
			</p>
			<div class="rep-bar" title="Groups represented by {w.candidate.name}">
				{#each w.byGroup as bg (bg.groupId)}
					<div
						class="rep-seg"
						style="width:{(bg.count / w.represented) * 100}%; background:{bg.color};"
						title="{findGroup(bg.groupId).label}: {bg.count}"
					></div>
				{/each}
			</div>
		</div>
	{/each}
</div>

{#if model.nearMisses.length}
	<p class="re-subhead">“But they got more votes!” — why the top-approval names didn't all win</p>
	<div class="nearmiss-list">
		{#each model.nearMisses as nm (nm.candidate.id)}
			{@const pct = Math.round((nm.alreadyRepresented / nm.totalApprovers) * 100)}
			{@const first = nm.candidate.name.split(' ')[0]}
			<div class="nearmiss-card">
				<p class="nm-head">
					<strong>{nm.candidate.name}</strong>
					<small>{nm.candidate.party}</small> — {nm.approvals} approvals, no seat
				</p>
				<p class="nm-body">
					{pct}% of {first}'s approvers are <strong>already represented</strong> by
					{#each nm.byRep.slice(0, 2) as br, i (br.candidate.id)}{i > 0
							? ' and '
							: ''}<strong style="color:{br.candidate.color}">{br.candidate.name}</strong>{/each}, whom
					they also approved. Seating {first} as well would give those voters a second voice while
					others still had none.
				</p>
				<div class="nm-bar" title="{pct}% of approvers already represented">
					<div class="nm-fill" style="width:{pct}%;"></div>
				</div>
			</div>
		{/each}
	</div>
{/if}

<p class="re-subhead">The raw-count alternative would shut groups out</p>
<p class="counterfactual">
	Counting raw approvals alone (straight Approval Voting) would seat
	{#each model.droppedByPav as c, i (c.id)}{i > 0 ? ', ' : ''}<strong>{c.name}</strong>{/each}
	instead of
	{#each model.addedByPav as c, i (c.id)}{i > 0 ? ', ' : ''}<strong style="color:{c.color}"
			>{c.name}</strong
		>{/each}. That packs the chamber around the centre-left bulge and leaves the
	{model.addedByPav.map((c) => c.party).join(' and ')} with no seat at all. PAV's reweighting is exactly
	what gives those voters representation.{#if model.unrepresented > 0}&nbsp;(Even so, {model.unrepresented}
		voters approved none of the eventual winners — proportional, not perfect.){/if}
</p>

<style>
	.re-subhead {
		font-size: 1rem;
		color: var(--text-dark);
		font-weight: 600;
		margin: 1.75rem 0 0.75rem;
	}

	.rep-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 0.75rem;
		min-width: 0;
	}

	.rep-card {
		background: var(--surface-raised);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		padding: 0.8rem 1rem;
		min-width: 0;
	}

	.rep-head {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-bottom: 0.3rem;
		min-width: 0;
	}

	.rep-head strong {
		color: var(--text-dark);
	}

	.rep-head small {
		color: var(--text-soft);
		font-size: 0.78rem;
	}

	.rep-stat {
		margin: 0 0 0.5rem;
		font-size: 0.9rem;
		color: var(--text-color);
	}

	.rep-stat strong {
		color: var(--text-dark);
		font-size: 1.05rem;
	}

	.rep-sub {
		color: var(--text-soft);
		font-size: 0.8rem;
	}

	.rep-bar {
		display: flex;
		height: 10px;
		border-radius: 999px;
		overflow: hidden;
		border: 1px solid var(--border-color);
	}

	.rep-seg {
		height: 100%;
		border-right: 1px solid rgba(255, 255, 255, 0.7);
	}

	.rep-seg:last-child {
		border-right: none;
	}

	.nearmiss-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.nearmiss-card {
		background: color-mix(in srgb, var(--surface-color) 90%, white);
		border: 1px solid var(--border-color);
		border-left: 3px solid var(--text-soft);
		border-radius: var(--radius-sm);
		padding: 0.75rem 1rem;
		min-width: 0;
	}

	.nm-head {
		margin: 0 0 0.35rem;
		font-size: 0.95rem;
		color: var(--text-dark);
	}

	.nm-head small {
		color: var(--text-soft);
		font-size: 0.78rem;
		font-weight: 400;
	}

	.nm-body {
		margin: 0 0 0.6rem;
		font-size: 0.9rem;
		color: var(--text-color);
		line-height: 1.5;
	}

	.nm-bar {
		height: 8px;
		background: var(--surface-color);
		border: 1px solid var(--border-color);
		border-radius: 999px;
		overflow: hidden;
	}

	.nm-fill {
		height: 100%;
		background: var(--header-bg);
		border-radius: 999px;
	}

	.counterfactual {
		margin: 0;
		padding: 0.85rem 1rem;
		background: var(--surface-subtle-gradient, var(--surface-color));
		border-left: 3px solid var(--header-bg);
		border-radius: var(--radius-sm);
		font-size: 0.95rem;
		color: var(--text-color);
		line-height: 1.55;
		max-width: 52rem;
	}

	@media (max-width: 640px) {
		.rep-grid {
			grid-template-columns: 1fr;
		}

		.rep-card,
		.nearmiss-card,
		.counterfactual {
			padding-inline: 0.85rem;
		}
	}
</style>
