<script lang="ts">
	import ProblemSection from '$lib/components/ProblemSection.svelte';
	import WhyThisSiteExists from '$lib/components/WhyThisSiteExists.svelte';
	import CriteriaFrame from '$lib/components/CriteriaFrame.svelte';
	import SystemFinder from '$lib/components/SystemFinder.svelte';
	import MethodNav from '$lib/components/MethodNav.svelte';
	import { METHODS } from '$lib/data/methods';

	const methods = Object.values(METHODS);

	const sections = [
		{ id: 'problem-title', label: 'How the current system behaves' },
		{ id: 'why-title', label: 'Why look at this now' },
		{ id: 'criteria-frame-title', label: 'How to compare systems' },
		{ id: 'finder-embedded-title', label: 'Find a system for your priorities' },
		{ id: 'next-title', label: 'What happens next' }
	];
</script>

<svelte:head>
	<title>Proportional.uk: how else could the UK elect its MPs?</title>
	<meta
		name="description"
		content="A guide to the voting systems the UK could use for Westminster. See how each ballot works, how the votes are counted, and what each system trades off."
	/>
</svelte:head>

<div class="home-layout">
	<div class="home-main">
		<div class="hero-section">
			<h1>How else could the UK elect its MPs?</h1>
			<p class="hero-subtitle">
				A guide to the voting systems Britain could use, and what each one would change.
			</p>
			<p class="hero-intro">
				Each method page shows the ballot, explains the count, and sets out the trade-offs. Go
				straight to a method, or read on for the wider picture. The site gives extra space to
				approval-based systems, because UK reform debates have rarely looked at them.
			</p>

			<nav class="jump-methods" aria-label="Go straight to a method">
				<p class="jump-label">Go straight to a method</p>
				<ul>
					{#each methods as m (m.id)}
						<li>
							<a href={m.route} class="jump-chip family-{m.family}">{m.name}</a>
						</li>
					{/each}
				</ul>
				<p class="jump-finder">
					Not sure where to start? <a href="#finder-embedded-title">Use the system finder</a>.
				</p>
			</nav>
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
				<h2 id="next-title" class="section-header">What happens next</h2>

				<p>
					A national commission on electoral reform is on the way. One of its first tasks will be to
					decide which systems to look at. This site aims to help with that work.
				</p>
				<p>
					The site does not declare a winner. It sets out each option plainly, so that the
					commission, and the public, can compare the Single Transferable Vote, the Additional Member
					System, list proportional representation, and approval-based systems on the same terms.
				</p>

				<p class="also-useful">If you want to get involved:</p>

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
						<p>Ask them to make sure the commission looks at a wide range of systems, including approval-based ones.</p>
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
	</div>

	<aside class="home-rail" aria-label="Site navigation">
		<div class="rail-inner">
			<p class="rail-label">Jump to a method</p>
			<MethodNav showHome={false} />

			<nav class="on-this-page" aria-label="On this page">
				<p class="rail-label">On this page</p>
				<ul>
					{#each sections as section (section.id)}
						<li><a href="#{section.id}">{section.label}</a></li>
					{/each}
				</ul>
			</nav>
		</div>
	</aside>
</div>

<style>
	.home-layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		max-width: 54rem;
		margin: 0 auto;
	}

	.home-main {
		min-width: 0;
	}

	.home-rail {
		display: none;
	}

	/* At wide viewports, put the methods rail beside the reading column so
	   readers can see the methods without scrolling the whole page. */
	@media (min-width: 1100px) {
		.home-layout {
			grid-template-columns: minmax(0, 54rem) 15rem;
			gap: 2.5rem;
			max-width: none;
		}

		.home-rail {
			display: block;
		}

		.rail-inner {
			position: sticky;
			top: 1rem;
			max-height: calc(100vh - 2rem);
			overflow-y: auto;
			display: grid;
			gap: 0.6rem;
			padding-bottom: 1rem;
		}

		.jump-methods {
			display: none;
		}
	}

	.rail-label {
		margin: 0;
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: var(--text-soft);
	}

	.on-this-page {
		margin-top: 0.75rem;
		display: grid;
		gap: 0.4rem;
	}

	.on-this-page ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.25rem;
	}

	.on-this-page a {
		font-size: 0.88rem;
		color: var(--link-color);
		text-decoration: none;
	}

	.on-this-page a:hover {
		text-decoration: underline;
	}

	.content :global(h2[id]) {
		scroll-margin-top: 1rem;
	}

	.hero-section {
		padding: 2.25rem 0 2.75rem 0;
		margin-bottom: 1.25rem;
	}

	.jump-methods {
		margin-top: 1.75rem;
		padding: 1.1rem 1.25rem;
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		background: var(--surface-raised);
	}

	.jump-label {
		margin: 0 0 0.75rem 0;
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: var(--text-soft);
	}

	.jump-methods ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.jump-chip {
		display: inline-block;
		padding: 0.4rem 0.75rem;
		border: 1px solid var(--border-color);
		border-left: 4px solid var(--border-strong);
		border-radius: var(--radius-sm);
		background: var(--surface-color);
		color: var(--link-color);
		font-size: 0.92rem;
		font-weight: 600;
		text-decoration: none;
	}

	.jump-chip:hover {
		background: var(--surface-emphasis);
	}

	.jump-chip.family-approval {
		border-left-color: var(--family-approval);
	}
	.jump-chip.family-mixed {
		border-left-color: var(--family-mixed);
	}
	.jump-chip.family-ranked {
		border-left-color: var(--family-ranked);
	}
	.jump-chip.family-single-mark {
		border-left-color: var(--family-single-mark);
	}

	.jump-methods .jump-finder {
		margin: 0.85rem 0 0 0;
		font-size: 0.95rem;
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
		color: var(--text-dark);
		font-weight: 500;
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
