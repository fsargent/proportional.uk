<script lang="ts">
	import MethodPageBody from '$lib/components/MethodPageBody.svelte';
	import MethodNav from '$lib/components/MethodNav.svelte';
	import BenefitCard from '$lib/components/BenefitCard.svelte';
	import StepCard from '$lib/components/StepCard.svelte';
	import FAQItem from '$lib/components/FAQItem.svelte';

	const benefits = [
		{
			emoji: '📊',
			title: 'True Proportionality',
			description:
				'Seats directly match vote share. If 15% of voters approve your candidates, you get approximately 15% of seats.'
		},
		{
			emoji: '✅',
			title: 'Simple Ballot',
			description:
				"One ballot, one instruction: tick all candidates you approve of. That's it. No ranking, no complex preferences."
		},
		{
			emoji: '⚡',
			title: 'Simpler to count than ranking',
			description:
				'No quotas, no vote transfers, no exhausted ballots to chase — just approvals, reweighted seat by seat. The arithmetic is quick to run and easy to publish.'
		},
		{
			emoji: '🪞',
			title: 'Mirrors the electorate',
			description:
				'Where a single-winner method elects one broadly-acceptable candidate, proportional approval reweights after each seat so cohesive groups — minorities included — win seats in proportion to their size. The chamber reflects the spread of the electorate, not just its middle.'
		},
		{
			emoji: '🗳️',
			title: 'No Wasted Votes',
			description:
				'Every approval counts toward electing someone. No more voting in safe seats where your vote changes nothing.'
		},
		{
			emoji: '🤝',
			title: 'No vote-splitting',
			description:
				"Approving more candidates never splits the vote the way First Past the Post does — you're free to back several you like without handing a seat to someone you don't."
		}
	];

	const steps = [
		{
			number: 1,
			title: 'Cast Your Ballot',
			description: 'Approve (tick) any candidates you find acceptable from the full list.'
		},
		{
			number: 2,
			title: 'Group Identical Ballots',
			description:
				"Voters who marked the same set of candidates form a group. Counting groups (rather than every individual ballot) makes the proportional logic easy to follow — each group's voice rises and falls together."
		},
		{
			number: 3,
			title: 'Count All Approvals',
			description:
				'Sum the weighted approvals each candidate received across every group. In the first round every group is at full strength.'
		},
		{
			number: 4,
			title: 'Elect, Then Reduce the Winner’s Groups',
			description:
				"The candidate with the highest weighted total wins a seat. Every group that approved them has its weight reduced (½, then ⅓, …) so they don't dominate the next round."
		},
		{
			number: 5,
			title: 'Repeat Until Full',
			description:
				'Recount with the new weights, elect the next winner, reduce again. After every seat is filled, each coalition has won seats in rough proportion to its size.'
		}
	];

	const candidates = [
		{ id: 'pa-1', name: 'Sarah Chen', party: 'Labour' },
		{ id: 'pa-2', name: 'James Wilson', party: 'Conservative' },
		{ id: 'pa-3', name: 'Emma Thompson', party: 'Liberal Democrats' },
		{ id: 'pa-4', name: 'David Patel', party: 'Green' },
		{ id: 'pa-5', name: 'Lisa O\'Connor', party: 'Labour' },
		{ id: 'pa-6', name: 'Michael Brown', party: 'Conservative' },
		{ id: 'pa-7', name: 'Priya Sharma', party: 'Liberal Democrats' },
		{ id: 'pa-8', name: 'Tom Wright', party: 'Reform UK' }
	];

	let selections = $state<Record<string, boolean>>({});

	const approvedCount = $derived(Object.values(selections).filter(Boolean).length);

	// === Worked-example data: 3 seats, 12 voters, 3 groups ===
	type WECandidate = { id: string; name: string; party: string };
	type WEGroup = { id: string; label: string; count: number; approvals: string[]; color: string };

	const weCandidates: WECandidate[] = [
		{ id: 'a', name: 'Anna Adams', party: 'Far Left' },
		{ id: 'b', name: 'Bob Brown', party: 'Left' },
		{ id: 'c', name: 'Charlie Clarke', party: 'Centrist' },
		{ id: 'd', name: 'Dave Davies', party: 'Right' },
		{ id: 'e', name: 'Eve Evans', party: 'Far Right' },
		{ id: 'f', name: 'Frank Fisher', party: 'Independent' }
	];

	const weGroups: WEGroup[] = [
		{ id: 'A', label: 'Group A', count: 5, approvals: ['a', 'b'], color: '#d62728' },
		{ id: 'B', label: 'Group B', count: 4, approvals: ['c', 'd'], color: '#1f77b4' },
		{ id: 'C', label: 'Group C', count: 3, approvals: ['e', 'f'], color: '#2ca02c' }
	];

	const weSeats = 3;

	type WERound = {
		weights: Record<string, number>;
		scores: Array<{ id: string; score: number }>;
		winner: WECandidate;
	};

	function computeWE(): { rounds: WERound[]; elected: string[] } {
		const elected: string[] = [];
		const rounds: WERound[] = [];
		for (let r = 0; r < weSeats; r++) {
			const weights: Record<string, number> = {};
			weGroups.forEach((g) => {
				const k = g.approvals.filter((a) => elected.includes(a)).length;
				weights[g.id] = 1 / (1 + k);
			});
			const scores = weCandidates
				.filter((c) => !elected.includes(c.id))
				.map((c) => ({
					id: c.id,
					score: weGroups.reduce(
						(s, g) => s + (g.approvals.includes(c.id) ? g.count * weights[g.id] : 0),
						0
					)
				}))
				.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
			const winner = weCandidates.find((c) => c.id === scores[0].id)!;
			elected.push(winner.id);
			rounds.push({ weights, scores, winner });
		}
		return { rounds, elected };
	}

	const { rounds: weRounds, elected: weElected } = computeWE();
	const findWE = (id: string) => weCandidates.find((c) => c.id === id)!;
	const weFmtWeight = (w: number) =>
		w === 1 ? '1' : w === 0.5 ? '½' : w === 1 / 3 ? '⅓' : w.toFixed(2);
