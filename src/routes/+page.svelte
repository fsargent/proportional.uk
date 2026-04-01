<script lang="ts">
	import WhyThisSiteExists from '$lib/components/WhyThisSiteExists.svelte';
	import ProblemSection from '$lib/components/ProblemSection.svelte';
	import CriteriaFrame from '$lib/components/CriteriaFrame.svelte';
	import UKPRBridge from '$lib/components/UKPRBridge.svelte';
	import RankingProblems from '$lib/components/RankingProblems.svelte';
	import RatingVsRanking from '$lib/components/RatingVsRanking.svelte';
	import DistrictShapeSection from '$lib/components/DistrictShapeSection.svelte';
	import AllocationOverviewSection from '$lib/components/AllocationOverviewSection.svelte';
	import ComparisonMatrix from '$lib/components/ComparisonMatrix.svelte';
	import SystemChoice from '$lib/components/SystemChoice.svelte';
	import MMDVisualiserSection from '$lib/components/MMDVisualiserSection.svelte';
</script>

<svelte:head>
	<title>An Unconsidered Path for UK Electoral Reform</title>
	<meta
		name="description"
		content="Britain's reform debate has overlooked approval-based voting systems. This site maps the case for putting them on the table alongside STV, AMS, and list PR."
	/>
</svelte:head>

<div class="hero-section">
	<p class="hero-eyebrow">A better way to think about Westminster elections</p>
	<h1>Westminster keeps producing the same kind of mess</h1>
	<p class="hero-subtitle">
		Votes pile up where they change nothing. Parties obsess over a handful of marginals. Voters are
		pushed to choose tactically instead of honestly. That is not just bad luck. It is a ballot-design
		problem.
	</p>
	<p class="hero-intro">
		This site starts with that glitch, then works outward: why it happens, what a simpler ballot could
		do, and which reform paths make the most sense for the UK.
	</p>
</div>

<div class="guided-flow">
	<ProblemSection />

	<WhyThisSiteExists />

	<CriteriaFrame />

	<UKPRBridge />

	<RankingProblems />

	<RatingVsRanking />

	<DistrictShapeSection />

	<AllocationOverviewSection />

	<div class="decision-step">
		<ComparisonMatrix />

		<SystemChoice />
	</div>

	<MMDVisualiserSection />

	<section class="cta-section">
		<h2 class="section-header">What happens next</h2>

		<p>
			The point of this site is not to declare a winner. It is to make sure that when Britain next
			seriously considers electoral reform, the options on the table include approval-based systems
			— not because they are perfect, but because they have been overlooked and they deserve honest
			evaluation alongside STV, AMS, and list PR.
		</p>
		<p>
			If you think that matters, the most useful things you can do are practical:
		</p>

		<div class="cta-grid">
			<a
				href="https://www.makevotesmatter.org.uk/"
				target="_blank"
				rel="noopener noreferrer"
				class="cta-card"
			>
				<div class="cta-icon">🗳️</div>
				<h3>Join Make Votes Matter</h3>
				<p>The main UK campaign for proportional representation. They are building the coalition that makes reform politically unavoidable.</p>
			</a>

			<a
				href="https://www.electoral-reform.org.uk/"
				target="_blank"
				rel="noopener noreferrer"
				class="cta-card"
			>
				<div class="cta-icon">📚</div>
				<h3>Electoral Reform Society</h3>
				<p>Research, events, and the institutional memory of a century of reform advocacy. A good place to understand the landscape.</p>
			</a>

			<a
				href="https://www.writetothem.com/"
				target="_blank"
				rel="noopener noreferrer"
				class="cta-card"
			>
				<div class="cta-icon">✉️</div>
				<h3>Write to your MP</h3>
				<p>Ask them to support a serious commission on electoral reform — one that evaluates a genuinely wide range of systems, including approval-based options.</p>
			</a>

			<a
				href="https://electionscience.org/"
				target="_blank"
				rel="noopener noreferrer"
				class="cta-card"
			>
				<div class="cta-icon">🔬</div>
				<h3>Center for Election Science</h3>
				<p>The US organisation behind real-world approval voting campaigns. Their research and implementation experience is directly relevant.</p>
			</a>
		</div>
	</section>
</div>

<style>
	.hero-section {
		padding: 2.5rem 0 3.5rem 0;
		margin-bottom: 2rem;
		max-width: 48rem;
	}

	.guided-flow {
		display: grid;
		gap: clamp(4rem, 7vw, 5.5rem);
	}

	.decision-step {
		display: grid;
		gap: clamp(2rem, 4vw, 3rem);
	}

	.hero-eyebrow {
		display: inline-flex;
		align-items: center;
		padding: 0.45rem 0.8rem;
		margin: 0 0 1rem 0;
		border: 1px solid var(--accent-border);
		border-radius: 999px;
		background: var(--surface-overlay);
		color: var(--accent-text);
		font-size: 0.95rem;
		font-weight: 700;
		letter-spacing: 0.01em;
	}

	.hero-section h1 {
		margin-bottom: 1rem;
	}

	.hero-subtitle {
		font-size: clamp(1.2rem, 1.65vw, 1.5rem);
		color: var(--danger-color);
		font-weight: 600;
		max-width: 42rem;
		margin: 0 0 1rem 0;
		line-height: 1.45;
	}

	.hero-intro {
		font-size: 1.1rem;
		color: var(--text-color);
		max-width: 40rem;
		margin: 0;
		line-height: 1.7;
	}


	.cta-section {
		margin: 0;
		padding-top: 0.5rem;
	}

	.cta-section > p {
		font-size: 1.1rem;
		line-height: 1.7;
		max-width: 700px;
		margin-bottom: 2rem;
	}

	.cta-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.5rem;
		margin: 2rem 0 0.75rem 0;
	}

	.cta-card {
		display: block;
		background: var(--surface-panel);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		padding: 1.6rem;
		text-decoration: none;
		transition:
			border-color 0.22s ease,
			box-shadow 0.22s ease,
			transform 0.22s ease,
			background-color 0.22s ease;
		box-shadow: var(--shadow-soft);
	}

	.cta-card:hover {
		border-color: var(--border-strong);
		background: var(--surface-color);
		box-shadow: var(--shadow-strong);
		transform: translateY(-2px);
	}

	.cta-icon {
		font-size: 2.2rem;
		margin-bottom: 0.85rem;
	}

	.cta-card h3 {
		margin: 0 0 0.5rem 0;
		color: var(--accent-text);
		font-size: 1.2rem;
	}

	.cta-card p {
		margin: 0;
		color: var(--text-color);
		font-size: 0.95rem;
		line-height: 1.6;
	}

	.cta-card:focus-visible {
		outline-color: var(--focus-ring-soft);
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
