/**
 * Shared synthetic election config for the /dev/pav-results and /dev/stv-results
 * sketches. Both pages run the SAME voters and candidates through their
 * respective algorithms, so changes to this file affect both views.
 *
 * Voters carry BOTH an unordered `approvals` set (used by PAV) and an ordered
 * `ranking` (used by STV). The ranking comes from the archetype's approval
 * order; noise additions are appended at the end.
 */

export type Candidate = {
	id: string;
	name: string;
	party: string;
	color: string;
};

export type Voter = {
	id: string;
	approvals: string[]; // sorted alphabetical (set semantics)
	ranking: string[]; // ordered preference (archetype order + noise appended)
};

export type Archetype = {
	count: number;
	approvals: string[];
};

export type Group = {
	id: string;
	approvals: string[];
	voterIds: string[];
	color: string;
	label: string;
};

// ---------------------------------------------------------------------------
// Candidates — alphabetical order walks the political spectrum left → right.
// ---------------------------------------------------------------------------
export const candidates: Candidate[] = [
	{ id: 'a', name: 'Anna Adams', party: 'Far Left', color: '#2ca02c' },
	{ id: 'b', name: 'Bob Brown', party: 'Far Left', color: '#2ca02c' },
	{ id: 'c', name: 'Charlie Clarke', party: 'Left', color: '#d62728' },
	{ id: 'd', name: 'Dave Davies', party: 'Left', color: '#d62728' },
	{ id: 'e', name: 'Eve Evans', party: 'Centrist', color: '#faa61a' },
	{ id: 'f', name: 'Frank Fisher', party: 'Centrist', color: '#faa61a' },
	{ id: 'g', name: 'Grace Gardner', party: 'Right', color: '#1f77b4' },
	{ id: 'h', name: 'Helen Hughes', party: 'Right', color: '#1f77b4' },
	{ id: 'i', name: 'Ivan Ingram', party: 'Far Right', color: '#1a3a5c' },
	{ id: 'j', name: 'Jane Jones', party: 'Independent', color: '#7f7f7f' }
];

export const seats = 5;

// ---------------------------------------------------------------------------
// Archetypes — slightly-left-tilted bell of voter clusters across the
// spectrum. Each voter approves a small "ideological window" of adjacent
// candidates; the ORDER in the array is also the voter's preference order
// (used by STV).
// ---------------------------------------------------------------------------
export const archetypes: Archetype[] = [
	{ count: 10, approvals: ['a', 'b'] }, // Far Left
	{ count: 20, approvals: ['b', 'c'] }, // Far Left → Left transition
	{ count: 30, approvals: ['c', 'd'] }, // Left
	{ count: 40, approvals: ['d', 'e'] }, // Left → Centrist (peak left of centre)
	{ count: 30, approvals: ['c', 'd', 'e'] }, // Centre-left broad bloc
	{ count: 25, approvals: ['d', 'e', 'f'] }, // Centrist core
	{ count: 20, approvals: ['e', 'f', 'j'] }, // Centrist + Independent
	{ count: 20, approvals: ['j', 'g'] }, // Independent → Right
	{ count: 15, approvals: ['g', 'h'] }, // Right
	{ count: 15, approvals: ['h', 'i'] }, // Right → Far Right
	{ count: 15, approvals: ['i'] } // Far Right loyalists
];
// Total: 240 voters.

export const SEED = 7;
export const TOP_K = 6;
export const OTHER_COLOR = '#9c9c9c';

