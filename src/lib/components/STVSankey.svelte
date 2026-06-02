<script lang="ts">
	// Reusable STV Sankey diagram. Extracted from STVWorkedExample.svelte so the
	// /dev/stv-results page can reuse it on synthetic-election data.
	//
	// Pass `candidates`, `rounds`, and `seats`. The component computes the Droop
	// quota and lays out vote blocks + transfer ribbons per round.

	export const EXHAUSTED = 'X';

	type Candidate = { id: string; name: string; party: string };
	type Allocation = { allocatee: string; votes: number };
	type Transfer = {
		from: string;
		to: string;
		count: number;
		type: 'surplus' | 'elimination';
	};
	export type STVRound = {
		allocations: Allocation[];
		transfers: Transfer[];
		electedThisRound?: string[];
		eliminatedThisRound?: string[];
	};

	type Props = {
		candidates: Candidate[];
		rounds: STVRound[];
		seats: number;
		totalVotes?: number;
		ariaLabel?: string;
		width?: number;
	};

	let {
		candidates,
		rounds,
		seats,
		totalVotes,
		ariaLabel = 'Sankey diagram showing how votes transfer between candidates across each round of an STV count.',
		width = 600
	}: Props = $props();

	const candidateById = $derived(new Map(candidates.map((c) => [c.id, c])));

	function candidateName(id: string): string {
		if (id === EXHAUSTED) return 'Exhausted';
		return candidateById.get(id)?.name ?? id;
	}

	const computedTotalVotes = $derived(
		totalVotes ??
			rounds[0]?.allocations.reduce((sum, a) => sum + a.votes, 0) ??
			0
	);
	const quota = $derived(Math.floor(computedTotalVotes / (seats + 1)) + 1);

	// Build elected/eliminated maps for styling.
	const electedInRound = $derived.by(() => {
		const m = new Map<string, number>();
		rounds.forEach((round, i) => {
			(round.electedThisRound ?? []).forEach((id) => {
				if (!m.has(id)) m.set(id, i);
			});
		});
		return m;
	});

	const eliminatedInRound = $derived.by(() => {
		const m = new Map<string, number>();
		rounds.forEach((round, i) => {
			(round.eliminatedThisRound ?? []).forEach((id) => {
				if (!m.has(id)) m.set(id, i);
			});
		});
		return m;
	});

	// Layout constants.
	const roundHeight = 100;
	const voteBlockHeight = 16;
	const edgeMargin = 60;
	const candidateMargin = 16;
	const labelSpace = 110;

	// Sort candidates left-to-right by first-round votes (descending), exhausted last.
	const firstRoundVoteOrder = $derived.by(() => {
		const m = new Map<string, number>();
		rounds[0]?.allocations.forEach((a) => m.set(a.allocatee, a.votes));
		return m;
	});

	function sortAllocations(allocations: Allocation[]): Allocation[] {
		return [...allocations].sort((a, b) => {
			if (a.allocatee === EXHAUSTED) return 1;
			if (b.allocatee === EXHAUSTED) return -1;
			return (
				(firstRoundVoteOrder.get(b.allocatee) ?? 0) -
				(firstRoundVoteOrder.get(a.allocatee) ?? 0)
			);
		});
	}

	const firstRoundSorted = $derived(
		rounds[0] ? sortAllocations(rounds[0].allocations) : []
	);

	const voteScale = $derived(
		firstRoundSorted.length > 0
			? (width - candidateMargin * (firstRoundSorted.length - 1) - edgeMargin - 10) /
				firstRoundSorted.reduce((sum, a) => sum + a.votes, 0)
			: 1
	);

	const innerHeight = $derived(roundHeight * (rounds.length - 1) + voteBlockHeight);
	const height = $derived(2 * labelSpace + innerHeight);

	type VoteBlock = {
		key: string;
		allocatee: string;
		votes: number;
		percentage: number;
		x: number;
		y: number;
		width: number;
		round: number;
		isExhausted: boolean;
		isElected: boolean;
		isEliminatedThisRound: boolean;
		label: string;
	};

	type TransferPath = {
		key: string;
		from: string;
		to: string;
		round: number;
		count: number;
		type: 'surplus' | 'elimination' | 'carryover';
		path: string;
	};

	type CandidateState = {
		xOffset: number;
		width: number;
		votes: number;
		accountedInLeft: number;
		accountedInRight: number;
		accountedOutLeft: number;
		accountedOutRight: number;
	};

	function buildPath(r1x: number, r1y: number, r2x: number, r2y: number, w: number): string {
		const midY = (r1y + r2y) / 2;
		const safeW = Math.max(1, w);
		const r1x2 = r1x + safeW;
		const r2x2 = r2x + safeW;
		return `M ${r1x} ${r1y} H ${r1x2} C ${r1x2} ${midY} ${r2x2} ${midY} ${r2x2} ${r2y} H ${r2x} C ${r2x} ${midY} ${r1x} ${midY} ${r1x} ${r1y} Z`;
	}

	const layout = $derived.by(() => {
		const voteBlockRows: VoteBlock[][] = [];
		const transferPaths: TransferPath[] = [];
		let lastVotes = new Map<string, CandidateState>();
		const firstRoundCount = firstRoundSorted.length - 1;

		rounds.forEach((round, i) => {
			const sorted = sortAllocations(round.allocations);
			const numCandidates = sorted.length - 1;
			let offset = ((firstRoundCount - numCandidates) * candidateMargin) / 2;
			const totalRoundVotes = sorted.reduce((sum, a) => sum + a.votes, 0);
			const blocks: VoteBlock[] = [];
			const curVotes = new Map<string, CandidateState>();

			for (const alloc of sorted) {
				const w = voteScale * alloc.votes;
				const electedRound = electedInRound.get(alloc.allocatee);
				const eliminatedRound = eliminatedInRound.get(alloc.allocatee);
				blocks.push({
					key: `${i}:${alloc.allocatee}`,
					allocatee: alloc.allocatee,
					votes: alloc.votes,
					percentage:
						totalRoundVotes > 0
							? Math.round((alloc.votes / totalRoundVotes) * 1000) / 10
							: 0,
					x: offset,
					y: i * roundHeight,
					width: w,
					round: i + 1,
					isExhausted: alloc.allocatee === EXHAUSTED,
					isElected: electedRound !== undefined && electedRound <= i,
					isEliminatedThisRound: eliminatedRound === i,
					label: candidateName(alloc.allocatee)
				});
				curVotes.set(alloc.allocatee, {
					xOffset: offset,
					votes: alloc.votes,
					width: w,
					accountedInLeft: 0,
					accountedInRight: 0,
					accountedOutLeft: 0,
					accountedOutRight: 0
				});
				offset += w + candidateMargin;
			}

			if (i > 0) {
				const prev = rounds[i - 1];
				for (const t of prev.transfers) {
					const last = lastVotes.get(t.from);
					const cur = curVotes.get(t.to);
					if (!last || !cur) continue;
					const w = t.count * voteScale;
					let sourceX: number;
					let destX: number;
					if (t.type === 'surplus') {
						sourceX = last.xOffset + last.width - last.accountedOutRight - w;
						destX = cur.xOffset + cur.accountedInLeft;
						last.accountedOutRight += w;
						cur.accountedInLeft += w;
					} else {
						sourceX = last.xOffset + last.accountedOutLeft;
						destX = cur.xOffset + cur.width - cur.accountedInRight - w;
						last.accountedOutLeft += w;
						cur.accountedInRight += w;
					}
					const r1y = (i - 1) * roundHeight + voteBlockHeight;
					const r2y = i * roundHeight;
					transferPaths.push({
						key: `t-${i}-${t.from}-${t.to}-${t.type}`,
						from: t.from,
						to: t.to,
						round: i + 1,
						count: t.count,
						type: t.type,
						path: buildPath(sourceX, r1y, destX, r2y, w)
					});
				}
			}

			if (i > 0) {
				for (const alloc of sorted) {
					const last = lastVotes.get(alloc.allocatee);
					if (!last) continue;
					const cur = curVotes.get(alloc.allocatee)!;
					const sourceCenter = last.xOffset + last.accountedOutLeft;
					const sourceCenterWidth =
						last.width - last.accountedOutLeft - last.accountedOutRight;
					const destCenter = cur.xOffset + cur.accountedInLeft;
					const destCenterWidth =
						cur.width - cur.accountedInLeft - cur.accountedInRight;
					const carryoverWidth = Math.min(sourceCenterWidth, destCenterWidth);
					const carryoverVotes = Math.min(last.votes, cur.votes);
					if (carryoverWidth > 0.5) {
						transferPaths.push({
							key: `c-${i}-${alloc.allocatee}`,
							from: alloc.allocatee,
							to: alloc.allocatee,
							round: i + 1,
							count: carryoverVotes,
							type: 'carryover',
							path: buildPath(
								sourceCenter,
								(i - 1) * roundHeight + voteBlockHeight,
								destCenter,
								i * roundHeight,
								carryoverWidth
							)
						});
					}
				}
			}

			voteBlockRows.push(blocks);
			lastVotes = curVotes;
		});

		return { voteBlockRows, transferPaths };
	});

	function blockTooltip(b: VoteBlock): string {
		const pct = ` (${b.percentage}%)`;
		if (b.isExhausted) return `${b.votes} votes${pct} were exhausted in round ${b.round}`;
		if (b.isElected && electedInRound.get(b.allocatee) === b.round - 1) {
			const reason = b.votes >= quota ? 'reached quota' : 'remaining seats filled';
			return `${b.label} elected in round ${b.round} with ${b.votes} votes${pct} — ${reason}`;
		}
		if (b.isEliminatedThisRound) {
			return `${b.label} eliminated in round ${b.round} on ${b.votes} votes${pct}`;
		}
		if (b.isElected) {
			return `${b.label} (already elected) holds ${b.votes} votes${pct} in round ${b.round}`;
		}
		return `${b.label}: ${b.votes} votes${pct} in round ${b.round}`;
	}

	function transferTooltip(t: TransferPath): string {
		if (t.type === 'carryover') {
			return `${candidateName(t.from)} carries ${t.count} votes into round ${t.round}`;
		}
		const flavour = t.type === 'surplus' ? ' (surplus)' : ' (elimination)';
		return `${t.count} votes from ${candidateName(t.from)} transferred${flavour} to ${candidateName(t.to)} in round ${t.round}`;
	}

	// Chain-hover state: hovering a node or link lights up the entire
	// upstream/downstream chain (BFS through incoming/outgoing transfer edges).
	type HoverState =
		| { kind: 'node'; key: string }
		| { kind: 'link'; index: number }
		| null;

	let hover = $state<HoverState>(null);

	const incoming = $derived.by(() => {
		const m = new Map<string, number[]>();
		layout.transferPaths.forEach((t, i) => {
			const key = `${t.round - 1}:${t.to}`; // destination node key
			const arr = m.get(key);
			if (arr) arr.push(i);
			else m.set(key, [i]);
		});
		return m;
	});

	const outgoing = $derived.by(() => {
		const m = new Map<string, number[]>();
		layout.transferPaths.forEach((t, i) => {
			const key = `${t.round - 2}:${t.from}`; // source node key (prev round)
			const arr = m.get(key);
			if (arr) arr.push(i);
			else m.set(key, [i]);
		});
		return m;
	});

	const active = $derived.by(() => {
		const activeNodes = new Set<string>();
		const activeLinks = new Set<number>();
		if (!hover) return { nodes: activeNodes, links: activeLinks };

		const upStack: string[] = [];
		const downStack: string[] = [];

		if (hover.kind === 'node') {
			activeNodes.add(hover.key);
			upStack.push(hover.key);
			downStack.push(hover.key);
		} else {
			const t = layout.transferPaths[hover.index];
			if (!t) return { nodes: activeNodes, links: activeLinks };
			const sourceKey = `${t.round - 2}:${t.from}`;
			const targetKey = `${t.round - 1}:${t.to}`;
			activeLinks.add(hover.index);
			activeNodes.add(sourceKey);
			activeNodes.add(targetKey);
			upStack.push(sourceKey);
			downStack.push(targetKey);
		}

		// BFS upstream via incoming edges.
		const seenUp = new Set<string>();
		while (upStack.length) {
			const key = upStack.pop()!;
			if (seenUp.has(key)) continue;
			seenUp.add(key);
			activeNodes.add(key);
			for (const idx of incoming.get(key) ?? []) {
				activeLinks.add(idx);
				const t = layout.transferPaths[idx];
				upStack.push(`${t.round - 2}:${t.from}`);
			}
		}

		// BFS downstream via outgoing edges.
		const seenDown = new Set<string>();
		while (downStack.length) {
			const key = downStack.pop()!;
			if (seenDown.has(key)) continue;
			seenDown.add(key);
			activeNodes.add(key);
			for (const idx of outgoing.get(key) ?? []) {
				activeLinks.add(idx);
				const t = layout.transferPaths[idx];
				downStack.push(`${t.round - 1}:${t.to}`);
			}
		}

		return { nodes: activeNodes, links: activeLinks };
	});
