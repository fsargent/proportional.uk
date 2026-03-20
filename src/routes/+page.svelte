<script lang="ts">
	import { tick } from 'svelte';
	import { readingMode, selectedSystem, type ReadingMode } from '$lib/stores/navigation';
	import ProblemSection from '$lib/components/ProblemSection.svelte';
	import RankingProblems from '$lib/components/RankingProblems.svelte';
	import RatingVsRanking from '$lib/components/RatingVsRanking.svelte';
	import SystemChoice from '$lib/components/SystemChoice.svelte';
	import SingleWinnerApprovalSection from '$lib/components/SingleWinnerApprovalSection.svelte';
	import AMSPlusSection from '$lib/components/AMSPlusSection.svelte';
	import ProportionalApprovalSection from '$lib/components/ProportionalApprovalSection.svelte';

	const pagerSteps = [
		{
			title: 'The Problem',
			summary: 'Start with why Westminster elections feel distorted under FPTP.'
		},
		{
			title: 'Why Ranking Falls Short',
			summary: 'See why common ranked or legacy proposals still leave avoidable friction.'
		},
		{
			title: 'A Simpler Ballot',
			summary: 'Understand why approval voting is easier to use than ranking.'
		},
		{
			title: 'Choose Your Path',
			summary: 'Compare the three approval-based options before going deeper.'
		},
		{
			title: 'See It In Practice',
			summary: 'Look closely at the system you selected and how the ballot would work.'
		},
		{
			title: 'Take Action',
			summary: 'Finish with useful organisations and practical next steps.'
		}
	] as const;

	let currentChoice = $derived($selectedSystem);
	let currentStepIndex = $state(0);
	let pagerShell = $state<HTMLElement | null>(null);
	let previousReadingMode: ReadingMode = 'pager';

	const currentStep = $derived(pagerSteps[currentStepIndex]);
	const canGoNext = $derived(
		currentStepIndex < pagerSteps.length - 1 && (currentStepIndex !== 3 || currentChoice !== null)
	);
	const nextLabel = $derived(
		currentStepIndex === pagerSteps.length - 1
			? 'End of Walkthrough'
			: currentStepIndex === 3
				? currentChoice
					? 'Continue to Selected System'
					: 'Choose a System First'
				: currentStepIndex === 4
					? 'Next: Take Action'
					: 'Next'
	);
	const selectedSystemLabel = $derived(
		currentChoice === 'proportional-approval'
			? 'Proportional Approval'
			: currentChoice === 'ams-plus'
				? 'AMS+'
				: currentChoice === 'single-winner-approval'
					? 'Single-Winner Approval'
					: null
	);

	function prefersReducedMotion() {
		return (
			typeof window !== 'undefined' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
		);
	}

	async function scrollPagerIntoView() {
		if ($readingMode !== 'pager' || !pagerShell || typeof window === 'undefined') {
			return;
		}

		await tick();

		const top = pagerShell.getBoundingClientRect().top + window.scrollY - 96;
		window.scrollTo({
			top: Math.max(0, top),
			behavior: prefersReducedMotion() ? 'auto' : 'smooth'
		});
	}

	async function goToStep(index: number) {
		const boundedIndex = Math.max(0, Math.min(index, pagerSteps.length - 1));
		currentStepIndex = boundedIndex;
		await scrollPagerIntoView();
	}

	async function goNext() {
		if (!canGoNext) {
			return;
		}

		await goToStep(currentStepIndex + 1);
	}

	async function goPrevious() {
		if (currentStepIndex === 0) {
			return;
		}

		await goToStep(currentStepIndex - 1);
	}

	$effect(() => {
		const mode = $readingMode;

		if (mode === 'pager' && previousReadingMode === 'all') {
			void scrollPagerIntoView();
		}

		previousReadingMode = mode;
	});
</script>

<svelte:head>
	<title>Better Voting Systems for the UK</title>
	<meta
		name="description"
		content="Explore better voting systems for the UK: Proportional Approval, AMS+, and Single-Winner Approval."
	/>
</svelte:head>

