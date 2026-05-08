import {
	METHODS,
	type AllocationAtom,
	type BallotAtom,
	type DistrictAtom,
	type Method,
	type MethodId
} from './methods';

export type SwapAxis = 'ballot' | 'district' | 'allocation';

export const SWAP_AXES: readonly SwapAxis[] = ['ballot', 'district', 'allocation'] as const;

export const AXIS_LABEL: Record<SwapAxis, string> = {
	ballot: 'Ballot',
	district: 'District',
	allocation: 'Allocation'
};

export const BALLOT_VALUES: readonly BallotAtom[] = [
	'single-mark',
	'approval',
	'ranked',
	'score'
] as const;
export const DISTRICT_VALUES: readonly DistrictAtom[] = [
	'single-member',
	'multi-member',
	'hybrid'
] as const;
export const ALLOCATION_VALUES: readonly AllocationAtom[] = [
	'plurality',
	'transfer',
	'reweighting',
	'topup',
	'divisor'
] as const;

export const ATOM_VALUE_LABEL: Record<string, string> = {
	'single-mark': 'single-mark',
	approval: 'approval',
	ranked: 'ranked',
	score: 'score',
	'single-member': 'single-member',
	'multi-member': 'multi-member',
	hybrid: 'hybrid',
	plurality: 'plurality',
	transfer: 'transfer',
	reweighting: 'reweighting',
	topup: 'top-up',
	divisor: 'divisor'
};

type AtomTriple = {
	ballot: BallotAtom;
	district: DistrictAtom;
	allocation: AllocationAtom;
};

export function methodByAtoms(triple: AtomTriple): Method | null {
	for (const m of Object.values(METHODS)) {
		if (
			m.atoms.ballot === triple.ballot &&
			m.atoms.district === triple.district &&
			m.atoms.allocation === triple.allocation
		) {
			return m;
		}
	}
	return null;
}

export type SwapOption = {
	axis: SwapAxis;
	/** The candidate atom value on the swap axis. Always different from the source method. */
	value: BallotAtom | DistrictAtom | AllocationAtom;
	/** The method you'd land on by swapping just this one atom — null if no named method exists. */
	method: Method | null;
};

export type AxisSwap = {
	axis: SwapAxis;
	currentValue: BallotAtom | DistrictAtom | AllocationAtom;
	/** All other values for this axis, with their destination methods. */
	options: SwapOption[];
	/** First option whose method is non-null. Convenience for UI that just wants "the sibling". */
	primary: SwapOption | null;
};

function valuesFor(axis: SwapAxis): readonly (BallotAtom | DistrictAtom | AllocationAtom)[] {
	if (axis === 'ballot') return BALLOT_VALUES;
	if (axis === 'district') return DISTRICT_VALUES;
	return ALLOCATION_VALUES;
}

function tripleWithSwap(
	source: Method,
	axis: SwapAxis,
	value: BallotAtom | DistrictAtom | AllocationAtom
): AtomTriple {
	if (axis === 'ballot') {
		return { ballot: value as BallotAtom, district: source.atoms.district, allocation: source.atoms.allocation };
	}
	if (axis === 'district') {
		return { ballot: source.atoms.ballot, district: value as DistrictAtom, allocation: source.atoms.allocation };
	}
	return { ballot: source.atoms.ballot, district: source.atoms.district, allocation: value as AllocationAtom };
}

/** Per-axis swap data for a given method. */
export function swaps(id: MethodId): Record<SwapAxis, AxisSwap> {
	const source = METHODS[id];
	const result = {} as Record<SwapAxis, AxisSwap>;
	for (const axis of SWAP_AXES) {
		const currentValue = source.atoms[axis];
		const options: SwapOption[] = valuesFor(axis)
			.filter((v) => v !== currentValue)
			.map((v) => ({
				axis,
				value: v,
				method: methodByAtoms(tripleWithSwap(source, axis, v))
			}));
		const primary = options.find((o) => o.method !== null) ?? null;
		result[axis] = { axis, currentValue, options, primary };
	}
	return result;
}

export type Relation = {
	method: Method;
	/** Which atoms match the source method. Empty array if none. */
	sharedAxes: SwapAxis[];
	/** Which axis differs (computed when sharedAxes.length === 2). undefined otherwise. */
	differingAxis?: SwapAxis;
};

/**
 * Methods related to the given one, sorted by atom overlap (most-shared first).
 * Includes any method sharing ≥1 atom. Use sharedAxes.length to filter to strict siblings (=2).
 */
export function relatedMethods(id: MethodId): Relation[] {
	const source = METHODS[id];
	const out: Relation[] = [];
	for (const m of Object.values(METHODS)) {
		if (m.id === id) continue;
		const sharedAxes: SwapAxis[] = [];
		for (const axis of SWAP_AXES) {
			if (m.atoms[axis] === source.atoms[axis]) sharedAxes.push(axis);
		}
		if (sharedAxes.length === 0) continue;
		const differingAxes = SWAP_AXES.filter((a) => !sharedAxes.includes(a));
		out.push({
			method: m,
			sharedAxes,
			differingAxis: differingAxes.length === 1 ? differingAxes[0] : undefined
		});
	}
	out.sort((a, b) => b.sharedAxes.length - a.sharedAxes.length);
	return out;
}

/** Human-readable delta line, e.g. "Same ballot and district, different allocation". */
export function deltaLine(rel: Relation): string {
	const { sharedAxes } = rel;
	const sharedLabels = sharedAxes.map((a) => AXIS_LABEL[a].toLowerCase());
	const differingAxes = SWAP_AXES.filter((a) => !sharedAxes.includes(a));
	const differingLabels = differingAxes.map((a) => AXIS_LABEL[a].toLowerCase());
	const sharedPhrase =
		sharedLabels.length === 1
			? `Same ${sharedLabels[0]}`
			: sharedLabels.length === 2
				? `Same ${sharedLabels[0]} and ${sharedLabels[1]}`
				: 'Same ballot, district, and allocation';
	const differingPhrase =
		differingLabels.length === 0
			? ''
			: differingLabels.length === 1
				? `different ${differingLabels[0]}`
				: differingLabels.length === 2
					? `different ${differingLabels[0]} and ${differingLabels[1]}`
					: 'different ballot, district, and allocation';
	return differingPhrase ? `${sharedPhrase}, ${differingPhrase}.` : `${sharedPhrase}.`;
}