</script>

<div class="stv-sankey-wrap">
	<div class="legend">
		<span class="legend-item"><span class="swatch swatch-active"></span> Continuing</span>
		<span class="legend-item">
			<span class="swatch swatch-elected"></span> Elected this round
		</span>
		<span class="legend-item">
			<span class="swatch swatch-eliminated"></span> Eliminated this round
		</span>
		<span class="legend-item">
			<span class="swatch swatch-surplus"></span> Surplus transfer
		</span>
		<span class="legend-item">
			<span class="swatch swatch-elim"></span> Elimination transfer
		</span>
	</div>

	<div class="svg-wrap">
		<svg width="100%" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={ariaLabel}>
			{#each rounds as _, i (i)}
				<text
					class="round-label"
					font-size="11"
					y={i * roundHeight + labelSpace + voteBlockHeight / 2}
					dominant-baseline="middle">Round {i + 1}</text
				>
			{/each}

			<g transform={`translate(${edgeMargin} ${labelSpace})`}>
				<!-- Top labels -->
				{#each layout.voteBlockRows[0] ?? [] as block (block.key)}
					<g transform={`translate(${block.x + block.width / 2} -10)`}>
						<text
							role="presentation"
							class="cand-label"
							font-size="12"
							dominant-baseline="middle"
							transform="rotate(-90)"
							onpointerenter={() => (hover = { kind: 'node', key: block.key })}
							onpointerleave={() => (hover = null)}>{block.label}</text
						>
					</g>
				{/each}

				<!-- Vote blocks -->
				{#each layout.voteBlockRows as row, rowIdx (rowIdx)}
					{#each row as block (block.key)}
						<g
							role="presentation"
							onpointerenter={() => (hover = { kind: 'node', key: block.key })}
							onpointerleave={() => (hover = null)}
						>
							<title>{blockTooltip(block)}</title>
							<rect
								class="vote-block"
								class:exhausted={block.isExhausted}
								class:elected={block.isElected}
								class:eliminated={block.isEliminatedThisRound}
								class:highlight={active.nodes.has(block.key)}
								class:dim={hover !== null && !active.nodes.has(block.key)}
								x={block.x}
								y={block.y}
								width={Math.max(1, block.width)}
								height={voteBlockHeight}
							/>
							{#if block.width > 26}
								<text
									class="block-pct"
									class:exhausted-text={block.isExhausted}
									x={block.x + block.width / 2}
									y={block.y + voteBlockHeight / 2}
									dominant-baseline="middle"
									text-anchor="middle">{block.votes}</text
								>
							{/if}
						</g>
					{/each}
				{/each}

				<!-- Transfer ribbons -->
				{#each layout.transferPaths as t, i (t.key)}
					<g
						role="presentation"
						onpointerenter={() => (hover = { kind: 'link', index: i })}
						onpointerleave={() => (hover = null)}
					>
						<title>{transferTooltip(t)}</title>
						<path
							class="transfer"
							class:surplus={t.type === 'surplus'}
							class:elim={t.type === 'elimination'}
							class:carryover={t.type === 'carryover'}
							class:highlight={active.links.has(i)}
							class:dim={hover !== null && !active.links.has(i)}
							d={t.path}
						/>
					</g>
				{/each}

				<!-- Bottom labels -->
				{#each layout.voteBlockRows[layout.voteBlockRows.length - 1] ?? [] as block (block.key)}
					<g transform={`translate(${block.x + block.width / 2} ${innerHeight + 10})`}>
						<text
							role="presentation"
							class="cand-label"
							font-size="12"
							dominant-baseline="middle"
							text-anchor="end"
							transform="rotate(-90)"
							onpointerenter={() => (hover = { kind: 'node', key: block.key })}
							onpointerleave={() => (hover = null)}>{block.label}</text
						>
					</g>
				{/each}
			</g>
		</svg>
	</div>
</div>

<style>
	.stv-sankey-wrap {
		display: grid;
		gap: 0.75rem;
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem 1.25rem;
		font-size: 0.85rem;
		color: var(--text-color);
	}

	.legend-item {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	.swatch {
		display: inline-block;
		width: 0.85rem;
		height: 0.85rem;
		border-radius: 0.2rem;
	}

	.swatch-active {
		background: #2563eb;
	}
	.swatch-elected {
		background: #0a7c0a;
	}
	.swatch-eliminated {
		background: #dc2626;
	}
	.swatch-surplus {
		background: #0a7c0a;
		opacity: 0.55;
	}
	.swatch-elim {
		background: #6b7280;
		opacity: 0.55;
	}

	.svg-wrap {
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		background: var(--surface-color);
		padding: 0.75rem;
		box-shadow: var(--shadow-soft);
	}

	svg {
		display: block;
	}

	.round-label {
		fill: var(--text-soft);
	}

	.cand-label {
		fill: var(--text-dark);
		cursor: default;
	}

	.vote-block {
		fill: #2563eb;
		transition: opacity 0.15s ease;
		cursor: default;
	}
	.vote-block.exhausted {
		fill: #cbd5e1;
	}
	.vote-block.elected {
		fill: #0a7c0a;
	}
	.vote-block.eliminated {
		fill: #dc2626;
	}
	.vote-block.dim {
		opacity: 0.25;
	}
	.vote-block.highlight {
		stroke: #111;
		stroke-width: 1.5;
	}

	.block-pct {
		font-size: 9px;
		font-weight: 700;
		fill: white;
		pointer-events: none;
	}
	.block-pct.exhausted-text {
		fill: #475569;
	}

	.transfer {
		fill: #6b7280;
		opacity: 0.35;
		mix-blend-mode: multiply;
		transition: opacity 0.15s ease;
		cursor: default;
	}
	.transfer.surplus {
		fill: #0a7c0a;
		opacity: 0.45;
	}
	.transfer.elim {
		fill: #6b7280;
		opacity: 0.4;
	}
	.transfer.carryover {
		fill: #2563eb;
		opacity: 0.18;
	}
	.transfer.dim {
		opacity: 0.06;
	}
	.transfer.highlight {
		opacity: 0.75;
		mix-blend-mode: normal;
	}

	@media (prefers-color-scheme: dark) {
		svg {
			color-scheme: dark;
		}
		.vote-block {
			fill: #3b82f6;
		}
		.vote-block.exhausted {
			fill: #475569;
		}
		.vote-block.elected {
			fill: #16a34a;
		}
		.vote-block.eliminated {
			fill: #ef4444;
		}
		.vote-block.highlight {
			stroke: #fff;
		}
		.transfer {
			fill: #94a3b8;
			opacity: 0.4;
			mix-blend-mode: normal;
		}
		.transfer.surplus {
			fill: #16a34a;
			opacity: 0.55;
		}
		.transfer.elim {
			fill: #94a3b8;
			opacity: 0.5;
		}
		.transfer.carryover {
			fill: #3b82f6;
			opacity: 0.28;
		}
		.block-pct.exhausted-text {
			fill: #cbd5e1;
		}
		.cand-label,
		.round-label {
			fill: var(--text-color);
		}
	}
</style>
