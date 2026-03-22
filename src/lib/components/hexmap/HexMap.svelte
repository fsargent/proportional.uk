<script lang="ts">
	import { datasetBounds, HEX_SIZE, hexPolygonPoints, normaliseSeatPixels } from '$lib/hexmap/geometry';
	import { buildDistrictContours } from '$lib/hexmap/contours';
	import { districtAssignments } from '$lib/hexmap/districts';
	import type { HexDistrict, HexSeat } from '$lib/hexmap/types';

	let {
		seats,
		districts,
		title = 'UK Westminster hex cartogram'
	}: {
		seats: HexSeat[];
		districts: HexDistrict[];
		title?: string;
	} = $props();

	const palette = ['#1f5f96', '#9a3412', '#0f766e', '#6d28d9', '#047857', '#b45309', '#be123c'];

	const positions = $derived(normaliseSeatPixels(seats));
	const bounds = $derived(datasetBounds(positions));
	const positionById = $derived(new Map(positions.map((position) => [position.id, position])));
	const assignmentBySeatId = $derived(districtAssignments(districts));
	const districtIndex = $derived(new Map(districts.map((district, index) => [district.id, index])));
	const renderedSeats = $derived(
		seats.map((seat) => {
			const position = positionById.get(seat.id);
			const districtId = assignmentBySeatId.get(seat.id) ?? seat.id;
			const color = palette[(districtIndex.get(districtId) ?? 0) % palette.length];
			return {
				...seat,
				position,
				districtId,
				color,
				points: position ? hexPolygonPoints(position.x, position.y, HEX_SIZE) : ''
			};
		})
	);
	const districtLabels = $derived(
		districts.map((district) => {
			const memberPositions = district.seatIds
				.map((seatId) => positionById.get(seatId))
				.filter((position): position is NonNullable<typeof position> => Boolean(position));
			const x = memberPositions.reduce((sum, position) => sum + position.x, 0) / memberPositions.length;
			const y = memberPositions.reduce((sum, position) => sum + position.y, 0) / memberPositions.length;
			return {
				id: district.id,
				x,
				y,
				memberCount: district.memberCount,
				regionLabel: district.regionNames[0]
			};
		})
	);
	const districtContours = $derived(buildDistrictContours(seats, districts));
</script>

<div class="hex-map-frame">
	<svg viewBox={`0 0 ${bounds.width} ${bounds.height}`} role="img" aria-label={title}>
		<title>{title}</title>
		{#each renderedSeats as seat (seat.id)}
			{#if seat.position}
				<polygon
					points={seat.points}
					fill={seat.color}
					fill-opacity="0.84"
					stroke="rgba(255,255,255,0.14)"
					stroke-width="0.45"
				/>
				<circle
					cx={seat.position.x}
					cy={seat.position.y}
					r={HEX_SIZE * 0.33}
					fill="rgba(255,255,255,0.92)"
				/>
				<title>{seat.name} — district {seat.districtId}</title>
			{/if}
		{/each}

		<g class="district-boundaries" aria-hidden="true">
			{#each districts as district (district.id)}
				{#each districtContours.get(district.id) ?? [] as pathData, index (`${district.id}-${index}`)}
					<path
						d={pathData}
						stroke="#000000"
						stroke-width="3.2"
						stroke-linecap="round"
						stroke-linejoin="round"
						fill="none"
					/>
				{/each}
			{/each}
		</g>

		{#if districts.length <= 180}
			{#each districtLabels as label (label.id)}
				<g class="district-label" transform={`translate(${label.x}, ${label.y})`}>
					<circle r="8.5" fill="rgba(22,33,43,0.82)" />
					<text text-anchor="middle" dominant-baseline="central">{label.memberCount}</text>
				</g>
			{/each}
		{/if}
	</svg>
</div>

<div class="map-caption">
	<p>
		Each hex is one Westminster constituency from the canonical 2023 Open Innovations layout. The
		current grouping layer redraws those seats into contiguous multi-member districts.
	</p>
</div>

<style>
	.hex-map-frame {
		border-radius: var(--radius-lg);
		border: 1px solid var(--border-color);
		background: linear-gradient(180deg, #234e73 0%, #183752 100%);
		padding: 1rem;
		overflow: auto;
		box-shadow: var(--shadow-strong);
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		min-width: 660px;
	}

	.district-boundaries path {
		vector-effect: non-scaling-stroke;
		filter: drop-shadow(0 0 1px rgba(255, 255, 255, 0.08));
	}

	.district-label text {
		fill: white;
		font-size: 9px;
		font-weight: 700;
	}

	.map-caption {
		margin-top: 0.9rem;
	}

	.map-caption p {
		margin: 0;
		font-size: 0.95rem;
		color: var(--text-soft);
	}
</style>