{#if $readingMode === 'all'}
	<div class="hero-section">
		<p class="hero-eyebrow">A clearer case for fairer Westminster elections</p>
		<h1>It's Time for Better Westminster Elections</h1>
		<p class="hero-subtitle">
			Westminster's voting system is broken. Millions of votes are wasted, seats don't match votes,
			and voters are forced to vote tactically. There are better ways.
		</p>
		<p class="hero-intro">
			This site explores three approval-based voting options, beginning with the proportional models
			and ending with the simplest local upgrade, without the complexity of ranked-choice voting.
		</p>
	</div>
{/if}

{#if $readingMode === 'pager'}
	<section class="pager-shell" bind:this={pagerShell} aria-label="Guided walkthrough">
		<div class="pager-head">
			<p class="pager-step-count">Step {currentStepIndex + 1} of {pagerSteps.length}</p>
		</div>

		<div class="pager-stage">
			{#if currentStepIndex === 0}
				<ProblemSection />
			{:else if currentStepIndex === 1}
				<RankingProblems />
			{:else if currentStepIndex === 2}
				<RatingVsRanking />
			{:else if currentStepIndex === 3}
				<SystemChoice autoScroll={false} />
			{:else if currentStepIndex === 4}
				<div id="system-details" class="system-details">
					{#if currentChoice === 'single-winner-approval'}
						<SingleWinnerApprovalSection />
					{:else if currentChoice === 'ams-plus'}
						<AMSPlusSection />
					{:else if currentChoice === 'proportional-approval'}
						<ProportionalApprovalSection />
					{:else}
						<div class="no-selection-prompt">
							<p>
								<strong>Go back one step and choose a system to continue.</strong>
							</p>
						</div>
					{/if}
				</div>
			{:else}
				<section class="cta-section">
					<h2 class="section-header">Take Action</h2>

					<p>
						A fairer voting system is possible. The UK already uses proportional systems for Scottish
						Parliament, Welsh Senedd, and London Assembly elections. It's time to bring fair voting to
						Westminster.
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
			{/if}
		</div>

		<div class="pager-nav">
			<button
				type="button"
				class="pager-button pager-button-secondary"
				onclick={goPrevious}
				disabled={currentStepIndex === 0}
			>
				Previous
			</button>

			<p class="pager-status">
				{#if currentStepIndex === 3 && !currentChoice}
					Choose one of the three systems to continue.
				{:else if currentStepIndex === 4 && selectedSystemLabel}
					Currently viewing: <strong>{selectedSystemLabel}</strong>
				{:else if currentStepIndex === pagerSteps.length - 1}
					You’re at the end of the walkthrough.
				{/if}
			</p>

			<button
				type="button"
				class="pager-button"
				onclick={goNext}
				disabled={!canGoNext}
			>
				{nextLabel}
			</button>
		</div>
	</section>
{:else}
	<div class="guided-flow">
		<!-- Section 1: The Problem -->
		<ProblemSection />

		<!-- Section 2: Why Ranking Isn't the Answer -->
		<RankingProblems />

		<!-- Section 3: Rating vs Ranking -->
		<RatingVsRanking />

		<div class="decision-step">
			<!-- Section 4: Choose Your Path -->
			<SystemChoice />

			<!-- Section 5: System Details (conditional based on choice) -->
			<div id="system-details" class="system-details">
				{#if currentChoice === 'single-winner-approval'}
					<SingleWinnerApprovalSection />
				{:else if currentChoice === 'ams-plus'}
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
		</div>

		<section class="cta-section">
			<h2 class="section-header">Take Action</h2>

			<p>
				A fairer voting system is possible. The UK already uses proportional systems for Scottish
				Parliament, Welsh Senedd, and London Assembly elections. It's time to bring fair voting to
				Westminster.
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
	</div>
{/if}

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
		border: 1px solid rgba(31, 95, 150, 0.16);
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.75);
		color: var(--header-bg);
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

	.pager-shell {
		display: grid;
		gap: 1.25rem;
	}

	.pager-head {
		padding-bottom: 0.75rem;
		border-bottom: 1px solid var(--border-color);
	}

	.pager-step-count {
		margin: 0;
		color: var(--header-bg);
		font-size: 0.9rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.pager-stage {
		min-height: 0;
	}

	.pager-shell :global(.section-header) {
		margin-top: 1.25rem;
	}

	.pager-shell :global(.intro-text) {
		margin-top: 0.75rem;
	}

	.pager-nav {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 1rem;
		padding-top: 1.1rem;
		border-top: 1px solid var(--border-color);
	}

	.pager-button {
		border: 1px solid transparent;
		background: linear-gradient(180deg, var(--header-bg) 0%, var(--header-bg-strong) 100%);
		color: var(--surface-color);
		border-radius: 999px;
		padding: 0.85rem 1.2rem;
		font: inherit;
		font-weight: 600;
		cursor: pointer;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease,
			opacity 0.2s ease;
	}

	.pager-button:hover:not(:disabled) {
		transform: translateY(-1px);
		box-shadow: var(--shadow-soft);
	}

	.pager-button:disabled {
		cursor: default;
		opacity: 0.45;
		box-shadow: none;
	}

	.pager-button-secondary {
		border-color: var(--border-color);
		background: rgba(255, 255, 255, 0.84);
		color: var(--text-dark);
	}

	.pager-status {
		margin: 0;
		min-height: 1.5rem;
		color: var(--text-soft);
		text-align: center;
	}

	.system-details {
		min-height: 100px;
		scroll-margin-top: 5rem;
	}

	.no-selection-prompt {
		text-align: center;
		padding: 3rem 2rem;
		background: linear-gradient(180deg, #fbfcfe 0%, #f1f5f9 100%);
		border: 1px dashed var(--border-strong);
		border-radius: var(--radius-md);
		margin: 0;
	}

	.no-selection-prompt p {
		margin: 0;
		color: var(--text-soft);
		font-size: 1.1rem;
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
		background: rgba(255, 255, 255, 0.88);
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
		color: var(--header-bg);
		font-size: 1.2rem;
	}

	.cta-card p {
		margin: 0;
		color: var(--text-color);
		font-size: 0.95rem;
		line-height: 1.6;
	}

	.cta-card:focus-visible {
		outline-color: rgba(10, 92, 151, 0.28);
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

		.pager-nav {
			grid-template-columns: 1fr;
		}

		.pager-status {
			order: -1;
			text-align: left;
		}
	}
</style>
