export type BallotAtom = 'single-mark' | 'approval' | 'ranked' | 'score';
export type DistrictAtom = 'single-member' | 'multi-member' | 'hybrid' | 'national';
export type AllocationAtom =
	| 'plurality'
	| 'transfer'
	| 'reweighting'
	| 'topup'
	| 'divisor';

export type MethodFamily = 'approval' | 'ranked' | 'mixed' | 'single-mark';

export type Proportionality = 'none' | 'semi' | 'full';

export type MethodId =
	| 'fptp'
	| 'alternative-vote'
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
	/** Very short nav-bar blurb (≤40 chars). Distinct from shortDescription
	 * which is a one-sentence summary of mechanics. */
	tagline: string;
	shortDescription: string;
	tradeoff: string;
	usedBy: UsedByChip[];
	tags: string[];
	votingMachineCompatibility: VotingMachineCompatibility;
	proportionality: Proportionality;
	/** Optional Mermaid `flowchart` source for the counting process. Intended for
	 * the MethodPageBody "worked-example" slot (not yet auto-rendered). */
	flowchart?: string;

	// --- PRD v1 additions (all optional during method-page migration) -------
	// Once a method page is migrated to <MethodPageBody>, every field below
	// must be populated. Until then, MethodPageBody falls back to defaults
	// and per-section components keep rendering rich Svelte content.
	// ------------------------------------------------------------------------

	/** One-paragraph lede shown beneath the page H1. Plain prose, no markup. */
	lede?: string;

	/** Hand-curated peer methods — 2 or 3 entries, ordered by editorial
	 * relevance (most-similar first). Replaces algorithmic atom-graph
	 * sibling computation. Brief: "the editorial work of choosing the
	 * comparisons is the value." */
	peers?: MethodId[];

	/** One-line "siblings because" rationale per peer, keyed by peer MethodId.
	 * Surfaces in <SiblingStrip> cards and in the in-body Compare slot.
	 * Each rationale should name the structural delta in plain English
	 * (e.g. "Same approval ballot, multi-member instead of single-member").
	 * Keys must be present for every id listed in `peers`. */
	peerRationale?: Partial<Record<MethodId, string>>;

	/** 3–5 short headline strengths, one bullet each (≤ ~80 chars).
	 * MethodPageBody renders these in the Strengths slot. Per-method
	 * components may also slot in a richer elaboration body. */
	strengthHeadlines?: string[];

	/** 3–5 short headline trade-offs, one bullet each (≤ ~80 chars).
	 * Equal weight and length to strengths — the brief commits to no
	 * method having a "hidden flaw or hidden virtue." */
	tradeoffHeadlines?: string[];

	/** Tier-1 sceptic-fear FAQ entries surfaced inline on the method page.
	 * Short Q + plain-prose A; rich-content elaborations stay in per-method
	 * components if needed. */
	faqs?: Array<{ q: string; a: string }>;

	/** The standardised "Bottom Line" closer. One paragraph maximum.
	 * Honest about tradeoffs; never overpromises. Renders in the canonical
	 * bottom-line spine slot. */
	bottomLine?: string;
}

