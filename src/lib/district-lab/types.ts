export type LabSystem = 'fptp' | 'party-list' | 'reweighted-approval';

export type LabCandidate = {
	id: string;
	name: string;
	party: string;
	partyId: string;
	colour: string;
	tags: string[];
	ballotOrder: number;
};

export type LabVoterGroup = {
	id: string;
	label: string;
	count: number;
	colour: string;
	primaryPartyId: string;
	firstChoice: string;
	approval: string[];
	ranking: string[];
	scores: Record<string, 0 | 1 | 2 | 3 | 4 | 5>;
	explanation: string;
};

export type LabScenario = {
	id: string;
	title: string;
	strapline: string;
	question: string;
	narrative: string;
	seats: number;
	candidates: LabCandidate[];
	groups: LabVoterGroup[];
};

export type CountRound = {
	seat: number;
	winnerId: string;
	winningTotal: number;
	contenders: Array<{ candidateId: string; total: number }>;
};

export type LabResult = {
	system: LabSystem;
	winnerIds: string[];
	rounds: CountRound[];
	partySeats: Record<string, number>;
};
