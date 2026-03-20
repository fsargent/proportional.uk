<script lang="ts">
	import { selectedSystem, type VotingSystem } from '$lib/stores/navigation';

	interface Props {
		autoScroll?: boolean;
	}

	let { autoScroll = true }: Props = $props();

	function selectSystem(system: VotingSystem) {
		selectedSystem.set(system);

		if (!autoScroll) {
			return;
		}

		// Respect reduced-motion preferences when guiding people to the chosen section.
		setTimeout(() => {
			const detailsSection = document.getElementById('system-details');
			if (detailsSection) {
				const prefersReducedMotion =
					typeof window !== 'undefined' &&
					window.matchMedia('(prefers-reduced-motion: reduce)').matches;

				detailsSection.scrollIntoView({
					behavior: prefersReducedMotion ? 'auto' : 'smooth',
					block: 'start'
				});
			}
		}, 100);
	}

	let currentChoice = $derived($selectedSystem);
</script>

<section class="system-choice">
	<h2 class="section-header">Choose the Better Fit</h2>

	<p class="intro-text">
		All three options below use <strong>approval voting</strong> instead of ranking. The main choice
		is whether you want full proportionality, a mixed proportional system that keeps local MPs, or
		the simplest local upgrade from FPTP.
	</p>

	<div class="choice-grid">
		<button
			type="button"
			class="choice-card"
			class:selected={currentChoice === 'proportional-approval'}
			aria-pressed={currentChoice === 'proportional-approval'}
			onclick={() => selectSystem('proportional-approval')}
		>
			<p class="choice-kicker">Most proportional option</p>
			<div class="choice-icon">📊</div>
			<h3>Proportional Approval</h3>
			<p class="choice-subtitle">Fully Proportional</p>

			<div class="choice-features">
				<div class="feature">
					<span class="feature-icon">✓</span>
					<span>Maximum proportionality</span>
				</div>
				<div class="feature">
					<span class="feature-icon">✓</span>
					<span>One simple ballot</span>
				</div>
				<div class="feature">
					<span class="feature-icon">✓</span>
					<span>Every vote counts equally</span>
				</div>
				<div class="feature">
					<span class="feature-icon">✓</span>
					<span>No wasted votes at all</span>
				</div>
			</div>

			<div class="choice-tradeoffs">
				<p><strong>Trade-off:</strong> No single local MP, but regional candidates</p>
			</div>
		</button>

		<button
			type="button"
			class="choice-card"
			class:selected={currentChoice === 'ams-plus'}
			aria-pressed={currentChoice === 'ams-plus'}
			onclick={() => selectSystem('ams-plus')}
		>
			<p class="choice-kicker">Best mixed model</p>
			<div class="choice-icon">🏛️</div>
			<h3>AMS+ (Approval-MMP)</h3>
			<p class="choice-subtitle">Local + Proportional</p>

			<div class="choice-features">
				<div class="feature">
					<span class="feature-icon">✓</span>
					<span>Keep your local constituency MP</span>
				</div>
				<div class="feature">
					<span class="feature-icon">✓</span>
					<span>Two ballots: local approval + party list</span>
				</div>
				<div class="feature">
					<span class="feature-icon">✓</span>
					<span>Builds on proven Scottish/Welsh system</span>
				</div>
				<div class="feature">
					<span class="feature-icon">✓</span>
					<span>Proportional top-up seats</span>
				</div>
			</div>

			<div class="choice-tradeoffs">
				<p><strong>Trade-off:</strong> Slightly less proportional, but maintains local link</p>
			</div>
		</button>

		<button
			type="button"
			class="choice-card"
			class:selected={currentChoice === 'single-winner-approval'}
			aria-pressed={currentChoice === 'single-winner-approval'}
			onclick={() => selectSystem('single-winner-approval')}
		>
			<p class="choice-kicker">Simplest local upgrade</p>
			<div class="choice-icon">🗳️</div>
			<h3>Single-Winner Approval</h3>
			<p class="choice-subtitle">Local + Simple</p>

			<div class="choice-features">
				<div class="feature">
					<span class="feature-icon">✓</span>
					<span>Keep one local MP per constituency</span>
				</div>
				<div class="feature">
					<span class="feature-icon">✓</span>
					<span>One ballot with one simple instruction</span>
				</div>
				<div class="feature">
					<span class="feature-icon">✓</span>
					<span>Reduces tactical voting and spoiler pressure</span>
				</div>
				<div class="feature">
					<span class="feature-icon">✓</span>
					<span>Likely the easiest UK-wide change to implement</span>
				</div>
			</div>

			<div class="choice-tradeoffs">
				<p><strong>Trade-off:</strong> Fairer local elections, but not proportional nationwide</p>
			</div>
		</button>
	</div>

	{#if currentChoice}
		<p class="selection-indicator">
			Scroll down to learn more about <strong
				>{currentChoice === 'single-winner-approval'
					? 'Single-Winner Approval'
					: currentChoice === 'ams-plus'
						? 'AMS+'
						: 'Proportional Approval'}</strong
			>
		</p>
	{:else}
		<p class="prompt-text">Click a card above to explore that system in detail</p>
	{/if}
</section>

<style>
	.system-choice {
		margin: 0;
	}

	.intro-text {
		font-size: 1.1rem;
		line-height: 1.7;
		max-width: 800px;
		margin-bottom: 2rem;
	}

	.choice-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 2rem;
		margin: 2rem 0;
	}

	.choice-card {
		background: rgba(255, 255, 255, 0.94);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-lg);
		padding: 2rem;
		cursor: pointer;
		transition:
			border-color 0.22s ease,
			box-shadow 0.22s ease,
			transform 0.22s ease,
			background-color 0.22s ease;
		text-align: left;
		display: flex;
		flex-direction: column;
		font-family: inherit;
		font-size: inherit;
		box-shadow: var(--shadow-soft);
	}

	.choice-card:hover {
		border-color: var(--border-strong);
		box-shadow: var(--shadow-strong);
		transform: translateY(-2px);
	}

	.choice-card.selected {
		border-color: rgba(29, 111, 66, 0.4);
		background: linear-gradient(180deg, #f7fbf8 0%, #eff7f2 100%);
		box-shadow: 0 16px 34px rgba(29, 111, 66, 0.14);
	}

	.choice-card:focus-visible {
		outline-color: rgba(10, 92, 151, 0.28);
	}

	.choice-kicker {
		margin: 0 0 0.9rem 0;
		color: var(--text-soft);
		font-size: 0.85rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.choice-icon {
		font-size: 2.6rem;
		margin-bottom: 1rem;
	}

	.choice-card h3 {
		margin: 0 0 0.25rem 0;
		color: var(--text-dark);
		font-size: 1.5rem;
	}

	.choice-subtitle {
		color: var(--header-bg);
		font-weight: 600;
		margin: 0 0 1.5rem 0;
		font-size: 1rem;
	}

	.choice-features {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
		flex-grow: 1;
	}

	.feature {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
	}

	.feature-icon {
		color: var(--success-color);
		font-weight: bold;
		flex-shrink: 0;
	}

	.feature span:last-child {
		color: var(--text-color);
		line-height: 1.55;
	}

	.choice-tradeoffs {
		padding-top: 1rem;
		border-top: 1px solid var(--border-color);
	}

	.choice-tradeoffs p {
		margin: 0;
		font-size: 0.9rem;
		color: var(--text-soft);
	}

	.selection-indicator {
		text-align: center;
		color: var(--success-color);
		font-size: 1.1rem;
		margin-top: 2rem;
		padding: 1rem;
		background: linear-gradient(180deg, #f7fbf8 0%, #edf7f1 100%);
		border: 1px solid rgba(29, 111, 66, 0.18);
		border-radius: var(--radius-md);
	}

	.prompt-text {
		text-align: center;
		color: var(--text-soft);
		font-size: 1rem;
		margin-top: 2rem;
	}

	@media (max-width: 768px) {
		.choice-grid {
			grid-template-columns: 1fr;
		}

		.choice-card {
			padding: 1.5rem;
		}

		.choice-icon {
			font-size: 2.5rem;
		}

		.choice-card h3 {
			font-size: 1.25rem;
		}
	}
</style>
