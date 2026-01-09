<script lang="ts">
	import { base } from '$app/paths';
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
	<h2 class="section-header">The Problem: Westminster Elections Are Broken</h2>

	<p class="intro-text">
		The UK uses <strong>First Past the Post (FPTP)</strong> for Westminster elections—a system designed
		in the 19th century for two-party politics. In a multi-party democracy, it produces results that
		don't reflect what voters actually want.
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
		{#each problems as problem}
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

	<div class="fptp-callout">
		<p class="fptp-callout-title">
			<strong>Want to see FPTP's problems in action?</strong>
		</p>
		<p class="fptp-callout-text">
			<a href="{base}/fptp-challenge" class="fptp-callout-link">Try the FPTP Challenge →</a>
			Test your intuition about vote shares vs. seat results.
		</p>
	</div>
</section>

<style>
	.problem-section {
		margin: 2rem 0;
	}

	.intro-text {
		font-size: 1.1rem;
		line-height: 1.6;
		max-width: 800px;
	}

	.stat-highlight {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 2rem;
		margin: 2.5rem 0;
		padding: 2rem;
		background: linear-gradient(135deg, #fff5f5 0%, #fef5f5 100%);
		border: 2px solid #d4351c;
		border-radius: 12px;
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
		color: #d4351c;
		line-height: 1;
	}

	.stat-label {
		font-size: 0.95rem;
		color: #555;
		text-align: center;
	}

	.stat-arrow {
		font-size: 2rem;
		color: #d4351c;
		font-weight: bold;
	}

	.source-note {
		margin-top: 2rem;
		padding: 1rem 1.5rem;
		background: #f5f5f5;
		border-radius: 4px;
		font-size: 0.95rem;
	}

	.source-note p {
		margin: 0;
	}

	@media (max-width: 600px) {
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
