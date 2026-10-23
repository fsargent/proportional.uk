<script lang="ts">
	import { onMount } from 'svelte';
	import { scenarios, DEFAULT_SCENARIO_ID } from '$lib/district-lab/scenarios';
	import { representedVoters, runSystem } from '$lib/district-lab/results';
	import type { LabScenario, LabSystem } from '$lib/district-lab/types';

	const systemOptions: Array<{ id: LabSystem; label: string; ballot: string; description: string }> = [
		{
			id: 'fptp',
			label: 'First Past the Post',
			ballot: 'Choose one candidate',
			description: 'One winner: the candidate with the most first-choice votes.'
		},
		{
			id: 'party-list',
			label: 'Party-list Sainte-Laguë',
			ballot: 'Choose one party',
			description: 'Eight seats allocated to parties using divisors 1, 3, 5…'
		},
		{
			id: 'pav',
			label: 'PAV',
			ballot: 'Approve any candidates',
			description: 'Eight seats, reweighting voters after candidates they approved are elected.'
		},
		{
			id: 'stv',
			label: 'Single Transferable Vote',
			ballot: 'Rank candidates',
			description: 'Eight seats, using a Droop quota and fractional surplus transfers.'
		}
	];

	let scenarioId = $state(DEFAULT_SCENARIO_ID);
	let system = $state<LabSystem>('pav');
	let roundIndex = $state(0);
	let showAssumptions = $state(false);

	const scenario = $derived(scenarios.find((item) => item.id === scenarioId) ?? scenarios[0]) as LabScenario;
	const result = $derived(runSystem(scenario, system));
	const activeRound = $derived(result.rounds[Math.min(roundIndex, result.rounds.length - 1)]);
	const currentSystem = $derived(systemOptions.find((item) => item.id === system) ?? systemOptions[0]);
	const totalVoters = $derived(scenario.groups.reduce((total, group) => total + group.count, 0));
	const represented = $derived(scenario.groups.reduce((total, group) => total + representedVoters(scenario, result, group.id), 0));

	function selectScenario(id: string) {
		scenarioId = id;
		roundIndex = 0;
		updateUrl();
	}

	function selectSystem(id: LabSystem) {
		system = id;
		roundIndex = 0;
		updateUrl();
	}

	function updateUrl() {
		if (typeof window === 'undefined') return;
		const url = new URL(window.location.href);
		url.searchParams.set('scenario', scenarioId);
		url.searchParams.set('system', system);
		window.history.replaceState({}, '', url);
	}

	function candidateName(id: string) {
		return scenario.candidates.find((candidate) => candidate.id === id)?.name ?? id;
	}

	function candidateParty(id: string) {
		return scenario.candidates.find((candidate) => candidate.id === id)?.party ?? '';
	}

	function candidateColour(id: string) {
		return scenario.candidates.find((candidate) => candidate.id === id)?.colour ?? '#64748b';
	}

	function contenderLabel(id: string) {
		if (system === 'party-list') {
			return scenario.candidates.find((candidate) => candidate.partyId === id)?.party ?? id;
		}
		return candidateName(id);
	}

	function advanceRound(change: number) {
		roundIndex = Math.max(0, Math.min(result.rounds.length - 1, roundIndex + change));
	}

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		const requestedScenario = params.get('scenario');
		const requestedSystem = params.get('system') as LabSystem | null;
		if (requestedScenario && scenarios.some((item) => item.id === requestedScenario)) scenarioId = requestedScenario;
		if (requestedSystem && systemOptions.some((item) => item.id === requestedSystem)) system = requestedSystem;
	});
</script>

<svelte:head>
	<title>District Lab | proportional.uk</title>
	<meta
		name="description"
		content="Explore how ballot design and counting rules change representation in an illustrative eight-member district."
	/>
</svelte:head>

