<script lang="ts">
	import { PARTY_META } from '$lib/config';
	import type { PartyTotals } from '$lib/stv-sim';
	import { partyLabel } from '$lib/stv-sim';

	interface Props {
		parties: PartyTotals[];
	}

	let { parties }: Props = $props();
	let hoveredPartyId = $state<string | null>(null);
	let selectedPartyId = $state<string | null>(null);

	const svgSize = 240;
	const radius = 96;
	const center = svgSize / 2;
	const displayParties = $derived(parties.filter((party) => party.seatShare > 0));
	const defaultParty = $derived(displayParties[0] ?? null);
	const activePartyId = $derived(selectedPartyId ?? hoveredPartyId ?? defaultParty?.party ?? null);
	const activeParty = $derived(
		displayParties.find((party) => party.party === activePartyId) ?? defaultParty ?? null
	);
	const slices = $derived(buildSlices(displayParties));

	function partyColour(party: string | null) {
		if (!party) return '#64748b';
		return PARTY_META[party]?.color ?? '#64748b';
	}

	function polarToCartesian(angleInDegrees: number) {
		const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
		return {
			x: center + radius * Math.cos(angleInRadians),
			y: center + radius * Math.sin(angleInRadians)
		};
	}

	function describeSlicePath(startAngle: number, endAngle: number) {
		const sweep = endAngle - startAngle;
		if (sweep >= 359.999) {
			return [
				`M ${center} ${center - radius}`,
				`A ${radius} ${radius} 0 1 1 ${center - 0.01} ${center - radius}`,
				`A ${radius} ${radius} 0 1 1 ${center} ${center - radius}`,
				'Z'
			].join(' ');
		}

		const start = polarToCartesian(startAngle);
		const end = polarToCartesian(endAngle);
		const largeArcFlag = sweep > 180 ? 1 : 0;

		return [
			`M ${center} ${center}`,
			`L ${start.x} ${start.y}`,
			`A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
			'Z'
		].join(' ');
	}

	function buildSlices(pieParties: PartyTotals[]) {
		let startAngle = 0;
		return pieParties.map((party) => {
			const endAngle = startAngle + party.seatShare * 360;
			const slice = {
				...party,
				color: partyColour(party.party),
				path: describeSlicePath(startAngle, endAngle)
			};
			startAngle = endAngle;
			return slice;
		});
	}

	function handlePartyHover(partyId: string) {
		if (selectedPartyId !== null) {
			return;
		}

		hoveredPartyId = partyId;
	}

	function handlePartyLeave() {
		if (selectedPartyId !== null) {
			return;
		}

		hoveredPartyId = null;
	}

	function handlePartyClick(partyId: string) {
		if (selectedPartyId === partyId) {
			selectedPartyId = null;
			hoveredPartyId = null;
			return;
		}

		selectedPartyId = partyId;
		hoveredPartyId = partyId;
	}

	function handleSliceKeydown(event: KeyboardEvent, partyId: string) {
		if (event.key !== 'Enter' && event.key !== ' ') {
			return;
		}

		event.preventDefault();
		handlePartyClick(partyId);
	}
</script>

<div class="pie-shell">
	<div class="pie-figure">
		<svg
			viewBox={`0 0 ${svgSize} ${svgSize}`}
			role="img"
			aria-label="Illustrative seat share pie chart"
			class="pie-svg"
		>
			<title>Illustrative seat share pie chart</title>
			{#each slices as slice (slice.party)}
				<path
					role="button"
					tabindex="0"
					aria-label={`${partyLabel(slice.party)}: ${slice.seats} seats, ${(slice.voteShare * 100).toFixed(1)}% votes, ${(slice.seatShare * 100).toFixed(1)}% seats`}
					d={slice.path}
					fill={slice.color}
					class:active={activeParty?.party === slice.party}
					class:dimmed={activeParty !== null && activeParty.party !== slice.party}
					onmouseenter={() => handlePartyHover(slice.party)}
					onmouseleave={handlePartyLeave}
					onfocus={() => handlePartyHover(slice.party)}
					onblur={handlePartyLeave}
					onclick={() => handlePartyClick(slice.party)}
					onkeydown={(event) => handleSliceKeydown(event, slice.party)}
				/>
			{/each}
		</svg>
		<p class="pie-caption">Slice size shows illustrative seat share. Hover to preview, click to pin.</p>
	</div>

	<div class="detail-panel">
		{#if activeParty}
			<div class="detail-header">
				<span class="party-swatch detail-swatch" style={`background:${partyColour(activeParty.party)}`}></span>
				<div>
					<p class="detail-eyebrow">Illustrative seat outcome</p>
					<h3>{partyLabel(activeParty.party)}</h3>
				</div>
			</div>

			<div class="detail-stats">
				<div>
					<span class="detail-label">Seats</span>
					<strong>{activeParty.seats}</strong>
				</div>
				<div>
					<span class="detail-label">Vote share</span>
					<strong>{(activeParty.voteShare * 100).toFixed(1)}%</strong>
				</div>
				<div>
					<span class="detail-label">Seat share</span>
					<strong>{(activeParty.seatShare * 100).toFixed(1)}%</strong>
				</div>
			</div>

			<p class="detail-copy">
				Compare each slice against the same party's vote share to see where the grouped districts
				help or hurt it under this illustrative model.
			</p>

			{#if selectedPartyId === activeParty.party}
				<button type="button" class="clear-selection" onclick={() => handlePartyClick(activeParty.party)}>
					Clear selection
				</button>
			{/if}
		{/if}
	</div>
</div>

<style>
	.pie-shell {
		display: grid;
		gap: 1rem;
	}

	.pie-figure,
	.detail-panel {
		display: grid;
		align-content: start;
		gap: 0.9rem;
		padding: 1rem;
		border-radius: var(--radius-md);
		border: 1px solid var(--border-color);
		background: var(--surface-overlay);
	}

	.pie-figure {
		justify-items: center;
	}

	.detail-panel {
		min-height: 100%;
	}

	.pie-svg {
		display: block;
		width: min(100%, 360px);
		height: auto;
	}

	path {
		cursor: pointer;
		stroke: var(--chart-slice-stroke);
		stroke-width: 2;
		transition:
			transform 0.18s ease,
			opacity 0.18s ease,
			filter 0.18s ease;
		transform-origin: 120px 120px;
	}

	path.active {
		filter: drop-shadow(0 8px 16px rgba(15, 23, 42, 0.18));
		transform: scale(1.02);
	}

	path.dimmed {
		opacity: 0.38;
	}

	.pie-caption,
	.detail-eyebrow,
	.detail-copy {
		margin: 0;
	}

	.pie-caption {
		max-width: 28rem;
		text-align: center;
		color: var(--text-soft);
		font-size: 0.94rem;
	}

	.detail-header {
		display: flex;
		align-items: center;
		gap: 0.85rem;
	}

	.detail-swatch {
		width: 1rem;
		height: 1rem;
		border-radius: 999px;
		flex: 0 0 auto;
	}

	.detail-eyebrow {
		font-size: 0.82rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--accent-text);
	}

	.detail-header h3 {
		margin: 0.15rem 0 0;
		font-size: 1.35rem;
		color: var(--text-dark);
	}

	.detail-stats {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.75rem;
	}

	.detail-stats div {
		display: grid;
		gap: 0.15rem;
		padding: 0.8rem;
		border-radius: var(--radius-sm);
		background: var(--surface-panel);
		border: 1px solid var(--accent-border-soft);
	}

	.detail-label {
		font-size: 0.85rem;
		color: var(--text-soft);
	}

	.detail-stats strong {
		font-size: 1.15rem;
		color: var(--text-dark);
	}

	.detail-copy {
		color: var(--text-soft);
		font-size: 0.95rem;
		line-height: 1.6;
	}

	.clear-selection {
		justify-self: start;
		border: 1px solid var(--border-color);
		background: var(--surface-color);
		border-radius: 999px;
		padding: 0.55rem 0.9rem;
		font: inherit;
		font-weight: 600;
		cursor: pointer;
	}

	@media (min-width: 820px) {
		.pie-shell {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 700px) {
		.detail-stats {
			grid-template-columns: 1fr;
		}
	}
</style>
