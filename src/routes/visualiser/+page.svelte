<script lang="ts">
	import HexMap from '$lib/components/hexmap/HexMap.svelte';
	import DistrictMetrics from '$lib/components/hexmap/DistrictMetrics.svelte';
	import SharePieComparison from '$lib/components/SharePieComparison.svelte';
	import { PARTY_META } from '$lib/config';
	import hexDataset from '$lib/data/uk-westminster-hexes.json';
	import resultsDataset from '$lib/data/ge2024-constituency-results.json';
	import { buildDistricts, calculateDistrictMetrics } from '$lib/hexmap/districts';
	import type { HexDataset } from '$lib/hexmap/types';
	import type { ConstituencyResultsDataset } from '$lib/mmd-sim';
	import { partyLabel, simulateGroupedDistricts } from '$lib/mmd-sim';

	const dataset = hexDataset as HexDataset;
	const results = resultsDataset as unknown as ConstituencyResultsDataset;
	const groupingOptions = [1, 2, 3, 4, 5, 6, 8, 12, 20, 40, 80, 160, 400];
	const reasonableRange = { min: 5, max: 12 };

	let groupingIndex = $state(groupingOptions.indexOf(8));
	let colourMode = $state<'groups' | 'seats'>('seats');
	let hoveredDistrictId = $state<string | null>(null);
	let selectedDistrictId = $state<string | null>(null);

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
			? 'Easy to explain, but district magnitude is too low for strong proportionality'
			: targetMembers <= 12
				? 'Common working range for local multi-member districts with a usable local link'
				: targetMembers <= 32
					? 'Stronger proportionality, but the districts start to feel administratively heavy'
					: 'Very large districts with a weak constituency feel'
	);
	const partyColour = (party: string | null) => {
		if (!party) return '#64748b';
		return PARTY_META[party]?.color ?? '#64748b';
	};
	const activeDistrictId = $derived(selectedDistrictId ?? hoveredDistrictId);
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
					: 'No illustrative winners';
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
	const hoveredDistrict = $derived(activeDistrictId ? districtMap.get(activeDistrictId) ?? null : null);

	function handleDistrictHover(districtId: string) {
		if (selectedDistrictId !== null) {
			return;
		}

		hoveredDistrictId = districtId;
	}

	function handleDistrictLeave() {
		if (selectedDistrictId !== null) {
			return;
		}

		hoveredDistrictId = null;
	}

	function handleDistrictClick(districtId: string) {
		if (selectedDistrictId === districtId) {
			selectedDistrictId = null;
			hoveredDistrictId = null;
			return;
		}

		selectedDistrictId = districtId;
		hoveredDistrictId = districtId;
	}
</script>

<svelte:head>
	<title>Multi-Member District Visualiser</title>
	<meta
		name="description"
		content="Explore how grouped Westminster constituencies behave as multi-member districts, and how district size changes scale, proportionality, and ballot pressure."
	/>
</svelte:head>

