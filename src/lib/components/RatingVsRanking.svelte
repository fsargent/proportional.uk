<script lang="ts">
	// Component showing the difference between rating and ranking
</script>

<section class="rating-vs-ranking">
	<h2 class="section-header">A surprisingly simple ballot idea</h2>

	<p class="intro-text">
		Here is the whole idea. Instead of forcing voters to pick just one candidate, or rank everybody in
		order, you let them mark every candidate they would genuinely be happy to support.
	</p>
	<p class="intro-text">
		That is <strong>approval voting</strong>. It sounds almost too simple at first, but it turns out to be
		a useful building block for both local elections and proportional systems.
	</p>

	<div class="comparison-table single-column">
		<div class="comparison-column rating">
			<h3>✓ Approval Voting</h3>
			<div class="ballot-demo">
				<p class="ballot-instruction">Tick all candidates you approve of:</p>
				<div class="ballot-options">
					<div class="ballot-option checked">
						<span class="checkbox">✓</span>
						<span>Candidate A</span>
					</div>
					<div class="ballot-option checked">
						<span class="checkbox">✓</span>
						<span>Candidate B</span>
					</div>
					<div class="ballot-option">
						<span class="checkbox"></span>
						<span>Candidate C</span>
					</div>
					<div class="ballot-option checked">
						<span class="checkbox">✓</span>
						<span>Candidate D</span>
					</div>
					<div class="ballot-option">
						<span class="checkbox"></span>
						<span>Candidate E</span>
					</div>
				</div>
			</div>
			<ul class="features">
				<li>Simple: just tick the candidates you like</li>
				<li>Fast to count: add up ticks per candidate</li>
				<li>Low error rate: hard to spoil your ballot</li>
				<li>No strategy needed: vote honestly</li>
				<li>Finds consensus: winners have broad support</li>
			</ul>
		</div>
	</div>

	<div class="research-note">
		<h4>Why this matters</h4>
		<p>
			A lot of voters do not have a full ordered list in their heads. They may have one favourite, a few
			acceptable options, and a few they definitely do not want. Approval ballots fit that mental model
			better than either FPTP or long rankings.
		</p>
		<p>
			<strong>The useful twist:</strong> you do not need ranking to get beyond FPTP. Approval ballots can
			work in simple local elections, mixed systems, and fully proportional multi-member systems too.
		</p>
	</div>
</section>

<style>
	.rating-vs-ranking {
		margin: 0;
	}

	.intro-text {
		font-size: 1.1rem;
		line-height: 1.7;
		max-width: 800px;
		margin-bottom: 2rem;
	}

	.comparison-table {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		margin: 2rem 0;
	}

	.comparison-table.single-column {
		grid-template-columns: minmax(0, 760px);
	}

	.comparison-column {
		background: var(--surface-raised);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		padding: 1.5rem;
		box-shadow: var(--shadow-soft);
	}

	.comparison-column.rating {
		border-color: var(--success-border);
		background: linear-gradient(180deg, var(--success-tint) 0%, var(--surface-color) 100%);
	}

	.comparison-column h3 {
		margin-top: 0;
		margin-bottom: 1rem;
	}

	.comparison-column.rating h3 {
		color: var(--success-color);
	}

	.ballot-demo {
		background: var(--surface-emphasis);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
		padding: 1rem;
		margin-bottom: 1.5rem;
	}

	.ballot-instruction {
		font-size: 0.9rem;
		color: var(--text-soft);
		margin-bottom: 0.75rem;
		font-style: italic;
		max-width: none;
	}

	.ballot-options {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.ballot-option {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem;
		background: var(--surface-color);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
		font-size: 0.95rem;
	}

	.checkbox {
		width: 1.25rem;
		height: 1.25rem;
		border: 2px solid var(--border-strong);
		border-radius: 3px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.75rem;
		font-weight: bold;
		color: var(--text-inverse);
		flex-shrink: 0;
	}

	.ballot-option.checked .checkbox {
		background: var(--success-color);
		border-color: var(--success-color);
	}


	.features {
		margin: 0;
		padding-left: 1.25rem;
	}

	.features li {
		margin-bottom: 0.5rem;
		line-height: 1.4;
		color: var(--success-color);
	}


	.research-note {
		margin-top: 2rem;
		padding: 1.5rem;
		background: var(--surface-subtle-gradient);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
	}

	.research-note h4 {
		margin-top: 0;
		margin-bottom: 0.75rem;
		color: var(--text-dark);
	}

	.research-note p {
		margin: 0 0 1rem 0;
		line-height: 1.6;
		max-width: none;
	}

	.research-note p:last-child {
		margin-bottom: 0;
	}

	@media (max-width: 768px) {
		.comparison-table {
			grid-template-columns: 1fr;
		}
	}
</style>
