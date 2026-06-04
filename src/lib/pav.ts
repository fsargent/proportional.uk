/**
 * Sequential Proportional Approval (SPAV) — shared algorithm + view helpers.
 *
 * Extracted from the /dev/pav-results sketch so the same computation backs both
 * that page and the live /proportional-approval method page (via the
 * PavGroupRounds component). Reweighting uses Sainte-Laguë divisors by default
 * (1 / (1 + 2k): a ballot counts ×1, then ×⅓, ×⅕, … as more of its approved
 * candidates win) — the benchmark the site recommends for UK comparisons.
 */
import type { Candidate, Group, Voter, ApprovalTotal } from '$lib/data/synthetic-election';

export type Divisor = (k: number) => number;
/** Sainte-Laguë / Webster divisors: 1, ⅓, ⅕, ⅐ … (site default). */
export const SAINTE_LAGUE: Divisor = (k) => 1 / (1 + 2 * k);
/** D'Hondt / Jefferson divisors: 1, ½, ⅓, ¼ … (classic SPAV). */
export const DHONDT: Divisor = (k) => 1 / (1 + k);

export type GroupRound = {
	winner: Candidate;
	groupMeanWeights: Record<string, number>;
	scores: Array<{
		id: string;
		score: number;
		segments: Array<{ groupId: string; value: number }>;
	}>;
};

/**
 * Run grouped SPAV. Each round reweights every voter by `divisor(k)` where k is
 * how many already-elected candidates they approved, scores remaining
 * candidates (broken down per group), elects the top scorer, and repeats.
 */
export function runSPAVGrouped(
	voters: Voter[],
	candidates: Candidate[],
	groups: Group[],
	seats: number,
	divisor: Divisor = SAINTE_LAGUE
): { rounds: GroupRound[]; elected: string[] } {
	const voterMap = new Map(voters.map((v) => [v.id, v]));
	const elected: string[] = [];
	const rounds: GroupRound[] = [];

	for (let r = 0; r < seats; r++) {
		const perVoterWeights: Record<string, number> = {};
		voters.forEach((v) => {
			const k = v.approvals.filter((a) => elected.includes(a)).length;
			perVoterWeights[v.id] = divisor(k);
		});

		const groupMeanWeights: Record<string, number> = {};
		groups.forEach((grp) => {
			const totalW = grp.voterIds.reduce((s, vid) => s + perVoterWeights[vid], 0);
			groupMeanWeights[grp.id] = totalW / grp.voterIds.length;
		});

		const scores = candidates
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

		const winner = candidates.find((c) => c.id === scores[0].id)!;
		elected.push(winner.id);
		rounds.push({ winner, groupMeanWeights, scores });
	}

	return { rounds, elected };
}

export type GroupRoundView = {
	seat: number;
	winner: Candidate;
	liveScore: number; // winner's reweighted score this round
	winnerShare: number; // winner's score / live total weight
	rawApprovals: number; // winner's unweighted approval count
	rawShare: number; // rawApprovals / electorate
	liveShare: number; // live total weight / initial total
	slots: Array<{
		groupId: string;
		color: string;
		share: number; // slot width = initial share of electorate
		fill: number; // 0..1, fraction of this group's weight still live
		backsWinner: boolean;
	}>;
};

/**
 * Build the group-centric view used by PavGroupRounds: the electorate as one
 * bar of group slots, each filled by the share of its weight still live, with
 * the winner's reweighted vs raw share per seat.
 */
export function buildGroupRoundViews(
	rounds: GroupRound[],
	groups: Group[],
	approvalTotals: ApprovalTotal[],
	electorateN: number
): GroupRoundView[] {
	const rawApprovalOf = (id: string) => approvalTotals.find((t) => t.id === id)?.count ?? 0;
	return rounds.map((round, r) => {
		const liveTotal = groups.reduce(
			(s, g) => s + round.groupMeanWeights[g.id] * g.voterIds.length,
			0
		);
		return {
			seat: r + 1,
			winner: round.winner,
			liveScore: round.scores[0].score,
			winnerShare: round.scores[0].score / liveTotal,
			rawApprovals: rawApprovalOf(round.winner.id),
			rawShare: rawApprovalOf(round.winner.id) / electorateN,
			liveShare: liveTotal / electorateN,
			slots: groups.map((g) => ({
				groupId: g.id,
				color: g.color,
				share: g.voterIds.length / electorateN,
				fill: round.groupMeanWeights[g.id],
				// Only uniform groups (shared approval set) wholly back the winner.
				// "Other" has an empty shared set → never marked, so we don't imply
				// every mixed-pattern ballot supported the winner.
				backsWinner: g.approvals.includes(round.winner.id)
			}))
		};
	});
}

/** Render a weight as a vulgar-fraction glyph (×⅓, ×⅕ …) within tolerance. */
export const weightLabel = (w: number): string => {
	const fracs: Array<[number, string]> = [
		[1, '×1'],
		[1 / 2, '×½'],
		[1 / 3, '×⅓'],
		[1 / 4, '×¼'],
		[1 / 5, '×⅕'],
		[1 / 6, '×⅙'],
		[1 / 7, '×⅐'],
		[1 / 9, '×⅑']
	];
	for (const [v, label] of fracs) if (Math.abs(w - v) < 0.01) return label;
	return `×${w.toFixed(2)}`;
};

export const pctLabel = (x: number): string => `${Math.round(x * 100)}%`;
