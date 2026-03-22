<script lang="ts">
	import HexMap from '$lib/components/hexmap/HexMap.svelte';
	import DistrictMetrics from '$lib/components/hexmap/DistrictMetrics.svelte';
	import { PARTY_META } from '$lib/config';
	import hexDataset from '$lib/data/uk-westminster-hexes.json';
	import resultsDataset from '$lib/data/ge2024-constituency-results.json';
	import { buildDistricts, calculateDistrictMetrics } from '$lib/hexmap/districts';
	import type { HexDataset } from '$lib/hexmap/types';
	import type { ConstituencyResultsDataset } from '$lib/stv-sim';
	import { partyLabel, simulateGroupedDistricts } from '$lib/stv-sim';

	const dataset = hexDataset as HexDataset;
	const results = resultsDataset as unknown as ConstituencyResultsDataset;
	const groupingOptions = [1, 2, 3, 4, 5, 6, 8, 12, 20, 40, 80, 160, 400];
	const reasonableRange = { min: 5, max: 12 };

	let groupingIndex = $state(groupingOptions.indexOf(8));
	let colourMode = $state<'groups' | 'seats'>('seats');
	let hoveredDistrictId = $state<string | null>(null);
	const targetMembers = $derived(groupingOptions[groupingIndex]);
	const districts = $derived(buildDistricts(dataset.seats, targetMembers));
	const metrics = $derived(calculateDistrictMetrics(districts, targetMembers, dataset.seatCount));
	const simulation = $derived(simulateGroupedDistricts(districts, dataset.seats, results));

	const reasonableMinIndex = groupingOptions.findIndex((value) => value >= reasonableRange.min);
	const reasonableMaxIndex = groupingOptions.findIndex((value) => value >= reasonableRange.max);
	const reasonableStartPercent = $derived((reasonableMinIndex / (groupingOptions.length - 1)) * 100);
	const reasonableWidthPercent = $derived(
		((reasonableMaxIndex - reasonableMinIndex) / (groupingOptions.length - 1)) * 100
	);
	const practicalityLabel = $derived(
		targetMembers <= 4
			? 'Simple but not very proportional'
			: targetMembers <= 12
				? 'Reasonable practical range'
				: targetMembers <= 32
					? 'Heavy ballot, still arguable'
					: 'Dangerous territory for STV ballot size'
	);
	const topParties = $derived(simulation.nationalPartyTotals.slice(0, 8));
	const partyColour = (party: string | null) => {
		if (!party) return '#64748b';
		return PARTY_META[party]?.color ?? '#64748b';
	};
	const districtMap = $derived(new Map(simulation.districts.map((district) => [district.id, district])));
	const districtDisplay = $derived(
		Object.fromEntries(
			districts.map((district) => {
				const sim = districtMap.get(district.id);
				const winningLine = sim
					? Object.entries(sim.seatAllocation)
							.filter(([, seats]) => seats > 0)
							.sort((a, b) => b[1] - a[1])
							.map(([party, seats]) => `${partyLabel(party)} ${seats}`)
							.join(' · ')
					: 'No projected winners';
				const constituencyList = district.seatIds
					.map((seatId) => dataset.seats.find((seat) => seat.id === seatId)?.name ?? seatId)
					.slice(0, 8)
					.join(', ');
				return [
					district.id,
					{
						id: district.id,
						label: String(district.memberCount),
						tooltipTitle: `${district.id} · ${district.memberCount} members`,
						tooltipLines: [
							winningLine,
							`Candidates on ballot: ~${sim?.candidateCount ?? 0}`,
							`Made of: ${constituencyList}${district.seatIds.length > 8 ? '…' : ''}`
						]
					}
				];
			})
		)
	);
	const seatDisplay = $derived(
		Object.fromEntries(
			districts.flatMap((district) => {
				const sim = districtMap.get(district.id);
				const winners = sim?.seatWinners ?? [];
				return district.seatIds.map((seatId, index) => {
					const party = colourMode === 'seats' ? winners[index] ?? sim?.leadingParty ?? null : null;
					return [seatId, { fill: party ? partyColour(party) : undefined }];
				});
			})
		)
	);
	const hoveredDistrict = $derived(hoveredDistrictId ? districtMap.get(hoveredDistrictId) ?? null : null);
