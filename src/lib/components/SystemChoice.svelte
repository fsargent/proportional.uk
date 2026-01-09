<script lang="ts">
	import { selectedSystem, type VotingSystem } from '$lib/stores/navigation';

	function selectSystem(system: VotingSystem) {
		selectedSystem.set(system);

		// Scroll to the details section after a brief delay
		setTimeout(() => {
			const detailsSection = document.getElementById('system-details');
			if (detailsSection) {
				detailsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		}, 100);
	}

	let currentChoice = $derived($selectedSystem);
</script>

<section class="system-choice">
	<h2 class="section-header">Choose Your Path to Reform</h2>

	<p class="intro-text">
		Both solutions below use <strong>approval voting</strong> (rating) instead of ranking. The question
		is: do you want to keep local constituency MPs, or prioritise maximum proportionality?
	</p>

	<div class="choice-grid">
		<button
			class="choice-card"
			class:selected={currentChoice === 'ams-plus'}
			onclick={() => selectSystem('ams-plus')}
		>
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
			class="choice-card"
			class:selected={currentChoice === 'proportional-approval'}
			onclick={() => selectSystem('proportional-approval')}
		>
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
	</div>

	{#if currentChoice}
		<p class="selection-indicator">
			Scroll down to learn more about <strong
				>{currentChoice === 'ams-plus' ? 'AMS+' : 'Proportional Approval'}</strong
			>
		</p>
	{:else}
		<p class="prompt-text">Click a card above to explore that system in detail</p>
	{/if}
</section>

<style>
	.system-choice {
		margin: 3rem 0;
	}

	.intro-text {
		font-size: 1.1rem;
		line-height: 1.6;
		max-width: 800px;
		margin-bottom: 2rem;
	}

	.choice-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 2rem;
		margin: 2rem 0;
	}

	.choice-card {
		background: white;
		border: 3px solid #ddd;
		border-radius: 12px;
		padding: 2rem;
		cursor: pointer;
		transition: all 0.3s ease;
		text-align: left;
		display: flex;
		flex-direction: column;
		font-family: inherit;
		font-size: inherit;
	}

	.choice-card:hover {
		border-color: #1d70b8;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
		transform: translateY(-4px);
	}

	.choice-card.selected {
		border-color: #00703c;
		background: linear-gradient(to bottom, #f0fff0 0%, white 100%);
		box-shadow: 0 4px 16px rgba(0, 112, 60, 0.2);
	}

	.choice-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.choice-card h3 {
		margin: 0 0 0.25rem 0;
		color: #0b0c0c;
		font-size: 1.5rem;
	}

	.choice-subtitle {
		color: #1d70b8;
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
		color: #00703c;
		font-weight: bold;
		flex-shrink: 0;
	}

	.feature span:last-child {
		color: #555;
		line-height: 1.4;
	}

	.choice-tradeoffs {
		padding-top: 1rem;
		border-top: 1px solid #ddd;
	}

	.choice-tradeoffs p {
		margin: 0;
		font-size: 0.9rem;
		color: #666;
	}

	.selection-indicator {
		text-align: center;
		color: #00703c;
		font-size: 1.1rem;
		margin-top: 2rem;
		padding: 1rem;
		background: #f0fff0;
		border-radius: 8px;
		animation: pulse 2s infinite;
	}

	.prompt-text {
		text-align: center;
		color: #666;
		font-size: 1rem;
		margin-top: 2rem;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.7;
		}
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
