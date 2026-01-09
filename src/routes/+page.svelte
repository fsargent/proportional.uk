<script lang="ts">
	import BenefitCard from '$lib/components/BenefitCard.svelte';
	import StepCard from '$lib/components/StepCard.svelte';
	import ComparisonItem from '$lib/components/ComparisonItem.svelte';
	import FAQItem from '$lib/components/FAQItem.svelte';

	const benefits = [
		{
			emoji: '🗳️',
			title: 'Greater Expression',
			description:
				"Approve multiple candidates you trust to represent your constituency, rather than being forced into a single choice."
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
			description:
				'Final assembly reflects both local approval and proportional party support'
		}
	];

	const comparisons = [
		{
			title: 'Better than First Past the Post',
			items: [
				'Proportional overall results',
				'No wasted votes',
				'Every vote counts toward representation',
				'Eliminates tactical voting pressure'
			]
		},
		{
			title: 'Improves on Traditional AMS',
			items: [
				'More expressive constituency voting',
				'Reduces vote splitting',
				'Rewards consensus candidates',
				'Maintains familiar two-vote structure'
			]
		},
		{
			title: 'Real Democratic Choice',
			items: [
				'Support all acceptable candidates',
				'Honest preference expression',
				'Strong local-national balance',
				'Clear, understandable ballots'
			]
		}
	];

	const foundationBenefits = [
		{
			emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
			title: 'Scotland',
			description:
				'Scottish Parliament elections use AMS with 129 seats: 73 from constituencies (first-past-the-post) and 56 from regional lists (proportional). Voters are familiar with the two-vote system.'
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
				'Over 25 years of successful elections, high voter turnout, and stable coalition governments demonstrate AMS works. AMS+ simply improves it by giving voters more choice in their local vote.'
		}
	];

	const constituencyCandidates = [
		{ id: 'candidate-1', name: 'Sarah Johnson', party: 'Labour Party' },
		{ id: 'candidate-2', name: 'James Mitchell', party: 'Conservative Party' },
		{ id: 'candidate-3', name: 'Emma Williams', party: 'Liberal Democrats' },
		{ id: 'candidate-4', name: 'David Chen', party: 'Green Party' },
		{ id: 'candidate-5', name: 'Aisha Patel', party: 'Independent' }
	];

	const parties = [
		{ id: 'party-labour', name: 'Labour Party', party: '' },
		{ id: 'party-conservative', name: 'Conservative Party', party: '' },
		{ id: 'party-libdem', name: 'Liberal Democrats', party: '' },
		{ id: 'party-green', name: 'Green Party', party: '' },
		{ id: 'party-reform', name: 'Reform UK', party: '' }
	];

	const partyListCandidates = [
		{ id: 'list-1', name: 'Rebecca Foster', party: 'Selected Party' },
		{ id: 'list-2', name: 'Thomas Wright', party: 'Selected Party' },
		{ id: 'list-3', name: 'Priya Sharma', party: 'Selected Party' },
		{ id: 'list-4', name: "Michael O'Brien", party: 'Selected Party' },
		{ id: 'list-5', name: 'Lisa Martinez', party: 'Selected Party' }
	];

	let listSelections = $state<Record<string, boolean>>({});
</script>

<svelte:head>
	<title>AMS+ - Electoral Reform for the UK</title>
</svelte:head>

<h1>The Additional Member System Plus (AMS+)</h1>

<p>
	The <a
		href="https://en.wikipedia.org/wiki/Additional_member_system"
		target="_blank"
		rel="noopener noreferrer">Additional Member System</a
	>
	has been successfully used in Scotland and Wales since devolution. AMS+ is an improved version that
	keeps everything you know about AMS—two votes, proportional results, local representation—while making
	constituency voting more expressive through
	<a href="https://en.wikipedia.org/wiki/Approval_voting" target="_blank" rel="noopener noreferrer"
		>approval voting</a
	>.
</p>

<h2 class="section-header">Why AMS+?</h2>