export const METHODS: Readonly<Record<MethodId, Method>> = {
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
		tagline: 'Our current failing system',
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
		proportionality: 'none',

		lede:
			'First Past the Post is the simplest way to run an election and the system Britain has used for centuries. One candidate wins each constituency, and you get one vote. That simplicity comes with trade-offs that grow more visible as the number of parties increases.',

		peers: ['single-winner-approval', 'alternative-vote', 'ams-plus'],
		peerRationale: {
			'single-winner-approval':
				"Keeps your single local MP and the same paper ballot — you just tick everyone you'd accept instead of only one, which removes the spoiler problem without changing anything else.",
			'alternative-vote':
				'Keeps the single-member seat but has you rank candidates instead of marking one — ending vote-splitting between similar candidates, though it is not proportional and not a Condorcet method.',
			'ams-plus':
				'Keeps a local constituency MP too, but adds regional top-up seats so the overall result reflects how the country actually voted.'
		},

		strengthHeadlines: [
			'Simple to vote: one mark, one box.',
			'Simple to count: stack the ballots, highest pile wins, results overnight.',
			'Every MP represents one identifiable local constituency.',
			'Usually produces single-party majorities, which can mean decisive government.'
		],

		tradeoffHeadlines: [
			'Seat shares routinely diverge sharply from vote shares — the 2024 Gallagher index was 23.7, fifth-worst on record.',
			'Millions of votes elect nobody: the ERS counted roughly 73.7% of 2024 votes as cast for losing candidates.',
			'Rewards tactical voting — backing the least-bad candidate who can win, not the one you prefer.',
			'Concentrates campaigning on a handful of marginal seats while safe seats are ignored.'
		],

		faqs: [
			{
				q: "If it's so distorting, why does Britain still use it?",
				a: 'Inertia and incumbency, mostly. The system tends to benefit whichever party last won under it, so the party with the power to change it usually has the least reason to. The 2011 referendum offered a different single-winner method (AV), not proportional representation — so a proportional alternative has never actually been on a UK-wide ballot.'
			},
			{
				q: "Doesn't FPTP at least keep out extremists?",
				a: 'It can keep small parties out regardless of how many votes they win — but it does so bluntly. A party with 14% of the national vote can get under 1% of seats, or, with its vote efficiently concentrated, a great many. The outcome depends on geography, not on a deliberate ceiling.'
			},
			{
				q: "Doesn't it deliver strong, stable government?",
				a: 'Often it delivers a large majority from a minority of votes, which is decisive but not the same as broadly supported. Whether that reads as stability or as overreach tends to depend on whether your side won.'
			}
		],

		bottomLine:
			'First Past the Post is the baseline this site measures everything else against. It is genuinely simple and genuinely local — and it produces the disproportion the rest of the conversation is trying to fix. Every method on the shortlist is an answer to a different question: what would you keep, and what would you change?'
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
		tagline: 'Used in Scotland',
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
		proportionality: 'full',

		// --- PRD v1 content (worked example; STV is the migration pilot) ----
		lede:
			'Single Transferable Vote, usually shortened to STV, offers proportional representation without closed lists. The trade-off is also clear: it asks more of voters and more of the count.',

		peers: ['proportional-approval', 'ams-plus', 'alternative-vote'],
		peerRationale: {
			'proportional-approval':
				'Same multi-member districts and the same job — proportional representation — but a tick-box approval ballot instead of a ranked one.',
			'ams-plus':
				'Also delivers full proportionality, but keeps a familiar single-member constituency with a regional top-up rather than redrawing seats into multi-member districts.',
			'alternative-vote':
				'Shares STV\'s ranked ballot and transfer count, but in single-member seats — which is why it is not proportional. This is the system rejected in the 2011 referendum, and the one most often confused with STV.'
		},

		strengthHeadlines: [
			'Genuinely proportional outcomes in real-world use (Ireland, Malta, Scottish local, NI Assembly).',
			'Voters rank candidates, not parties — so the ballot keeps a candidate-centred local link.',
			'Multi-member districts dissolve "wasted vote" arithmetic without abolishing constituencies.',
			'Battle-tested at national scale for nearly a century.'
		],

		tradeoffHeadlines: [
			'Asks voters to rank multiple candidates — more cognitive load than a single mark or tick.',
			'The count is opaque to lay observers; quota and transfer steps are not easy to verify by hand.',
			'Redraws current single-member constituencies into multi-member districts — a familiar fear point.',
			'Theoretically vulnerable to non-monotonicity in rare cases (helping a candidate by ranking them lower).'
		],

		faqs: [
			{
				q: 'Does STV mean I lose my local MP?',
				a: 'No — but the relationship changes. Instead of one MP per small constituency, you get several MPs representing a larger multi-member district. Most voters in Ireland and Scotland report stronger MP access under STV, because you can approach whichever of your MPs you prefer.'
			},
			{
				q: 'Why is the count so complicated?',
				a: 'The quota-and-transfer arithmetic is genuinely involved, and that is an honest weakness. Ireland and Scotland use software to count; published audit trails make the count verifiable after the fact, but you cannot watch it the way you can watch an FPTP count.'
			}
		],

		bottomLine:
			'STV is the most battle-tested proportional method on the UK shortlist. It keeps a candidate-centred ballot and dissolves wasted-vote arithmetic, at the cost of asking more of the voter than a tick-box and more of the count than a tally. If your priority is "proportional, with local MPs, with track record" — this is the option to start from.'
	},
	'alternative-vote': {
		id: 'alternative-vote',
		name: 'Alternative Vote',
		character: 'the runoff',
		family: 'ranked',
		atoms: {
			ballot: 'ranked',
			district: 'single-member',
			allocation: 'transfer'
		},
		route: '/alternative-vote',
		tagline: 'Rejected in 2011',
		shortDescription:
			'Rank candidates in a single-member seat; the lowest-placed candidate is eliminated and their votes transfer until someone holds a majority.',
		tradeoff:
			'Guarantees a majority winner and removes the spoiler effect — but keeps single-member seats, so it does nothing for national proportionality.',
		usedBy: [
			{ code: 'AU', name: 'Australia (House)', flag: '🇦🇺' },
			{ code: 'US-ME', name: 'Maine (US)', flag: '🇺🇸' },
			{ code: 'US-AK', name: 'Alaska (US)', flag: '🇺🇸' },
			{ code: 'IE-P', name: 'Ireland (President)', flag: '🇮🇪' }
		],
		tags: ['instant-runoff', 'majority-winner', 'single-member-district'],
		votingMachineCompatibility: {
			existingMachines: false,
			note: 'Needs ranked-ballot capable counting; the ballot looks like an STV ballot in a single-seat contest.'
		},
		proportionality: 'none',

		lede:
			'The Alternative Vote — known as Instant-Runoff or Ranked-Choice Voting elsewhere — keeps single-member seats but lets you rank candidates instead of marking one. The lowest-placed candidate is eliminated and their votes transfer until one candidate leads the ballots still in play. It frees you to rank your favourite first without splitting the vote — but it is not proportional, not a Condorcet method, and it is the system Britain rejected in 2011.',

		peers: ['fptp', 'stv', 'single-winner-approval'],
		peerRationale: {
			fptp:
				'The same single-member seats, but you rank candidates instead of marking one — which ends vote-splitting between similar candidates, though it cannot deliver proportionality or guarantee the head-to-head favourite wins.',
			stv:
				'Shares the ranked ballot and transfer count, but STV uses multi-member districts to deliver proportionality. AV keeps single-member seats and does not — this is the system often confused with STV and rejected in 2011.',
			'single-winner-approval':
				"Tackles the single-winner spoiler problem with a tick-box approval ballot instead of ranking — and, unlike AV, it won't squeeze out a broadly-approved centrist."
		},

		strengthHeadlines: [
			'Lets you rank a small party or independent first without wasting your vote — it transfers if they are eliminated.',
			'Ends vote-splitting between similar candidates, the classic First-Past-the-Post spoiler.',
			'Keeps the familiar single-member constituency and its named local MP.',
			'More expressive than a single mark, and well tested — Australia has used it for over a century.'
		],

		tradeoffHeadlines: [
			'Not proportional — single-member seats mean national seat shares can still diverge sharply from votes.',
			'Not a Condorcet method: a broadly-liked centrist can be squeezed out — a real spoiler effect of its own.',
			"The winner's majority is only among the ballots still in play after eliminations, not among all voters.",
			'This is the system UK voters rejected 67.9% to 32.1% in the 2011 referendum.'
		],

		faqs: [
			{
				q: 'Is the Alternative Vote the same as Ranked-Choice Voting?',
				a: "For single-winner elections, yes — 'Alternative Vote' (UK), 'Instant-Runoff Voting' (IRV), and 'Ranked-Choice Voting' (RCV, US) all describe the same method: rank candidates, eliminate the lowest, transfer their votes until someone has a majority. Confusingly, the US also sometimes uses 'RCV' for multi-winner STV, which is a different, proportional system."
			},
			{
				q: 'Is the Alternative Vote proportional?',
				a: "No. AV elects one winner per seat, so a party with broad second-place support across many seats can still win very few of them. Australia's House of Representatives, elected by AV for over a century, remains a largely two-party chamber. AV fixes the spoiler problem; it does not fix disproportionality."
			},
			{
				q: "Didn't the UK already reject this?",
				a: 'Yes — the 2011 referendum offered AV, and it was rejected 67.9% to 32.1%. That result is about AV specifically: a single-winner system that is not proportional. Proportional methods have never been put to UK voters. The distinction between "we rejected AV" and "we rejected proportional representation" is the one this whole site is built around.'
			}
		],

		bottomLine:
			'The Alternative Vote improves on First Past the Post for single-winner seats: it frees voters to rank a favourite first and ends vote-splitting between similar candidates. But it is not proportional, it is not a Condorcet method — a squeezed centrist can still lose to a more divisive rival — and it is the system the UK rejected in 2011. Its role here is as the reference point: the reason the case for reform has to be made for proportional methods, not for ranking in general.'
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
		tagline: 'Simplest to implement',
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
		proportionality: 'none',

		lede:
			'Keep one MP per constituency. Keep the familiar Westminster map. Change only the instruction on the ballot: approve every candidate you would genuinely be happy to elect.',

		peers: ['fptp', 'proportional-approval'],
		peerRationale: {
			fptp:
				'Identical in every way — single local MP, same paper, highest total wins — except you can approve more than one candidate, so backing your favourite never wastes your vote.',
			'proportional-approval':
				'Same tick-the-boxes ballot, but counted across a multi-member district with reweighting, so the overall result becomes proportional.'
		},

		strengthHeadlines: [
			'The simplest reform on the table: same ballot paper, one-line change to the instruction.',
			'Removes the spoiler effect — voting for a small party never helps your least-favourite win.',
			'Rewards broadly acceptable candidates over narrowly divisive ones.',
			'Already in use and counted on existing equipment in US cities (Fargo, St. Louis).'
		],

		tradeoffHeadlines: [
			'Delivers no national proportionality — it is a better way to fill a single seat, not a fix for seat-share distortion.',
			"A party that's everyone's acceptable second choice can win seats its first-preference support wouldn't justify.",
			'Slightly more involved to adjudicate tied or near-tied approvals than a single-mark tally.',
			"Doesn't address safe seats or the marginal-seat campaigning problem on its own."
		],

		faqs: [
			{
				q: "If I approve two candidates, doesn't my vote count twice?",
				a: "No — each candidate you approve gets one tick from you, and a candidate can only win once. You're not getting extra weight; you're saying which candidates you'd accept. The winner is whoever the most voters found acceptable."
			},
			{
				q: 'Is this proportional representation?',
				a: "Not on its own. Single-Winner Approval still fills one seat per constituency, so a party with broad national support can still be under-represented. It's on this site as the cleanest single-winner upgrade and as the gateway to its proportional sibling, Proportional Approval."
			},
			{
				q: "Won't it just elect bland, inoffensive candidates?",
				a: "It rewards candidates a majority can live with rather than candidates a passionate minority loves. Whether 'broadly acceptable' reads as 'bland' or as 'consensus' is a real values question — and one the site thinks voters should weigh openly."
			}
		],

		bottomLine:
			"Single-Winner Approval is the least disruptive thing Britain could do to its ballots: change the instruction, keep the rest. It fixes vote-splitting and spoilers, but it does not make Parliament proportional. Think of it as the on-ramp — proof that a better ballot needn't be a harder one — with full proportionality one step further on."
	},
	'ams-plus': {
		id: 'ams-plus',
		name: 'Additional Member System / Mixed-Member Proportional + Approval',
		character: 'the top-up',
		family: 'mixed',
		atoms: {
			ballot: 'approval',
			district: 'hybrid',
			allocation: 'topup'
		},
		route: '/ams-plus',
		tagline: 'Used in Wales',
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
		proportionality: 'full',

		lede:
			'AMS+ keeps the mixed-member structure the UK already knows from Scotland and Wales, but replaces the local FPTP ballot with approval voting. That makes it the clearest near-term approval-based route to Westminster proportionality.',

		peers: ['stv', 'party-list'],
		peerRationale: {
			stv:
				'Also delivers full proportionality, but does it by grouping constituencies into multi-member districts rather than keeping single-member seats and adding a regional top-up.',
			'party-list':
				'Shares the list-based top-up mechanism for proportionality, but AMS+ keeps a named local MP for every constituency, where pure list PR does not.'
		},

		strengthHeadlines: [
			'Proportional overall while keeping a single, named local MP for every constituency.',
			'Built on devolved architecture Britain has run for 25+ years — familiar, not theoretical.',
			'Upgrading the constituency ballot to approval removes the FPTP distortion in the local tier.',
			'Lets voters back a local candidate and a party separately, on one paper.'
		],

		tradeoffHeadlines: [
			'Two different ballot mechanics on one paper — an approval local vote and a party vote — is more to explain.',
			'Creates two kinds of representative: constituency MPs and regional list MPs.',
			'Overall proportionality depends on the ratio of local to top-up seats; too few list seats and the correction is only partial.',
			'Regional list seats have a weaker direct constituency link than local MPs.'
		],

		faqs: [
			{
				q: "Isn't this just what Scotland and Wales already have?",
				a: "Closely — and that's the point: the architecture is proven on British soil. The '+' is the one upgrade: the constituency vote becomes an approval ballot instead of First Past the Post, so even the local tier stops distorting. Everything else will feel familiar to a Senedd or Holyrood voter."
			},
			{
				q: "What are 'list MPs', and are they second-class?",
				a: 'List MPs are elected from a regional party list to top up the proportional balance, rather than from a single constituency. In practice they share regional casework and often specialise. Whether voters treat them as equal to constituency MPs is a genuine, openly-debated question in Scotland and Wales.'
			},
			{
				q: 'Does the top-up let in extremist parties?',
				a: 'It lets in parties roughly in proportion to their actual support — no more, no less. A party on 14% gets about 14% of seats: not shut out, not amplified. Proportionality is a ceiling on over-representation as much as a floor under under-representation.'
			}
		],

		bottomLine:
			"AMS+ changes the least about what a British voter already recognises: you keep your local MP, you get a proportional Parliament, and the only new ask is ticking the boxes you approve instead of marking one. If your priority is 'proportional, but keep my constituency', this is the most familiar route there."
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
		tagline: 'Simple and proportional',
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
		proportionality: 'full',

		lede:
			'If you want to carry the simple approval ballot all the way through to a proportional Parliament, this is the destination. The price is not ballot complexity. It is the move to multi-member districts and the design choices that come with them.',

		peers: ['stv', 'single-winner-approval'],
		peerRationale: {
			stv:
				'Does the same job — proportional representation from multi-member districts — but asks voters to rank candidates in order rather than simply tick the ones they approve.',
			'single-winner-approval':
				'The exact same ballot, scaled up: tick the candidates you approve, but counted across several seats with reweighting so the result is proportional rather than winner-take-all.'
		},

		strengthHeadlines: [
			'The simplest ballot that delivers full proportionality — just tick the boxes you approve.',
			'No ranking, no party list, no second ballot: one instruction, multi-member districts.',
			'Represents groups of voters in proportion to their size, candidate by candidate.',
			'Uses the same paper as single-winner approval; the proportionality lives in the count.'
		],

		tradeoffHeadlines: [
			'Its track record is academic and organisational, not national-legislative — no country elects its parliament this way yet.',
			'The sequential reweighting step is unfamiliar to UK voters and harder to verify by hand than a simple tally.',
			'Requires multi-member districts, so existing single-member constituencies would be grouped.',
			'Less battle-tested at scale than STV or list PR — the honest cost of being the newest option.'
		],

		faqs: [
			{
				q: 'Has anyone actually used this for a national election?',
				a: "Not for a national parliament — and the site says so plainly. Variants are used by organisations, academic and professional bodies, and in the social-choice literature it is well understood. It is on the shortlist because the ranked-versus-approval choice is the most consequential ballot decision Britain faces, and this is the cleanest expression of the approval branch — not because it has Ireland's century of practice."
			},
			{
				q: "What does 'reweighting' actually mean?",
				a: 'Seats are filled one at a time. Each time a candidate is elected, the voters who approved them have their ballots count for a little less in the next round — so a single bloc cannot sweep every seat, and smaller groups get their turn. It is the mechanism that turns a simple approval ballot into a proportional result.'
			},
			{
				q: "If it's so simple, why isn't it used more?",
				a: "Partly history: proportional systems were largely designed before approval-style counting was well understood, so ranked and list methods got there first. Part of this site's argument is that the approval branch was overlooked, not rejected — and deserves evaluation alongside the methods that happen to have a longer track record."
			}
		],

		bottomLine:
			"Proportional Approval is the boldest pick on the shortlist: the simplest possible ballot wedded to genuine proportionality, at the cost of the shortest track record. If your priority is 'proportional, with the least asked of the voter', it is the strongest answer — provided you are willing to be the place that proves it at scale rather than the place that copies a neighbour."
	},
	'party-list': {
		id: 'party-list',
		name: 'List Proportional Representation',
		character: 'the party-line',
		family: 'single-mark',
		atoms: {
			ballot: 'single-mark',
			district: 'national',
			allocation: 'divisor'
		},
		route: '/party-list',
		tagline: 'Vote by party only',
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
			note: "Standard paper ballot; counts use Sainte-Laguë divisors (the most proportional of the common highest-averages methods)."
		},
		proportionality: 'full',

		lede:
			"Party-list systems are the most common form of proportional representation worldwide. Voters choose a party, seats are divided in proportion to each party's vote share, and the details — open or closed lists, thresholds, allocation formulas — determine how much power voters have over which candidates actually take those seats.",

		peers: ['ams-plus', 'stv'],
		peerRationale: {
			'ams-plus':
				'Uses the same list mechanism to deliver proportionality, but keeps a named local MP for every constituency instead of electing everyone from regional lists.',
			stv:
				'Also fully proportional, but voters choose between individual candidates in multi-member districts rather than voting for a party and its list.'
		},

		strengthHeadlines: [
			'The cleanest, most direct proportionality: vote share and seat share line up closely.',
			'Simple to vote in its closed form — one mark for a party.',
			'Used successfully across much of Europe (Netherlands, Sweden, Spain) for decades.',
			'Open and flexible-list variants let voters influence which candidates a party sends.'
		],

		tradeoffHeadlines: [
			'Weakens the direct link between a voter and a single, named local MP — the biggest objection in a UK context.',
			'Closed lists hand parties significant control over who actually gets elected.',
			'A very low or absent threshold can fragment a parliament into many small parties.',
			"Regional or national districts feel less 'local' than a constituency to many British voters."
		],

		faqs: [
			{
				q: "Doesn't this hand all the power to party bosses?",
				a: 'Closed lists do give parties control over candidate order, which is a real concern. Open and flexible-list variants return that choice to voters by letting them mark a preferred candidate within their chosen party. The trade-off between simplicity (closed) and voter control (open) is one the site lays out rather than hides.'
			},
			{
				q: 'Will I still have a local MP?',
				a: "In pure list PR, representation is by region or nationally rather than by single-member constituency, so you would have several regional representatives rather than one local MP. If keeping a named constituency MP matters most to you, AMS+ and STV are the shortlist options that preserve it."
			},
			{
				q: "Doesn't PR lead to chaotic coalitions, like Italy or Israel?",
				a: "Coalitions are more common under PR, but 'coalition' and 'chaos' are not the same thing — Germany, the Netherlands and the Nordics run stable coalition governments routinely. Instability tends to track very low thresholds and deep social divisions more than proportionality itself; a modest threshold curbs fragmentation."
			}
		],

		bottomLine:
			"List PR is the purest proportionality on the shortlist and the simplest to count — but it asks British voters to give up the thing they most associate with their MP: a single local name. If your priority is 'proportional, simple, and you don't mind regional representation', it is the most straightforward answer; if the constituency link is sacred, look at AMS+ or STV first."
	}
};
