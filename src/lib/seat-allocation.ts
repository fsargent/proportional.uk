// Seat allocation logic for Proportional.uk
import { PARTY_META, type PartyMeta } from './config';

export interface PartyState {
	key: string;
	votes: number;
	seats: number;
	unspent: number;
	finalized: boolean;
	originalVotes: number;
}

export interface Transfer {
	from: string;
	fromName: string;
	to: string;
	toName: string;
	votes: number;
	reason: string;
}

export interface SeatAward {
	party: string;
	partyName: string;
	seats: number;
}

export interface RoundPartyState {
	name: string;
	votes: number;
	seats: number;
	unspent: number;
	finalized: boolean;
	currentVotes: number;
	originalVotes?: number;
}

export interface RoundData {
	number: number;
	type: string;
	description: string;
	parties: Record<string, RoundPartyState>;
	transfers: Transfer[];
	seatCost: number;
	seatsAllocated: number;
	seatsRemaining: number;
	totalSeats: number;
	thresholdVotes?: number;
	thresholdSeats?: number;
	totalVotes?: number;
	seatAwards?: SeatAward[];
}

export interface FinalParty {
	key: string;
	name: string;
	originalVotes: number;
	finalSeats: number;
	votesPerSeat: number;
}

export interface AllocationSummary {
	totalVotes: number;
	totalSeats: number;
	threshold: number;
	thresholdVotes: number;
	initialCostPerSeat: number;
	finalParties: FinalParty[];
}

export interface AllocationResult {
	seats: Record<string, number>;
	steps: string[];
	rounds: RoundData[];
	summary: AllocationSummary;
}

/**
 * Allocate seats using simple highest-averages method (D'Hondt)
 */
export function allocateSeatsFairShare(
	votesByParty: Record<string, number>,
	totalSeats = 650
): Record<string, number> {
	const quotients: { party: string; q: number }[] = [];
	Object.keys(votesByParty).forEach((party) => {
		const v = votesByParty[party];
		if (v > 0) {
			for (let d = 1; d <= totalSeats; d++) {
				quotients.push({ party, q: v / d });
			}
		}
	});

	quotients.sort((a, b) => b.q - a.q);
	const seats: Record<string, number> = {};
	Object.keys(votesByParty).forEach((p) => (seats[p] = 0));

	for (let i = 0; i < totalSeats; i++) {
		seats[quotients[i].party]++;
	}

	return seats;
}

/**
 * Allocate seats with transfers and detailed steps
 */