<div class="benefits-grid">
	{#each benefits as benefit}
		<BenefitCard emoji={benefit.emoji} title={benefit.title} description={benefit.description} />
	{/each}
</div>

<h2 class="section-header">How You Vote</h2>

<div class="voting-guide">
	<div class="voting-section">
		<h3>Constituency Ballot</h3>
		<p><strong>Vote for your local representative</strong></p>
		<p class="instruction">✓ APPROVE as many candidates as you wish by marking their boxes</p>
		<p class="explanation-text">
			<strong>What this does:</strong> The candidate with the most approvals wins your local seat. You
			eliminate tactical voting pressure—support all candidates you trust, not just your "safest" choice.
		</p>

		<div class="ballot-example">
			{#each constituencyCandidates as candidate}
				<div class="candidate-item">
					<input type="checkbox" id={candidate.id} class="candidate-checkbox" />
					<label for={candidate.id}>
						<div class="candidate-name">{candidate.name}</div>
						<div class="candidate-party">{candidate.party}</div>
					</label>
				</div>
			{/each}
		</div>
	</div>

	<div class="voting-section">
		<h3>Party Selection</h3>
		<p><strong>Vote for regional representation</strong></p>
		<p class="instruction">✓ SELECT ONE party for proportional representation</p>
		<p class="explanation-text">
			<strong>What this does:</strong> Your party vote determines the balance of seats in parliament
			based on overall support. This ensures fair representation for your party.
		</p>

		<div class="ballot-example party-selection">
			{#each parties as party}
				<div class="party-item">
					<input type="radio" id={party.id} name="party-select" class="party-radio" />
					<label for={party.id}>{party.name}</label>
				</div>
			{/each}
		</div>
	</div>

	<div class="voting-section">
		<h3>Party List Approval</h3>
		<p><strong>Approve candidates from your chosen party</strong></p>
		<p class="instruction">✓ APPROVE as many candidates as you wish from this party's list</p>
		<p class="explanation-text">
			<strong>What this does:</strong> Optionally approve any party list candidates. The list will be
			ordered by voter approval, though the party chooses the final candidate order on the ballot.
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

<h2 class="section-header">How It Works</h2>

<div class="process-steps">
	{#each steps as step}
		<StepCard number={step.number} title={step.title} description={step.description} />
	{/each}
</div>

<h2 class="section-header">AMS+ vs Traditional Systems</h2>

<div class="comparison-section">
	{#each comparisons as comparison}
		<ComparisonItem title={comparison.title} items={comparison.items} />
	{/each}
</div>

<h2 class="section-header">The Foundation: AMS in Scotland and Wales</h2>

<p>
	The Additional Member System isn't theoretical. It's been successfully used for elections in
	Scotland and Wales since 1999, proving it works in practice across the UK.
</p>

<div class="benefits-grid">
	{#each foundationBenefits as benefit}
		<BenefitCard emoji={benefit.emoji} title={benefit.title} description={benefit.description} />
	{/each}
</div>

<h2 class="section-header">Common Questions</h2>

<div class="faq-section">
	<FAQItem question="Won't approval voting in constituencies be confusing?">
		<p>
			No. Voters already approve multiple candidates at local council elections. The instruction is
			simple: "Tick all candidates you'd be happy with." The winner is whoever gets the most
			approvals. Much clearer than ranking candidates or complex preference systems.
		</p>
	</FAQItem>

	<FAQItem question="Won't this take longer to count?">
		<p>
			<a
				href="https://en.wikipedia.org/wiki/Approval_voting"
				target="_blank"
				rel="noopener noreferrer">Approval voting</a
			>
			is faster to count than ranking systems. You simply add up the ticks for each candidate—no complex
			transfers or calculations. The party list results (already familiar from Scotland and Wales) also
			count quickly.
		</p>
	</FAQItem>

	<FAQItem question="How does approval voting stop tactical voting?">
		<p>
			With approval voting, you don't need to worry about "wasting" your vote by supporting a less
			popular candidate. You vote honestly for all candidates you support. If your favourite doesn't
			have enough support, your approval still goes to others you chose.
		</p>
	</FAQItem>

	<FAQItem question="What if I don't want to approve anyone?">
		<p>
			That's fine. You can approve as few or as many candidates as you like—even just one, if
			that's what you prefer. AMS+ gives you choice. Some voters might approve three candidates,
			others just one.
		</p>
	</FAQItem>

	<FAQItem question="Will this work across the whole UK?">
		<p>
			Yes. AMS already works across the UK with regional variations. AMS+ would work the same
			way—each region would have its own constituencies and list system, just like current Scottish
			and Welsh elections.
		</p>
	</FAQItem>

	<FAQItem question="Is this just proportional representation under a different name?">
		<p>
			No. AMS+ keeps the two-vote system where your local vote stays local and your party vote is
			used proportionally across the region. This balance between local accountability and
			proportional fairness is what makes it effective.
		</p>
	</FAQItem>

	<FAQItem question="What's the Difference Between AMS and MMP?">
		<p>
			<strong
				><a
					href="https://en.wikipedia.org/wiki/Additional_member_system"
					target="_blank"
					rel="noopener noreferrer">AMS (Additional Member System)</a
				></strong
			>
			and
			<strong
				><a
					href="https://en.wikipedia.org/wiki/Mixed-member_proportional_representation"
					target="_blank"
					rel="noopener noreferrer">MMP (Mixed Member Proportional)</a
				></strong
			>
			are related hybrid systems that combine local constituency representation with proportional party
			lists, but they differ in how proportionality is achieved:
		</p>
		<ul>
			<li>
				<strong>AMS:</strong> A system where voters have two separate votes - one for a constituency
				candidate and one for a party list. The list seats are allocated to "top-up" the constituency
				results to achieve proportionality.
			</li>
			<li>
				<strong>MMP:</strong> A system where voters have two votes - one for a constituency candidate
				and one for a party list. The list seats are allocated to achieve overall proportionality based
				on the party list vote.
			</li>
		</ul>
		<p>
			<strong>Both AMS and MMP Work Better with Approval Voting:</strong> Both systems can be improved
			by using approval voting rather than "choose one" for the constituency vote.
		</p>
	</FAQItem>

	<FAQItem question="What Apportionment Method Does AMS Use?">
		<p>
			The Additional Member System uses the <strong
				><a
					href="https://en.wikipedia.org/wiki/D%27Hondt_method"
					target="_blank"
					rel="noopener noreferrer">D'Hondt method</a
				></strong
			>
			for allocating party list seats. This method divides each party's vote total by a series of divisors
			(1, 2, 3, 4, 5...) to calculate quotients, and seats are allocated to the parties with the highest
			quotients.
		</p>
	</FAQItem>

	<FAQItem question="How Does AMS+ Compare with STV?">
		<p>
			<strong
				><a
					href="https://en.wikipedia.org/wiki/Single_transferable_vote"
					target="_blank"
					rel="noopener noreferrer">STV (Single Transferable Vote)</a
				></strong
			>
			is a proportional voting system that uses ranked choice voting in multi-member constituencies. Here's
			how AMS+ compares:
		</p>
		<ul>
			<li>
				<strong>Simplicity:</strong> AMS+ uses simple approval voting (tick all acceptable candidates)
				and a single party vote. STV requires voters to rank candidates in order of preference.
			</li>
			<li>
				<strong>Counting Speed:</strong> AMS+ results can be counted quickly on election night. STV
				requires complex transfer calculations that can take days.
			</li>
			<li>
				<strong>Local Representation:</strong> AMS+ maintains single-member constituencies for local
				accountability. STV uses larger multi-member constituencies.
			</li>
			<li>
				<strong>Proportionality:</strong> Both systems achieve proportional results, but AMS+ does so
				through a simpler mechanism.
			</li>
		</ul>
	</FAQItem>
</div>

<div class="key-takeaway">
	<h3>🎯 The Bottom Line</h3>
	<p>
		AMS+ builds on the proven success of the Additional Member System used in Scotland and Wales,
		but with a crucial improvement: approval voting for constituency seats. This combination
		delivers proportional representation with local accountability while giving voters genuine
		choice and expression.
	</p>
	<p>
		<strong>Remember:</strong> With AMS+, you're not forced to choose just one candidate—you approve
		all the candidates you trust, creating a more representative and responsive democracy.
	</p>
</div>

<style>
	.voting-section {
		background: #f9f9f9;
		border: 1px solid #ddd;
		border-radius: 8px;
		padding: 2rem;
		display: flex;
		flex-direction: column;
	}

	.voting-section h3 {
		margin-top: 0;
		color: #0b0c0c;
		font-size: 1.3rem;
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
		margin-bottom: 1.5rem;
	}

	.explanation-text {
		font-size: 0.95rem;
		color: #555;
		margin: 0.75rem 0 1.5rem 0;
		min-height: 7rem;
	}

	.ballot-example {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin: 1.5rem 0;
		flex-grow: 1;
	}

	.candidate-item,
	.party-item {
		display: flex;
		align-items: center;
		padding: 1rem;
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
	.party-radio {
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
		font-size: 0.9rem;
		color: #555;
	}

	@media (max-width: 768px) {
		.voting-section {
			padding: 1.5rem;
		}

		.explanation-text {
			min-height: auto;
		}
	}
</style>