</script>

<svelte:head>
	<title>Proportional Approval for Westminster</title>
	<meta name="description" content="Explore a fully proportional Westminster built from approval ballots and multi-member districts." />
</svelte:head>

<section class="method-page">
	<aside class="rail">
		<MethodNav current="proportional-approval" />
	</aside>
	<div class="page-body">
		<MethodPageBody methodId="proportional-approval" title="Proportional Approval: the cleanest fully proportional version">
			{#snippet mechanics()}
				<p class="intro-text">
					This is the full version of the idea: a genuinely proportional Parliament built from approval
					ballots in <a href="/visualiser">multi-member districts</a>. In academic literature this
					implementation is called <a
						href="https://en.wikipedia.org/wiki/Sequential_proportional_approval_voting"
						target="_blank"
						rel="noopener">Sequential Proportional Approval Voting</a
					>, but we'll refer to it as Proportional Approval throughout.
				</p>
				<p class="intro-text">
					It is the cleanest way to carry the simple ballot idea all the way through to a fully
					proportional result.
				</p>

				<h3 class="subsection-header">How You Vote</h3>

				<div class="voting-demo">
					<div class="ballot-panel">
						<h4>Your Ballot</h4>
						<p class="ballot-instruction">Tick all candidates you approve of:</p>

						<div class="candidate-list">
							{#each candidates as candidate (candidate.id)}
								<div class="candidate-row">
									<label for={candidate.id}>
										<input
											type="checkbox"
											id={candidate.id}
											class="candidate-checkbox"
											bind:checked={selections[candidate.id]}
										/>
										<span class="candidate-copy">
											<span class="candidate-name">{candidate.name}</span>
											<span class="candidate-party">{candidate.party}</span>
										</span>
									</label>
								</div>
							{/each}
						</div>

						<div class="ballot-summary">
							{#if approvedCount === 0}
								<p>Select candidates to see how your ballot works</p>
							{:else}
								<p>
									You've approved <strong>{approvedCount}</strong>
									{approvedCount === 1 ? 'candidate' : 'candidates'}
								</p>
							{/if}
						</div>
					</div>

					<div class="explanation-panel">
						<h4>What Happens Next</h4>
						<ol>
							<li>All ballots are collected and grouped by which candidates they approved</li>
							<li>The candidate with the most approvals (across all groups) wins the first seat</li>
							<li>
								Every group that approved that winner has its weight reduced — so the same coalition can't
								keep electing everyone
							</li>
							<li>The next most-approved candidate (by reweighted count) wins the next seat</li>
							<li>This continues until all seats are filled</li>
						</ol>
						<p class="key-point">
							<strong>Key insight:</strong> By reducing the weight of "already represented" groups, the system
							ensures that different coalitions each get proportional representation.
						</p>
					</div>
				</div>

				<h3 class="subsection-header">How It Works</h3>

				<div class="process-steps">
					{#each steps as step (step.number)}
						<StepCard number={step.number} title={step.title} description={step.description} />
					{/each}
				</div>
			{/snippet}

			{#snippet workedExample()}
				<figure class="pa-algorithm" aria-labelledby="pa-algorithm-caption">
					<figcaption id="pa-algorithm-caption" class="caption">
						<strong>The algorithm.</strong> Top-to-bottom, single entry, single exit (read like Drakon).
						Elect the highest weighted approval total, reweight every ballot that helped, repeat until
						seats are full.
					</figcaption>

					<div class="flowchart-wrap">
						<svg viewBox="0 0 600 620" role="img" aria-label="Drakon flowchart of the Proportional Approval count algorithm">
							<defs>
								<marker id="pa-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
									<path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
								</marker>
							</defs>

							<!-- Header (Title) -->
							<rect class="node node-title" x="180" y="16" width="220" height="56" rx="28" />
							<text class="node-text node-text-title" x="290" y="44">Count a Proportional Approval election</text>

							<!-- Action: Tally + initial weights -->
							<rect class="node" x="180" y="96" width="220" height="66" />
							<text class="node-text" x="290" y="120">Count approvals per candidate</text>
							<text class="node-text node-text-sub" x="290" y="140">every ballot starts with weight 1</text>

							<!-- Loop header -->
							<rect class="node node-loop" x="180" y="186" width="220" height="56" rx="28" />
							<text class="node-text node-text-loop" x="208" y="214">↻</text>
							<text class="node-text" x="298" y="214">While seats remain</text>

							<!-- Action: Elect -->
							<rect class="node" x="180" y="266" width="220" height="66" />
							<text class="node-text" x="290" y="290">Elect highest weighted total</text>
							<text class="node-text node-text-sub" x="290" y="310">sum of weights × approvals</text>

							<!-- Action: Reweight -->
							<rect class="node" x="180" y="356" width="220" height="76" />
							<text class="node-text" x="290" y="378">Reweight ballots that approved them</text>
							<text class="node-text node-text-mono" x="290" y="400">w = 1 ÷ (1 + elected on ballot)</text>

							<!-- Loop end -->
							<rect class="node node-loop" x="220" y="456" width="140" height="44" rx="22" />
							<text class="node-text node-text-loop" x="240" y="478">↺</text>
							<text class="node-text node-text-sub" x="300" y="478">end loop</text>

							<!-- End node -->
							<rect class="node node-end" x="180" y="524" width="220" height="56" rx="28" />
							<text class="node-text node-text-end" x="290" y="552">All seats filled</text>

							<!-- Connectors -->
							<line class="flow" x1="290" y1="72" x2="290" y2="96" />
							<line class="flow" x1="290" y1="162" x2="290" y2="186" />
							<line class="flow" x1="290" y1="242" x2="290" y2="266" />
							<line class="flow" x1="290" y1="332" x2="290" y2="356" />
							<line class="flow" x1="290" y1="432" x2="290" y2="456" />
							<line class="flow" x1="290" y1="500" x2="290" y2="524" />

							<!-- Loop-back arrow (left gutter) -->
							<line class="flow loop" x1="220" y1="478" x2="60" y2="478" />
							<line class="flow loop" x1="60" y1="478" x2="60" y2="214" />
							<line class="flow loop" x1="60" y1="214" x2="180" y2="214" marker-end="url(#pa-arrow)" />
							<text class="flow-label loop-label" x="46" y="346" transform="rotate(-90 46 346)">next seat</text>

							<!-- Loop EXIT (right gutter) -->
							<line class="flow" x1="400" y1="214" x2="540" y2="214" />
							<text class="flow-label" x="412" y="208">exit when no seats remain</text>
							<line class="flow" x1="540" y1="214" x2="540" y2="552" />
							<line class="flow" x1="540" y1="552" x2="400" y2="552" marker-end="url(#pa-arrow)" />
						</svg>
					</div>
				</figure>

				<div class="worked-example">
					<h4>📊 Worked example: 3 seats, 12 voters</h4>
					<p>
						Twelve voters fall into three groups by which candidates they approved. Three seats up for
						grabs. Watch how reweighting gives each group one seat — even though Group A is nearly twice
						the size of Group C.
					</p>

					<div class="we-groups">
						{#each weGroups as g (g.id)}
							<div class="we-group" style="border-left: 4px solid {g.color};">
								<header>
									<strong>{g.label}</strong>
									<small>{g.count} voters</small>
								</header>
								<p>Approves: {g.approvals.map((a) => findWE(a).name).join(', ')}</p>
							</div>
						{/each}
					</div>

					<ol class="we-rounds">
						{#each weRounds as round, i (i)}
							<li class="we-round">
								<header>
									<span class="we-round-tag">Round {i + 1}</span>
									<span class="we-weights">
										{#each weGroups as g (g.id)}
											<span class="we-weight" style="--c:{g.color}">
												{g.label}: ×{weFmtWeight(round.weights[g.id])}
											</span>
										{/each}
									</span>
								</header>
								<ul class="we-scores">
									{#each round.scores as s (s.id)}
										{@const c = findWE(s.id)}
										{@const winning = c.id === round.winner.id}
										{@const maxScore = round.scores[0].score}
										<li class:winning>
											<span class="we-name">
												{c.name}
												<small>{c.party}</small>
											</span>
											<span class="we-bar">
												<span class="we-bar-fill" style="width:{(s.score / maxScore) * 100}%"></span>
											</span>
											<span class="we-value">
												{s.score.toFixed(1)}{winning ? ' ✓' : ''}
											</span>
										</li>
									{/each}
								</ul>
								{#if i < weRounds.length - 1}
									<p class="we-note">
										→ <strong>{round.winner.name}</strong> won. The group that approved them drops to a
										lower weight in the next round.
									</p>
								{:else}
									<p class="we-note we-final">
										→ Final winners: {weElected.map((id) => findWE(id).name).join(', ')} — one seat per
										coalition.
									</p>
								{/if}
							</li>
						{/each}
					</ol>
				</div>

				<div class="reweighting-explainer">
					<h4>📐 The Reweighting Mechanism</h4>
					<p>
						The key to proportionality is how voter weights are adjusted after each seat is filled. When a
						candidate you approved wins:
					</p>
					<ul>
						<li>
							Your ballot weight decreases (because you've successfully elected someone who represents
							you)
						</li>
						<li>Voters who haven't elected anyone yet keep their full weight</li>
						<li>
							This means the next round favours candidates supported by currently-unrepresented voters
						</li>
					</ul>
					<p>
						The result: if 30% of voters approve only Green candidates, Greens will win approximately 30%
						of seats—even if other candidates have higher raw approval counts.
					</p>
				</div>
			{/snippet}

			{#snippet strengths()}
				<div class="implementation-frame">
					<div class="implementation-card">
						<p class="implementation-label">Strategic role in UK reform</p>
						<h3>If Britain wanted the cleanest fully proportional version</h3>
						<p>
							Proportional Approval is the cleanest way to keep the approval-voting thesis all the way
							through to a fully proportional Parliament. The main implementation hurdle is not the ballot
							instruction, which is simple, but the move to <a href="/visualiser">multi-member districts</a> and the boundary work that
							comes with them.
						</p>
					</div>
					<div class="implementation-grid">
						<div>
							<h4>Near-term use</h4>
							<p>Best advanced alongside district-magnitude planning, visualisation work, and wider public argument about regional representation.</p>
						</div>
						<div>
							<h4>Boundary logic</h4>
							<p>Use stable building blocks such as groups of constituencies, local authority clusters, and recognisable county or city regions.</p>
						</div>
						<div>
							<h4>Counting benchmark</h4>
							<p>For rough UK comparisons, Sainte-Lague is a better benchmark than D'Hondt because it is less biased toward the largest parties.</p>
						</div>
					</div>
				</div>

				<h3 class="subsection-header">Why Proportional Approval?</h3>

				<div class="benefits-grid">
					{#each benefits as benefit (benefit.title)}
						<BenefitCard emoji={benefit.emoji} title={benefit.title} description={benefit.description} />
					{/each}
				</div>
			{/snippet}

			{#snippet tradeoffs()}
				<div class="tradeoff-stack">
					<div class="detail-card">
						<h4>Almost no real-world track record</h4>
						<p>
							This is the serious one. A sequential version was used for Swedish parliamentary
							elections from 1909 to 1921, then dropped for party lists — and no national legislature
							uses it today. STV and list PR each have a century of continuous practice to point to;
							Proportional Approval does not. Adopting it means being the place that proves it at scale.
						</p>
					</div>
					<div class="detail-card">
						<h4>You can sometimes do better by not approving a front-runner</h4>
						<p>
							Because your ballot's weight is reduced each time a candidate you approved wins a seat,
							there's a strategic incentive not to approve a popular candidate who will win anyway —
							keeping your full weight to help elect your real favourite for a later seat. Unlike
							single-winner approval, honest approval isn't always your strongest play. (Theorists call
							this free-riding.)
						</p>
					</div>
					<div class="detail-card">
						<h4>Results take a little explaining</h4>
						<p>
							The maths is clean and simple, but the reweighting that decides the winners isn't
							intuitive at a glance — about as much to explain as an STV count, if not slightly less.
							You can't watch the result fall straight out of a single tally the way you can under First
							Past the Post.
						</p>
					</div>
					<div class="detail-card">
						<h4>Needs multi-member districts</h4>
						<p>
							Like STV, it requires grouping today's single-member seats into larger multi-member
							districts, with the boundary work that implies. Districts also have to be reasonably large
							to be proportional: very small ones behave more like majoritarian contests.
						</p>
					</div>
				</div>
			{/snippet}

			{#snippet faq()}
				<div class="faq-section">
					<FAQItem question="Isn't this just approval voting for multi-winner elections?">
						<p>
							Yes, exactly! Proportional Approval extends the simplicity of approval voting to
							multi-winner contexts. Instead of just electing the single most-approved candidate, it
							elects multiple candidates proportionally.
						</p>
					</FAQItem>

					<FAQItem question="What about local representation?">
						<p>
							In a Proportional Approval system, you'd vote in a regional constituency (e.g., "Greater
							Manchester" with 10 seats). All elected MPs from your region would be accountable to
							voters there. You wouldn't have one specific "your MP," but you'd have several MPs from
							your region, likely including one who shares your views.
						</p>
						<p>
							That's a gain on today's system, not a loss: under First Past the Post, if the candidate
							you voted for loses, no one in Parliament represents your choice at all. Under proportional
							approval, your approvals actually help elect someone.
						</p>
					</FAQItem>

					<FAQItem question="Can I just approve one candidate?">
						<p>
							Yes! You can approve as few or as many candidates as you like. Approving just one is
							perfectly valid. However, approving more candidates you find acceptable increases the
							chance that at least one of them gets elected.
						</p>
					</FAQItem>

					<FAQItem question="Does approving more candidates hurt my favourite?">
						<p>
							Under single-winner approval, no — approving a backup never hurts your favourite. Under the
							<em>proportional</em> version it's subtler. Approving more candidates never splits the vote
							the way First Past the Post does. But because your ballot loses weight each time a candidate
							you approved wins a seat, approving a likely winner can leave you less weight to help elect
							your real favourite for a later seat.
						</p>
						<p>
							For most voters, approving everyone you genuinely support is still the simplest strategy and
							a perfectly good one. But it's honest to say the proportional version isn't as strategy-proof
							as single-winner approval — see the trade-offs above.
						</p>
					</FAQItem>

					<FAQItem question="How is this different from STV?">
						<p>
							Both are proportional multi-winner systems, and both deserve to be taken seriously. The main
							difference is how they ask voters to express support:
						</p>
						<ul>
							<li>
								<strong><a href="/stv">STV</a>:</strong> You rank candidates. Votes transfer through
								quotas and eliminations, which can be slower to count and harder to explain.
							</li>
							<li>
								<strong>Proportional Approval:</strong> You approve candidates. Votes are reweighted after
								each seat. The ballot is simpler even though the proportional logic is still real.
							</li>
						</ul>
						<p>
							So the critique here is trade-off based, not sectarian: <a href="/stv">STV</a> has a strong
							pedigree, but Proportional Approval keeps the same proportional ambition with a more
							legible voter experience.
						</p>
					</FAQItem>

					<FAQItem question="Where is this used?">
						<p>
							Variations of proportional approval voting are used in some professional associations and
							organizational elections. Sweden uses a form of approval voting for some elections. The
							system is gaining academic attention as a simpler alternative to <a href="/stv">STV</a>.
						</p>
					</FAQItem>

					<FAQItem question="What happens if two candidates tie in a round?">
						<p>
							The natural answer is to use what the UK already does. Under the
							<strong>Representation of the People Act 1983</strong>, ties in parliamentary and council
							elections are <strong>decided by lot</strong> — drawing straws, drawing names from a hat,
							or a coin toss. (Cutting cards has been used at least once, in a 2017 Northumberland
							council seat.) Proportional Approval would apply the same rule per round: if two
							candidates have identical reweighted totals, the Returning Officer decides by lot.
						</p>
						<p>
							At realistic scale (thousands of ballots, fractional weights), exact ties are vanishingly
							rare — but the procedure is already familiar in British elections and would not need new
							legislation to specify.
						</p>
					</FAQItem>
				</div>
			{/snippet}

			{#snippet bottomLine()}
				<p>
					Proportional Approval gives you the simplicity of approval voting with the fairness of
					proportional representation. It is the strongest approval-based case for a fully proportional
					Westminster, especially once <a href="/visualiser">multi-member district</a> reform is politically achievable.
				</p>
				<p>
					<strong>Your job is simple:</strong> tick all the candidates you'd be happy to have represent you.
					The system does the rest.
				</p>
			{/snippet}
		</MethodPageBody>
	</div>
</section>

<style>
	.method-page { display: grid; gap: 2rem; max-width: 54rem; margin: 0 auto; }
	.page-body { display: grid; gap: 2rem; min-width: 0; }
	.rail { display: none; }

	.intro-text {
		font-size: 1.1rem;
		line-height: 1.7;
		max-width: 800px;
	}

	.implementation-frame {
		margin: 0;
		padding: 1.5rem;
		border-radius: var(--radius-lg);
		border: 1px solid var(--accent-border);
		background: var(--surface-info-gradient);
		box-shadow: var(--shadow-soft);
		display: grid;
		gap: 1.25rem;
	}

	.implementation-card h3,
	.implementation-grid h4,
	.detail-card h4 {
		margin: 0 0 0.45rem 0;
	}

	.implementation-label {
		margin: 0 0 0.35rem 0;
		font-size: 0.85rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--accent-text);
	}

	.implementation-card p,
	.implementation-grid p,
	.detail-card p {
		margin: 0;
	}

	.implementation-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
	}

	.implementation-grid > div,
	.detail-card {
		padding: 1rem;
		border-radius: var(--radius-md);
		border: 1px solid var(--border-color);
		background: var(--surface-color);
	}

	.tradeoff-stack {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	.subsection-header {
		font-size: 1.4rem;
		color: var(--text-dark);
		margin: 1.5rem 0 1rem 0;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid var(--border-color);
	}

	.voting-demo {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		margin: 1rem 0;
	}

	.ballot-panel {
		background: var(--surface-subtle-gradient);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		padding: 1.5rem;
		box-shadow: var(--shadow-soft);
	}

	.ballot-panel h4 {
		margin-top: 0;
		margin-bottom: 0.5rem;
		color: var(--text-dark);
	}

	.ballot-instruction {
		color: var(--accent-text);
		font-weight: 600;
		margin-bottom: 1rem;
	}

	.candidate-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.candidate-row {
		background: var(--surface-color);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
		transition:
			border-color 0.2s ease,
			background-color 0.2s ease;
	}

	.candidate-row:hover {
		background: var(--field-hover);
		border-color: var(--border-strong);
	}

	.candidate-checkbox {
		width: 1.25rem;
		height: 1.25rem;
		cursor: pointer;
		accent-color: var(--header-bg);
		flex-shrink: 0;
	}

	.candidate-row label {
		cursor: pointer;
		width: 100%;
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem;
		box-sizing: border-box;
	}

	.candidate-copy {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: 0.125rem;
	}

	.candidate-name {
		font-weight: 600;
		color: var(--text-dark);
	}

	.candidate-party {
		font-size: 0.85rem;
		color: var(--text-soft);
	}

	.ballot-summary {
		margin-top: 1rem;
		padding: 1rem;
		background: var(--surface-color);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
		text-align: center;
	}

	.ballot-summary p {
		margin: 0;
		color: var(--text-color);
	}

	.explanation-panel {
		background: var(--surface-info-gradient);
		border: 1px solid var(--accent-border);
		border-radius: var(--radius-md);
		padding: 1.5rem;
		box-shadow: var(--shadow-soft);
	}

	.explanation-panel h4 {
		margin-top: 0;
		color: var(--accent-text);
	}

	.explanation-panel ol {
		margin: 1rem 0;
		padding-left: 1.5rem;
	}

	.explanation-panel li {
		margin-bottom: 0.75rem;
		line-height: 1.5;
	}

	.key-point {
		margin: 1rem 0 0 0;
		padding: 0.75rem;
		background: var(--surface-color);
		border: 1px solid var(--accent-border);
		border-radius: var(--radius-sm);
		font-size: 0.95rem;
	}

	.reweighting-explainer {
		margin: 0 0 1rem 0;
		padding: 2rem;
		background: var(--surface-subtle-gradient);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-soft);
	}

	.reweighting-explainer h4 {
		margin-top: 0;
		color: var(--text-dark);
	}

	.reweighting-explainer ul {
		margin: 1rem 0;
		padding-left: 1.5rem;
	}

	.reweighting-explainer li {
		margin-bottom: 0.5rem;
		line-height: 1.5;
	}

	@media (max-width: 768px) {
		.voting-demo {
			grid-template-columns: 1fr;
		}

		.implementation-grid {
			grid-template-columns: 1fr;
		}
	}

	/* SPAV algorithm flowchart — same Drakon-style language as STV's. */
	.pa-algorithm {
		margin: 0 0 1.5rem 0;
		display: grid;
		gap: 0.75rem;
	}

	.pa-algorithm .caption {
		font-size: 0.95rem;
		line-height: 1.55;
		color: var(--text-color);
	}

	.pa-algorithm .flowchart-wrap {
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		background: var(--surface-color);
		padding: 0.75rem;
		box-shadow: var(--shadow-soft);
	}

	.pa-algorithm .flowchart-wrap svg {
		display: block;
		width: 100%;
		max-width: 600px;
		height: auto;
		margin: 0 auto;
	}

	.pa-algorithm .node {
		fill: var(--surface-raised);
		stroke: var(--border-strong);
		stroke-width: 1.5;
	}
	.pa-algorithm .node-title {
		fill: var(--header-bg);
		stroke: var(--header-bg-strong);
	}
	.pa-algorithm .node-loop {
		fill: var(--surface-muted);
		stroke: var(--accent-border-strong);
	}
	.pa-algorithm .node-end {
		fill: var(--highlight-bg);
		stroke: var(--success-border-strong);
	}
	.pa-algorithm .node-text {
		font-size: 13px;
		font-weight: 600;
		fill: var(--text-dark);
		text-anchor: middle;
		dominant-baseline: middle;
	}
	.pa-algorithm .node-text-title {
		fill: var(--text-inverse);
	}
	.pa-algorithm .node-text-end {
		fill: var(--success-text);
	}
	.pa-algorithm .node-text-loop {
		font-size: 16px;
		font-weight: 700;
		fill: var(--accent-text);
	}
	.pa-algorithm .node-text-sub {
		font-weight: 500;
		font-size: 12px;
		fill: var(--text-color);
	}
	.pa-algorithm .node-text-mono {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12px;
		font-weight: 500;
		fill: var(--text-color);
	}
	.pa-algorithm .flow {
		stroke: var(--text-soft);
		stroke-width: 1.6;
		fill: none;
	}
	.pa-algorithm .flow.loop {
		stroke-dasharray: 5 4;
	}
	.pa-algorithm .flow-label {
		font-size: 11px;
		font-weight: 700;
		fill: var(--text-soft);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}
	.pa-algorithm .loop-label {
		text-anchor: middle;
	}

	/* ===== Worked example (grouped ballots) ===== */
	.worked-example {
		margin: 1.5rem 0 1.5rem;
		padding: 1.5rem 1.75rem;
		background: var(--surface-subtle-gradient);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-soft);
	}

	.worked-example h4 {
		margin: 0 0 0.5rem;
		color: var(--text-dark);
	}

	.worked-example > p {
		margin: 0 0 1.25rem;
		color: var(--text-color);
	}

	.we-groups {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
		gap: 0.75rem;
		margin: 0 0 1.5rem;
	}

	.we-group {
		padding: 0.65rem 0.85rem;
		background: var(--surface-color);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
	}

	.we-group header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 0.2rem;
	}

	.we-group small {
		color: var(--text-soft);
		font-size: 0.78rem;
	}

	.we-group p {
		margin: 0;
		font-size: 0.85rem;
		color: var(--text-color);
	}

	.we-rounds {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.we-round {
		background: var(--surface-color);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
		padding: 0.85rem 1rem;
	}

	.we-round > header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem 1rem;
		margin-bottom: 0.6rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px dashed var(--border-color);
	}

	.we-round-tag {
		background: var(--header-bg);
		color: var(--text-inverse);
		padding: 0.15rem 0.55rem;
		border-radius: 999px;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.we-weights {
		display: inline-flex;
		gap: 0.6rem;
		flex-wrap: wrap;
	}

	.we-weight {
		font-size: 0.78rem;
		color: var(--text-soft);
		border-left: 3px solid var(--c);
		padding-left: 0.4rem;
		font-variant-numeric: tabular-nums;
	}

	.we-scores {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.we-scores li {
		display: grid;
		grid-template-columns: 11rem 1fr 3rem;
		align-items: center;
		gap: 0.6rem;
		padding: 0.3rem 0.5rem;
		border-radius: var(--radius-sm);
		font-size: 0.88rem;
	}

	.we-scores li.winning {
		background: var(--field-hover, rgba(0, 0, 0, 0.04));
		font-weight: 600;
	}

	.we-name {
		display: flex;
		flex-direction: column;
		color: var(--text-dark);
		min-width: 0;
	}

	.we-name small {
		color: var(--text-soft);
		font-size: 0.72rem;
		font-weight: 400;
	}

	.we-bar {
		height: 10px;
		background: var(--surface-color);
		border-radius: 999px;
		overflow: hidden;
		border: 1px solid var(--border-color);
	}

	.we-bar-fill {
		display: block;
		height: 100%;
		background: var(--header-bg);
		border-radius: 999px;
		transition: width 0.25s ease;
	}

	.we-value {
		font-variant-numeric: tabular-nums;
		text-align: right;
		color: var(--text-dark);
	}

	.we-note {
		margin: 0.7rem 0 0;
		font-size: 0.88rem;
		color: var(--text-color);
	}

	.we-final {
		font-weight: 500;
	}

	@media (min-width: 1280px) {
		.method-page {
			max-width: none;
			grid-template-columns: minmax(16rem, 1fr) minmax(0, 54rem) minmax(0, 1fr);
			column-gap: 2rem;
			align-items: start;
		}
		.rail { display: block; grid-column: 3; grid-row: 1; justify-self: start; width: 16rem; position: sticky; top: 1rem; }
		.page-body { grid-column: 2; grid-row: 1; }
	}
</style>
