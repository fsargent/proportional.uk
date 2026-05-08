<script lang="ts">
	// Hardcoded worked example of an STV count.
	// Sankey rendering adapted from sibling project ../dotvote/stv.vote/src/components/report_components/Sankey.svelte
	// Uses Droop quota: floor(votes / (seats + 1)) + 1 = floor(1000 / 4) + 1 = 251.

	const EXHAUSTED = 'X';

	type Candidate = { id: string; name: string; party: string };
	type Allocation = { allocatee: string; votes: number };
	type Transfer = {
		from: string;
		to: string;
		count: number;
		type: 'surplus' | 'elimination';
	};
	type Round = {
		allocations: Allocation[];
		transfers: Transfer[];
		electedThisRound?: string[];
		eliminatedThisRound?: string[];
	};

	const candidates: Candidate[] = [
		{ id: 'alice', name: 'Alice Morgan', party: 'Labour' },
		{ id: 'ben', name: 'Ben Clarke', party: 'Conservative' },
		{ id: 'chloe', name: 'Chloe Rahman', party: 'Liberal Democrats' },
		{ id: 'dan', name: 'Daniel Okoro', party: 'Green' },
		{ id: 'ella', name: 'Ella Hughes', party: 'Independent' }
	];

	const candidateById = new Map(candidates.map((c) => [c.id, c]));
	function candidateName(id: string): string {
		if (id === EXHAUSTED) return 'Exhausted';
		return candidateById.get(id)?.name ?? id;
	}

	const totalVotes = 1000;
	const seats = 3;
	const quota = Math.floor(totalVotes / (seats + 1)) + 1; // 251

	const rounds: Round[] = [
		{
			allocations: [
				{ allocatee: 'alice', votes: 320 },
				{ allocatee: 'ben', votes: 220 },
				{ allocatee: 'chloe', votes: 180 },
				{ allocatee: 'dan', votes: 170 },
				{ allocatee: 'ella', votes: 110 }
			],
			transfers: [{ from: 'alice', to: 'chloe', count: 69, type: 'surplus' }],
			electedThisRound: ['alice']
		},
		{
			allocations: [
				{ allocatee: 'alice', votes: 251 },
				{ allocatee: 'ben', votes: 220 },
				{ allocatee: 'chloe', votes: 249 },
				{ allocatee: 'dan', votes: 170 },
				{ allocatee: 'ella', votes: 110 }
			],
			transfers: [
				{ from: 'ella', to: 'chloe', count: 50, type: 'elimination' },
				{ from: 'ella', to: 'dan', count: 60, type: 'elimination' }
			],
			eliminatedThisRound: ['ella']
		},
		{
			allocations: [
				{ allocatee: 'alice', votes: 251 },
				{ allocatee: 'ben', votes: 220 },
				{ allocatee: 'chloe', votes: 299 },
				{ allocatee: 'dan', votes: 230 }
			],
			transfers: [{ from: 'chloe', to: 'dan', count: 48, type: 'surplus' }],
			electedThisRound: ['chloe']
		},
		{
			allocations: [
				{ allocatee: 'alice', votes: 251 },
				{ allocatee: 'ben', votes: 220 },
				{ allocatee: 'chloe', votes: 251 },
				{ allocatee: 'dan', votes: 278 }
			],
			transfers: [],
			electedThisRound: ['dan']
		}
	];

	// Build elected/eliminated maps for styling.
	const electedInRound = new Map<string, number>();
	const eliminatedInRound = new Map<string, number>();
	rounds.forEach((round, i) => {
		(round.electedThisRound ?? []).forEach((id) => {
			if (!electedInRound.has(id)) electedInRound.set(id, i);
		});
		(round.eliminatedThisRound ?? []).forEach((id) => {
			if (!eliminatedInRound.has(id)) eliminatedInRound.set(id, i);
		});
	});

	// Layout constants.
	const width = 600;
	const roundHeight = 100;
	const voteBlockHeight = 16;
	const edgeMargin = 60;
	const candidateMargin = 16;
	const labelSpace = 110;

	// Sort candidates left-to-right by first-round votes (descending), exhausted last.
	const firstRoundVoteOrder = new Map<string, number>();
	rounds[0].allocations.forEach((a) => firstRoundVoteOrder.set(a.allocatee, a.votes));
	function sortAllocations(allocations: Allocation[]): Allocation[] {
		return [...allocations].sort((a, b) => {
			if (a.allocatee === EXHAUSTED) return 1;
			if (b.allocatee === EXHAUSTED) return -1;
			return (firstRoundVoteOrder.get(b.allocatee) ?? 0) - (firstRoundVoteOrder.get(a.allocatee) ?? 0);
		});
	}

	const firstRoundSorted = sortAllocations(rounds[0].allocations);
	const firstRoundCount = firstRoundSorted.length - 1; // gaps between candidates
	const voteScale =
		(width - candidateMargin * firstRoundCount - edgeMargin - 10) /
		firstRoundSorted.reduce((sum, a) => sum + a.votes, 0);

	const innerHeight = roundHeight * (rounds.length - 1) + voteBlockHeight;
	const height = 2 * labelSpace + innerHeight;

	type VoteBlock = {
		key: string;
		allocatee: string;
		votes: number;
		percentage: number;
		x: number;
		y: number;
		width: number;
		round: number; // 1-based
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

	const voteBlockRows: VoteBlock[][] = [];
	const transferPaths: TransferPath[] = [];

	let lastVotes = new Map<string, CandidateState>();

	rounds.forEach((round, i) => {
		const sorted = sortAllocations(round.allocations);
		const numCandidates = sorted.length - 1;
		let offset = ((firstRoundCount - numCandidates) * candidateMargin) / 2;
		const totalRoundVotes = sorted.reduce((sum, a) => sum + a.votes, 0);
		const blocks: VoteBlock[] = [];
		const curVotes = new Map<string, CandidateState>();

		// Phase 1 — build blocks for this round.
		for (const alloc of sorted) {
			const w = voteScale * alloc.votes;
			const electedRound = electedInRound.get(alloc.allocatee);
			const eliminatedRound = eliminatedInRound.get(alloc.allocatee);
			blocks.push({
				key: `${i}:${alloc.allocatee}`,
				allocatee: alloc.allocatee,
				votes: alloc.votes,
				percentage: Math.round((alloc.votes / totalRoundVotes) * 1000) / 10,
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

		// Phase 2 — transfers from previous round into this one.
		// Surplus: leaves source RIGHT, lands on dest LEFT.
		// Elimination: leaves source LEFT, lands on dest RIGHT.
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

		// Phase 3 — carryovers (centre band).
		if (i > 0) {
			for (const alloc of sorted) {
				const last = lastVotes.get(alloc.allocatee);
				if (!last) continue;
				const cur = curVotes.get(alloc.allocatee)!;
				const sourceCenter = last.xOffset + last.accountedOutLeft;
				const sourceCenterWidth = last.width - last.accountedOutLeft - last.accountedOutRight;
				const destCenter = cur.xOffset + cur.accountedInLeft;
				const destCenterWidth = cur.width - cur.accountedInLeft - cur.accountedInRight;
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

	function buildPath(r1x: number, r1y: number, r2x: number, r2y: number, w: number): string {
		const midY = (r1y + r2y) / 2;
		const safeW = Math.max(1, w);
		const r1x2 = r1x + safeW;
		const r2x2 = r2x + safeW;
		return `M ${r1x} ${r1y} H ${r1x2} C ${r1x2} ${midY} ${r2x2} ${midY} ${r2x2} ${r2y} H ${r2x} C ${r2x} ${midY} ${r1x} ${midY} ${r1x} ${r1y} Z`;
	}

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

	let hoveredKey = $state<string | null>(null);
</script>

<figure class="stv-worked-example" aria-labelledby="stv-worked-example-caption">
	<figcaption id="stv-worked-example-caption" class="caption">
		<strong>Worked example.</strong> First the algorithm in flowchart form (top-to-bottom, single
		entry, single exit — read like Drakon). Then watch it run on 1,000 ballots for 3 seats with
		Droop quota = {quota}.
	</figcaption>

	<h3 class="example-heading">The algorithm</h3>

	<div class="flowchart-wrap">
		<svg viewBox="0 0 800 780" role="img" aria-label="Drakon flowchart of the STV count algorithm">
			<defs>
				<marker id="stv-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
					<path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
				</marker>
			</defs>

			<!-- Header (Title) — main skewer centre x=290 -->
			<rect class="node node-title" x="180" y="16" width="220" height="56" rx="28" />
			<text class="node-text node-text-title" x="290" y="44">Count an STV election</text>

			<!-- Action: Tally -->
			<rect class="node" x="180" y="96" width="220" height="56" />
			<text class="node-text" x="290" y="124">Tally first preferences</text>

			<!-- Action: Quota -->
			<rect class="node" x="180" y="176" width="220" height="56" />
			<text class="node-text" x="290" y="196">Compute Droop quota</text>
			<text class="node-text node-text-mono" x="290" y="216">⌊V ÷ (S + 1)⌋ + 1</text>

			<!-- Loop header (rounded ends, special style, with cycle glyph) -->
			<rect class="node node-loop" x="180" y="256" width="220" height="56" rx="28" />
			<text class="node-text node-text-loop" x="208" y="284">↻</text>
			<text class="node-text" x="298" y="284">While seats remain</text>

			<!-- Question: anyone over quota? (chamfered) -->
			<polygon class="node node-question" points="192,336 388,336 400,364 388,392 192,392 180,364" />
			<text class="node-text" x="290" y="368">Anyone over the quota?</text>

			<!-- Yes path: Elect -->
			<rect class="node" x="180" y="416" width="220" height="56" />
			<text class="node-text" x="290" y="444">Elect that candidate</text>

			<!-- Yes path: Transfer surplus -->
			<rect class="node" x="180" y="496" width="220" height="56" />
			<text class="node-text" x="290" y="516">Transfer their surplus</text>
			<text class="node-text node-text-sub" x="290" y="534">to next preferences</text>

			<!-- No path (right branch): Eliminate -->
			<rect class="node" x="480" y="416" width="220" height="56" />
			<text class="node-text" x="590" y="444">Eliminate the lowest</text>

			<!-- No path: Transfer eliminated ballots -->
			<rect class="node" x="480" y="496" width="220" height="56" />
			<text class="node-text" x="590" y="516">Transfer their ballots</text>
			<text class="node-text node-text-sub" x="590" y="534">to next preferences</text>

			<!-- Loop end (rounded ends, with up-cycle glyph) -->
			<rect class="node node-loop" x="220" y="608" width="140" height="44" rx="22" />
			<text class="node-text node-text-loop" x="240" y="630">↺</text>
			<text class="node-text node-text-sub" x="300" y="630">end loop</text>

			<!-- End node (rounded ends, success tint) -->
			<rect class="node node-end" x="180" y="704" width="220" height="56" rx="28" />
			<text class="node-text node-text-end" x="290" y="732">All seats filled</text>

			<!-- ────────  Connectors  ──────── -->
			<!-- Title → Tally → Quota → Loop header -->
			<line class="flow" x1="290" y1="72" x2="290" y2="96" />
			<line class="flow" x1="290" y1="152" x2="290" y2="176" />
			<line class="flow" x1="290" y1="232" x2="290" y2="256" />

			<!-- Loop header → Question -->
			<line class="flow" x1="290" y1="312" x2="290" y2="336" />

			<!-- Question YES (down) → Elect → Transfer surplus -->
			<line class="flow" x1="290" y1="392" x2="290" y2="416" />
			<text class="flow-label" x="298" y="408">yes</text>
			<line class="flow" x1="290" y1="472" x2="290" y2="496" />

			<!-- Question NO (right) → Eliminate -->
			<line class="flow" x1="400" y1="364" x2="440" y2="364" />
			<line class="flow" x1="440" y1="364" x2="440" y2="416" />
			<line class="flow" x1="440" y1="416" x2="480" y2="416" />
			<text class="flow-label" x="408" y="358">no</text>

			<!-- Eliminate → Transfer ballots -->
			<line class="flow" x1="590" y1="472" x2="590" y2="496" />

			<!-- Both branches converge above Loop end -->
			<line class="flow" x1="290" y1="552" x2="290" y2="608" />
			<line class="flow" x1="590" y1="552" x2="590" y2="580" />
			<line class="flow" x1="590" y1="580" x2="290" y2="580" />

			<!-- Loop-back arrow: Loop end LEFT edge → up the left gutter → into Loop header LEFT edge -->
			<line class="flow loop" x1="220" y1="630" x2="60" y2="630" />
			<line class="flow loop" x1="60" y1="630" x2="60" y2="284" />
			<line class="flow loop" x1="60" y1="284" x2="180" y2="284" marker-end="url(#stv-arrow)" />
			<text class="flow-label loop-label" x="46" y="457" transform="rotate(-90 46 457)">next round</text>

			<!-- Loop EXIT (right off Loop header) → down right gutter → into End from the right -->
			<line class="flow" x1="400" y1="284" x2="740" y2="284" />
			<text class="flow-label" x="412" y="278">exit when no seats remain</text>
			<line class="flow" x1="740" y1="284" x2="740" y2="732" />
			<line class="flow" x1="740" y1="732" x2="400" y2="732" marker-end="url(#stv-arrow)" />

			<!-- Loop end → End (vertical) -->
			<line class="flow" x1="290" y1="652" x2="290" y2="704" />
		</svg>
	</div>

	<h3 class="example-heading">Now run it on a made-up election</h3>

	<div class="legend">
		<span class="legend-item"><span class="swatch swatch-active"></span> Continuing</span>
		<span class="legend-item"><span class="swatch swatch-elected"></span> Elected this round</span>
		<span class="legend-item"><span class="swatch swatch-eliminated"></span> Eliminated this round</span>
		<span class="legend-item"><span class="swatch swatch-surplus"></span> Surplus transfer</span>
		<span class="legend-item"><span class="swatch swatch-elim"></span> Elimination transfer</span>
	</div>

	<div class="svg-wrap">
		<svg width="100%" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="STV count flow diagram across four rounds">
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
				{#each voteBlockRows[0] as block (block.key)}
					<g transform={`translate(${block.x + block.width / 2} -10)`}>
						<text
							class="cand-label"
							font-size="12"
							dominant-baseline="middle"
							transform="rotate(-90)"
							onpointerenter={() => (hoveredKey = block.key)}
							onpointerleave={() => (hoveredKey = null)}>{block.label}</text
						>
					</g>
				{/each}

				<!-- Vote blocks -->
				{#each voteBlockRows as row, rowIdx (rowIdx)}
					{#each row as block (block.key)}
						<g
							onpointerenter={() => (hoveredKey = block.key)}
							onpointerleave={() => (hoveredKey = null)}
						>
							<title>{blockTooltip(block)}</title>
							<rect
								class="vote-block"
								class:exhausted={block.isExhausted}
								class:elected={block.isElected}
								class:eliminated={block.isEliminatedThisRound}
								class:dim={hoveredKey !== null && hoveredKey !== block.key}
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
				{#each transferPaths as t (t.key)}
					<g onpointerenter={() => (hoveredKey = t.key)} onpointerleave={() => (hoveredKey = null)}>
						<title>{transferTooltip(t)}</title>
						<path
							class="transfer"
							class:surplus={t.type === 'surplus'}
							class:elim={t.type === 'elimination'}
							class:carryover={t.type === 'carryover'}
							class:dim={hoveredKey !== null && hoveredKey !== t.key}
							d={t.path}
						/>
					</g>
				{/each}

				<!-- Bottom labels -->
				{#each voteBlockRows[voteBlockRows.length - 1] as block (block.key)}
					<g transform={`translate(${block.x + block.width / 2} ${innerHeight + 10})`}>
						<text
							class="cand-label"
							font-size="12"
							dominant-baseline="middle"
							text-anchor="end"
							transform="rotate(-90)"
							onpointerenter={() => (hoveredKey = block.key)}
							onpointerleave={() => (hoveredKey = null)}>{block.label}</text
						>
					</g>
				{/each}
			</g>
		</svg>
	</div>

	<ol class="round-summary">
		<li>
			<strong>Round 1.</strong> Alice clears the quota with 320 votes — elected. Her 69-vote surplus
			redistributes to next preferences.
		</li>
		<li>
			<strong>Round 2.</strong> No-one is over quota. Ella has the fewest votes; she is eliminated
			and her 110 ballots transfer to their next preferences.
		</li>
		<li>
			<strong>Round 3.</strong> Chloe now clears the quota with 299 votes — elected. Her 48-vote
			surplus transfers.
		</li>
		<li>
			<strong>Round 4.</strong> Three seats need filling and three candidates remain. Dan takes the
			final seat.
		</li>
	</ol>

	<p class="result">
		<strong>Final result:</strong> Alice, Chloe, and Dan elected. Ben (220) and Ella (eliminated) are
		not elected.
	</p>

	<aside class="real-counts">
		<p>
			<strong>Want to see real counts?</strong>
			<a href="https://stv.vote" target="_blank" rel="noopener noreferrer">stv.vote</a> publishes
			thousands of actual STV elections — Scottish council wards, Irish Dáil constituencies, Cambridge
			MA city council, and more — each with the same kind of round-by-round Sankey diagram. Worth a
			visit if you want to see how STV behaves on real ballots rather than a tidy made-up one.
		</p>
	</aside>
</figure>

<style>
	.stv-worked-example {
		margin: 0;
		display: grid;
		gap: 1rem;
	}

	.caption {
		font-size: 0.95rem;
		line-height: 1.6;
		color: var(--text-color);
		margin: 0;
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

	.svg-wrap,
	.flowchart-wrap {
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		background: var(--surface-color);
		padding: 0.75rem;
		box-shadow: var(--shadow-soft);
	}

	.flowchart-wrap svg {
		width: 100%;
		max-width: 720px;
		height: auto;
		margin: 0 auto;
	}

	.example-heading {
		margin: 0.5rem 0 0;
		font-size: 1.1rem;
		color: var(--text-dark);
	}

	/* Drakon-style flowchart styling */
	.node {
		fill: var(--surface-raised);
		stroke: var(--border-strong);
		stroke-width: 1.5;
	}
	.node-title {
		fill: var(--header-bg);
		stroke: var(--header-bg-strong);
	}
	.node-question {
		fill: var(--warning-tint);
		stroke: var(--warning-border);
	}
	.node-loop {
		fill: var(--surface-muted);
		stroke: var(--accent-border-strong);
	}
	.node-end {
		fill: var(--highlight-bg);
		stroke: var(--success-border-strong);
	}
	.node-text {
		font-size: 13px;
		font-weight: 600;
		fill: var(--text-dark);
		text-anchor: middle;
		dominant-baseline: middle;
	}
	.node-text-title {
		fill: var(--text-inverse);
	}
	.node-text-end {
		fill: var(--success-text);
	}
	.node-text-loop {
		font-size: 16px;
		font-weight: 700;
		fill: var(--accent-text);
	}
	.node-text-sub {
		font-weight: 500;
		font-size: 12px;
		fill: var(--text-color);
	}
	.node-text-mono {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12px;
		font-weight: 500;
		fill: var(--text-color);
	}
	.flow {
		stroke: var(--text-soft);
		stroke-width: 1.6;
		fill: none;
	}
	.flow.loop {
		stroke-dasharray: 5 4;
	}
	.flow-label {
		font-size: 11px;
		font-weight: 700;
		fill: var(--text-soft);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}
	.loop-label {
		text-anchor: middle;
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
		opacity: 0.35;
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
		opacity: 0.08;
	}

	.round-summary {
		margin: 0;
		padding-left: 1.25rem;
		display: grid;
		gap: 0.4rem;
		font-size: 0.95rem;
		line-height: 1.55;
	}

	.round-summary li {
		margin: 0;
	}

	.result {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.55;
	}

	.real-counts {
		margin: 0;
		padding: 1rem 1.15rem;
		border: 1px solid var(--accent-border);
		border-left: 3px solid var(--accent-text);
		border-radius: var(--radius-sm);
		background: var(--surface-info-gradient);
	}

	.real-counts p {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.6;
		color: var(--text-color);
	}

	.real-counts a {
		color: var(--link-color);
		font-weight: 700;
		text-decoration: none;
	}

	.real-counts a:hover {
		text-decoration: underline;
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

		.node-question {
			fill: #2a241a;
		}
		.node-loop {
			fill: #1a2936;
		}
		.node-end {
			fill: #16291f;
		}
	}
</style>
