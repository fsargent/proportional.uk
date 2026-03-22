<script lang="ts">
	import { datasetBounds, HEX_SIZE, hexPolygonPoints, normaliseSeatPixels } from '$lib/hexmap/geometry';
	import { buildDistrictContours } from '$lib/hexmap/contours';
	import { districtAssignments } from '$lib/hexmap/districts';
	import type { HexDistrict, HexSeat } from '$lib/hexmap/types';

	export interface DistrictDisplay {
		id: string;
		fill?: string;
		label?: string;
		tooltipTitle?: string;
		tooltipLines?: string[];
	}

	export interface SeatDisplay {
		fill?: string;
	}

	let {
		seats,
		districts,
		title = 'UK Westminster hex cartogram',
		districtDisplay = {},
		seatDisplay = {},
		hoveredDistrictId = null,
		onDistrictHover,
		onDistrictLeave,
		showSeatDots = true
	}: {
		seats: HexSeat[];
		districts: HexDistrict[];
		title?: string;
		districtDisplay?: Record<string, DistrictDisplay>;
		seatDisplay?: Record<string, SeatDisplay>;
		hoveredDistrictId?: string | null;
		onDistrictHover?: (districtId: string) => void;
		onDistrictLeave?: () => void;
		showSeatDots?: boolean;
	} = $props();

	const palette = ['#1f5f96', '#9a3412', '#0f766e', '#6d28d9', '#047857', '#b45309', '#be123c'];

	const positions = $derived(normaliseSeatPixels(seats));
	const bounds = $derived(datasetBounds(positions));
	const positionById = $derived(new Map(positions.map((position) => [position.id, position])));
	const assignmentBySeatId = $derived(districtAssignments(districts));
	const districtIndex = $derived(new Map(districts.map((district, index) => [district.id, index])));
	const districtDisplayMap = $derived(new Map(Object.entries(districtDisplay ?? {})));
	const seatDisplayMap = $derived(new Map(Object.entries(seatDisplay ?? {})));
	const renderedSeats = $derived(
		seats.map((seat) => {
			const position = positionById.get(seat.id);
			const districtId = assignmentBySeatId.get(seat.id) ?? seat.id;
			const display = districtDisplayMap.get(districtId);
			const seatOverride = seatDisplayMap.get(seat.id);
			const color =
				seatOverride?.fill ?? display?.fill ?? palette[(districtIndex.get(districtId) ?? 0) % palette.length];
			const isDimmed = hoveredDistrictId !== null && hoveredDistrictId !== districtId;
			const isHighlighted = hoveredDistrictId === districtId;
			return {
				...seat,
				position,
				districtId,
				display,
				color,
				isDimmed,
				isHighlighted,
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
			const display = districtDisplayMap.get(district.id);
			return {
				id: district.id,
				x,
				y,
				memberCount: district.memberCount,
				label: display?.label ?? String(district.memberCount)
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
				<g onmouseenter={() => onDistrictHover?.(seat.districtId)} onmouseleave={() => onDistrictLeave?.()}>
					<polygon
						class:dimmed={seat.isDimmed}
						class:highlighted={seat.isHighlighted}
						points={seat.points}
						fill={seat.color}
						fill-opacity={seat.isDimmed ? '0.34' : seat.isHighlighted ? '0.95' : '0.86'}
						stroke="rgba(255,255,255,0.14)"
						stroke-width="0.45"
					/>
					{#if showSeatDots}
						<circle
							class:dimmed={seat.isDimmed}
							cx={seat.position.x}
							cy={seat.position.y}
							r={HEX_SIZE * 0.33}
							fill="rgba(255,255,255,0.92)"
						/>
					{/if}
					<title>{seat.display?.tooltipTitle ?? `${seat.name} — district ${seat.districtId}`}</title>
				</g>
			{/if}
		{/each}

		<g class="district-boundaries" aria-hidden="true">
			{#each districts as district (district.id)}
				{#each districtContours.get(district.id) ?? [] as pathData, index (`${district.id}-${index}`)}
					<path
						class:active={hoveredDistrictId === district.id}
						class:dimmed={hoveredDistrictId !== null && hoveredDistrictId !== district.id}
						d={pathData}
						stroke="#000000"
						stroke-width={hoveredDistrictId === district.id ? '4.4' : '3.2'}
						stroke-linecap="round"
						stroke-linejoin="round"
						fill="none"
						onmouseenter={() => onDistrictHover?.(district.id)}
						onmouseleave={() => onDistrictLeave?.()}
					/>
				{/each}
			{/each}
		</g>

		{#if districts.length <= 180}
			{#each districtLabels as label (label.id)}
				<g
					class="district-label"
					class:dimmed={hoveredDistrictId !== null && hoveredDistrictId !== label.id}
					transform={`translate(${label.x}, ${label.y})`}
					onmouseenter={() => onDistrictHover?.(label.id)}
					onmouseleave={() => onDistrictLeave?.()}
				>
					<circle r="9.5" fill={hoveredDistrictId === label.id ? 'rgba(0,0,0,0.92)' : 'rgba(22,33,43,0.82)'} />
					<text text-anchor="middle" dominant-baseline="central">{label.label}</text>
				</g>
			{/each}
		{/if}
	</svg>
</div>

<div class="map-caption">
	<p>
		Each hex is one Westminster constituency from the canonical 2023 Open Innovations layout. The
		current grouping layer redraws those seats into multi-member districts.
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

	polygon,
	circle,
	path,
	.district-label {
		transition:
			opacity 0.16s ease,
			transform 0.16s ease,
			stroke-width 0.16s ease,
			fill-opacity 0.16s ease;
	}

	polygon.dimmed,
	circle.dimmed,
	.district-label.dimmed,
	.district-boundaries path.dimmed {
		opacity: 0.28;
	}

	polygon.highlighted {
		filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.18));
	}

	.district-boundaries path {
		vector-effect: non-scaling-stroke;
		filter: drop-shadow(0 0 1px rgba(255, 255, 255, 0.08));
	}

	.district-boundaries path.active {
		filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.26));
	}

	.district-label text {
		fill: white;
		font-size: 8.6px;
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
