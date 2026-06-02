/**
 * Minimal STV implementation using the Gregory fractional transfer method.
 *
 * Output shape matches what STVSankey.svelte expects: rounds with allocations,
 * transfers, and per-round elected/eliminated annotations. Each round's
 * allocations are the vote counts AT THE START of the round; transfers describe
 * what flows OUT of that round into the next.
 *
 * IMPORTANT for Sankey: elected candidates continue to APPEAR in subsequent
 * rounds holding their "quota" weight (or final-fill count). Without this, the
 * Sankey shows them dropping to zero and the carryover ribbon disappears — which
 * is the bug this implementation specifically fixes.
 */

import type { Candidate, Voter } from './data/synthetic-election';

export const EXHAUSTED = 'X';

export type STVTransfer = {
	from: string;
	to: string;
	count: number;
	type: 'surplus' | 'elimination';
};

export type STVRound = {
	allocations: { allocatee: string; votes: number }[];
	transfers: STVTransfer[];
	electedThisRound?: string[];
	eliminatedThisRound?: string[];
};

type Ballot = {
	weight: number;
	ranking: string[];
	preferenceIdx: number;
};

export type STVResult = {
	rounds: STVRound[];
	elected: string[];
	quota: number;
};

export function runSTV(
	voters: Voter[],
	candidates: Candidate[],
	seats: number
): STVResult {
	const ballots: Ballot[] = voters.map((v) => ({
		weight: 1.0,
		ranking: v.ranking,
		preferenceIdx: 0
	}));

	const elected: string[] = [];
	const electedSet = new Set<string>();
	const eliminatedSet = new Set<string>();
	const rounds: STVRound[] = [];

	// Once a candidate is elected, they "hold" this many votes in all subsequent
	// rounds (= quota for surplus-transfer wins, or their final tally for
	// remaining-seat fills). The Sankey uses these to draw carryover ribbons.
	const heldVotes: Record<string, number> = {};

	const totalVotes = ballots.length;
	const quota = Math.floor(totalVotes / (seats + 1)) + 1;

	function advance(b: Ballot): void {
		while (
			b.preferenceIdx < b.ranking.length &&
			(electedSet.has(b.ranking[b.preferenceIdx]) ||
				eliminatedSet.has(b.ranking[b.preferenceIdx]))
		) {
			b.preferenceIdx++;
		}
	}

	function currentPref(b: Ballot): string | null {
		advance(b);
		return b.preferenceIdx < b.ranking.length ? b.ranking[b.preferenceIdx] : null;
	}

	function tally(): { counts: Record<string, number>; exhausted: number } {
		const counts: Record<string, number> = {};
		for (const c of candidates) counts[c.id] = 0;
		let exhausted = 0;
		for (const b of ballots) {
			const pref = currentPref(b);
			if (pref) counts[pref] += b.weight;
			else exhausted += b.weight;
		}
		return { counts, exhausted };
	}

	// Build a round's allocations using:
	// - tallied weight for non-elected, non-eliminated candidates
	// - heldVotes for already-elected candidates (so carryover renders)
	// - tallied weight for a candidate being elected THIS round (their gross vote)
	function buildAllocations(
		counts: Record<string, number>,
		exhausted: number,
		justElected: string | null
	): { allocatee: string; votes: number }[] {
		const allocs: { allocatee: string; votes: number }[] = [];
		for (const c of candidates) {
			if (eliminatedSet.has(c.id)) continue;
			let votes: number;
			if (c.id === justElected) {
				// Currently being elected: show their full vote (pre-transfer).
				votes = counts[c.id];
			} else if (heldVotes[c.id] !== undefined) {
				// Already elected in a prior round: show what they hold.
				votes = heldVotes[c.id];
			} else {
				votes = counts[c.id];
			}
			allocs.push({ allocatee: c.id, votes: Math.round(votes) });
		}
		if (exhausted > 0.5) {
			allocs.push({ allocatee: EXHAUSTED, votes: Math.round(exhausted) });
		}
		return allocs;
	}

	let safety = 0;
	while (elected.length < seats && safety < 200) {
		safety++;

		const { counts, exhausted } = tally();

		const remaining = candidates.filter(
			(c) => !electedSet.has(c.id) && !eliminatedSet.has(c.id)
		);
		if (remaining.length === 0) break;

		// Special case: if remaining candidates ≤ seats still to fill, elect them all.
		if (remaining.length <= seats - elected.length) {
			const sorted = [...remaining].sort(
				(a, b) => counts[b.id] - counts[a.id] || a.id.localeCompare(b.id)
			);
			const electedThisRound: string[] = [];
			// Allocations show each remaining candidate at their final tally.
			const allocations = buildAllocations(counts, exhausted, null);
			for (const c of sorted) {
				if (elected.length >= seats) break;
				elected.push(c.id);
				electedSet.add(c.id);
				electedThisRound.push(c.id);
				heldVotes[c.id] = Math.round(counts[c.id]);
			}
			rounds.push({ allocations, transfers: [], electedThisRound });
			break;
		}

		const overQuota = remaining
			.filter((c) => counts[c.id] >= quota)
			.sort((a, b) => counts[b.id] - counts[a.id] || a.id.localeCompare(b.id));

		if (overQuota.length > 0) {
			// Elect the highest, then transfer their surplus (Gregory).
			const winner = overQuota[0];
			const winnerVotes = counts[winner.id];
			const surplus = winnerVotes - quota;
			const transferFactor = winnerVotes > 0 ? surplus / winnerVotes : 0;

			// Allocations for THIS round show winner at their gross tally.
			const allocations = buildAllocations(counts, exhausted, winner.id);

			// Identify ballots currently pointing at winner BEFORE marking them elected.
			const ballotsForWinner: Ballot[] = [];
			for (const b of ballots) {
				if (currentPref(b) === winner.id) ballotsForWinner.push(b);
			}

			electedSet.add(winner.id);
			elected.push(winner.id);
			heldVotes[winner.id] = quota; // they hold quota in subsequent rounds

			const dest: Record<string, number> = {};
			let exhaustedFromTransfer = 0;
			for (const b of ballotsForWinner) {
				const newWeight = b.weight * transferFactor;
				b.weight = newWeight;
				b.preferenceIdx++;
				advance(b);
				const nextPref =
					b.preferenceIdx < b.ranking.length ? b.ranking[b.preferenceIdx] : null;
				if (nextPref) {
					dest[nextPref] = (dest[nextPref] ?? 0) + newWeight;
				} else {
					exhaustedFromTransfer += newWeight;
				}
			}

			const transfers: STVTransfer[] = Object.entries(dest)
				.filter(([, count]) => Math.round(count) > 0)
				.map(([to, count]) => ({
					from: winner.id,
					to,
					count: Math.round(count),
					type: 'surplus' as const
				}));
			if (Math.round(exhaustedFromTransfer) > 0) {
				transfers.push({
					from: winner.id,
					to: EXHAUSTED,
					count: Math.round(exhaustedFromTransfer),
					type: 'surplus'
				});
			}

			rounds.push({ allocations, transfers, electedThisRound: [winner.id] });
		} else {
			// Eliminate the lowest, transfer their ballots at full weight.
			const sorted = [...remaining].sort(
				(a, b) => counts[a.id] - counts[b.id] || a.id.localeCompare(b.id)
			);
			const loser = sorted[0];

			const allocations = buildAllocations(counts, exhausted, null);

			const ballotsForLoser: Ballot[] = [];
			for (const b of ballots) {
				if (currentPref(b) === loser.id) ballotsForLoser.push(b);
			}

			eliminatedSet.add(loser.id);

			const dest: Record<string, number> = {};
			let exhaustedFromTransfer = 0;
			for (const b of ballotsForLoser) {
				b.preferenceIdx++;
				advance(b);
				const nextPref =
					b.preferenceIdx < b.ranking.length ? b.ranking[b.preferenceIdx] : null;
				if (nextPref) {
					dest[nextPref] = (dest[nextPref] ?? 0) + b.weight;
				} else {
					exhaustedFromTransfer += b.weight;
				}
			}

			const transfers: STVTransfer[] = Object.entries(dest)
				.filter(([, count]) => Math.round(count) > 0)
				.map(([to, count]) => ({
					from: loser.id,
					to,
					count: Math.round(count),
					type: 'elimination' as const
				}));
			if (Math.round(exhaustedFromTransfer) > 0) {
				transfers.push({
					from: loser.id,
					to: EXHAUSTED,
					count: Math.round(exhaustedFromTransfer),
					type: 'elimination'
				});
			}

			rounds.push({ allocations, transfers, eliminatedThisRound: [loser.id] });
		}
	}

	return { rounds, elected, quota };
}
