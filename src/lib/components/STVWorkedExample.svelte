<script lang="ts">
	// Hardcoded worked example of an STV count.
	// Uses Droop quota: floor(votes / (seats + 1)) + 1 = floor(1000 / 4) + 1 = 251.
	// Sankey rendering lives in STVSankey.svelte so /dev/stv-results can reuse it.

	import STVSankey, { type STVRound } from './STVSankey.svelte';

	type Candidate = { id: string; name: string; party: string };

	const candidates: Candidate[] = [
		{ id: 'alice', name: 'Alice Morgan', party: 'Labour' },
		{ id: 'ben', name: 'Ben Clarke', party: 'Conservative' },
		{ id: 'chloe', name: 'Chloe Rahman', party: 'Liberal Democrats' },
		{ id: 'dan', name: 'Daniel Okoro', party: 'Green' },
		{ id: 'ella', name: 'Ella Hughes', party: 'Independent' }
	];

	const totalVotes = 1000;
	const seats = 3;
	const quota = Math.floor(totalVotes / (seats + 1)) + 1; // 251

	const rounds: STVRound[] = [
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
			<line class="flow" x1="290" y1="72" x2="290" y2="96" />
			<line class="flow" x1="290" y1="152" x2="290" y2="176" />
			<line class="flow" x1="290" y1="232" x2="290" y2="256" />
			<line class="flow" x1="290" y1="312" x2="290" y2="336" />
			<line class="flow" x1="290" y1="392" x2="290" y2="416" />
			<text class="flow-label" x="298" y="408">yes</text>
			<line class="flow" x1="290" y1="472" x2="290" y2="496" />
			<line class="flow" x1="400" y1="364" x2="440" y2="364" />
			<line class="flow" x1="440" y1="364" x2="440" y2="416" />
			<line class="flow" x1="440" y1="416" x2="480" y2="416" />
			<text class="flow-label" x="408" y="358">no</text>
			<line class="flow" x1="590" y1="472" x2="590" y2="496" />
			<line class="flow" x1="290" y1="552" x2="290" y2="608" />
			<line class="flow" x1="590" y1="552" x2="590" y2="580" />
			<line class="flow" x1="590" y1="580" x2="290" y2="580" />
			<line class="flow loop" x1="220" y1="630" x2="60" y2="630" />
			<line class="flow loop" x1="60" y1="630" x2="60" y2="284" />
			<line class="flow loop" x1="60" y1="284" x2="180" y2="284" marker-end="url(#stv-arrow)" />
			<text class="flow-label loop-label" x="46" y="457" transform="rotate(-90 46 457)">next round</text>
			<line class="flow" x1="400" y1="284" x2="740" y2="284" />
			<text class="flow-label" x="412" y="278">exit when no seats remain</text>
			<line class="flow" x1="740" y1="284" x2="740" y2="732" />
			<line class="flow" x1="740" y1="732" x2="400" y2="732" marker-end="url(#stv-arrow)" />
			<line class="flow" x1="290" y1="652" x2="290" y2="704" />
		</svg>
	</div>

	<h3 class="example-heading">Now run it on a made-up election</h3>

	<STVSankey
		{candidates}
		{rounds}
		{seats}
		{totalVotes}
		ariaLabel="STV count flow diagram across four rounds"
	/>

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
		min-width: 0;
	}

	.caption {
		font-size: 0.95rem;
		line-height: 1.6;
		color: var(--text-color);
		margin: 0;
	}

	.flowchart-wrap {
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		background: var(--surface-color);
		padding: 0.75rem;
		box-shadow: var(--shadow-soft);
		min-width: 0;
		max-width: 100%;
		overflow: hidden;
	}

	.flowchart-wrap svg {
		display: block;
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

	@media (max-width: 640px) {
		.flowchart-wrap {
			padding: 0.5rem;
		}

		.caption,
		.round-summary,
		.result,
		.real-counts p {
			font-size: 0.92rem;
		}
	}
</style>
