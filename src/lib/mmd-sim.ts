import type { HexDistrict, HexSeat } from '$lib/hexmap/types';

export interface ConstituencyResult {
	id: string;
	name: string;
	electorate: number;
	totalVotes: number;
	turnoutPct: number;
	candidateCount: number;
	partyVotes: Record<string, number>;
}

export interface ConstituencyResultsDataset {
	source: string;
	seatCount: number;
	seats: ConstituencyResult[];
}

export interface PartyTotals {
	party: string;
	votes: number;
	seats: number;
	voteShare: number;
	seatShare: number;
}

export interface DistrictSimulation {
	id: string;
	name: string;
	memberCount: number;
	candidateCount: number;
	totalVotes: number;
	partyVotes: Record<string, number>;
	seatAllocation: Record<string, number>;
	leadingParty: string | null;
	winningParties: string[];
	seatWinners: string[];
}

export interface SimulationSummary {
	totalVotes: number;
	totalSeats: number;
	gallagher: number;
	loosemoreHanby: number;
	estimatedCandidatesPerBallot: number;
	nationalPartyTotals: PartyTotals[];
	districts: DistrictSimulation[];
}

const PARTY_LABELS: Record<string, string> = {
	labour: 'Labour',
	conservative: 'Conservative',
	'liberal-democrats': 'Liberal Democrats',
	green: 'Green',
	'reform-uk': 'Reform UK',
	'scottish-national-party': 'SNP',
	'plaid-cymru': 'Plaid Cymru',
	'sinn-fein': 'Sinn Féin',
	'democratic-unionist-party': 'DUP',
	'social-democratic-and-labour-party': 'SDLP',
	alliance: 'Alliance',
	'ulster-unionist-party': 'UUP',
	'traditional-unionist-voice': 'TUV',
	others: 'Others',
	speaker: 'Speaker'
};

export function partyLabel(key: string): string {
	return PARTY_LABELS[key] ?? key;
}

export function allocateSainteLague(votesByParty: Record<string, number>, seats: number): Record<string, number> {
	const quotients: Array<{ party: string; value: number }> = [];
	for (const [party, votes] of Object.entries(votesByParty)) {
		if (votes <= 0 || party === 'speaker') continue;
		for (let d = 1; d <= seats; d++) {
			quotients.push({ party, value: votes / (2 * d - 1) });
		}
	}
	quotients.sort((a, b) => b.value - a.value);
	const result: Record<string, number> = {};
	for (let i = 0; i < seats; i++) {
		const winner = quotients[i];
		if (!winner) break;
		result[winner.party] = (result[winner.party] ?? 0) + 1;
	}
	return result;
}

export function simulateGroupedDistricts(
	districts: HexDistrict[],
	hexSeats: HexSeat[],
	results: ConstituencyResultsDataset
): SimulationSummary {
	const resultsById = new Map(results.seats.map((seat) => [seat.id, seat]));
	const seatNameById = new Map(hexSeats.map((seat) => [seat.id, seat.name]));
	const districtSummaries: DistrictSimulation[] = districts.map((district) => {
		const partyVotes: Record<string, number> = {};
		let totalVotes = 0;
		let candidateCount = 0;

		for (const seatId of district.seatIds) {
			const result = resultsById.get(seatId);
			if (!result) continue;
			totalVotes += result.totalVotes;
			candidateCount += result.candidateCount;
			for (const [party, votes] of Object.entries(result.partyVotes)) {
				partyVotes[party] = (partyVotes[party] ?? 0) + votes;
			}
		}

		const seatAllocation = allocateSainteLague(partyVotes, district.memberCount);
		const winningParties = Object.entries(seatAllocation)
			.filter(([, seats]) => seats > 0)
			.sort((a, b) => b[1] - a[1] || (partyVotes[b[0]] ?? 0) - (partyVotes[a[0]] ?? 0))
			.map(([party]) => party);
		const seatWinners = Object.entries(seatAllocation)
			.sort((a, b) => b[1] - a[1] || (partyVotes[b[0]] ?? 0) - (partyVotes[a[0]] ?? 0))
			.flatMap(([party, seats]) => Array.from({ length: seats }, () => party));
		return {
			id: district.id,
			name: seatNameById.get(district.seatIds[0]) ?? district.id,
			memberCount: district.memberCount,
			candidateCount,
			totalVotes,
			partyVotes,
			seatAllocation,
			leadingParty: winningParties[0] ?? null,
			winningParties,
			seatWinners
		};
	});

	const nationalVotes: Record<string, number> = {};
	const nationalSeats: Record<string, number> = {};
	let totalVotes = 0;
	let totalSeats = 0;
	let totalCandidates = 0;

	for (const district of districtSummaries) {
		totalVotes += district.totalVotes;
		totalSeats += district.memberCount;
		totalCandidates += district.candidateCount;
		for (const [party, votes] of Object.entries(district.partyVotes)) {
			nationalVotes[party] = (nationalVotes[party] ?? 0) + votes;
		}
		for (const [party, seats] of Object.entries(district.seatAllocation)) {
			nationalSeats[party] = (nationalSeats[party] ?? 0) + seats;
		}
	}

	const allParties = [...new Set([...Object.keys(nationalVotes), ...Object.keys(nationalSeats)])];
	const nationalPartyTotals = allParties
		.map((party) => {
			const votes = nationalVotes[party] ?? 0;
			const seats = nationalSeats[party] ?? 0;
			return {
				party,
				votes,
				seats,
				voteShare: totalVotes > 0 ? votes / totalVotes : 0,
				seatShare: totalSeats > 0 ? seats / totalSeats : 0
			};
		})
		.filter((party) => party.votes > 0 || party.seats > 0)
		.sort((a, b) => b.seats - a.seats || b.votes - a.votes);

	const gallagher = Math.sqrt(
		nationalPartyTotals.reduce((sum, party) => {
			const diff = party.voteShare * 100 - party.seatShare * 100;
			return sum + diff * diff;
		}, 0) / 2
	);
	const loosemoreHanby =
		nationalPartyTotals.reduce(
			(sum, party) => sum + Math.abs(party.voteShare * 100 - party.seatShare * 100),
			0
		) / 2;

	return {
		totalVotes,
		totalSeats,
		gallagher,
		loosemoreHanby,
		estimatedCandidatesPerBallot:
			districtSummaries.reduce((sum, district) => sum + district.candidateCount, 0) /
			Math.max(1, districtSummaries.length),
		nationalPartyTotals,
		districts: districtSummaries
	};
}