export function allocateSeatsFairShareTransfersWithSteps(
	votesByParty: Record<string, number>,
	totalSeats = 650,
	prefs: Record<string, string[]> = {},
	threshold = 0.05
): AllocationResult {
	// Deep copy votes
	const parties: Record<string, PartyState> = {};
	let grandTotal = 0;
	Object.keys(votesByParty).forEach((k) => {
		const v = Math.max(0, votesByParty[k] || 0);
		parties[k] = {
			key: k,
			votes: v,
			seats: 0,
			unspent: 0,
			finalized: false,
			originalVotes: v
		};
		grandTotal += v;
	});

	const thresholdVotes = threshold > 0 ? grandTotal * threshold : 0;
	const steps: string[] = [];
	const rounds: RoundData[] = [];
	let roundNumber = 0;

	function fmt(n: number): string {
		return Math.round(n).toLocaleString();
	}

	function seatsFilled(): number {
		return Object.values(parties).reduce((a, p) => a + p.seats, 0);
	}

	function totalUnspent(): number {
		return Object.values(parties).reduce((a, p) => a + (p.finalized ? 0 : p.unspent), 0);
	}

	function remainingSeats(): number {
		return totalSeats - seatsFilled();
	}

	function logRound(roundNum: number, description: string): void {
		steps.push(`🔄 Round ${roundNum}: ${description}`);
	}

	function logSeatCost(cost: number): void {
		steps.push(`Seat cost: ${fmt(cost)} votes per seat`);
	}

	function logSeatsAwarded(): void {
		const seatList = Object.values(parties)
			.filter((p) => !p.finalized)
			.map((p) => `${PARTY_META[p.key]?.name || p.key}: ${p.seats} seats, ${fmt(p.unspent)} unspent`)
			.join(', ');
		steps.push(`Seats awarded: ${seatList}`);
	}

	function logRemaining(): void {
		steps.push(`${seatsFilled()} of ${totalSeats} seats filled, ${remainingSeats()} seats remaining`);
	}

	function captureRoundState(roundType: string, description: string): RoundData {
		const roundData: RoundData = {
			number: roundNumber,
			type: roundType,
			description: description,
			parties: {},
			transfers: [],
			seatCost: 0,
			seatsAllocated: 0,
			seatsRemaining: remainingSeats(),
			totalSeats: seatsFilled()
		};

		Object.values(parties).forEach((p) => {
			roundData.parties[p.key] = {
				name: PARTY_META[p.key]?.name || p.key,
				votes: p.votes,
				seats: p.seats,
				unspent: p.unspent,
				finalized: p.finalized,
				currentVotes: p.finalized ? 0 : p.unspent
			};
		});

		return roundData;
	}

	// === ROUND 1: Initial Allocation ===
	roundNumber = 1;
	logRound(roundNumber, 'Initial Allocation');
	steps.push(`Total votes: ${fmt(grandTotal)} (realistic UK turnout)`);

	const initialCost = Math.round(grandTotal / totalSeats);
	logSeatCost(initialCost);

	const thresholdSeats = Math.ceil(thresholdVotes / initialCost);
	steps.push(`Threshold: ${(threshold * 100).toFixed(0)}% = minimum ${thresholdSeats} seats to qualify`);

	// Initial seat allocation
	Object.values(parties).forEach((p) => {
		p.seats = Math.floor(p.votes / initialCost);
		p.unspent = p.votes - p.seats * initialCost;
	});

	// Capture initial round state
	const initialRound = captureRoundState('initial', 'Initial Allocation');
	initialRound.seatCost = initialCost;
	initialRound.thresholdVotes = thresholdVotes;
	initialRound.thresholdSeats = thresholdSeats;
	initialRound.totalVotes = grandTotal;

	logSeatsAwarded();
	logRemaining();

	// Apply threshold: parties below threshold cannot keep seats
	const belowThreshold = Object.values(parties).filter((p) => p.votes < thresholdVotes);
	if (belowThreshold.length > 0) {
		steps.push(`Parties below threshold: ${belowThreshold.map((p) => PARTY_META[p.key]?.name || p.key).join(', ')}`);

		belowThreshold.forEach((p) => {
			if (p.seats > 0) {
				p.unspent += p.seats * initialCost;
				p.seats = 0;
			}
			const target = (prefs[p.key] || []).find((pk) => parties[pk] && !parties[pk].finalized);
			if (target) {
				parties[target].unspent += p.votes;
				steps.push(
					`${PARTY_META[p.key]?.name || p.key} below threshold transfers ${fmt(p.votes)} votes to ${PARTY_META[target]?.name || target}`
				);

				initialRound.transfers.push({
					from: p.key,
					fromName: PARTY_META[p.key]?.name || p.key,
					to: target,
					toName: PARTY_META[target]?.name || target,
					votes: p.votes,
					reason: 'below_threshold'
				});
			}
			p.unspent = 0;
			p.finalized = true;
		});
	}

	rounds.push(initialRound);

	// === MAIN ROUNDS ===
	while (seatsFilled() < totalSeats && roundNumber < 100) {
		roundNumber++;

		const roundData = captureRoundState('allocation', `Round ${roundNumber}`);

		const currentCost = Math.round(totalUnspent() / remainingSeats());
		if (currentCost <= 0) break;

		roundData.seatCost = currentCost;

		logRound(roundNumber, `Seat cost recalculated: ${fmt(currentCost)} votes/seat`);

		let seatsAwardedThisRound = 0;
		const seatAwards: SeatAward[] = [];

		Object.values(parties)
			.filter((p) => !p.finalized)
			.forEach((p) => {
				const extraSeats = Math.floor(p.unspent / currentCost);
				if (extraSeats > 0) {
					const take = Math.min(extraSeats, remainingSeats() - seatsAwardedThisRound);
					p.seats += take;
					p.unspent -= take * currentCost;
					seatsAwardedThisRound += take;
					if (take > 0) {
						steps.push(
							`${PARTY_META[p.key]?.name || p.key} gains ${take} seat(s) (${fmt(p.unspent + take * currentCost)} ÷ ${fmt(currentCost)} = ${take})`
						);
						seatAwards.push({
							party: p.key,
							partyName: PARTY_META[p.key]?.name || p.key,
							seats: take
						});
					}
				}
			});

		roundData.seatsAllocated = seatsAwardedThisRound;
		roundData.seatAwards = seatAwards;

		if (seatsFilled() >= totalSeats) {
			rounds.push(roundData);
			break;
		}

		// Finalize party with fewest seats
		if (remainingSeats() > 0) {
			const candidatesToFinalize = Object.values(parties).filter((p) => !p.finalized);
			if (candidatesToFinalize.length === 0) {
				rounds.push(roundData);
				break;
			}

			candidatesToFinalize.sort((a, b) => a.seats - b.seats || a.votes - b.votes);
			const loser = candidatesToFinalize[0];

			const target = (prefs[loser.key] || []).find((pk) => parties[pk] && !parties[pk].finalized);
			const targetName = target ? PARTY_META[target]?.name || target : 'no target';
			steps.push(
				`${PARTY_META[loser.key]?.name || loser.key} finalized (fewest seats: ${loser.seats}), transfers ${fmt(loser.unspent)} votes to ${targetName}`
			);

			if (loser.unspent > 0 && target) {
				parties[target].unspent += loser.unspent;

				roundData.transfers.push({
					from: loser.key,
					fromName: PARTY_META[loser.key]?.name || loser.key,
					to: target,
					toName: PARTY_META[target]?.name || target,
					votes: loser.unspent,
					reason: 'finalized'
				});
			}
			loser.unspent = 0;
			loser.finalized = true;
		}

		logSeatsAwarded();
		logRemaining();

		// Update round data with final state
		roundData.parties = {};
		Object.values(parties).forEach((p) => {
			roundData.parties[p.key] = {
				name: PARTY_META[p.key]?.name || p.key,
				votes: p.votes,
				seats: p.seats,
				unspent: p.unspent,
				finalized: p.finalized,
				currentVotes: p.finalized ? 0 : p.unspent
			};
		});

		rounds.push(roundData);
	}

	// Final summary
	steps.push(`\n🏆 Final Result: All ${totalSeats} seats allocated`);
	const finalSeats = Object.values(parties)
		.filter((p) => p.seats > 0)
		.map((p) => `${PARTY_META[p.key]?.name || p.key}: ${p.seats} seats`)
		.join(', ');
	steps.push(`Final seat distribution: ${finalSeats}`);

	const result: Record<string, number> = {};
	Object.keys(parties).forEach((k) => {
		result[k] = parties[k].seats;
	});

	return {
		seats: result,
		steps: steps,
		rounds: rounds,
		summary: {
			totalVotes: grandTotal,
			totalSeats: totalSeats,
			threshold: threshold,
			thresholdVotes: thresholdVotes,
			initialCostPerSeat: initialCost,
			finalParties: Object.values(parties)
				.map((p) => ({
					key: p.key,
					name: PARTY_META[p.key]?.name || p.key,
					originalVotes: p.originalVotes,
					finalSeats: p.seats,
					votesPerSeat: p.seats > 0 ? Math.round(p.originalVotes / p.seats) : 0
				}))
				.sort((a, b) => b.finalSeats - a.finalSeats)
		}
	};
}
