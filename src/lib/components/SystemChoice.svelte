<script lang="ts">
	const cards = [
		{
			href: '/proportional-approval',
			kicker: 'The cleanest fully proportional version',
			icon: '📊',
			title: 'Proportional Approval',
			subtitle: 'Fully Proportional',
			features: ['Maximum proportionality', 'One simple ballot', 'Every vote counts equally', 'Multi-member approval ballot'],
			tradeoff: 'Requires multi-member districts and a bigger transition than AMS+'
		},
		{
			href: '/ams-plus',
			kicker: 'The easiest proportional route from here',
			icon: '🏛️',
			title: 'AMS+ (Approval-MMP)',
			subtitle: 'Local + Proportional',
			features: ['Keep your local constituency MP', 'Two ballots: local approval + party list', 'Builds on proven Scottish/Welsh system', 'Proportional top-up seats'],
			tradeoff: 'Slightly less proportional than large-district PR, but easiest to fit UK reform politics'
		},
		{
			href: '/single-winner-approval',
			kicker: 'The smallest change with the biggest ballot fix',
			icon: '🗳️',
			title: 'Single-Winner Approval',
			subtitle: 'Local + Simple',
			features: ['Keep one local MP per constituency', 'One ballot with one simple instruction', 'Reduces tactical voting and spoiler pressure', 'Likely the easiest UK-wide change to implement'],
			tradeoff: 'Fairer local elections, but not proportional nationwide'
		},
		{
			href: '/stv',
			kicker: 'The key comparator in UK reform politics',
			icon: '🧮',
			title: 'STV',
			subtitle: 'Ranked + Multi-member',
			features: ['Well-known PR option', 'Candidate-centred', 'Needs multi-member districts', 'Ranked ballot and transfer count'],
			tradeoff: 'Strong proportional system, but more demanding ballot and count'
		}
	] as const;
</script>

<section class="system-choice">
	<h2 class="section-header">Four methods worth understanding</h2>

	<p class="intro-text">
		Three of these are approval-based reform paths for Britain. The fourth is STV, the most important
		ranked multi-member comparator in UK reform politics. Together they make the trade space much easier
		to see.
	</p>

	<div class="choice-grid">
		{#each cards as card (card.href)}
			<a href={card.href} class="choice-card link-card">
				<p class="choice-kicker">{card.kicker}</p>
				<div class="choice-icon">{card.icon}</div>
				<h3>{card.title}</h3>
				<p class="choice-subtitle">{card.subtitle}</p>
				<div class="choice-features">
					{#each card.features as feature}
						<div class="feature">
							<span class="feature-icon">✓</span>
							<span>{feature}</span>
						</div>
					{/each}
				</div>
				<div class="choice-tradeoffs">
					<p><strong>Trade-off:</strong> {card.tradeoff}</p>
				</div>
			</a>
		{/each}
	</div>

	<p class="prompt-text">Open any card to get the full explanation on its own page.</p>
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
		background: var(--surface-raised);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-lg);
		padding: 2rem;
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

	.choice-card:focus-visible {
		outline-color: var(--focus-ring-soft);
	}

	.link-card {
		text-decoration: none;
		color: inherit;
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
		color: var(--accent-text);
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
