import type { LabCandidate, LabScenario, LabVoterGroup } from './types';

const candidate = (
	id: string,
	name: string,
	party: string,
	partyId: string,
	colour: string,
	tags: string[],
	ballotOrder: number
): LabCandidate => ({ id, name, party, partyId, colour, tags, ballotOrder });

const candidates: LabCandidate[] = [
	candidate('l1', 'Aisha Khan', 'Labour', 'labour', '#E4003B', ['housing', 'trade unionist'], 1),
	candidate('l2', 'Tom Ellis', 'Labour', 'labour', '#E4003B', ['public services'], 2),
	candidate('l3', 'Maya Patel', 'Labour', 'labour', '#E4003B', ['local organiser'], 3),
	candidate('c1', 'Daniel Wright', 'Conservative', 'conservative', '#0087DC', ['small business'], 4),
	candidate('c2', 'Ruth Morgan', 'Conservative', 'conservative', '#0087DC', ['community safety'], 5),
	candidate('ld1', 'Ben Foster', 'Liberal Democrat', 'libdem', '#FAA61A', ['civil liberties'], 6),
	candidate('ld2', 'Hannah Reed', 'Liberal Democrat', 'libdem', '#FAA61A', ['local government'], 7),
	candidate('g1', 'Sofia Green', 'Green', 'green', '#6AB023', ['climate', 'renters'], 8),
	candidate('g2', 'Noah Price', 'Green', 'green', '#6AB023', ['clean air'], 9),
	candidate('r1', 'Callum Hayes', 'Reform UK', 'reform', '#12B6CF', ['anti-establishment'], 10),
	candidate('i1', 'Leila Shah', 'Independent', 'independent', '#6B7280', ['hospital campaign'], 11),
	candidate('i2', 'Owen Brooks', 'Independent', 'independent', '#6B7280', ['town centre'], 12)
];

const scores = (entries: Record<string, number>) => {
	const out: Record<string, 0 | 1 | 2 | 3 | 4 | 5> = {};
	for (const item of candidates) out[item.id] = Math.max(0, Math.min(5, entries[item.id] ?? 0)) as 0 | 1 | 2 | 3 | 4 | 5;
	return out;
};

const group = (
	id: string,
	label: string,
	count: number,
	colour: string,
	primaryPartyId: string,
	firstChoice: string,
	approval: string[],
	ranking: string[],
	explanation: string,
	scoreEntries: Record<string, number>
): LabVoterGroup => ({
	id,
	label,
	count,
	colour,
	primaryPartyId,
	firstChoice,
	approval,
	ranking,
	explanation,
	scores: scores(scoreEntries)
});

const fragmented: LabVoterGroup[] = [
	group('labour-core', 'Labour core', 250, '#E4003B', 'labour', 'l1', ['l1', 'l2', 'l3'], ['l1', 'l2', 'l3', 'g1', 'ld1'], 'Strong Labour voters who also find the Green candidate acceptable.', { l1: 5, l2: 4, l3: 4, g1: 3, ld1: 2 }),
	group('green-labour', 'Green–Labour bridge', 130, '#8EAD3D', 'green', 'g1', ['g1', 'g2', 'l1', 'ld1'], ['g1', 'g2', 'l1', 'ld1', 'l2'], 'Climate-first voters willing to support Labour and Liberal Democrat candidates too.', { g1: 5, g2: 4, l1: 3, ld1: 3, l2: 2 }),
	group('libdem-centre', 'Liberal Democrat centre', 145, '#FAA61A', 'libdem', 'ld1', ['ld1', 'ld2', 'i2', 'l1'], ['ld1', 'ld2', 'i2', 'l1', 'g1'], 'Centrist voters who value the town-centre independent and one Labour candidate.', { ld1: 5, ld2: 4, i2: 4, l1: 3, g1: 2 }),
	group('conservative-core', 'Conservative core', 190, '#0087DC', 'conservative', 'c1', ['c1', 'c2'], ['c1', 'c2', 'i2'], 'Conservative voters with a conventional two-candidate slate.', { c1: 5, c2: 4, i2: 2 }),
	group('reform-core', 'Reform core', 105, '#12B6CF', 'reform', 'r1', ['r1'], ['r1', 'c1'], 'Voters who support only the Reform candidate.', { r1: 5, c1: 2 }),
	group('hospital-campaign', 'Hospital campaign voters', 95, '#8B7A73', 'independent', 'i1', ['i1', 'l1', 'g1', 'ld1'], ['i1', 'l1', 'g1', 'ld1', 'ld2'], 'Voters united by the hospital campaign across their wider political differences.', { i1: 5, l1: 3, g1: 3, ld1: 3, ld2: 2 }),
	group('town-centre-localists', 'Town-centre localists', 85, '#6B7280', 'independent', 'i2', ['i2', 'ld1', 'c2'], ['i2', 'ld1', 'c2', 'l1'], 'Localists who like an independent, a Liberal Democrat and a moderate Conservative.', { i2: 5, ld1: 4, c2: 3, l1: 2 })
];

