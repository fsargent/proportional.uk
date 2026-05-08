import { METHODS, type Method, type MethodId } from './methods';

export type SwapAxis = 'ballot' | 'district' | 'allocation';

export const SWAP_AXES: readonly SwapAxis[] = ['ballot', 'district', 'allocation'] as const;

export const AXIS_LABEL: Record<SwapAxis, string> = {
	ballot: 'Ballot',
	district: 'District',
	allocation: 'Allocation'
};

export const ATOM_VALUE_LABEL: Record<string, string> = {
	'single-mark': 'single-mark',
	approval: 'approval',
	ranked: 'ranked',
	score: 'score',
	'single-member': 'single-member',
	'multi-member': 'multi-member',
	hybrid: 'hybrid',
	national: 'national',
	plurality: 'plurality',
	transfer: 'transfer',
	reweighting: 'reweighting',
	topup: 'top-up',
	divisor: 'divisor'
};

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
