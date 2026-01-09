<script lang="ts">
	import BenefitCard from './BenefitCard.svelte';
	import StepCard from './StepCard.svelte';
	import FAQItem from './FAQItem.svelte';

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
				"Support your favorite candidates without worrying about splitting the vote or letting your least-preferred candidate win."
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
				'Builds on the proven AMS system already used in Scotland and Wales with minimal disruption.'
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
				'Scottish Parliament elections use AMS with 129 seats: 73 from constituencies and 56 from regional lists. Voters are familiar with the two-vote system.'
		},
		{
			emoji: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
			title: 'Wales',
			description:
				"Welsh Senedd elections use the same AMS system with 60 seats: 40 from constituencies and 20 from regional lists. It's been delivering proportional representation for over two decades."
		},
		{
			emoji: '✅',
			title: 'Proven Track Record',
			description:
				'Over 25 years of successful elections demonstrate AMS works. AMS+ simply improves it by using approval voting for the local vote.'
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

	const partyListCandidates = [
		{ id: 'ams-list-1', name: 'Rebecca Foster', party: 'Selected Party' },
		{ id: 'ams-list-2', name: 'Thomas Wright', party: 'Selected Party' },
		{ id: 'ams-list-3', name: 'Priya Sharma', party: 'Selected Party' },
		{ id: 'ams-list-4', name: "Michael O'Brien", party: 'Selected Party' },
		{ id: 'ams-list-5', name: 'Lisa Martinez', party: 'Selected Party' }
	];

	let candidateSelections = $state<Record<string, boolean>>({});
	let listSelections = $state<Record<string, boolean>>({});
</script>

<section class="ams-plus-section" id="ams-plus-details">
	<h2 class="section-header">The Additional Member System Plus (AMS+)</h2>

	<p class="intro-text">
		AMS+ takes the proven
		<a
			href="https://en.wikipedia.org/wiki/Additional_member_system"
			target="_blank"
			rel="noopener noreferrer">Additional Member System</a
		>
		used in Scotland and Wales, and improves it by replacing "pick one" constituency voting with
		<a href="https://en.wikipedia.org/wiki/Approval_voting" target="_blank" rel="noopener noreferrer"
			>approval voting</a
		>. You get the best of both worlds: local representation and proportional results.
	</p>

	<h3 class="subsection-header">Why AMS+?</h3>

	<div class="benefits-grid">
		{#each benefits as benefit}
			<BenefitCard emoji={benefit.emoji} title={benefit.title} description={benefit.description} />
		{/each}
	</div>

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
				{#each constituencyCandidates as candidate}
					<div class="candidate-item">
						<input
							type="checkbox"
							id={candidate.id}
							class="candidate-checkbox"
							bind:checked={candidateSelections[candidate.id]}
						/>
						<label for={candidate.id}>
							<div class="candidate-name">{candidate.name}</div>
							<div class="candidate-party">{candidate.party}</div>
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
				{#each parties as party}
					<div class="party-item">
						<input type="radio" id={party.id} name="ams-party-select" class="party-radio" />
						<label for={party.id}>{party.name}</label>
					</div>
				{/each}
			</div>
		</div>

		<div class="voting-section">
			<h4>Party List Approval</h4>
			<p><strong>Approve candidates from your chosen party</strong></p>
			<p class="instruction">✓ APPROVE as many candidates as you wish from this party's list</p>
			<p class="explanation-text">
				<strong>What this does:</strong> Optionally approve party list candidates. The list order will
				reflect voter approval.
			</p>

			<div class="list-example">
				{#each partyListCandidates as candidate}
					<div class="list-item">
						<div class="list-info">
							<input
								type="checkbox"
								id={candidate.id}
								class="list-checkbox"
								bind:checked={listSelections[candidate.id]}
							/>
							<label for={candidate.id}>
								<div class="candidate-name">{candidate.name}</div>
								<div class="candidate-party">{candidate.party}</div>
							</label>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<h3 class="subsection-header">How It Works</h3>

	<div class="process-steps">
		{#each steps as step}
			<StepCard number={step.number} title={step.title} description={step.description} />
		{/each}
	</div>

	<h3 class="subsection-header">The Foundation: AMS in Scotland and Wales</h3>

	<p>
		AMS isn't theoretical. It's been successfully used for elections in Scotland and Wales since
		1999, proving it works in practice.
	</p>

	<div class="benefits-grid">
		{#each foundationBenefits as benefit}
			<BenefitCard emoji={benefit.emoji} title={benefit.title} description={benefit.description} />
		{/each}
	</div>

	<h3 class="subsection-header">Common Questions</h3>

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
				Both use two votes—one for a local candidate, one for a party list. The main difference is how
				proportionality is calculated, but both work better with approval voting for the local seat.
			</p>
		</FAQItem>

		<FAQItem question="How Does AMS+ Compare with STV?">
			<p>
				AMS+ uses simple approval voting (tick all acceptable candidates) and maintains
				single-member constituencies. STV requires ranking candidates and uses larger multi-member
				constituencies. AMS+ is simpler to vote, faster to count, and preserves the local MP link.
			</p>
		</FAQItem>
	</div>

	<div class="key-takeaway">
		<h3>🎯 The Bottom Line</h3>
		<p>
			AMS+ builds on 25+ years of proven success in Scotland and Wales, but with a crucial
			improvement: approval voting for constituency seats. You get local representation AND
			proportional results.
		</p>
		<p>
			<strong>Remember:</strong> With AMS+, you're not forced to choose just one candidate—you approve
			all the candidates you trust.
		</p>
	</div>
</section>

<style>
	.ams-plus-section {
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

	.voting-guide {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 2rem;
		margin: 2rem 0;
		align-items: start;
	}

	.voting-section {
		background: #f9f9f9;
		border: 1px solid #ddd;
		border-radius: 8px;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
	}

	.voting-section h4 {
		margin-top: 0;
		color: #0b0c0c;
		font-size: 1.2rem;
		margin-bottom: 0.5rem;
	}

	.voting-section > p:first-of-type {
		margin: 0 0 0.5rem 0;
		font-weight: 600;
		color: #1d70b8;
	}

	.instruction {
		color: #1d70b8;
		font-weight: 600;
		font-size: 0.95rem;
		margin-bottom: 1rem;
	}

	.explanation-text {
		font-size: 0.9rem;
		color: #555;
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
		display: flex;
		align-items: center;
		padding: 0.75rem;
		background: white;
		border: 1px solid #ddd;
		border-radius: 4px;
		transition: all 0.2s ease;
	}

	.candidate-item:hover,
	.party-item:hover {
		background: #f0f8f0;
		border-color: #1d70b8;
	}

	.candidate-checkbox,
	.party-radio,
	.list-checkbox {
		width: 1.25rem;
		height: 1.25rem;
		margin-right: 1rem;
		cursor: pointer;
		flex-shrink: 0;
	}

	.candidate-item label,
	.party-item label {
		cursor: pointer;
		flex: 1;
		margin: 0;
	}

	.candidate-name {
		font-weight: 600;
		color: #0b0c0c;
	}

	.candidate-party {
		font-size: 0.85rem;
		color: #555;
	}

	.list-example {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		background: white;
		border: 1px solid #ddd;
		border-radius: 8px;
		padding: 1rem;
		flex-grow: 1;
	}

	.list-item {
		display: flex;
		align-items: center;
		padding: 0.5rem 0;
		border-bottom: 1px solid #eee;
	}

	.list-item:last-child {
		border-bottom: none;
	}

	.list-info {
		display: flex;
		align-items: center;
		flex: 1;
		gap: 1rem;
	}

	.list-item label {
		cursor: pointer;
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	@media (max-width: 768px) {
		.voting-guide {
			grid-template-columns: 1fr;
		}

		.explanation-text {
			min-height: auto;
		}
	}
</style>
