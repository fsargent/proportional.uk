<script lang="ts">
	// Component explaining why common voting-system proposals could be improved
</script>

<section class="ranking-problems">
	<h2 class="section-header">Serious reforms still make ballot choices</h2>

	<p class="intro-text">
		Once you move beyond FPTP, the next question is not just how proportional you want the result to
		be. It is also what you are asking voters to do on the ballot. <strong>STV</strong>,
		<strong>AMS/MMP</strong>, and open-list systems are all serious reform options. But they each make a
		different choice about how voters express support, and that choice shapes how simple, legible, and
		forgiving the system feels in practice.
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
				<div class="ballot-demo">
					<p class="ballot-instruction">An STV-style ballot asks you to rank candidates in order:</p>
					<div class="ballot-options">
						<div class="ballot-option">
							<span class="rank-box">1</span>
							<span>Candidate A</span>
						</div>
						<div class="ballot-option">
							<span class="rank-box">4</span>
							<span>Candidate B</span>
						</div>
						<div class="ballot-option">
							<span class="rank-box">?</span>
							<span>Candidate C</span>
						</div>
						<div class="ballot-option">
							<span class="rank-box">2</span>
							<span>Candidate D</span>
						</div>
						<div class="ballot-option">
							<span class="rank-box">3</span>
							<span>Candidate E</span>
						</div>
					</div>
				</div>
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
				<strong>A simpler alternative:</strong> Keep the multi-member proportional ambition, but let
				voters support every acceptable candidate instead of forcing a full ranking.
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
				<strong>A simpler alternative:</strong> Keep the mixed-member structure, but replace the local
				FPTP ballot with a ballot that lets voters support every acceptable candidate.
			</div>
		</div>
	</div>

	<div class="key-insight">
		<h3>🎯 The Core Issue: How Voters Express Support</h3>
		<p>
			The important point here is simple: proportionality matters, but the <em>ballot interface</em>
			matters too.
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
			So before asking which proportional family is best, it helps to ask a more basic question: what if
			the ballot simply let voters support every acceptable candidate? That is the idea we introduce in
			the next section.
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
