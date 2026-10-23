import type { CountRound, LabResult, LabScenario, LabSystem } from './types';
import { runSTV } from '$lib/stv';

const candidateById = (scenario: LabScenario, id: string) => scenario.candidates.find((candidate) => candidate.id === id)!;

export function runFptp(scenario: LabScenario): LabResult {
	const totals = new Map<string, number>();
	for (const group of scenario.groups) totals.set(group.firstChoice, (totals.get(group.firstChoice) ?? 0) + group.count);
	const contenders = [...totals.entries()]
		.map(([candidateId, total]) => ({ candidateId, total }))
		.sort((a, b) => b.total - a.total || candidateById(scenario, a.candidateId).ballotOrder - candidateById(scenario, b.candidateId).ballotOrder);
	const winnerId = contenders[0].candidateId;
	const partyId = candidateById(scenario, winnerId).partyId;
	return { system: 'fptp', winnerIds: [winnerId], rounds: [{ seat: 1, winnerId, winningTotal: contenders[0].total, contenders }], partySeats: { [partyId]: 1 } };
}

export function runPartyList(scenario: LabScenario): LabResult {
	const votes: Record<string, number> = {};
	for (const group of scenario.groups) votes[group.primaryPartyId] = (votes[group.primaryPartyId] ?? 0) + group.count;
	const partyIds = Object.keys(votes);
	const partySeats: Record<string, number> = Object.fromEntries(partyIds.map((party) => [party, 0]));
	const winnerIds: string[] = [];
	const rounds: CountRound[] = [];
	for (let seat = 1; seat <= scenario.seats; seat += 1) {
		const contenders = partyIds
			.map((partyId) => ({ candidateId: partyId, total: votes[partyId] / (2 * partySeats[partyId] + 1) }))
			.sort((a, b) => b.total - a.total || a.candidateId.localeCompare(b.candidateId));
		const winningParty = contenders[0].candidateId;
		partySeats[winningParty] += 1;
		const candidate = scenario.candidates.filter((item) => item.partyId === winningParty)[partySeats[winningParty] - 1];
		if (candidate) winnerIds.push(candidate.id);
		rounds.push({ seat, winnerId: candidate?.id ?? winningParty, winningTotal: contenders[0].total, contenders });
	}
	return { system: 'party-list', winnerIds, rounds, partySeats };
}

export function runReweightedApproval(scenario: LabScenario): LabResult {
	const winnerIds: string[] = [];
	const rounds: CountRound[] = [];
	const partySeats: Record<string, number> = {};
	for (let seat = 1; seat <= scenario.seats; seat += 1) {
		const contenders = scenario.candidates
			.filter((candidate) => !winnerIds.includes(candidate.id))
			.map((candidate) => ({
				candidateId: candidate.id,
				total: scenario.groups.reduce((sum, group) => {
					if (!group.approval.includes(candidate.id)) return sum;
					const electedApprovals = group.approval.filter((id) => winnerIds.includes(id)).length;
					return sum + group.count / (1 + 2 * electedApprovals);
				}, 0)
			}))
			.sort((a, b) => b.total - a.total || candidateById(scenario, a.candidateId).ballotOrder - candidateById(scenario, b.candidateId).ballotOrder);
		const winner = contenders[0];
		winnerIds.push(winner.candidateId);
		const party = candidateById(scenario, winner.candidateId).partyId;
		partySeats[party] = (partySeats[party] ?? 0) + 1;
		rounds.push({ seat, winnerId: winner.candidateId, winningTotal: winner.total, contenders });
	}
	return { system: 'pav', winnerIds, rounds, partySeats };
}

export function runStv(scenario: LabScenario): LabResult {
	const voters = scenario.groups.flatMap((group) =>
		Array.from({ length: group.count }, (_, index) => ({
			id: `${group.id}-${index + 1}`,
			approvals: group.approval,
			ranking: group.ranking
		}))
	);
	const candidates = scenario.candidates.map((candidate) => ({
		id: candidate.id,
		name: candidate.name,
		party: candidate.party,
		color: candidate.colour
	}));
	const counted = runSTV(voters, candidates, scenario.seats);
	const rounds: CountRound[] = counted.elected.map((winnerId, index) => {
		const stvRound = counted.rounds.find((round) => round.electedThisRound?.includes(winnerId));
		const contenders = (stvRound?.allocations ?? [])
			.filter((item) => item.allocatee !== 'X')
			.map((item) => ({ candidateId: item.allocatee, total: item.votes }))
			.sort((a, b) => b.total - a.total || candidateById(scenario, a.candidateId).ballotOrder - candidateById(scenario, b.candidateId).ballotOrder);
		return {
			seat: index + 1,
			winnerId,
			winningTotal: contenders.find((item) => item.candidateId === winnerId)?.total ?? 0,
			contenders
		};
	});
	const partySeats: Record<string, number> = {};
	for (const winnerId of counted.elected) {
		const party = candidateById(scenario, winnerId).partyId;
		partySeats[party] = (partySeats[party] ?? 0) + 1;
	}
	return { system: 'stv', winnerIds: counted.elected, rounds, partySeats };
}

export function runSystem(scenario: LabScenario, system: LabSystem): LabResult {
	if (system === 'fptp') return runFptp(scenario);
	if (system === 'party-list') return runPartyList(scenario);
	if (system === 'stv') return runStv(scenario);
	return runReweightedApproval(scenario);
}

export function representedVoters(scenario: LabScenario, result: LabResult, groupId: string): number {
	const group = scenario.groups.find((item) => item.id === groupId)!;
	if (result.system === 'fptp') return group.firstChoice === result.winnerIds[0] ? group.count : 0;
	if (result.system === 'party-list') {
		return scenario.candidates.some((candidate) => candidate.partyId === group.primaryPartyId && result.winnerIds.includes(candidate.id)) ? group.count : 0;
	}
	if (result.system === 'stv') return group.ranking.some((candidate) => result.winnerIds.includes(candidate)) ? group.count : 0;
	return group.approval.some((candidate) => result.winnerIds.includes(candidate)) ? group.count : 0;
}
