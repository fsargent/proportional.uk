<script lang="ts">
	import BenefitCard from './BenefitCard.svelte';
	import StepCard from './StepCard.svelte';
	import FAQItem from './FAQItem.svelte';

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
			title: 'Fast Counting',
			description:
				'Results on election night. Just add up approvals for each candidate—no multi-round elimination.'
		},
		{
			emoji: '🎯',
			title: 'Consensus Winners',
			description:
				'Candidates with broad support get elected. Divisive candidates who appeal only to their base lose to those with wider appeal.'
		},
		{
			emoji: '🗳️',
			title: 'No Wasted Votes',
			description:
				'Every approval counts toward electing someone. No more voting in safe seats where your vote changes nothing.'
		},
		{
			emoji: '🤝',
			title: 'Honest Voting',
			description:
				"No need for tactical voting. Approve all candidates you genuinely like—you can't hurt your favourites by also approving others."
		}
	];

	const steps = [
		{
			number: 1,
			title: 'Cast Your Ballot',
			description: 'Approve (tick) any candidates you find acceptable from the full list'
		},
		{
			number: 2,
			title: 'Count All Approvals',
			description: 'Each candidate receives a count of their total approvals'
		},
		{
			number: 3,
			title: 'Elect Sequentially',
			description:
				'The candidate with most approvals wins a seat. Voters who elected them have reduced weight for the next round.'
		},
		{
			number: 4,
			title: 'Repeat Until Full',
			description: 'Continue until all seats are filled, ensuring proportional representation'
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
</script>

<section class="proportional-approval-section" id="proportional-approval-details">
	<h2 class="section-header">Proportional Approval Voting</h2>

	<p class="intro-text">
		<strong>Proportional Approval</strong> (technically: Sequential Proportional Approval Voting) is
		a fully proportional system that uses approval voting to elect multiple candidates. It's simple,
		fast, and produces genuinely proportional results.
	</p>

	<h3 class="subsection-header">Why Proportional Approval?</h3>

	<div class="benefits-grid">
		{#each benefits as benefit}
			<BenefitCard emoji={benefit.emoji} title={benefit.title} description={benefit.description} />
		{/each}
	</div>

	<h3 class="subsection-header">How You Vote</h3>

	<div class="voting-demo">
		<div class="ballot-panel">
			<h4>Your Ballot</h4>
			<p class="ballot-instruction">Tick all candidates you approve of:</p>

			<div class="candidate-list">
				{#each candidates as candidate}
					<div class="candidate-row">
						<input
							type="checkbox"
							id={candidate.id}
							class="candidate-checkbox"
							bind:checked={selections[candidate.id]}
						/>
						<label for={candidate.id}>
							<span class="candidate-name">{candidate.name}</span>
							<span class="candidate-party">{candidate.party}</span>
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
				<li>All ballots are collected and approvals counted</li>
				<li>The candidate with the most approvals wins the first seat</li>
				<li>
					Voters who helped elect that candidate have their ballot weight reduced (so they don't
					dominate all seats)
				</li>
				<li>The next most-approved candidate (by reweighted count) wins the next seat</li>
				<li>This continues until all seats are filled</li>
			</ol>
			<p class="key-point">
				<strong>Key insight:</strong> By reducing the weight of "already represented" voters, the system
				ensures that different groups of voters each get proportional representation.
			</p>
		</div>
	</div>

	<h3 class="subsection-header">How It Works</h3>

	<div class="process-steps">
		{#each steps as step}
			<StepCard number={step.number} title={step.title} description={step.description} />
		{/each}
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

	<h3 class="subsection-header">Common Questions</h3>

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
				No. This is a key advantage of approval voting. Approving additional candidates never
				reduces the chances of your favourite winning. You can approve your first choice AND
				several backup choices without any downside.
			</p>
		</FAQItem>

		<FAQItem question="How is this different from STV?">
			<p>
				Both are proportional multi-winner systems, but they differ fundamentally:
			</p>
			<ul>
				<li>
					<strong>STV:</strong> You rank candidates. Votes transfer based on elimination order. Complex
					counting takes days.
				</li>
				<li>
					<strong>Proportional Approval:</strong> You approve candidates. Votes are reweighted after
					each seat. Simple counting gives results quickly.
				</li>
			</ul>
			<p>
				Proportional Approval avoids STV's non-monotonicity problems and is much simpler to
				understand and count.
			</p>
		</FAQItem>

		<FAQItem question="Where is this used?">
			<p>
				Variations of proportional approval voting are used in some professional associations and
				organizational elections. Sweden uses a form of approval voting for some elections. The
				system is gaining academic and reform advocacy attention as a simpler alternative to STV.
			</p>
		</FAQItem>
	</div>

	<div class="key-takeaway">
		<h3>🎯 The Bottom Line</h3>
		<p>
			Proportional Approval gives you the simplicity of approval voting with the fairness of
			proportional representation. No complex rankings, no strategic voting, no wasted votes.
		</p>
		<p>
			<strong>Your job is simple:</strong> tick all the candidates you'd be happy to have represent you.
			The system does the rest.
		</p>
	</div>
</section>

<style>
	.proportional-approval-section {
		margin: 3rem 0;
		padding-top: 1rem;
	}

	.intro-text {
		font-size: 1.1rem;
		line-height: 1.6;
		max-width: 800px;
	}

	.subsection-header {
		font-size: 1.4rem;
		color: #0b0c0c;
		margin: 2.5rem 0 1.5rem 0;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid #ddd;
	}

	.voting-demo {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		margin: 2rem 0;
	}

	.ballot-panel {
		background: #f9f9f9;
		border: 2px solid #ddd;
		border-radius: 8px;
		padding: 1.5rem;
	}

	.ballot-panel h4 {
		margin-top: 0;
		margin-bottom: 0.5rem;
		color: #0b0c0c;
	}

	.ballot-instruction {
		color: #1d70b8;
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
		background: white;
		border: 1px solid #ddd;
		border-radius: 4px;
		transition: all 0.2s ease;
	}

	.candidate-row:hover {
		background: #f0f8f0;
		border-color: #1d70b8;
	}

	.candidate-checkbox {
		width: 1.25rem;
		height: 1.25rem;
		margin-right: 1rem;
		cursor: pointer;
	}

	.candidate-row label {
		cursor: pointer;
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.candidate-name {
		font-weight: 600;
		color: #0b0c0c;
	}

	.candidate-party {
		font-size: 0.85rem;
		color: #666;
	}

	.ballot-summary {
		margin-top: 1rem;
		padding: 1rem;
		background: white;
		border-radius: 4px;
		text-align: center;
	}

	.ballot-summary p {
		margin: 0;
		color: #555;
	}

	.explanation-panel {
		background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
		border: 2px solid #1d70b8;
		border-radius: 8px;
		padding: 1.5rem;
	}

	.explanation-panel h4 {
		margin-top: 0;
		color: #1d70b8;
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
		background: white;
		border-radius: 4px;
		font-size: 0.95rem;
	}

	.reweighting-explainer {
		margin: 2rem 0;
		padding: 2rem;
		background: #f5f5f5;
		border-radius: 8px;
	}

	.reweighting-explainer h4 {
		margin-top: 0;
		color: #0b0c0c;
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
	}
</style>