// ---------------------------------------------------------------------------
// Seeded RNG so both pages produce the same voter set deterministically.
// ---------------------------------------------------------------------------
export function mulberry32(seed: number): () => number {
	return function () {
		let t = (seed += 0x6d2b79f5);
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

// ---------------------------------------------------------------------------
// Color helpers — used to derive group colors as the mean of the approved
// candidates' party colors.
// ---------------------------------------------------------------------------
export function hexToRgb(hex: string): [number, number, number] {
	const m = hex.match(/^#([0-9a-f]{6})$/i);
	if (!m) return [128, 128, 128];
	const n = parseInt(m[1], 16);
	return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

export function rgbToHex(r: number, g: number, b: number): string {
	const c = (v: number) =>
		Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
	return `#${c(r)}${c(g)}${c(b)}`;
}

export function avgColor(ids: string[]): string {
	const cols = ids
		.map((id) => candidates.find((c) => c.id === id)?.color)
		.filter((c): c is string => Boolean(c));
	if (cols.length === 0) return OTHER_COLOR;
	const rgbs = cols.map(hexToRgb);
	const [r, g, b] = [0, 1, 2].map(
		(i) => rgbs.reduce((s, rgb) => s + rgb[i], 0) / rgbs.length
	);
	return rgbToHex(r, g, b);
}

// ---------------------------------------------------------------------------
// Voter generation. Each voter is sampled from one archetype; with low
// probability we add or remove one approval as noise to seed a realistic
// long-tail of unique ballot patterns.
// ---------------------------------------------------------------------------
export function generateVoters(seed: number = SEED): Voter[] {
	const rng = mulberry32(seed);
	const out: Voter[] = [];
	let id = 1;
	for (const arch of archetypes) {
		for (let i = 0; i < arch.count; i++) {
			// Start with the archetype's preference order.
			const ordered: string[] = [...arch.approvals];
			const noiseAdds: string[] = [];

			// 15% chance to add a random extra approval.
			if (rng() < 0.15) {
				const extra = candidates[Math.floor(rng() * candidates.length)].id;
				if (!ordered.includes(extra)) noiseAdds.push(extra);
			}
			// 10% chance to drop one of the originals.
			if (rng() < 0.1 && ordered.length > 1) {
				const removeIdx = Math.floor(rng() * ordered.length);
				ordered.splice(removeIdx, 1);
			}

			const ranking = [...ordered, ...noiseAdds];
			const approvals = [...ranking].sort();
			out.push({ id: `V${id++}`, approvals, ranking });
		}
	}
	return out;
}

export const voters: Voter[] = generateVoters();

// ---------------------------------------------------------------------------
// Helpers used by both pages.
// ---------------------------------------------------------------------------
export const findCandidate = (id: string): Candidate =>
	candidates.find((c) => c.id === id)!;

// Group voters by exact approval-set; top-K patterns get distinct colors and
// labels, the long tail is collapsed into an "Other" bucket.
export function buildGroups(input: Voter[] = voters, topK: number = TOP_K): Group[] {
	const groups = new Map<string, string[]>();
	input.forEach((v) => {
		const key = v.approvals.join(',');
		if (!groups.has(key)) groups.set(key, []);
		groups.get(key)!.push(v.id);
	});
	const sorted = [...groups.entries()].sort((a, b) => b[1].length - a[1].length);
	const out: Group[] = [];
	sorted.slice(0, topK).forEach(([key, voterIds], i) => {
		const approvals = key.split(',').filter(Boolean);
		const names = approvals
			.map((id) => candidates.find((c) => c.id === id)?.name.split(' ')[0] ?? '?')
			.join(' + ');
		out.push({
			id: `c${i}`,
			approvals,
			voterIds,
			color: avgColor(approvals),
			label: names
		});
	});
	const rest = sorted.slice(topK);
	if (rest.length > 0) {
		out.push({
			id: 'other',
			approvals: [],
			voterIds: rest.flatMap(([, v]) => v),
			color: OTHER_COLOR,
			label: `Other (${rest.length} patterns)`
		});
	}
	return out;
}

export const groups: Group[] = buildGroups();

// Unweighted approval totals — what straight Approval Voting would count.
export type ApprovalTotal = { id: string; count: number };
export const approvalTotals: ApprovalTotal[] = candidates
	.map((c) => ({
		id: c.id,
		count: voters.reduce((s, v) => s + (v.approvals.includes(c.id) ? 1 : 0), 0)
	}))
	.sort((a, b) => b.count - a.count || a.id.localeCompare(b.id));

// Spectrum-ordered (left → right). Independent (Jane) sits with the centrists.
export const spectrumOrder: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'j', 'g', 'h', 'i'];

export const spectrumTotals: ApprovalTotal[] = spectrumOrder.map(
	(id) => approvalTotals.find((t) => t.id === id)!
);
