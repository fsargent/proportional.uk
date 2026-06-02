<script lang="ts">
	import MethodPageBody from '$lib/components/MethodPageBody.svelte';
	import MethodNav from '$lib/components/MethodNav.svelte';
	import BenefitCard from '$lib/components/BenefitCard.svelte';
	import StepCard from '$lib/components/StepCard.svelte';
	import FAQItem from '$lib/components/FAQItem.svelte';

	type Variant = 'compensatory' | 'parallel';
	let variant = $state<Variant>('compensatory');

	const benefits = [
		{
			emoji: '🗳️',
			title: 'Greater Expression',
			description:
				'Approve multiple candidates you trust to represent your constituency, rather than being forced into a single choice.'
		},
		{
			emoji: '🎯',
			title: 'No Spoiler Effect',
			description:
				"Support your favourite candidates without worrying about splitting the vote or letting your least-preferred candidate win."
		},
		{
			emoji: '⚖️',
			title: 'Proportional Results',
			description:
				'The party list ensures overall proportional representation while local seats reflect broad community support.'
		},
		{
			emoji: '🤝',
			title: 'Encourages Consensus',
			description:
				'Candidates who appeal across different groups are rewarded, promoting coalition-building and moderation.'
		},
		{
			emoji: '📊',
			title: 'Better Accountability',
			description:
				'Dual accountability through both local approval and party proportionality creates stronger democratic incentives.'
		},
		{
			emoji: '🔄',
			title: 'Familiar Structure',
			description:
				'Builds on the proven AMS family used in Scotland (and in Wales until 2021) with minimal disruption.'
		}
	];

	const steps = [
		{
			number: 1,
			title: 'Cast Your Votes',
			description:
				'Approve multiple constituency candidates and select one party for the regional list'
		},
		{
			number: 2,
			title: 'Count Approvals',
			description: 'The constituency candidate with the most approvals wins the local seat'
		},
		{
			number: 3,
			title: 'Allocate List Seats',
			description: 'Regional list seats are distributed proportionally based on party vote share'
		},
		{
			number: 4,
			title: 'Balanced Representation',
			description: 'Final assembly reflects both local approval and proportional party support'
		}
	];

	const foundationBenefits = [
		{
			emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
			title: 'Scotland',
			description:
				'Scotland still elects its Parliament by AMS today: 129 seats — 73 constituency MSPs plus 56 regional list MSPs. (Scottish councils, confusingly, use a different system — STV.)'
		},
		{
			emoji: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
			title: 'Wales',
			description:
				"Wales elected its Senedd by AMS from 1999 to 2021. At the May 2026 election it went further — to a fully proportional 96-member system — judging the old 40-constituency, 20-list mix too much of a half-measure. The lesson for AMS+: a top-up tier only delivers proportionality if it is large enough and fully compensatory."
		},
		{
			emoji: '✅',
			title: 'Proven Track Record',
			description:
				'Two decades of AMS elections across Scotland, Wales, Germany and New Zealand show the mixed-member structure works. AMS+ keeps that structure, fixes the FPTP local tier with approval, and — learning from Wales — uses a top-up big enough to be genuinely proportional rather than a half-measure.'
		}
	];

	const constituencyCandidates = [
		{ id: 'ams-candidate-1', name: 'Sarah Johnson', party: 'Labour Party' },
		{ id: 'ams-candidate-2', name: 'James Mitchell', party: 'Conservative Party' },
		{ id: 'ams-candidate-3', name: 'Emma Williams', party: 'Liberal Democrats' },
		{ id: 'ams-candidate-4', name: 'David Chen', party: 'Green Party' },
		{ id: 'ams-candidate-5', name: 'Aisha Patel', party: 'Independent' }
	];

	const parties = [
		{ id: 'ams-party-labour', name: 'Labour Party' },
		{ id: 'ams-party-conservative', name: 'Conservative Party' },
		{ id: 'ams-party-libdem', name: 'Liberal Democrats' },
		{ id: 'ams-party-green', name: 'Green Party' },
		{ id: 'ams-party-reform', name: 'Reform UK' }
	];

	let candidateSelections = $state<Record<string, boolean>>({});
</script>

<svelte:head>
	<title>AMS+ for Westminster</title>
	<meta name="description" content="Explore AMS+: an approval-based mixed system that keeps local MPs and adds proportional representation." />
</svelte:head>

