import type { CountRound, LabResult, LabScenario, LabSystem } from './types';

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
	return { system: 'reweighted-approval', winnerIds, rounds, partySeats };
}

export function runSystem(scenario: LabScenario, system: LabSystem): LabResult {
	if (system === 'fptp') return runFptp(scenario);
	if (system === 'party-list') return runPartyList(scenario);
	return runReweightedApproval(scenario);
}

export function representedVoters(scenario: LabScenario, result: LabResult, groupId: string): number {
	const group = scenario.groups.find((item) => item.id === groupId)!;
	if (result.system === 'fptp') return group.firstChoice === result.winnerIds[0] ? group.count : 0;
	return group.approval.some((candidate) => result.winnerIds.includes(candidate)) ? group.count : 0;
}
