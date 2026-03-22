<script lang="ts">
	import type { DistrictMetrics } from '$lib/hexmap/types';

	let { metrics }: { metrics: DistrictMetrics } = $props();
</script>

<div class="metrics-grid" aria-label="District metrics">
	<div class="metric-card">
		<span class="metric-label">Current seats</span>
		<strong class="metric-value">{metrics.totalSeats}</strong>
	</div>
	<div class="metric-card">
		<span class="metric-label">Grouped districts</span>
		<strong class="metric-value">{metrics.totalDistricts}</strong>
	</div>
	<div class="metric-card">
		<span class="metric-label">Target members</span>
		<strong class="metric-value">{metrics.targetMembers}</strong>
	</div>
	<div class="metric-card">
		<span class="metric-label">Smallest district</span>
		<strong class="metric-value">{metrics.minDistrictSize}</strong>
	</div>
	<div class="metric-card">
		<span class="metric-label">Largest district</span>
		<strong class="metric-value">{metrics.maxDistrictSize}</strong>
	</div>
	<div class="metric-card">
		<span class="metric-label">Average size</span>
		<strong class="metric-value">{metrics.averageDistrictSize.toFixed(1)}</strong>
	</div>
</div>

<style>
	.metrics-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
		gap: 1rem;
		margin: 1.5rem 0 0;
	}

	.metric-card {
		padding: 1rem;
		border-radius: var(--radius-md);
		border: 1px solid var(--border-color);
		background: rgba(255, 255, 255, 0.88);
		box-shadow: var(--shadow-soft);
	}

	.metric-label {
		display: block;
		font-size: 0.9rem;
		color: var(--text-soft);
		margin-bottom: 0.35rem;
	}

	.metric-value {
		font-size: 1.4rem;
		color: var(--text-dark);
	}
</style>
