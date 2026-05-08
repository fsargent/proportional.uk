<script lang="ts">
	const tradeoffs = [
		{
			title: 'District magnitude is a hard design choice',
			body:
				'STV is only as proportional as the district magnitude allows. Three-seat districts behave a lot like majoritarian contests — small parties still struggle to win a seat. Seven-plus-seat districts give cleaner proportionality, but the geography gets unwieldy and the local link weakens. Ireland mostly uses three-, four-, and five-seat districts, and the choice noticeably shapes party fortunes.'
		},
		{
			title: 'The count is hard to verify by hand',
			body:
				'Surplus transfers usually use the Gregory method (or a variant): every ballot for the elected candidate is transferred at a fractional weight. The arithmetic works, but ordinary voters cannot easily reproduce it on a tally sheet. Most jurisdictions rely on official software, which is fine until people want to inspect a count themselves.'
		},
		{
			title: 'Ballots can run out — "exhaustion"',
			body:
				"A ballot stops counting once its last marked preference has been used. When voters rank only a few candidates and those preferences are all elected or eliminated, the ballot is exhausted and contributes nothing to the remaining seats. The deeper the slate, the more this matters — and reformers have to decide whether to require a minimum number of preferences."
		},
		{
			title: 'Westminster would need new boundaries',
			body:
				'Every existing UK constituency is single-member. Adopting STV means stitching them into <a href="/visualiser">multi-member districts</a> and pushing the result through a Boundary Commission process — a years-long, politically charged exercise that has historically derailed even modest reforms. AMS-style proposals avoid most of this work.'
		},
		{
			title: 'Strategic effects do not disappear',
			body:
				'STV has the "later-harm" property: marking a lower preference can sometimes hurt your higher one by helping a rival reach quota first. Parties also play "vote management" — asking supporters to split their first preferences across the party\'s candidates so the slate as a whole takes more seats. Both effects are subtle, but they are real and well documented in Irish elections.'
		},
		{
			title: 'Counts can take days',
			body:
				'A multi-member STV count proceeds round by round, with surplus and elimination transfers between rounds. Irish Dáil counts routinely take 24–48 hours; large UK Westminster districts would likely take longer. The current overnight result expectation would have to change.'
		}
	];
</script>