<main class="lab-page">
	<header class="lab-hero">
		<p class="eyebrow">District Lab</p>
		<h1>Who gets a voice in this district?</h1>
		<p>
			The same place can elect very different representatives depending on the ballot and the count.
			Choose a situation, inspect the ballots, then see the outcome.
		</p>
	</header>

	<section class="warning" aria-label="Scenario notice">
		<strong>Illustrative scenario.</strong> These are invented preference ballots for explaining how electoral
		rules respond to overlapping support. They are not a reconstruction or forecast of a real election.
	</section>

	<section aria-labelledby="scenario-heading">
		<div class="section-heading">
			<p class="step">1</p>
			<div>
				<h2 id="scenario-heading">Choose the situation</h2>
				<p>Each has 1,000 voters and 12 fictional candidates competing for eight seats.</p>
			</div>
		</div>
		<div class="scenario-grid">
			{#each scenarios as item (item.id)}
				<button
					type="button"
					class:selected={scenario.id === item.id}
					class="scenario-card"
					onclick={() => selectScenario(item.id)}
					aria-pressed={scenario.id === item.id}
				>
					<strong>{item.title}</strong>
					<span>{item.strapline}</span>
					<small>{item.question}</small>
				</button>
			{/each}
		</div>
		<p class="scenario-narrative">{scenario.narrative}</p>
	</section>

	<section aria-labelledby="ballot-heading">
		<div class="section-heading">
			<p class="step">2</p>
			<div>
				<h2 id="ballot-heading">See the ballots</h2>
				<p>These voter groups are the scenario’s whole electorate. Their ballots are open for inspection.</p>
			</div>
		</div>
		<div class="ballot-grid">
			{#each scenario.groups as group (group.id)}
				<article class="group-card" style:border-left-color={group.colour}>
					<div class="group-heading">
						<div>
							<h3>{group.label}</h3>
							<p>{group.count} voters · {Math.round((group.count / totalVoters) * 100)}%</p>
						</div>
						<span class="party-dot" style:background={group.colour} aria-hidden="true"></span>
					</div>
					<p>{group.explanation}</p>
					<div class="ballot-line">
						<span>{currentSystem.ballot}</span>
						{#if system === 'fptp'}
							<strong>{candidateName(group.firstChoice)}</strong>
						{:else if system === 'party-list'}
							<strong>{scenario.candidates.find((candidate) => candidate.partyId === group.primaryPartyId)?.party}</strong>
						{:else if system === 'pav'}
							<div class="candidate-chips">
								{#each group.approval as id (id)}
									<span style:--chip-color={candidateColour(id)}>{candidateName(id)}</span>
								{/each}
							</div>
						{:else}
							<ol class="ranked-chips" aria-label="{group.label} ranking">
								{#each group.ranking as id, index (id)}
									<li style:--chip-color={candidateColour(id)}><span>{index + 1}</span>{candidateName(id)}</li>
								{/each}
							</ol>
						{/if}
					</div>
				</article>
			{/each}
		</div>
	</section>

	<section aria-labelledby="system-heading">
		<div class="section-heading">
			<p class="step">3</p>
			<div>
				<h2 id="system-heading">See who is represented</h2>
				<p>Change the ballot and count. The voters and candidates stay the same.</p>
			</div>
		</div>
		<div class="system-picker" role="radiogroup" aria-label="Counting system">
			{#each systemOptions as option (option.id)}
				<button
					type="button"
					class:selected={system === option.id}
					class="system-card"
					onclick={() => selectSystem(option.id)}
					role="radio"
					aria-checked={system === option.id}
				>
					<strong>{option.label}</strong>
					<span>{option.ballot}</span>
					<small>{option.description}</small>
				</button>
			{/each}
		</div>

		<div class="results-layout">
			<article class="results-card">
				<div class="result-header">
					<div>
						<p class="eyebrow">Outcome</p>
						<h3>{currentSystem.label}</h3>
					</div>
					<div class="representation-stat">
						<strong>{Math.round((represented / totalVoters) * 100)}%</strong>
						<span>have at least one candidate they supported elected</span>
					</div>
				</div>

				<div class="winner-grid" aria-label="Elected candidates">
					{#each result.winnerIds as id, index (id)}
						<div class="winner" style:border-top-color={candidateColour(id)}>
							<span>Seat {index + 1}</span>
							<strong>{candidateName(id)}</strong>
							<small>{candidateParty(id)}</small>
						</div>
					{/each}
				</div>
				{#if system === 'fptp'}
					<p class="result-note">FPTP fills one seat only. The other seven places do not exist under this system.</p>
				{:else}
					<p class="result-note">The district fills all eight seats. Representation means approving at least one elected candidate.</p>
				{/if}
			</article>

			<article class="ledger-card">
				<h3>Representation ledger</h3>
				<p>Which groups have someone they supported?</p>
				<div class="ledger-list">
					{#each scenario.groups as group (group.id)}
						{@const hasRepresentation = representedVoters(scenario, result, group.id) > 0}
						<div class:represented={hasRepresentation} class="ledger-row">
							<span class="ledger-dot" style:background={group.colour}></span>
							<strong>{group.label}</strong>
							<span>{hasRepresentation ? 'represented' : 'no supported winner'}</span>
						</div>
					{/each}
				</div>
			</article>
		</div>

		<article class="count-card">
			<div class="count-heading">
				<div>
					<h3>Why this seat?</h3>
					<p>
						{system === 'pav'
							? 'After every elected approval, those voters count at a lower weight: 1, then ⅓, then ⅕.'
							: system === 'party-list'
								? 'Each party’s votes are divided by 1, then 3, then 5 as it wins seats.'
								: system === 'stv'
									? 'Candidates reach the Droop quota. Surpluses and eliminated candidates transfer to next preferences.'
								: 'The candidate with the most first-choice votes wins.'}
					</p>
				</div>
				<div class="round-controls">
					<button type="button" onclick={() => advanceRound(-1)} disabled={roundIndex === 0}>Previous</button>
					<span>Round {activeRound.seat} of {result.rounds.length}</span>
					<button type="button" onclick={() => advanceRound(1)} disabled={roundIndex === result.rounds.length - 1}>Next</button>
				</div>
			</div>
			<div class="round-winner">
				<span>Seat {activeRound.seat}</span>
				<strong>{contenderLabel(activeRound.winnerId)}</strong>
				<small>{activeRound.winningTotal.toFixed(system === 'party-list' ? 1 : 0)} weighted votes</small>
			</div>
			<div class="contenders">
				{#each activeRound.contenders.slice(0, 5) as contender (contender.candidateId)}
					<div class:winner-row={contender.candidateId === activeRound.winnerId} class="contender-row">
						<span>{contenderLabel(contender.candidateId)}</span>
						<strong>{contender.total.toFixed(system === 'party-list' ? 1 : 0)}</strong>
					</div>
				{/each}
			</div>
		</article>
	</section>

	<section class="assumptions">
		<button type="button" onclick={() => (showAssumptions = !showAssumptions)} aria-expanded={showAssumptions}>
			{showAssumptions ? 'Hide' : 'Show'} assumptions and methods
		</button>
		{#if showAssumptions}
			<div>
				<p>The candidates, voter groups and preference ballots are fictional and deterministic. Each scenario totals 1,000 voters.</p>
				<p>
					PAV elects the highest approval total in each round, then reduces a group’s weight according to
					<code>1 / (1 + 2k)</code>, where <code>k</code> is the number of elected candidates that group approved.
				</p>
				<p>STV uses the Droop quota and fractional Gregory transfers. The stepper shows candidate-election rounds; its ballot rows show the full rankings used for transfers.</p>
				<p>Ties are resolved by the displayed ballot order. The party-list result uses each group’s stated political home; it is not a real-vote re-count.</p>
			</div>
		{/if}
	</section>
</main>

<style>
	.lab-page { max-width: 1120px; margin: 0 auto; padding: 3rem 1.25rem 5rem; color: var(--text-color); }
	.lab-hero { max-width: 48rem; margin-bottom: 1.5rem; }
	.lab-hero h1 { color: var(--text-dark); font-size: clamp(2.1rem, 6vw, 3.7rem); line-height: 1.05; margin: 0.25rem 0 1rem; letter-spacing: -0.04em; }
	.lab-hero p { font-size: 1.1rem; line-height: 1.65; margin: 0; }
	.eyebrow, .step { color: var(--accent-color, #176b5b); font-size: 0.82rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; }
	.warning { background: color-mix(in srgb, #f4bb3a 18%, var(--surface-raised)); border: 1px solid color-mix(in srgb, #b87900 45%, var(--border-color)); border-radius: var(--radius-md); line-height: 1.5; margin: 1.5rem 0 3rem; padding: 1rem 1.1rem; }
	section { margin-top: 3.5rem; }
	.section-heading { display: flex; gap: 1rem; align-items: flex-start; margin-bottom: 1rem; }
	.step { align-items: center; background: var(--header-bg); border-radius: 999px; color: var(--text-inverse); display: flex; height: 2rem; justify-content: center; margin: 0.1rem 0 0; width: 2rem; }
	.section-heading h2 { color: var(--text-dark); font-size: clamp(1.45rem, 3vw, 2rem); margin: 0; }
	.section-heading p { margin: 0.25rem 0 0; }
	.scenario-grid { display: grid; gap: 0.8rem; grid-template-columns: repeat(3, minmax(0, 1fr)); }
	.system-picker { display: grid; gap: 0.8rem; grid-template-columns: repeat(2, minmax(0, 1fr)); }
	.scenario-card, .system-card { background: var(--surface-raised); border: 1px solid var(--border-color); border-radius: var(--radius-md); color: var(--text-color); cursor: pointer; min-height: 9rem; padding: 1rem; text-align: left; }
	.scenario-card:hover, .system-card:hover { border-color: var(--accent-color, #176b5b); transform: translateY(-1px); }
	.scenario-card:focus-visible, .system-card:focus-visible, .round-controls button:focus-visible, .assumptions button:focus-visible { outline: 3px solid var(--focus-ring, #f4bb3a); outline-offset: 3px; }
	.scenario-card.selected, .system-card.selected { background: color-mix(in srgb, var(--header-bg) 9%, var(--surface-raised)); border: 2px solid var(--header-bg); }
	.scenario-card strong, .system-card strong { color: var(--text-dark); display: block; font-size: 1.05rem; }
	.scenario-card span, .system-card span { display: block; font-size: 0.92rem; margin-top: 0.45rem; }
	.scenario-card small, .system-card small { color: var(--text-soft); display: block; line-height: 1.35; margin-top: 0.8rem; }
	.scenario-narrative { background: var(--surface-raised); border-left: 4px solid var(--accent-color, #176b5b); margin: 1rem 0 0; padding: 0.8rem 1rem; }
	.ballot-grid { display: grid; gap: 0.8rem; grid-template-columns: repeat(2, minmax(0, 1fr)); }
	.group-card { background: var(--surface-raised); border: 1px solid var(--border-color); border-left: 5px solid; border-radius: var(--radius-md); padding: 1rem; }
	.group-card h3 { color: var(--text-dark); font-size: 1rem; margin: 0; }
	.group-card p { font-size: 0.9rem; line-height: 1.45; margin: 0.45rem 0; }
	.group-heading { align-items: flex-start; display: flex; justify-content: space-between; gap: 0.6rem; }
	.group-heading p { color: var(--text-soft); margin-top: 0.2rem; }
	.party-dot, .ledger-dot { border-radius: 50%; display: inline-block; flex: 0 0 auto; height: 0.8rem; width: 0.8rem; }
	.ballot-line { border-top: 1px solid var(--border-color); font-size: 0.85rem; margin-top: 0.75rem; padding-top: 0.75rem; }
	.ballot-line > span { color: var(--text-soft); display: block; font-size: 0.75rem; margin-bottom: 0.35rem; text-transform: uppercase; }
	.candidate-chips { display: flex; flex-wrap: wrap; gap: 0.35rem; }
	.candidate-chips span { border: 1px solid var(--chip-color); border-radius: 999px; font-size: 0.78rem; padding: 0.15rem 0.45rem; }
	.ranked-chips { display: flex; flex-wrap: wrap; gap: 0.35rem; list-style: none; margin: 0; padding: 0; }
	.ranked-chips li { align-items: center; border: 1px solid var(--chip-color); border-radius: 999px; display: inline-flex; font-size: 0.78rem; gap: 0.25rem; padding: 0.12rem 0.45rem 0.12rem 0.18rem; }
	.ranked-chips li span { align-items: center; background: var(--chip-color); border-radius: 50%; color: white; display: inline-flex; font-size: 0.68rem; height: 1rem; justify-content: center; width: 1rem; }
	.results-layout { display: grid; gap: 1rem; grid-template-columns: minmax(0, 1.55fr) minmax(280px, 0.75fr); margin-top: 1.2rem; }
	.results-card, .ledger-card, .count-card { background: var(--surface-raised); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.2rem; }
	.result-header { align-items: flex-start; display: flex; gap: 1rem; justify-content: space-between; }
	.result-header h3, .ledger-card h3, .count-card h3 { color: var(--text-dark); margin: 0; }
	.result-header .eyebrow { margin: 0 0 0.25rem; }
	.representation-stat { max-width: 10rem; text-align: right; }
	.representation-stat strong { color: var(--text-dark); display: block; font-size: 1.8rem; line-height: 1; }
	.representation-stat span { color: var(--text-soft); font-size: 0.75rem; line-height: 1.25; }
	.winner-grid { display: grid; gap: 0.6rem; grid-template-columns: repeat(4, minmax(0, 1fr)); margin-top: 1rem; }
	.winner { background: var(--surface-color); border: 1px solid var(--border-color); border-top: 5px solid; border-radius: var(--radius-sm); min-height: 5.5rem; padding: 0.7rem; }
	.winner span, .winner small { color: var(--text-soft); display: block; font-size: 0.74rem; }
	.winner strong { color: var(--text-dark); display: block; font-size: 0.92rem; line-height: 1.18; margin: 0.25rem 0; }
	.result-note { color: var(--text-soft); font-size: 0.85rem; line-height: 1.45; margin: 1rem 0 0; }
	.ledger-card > p { color: var(--text-soft); font-size: 0.88rem; margin: 0.3rem 0 0.8rem; }
	.ledger-list { display: flex; flex-direction: column; gap: 0.45rem; }
	.ledger-row { align-items: center; background: color-mix(in srgb, var(--surface-color) 92%, transparent); border-radius: var(--radius-sm); display: grid; font-size: 0.82rem; gap: 0.5rem; grid-template-columns: auto 1fr auto; opacity: 0.58; padding: 0.5rem; }
	.ledger-row.represented { background: color-mix(in srgb, #58a65c 14%, var(--surface-color)); opacity: 1; }
	.ledger-row > span:last-child { font-size: 0.7rem; text-align: right; }
	.count-card { margin-top: 1rem; }
	.count-heading { align-items: flex-start; display: flex; gap: 1rem; justify-content: space-between; }
	.count-heading p { color: var(--text-soft); font-size: 0.88rem; line-height: 1.4; margin: 0.35rem 0 0; max-width: 45rem; }
	.round-controls { align-items: center; display: flex; flex: 0 0 auto; gap: 0.5rem; }
	.round-controls button, .assumptions button { background: var(--surface-color); border: 1px solid var(--border-strong, var(--border-color)); border-radius: var(--radius-sm); color: var(--text-dark); cursor: pointer; padding: 0.45rem 0.65rem; }
	.round-controls button:disabled { cursor: not-allowed; opacity: 0.45; }
	.round-controls span { font-size: 0.78rem; white-space: nowrap; }
	.round-winner { align-items: baseline; border-bottom: 1px solid var(--border-color); display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 1rem 0 0.55rem; padding-bottom: 0.55rem; }
	.round-winner span { color: var(--text-soft); font-size: 0.8rem; }
	.round-winner strong { color: var(--text-dark); }
	.round-winner small { color: var(--text-soft); }
	.contenders { display: grid; gap: 0.25rem; }
	.contender-row { display: flex; justify-content: space-between; padding: 0.3rem 0.4rem; }
	.contender-row.winner-row { background: color-mix(in srgb, var(--header-bg) 10%, var(--surface-color)); border-radius: var(--radius-sm); }
	.assumptions { background: var(--surface-raised); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1rem 1.2rem; }
	.assumptions > div { font-size: 0.9rem; line-height: 1.55; max-width: 60rem; }
	.assumptions code { background: var(--surface-color); border-radius: 3px; padding: 0.1rem 0.2rem; }
	@media (max-width: 760px) {
		.lab-page { padding-top: 2rem; }
		.scenario-grid, .system-picker, .ballot-grid, .results-layout { grid-template-columns: 1fr; }
		.scenario-card, .system-card { min-height: auto; }
		.winner-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
		.count-heading { flex-direction: column; }
		.round-controls { width: 100%; }
		.round-controls span { flex: 1; text-align: center; }
	}
</style>
