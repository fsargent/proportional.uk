<script lang="ts">
	import { onMount } from 'svelte';
	import { drawParliamentChart, toChartData, type PartyChartData } from '$lib/charts';

	interface Props {
		seatsByParty: Record<string, number>;
		compact?: boolean;
	}

	let { seatsByParty, compact = false }: Props = $props();

	let canvas: HTMLCanvasElement;
	let chartData = $derived(toChartData(seatsByParty));

	function redraw() {
		if (canvas && chartData.length > 0) {
			drawParliamentChart(canvas, chartData, { compact });
		}
	}

	onMount(() => {
		redraw();

		// Redraw on resize
		const resizeObserver = new ResizeObserver(() => {
			redraw();
		});
		if (canvas.parentElement) {
			resizeObserver.observe(canvas.parentElement);
		}

		return () => {
			resizeObserver.disconnect();
		};
	});

	$effect(() => {
		// Re-draw when data changes
		if (canvas && chartData) {
			redraw();
		}
	});
</script>

<div class="parliament-chart-wrapper" class:compact>
	<canvas bind:this={canvas} class="parliament-canvas"></canvas>

	<div class="parliament-legend" class:compact>
		{#each chartData as party}
			<div class="legend-item">
				<div class="legend-color" style="background-color: {party.color}"></div>
				<span class="legend-label">{party.name}: {party.seats}</span>
			</div>
		{/each}
	</div>
</div>

<style>
	.parliament-chart-wrapper {
		width: 100%;
		max-width: 600px;
		margin: 0 auto;
		padding: 1rem;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.parliament-chart-wrapper.compact {
		max-width: 400px;
		padding: 0.5rem;
	}

	.parliament-canvas {
		display: block;
		margin: 0 auto;
		border-radius: 8px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	.parliament-legend {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1rem;
		margin-top: 1rem;
		padding: 1rem;
		background: rgba(0, 0, 0, 0.02);
		border-radius: 0.5rem;
		border: 1px solid #ddd;
		max-width: 600px;
	}

	.parliament-legend.compact {
		gap: 0.5rem;
		padding: 0.75rem;
		font-size: 0.8rem;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		padding: 0.25rem 0.5rem;
		background: white;
		border-radius: 0.25rem;
		border: 1px solid #ddd;
		transition: all 0.2s ease;
	}

	.legend-item:hover {
		background: #f0f8f0;
		transform: translateY(-1px);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.parliament-legend.compact .legend-item {
		font-size: 0.75rem;
		padding: 0.125rem 0.375rem;
		gap: 0.25rem;
	}

	.legend-color {
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		border: 1px solid rgba(0, 0, 0, 0.1);
	}

	.parliament-legend.compact .legend-color {
		width: 0.75rem;
		height: 0.75rem;
	}

	.legend-label {
		font-weight: 500;
	}
</style>
