<script lang="ts">
	import BenefitCard from './BenefitCard.svelte';
	import StepCard from './StepCard.svelte';
	import FAQItem from './FAQItem.svelte';

	const benefits = [
		{
			emoji: '🗳️',
			title: 'Simplest Change',
			description:
				'This is the smallest practical change from today’s Westminster elections: keep one MP per constituency, but let voters approve more than one candidate.'
		},
		{
			emoji: '🏛️',
			title: 'Keeps Local Representation',
			description:
				'Every constituency still elects one local MP, so the existing link between voters and a named representative stays in place.'
		},
		{
			emoji: '🎯',
			title: 'Less Tactical Voting',
			description:
				'You can support your real favourite and also approve acceptable backup candidates, instead of guessing who is the “least risky” option.'
		},
		{
			emoji: '🤝',
			title: 'Broader Winners',
			description:
				'Candidates who are acceptable to a wider group of voters are more likely to win than candidates who rely on a narrow but intense base.'
		}
	];

	const steps = [
		{
			number: 1,
			title: 'Mark Your Ballot',
			description: 'Tick every candidate you would be happy to see elected in your constituency.'
		},
		{
			number: 2,
			title: 'Count Approvals',
			description: 'Each tick counts as one approval for that candidate. There is no ranking or transfer.'
		},
		{
			number: 3,
			title: 'Elect One Winner',
			description: 'The candidate with the most approvals wins the constituency seat.'
		},
		{
			number: 4,
			title: 'Keep Local Accountability',
			description: 'Your area still has one MP, but that MP is chosen with broader support than under FPTP.'
		}
	];

	const candidates = [
		{ id: 'sw-1', name: 'Sarah Johnson', party: 'Labour Party' },
		{ id: 'sw-2', name: 'James Mitchell', party: 'Conservative Party' },
		{ id: 'sw-3', name: 'Emma Williams', party: 'Liberal Democrats' },
		{ id: 'sw-4', name: 'David Chen', party: 'Green Party' },
		{ id: 'sw-5', name: 'Aisha Patel', party: 'Independent' }
	];

	let selections = $state<Record<string, boolean>>({});
	const approvedCount = $derived(Object.values(selections).filter(Boolean).length);
</script>

