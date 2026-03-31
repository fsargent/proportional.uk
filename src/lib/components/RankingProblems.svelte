<script lang="ts">
	// Component explaining why common voting-system proposals could be improved
</script>

<section class="ranking-problems">
	<h2 class="section-header">Good Ideas, But We Can Do Better</h2>

	<p class="intro-text">
		<strong>STV (Single Transferable Vote)</strong>,
		<strong>AMS/MMP (Mixed Member Proportional)</strong>, and open-list approaches are all serious
		reform options. They improve on FPTP because they take proportionality seriously. The argument
		here is not that they fail, but that some of their avoidable friction sits in <em>how</em>
		voters express preferences.
	</p>

	<div class="systems-grid">
		<div class="system-card">
			<div class="system-header positive">
				<h3>✓ STV Gets Proportionality Right</h3>
			</div>
			<p class="system-praise">
				STV elects multiple candidates per constituency, ensuring proportional representation. It's
				used successfully in Ireland, Scotland (local elections), and Northern Ireland.
			</p>

			<div class="system-issue">
				<h4>⚠️ Its Main Trade-off Is Ranked Complexity</h4>
				<p>That does not make STV a bad system. It does mean reformers should weigh real costs:</p>
				<ul>
					<li>
						<strong>Long ballots:</strong> Ranking 10+ candidates asks more of voters than a simple
						approval mark
					</li>
					<li>
						<strong>Ballot errors:</strong> Ranked ballots can create more spoilage from skipped or
						duplicate numbers
					</li>
					<li>
						<strong>Slow counting:</strong> Transfer calculations are harder to explain and can take days
					</li>
					<li>
						<strong>Strategic pressure:</strong> Ranking rules can still create tactical anxieties and
						debate over count mechanics
					</li>
				</ul>
			</div>

			<div class="improvement-box">
				<strong>Approval-based response:</strong> Keep the multi-member proportional ambition, but ask
				voters to approve acceptable candidates instead of ranking them.
			</div>
		</div>

		<div class="system-card">
			<div class="system-header positive">
				<h3>✓ MMP Gets Proportionality Right</h3>
			</div>
			<p class="system-praise">
				MMP uses party lists to ensure overall proportional representation. It's used in Germany,
				New Zealand, and (as AMS) in Scotland and Wales.
			</p>

			<div class="system-issue">
				<h4>⚠️ Its Main Trade-off Is The Local Ballot</h4>
				<p>Standard AMS/MMP often keeps a single-choice constituency contest, which means:</p>
				<ul>
					<li>
						<strong>Tactical voting:</strong> You still can't vote for your favourite if they might
						"split the vote"
					</li>
					<li>
						<strong>Wasted votes:</strong> In safe constituencies, the local vote still doesn't matter
					</li>
					<li>
						<strong>Negative campaigning:</strong> Candidates still win by attacking opponents rather
						than building support
					</li>
				</ul>
			</div>

			<div class="improvement-box">
				<strong>Approval-based response:</strong> Keep the mixed-member structure, but replace the local
				FPTP ballot with approval voting.
			</div>
		</div>
	</div>

	<div class="key-insight">
		<h3>🎯 The Core Issue: How Voters Express Support</h3>
		<p>
			The core approval-voting claim is compatible with coalition politics: proportionality is good,
			but the <em>ballot interface</em> still matters.
		</p>
		<ul>
			<li>
				<strong>FPTP-style local ballots</strong> force you to pick just one candidate, even if you'd be
				happy with several
			</li>
			<li>
				<strong>Ranked ballots</strong> ask you to order candidates even when many are simply
				"acceptable" or "not acceptable"
			</li>
		</ul>
		<p>
			<strong>Approval voting</strong> is simpler: just mark which candidates you find acceptable. No
			forced ranking. No single-choice restriction. And it can sit inside both mixed systems (like
			AMS+) and fully proportional multi-member systems.
		</p>
	</div>
</section>

<style>
	.ranking-problems {
		margin: 0;
	}

	.intro-text {
		font-size: 1.1rem;
		line-height: 1.7;
		max-width: 800px;
	}

	.systems-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
		gap: 2rem;
		margin: 2rem 0;
	}

	.system-card {
		background: var(--surface-raised);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		overflow: hidden;
		display: flex;
		flex-direction: column;
		box-shadow: var(--shadow-soft);
	}

	.system-header {
		padding: 1rem 1.5rem;
		margin: 0;
	}

	.system-header.positive {
		background: var(--surface-success-strong-gradient);
		border-bottom: 1px solid var(--success-border);
	}

	.system-header h3 {
		margin: 0;
		color: var(--success-color);
		font-size: 1.1rem;
	}

	.system-praise {
		padding: 1rem 1.5rem 0.5rem;
		color: var(--success-text);
		font-size: 0.95rem;
		line-height: 1.6;
		background: var(--success-tint);
	}

	.system-issue {
		padding: 1rem 1.5rem;
		background: var(--warning-tint);
		border-top: 1px solid var(--warning-border);
		flex: 1;
	}

	.system-issue h4 {
		margin: 0 0 0.75rem 0;
		color: var(--warning-text);
		font-size: 1rem;
	}

	.system-issue p {
		margin: 0 0 0.5rem 0;
		color: var(--text-color);
		font-size: 0.9rem;
	}

	.system-issue ul {
		margin: 0.5rem 0 0 0;
		padding-left: 1.25rem;
	}

	.system-issue li {
		margin-bottom: 0.5rem;
		line-height: 1.4;
		color: var(--text-color);
		font-size: 0.9rem;
	}

	.system-issue li:last-child {
		margin-bottom: 0;
	}

	.improvement-box {
		margin-top: auto;
		padding: 1rem 1.5rem;
		background: var(--surface-accent-gradient);
		color: var(--accent-text);
		font-size: 0.95rem;
		line-height: 1.6;
	}

	.key-insight {
		margin-top: 2rem;
		padding: 2rem;
		background: var(--surface-info-gradient);
		border: 1px solid var(--accent-border);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-soft);
	}

	.key-insight h3 {
		margin-top: 0;
		color: var(--accent-text);
	}

	.key-insight p {
		line-height: 1.6;
	}

	.key-insight ul {
		margin: 1rem 0;
		padding-left: 1.5rem;
	}

	.key-insight li {
		margin-bottom: 0.5rem;
		line-height: 1.5;
	}

	@media (max-width: 768px) {
		.systems-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