<section class="mmd-page">
	<div class="hero-block">
		<h1>How district size reshapes Westminster</h1>
	<p class="intro">
			This page groups current Westminster constituencies into larger multi-member districts, then
			shows how district magnitude changes local scale, party balance, ballot pressure, and the
			practicality of using stable UK boundaries.
	</p>
	</div>

	<div class="control-panel">
		<div class="view-toggle" role="group" aria-label="Map colouring mode">
			<button type="button" class:selected={colourMode === 'seats'} onclick={() => (colourMode = 'seats')}>
				Illustrative seat colours
			</button>
			<button type="button" class:selected={colourMode === 'groups'} onclick={() => (colourMode = 'groups')}>
				Grouping colours
			</button>
		</div>

		<div class="slider-panel">
			<label for="targetMembers">
				<span>Target district magnitude</span>
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
				{#each groupingOptions as option (option)}
					<span>{option}</span>
				{/each}
			</div>
		</div>

		<div class="summary-strip">
			<p><strong>Practicality:</strong> {practicalityLabel}</p>
			<p><strong>Avg candidates on ballot:</strong> ~{simulation.estimatedCandidatesPerBallot.toFixed(0)}</p>
			<p><strong>Illustrative Gallagher:</strong> {simulation.gallagher.toFixed(1)}</p>
			<p><strong>Illustrative Loosemore-Hanby:</strong> {simulation.loosemoreHanby.toFixed(1)}</p>
		</div>

		<p class="summary-note">
			Green band marks a common working range for local multi-member districts. In UK reform terms,
			this is roughly where you can start combining current seats into recognisable local-authority or
			city-region units without losing too much local legibility. The seat split shown here is
			illustrative rather than a final count for any specific voting method.
		</p>
	</div>

	<div class="map-and-tooltip">
		<HexMap
			seats={dataset.seats}
			{districts}
			title="Grouped UK district map for multi-member district demonstration"
			{districtDisplay}
			{seatDisplay}
			hoveredDistrictId={activeDistrictId}
			onDistrictHover={handleDistrictHover}
			onDistrictClick={handleDistrictClick}
			onDistrictLeave={handleDistrictLeave}
			showSeatDots={colourMode === 'groups'}
		/>

		<div class="tooltip-card">
			{#if hoveredDistrict}
				<h2>{hoveredDistrict.id}</h2>
				{#if selectedDistrictId === hoveredDistrict.id}
					<div class="selection-banner">
						<p><strong>Selected district</strong></p>
						<button type="button" class="selection-clear" onclick={() => handleDistrictClick(hoveredDistrict.id)}>
							Clear selection
						</button>
					</div>
				{/if}
				<p>
					<strong>Illustrative Sainte-Lague seat split:</strong>
					{Object.entries(hoveredDistrict.seatAllocation)
						.filter(([, seats]) => seats > 0)
						.sort((a, b) => b[1] - a[1])
						.map(([party, seats]) => `${partyLabel(party)} ${seats}`)
						.join(' · ')}
				</p>
				<p><strong>Members:</strong> {hoveredDistrict.memberCount}</p>
				<p><strong>Estimated candidates:</strong> ~{hoveredDistrict.candidateCount}</p>
				<p><strong>Constituencies inside:</strong></p>
				<ul>
					{#each districts.find((district) => district.id === hoveredDistrict.id)?.seatIds ?? [] as seatId (seatId)}
						<li>{dataset.seats.find((seat) => seat.id === seatId)?.name ?? seatId}</li>
					{/each}
				</ul>
			{:else}
				<h2>Hover or click a district</h2>
				<p>
					Move over a grouped district to preview it, or click to keep it selected while you read
					its illustrative seat balance.
				</p>
			{/if}
		</div>
	</div>

	<DistrictMetrics {metrics} />

	<section class="results-grid">
		<div class="result-card">
			<h2 class="section-header">Illustrative seat outcome</h2>
			<SharePieComparison parties={simulation.nationalPartyTotals} />
		</div>
	</section>

	<section class="assumptions-row">
		<div class="result-card">
			<h2 class="section-header">What this demonstrator assumes</h2>
			<ul>
				<li>The map starts from the canonical 2023 Open Innovations Westminster hex layout, then groups those constituencies into larger multi-member districts.</li>
				<li>The district lines shown here are generated by an algorithm. Their exact boundaries are not the point; they are illustrative, meant to help imagine what stable grouped districts could look like before a real boundary process aligns them with local authority, county, or combined-authority geographies.</li>
				<li>Current constituency vote totals are summed into each grouped district.</li>
				<li>Seats are shown using <strong>Sainte-Lague</strong> as a proportional benchmark. That is deliberate: it is a better UK multiparty baseline than D'Hondt if the goal is to test district magnitude rather than tilt the comparison toward larger parties.</li>
				<li>Different multi-member district methods can share the same district map while using different ballots and counts.</li>
				<li>This page isolates the district-magnitude question first, because whether a district has 3, 6, or 10 members strongly shapes both representativeness and local practicality.</li>
			</ul>
		</div>
	</section>
</section>

<style>
	.mmd-page {
		display: grid;
		gap: 1.75rem;
		padding-bottom: 2rem;
	}

	.hero-block {
		max-width: 54rem;
	}

	.hero-block h1 {
		margin: 0.85rem 0 0.75rem;
	}

	.intro {
		font-size: 1.1rem;
		max-width: 50rem;
	}

	.control-panel,
	.result-card,
	.tooltip-card {
		padding: 1.25rem;
		border-radius: var(--radius-lg);
		border: 1px solid var(--border-color);
		background: var(--surface-subtle-gradient);
		box-shadow: var(--shadow-soft);
	}

	.view-toggle {
		display: flex;
		gap: 0.65rem;
		flex-wrap: wrap;
	}

	.view-toggle button {
		border: 1px solid var(--border-color);
		background: var(--surface-color);
		border-radius: 999px;
		padding: 0.7rem 1rem;
		font: inherit;
		font-weight: 600;
		cursor: pointer;
	}

	.view-toggle button.selected {
		background: var(--header-bg);
		color: var(--text-inverse);
		border-color: var(--header-bg);
	}

	.summary-strip p,
	.result-card ul,
	.summary-note {
		margin: 0;
	}

	.slider-panel {
		display: grid;
		gap: 0.55rem;
	}

	.slider-panel label {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		font-weight: 600;
	}

	.slider-shell {
		position: relative;
		padding: 0.2rem 0;
	}

	.reasonable-band {
		position: absolute;
		top: 50%;
		height: 0.7rem;
		transform: translateY(-50%);
		border-radius: 999px;
		background: linear-gradient(90deg, rgba(22, 163, 74, 0.22), rgba(22, 163, 74, 0.42));
		border: 1px solid rgba(22, 163, 74, 0.38);
		pointer-events: none;
	}

	.slider-panel input {
		position: relative;
		width: 100%;
		background: transparent;
	}

	.scale-labels {
		display: grid;
		grid-template-columns: repeat(13, minmax(0, 1fr));
		font-size: 0.78rem;
		color: var(--text-soft);
		gap: 0.2rem;
	}

	.scale-labels span {
		text-align: center;
		white-space: nowrap;
	}

	.summary-strip {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 0.75rem;
		padding-top: 1rem;
		border-top: 1px solid var(--border-color);
	}

	.summary-note {
		color: var(--text-soft);
		font-size: 0.95rem;
	}

	.map-and-tooltip {
		display: grid;
		gap: 1rem;
		align-items: start;
	}

	.tooltip-card h2 {
		margin-top: 0;
		margin-bottom: 0.75rem;
	}

	.result-card .section-header {
		margin: 0 0 1rem 0;
		padding-bottom: 0.7rem;
	}

	.selection-banner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 0.9rem;
		padding: 0.65rem 0.85rem;
		border-radius: var(--radius-md);
		background: color-mix(in srgb, var(--header-bg) 12%, transparent);
		border: 1px solid var(--accent-border);
	}

	.selection-banner p {
		margin: 0;
		color: var(--accent-text);
	}

	.selection-clear {
		border: 1px solid var(--border-color);
		background: var(--surface-color);
		border-radius: 999px;
		padding: 0.45rem 0.85rem;
		font: inherit;
		font-weight: 600;
		cursor: pointer;
	}

	.tooltip-card ul {
		margin-top: 0.5rem;
		max-height: 18rem;
		overflow: auto;
	}

	.results-grid {
		display: grid;
		gap: 1rem;
	}

	.assumptions-row {
		display: grid;
	}

	@media (min-width: 960px) {
		.map-and-tooltip {
			grid-template-columns: minmax(0, 1fr);
		}

		.results-grid {
			grid-template-columns: minmax(0, 1fr);
		}
	}

</style>
