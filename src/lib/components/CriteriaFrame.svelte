<script lang="ts">
	const criteria = [
		{
			title: 'Fairness',
			description: 'Do seats track votes closely enough that large blocs are not over-rewarded and smaller blocs are not shut out?'
		},
		{
			title: 'Voter Power and Accountability',
			description: 'Can voters back people they genuinely support, and can elected representatives still be held to account by identifiable electorates?'
		},
		{
			title: 'Local Connection',
			description: 'Does the system preserve a credible constituency or regional link, using boundaries people can recognise and work with?'
		},
		{
			title: 'Simplicity',
			description: 'Can ordinary voters understand the ballot and can administrators count the result without opaque transfer rules?'
		},
		{
			title: 'Implementability',
			description: 'Could the UK actually legislate and run it, either as a near-term reform or as a clear next stage after proportionality is won?'
		}
	];
</script>

<section class="criteria-frame" aria-labelledby="criteria-frame-title">
	<div class="criteria-intro">
		<p class="kicker">Criteria for reform</p>
		<h2 id="criteria-frame-title" class="section-header">What matters in a good reform</h2>
		<p>
			Once you see the glitch, the obvious next question is: what should a better system actually do?
			A good reform has to clear a few tests at once. It should make seats fairer, give voters more
			real power, preserve a workable local link, stay legible on the ballot, and fit the politics of
			how reform could actually happen in the UK.
		</p>
	</div>

	<div class="criteria-grid">
		{#each criteria as criterion (criterion.title)}
			<article class="criterion-card">
				<h3>{criterion.title}</h3>
				<p>{criterion.description}</p>
			</article>
		{/each}
	</div>
</section>

<style>
	.criteria-frame {
		display: grid;
		gap: 1.5rem;
	}

	.criteria-intro {
		max-width: 54rem;
	}

	.kicker {
		display: inline-flex;
		margin: 0 0 0.9rem 0;
		padding: 0.38rem 0.75rem;
		border-radius: 999px;
		background: var(--surface-overlay);
		border: 1px solid var(--accent-border);
		color: var(--accent-text);
		font-size: 0.9rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.criteria-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1rem;
	}

	.criterion-card {
		padding: 1.25rem;
		border-radius: var(--radius-md);
		border: 1px solid var(--border-color);
		background: var(--surface-subtle-gradient);
		box-shadow: var(--shadow-soft);
	}

	.criterion-card h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.05rem;
	}

	.criterion-card p {
		margin: 0;
		font-size: 0.96rem;
	}
</style>
