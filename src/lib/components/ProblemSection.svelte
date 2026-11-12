<script lang="ts">
	import BenefitCard from './BenefitCard.svelte';

	const problems = [
		{
			emoji: '📊',
			title: '14.8 million wasted votes',
			description:
				'In 2024, nearly 15 million votes had no effect on who won. In a safe seat, the result rarely depends on how you vote.'
		},
		{
			emoji: '⚖️',
			title: 'Seats and votes drift apart',
			description:
				'Labour won 63% of seats with 34% of the vote. Reform UK won 14% of the vote and 0.8% of seats.'
		},
		{
			emoji: '🗳️',
			title: 'Tactical voting',
			description:
				'Many voters back a second choice to keep out a candidate they dislike. Their real first choice does not show in the count.'
		},
		{
			emoji: '📍',
			title: 'Safe seats',
			description:
				'Most constituencies rarely change hands. Parties put most of their effort into a small number of marginal seats.'
		}
	];
</script>

<section class="problem-section">
	<h2 id="problem-title" class="section-header">How First Past the Post behaves today</h2>

	<p class="intro-text">
		Under <strong>First Past the Post (FPTP)</strong>, each voter marks one candidate. The candidate
		with the most votes in each constituency wins. When many parties compete, this rule has some
		predictable effects. Many votes elect nobody, seat shares drift from vote shares, safe seats get
		little attention, and some voters feel they must vote tactically.
	</p>
	<p class="intro-text">
		These effects share one cause: a one-mark ballot in a contest with many parties. The systems on
		this site change the ballot, the count, or both.
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
		background: var(--surface-raised);
		border: 1px solid var(--border-color);
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
		color: var(--text-dark);
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
		color: var(--text-soft);
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
