export type SpineSlot =
	| 'mechanics'
	| 'worked-example'
	| 'strengths'
	| 'tradeoffs'
	| 'where-used'
	| 'compares'
	| 'faq'
	| 'bottom-line';

export const SLOT_ORDER: readonly SpineSlot[] = [
	'mechanics',
	'worked-example',
	'strengths',
	'tradeoffs',
	'where-used',
	'compares',
	'faq',
	'bottom-line'
] as const;

export const SLOT_TITLES: Record<SpineSlot, string> = {
	mechanics: 'Ballot mechanics',
	'worked-example': 'Worked example',
	strengths: 'Strengths',
	tradeoffs: 'Trade-offs',
	'where-used': "Where it's used",
	compares: 'How it compares',
	faq: 'Common questions',
	'bottom-line': 'The bottom line'
};
