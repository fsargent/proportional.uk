// Configuration and constants for Proportional.uk

export interface PartyMeta {
	name: string;
	color: string;
}

export const PARTY_META: Record<string, PartyMeta> = {
	labour: { name: 'Labour', color: '#E4003B' },
	conservative: { name: 'Conservative', color: '#0087DC' },
	'liberal-democrats': { name: 'Liberal Democrats', color: '#FAA61A' },
	green: { name: 'Green', color: '#6AB023' },
	'reform-uk': { name: 'Reform UK', color: '#12B6CF' },
	'scottish-national-party': { name: 'SNP', color: '#FADF00' },
	'sinn-fein': { name: 'Sinn Féin', color: '#2E8B57' },
	'democratic-unionist-party': { name: 'DUP', color: '#B22222' },
	'plaid-cymru': { name: 'Plaid Cymru', color: '#006400' },
	'social-democratic-and-labour-party': { name: 'SDLP', color: '#2E8B57' },
	alliance: { name: 'Alliance', color: '#FFC107' },
	'ulster-unionist-party': { name: 'UUP', color: '#1E90FF' },
	'traditional-unionist-voice': { name: 'TUV', color: '#1E90FF' },
	'workers-party-of-britain': { name: 'Workers', color: '#A52A2A' },
	others: { name: 'Others', color: '#9E9E9E' }
};

// Official 2024 election results (source: Electoral Reform Society 2024)
export const OFFICIAL_VOTES: Record<string, number> = {
	labour: 9708816,
	conservative: 6828726,
	'liberal-democrats': 3519214,
	'scottish-national-party': 724758,
	'sinn-fein': 210891,
	'reform-uk': 4117610,
	'democratic-unionist-party': 172058,
	green: 1943804,
	'plaid-cymru': 194811,
	'social-democratic-and-labour-party': 86861,
	alliance: 117191,
	'ulster-unionist-party': 94779,
	'traditional-unionist-voice': 48685,
	'workers-party-of-britain': 210252,
	others: 805102
};

export const OFFICIAL_FPTP_SEATS: Record<string, number> = {
	labour: 411,
	conservative: 121,
	'liberal-democrats': 72,
	'scottish-national-party': 9,
	'sinn-fein': 7,
	'reform-uk': 5,
	'democratic-unionist-party': 5,
	green: 4,
	'plaid-cymru': 4,
	'social-democratic-and-labour-party': 2,
	alliance: 1,
	'ulster-unionist-party': 1,
	'traditional-unionist-voice': 1,
	'workers-party-of-britain': 0,
	others: 6
};

// Default transfer preferences for parties below threshold
export const DEFAULT_TRANSFER_PREFERENCES: Record<string, string[]> = {
	'scottish-national-party': ['labour'],
	'plaid-cymru': ['labour'],
	green: ['labour'],
	'liberal-democrats': ['labour'],
	'social-democratic-and-labour-party': ['labour'],
	'sinn-fein': ['social-democratic-and-labour-party', 'labour'],
	'reform-uk': ['conservative', 'labour'],
	conservative: ['reform-uk', 'liberal-democrats'],
	'democratic-unionist-party': ['conservative'],
	'ulster-unionist-party': ['conservative'],
	'traditional-unionist-voice': ['conservative'],
	alliance: ['liberal-democrats', 'labour'],
	'workers-party-of-britain': ['labour'],
	others: ['liberal-democrats', 'labour']
};

// Chart configuration
export const CHART_CONFIG = {
	totalSeats: 650,
	threshold: 0.05,
	seatRadius: 5,
	rowHeight: 10,
	sectionGap: 0
};