<section class="single-winner-approval-section" id="single-winner-approval-details">
	<h2 class="section-header">Single-Winner Approval Voting</h2>

	<p class="intro-text">
		This is the smallest version of the idea. Keep one MP per constituency, keep the familiar map, but
		replace “pick one” with a simpler instruction: approve every candidate you would genuinely be happy
		to elect.
	</p>
	<p class="intro-text">
		It does not make Westminster proportional. What it does do is remove vote-splitting, reduce the
		tactical squeeze, and make it easier for broadly acceptable candidates to win.
	</p>

	<div class="implementation-frame">
		<div class="implementation-card">
			<p class="implementation-label">Fastest to implement</p>
			<h3>If Britain wanted the quickest ballot fix</h3>
			<p>
				This option keeps the current Westminster map, one-seat constituencies, and the basic count
				administration. That makes it the easiest approval reform to legislate and explain, even though
				it does not solve nationwide proportionality on its own.
			</p>
		</div>
	</div>

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
				<li>All ballots in the constituency are collected.</li>
				<li>Each candidate’s approvals are added up.</li>
				<li>The candidate with the highest total wins the seat.</li>
				<li>There are no eliminations, transfers, or ranking rules.</li>
			</ol>
			<p class="key-point">
				<strong>Key insight:</strong> You can support your favourite candidate without giving up the
				chance to back another acceptable option.
			</p>
		</div>
	</div>

	<h3 class="subsection-header">Why Consider It?</h3>

	<div class="benefits-grid">
		{#each benefits as benefit (benefit.title)}
			<BenefitCard emoji={benefit.emoji} title={benefit.title} description={benefit.description} />
		{/each}
	</div>

	<h3 class="subsection-header">How It Works</h3>

	<div class="process-steps">
		{#each steps as step (step.number)}
			<StepCard number={step.number} title={step.title} description={step.description} />
		{/each}
	</div>

	<h3 class="subsection-header">Common Questions</h3>

	<div class="faq-section">
		<FAQItem question="Can it still work well if it isn't proportional?">
			<p>
				Yes. Proportionality matters if the main goal is matching party seat shares, but Westminster
				also needs MPs who can command broad support and help write policy that works for the country
				as a whole. Approval voting solves vote-splitting, elects the candidate with the highest total
				approval, and rewards people who can win agreement from a wide range of voters.
			</p>
			<p>
				That means it can still deliver strong democratic representation, even without being
				proportional. In a Parliament elected this way, members would on average be there because many
				people could live with them, not because they dominated a narrow slice of the vote.
			</p>
		</FAQItem>

		<FAQItem question="What kind of winners does approval voting tend to produce?">
			<p>
				It tends to reward candidates with a broad base rather than a narrow but intense one. Because
				voters can approve several acceptable options, more candidates can run without splitting the
				vote, and highly polarising candidates have less built-in advantage.
			</p>
			<p>
				That is one reason many people see it as a strong Westminster option in its own right. It
				pushes candidates to build wide support across a constituency, which can mean more effective
				representatives and less leverage for fringe positions.
			</p>
		</FAQItem>

		<FAQItem question="Does approving more candidates hurt my favourite?">
			<p>
				No. Your approval for a backup candidate does not subtract anything from your favourite. Each
				approved candidate simply gets one approval from you.
			</p>
		</FAQItem>

		<FAQItem question="How is this different from FPTP?">
			<p>
				FPTP forces you to choose one candidate, even if two or three seem acceptable. Approval
				voting lets you support all acceptable options, which makes tactical voting less necessary and
				helps broader-consensus candidates win.
			</p>
		</FAQItem>

		<FAQItem question="Would this be hard for the UK to adopt?">
			<p>
				It is probably the easiest change to explain and administer because constituencies, one-seat
				results, and local accountability all stay the same. The main change is the instruction on the
				ballot: tick all candidates you approve of.
			</p>
		</FAQItem>
	</div>

	<div class="key-takeaway">
		<h3>🎯 The Bottom Line</h3>
		<p>
			Single-Winner Approval Voting is a viable Westminster system in its own right: simple to run,
			strong against vote-splitting, and well suited to electing broadly acceptable MPs.
		</p>
		<p>
			<strong>If the goal is effective local representation and sound policy:</strong> keep local MPs,
			change the ballot, and elect candidates who can command support well beyond a narrow base.
		</p>
	</div>
</section>

<style>
	.single-winner-approval-section {
		margin: 0;
		padding-top: 1rem;
	}

	.intro-text {
		font-size: 1.1rem;
		line-height: 1.7;
		max-width: 800px;
	}

	.implementation-frame {
		margin: 2rem 0 0;
		padding: 1.5rem;
		border-radius: var(--radius-lg);
		border: 1px solid var(--accent-border);
		background: var(--surface-info-gradient);
		box-shadow: var(--shadow-soft);
	}

	.implementation-card h3 {
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

	.implementation-card p:last-child {
		margin: 0;
	}

	.subsection-header {
		font-size: 1.4rem;
		color: var(--text-dark);
		margin: 2.5rem 0 1.5rem 0;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid var(--border-color);
	}

	.voting-demo {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		margin: 2rem 0;
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
		display: flex;
		align-items: center;
		padding: 0.75rem;
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
		margin-right: 1rem;
		cursor: pointer;
		accent-color: var(--header-bg);
	}

	.candidate-row label {
		cursor: pointer;
		width: 100%;
		display: flex;
		align-items: center;
		gap: 1rem;
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
		max-width: none;
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
		max-width: none;
	}

	@media (max-width: 768px) {
		.voting-demo {
			grid-template-columns: 1fr;
		}
	}
</style>
