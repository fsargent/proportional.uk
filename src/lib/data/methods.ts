export type BallotAtom = 'single-mark' | 'approval' | 'ranked' | 'score';
export type DistrictAtom = 'single-member' | 'multi-member' | 'hybrid';
export type AllocationAtom =
	| 'plurality'
	| 'transfer'
	| 'reweighting'
	| 'topup'
	| 'divisor';

export type MethodFamily = 'approval' | 'ranked' | 'mixed' | 'single-mark';

export type MethodId =
	| 'fptp'
	| 'stv'
	| 'single-winner-approval'
	| 'ams-plus'
	| 'proportional-approval'
	| 'party-list';

export interface UsedByChip {
	code: string;
	name: string;
	flag: string;
}

export interface VotingMachineCompatibility {
	existingMachines: boolean;
	note: string;
}

export interface Method {
	id: MethodId;
	name: string;
	character: string;
	family: MethodFamily;
	atoms: {
		ballot: BallotAtom;
		district: DistrictAtom;
		allocation: AllocationAtom;
	};
	route: string;
	shortDescription: string;
	tradeoff: string;
	usedBy: UsedByChip[];
	tags: string[];
	votingMachineCompatibility: VotingMachineCompatibility;
	isProportional: boolean;
	isSemiProportional: boolean;
}

export const METHODS: Record<MethodId, Method> = {
	fptp: {
		id: 'fptp',
		name: 'First Past the Post',
		character: 'the incumbent',
		family: 'single-mark',
		atoms: {
			ballot: 'single-mark',
			district: 'single-member',
			allocation: 'plurality'
		},
		route: '/fptp',
		shortDescription:
			'Mark one candidate; the highest single vote total in each constituency wins the seat.',
		tradeoff:
			'Familiar and decisive — at the cost of seat shares that regularly diverge sharply from national vote shares.',
		usedBy: [
			{ code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
			{ code: 'US', name: 'United States (House)', flag: '🇺🇸' },
			{ code: 'CA', name: 'Canada', flag: '🇨🇦' },
			{ code: 'IN', name: 'India', flag: '🇮🇳' }
		],
		tags: ['plurality', 'winner-take-all', 'single-member-district'],
		votingMachineCompatibility: {
			existingMachines: true,
			note: 'Already the UK default; no equipment change required.'
		},
		isProportional: false,
		isSemiProportional: false
	},
	stv: {
		id: 'stv',
		name: 'Single Transferable Vote',
		character: 'the ranker',
		family: 'ranked',
		atoms: {
			ballot: 'ranked',
			district: 'multi-member',
			allocation: 'transfer'
		},
		route: '/stv',
		shortDescription:
			'Rank candidates; surplus and lowest-vote candidates transfer until seats fill.',
		tradeoff:
			'Strong proportionality with a candidate-centred ballot — at the cost of a count voters cannot easily verify.',
		usedBy: [
			{ code: 'IE', name: 'Ireland (Dáil)', flag: '🇮🇪' },
			{ code: 'MT', name: 'Malta', flag: '🇲🇹' },
			{ code: 'AU-S', name: 'Australia (Senate)', flag: '🇦🇺' },
			{ code: 'GB-SCT', name: 'Scotland (local)', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' }
		],
		tags: ['quota-based', 'surplus-transfer', 'candidate-centred'],
		votingMachineCompatibility: {
			existingMachines: false,
			note: 'Needs ranked-ballot capable equipment.'
		},
		isProportional: true,
		isSemiProportional: false
	},
	'single-winner-approval': {
		id: 'single-winner-approval',
		name: 'Single-Winner Approval',
		character: 'the ticker',
		family: 'approval',
		atoms: {
			ballot: 'approval',
			district: 'single-member',
			allocation: 'plurality'
		},
		route: '/single-winner-approval',
		shortDescription:
			'Tick every candidate you would be happy to elect; the one with the most approvals wins the constituency.',
		tradeoff:
			'Removes vote-splitting and rewards broadly acceptable candidates — but delivers no national proportionality.',
		usedBy: [
			{ code: 'US-MO-STL', name: 'St. Louis (mayor, since 2021)', flag: '🇺🇸' },
			{ code: 'US-ND-FAR', name: 'Fargo (city, since 2020)', flag: '🇺🇸' }
		],
		tags: ['approval-ballot', 'majoritarian', 'single-member-district'],
		votingMachineCompatibility: {
			existingMachines: true,
			note: 'Same paper ballot; voters simply tick more than one box.'
		},
		isProportional: false,
		isSemiProportional: false
	},
	'ams-plus': {
		id: 'ams-plus',
		name: 'AMS+',
		character: 'the top-up',
		family: 'mixed',
		atoms: {
			ballot: 'approval',
			district: 'hybrid',
			allocation: 'topup'
		},
		route: '/ams-plus',
		shortDescription:
			'Approve local candidates and cast a separate party vote; regional list seats top up the constituency results to make the overall outcome proportional.',
		tradeoff:
			'Keeps a familiar AMS-style structure with stronger local choice — at the cost of two distinct ballot mechanics on one paper.',
		usedBy: [],
		tags: ['mixed-member', 'compensatory', 'approval-local-vote'],
		votingMachineCompatibility: {
			existingMachines: true,
			note: 'Standard paper; counting blends approval totals with party-vote allocation.'
		},
		isProportional: true,
		isSemiProportional: false
	},
	'proportional-approval': {
		id: 'proportional-approval',
		name: 'Proportional Approval',
		character: 'the equaliser',
		family: 'approval',
		atoms: {
			ballot: 'approval',
			district: 'multi-member',
			allocation: 'reweighting'
		},
		route: '/proportional-approval',
		shortDescription:
			'Tick acceptable candidates in a multi-member district; sequential reweighting fills seats so each group of voters is represented.',
		tradeoff:
			'Genuinely proportional with the simplest possible ballot — at the cost of a reweighting step unfamiliar to UK voters and harder to verify by hand.',
		usedBy: [],
		tags: ['spav', 'sequential', 'multi-member-district'],
		votingMachineCompatibility: {
			existingMachines: true,
			note: 'Paper ballot identical to single-winner approval; reweighting happens at count stage.'
		},
		isProportional: true,
		isSemiProportional: false
	},
	'party-list': {
		id: 'party-list',
		name: 'List PR',
		character: 'the party-line',
		family: 'single-mark',
		atoms: {
			ballot: 'single-mark',
			district: 'multi-member',
			allocation: 'divisor'
		},
		route: '/party-list',
		shortDescription:
			"Vote for a party (and sometimes individual candidates on its list); seats are divided in proportion to each party's vote share.",
		tradeoff:
			'Strong, simple proportionality across regions — at the cost of weakening the direct link between voter and a named local MP.',
		usedBy: [
			{ code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
			{ code: 'SE', name: 'Sweden', flag: '🇸🇪' },
			{ code: 'ES', name: 'Spain', flag: '🇪🇸' },
			{ code: 'IL', name: 'Israel', flag: '🇮🇱' }
		],
		tags: ['divisor-method', 'closed-open-flexible-variants', 'multi-member-district'],
		votingMachineCompatibility: {
			existingMachines: true,
			note: "Standard paper ballot; counts use d'Hondt or Sainte-Laguë divisors."
		},
		isProportional: true,
		isSemiProportional: false
	}
};
