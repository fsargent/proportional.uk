<script lang="ts">
	// Component showing the difference between rating and ranking
</script>

<section class="rating-vs-ranking">
	<h2 class="section-header">A Simpler Way to Express Your Vote</h2>

	<p class="intro-text">
		Whether you want a mixed system or fully proportional, there's a choice about
		<em>how</em> voters mark their ballots. <strong>Approval voting</strong> offers a simpler alternative
		to both "pick one" (FPTP) and ranked-choice systems.
	</p>

	<div class="comparison-table">
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

		<div class="comparison-column ranking">
			<h3>Ranked-Choice Voting</h3>
			<div class="ballot-demo">
				<p class="ballot-instruction">Rank all candidates in order (1st, 2nd, 3rd...):</p>
				<div class="ballot-options">
					<div class="ballot-option">
						<span class="rank-box">1</span>
						<span>Candidate A</span>
					</div>
					<div class="ballot-option">
						<span class="rank-box">4</span>
						<span>Candidate B</span>
					</div>
					<div class="ballot-option">
						<span class="rank-box">?</span>
						<span>Candidate C</span>
					</div>
					<div class="ballot-option">
						<span class="rank-box">2</span>
						<span>Candidate D</span>
					</div>
					<div class="ballot-option">
						<span class="rank-box">3</span>
						<span>Candidate E</span>
					</div>
				</div>
			</div>
			<ul class="features neutral">
				<li>Expressive: full preference order</li>
				<li>Complex counting: multi-round elimination</li>
				<li>More errors: duplicate/skipped ranks</li>
				<li>Some strategy: ranking unfamiliar candidates</li>
				<li>Used in STV systems worldwide</li>
			</ul>
		</div>
	</div>

	<div class="research-note">
		<h4>Why We Prefer Approval</h4>
		<p>
			Both methods are improvements over FPTP's "pick one" restriction. But approval voting is
			easier for voters, faster to count, and has lower ballot spoilage rates. For most voters,
			the question isn't "who is my 7th choice?" but simply "who do I find acceptable?"
		</p>
		<p>
			<strong>The key insight:</strong> You don't need to rank to achieve proportionality. Approval
			voting can power both single-winner elections and proportional multi-winner systems.
		</p>
	</div>
</section>

<style>
	.rating-vs-ranking {
		margin: 3rem 0;
	}

	.intro-text {
		font-size: 1.1rem;
		line-height: 1.6;
		max-width: 800px;
		margin-bottom: 2rem;
	}

	.comparison-table {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		margin: 2rem 0;
	}

	.comparison-column {
		background: white;
		border: 2px solid #ddd;
		border-radius: 8px;
		padding: 1.5rem;
	}

	.comparison-column.rating {
		border-color: #00703c;
		background: linear-gradient(to bottom, #f0fff0 0%, white 100%);
	}

	.comparison-column.ranking {
		border-color: #1d70b8;
		background: linear-gradient(to bottom, #f0f8ff 0%, white 100%);
	}

	.comparison-column h3 {
		margin-top: 0;
		margin-bottom: 1rem;
	}

	.comparison-column.rating h3 {
		color: #00703c;
	}

	.comparison-column.ranking h3 {
		color: #1d70b8;
	}

	.ballot-demo {
		background: #f9f9f9;
		border: 1px solid #ddd;
		border-radius: 4px;
		padding: 1rem;
		margin-bottom: 1.5rem;
	}

	.ballot-instruction {
		font-size: 0.9rem;
		color: #555;
		margin-bottom: 0.75rem;
		font-style: italic;
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
		background: white;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 0.95rem;
	}

	.checkbox {
		width: 1.25rem;
		height: 1.25rem;
		border: 2px solid #555;
		border-radius: 3px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.75rem;
		font-weight: bold;
		color: white;
		flex-shrink: 0;
	}

	.ballot-option.checked .checkbox {
		background: #00703c;
		border-color: #00703c;
	}

	.rank-box {
		width: 1.5rem;
		height: 1.5rem;
		border: 2px solid #555;
		border-radius: 3px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.85rem;
		font-weight: bold;
		flex-shrink: 0;
		background: #f0f0f0;
	}

	.features {
		margin: 0;
		padding-left: 1.25rem;
	}

	.features li {
		margin-bottom: 0.5rem;
		line-height: 1.4;
		color: #00703c;
	}

	.features.neutral li {
		color: #1d70b8;
	}

	.research-note {
		margin-top: 2rem;
		padding: 1.5rem;
		background: #f5f5f5;
		border-radius: 8px;
	}

	.research-note h4 {
		margin-top: 0;
		margin-bottom: 0.75rem;
		color: #0b0c0c;
	}

	.research-note p {
		margin: 0 0 1rem 0;
		line-height: 1.6;
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
