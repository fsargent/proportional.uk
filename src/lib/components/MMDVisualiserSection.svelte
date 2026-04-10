<section class="mmd-visualiser-section" aria-labelledby="mmd-visualiser-title">
	<div class="copy">
		<h2 id="mmd-visualiser-title" class="section-header">Explore multi-member districts in practice</h2>
		<p class="intro-text">
			If you want to understand STV or fully proportional approval systems, you eventually have to ask a
			geography question: how big should districts be, and what happens as they get bigger?
		</p>
		<p>
			That is what the visualiser is for. It lets you group today’s Westminster constituencies into
			larger districts and see how district size changes proportionality, local scale, and ballot
			pressure.
		</p>
	</div>

	<div class="visualiser-grid">
		<div class="visualiser-card">
			<h3>What it helps explain</h3>
			<ul>
				<li>Why multi-member districts matter to both STV and proportional approval</li>
				<li>How district magnitude changes the tradeoff between local link and proportionality</li>
				<li>Why stable geographies such as local authority groupings are politically useful</li>
			</ul>
		</div>

		<div class="visualiser-card featured">
			<h3>Open the district visualiser</h3>
			<p>Use the live tool to see how grouped districts change the map and why district size matters.</p>
			<a class="visualiser-link" href="/visualiser">Open visualiser</a>
		</div>
	</div>
</section>

<style>
	.mmd-visualiser-section { display: grid; gap: 1.5rem; }
	.copy { max-width: 54rem; }
	.visualiser-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 1rem;
	}
	.visualiser-card {
		padding: 1.3rem;
		border-radius: var(--radius-md);
		border: 1px solid var(--border-color);
		background: var(--surface-raised);
		box-shadow: var(--shadow-soft);
	}
	.visualiser-card.featured {
		border-color: var(--accent-border);
		background: var(--surface-info-gradient);
	}
	.visualiser-card h3 { margin-top: 0; }
	.visualiser-card ul { margin: 0.75rem 0 0 0; padding-left: 1.25rem; }
	.visualiser-card li { margin-bottom: 0.5rem; line-height: 1.45; }
	.visualiser-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		margin-top: 0.75rem;
		padding: 0.8rem 1.1rem;
		border-radius: 999px;
		background: linear-gradient(180deg, var(--header-bg) 0%, var(--header-bg-strong) 100%);
		color: var(--text-inverse);
		text-decoration: none;
		font-weight: 700;
	}
</style>