</script>

<svelte:head>
	<title>STV Simulator</title>
	<meta
		name="description"
		content="Explore how grouped UK constituencies would affect proportionality and ballot complexity under STV-style multi-member districts."
	/>
</svelte:head>

<section class="stv-page">
	<div class="hero-block">
		<p class="eyebrow">STV simulator</p>
		<h1>How district size changes STV outcomes</h1>
		<p class="intro">
			This simulator groups current Westminster constituencies into larger multi-member districts,
			aggregates the 2024 constituency vote totals inside each grouped district, and allocates seats
			with a proportional approximation so you can explore the tradeoff between proportionality and
			ballot manageability.
		</p>
	</div>

	<div class="control-panel">
		<div class="view-toggle" role="group" aria-label="Map colouring mode">
			<button type="button" class:selected={colourMode === 'seats'} onclick={() => (colourMode = 'seats')}>Projected seat colours</button>
			<button type="button" class:selected={colourMode === 'groups'} onclick={() => (colourMode = 'groups')}>Grouping colours</button>
		</div>

		<div class="slider-panel">
			<label for="targetMembers">
				<span>Target members per grouped district</span>
				<strong>{targetMembers}</strong>
			</label>
			<div class="slider-shell">
				<div
					class="reasonable-band"
					style:left={`${reasonableStartPercent}%`}
					style:width={`${reasonableWidthPercent}%`}
					aria-hidden="true"
				></div>
				<input
					id="targetMembers"
					type="range"
					min="0"
					max={groupingOptions.length - 1}
					step="1"
					bind:value={groupingIndex}
				/>
			</div>
			<div class="scale-labels" aria-hidden="true">
				{#each groupingOptions as option}
					<span>{option}</span>
				{/each}
			</div>
		</div>

		<div class="summary-strip">
			<p><strong>Practicality:</strong> {practicalityLabel}</p>
			<p><strong>Avg candidates on ballot:</strong> ~{simulation.estimatedCandidatesPerBallot.toFixed(0)}</p>
			<p><strong>Gallagher index:</strong> {simulation.gallagher.toFixed(1)}</p>
			<p><strong>Loosemore–Hanby:</strong> {simulation.loosemoreHanby.toFixed(1)}</p>
		</div>
	</div>

	<div class="map-and-tooltip">
		<HexMap
			seats={dataset.seats}
			{districts}
			title="Grouped UK district map for STV simulation"
			{districtDisplay}
			{seatDisplay}
			{hoveredDistrictId}
			onDistrictHover={(districtId) => (hoveredDistrictId = districtId)}
			onDistrictLeave={() => (hoveredDistrictId = null)}
			showSeatDots={colourMode === 'groups'}
		/>

		<div class="tooltip-card">
			{#if hoveredDistrict}
				<h2>{hoveredDistrict.id}</h2>
				<p><strong>Projected seat split:</strong> {Object.entries(hoveredDistrict.seatAllocation).filter(([, seats]) => seats > 0).sort((a, b) => b[1] - a[1]).map(([party, seats]) => `${partyLabel(party)} ${seats}`).join(' · ')}</p>
				<p><strong>Members:</strong> {hoveredDistrict.memberCount}</p>
				<p><strong>Estimated candidates:</strong> ~{hoveredDistrict.candidateCount}</p>
				<p><strong>Constituencies inside:</strong></p>
				<ul>
					{#each districts.find((district) => district.id === hoveredDistrict.id)?.seatIds ?? [] as seatId}
						<li>{dataset.seats.find((seat) => seat.id === seatId)?.name ?? seatId}</li>
					{/each}
				</ul>
			{:else}
				<h2>Hover a district</h2>
				<p>Move over a grouped district to see which seats it contains and which parties would win there.</p>
			{/if}
		</div>
	</div>
	<DistrictMetrics {metrics} />

	<section class="results-grid">
		<div class="result-card">
			<h2 class="section-header">National seat outcome</h2>
			<ul class="party-list">
				{#each topParties as party (party.party)}
					<li>
						<span class="party-name">{partyLabel(party.party)}</span>
						<span class="party-meta">{party.seats} seats · {(party.voteShare * 100).toFixed(1)}% votes · {(party.seatShare * 100).toFixed(1)}% seats</span>
					</li>
				{/each}
			</ul>
		</div>

		<div class="result-card">
			<h2 class="section-header">What this model assumes</h2>
			<ul>
				<li>Current constituency vote totals are summed into each grouped district.</li>
				<li>Seats are allocated within each grouped district using D’Hondt as a proportional approximation.</li>
				<li>This is not a literal transfer-by-transfer STV count.</li>
				<li>The ballot complexity warning is based on actual 2024 candidate counts, grouped into the larger districts.</li>
			</ul>
		</div>
	</section>
</section>

<style>
	.stv-page {
		display: grid;
		gap: 1.75rem;
		padding-bottom: 2rem;
	}
	.hero-block { max-width: 54rem; }
	.eyebrow {
		display: inline-flex; padding: 0.4rem 0.75rem; border-radius: 999px;
		background: rgba(31, 95, 150, 0.08); border: 1px solid rgba(31, 95, 150, 0.16);
		color: var(--header-bg); font-weight: 700;
	}
	.hero-block h1 { margin: 0.85rem 0 0.75rem; }
	.intro { font-size: 1.1rem; max-width: 50rem; }
	.control-panel, .result-card, .tooltip-card {
		padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--border-color);
		background: linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(241,245,249,0.95) 100%);
		box-shadow: var(--shadow-soft);
	}
	.view-toggle {
		display:flex;
		gap:0.65rem;
		flex-wrap:wrap;
		margin-bottom:1rem;
	}
	.view-toggle button {
		border: 1px solid var(--border-color);
		background: white;
		border-radius: 999px;
		padding: 0.7rem 1rem;
		font: inherit;
		font-weight: 600;
		cursor: pointer;
	}
	.view-toggle button.selected {
		background: var(--header-bg);
		color: white;
		border-color: var(--header-bg);
	}
	.slider-panel { display:grid; gap:0.55rem; }
	.slider-panel label { display:flex; justify-content:space-between; gap:1rem; font-weight:600; }
	.slider-shell { position:relative; padding:0.2rem 0; }
	.reasonable-band {
		position:absolute; top:50%; height:0.7rem; transform:translateY(-50%); border-radius:999px;
		background: linear-gradient(90deg, rgba(22,163,74,0.22), rgba(22,163,74,0.42));
		border: 1px solid rgba(22,163,74,0.38); pointer-events:none;
	}
	.slider-panel input { position:relative; width:100%; background:transparent; }
	.scale-labels { display:grid; grid-template-columns: repeat(13, minmax(0, 1fr)); font-size:0.78rem; color:var(--text-soft); gap:0.2rem; }
	.scale-labels span { text-align:center; white-space:nowrap; }
	.summary-strip {
		display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:0.75rem;
		margin-top:1rem; padding-top:1rem; border-top:1px solid var(--border-color);
	}
	.summary-strip p, .party-list, .result-card ul { margin:0; }
	.map-and-tooltip { display:grid; gap:1rem; align-items:start; }
	.tooltip-card h2 { margin-top:0; margin-bottom:0.75rem; }
	.tooltip-card ul { margin-top:0.5rem; max-height:18rem; overflow:auto; }
	.results-grid { display:grid; gap:1rem; }
	.party-list { list-style:none; padding:0; display:grid; gap:0.7rem; }
	.party-list li { display:flex; justify-content:space-between; gap:1rem; border-bottom:1px solid var(--border-color); padding-bottom:0.55rem; }
	.party-name { font-weight:700; color:var(--text-dark); }
	.party-meta { color:var(--text-soft); text-align:right; }
	@media (min-width: 960px) {
		.map-and-tooltip { grid-template-columns: minmax(0, 1.35fr) minmax(300px, 0.65fr); }
		.results-grid { grid-template-columns: 1.15fr 0.85fr; }
	}
	@media (max-width: 700px) { .party-list li { flex-direction:column; } .party-meta { text-align:left; } }
</style>
