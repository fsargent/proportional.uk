<script lang="ts">
	import hexDataset from '$lib/data/uk-westminster-hexes.json';
	import DistrictMetrics from '$lib/components/hexmap/DistrictMetrics.svelte';
	import HexMap from '$lib/components/hexmap/HexMap.svelte';
	import { buildDistricts, calculateDistrictMetrics } from '$lib/hexmap/districts';
	import type { HexDataset } from '$lib/hexmap/types';

	const dataset = hexDataset as HexDataset;
	const systemPresets = [
		{
			key: 'stv',
			label: 'STV',
			description: 'Use district magnitude to redraw Westminster into multi-member constituencies.'
		},
		{
			key: 'spav',
			label: 'SPAV',
			description: 'Use the same engine for larger proportional groupings or regional approval districts.'
		},
		{
			key: 'ams-plus',
			label: 'AMS+',
			description: 'Keep the seat map stable and later add regional overlays on top of it.'
		}
	] as const;

	let targetMembers = $state(4);
	let currentSystem = $state<(typeof systemPresets)[number]['key']>('stv');

	const districts = $derived(buildDistricts(dataset.seats, targetMembers));
	const metrics = $derived(calculateDistrictMetrics(districts, targetMembers, dataset.seatCount));
	const currentPreset = $derived(
		systemPresets.find((preset) => preset.key === currentSystem) ?? systemPresets[0]
	);
</script>

<svelte:head>
	<title>UK Hex District Visualiser</title>
	<meta
		name="description"
		content="Interactive UK Westminster hex cartogram visualiser for experimenting with district size and future voting-system pages."
	/>
</svelte:head>

<section class="visualiser-page">
	<div class="hero-block">
		<p class="eyebrow">Reusable map foundation</p>
		<h1>UK Hex District Visualiser</h1>
		<p class="intro">
			This is the shared map engine for future STV, SPAV, and AMS+ explainers. One hex equals one
			Westminster constituency; the controls below change only how those seats are grouped.
		</p>
	</div>

	<div class="control-panel">
		<div class="preset-group" role="tablist" aria-label="Visualiser mode">
			{#each systemPresets as preset (preset.key)}
				<button
					type="button"
					class:selected={currentSystem === preset.key}
					onclick={() => (currentSystem = preset.key)}
				>
					{preset.label}
				</button>
			{/each}
		</div>

		<div class="slider-panel">
			<label for="targetMembers">
				<span>Target members per grouped district</span>
				<strong>{targetMembers}</strong>
			</label>
			<input id="targetMembers" type="range" min="1" max="7" step="1" bind:value={targetMembers} />
			<div class="scale-labels" aria-hidden="true">
				<span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span>
			</div>
		</div>

		<p class="mode-description">{currentPreset.description}</p>
	</div>

	<HexMap seats={dataset.seats} {districts} title="UK Westminster hex map with grouped districts" />

	<DistrictMetrics {metrics} />

	<section class="notes">
		<h2 class="section-header">What this MVP does</h2>
		<ul>
			<li>Loads a local canonical seat-level Westminster hex cartogram.</li>
			<li>Derives seat adjacency directly from the hex grid.</li>
			<li>Builds contiguous grouped districts inside nation boundaries.</li>
			<li>Keeps the rendering layer reusable for later voting-system pages.</li>
		</ul>
		<p>
			It is deliberately a structural visualiser first. Exact electoral modelling comes later.
		</p>
	</section>
</section>

<style>
	.visualiser-page {
		display: grid;
		gap: 1.75rem;
		padding-bottom: 2rem;
	}

	.hero-block {
		max-width: 52rem;
	}

	.eyebrow {
		display: inline-flex;
		padding: 0.4rem 0.75rem;
		border-radius: 999px;
		background: rgba(31, 95, 150, 0.08);
		border: 1px solid rgba(31, 95, 150, 0.16);
		color: var(--header-bg);
		font-weight: 700;
	}

	.hero-block h1 {
		margin: 0.85rem 0 0.75rem;
	}

	.intro {
		font-size: 1.1rem;
		max-width: 48rem;
	}

	.control-panel {
		display: grid;
		gap: 1rem;
		padding: 1.25rem;
		border-radius: var(--radius-lg);
		border: 1px solid var(--border-color);
		background: linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(241,245,249,0.95) 100%);
		box-shadow: var(--shadow-soft);
	}

	.preset-group {
		display: flex;
		gap: 0.65rem;
		flex-wrap: wrap;
	}

	.preset-group button {
		border: 1px solid var(--border-color);
		background: white;
		border-radius: 999px;
		padding: 0.7rem 1rem;
		font: inherit;
		font-weight: 600;
		cursor: pointer;
	}

	.preset-group button.selected {
		background: var(--header-bg);
		color: white;
		border-color: var(--header-bg);
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

	.slider-panel input {
		width: 100%;
	}

	.scale-labels {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		font-size: 0.85rem;
		color: var(--text-soft);
	}

	.mode-description {
		margin: 0;
		color: var(--text-soft);
	}

	.notes {
		max-width: 48rem;
	}

	.notes ul {
		margin: 0.75rem 0 1rem;
	}
</style>