<div class="stv-tradeoffs">
	<aside class="av-referendum">
		<h3>The UK has already voted on ranking — and said no</h3>
		<p>
			In May 2011, voters were asked whether to replace First Past the Post with the
			<a
				href="https://en.wikipedia.org/wiki/2011_United_Kingdom_Alternative_Vote_referendum"
				target="_blank"
				rel="noopener noreferrer">Alternative Vote</a
			>
			— a single-winner ranked ballot, the simplest version of "rank candidates" that exists. It
			was rejected
			<strong>67.9% to 32.1%</strong>
			in a national referendum. Turnout was 42%.
		</p>
		<p>
			This is the strongest political objection to STV in the UK, and it is not abstract. The
			country has been asked, recently, whether ranking candidates is acceptable — and the
			answer was a landslide no, with "too complicated" the dominant message of the Yes side's
			defeat. Any STV campaign would have to win that argument back, against opponents who can
			simply point to 2011.
		</p>
		<p>
			This matters most when a simpler proportional alternative exists. <a href="/proportional-approval">Proportional
			Approval</a> uses a tick-box ballot that asks no more of voters than today's, and reaches
			the same proportional Parliament. The case for STV has to be made not just against the
			status quo, but against an approval-based path that has none of ranking's political
			baggage.
		</p>
	</aside>

	<section class="lead">
		<h3>Ranked complexity is the real cost</h3>
		<p>
			STV elects multiple candidates per constituency and is genuinely proportional. The trade-off
			lives on the ballot itself, and reformers should weigh it honestly:
		</p>
		<div class="ballot-demo">
			<p class="ballot-instruction">An STV-style ballot asks you to rank candidates in order:</p>
			<div class="ballot-options">
				<div class="ballot-option"><span class="rank-box">1</span><span>Candidate A</span></div>
				<div class="ballot-option"><span class="rank-box">4</span><span>Candidate B</span></div>
				<div class="ballot-option"><span class="rank-box">?</span><span>Candidate C</span></div>
				<div class="ballot-option"><span class="rank-box">2</span><span>Candidate D</span></div>
				<div class="ballot-option"><span class="rank-box">3</span><span>Candidate E</span></div>
			</div>
		</div>
		<ul>
			<li>
				<strong>Long ballots:</strong> ranking 10+ candidates asks more of voters than a simple
				approval mark.
			</li>
			<li>
				<strong>Ballot errors:</strong> ranked ballots can produce more spoilage from skipped or
				duplicate numbers.
			</li>
			<li>
				<strong>Strategic pressure:</strong> ranking rules can still create tactical anxieties and
				debate over count mechanics.
			</li>
		</ul>
	</section>

	<section class="more-tradeoffs">
		<h3>Other trade-offs worth knowing</h3>
		<div class="tradeoff-cards">
			{#each tradeoffs as t (t.title)}
				<article class="tradeoff-card">
					<h4>{t.title}</h4>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -- bodies are author-controlled and only contain anchor tags -->
					<p>{@html t.body}</p>
				</article>
			{/each}
		</div>
	</section>
</div>

<style>
	.stv-tradeoffs {
		display: grid;
		gap: 2rem;
	}

	.av-referendum {
		display: grid;
		gap: 0.75rem;
		padding: 1.25rem 1.5rem;
		border: 1px solid var(--danger-border);
		border-left-width: 4px;
		border-left-color: var(--danger-color);
		border-radius: var(--radius-md);
		background: var(--surface-emphasis);
	}

	.av-referendum h3 {
		margin: 0;
		font-size: 1.2rem;
		color: var(--text-dark);
	}

	.av-referendum p {
		margin: 0;
		font-size: 1rem;
		line-height: 1.6;
		color: var(--text-color);
	}

	.av-referendum a {
		color: var(--link-color);
	}

	.lead {
		display: grid;
		gap: 0.85rem;
	}

	.lead h3 {
		margin: 0;
		font-size: 1.25rem;
		color: var(--text-dark);
	}

	.lead > p {
		margin: 0;
		font-size: 1rem;
		line-height: 1.6;
		color: var(--text-color);
	}

	.lead ul {
		margin: 0;
		padding-left: 1.25rem;
		display: grid;
		gap: 0.4rem;
	}

	.lead li {
		margin: 0;
		line-height: 1.55;
		color: var(--text-color);
		font-size: 0.95rem;
	}

	.ballot-demo {
		padding: 1rem;
		background: var(--surface-subtle-gradient);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
	}

	.ballot-instruction {
		margin: 0 0 0.75rem 0;
		font-size: 0.9rem;
		color: var(--text-soft);
	}

	.ballot-options {
		display: grid;
		gap: 0.4rem;
	}

	.ballot-option {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 0.95rem;
	}

	.rank-box {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border-radius: 0.25rem;
		border: 1px solid var(--border-color);
		background: var(--surface-color);
		font-weight: 700;
		color: var(--text-dark);
	}

	.more-tradeoffs h3 {
		margin: 0 0 1rem 0;
		font-size: 1.15rem;
		color: var(--text-dark);
	}

	.tradeoff-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1rem;
	}

	.tradeoff-card {
		padding: 1.1rem 1.25rem;
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		background: var(--surface-raised);
		box-shadow: var(--shadow-soft);
	}

	.tradeoff-card h4 {
		margin: 0 0 0.5rem 0;
		font-size: 1rem;
		color: var(--accent-text);
	}

	.tradeoff-card p {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.6;
		color: var(--text-color);
	}
</style>
