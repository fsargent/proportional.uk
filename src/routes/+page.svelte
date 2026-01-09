<script lang="ts">
	import { selectedSystem } from '$lib/stores/navigation';
	import ProblemSection from '$lib/components/ProblemSection.svelte';
	import RankingProblems from '$lib/components/RankingProblems.svelte';
	import RatingVsRanking from '$lib/components/RatingVsRanking.svelte';
	import SystemChoice from '$lib/components/SystemChoice.svelte';
	import AMSPlusSection from '$lib/components/AMSPlusSection.svelte';
	import ProportionalApprovalSection from '$lib/components/ProportionalApprovalSection.svelte';

	let currentChoice = $derived($selectedSystem);
</script>

<svelte:head>
	<title>Electoral Reform for the UK - Better Voting Systems</title>
	<meta
		name="description"
		content="Explore better voting systems for the UK: AMS+ and Proportional Approval. Fix Westminster's broken elections with approval voting."
	/>
</svelte:head>

<div class="hero-section">
	<h1>It's Time for Real Electoral Reform</h1>
	<p class="hero-subtitle">
		Westminster's voting system is broken. Millions of votes are wasted, seats don't match votes,
		and voters are forced to vote tactically. There are better ways.
	</p>
	<p class="hero-intro">
		This site explores two modern, approval-based voting systems that could transform UK
		democracy—without the complexity of ranked-choice voting.
	</p>
</div>

<!-- Section 1: The Problem -->
<ProblemSection />

<!-- Section 2: Why Ranking Isn't the Answer -->
<RankingProblems />

<!-- Section 3: Rating vs Ranking -->
<RatingVsRanking />

<!-- Section 4: Choose Your Path -->
<SystemChoice />

<!-- Section 5: System Details (conditional based on choice) -->
<div id="system-details" class="system-details">
	{#if currentChoice === 'ams-plus'}
		<AMSPlusSection />
	{:else if currentChoice === 'proportional-approval'}
		<ProportionalApprovalSection />
	{:else}
		<div class="no-selection-prompt">
			<p>
				<strong>↑ Select a system above to learn more</strong>
			</p>
		</div>
	{/if}
</div>

<!-- Call to Action -->
<section class="cta-section">
	<h2 class="section-header">Take Action</h2>

	<p>
		Electoral reform is possible. The UK already uses proportional systems for Scottish Parliament,
		Welsh Senedd, and London Assembly elections. It's time to bring fair voting to Westminster.
	</p>

	<div class="cta-grid">
		<a
			href="https://www.makevotesmatter.org.uk/"
			target="_blank"
			rel="noopener noreferrer"
			class="cta-card"
		>
			<div class="cta-icon">🗳️</div>
			<h3>Make Votes Matter</h3>
			<p>Join the campaign for proportional representation in UK elections</p>
		</a>

		<a
			href="https://www.electoral-reform.org.uk/"
			target="_blank"
			rel="noopener noreferrer"
			class="cta-card"
		>
			<div class="cta-icon">📊</div>
			<h3>Electoral Reform Society</h3>
			<p>Research, data, and advocacy for better voting systems</p>
		</a>

		<a
			href="https://electionscience.org/library/approval-voting/"
			target="_blank"
			rel="noopener noreferrer"
			class="cta-card"
		>
			<div class="cta-icon">🔬</div>
			<h3>Center for Election Science</h3>
			<p>Learn more about approval voting and voting method research</p>
		</a>
	</div>
</section>

<style>
	.hero-section {
		text-align: center;
		padding: 2rem 0 3rem 0;
		margin-bottom: 1rem;
	}

	.hero-section h1 {
		font-size: 2.75rem;
		font-weight: 700;
		color: #0b0c0c;
		margin-bottom: 1rem;
		line-height: 1.1;
	}

	.hero-subtitle {
		font-size: 1.3rem;
		color: #d4351c;
		font-weight: 600;
		max-width: 700px;
		margin: 0 auto 1rem auto;
		line-height: 1.4;
	}

	.hero-intro {
		font-size: 1.1rem;
		color: #555;
		max-width: 650px;
		margin: 0 auto;
		line-height: 1.6;
	}

	.system-details {
		min-height: 100px;
	}

	.no-selection-prompt {
		text-align: center;
		padding: 3rem 2rem;
		background: #f9f9f9;
		border: 2px dashed #ddd;
		border-radius: 8px;
		margin: 2rem 0;
	}

	.no-selection-prompt p {
		margin: 0;
		color: #666;
		font-size: 1.1rem;
	}

	.cta-section {
		margin: 4rem 0 2rem 0;
		padding-top: 2rem;
	}

	.cta-section > p {
		font-size: 1.1rem;
		line-height: 1.6;
		max-width: 700px;
		margin-bottom: 2rem;
	}

	.cta-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.5rem;
		margin: 2rem 0;
	}

	.cta-card {
		display: block;
		background: white;
		border: 2px solid #ddd;
		border-radius: 8px;
		padding: 1.5rem;
		text-decoration: none;
		transition: all 0.3s ease;
	}

	.cta-card:hover {
		border-color: #1d70b8;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		transform: translateY(-2px);
	}

	.cta-icon {
		font-size: 2.5rem;
		margin-bottom: 1rem;
	}

	.cta-card h3 {
		margin: 0 0 0.5rem 0;
		color: #1d70b8;
		font-size: 1.2rem;
	}

	.cta-card p {
		margin: 0;
		color: #555;
		font-size: 0.95rem;
		line-height: 1.5;
	}

	@media (max-width: 768px) {
		.hero-section h1 {
			font-size: 2rem;
		}

		.hero-subtitle {
			font-size: 1.1rem;
		}

		.hero-intro {
			font-size: 1rem;
		}

		.cta-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
