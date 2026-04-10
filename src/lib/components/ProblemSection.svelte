<script lang="ts">
	import BenefitCard from './BenefitCard.svelte';

	const problems = [
		{
			emoji: '📊',
			title: '14.8 Million Wasted Votes',
			description:
				'In 2024, nearly 15 million votes had no impact on the result. If you live in a safe seat, your vote effectively does not count.'
		},
		{
			emoji: '⚖️',
			title: 'Seats Don\'t Match Votes',
			description:
				'Labour won 63% of seats with just 34% of votes. Reform UK got 14% of votes but only 0.8% of seats. This is not democracy.'
		},
		{
			emoji: '🎭',
			title: 'Forced Tactical Voting',
			description:
				'Millions vote against their true preference to "stop the other side". Voters should vote for who they want, not against who they fear.'
		},
		{
			emoji: '🏚️',
			title: 'Safe Seats = Ignored Voters',
			description:
				'Most constituencies never change hands. Parties focus all resources on marginal seats while ignoring everyone else.'
		}
	];
</script>

<section class="problem-section">
	<h2 class="section-header">The glitch in Westminster elections</h2>

	<p class="intro-text">
		The odd thing about <strong>First Past the Post (FPTP)</strong> is that it can make perfectly normal
		voter behaviour produce weird results. You can end up with millions of wasted votes, giant seat
		bonuses for one party, safe seats where almost nobody gets campaigned to, and constant pressure to
		vote against the side you fear rather than for the side you actually like.
	</p>
	<p class="intro-text">
		Those are not four separate problems. They are four symptoms of the same design choice: a ballot
		that lets each voter make just one mark in a multi-party democracy.
	</p>

	<div class="stat-highlight">
		<div class="stat-item">
			<span class="stat-number">34%</span>
			<span class="stat-label">Labour's vote share in 2024</span>
		</div>
		<div class="stat-arrow">→</div>
		<div class="stat-item">
			<span class="stat-number">63%</span>
			<span class="stat-label">of seats won</span>
		</div>
	</div>

	<div class="benefits-grid">
		{#each problems as problem (problem.title)}
			<BenefitCard emoji={problem.emoji} title={problem.title} description={problem.description} />
		{/each}
	</div>

	<div class="source-note">
		<p>
			Data from the 2024 General Election. For more on these issues, see
			<a href="https://www.makevotesmatter.org.uk/" target="_blank" rel="noopener noreferrer"
				>Make Votes Matter</a
			>
			and the
			<a href="https://www.electoral-reform.org.uk/" target="_blank" rel="noopener noreferrer"
				>Electoral Reform Society</a
			>.
		</p>
	</div>

</section>

<style>
	.problem-section {
		margin: 0;
	}

	.intro-text {
		font-size: 1.1rem;
		line-height: 1.7;
	}

	.benefits-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.stat-highlight {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 2rem;
		margin: 2.5rem 0;
		padding: 2rem;
		background: var(--surface-danger-gradient);
		border: 1px solid var(--danger-border);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-soft);
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.stat-number {
		font-size: 3rem;
		font-weight: 700;
		color: var(--danger-color);
		line-height: 1;
	}

	.stat-label {
		font-size: 0.95rem;
		color: var(--text-soft);
		text-align: center;
		max-width: 14rem;
		text-wrap: balance;
	}

	.stat-arrow {
		font-size: 2rem;
		color: var(--danger-color);
		font-weight: bold;
	}

	.source-note {
		margin-top: 2rem;
		padding: 1rem 1.5rem;
		background: var(--surface-subtle-gradient);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		font-size: 0.95rem;
	}

	.source-note p {
		margin: 0;
	}

	@media (max-width: 600px) {
		.benefits-grid {
			grid-template-columns: 1fr;
		}

		.stat-highlight {
			flex-direction: column;
			gap: 1rem;
			padding: 1.5rem;
		}

		.stat-arrow {
			transform: rotate(90deg);
		}

		.stat-number {
			font-size: 2.5rem;
		}
	}
</style>
