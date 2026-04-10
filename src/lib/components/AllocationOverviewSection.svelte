<section class="allocation-overview" aria-labelledby="allocation-overview-title">
	<div class="copy">
		<h2 id="allocation-overview-title" class="section-header">How seats get turned out of ballots</h2>
		<p class="intro-text">
			Once you know the ballot and the district shape, you still need a rule for turning votes into
			winners. This is the bit most people only encounter as a method name: plurality, transfers,
			top-up seats, or reweighting.
		</p>
	</div>

	<div class="method-grid">
		<article class="method-card">
			<h3>Plurality</h3>
			<p>The simplest rule: whoever has the most support wins. Used in FPTP and single-winner approval.</p>
		</article>

		<article class="method-card">
			<h3>Transfers</h3>
			<p>Used in STV. Ballots move around as candidates are elected or eliminated, which helps proportionality but makes the count harder to follow.</p>
		</article>

		<article class="method-card">
			<h3>Top-up seats</h3>
			<p>Used in AMS/MMP. Local winners are combined with regional balancing seats so the final chamber better matches party support.</p>
		</article>

		<article class="method-card featured">
			<h3>Reweighting</h3>
			<p>Used in proportional approval systems. Once one of your approved candidates wins, your ballot carries a little less weight for the next seat so other groups can win representation too.</p>
		</article>
	</div>

</section>

<style>
	.allocation-overview {
		display: grid;
		gap: 1.5rem;
	}
	.copy { max-width: 54rem; }
	.method-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1rem;
	}
	.method-card {
		padding: 1.25rem;
		border-radius: var(--radius-md);
		border: 1px solid var(--border-color);
		background: var(--surface-raised);
		box-shadow: var(--shadow-soft);
	}
	.method-card.featured {
		border-color: var(--accent-border);
		background: var(--surface-accent-gradient);
	}
	.method-card h3 { margin-top: 0; }
</style>