<section class="method-page">
	<aside class="rail">
		<MethodNav current="ams-plus" />
	</aside>
	<div class="page-body">
		<MethodPageBody methodId="ams-plus" title="AMS+: the easiest proportional route from here">
			{#snippet mechanics()}
				<p class="intro-text">
					This is the most straightforward proportional version of the idea. Start with the
					<a
						href="https://en.wikipedia.org/wiki/Additional_member_system"
						target="_blank"
						rel="noopener noreferrer">Additional Member System</a
					>
					used in Scotland — and in Wales until 2021 — then swap out the local “pick one” ballot for approval voting.
				</p>
				<p class="intro-text">
					You keep local MPs. You keep proportional top-up seats. But the constituency vote stops forcing
					people into the old FPTP squeeze.
				</p>

				<h3 class="subsection-header">How You Vote</h3>

				<div class="voting-guide">
					<div class="voting-section">
						<h4>Constituency Ballot</h4>
						<p><strong>Vote for your local representative</strong></p>
						<p class="instruction">✓ APPROVE as many candidates as you wish</p>
						<p class="explanation-text">
							<strong>What this does:</strong> The candidate with the most approvals wins your local seat.
							Support all candidates you trust, not just your "safest" choice.
						</p>

						<div class="ballot-example">
							{#each constituencyCandidates as candidate (candidate.id)}
								<div class="candidate-item">
									<label for={candidate.id}>
										<input
											type="checkbox"
											id={candidate.id}
											class="candidate-checkbox"
											bind:checked={candidateSelections[candidate.id]}
										/>
										<div class="candidate-copy">
											<div class="candidate-name">{candidate.name}</div>
											<div class="candidate-party">{candidate.party}</div>
										</div>
									</label>
								</div>
							{/each}
						</div>
					</div>

					<div class="voting-section">
						<h4>Party Selection</h4>
						<p><strong>Vote for regional representation</strong></p>
						<p class="instruction">✓ SELECT ONE party for proportional representation</p>
						<p class="explanation-text">
							<strong>What this does:</strong> Your party vote determines the balance of seats in parliament.
							This ensures fair representation for your party.
						</p>

						<div class="ballot-example party-selection">
							{#each parties as party (party.id)}
								<div class="party-item">
									<label for={party.id}>
										<input type="radio" id={party.id} name="ams-party-select" class="party-radio" />
										<span class="candidate-name">{party.name}</span>
									</label>
								</div>
							{/each}
						</div>
					</div>
				</div>

				<h3 class="subsection-header">How It Works</h3>

				<div class="process-steps">
					{#each steps as step (step.number)}
						<StepCard number={step.number} title={step.title} description={step.description} />
					{/each}
				</div>
			{/snippet}

			{#snippet strengths()}
				<div class="implementation-frame">
					<div class="implementation-card">
						<p class="implementation-label">Best fit in UK reform politics</p>
						<h3>If Britain wanted proportionality without a giant leap</h3>
						<p>
							If Westminster reformers want a proposal that can speak to Labour, Liberal Democrat, Green,
							and softer constitutional audiences at the same time, AMS+ is the clearest approval-based fit.
							It reuses a structure voters in Scotland and Wales already know and changes the least while
							still delivering PR.
						</p>
					</div>
					<div class="implementation-grid">
						<div>
							<h4>What stays familiar</h4>
							<p>Single-member constituencies, regional top-up seats, and an assembly-wide proportional outcome.</p>
						</div>
						<div>
							<h4>What changes</h4>
							<p>The local vote becomes “approve all acceptable candidates,” removing the FPTP squeeze from the constituency tier.</p>
						</div>
						<div>
							<h4>Why it matters politically</h4>
							<p>It offers a Westminster PR package that feels evolutionary rather than institutionally alien.</p>
						</div>
					</div>
				</div>

				<h3 class="subsection-header">Why AMS+?</h3>

				<div class="benefits-grid">
					{#each benefits as benefit (benefit.title)}
						<BenefitCard emoji={benefit.emoji} title={benefit.title} description={benefit.description} />
					{/each}
				</div>
			{/snippet}

			{#snippet tradeoffs()}
				<h3 class="subsection-header">Two valid ways to build the list tier</h3>
				<p class="intro-text">
					Mixed systems do not all use the regional tier in the same way. Some use it to correct the failed
					proportionality of the constituency tier. Others simply add a fixed block of proportional seats on
					top. Both are real, valid design choices.
				</p>

				<div class="variant-toggle" role="tablist" aria-label="AMS variant choice">
					<button
						type="button"
						role="tab"
						id="ams-tab-compensatory"
						aria-selected={variant === 'compensatory'}
						aria-controls="ams-panel-compensatory"
						tabindex={variant === 'compensatory' ? 0 : -1}
						class:selected={variant === 'compensatory'}
						onclick={() => (variant = 'compensatory')}
					>
						Compensatory top-up
					</button>
					<button
						type="button"
						role="tab"
						id="ams-tab-parallel"
						aria-selected={variant === 'parallel'}
						aria-controls="ams-panel-parallel"
						tabindex={variant === 'parallel' ? 0 : -1}
						class:selected={variant === 'parallel'}
						onclick={() => (variant = 'parallel')}
					>
						Fixed parallel/add-on list tier
					</button>
				</div>

				<div
					class="variant-card"
					role="tabpanel"
					id="ams-panel-compensatory"
					aria-labelledby="ams-tab-compensatory"
					hidden={variant !== 'compensatory'}
				>
					<h4>Compensatory top-up (classic MMP / stronger AMS)</h4>
					<p>
						Here the regional seats are used to <strong>balance out the disproportionality</strong> created by the
						constituency results. If a party wins fewer constituency seats than its vote share deserves, it gets
						more list seats. If it wins many constituency seats already, it gets fewer or none.
					</p>
					<ul>
						<li>Best if the goal is chamber-wide proportionality</li>
						<li>Closest to German and New Zealand-style MMP logic</li>
						<li>The strongest fit for an approval-based “AMS+” if proportionality is the main goal</li>
					</ul>
				</div>

				<div
					class="variant-card"
					role="tabpanel"
					id="ams-panel-parallel"
					aria-labelledby="ams-tab-parallel"
					hidden={variant !== 'parallel'}
				>
					<h4>Fixed parallel / add-on list tier</h4>
					<p>
						Here the regional seats are allocated proportionally, but they do <strong>not fully compensate</strong>
						for the local tier. You keep a fixed number of constituency seats and a fixed number of list seats,
						then run both in parallel.
					</p>
					<ul>
						<li>Best if the goal is a mixed system that is more proportional without being fully compensatory</li>
						<li>Closer to the logic used in systems such as Japan’s parallel structure</li>
						<li>Still a valid approval-based design if reformers want a softer step away from FPTP</li>
					</ul>
				</div>

				<p class="variant-note">
					<strong>Bottom line:</strong> the approval innovation sits in the <em>local ballot</em>. Whether the list tier is
					fully compensatory or only partly balancing is a separate design choice.
				</p>

				<h3 class="subsection-header">Transition and Implementation</h3>

				<div class="implementation-grid detail-grid">
					<div class="detail-card">
						<h4>Stage 1: Westminster-ready PR model</h4>
						<p>
							Keep existing constituencies for the local tier, then add proportional regional correction
							seats using a standard allocation rule. This is institutionally close to systems the UK already
							administers.
						</p>
					</div>
					<div class="detail-card">
						<h4>Stage 2: Improve list design</h4>
						<p>
							Regional lists can stay simple at first, then become more voter-shaped over time through open
							lists or approval within party lists if reform coalitions want a second step.
						</p>
					</div>
					<div class="detail-card">
						<h4>Counting rule</h4>
						<p>
							Use a fair top-up formula such as <strong>Sainte-Laguë</strong> rather than defaulting to
							D'Hondt, because the UK is a multi-party system where small differences in divisor choice can
							matter.
						</p>
					</div>
				</div>
			{/snippet}

			{#snippet whereUsed()}
				<p>
					AMS isn't theoretical. Scotland has used it since 1999, and Wales did too from 1999 to 2021
					before moving to fuller proportional representation — between them, real-world proof that it
					works in practice.
				</p>

				<div class="benefits-grid">
					{#each foundationBenefits as benefit (benefit.title)}
						<BenefitCard emoji={benefit.emoji} title={benefit.title} description={benefit.description} />
					{/each}
				</div>
			{/snippet}

			{#snippet faq()}
				<div class="faq-section">
					<FAQItem question="Won't approval voting in constituencies be confusing?">
						<p>
							No. The instruction is simple: "Tick all candidates you'd be happy with." The winner is
							whoever gets the most approvals. Much clearer than ranking candidates.
						</p>
					</FAQItem>

					<FAQItem question="Won't this take longer to count?">
						<p>
							Approval voting is faster to count than ranking systems. You simply add up the ticks for
							each candidate—no complex transfers or calculations.
						</p>
					</FAQItem>

					<FAQItem question="How does approval voting stop tactical voting?">
						<p>
							With approval voting, you don't need to worry about "wasting" your vote. You vote honestly
							for all candidates you support. If your favourite doesn't win, your approval still helps
							others you chose.
						</p>
					</FAQItem>

					<FAQItem question="What if I only want to approve one candidate?">
						<p>
							That's fine. You can approve as few or as many candidates as you like—even just one.
							AMS+ gives you choice without forcing you to use it.
						</p>
					</FAQItem>

					<FAQItem question="What's the Difference Between AMS and MMP?">
						<p>
							<strong>AMS</strong> and <strong>MMP (Mixed Member Proportional)</strong> are closely related.
							Both use two votes, usually one for a local candidate and one for a party list. The labels vary
							by country and by how strongly the top-up tier restores proportionality, but the strategic case
							for AMS+ is the same: keep the mixed-member structure and improve the local ballot.
						</p>
					</FAQItem>

					<FAQItem question="How Does AMS+ Compare with STV?">
						<p>
							Both are defensible PR systems. STV gives voters more candidate ordering power inside
							<a href="/visualiser">multi-member districts</a>, while AMS+ keeps a clearer single-member local link and a simpler local
							ballot. The argument for AMS+ is not that STV is illegitimate, but that it is easier to explain,
							easier to count, and likely easier to assemble into a broad Westminster reform coalition.
						</p>
					</FAQItem>

					<FAQItem question="What happens on a tie?">
						<p>
							A tie could in principle arise in either ballot — the constituency approval count or the
							regional proportional allocation. The UK already has a rule for ties: under the
							<strong>Representation of the People Act 1983</strong>, the Returning Officer
							<strong>decides by lot</strong> — drawing straws, drawing names from a hat, a coin toss,
							or cutting cards (used as recently as a 2017 Northumberland council seat). AMS+ would
							apply the same rule to both ballots.
						</p>
						<p>
							At realistic scale (tens of thousands of ballots per constituency, fractional party
							weights), exact ties are statistically rare — and the British procedure for resolving
							them is already familiar and uncontroversial.
						</p>
					</FAQItem>
				</div>
			{/snippet}

			{#snippet bottomLine()}
				<p>
					AMS+ builds on 25+ years of proven mixed-member success — in Scotland still, in Wales until
					2021, and in Germany and New Zealand — but with two improvements: approval voting for
					constituency seats, and a top-up tier big enough to avoid the half-measure Wales outgrew. If
					the UK wants a credible near-term route
					to PR that still preserves familiar institutions, this is the strongest approval-based proposal.
				</p>
				<p>
					<strong>Remember:</strong> With AMS+, you're not forced to choose just one candidate—you approve
					all the candidates you trust.
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
	.detail-card h4,
	.implementation-grid h4 {
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

	.detail-grid {
		margin-top: 1rem;
	}

	.subsection-header {
		font-size: 1.4rem;
		color: var(--text-dark);
		margin: 1.5rem 0 1rem 0;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid var(--border-color);
	}

	.voting-guide {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 2rem;
		margin: 1rem 0;
		align-items: start;
	}

	.voting-section {
		background: var(--surface-subtle-gradient);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		box-shadow: var(--shadow-soft);
	}

	.voting-section h4 {
		margin-top: 0;
		color: var(--text-dark);
		font-size: 1.2rem;
		margin-bottom: 0.5rem;
	}

	.voting-section > p:first-of-type {
		margin: 0 0 0.5rem 0;
		font-weight: 600;
		color: var(--accent-text);
	}

	.instruction {
		color: var(--accent-text);
		font-weight: 600;
		font-size: 0.95rem;
		margin-bottom: 1rem;
	}

	.explanation-text {
		font-size: 0.9rem;
		color: var(--text-color);
		margin: 0 0 1rem 0;
		min-height: 5rem;
	}

	.ballot-example {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		flex-grow: 1;
	}

	.candidate-item,
	.party-item {
		background: var(--surface-color);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
		transition:
			border-color 0.2s ease,
			background-color 0.2s ease;
	}

	.candidate-item:hover,
	.party-item:hover {
		background: var(--field-hover);
		border-color: var(--border-strong);
	}

	.candidate-checkbox,
	.party-radio {
		width: 1.25rem;
		height: 1.25rem;
		cursor: pointer;
		flex-shrink: 0;
		accent-color: var(--header-bg);
	}

	.candidate-item label,
	.party-item label {
		cursor: pointer;
		margin: 0;
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

	.variant-toggle {
		display: inline-flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.variant-toggle button {
		border: 1px solid var(--border-color);
		background: var(--surface-panel);
		color: var(--text-dark);
		padding: 0.75rem 1rem;
		border-radius: 999px;
		font: inherit;
		font-weight: 600;
		cursor: pointer;
	}
	.variant-toggle button.selected {
		background: linear-gradient(180deg, var(--header-bg) 0%, var(--header-bg-strong) 100%);
		color: var(--text-inverse);
		border-color: transparent;
	}
	.variant-card,
	.variant-note {
		padding: 1.2rem 1.3rem;
		border-radius: var(--radius-md);
		border: 1px solid var(--border-color);
		background: var(--surface-raised);
		box-shadow: var(--shadow-soft);
	}
	.variant-card h4 {
		margin-top: 0;
	}
	.variant-card ul {
		margin: 0.8rem 0 0 0;
		padding-left: 1.25rem;
	}
	.variant-card li {
		margin-bottom: 0.5rem;
		line-height: 1.45;
	}
	.variant-note {
		background: var(--surface-subtle-gradient);
	}

	@media (max-width: 768px) {
		.voting-guide {
			grid-template-columns: 1fr;
		}

		.implementation-grid {
			grid-template-columns: 1fr;
		}

		.explanation-text {
			min-height: auto;
		}
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
