<script lang="ts">
	// Component explaining why current reform proposals could be improved
</script>

<section class="ranking-problems">
	<h2 class="section-header">Good Ideas, But We Can Do Better</h2>

	<p class="intro-text">
		Reformers often propose <strong>STV (Single Transferable Vote)</strong> or
		<strong>MMP (Mixed Member Proportional)</strong>. Both are genuine improvements over FPTP—they deliver
		proportional representation. But both could be made simpler and more effective by changing
		<em>how</em> voters express their preferences.
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
				<h4>⚠️ But It Uses Ranked-Choice Voting</h4>
				<p>The ranking aspect creates unnecessary complexity:</p>
				<ul>
					<li>
						<strong>Cognitive burden:</strong> Ranking 10+ candidates requires knowledge voters often
						don't have
					</li>
					<li>
						<strong>Ballot errors:</strong> Higher spoilage rates from skipped or duplicate rankings
					</li>
					<li>
						<strong>Slow counting:</strong> Complex transfer calculations can take days
					</li>
					<li>
						<strong>Strategic voting:</strong> "Later-no-harm" concerns can discourage honest ranking
					</li>
				</ul>
			</div>

			<div class="improvement-box">
				<strong>The fix:</strong> Replace ranking with approval voting. Same proportional outcome,
				simpler ballot, faster count.
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
				<h4>⚠️ But Constituencies Still Use FPTP</h4>
				<p>The local vote keeps all of FPTP's problems:</p>
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
				<strong>The fix:</strong> Replace FPTP constituencies with approval voting. Keep the proportional
				list, fix the local vote.
			</div>
		</div>
	</div>

	<div class="key-insight">
		<h3>🎯 The Core Issue: How We Express Preferences</h3>
		<p>
			Both STV and MMP deliver proportional representation—that's good! The problem is the
			<em>voting method</em> used to express preferences:
		</p>
		<ul>
			<li>
				<strong>FPTP</strong> forces you to pick just one candidate, even if you'd be happy with several
			</li>
			<li>
				<strong>Ranked-choice</strong> asks you to order all candidates, even when you don't have clear
				preferences beyond your top few
			</li>
		</ul>
		<p>
			<strong>Approval voting</strong> is simpler: just mark which candidates you find acceptable. No
			forced ranking. No single-choice restrictions. And it works with both mixed systems (like AMS+)
			and fully proportional systems.
		</p>
	</div>
</section>

<style>
	.ranking-problems {
		margin: 3rem 0;
	}

	.intro-text {
		font-size: 1.1rem;
		line-height: 1.6;
		max-width: 800px;
	}

	.systems-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
		gap: 2rem;
		margin: 2rem 0;
	}

	.system-card {
		background: white;
		border: 2px solid #ddd;
		border-radius: 8px;
		overflow: hidden;
	}

	.system-header {
		padding: 1rem 1.5rem;
		margin: 0;
	}

	.system-header.positive {
		background: linear-gradient(135deg, #e6f7e6 0%, #d4edda 100%);
		border-bottom: 2px solid #c3e6c3;
	}

	.system-header h3 {
		margin: 0;
		color: #155724;
		font-size: 1.1rem;
	}

	.system-praise {
		padding: 1rem 1.5rem 0.5rem;
		color: #155724;
		font-size: 0.95rem;
		line-height: 1.5;
		background: #f8fff8;
	}

	.system-issue {
		padding: 1rem 1.5rem;
		background: #fff8f0;
		border-top: 1px solid #ffeeba;
	}

	.system-issue h4 {
		margin: 0 0 0.75rem 0;
		color: #856404;
		font-size: 1rem;
	}

	.system-issue p {
		margin: 0 0 0.5rem 0;
		color: #555;
		font-size: 0.9rem;
	}

	.system-issue ul {
		margin: 0.5rem 0 0 0;
		padding-left: 1.25rem;
	}

	.system-issue li {
		margin-bottom: 0.5rem;
		line-height: 1.4;
		color: #555;
		font-size: 0.9rem;
	}

	.system-issue li:last-child {
		margin-bottom: 0;
	}

	.improvement-box {
		padding: 1rem 1.5rem;
		background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
		color: #0d47a1;
		font-size: 0.95rem;
		line-height: 1.5;
	}

	.key-insight {
		margin-top: 2rem;
		padding: 2rem;
		background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
		border: 2px solid #1d70b8;
		border-radius: 8px;
	}

	.key-insight h3 {
		margin-top: 0;
		color: #1d70b8;
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
