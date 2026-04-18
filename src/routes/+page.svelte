<script lang="ts">
	import ProblemSection from '$lib/components/ProblemSection.svelte';
	import WhyThisSiteExists from '$lib/components/WhyThisSiteExists.svelte';
	import CriteriaFrame from '$lib/components/CriteriaFrame.svelte';
	import SystemFinder from '$lib/components/SystemFinder.svelte';
</script>

<svelte:head>
	<title>An Unconsidered Path for UK Electoral Reform</title>
	<meta
		name="description"
		content="Britain's reform debate has overlooked approval-based voting systems. This site maps the case for putting them on the table alongside the Single Transferable Vote, the Additional Member System, and list proportional representation."
	/>
</svelte:head>

<div class="hero-section">
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

	<section class="finder-embedded" aria-labelledby="finder-embedded-title">
		<h2 id="finder-embedded-title" class="section-header">Find the system that fits your priorities</h2>
		<p class="finder-intro">
			Answer a few questions about what matters to you — local MPs, ballot style, simplicity,
			fairness — and see which systems match.
		</p>
		<SystemFinder />
	</section>

	<section class="cta-section">
		<h2 class="section-header">What happens next</h2>

		<p>
			The point of this site is not to declare a winner. It is to make sure that when Britain next
			seriously considers electoral reform, the options on the table include approval-based systems
			— not because they are perfect, but because they have been overlooked and they deserve honest
			evaluation alongside the Single Transferable Vote, the Additional Member System, and list proportional representation.
		</p>
		<p>
			There is now a concrete way to push for that. Open Britain is calling for an independent
			National Commission on Electoral Reform — a formal, evidence-based review of how Britain
			elects its MPs. Over 10,000 people have already signed.
		</p>

		<a
			href="https://www.open-britain.co.uk/ncer"
			target="_blank"
			rel="noopener noreferrer"
			class="cta-primary"
		>
			<div class="cta-primary-content">
				<h3>Sign the petition for a National Commission on Electoral Reform</h3>
				<p>
					Parliament should establish an independent commission to assess whether First Past the Post
					is still fit for purpose — and if not, what should replace it. This is the single most
					useful thing you can do right now.
				</p>
				<span class="cta-primary-action">Sign the petition at open-britain.co.uk →</span>
			</div>
		</a>

		<p class="also-useful">Also worth your time:</p>

		<div class="cta-grid">
			<a
				href="https://www.makevotesmatter.org.uk/"
				target="_blank"
				rel="noopener noreferrer"
				class="cta-card"
			>
				<h3>Make Votes Matter</h3>
				<p>The main UK campaign for proportional representation. Building the coalition that makes reform politically unavoidable.</p>
			</a>

			<a
				href="https://www.electoral-reform.org.uk/"
				target="_blank"
				rel="noopener noreferrer"
				class="cta-card"
			>
				<h3>Electoral Reform Society</h3>
				<p>Research, events, and the institutional memory of a century of reform advocacy.</p>
			</a>

			<a
				href="https://www.writetothem.com/"
				target="_blank"
				rel="noopener noreferrer"
				class="cta-card"
			>
				<h3>Write to your MP</h3>
				<p>Ask them to support a commission on electoral reform that evaluates a genuinely wide range of systems.</p>
			</a>

			<a
				href="https://electionscience.org/"
				target="_blank"
				rel="noopener noreferrer"
				class="cta-card"
			>
				<h3>Center for Election Science</h3>
				<p>The US organisation behind real-world approval voting campaigns. Directly relevant research and experience.</p>
			</a>
		</div>
	</section>
</div>

<style>
	.hero-section {
		padding: 2.25rem 0 2.75rem 0;
		margin-bottom: 1.25rem;
	}

	.guided-flow {
		display: grid;
		gap: clamp(2.25rem, 4vw, 3.25rem);
	}

	.finder-intro {
		font-size: 1.1rem;
		line-height: 1.7;
		margin: 0 0 1.5rem 0;
		color: var(--text-color);
	}

	.hero-section h1 {
		margin-bottom: 1rem;
	}

	.hero-subtitle {
		font-size: clamp(1.2rem, 1.65vw, 1.5rem);
		color: var(--danger-color);
		font-weight: 600;
		margin: 0 0 1rem 0;
		line-height: 1.45;
	}

	.hero-intro {
		font-size: 1.1rem;
		color: var(--text-color);
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
		margin-bottom: 1.25rem;
	}

	.cta-primary {
		display: block;
		margin: 1.5rem 0;
		padding: 1.6rem;
		background: var(--surface-accent-gradient);
		border: 2px solid var(--accent-border-strong);
		border-radius: var(--radius-md);
		text-decoration: none;
		box-shadow: var(--shadow-soft);
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease,
			transform 0.2s ease;
	}

	.cta-primary:hover {
		border-color: var(--link-color);
		box-shadow: var(--shadow-strong);
		transform: translateY(-2px);
	}

	.cta-primary h3 {
		margin: 0 0 0.6rem 0;
		color: var(--accent-text);
		font-size: 1.25rem;
		line-height: 1.3;
	}

	.cta-primary p {
		margin: 0 0 1rem 0;
		color: var(--text-color);
		font-size: 1.05rem;
		line-height: 1.65;
	}

	.cta-primary-action {
		display: inline-block;
		color: var(--link-color);
		font-weight: 700;
		font-size: 1rem;
	}

	.cta-primary:focus-visible {
		outline-color: var(--focus-ring-soft);
	}

	.also-useful {
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-soft);
		margin: 2rem 0 0 0;
	}

	.cta-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1rem;
		margin: 1rem 0 0.75rem 0;
	}

	.cta-card {
		display: block;
		background: var(--surface-panel);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		padding: 1.25rem;
		text-decoration: none;
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease;
		box-shadow: var(--shadow-soft);
	}

	.cta-card:hover {
		border-color: var(--border-strong);
		box-shadow: var(--shadow-strong);
	}

	.cta-card h3 {
		margin: 0 0 0.4rem 0;
		color: var(--accent-text);
		font-size: 1.05rem;
	}

	.cta-card p {
		margin: 0;
		color: var(--text-color);
		font-size: 0.92rem;
		line-height: 1.55;
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