const crossParty: LabVoterGroup[] = fragmented.map((item) => ({ ...item }));
crossParty[0] = { ...crossParty[0], approval: ['l1', 'l2', 'l3', 'i1', 'g1'], ranking: ['l1', 'i1', 'l2', 'l3', 'g1'], explanation: 'Labour voters who also trust the hospital campaigner.' };
crossParty[3] = { ...crossParty[3], approval: ['c1', 'c2', 'i1', 'i2'], ranking: ['c1', 'i1', 'c2', 'i2'], explanation: 'Conservative voters who trust both independents on local issues.' };
crossParty[4] = { ...crossParty[4], approval: ['r1', 'i1'], ranking: ['r1', 'i1'], explanation: 'Reform voters who also support the hospital campaign.' };

const polarised: LabVoterGroup[] = [
	group('left-core', 'Left bloc', 330, '#E4003B', 'labour', 'l1', ['l1', 'l2', 'l3'], ['l1', 'l2', 'l3', 'g1'], 'A cohesive left bloc that approves only Labour candidates.', { l1: 5, l2: 4, l3: 4, g1: 1 }),
	group('green-left', 'Green left', 120, '#6AB023', 'green', 'g1', ['g1', 'g2'], ['g1', 'g2', 'l1'], 'A distinct Green group with little appetite for Labour candidates.', { g1: 5, g2: 4, l1: 1 }),
	group('right-core', 'Conservative bloc', 270, '#0087DC', 'conservative', 'c1', ['c1', 'c2'], ['c1', 'c2', 'r1'], 'A cohesive Conservative bloc.', { c1: 5, c2: 4, r1: 1 }),
	group('reform-right', 'Reform right', 150, '#12B6CF', 'reform', 'r1', ['r1'], ['r1', 'c1'], 'A distinct Reform group.', { r1: 5, c1: 1 }),
	group('libdem-centre', 'Small centre', 130, '#FAA61A', 'libdem', 'ld1', ['ld1', 'ld2'], ['ld1', 'ld2', 'i2'], 'A small centrist group with its own candidates.', { ld1: 5, ld2: 4, i2: 2 })
];

export const scenarios: LabScenario[] = [
	{
		id: 'fragmented-electorate',
		title: 'Fragmented electorate',
		strapline: 'Several substantial groups, with some overlapping support.',
		question: 'Can several viewpoints gain a voice without voters ranking every candidate?',
		narrative: 'No group is near a majority. Two locally distinctive candidates attract support across political homes.',
		seats: 8,
		candidates,
		groups: fragmented
	},
	{
		id: 'cross-party-local',
		title: 'Cross-party local candidate',
		strapline: 'National disagreement, shared trust in a local campaigner.',
		question: 'Will broad local approval translate into a seat?',
		narrative: 'The hospital campaigner is acceptable to voters with sharply different national loyalties.',
		seats: 8,
		candidates,
		groups: crossParty
	},
	{
		id: 'polarised-election',
		title: 'Polarised election',
		strapline: 'Two blocs overlap very little, with smaller groups inside each.',
		question: 'Can a proportional rule represent disagreement without forcing false consensus?',
		narrative: 'Approval does not create agreement where none exists. The test is whether distinct groups receive their due voice.',
		seats: 8,
		candidates,
		groups: polarised
	}
];

export const DEFAULT_SCENARIO_ID = scenarios[0].id;
