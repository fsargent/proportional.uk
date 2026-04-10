<section class="district-shape" aria-labelledby="district-shape-title">
	<div class="section-copy">
		<h2 id="district-shape-title" class="section-header">Single-member or multi-member?</h2>
		<p class="intro-text">
			Once you know what the ballot should let voters say, the next question is how many seats each
			district should elect. That choice changes almost everything: local connection,
			proportionality, ballot length, and how much geography has to move around.
		</p>
		<p>
			This is why <strong>multi-member districts</strong> matter. They are not a voting method by
			themselves. They are a structural ingredient that several methods can share.
		</p>
	</div>

	<div class="shape-grid">
		<article class="shape-card">
			<h3>Single-member districts</h3>
			<p>One area elects one MP.</p>
			<ul>
				<li>Simple local story</li>
				<li>Strong single-representative link</li>
				<li>Harder to achieve real proportionality</li>
			</ul>
		</article>

		<article class="shape-card featured">
			<h3>Multi-member districts</h3>
			<p>One area elects several MPs.</p>
			<ul>
				<li>Needed for systems like STV and Proportional Approval</li>
				<li>Makes proportional outcomes much easier</li>
				<li>Creates tradeoffs in ballot size and district scale</li>
			</ul>
		</article>

		<article class="shape-card">
			<h3>Mixed systems</h3>
			<p>Local seats plus regional balancing seats.</p>
			<ul>
				<li>How AMS/MMP works</li>
				<li>Keeps local constituencies</li>
				<li>Uses a second layer to restore proportionality</li>
			</ul>
		</article>
	</div>

	<div class="takeaway-card">
		<h3>Why this matters</h3>
		<p>
			STV and Proportional Approval are different because they use different ballots and counting rules.
			But they both rely on the same structural idea: <strong>districts that elect more than one person</strong>.
		</p>
		<p>
			AMS+ is different again. It keeps single-member constituencies for local seats, then adds a second
			proportional layer on top. So the district question is separate from the ballot question — and the
			site needs to explain both.
		</p>
	</div>
</section>

<style>
	.district-shape {
		display: grid;
		gap: 1.75rem;
	}

	.section-copy {
		max-width: 54rem;
	}

	.shape-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1rem;
	}

	.shape-card,
	.takeaway-card {
		padding: 1.3rem;
		border-radius: var(--radius-md);
		border: 1px solid var(--border-color);
		background: var(--surface-raised);
		box-shadow: var(--shadow-soft);
	}

	.shape-card.featured {
		border-color: var(--accent-border);
		background: var(--surface-info-gradient);
	}

	.shape-card h3,
	.takeaway-card h3 {
		margin-top: 0;
	}

	.shape-card ul {
		margin: 0.75rem 0 0 0;
		padding-left: 1.25rem;
	}

	.shape-card li {
		margin-bottom: 0.5rem;
		line-height: 1.45;
	}

	.takeaway-card {
		background: var(--surface-subtle-gradient);
	}
</style>
