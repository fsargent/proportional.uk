<script lang="ts">
	import StepCard from './StepCard.svelte';
	import FAQItem from './FAQItem.svelte';

	const steps = [
		{
			number: 1,
			title: 'One vote',
			description:
				'Each voter marks a single candidate on the ballot. No ranking, no second choices, no party vote.'
		},
		{
			number: 2,
			title: 'Most votes wins',
			description:
				'The candidate with the most votes in each constituency wins the seat — even if a majority of voters preferred someone else.'
		},
		{
			number: 3,
			title: 'Winner takes all',
			description:
				'Every vote cast for a losing candidate has no effect on the final result. There is no transfer, no consolation, no proportional adjustment.'
		}
	];
</script>

<!-- How it works -->
<section>
	<h2 class="section-header">How First Past the Post works</h2>
	<p>
		The UK is divided into 650 constituencies, each electing one Member of Parliament. On
		election day, every voter marks one candidate. The candidate who receives more votes than
		any other individual candidate wins the seat. There is no requirement for a majority — a
		candidate can win with 30% of the vote if no other candidate gets more. The party that wins
		the most seats across the country typically forms the government.
	</p>
	<div class="process-steps">
		{#each steps as step (step.number)}
			<StepCard number={step.number} title={step.title} description={step.description} />
		{/each}
	</div>
</section>

<!-- Why it was designed this way -->
<section>
	<h2 class="section-header">Why Britain uses this system</h2>
	<p>
		First Past the Post evolved when British politics was a contest between two parties. In a
		two-party system, the candidate with the most votes almost always has majority support, and
		elections reliably produce a clear winner. The system was never deliberately designed — it
		simply carried forward from a time when most constituencies had only two serious candidates.
	</p>
	<p>
		For much of the 20th century, Labour and the Conservatives together took over 90% of the
		vote. Under those conditions, First Past the Post worked roughly as expected: it translated
		the national mood into a workable parliamentary majority. The problems that now dominate
		the reform debate became visible only as the party system fragmented.
	</p>
</section>

<!-- What goes wrong -->
<section>
	<h2 class="section-header">What goes wrong with more than two parties</h2>
	<p>
		In 2024, seven parties won seats in the House of Commons, and several more received
		significant vote shares. First Past the Post was not built for this. The more parties
		compete, the more its structural distortions show up.
	</p>
	<div class="problem-cards">
		<article class="problem-card">
			<h3>Wasted votes</h3>
			<p>
				In 2024, roughly 14.8 million votes — more than a third of all votes cast — went to
				losing candidates and had zero effect on the composition of Parliament. In safe seats,
				voting for either the incumbent or the opposition is functionally meaningless.
			</p>
		</article>
		<article class="problem-card">
			<h3>Seats do not match votes</h3>
			<p>
				Labour won 63% of seats with 34% of the vote. Reform UK won 14% of the vote but just
				0.8% of seats. The relationship between how people vote and what Parliament looks like
				is increasingly arbitrary.
			</p>
		</article>
		<article class="problem-card">
			<h3>Tactical voting</h3>
			<p>
				Millions of voters mark a candidate who is not their first choice, because supporting
				their actual preference would "let the other side in." This is a rational response to
				the system, not voter ignorance — and it means Parliament never sees what voters
				actually want.
			</p>
		</article>
		<article class="problem-card">
			<h3>Safe seats</h3>
			<p>
				Most constituencies have not changed hands in decades. Parties concentrate resources
				on the small number of marginals that might swing, ignoring voters in seats that are
				already decided. Roughly two-thirds of voters live in constituencies where the result
				is a foregone conclusion.
			</p>
		</article>
		<article class="problem-card">
			<h3>Vote splitting</h3>
			<p>
				When two similar parties compete, they split the vote of their shared support base and
				both lose to a candidate that most voters in the constituency would have rejected. This
				is why parties spend so much energy on "don't vote for them, vote for us" messaging
				rather than policy.
			</p>
		</article>
		<article class="problem-card">
			<h3>Manufactured majorities</h3>
			<p>
				A party can win a commanding parliamentary majority with a relatively small share of
				the national vote, if that vote is distributed efficiently across marginal seats. This
				gives the winning party far more power than its level of public support justifies.
			</p>
		</article>
	</div>
</section>

<!-- The 2024 election -->
<section>
	<h2 class="section-header">The 2024 election in numbers</h2>
	<p>
		The 2024 General Election produced one of the most disproportionate results in British
		history. It is a useful case study for understanding how First Past the Post behaves under
		current conditions.
	</p>
	<div class="stats-table-wrap">
		<table class="stats-table">
			<thead>
				<tr>
					<th>Party</th>
					<th>Vote share</th>
					<th>Seats</th>
					<th>Seat share</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Labour</td>
					<td>33.7%</td>
					<td>411</td>
					<td class="highlight">63.2%</td>
				</tr>
				<tr>
					<td>Conservative</td>
					<td>23.7%</td>
					<td>121</td>
					<td>18.6%</td>
				</tr>
				<tr>
					<td>Reform UK</td>
					<td>14.3%</td>
					<td>5</td>
					<td class="highlight">0.8%</td>
				</tr>
				<tr>
					<td>Liberal Democrats</td>
					<td>12.2%</td>
					<td>72</td>
					<td>11.1%</td>
				</tr>
				<tr>
					<td>Green</td>
					<td>6.8%</td>
					<td>4</td>
					<td class="highlight">0.6%</td>
				</tr>
				<tr>
					<td>SNP</td>
					<td>2.5%</td>
					<td>9</td>
					<td>1.4%</td>
				</tr>
			</tbody>
		</table>
	</div>
	<p>
		Labour's seat share was nearly double its vote share. Reform UK received roughly one in
		seven votes nationally but won just five seats. The Greens had 6.8% of the vote and four
		seats. Under any proportional system, the composition of Parliament would have looked
		fundamentally different.
	</p>
</section>

<!-- What defenders say -->
<section>
	<h2 class="section-header">The case for keeping it</h2>
	<div class="argument-cards">
		<article class="argument-card">
			<h3>Simplicity</h3>
			<p>
				The ballot is as simple as it gets: one mark, one candidate. Counting is fast and
				transparent. Every voter understands what they are doing. No formula, no transfer
				mechanism, no quota to explain.
			</p>
		</article>
		<article class="argument-card">
			<h3>Constituency link</h3>
			<p>
				Each area has one identifiable MP. Voters know who represents them and can hold that
				person directly accountable. This connection is weaker or absent in systems with
				larger multi-member districts.
			</p>
		</article>
		<article class="argument-card">
			<h3>Clear outcomes</h3>
			<p>
				First Past the Post tends to produce single-party majorities, which means the
				government can act decisively without negotiating coalition agreements. Defenders
				argue that this stability outweighs the cost in proportionality.
			</p>
		</article>
		<article class="argument-card">
			<h3>Familiarity</h3>
			<p>
				Britain has used this system for so long that the risks of change may seem higher than
				the costs of the status quo. Any new system requires public education, new
				infrastructure, and a period of adjustment.
			</p>
		</article>
	</div>
</section>

<!-- What critics say -->
<section>
	<h2 class="section-header">The case against</h2>
	<div class="argument-cards">
		<article class="argument-card">
			<h3>Most voters are unrepresented</h3>
			<p>
				In 2024, over half of all votes had no bearing on the result. When most voters'
				preferences are discarded, the resulting Parliament does not reflect the country.
			</p>
		</article>
		<article class="argument-card">
			<h3>It distorts incentives</h3>
			<p>
				Parties optimise for marginal seats rather than broad support. Policies are shaped by
				what plays well in a few dozen swing constituencies, not by what the country as a
				whole wants.
			</p>
		</article>
		<article class="argument-card">
			<h3>It suppresses new parties</h3>
			<p>
				A new party needs to win concentrated local pluralities to gain seats. Broad national
				support spread evenly across constituencies translates into very few or zero seats,
				as Reform UK's 2024 result demonstrated.
			</p>
		</article>
		<article class="argument-card">
			<h3>Majority rule is increasingly fictional</h3>
			<p>
				The argument for decisive majorities rests on the assumption that the winning party
				has broad public backing. When a party can win a supermajority with a third of the
				vote, that assumption no longer holds.
			</p>
		</article>
	</div>
</section>

<!-- Compared to alternatives -->
<section>
	<h2 class="section-header">How it compares to the alternatives on this site</h2>
	<div class="comparison-cards">
		<article class="comparison-card">
			<h3>vs Approval Voting</h3>
			<p>
				Approval voting keeps single-member constituencies and a simple ballot but lets
				voters mark every candidate they find acceptable. This eliminates vote splitting and
				tactical voting without changing the structure of Parliament.
			</p>
		</article>
		<article class="comparison-card">
			<h3>vs the Single Transferable Vote</h3>
			<p>
				The Single Transferable Vote uses larger multi-member districts where voters rank
				candidates. It produces proportional results while preserving a direct link between
				voters and individual candidates — but it is more complex to count.
			</p>
		</article>
		<article class="comparison-card">
			<h3>vs the Additional Member System</h3>
			<p>
				The Additional Member System keeps a local MP for each constituency but adds a
				second tier of seats allocated by party vote share. It is already used in Scotland
				and Wales. The trade-off is two classes of MP and a larger parliament.
			</p>
		</article>
		<article class="comparison-card">
			<h3>vs Party-List Proportional Representation</h3>
			<p>
				Party-list systems allocate seats purely by party vote share in larger regional
				districts. They are the most proportional option but sacrifice the individual
				constituency link that First Past the Post provides.
			</p>
		</article>
	</div>
</section>

<!-- FAQ -->
<section>
	<h2 class="section-header">Common questions</h2>
	<div class="faq-section">
		<FAQItem question="Does First Past the Post always produce strong governments?">
			<p>
				Not necessarily. In 2010, no party won a majority and a coalition was formed — the
				first in decades. As the vote fragments further among multiple parties, hung
				parliaments become more likely even under First Past the Post. The system's ability
				to manufacture majorities depends on a two-party dynamic that no longer holds.
			</p>
		</FAQItem>

		<FAQItem question="Is it true that FPTP keeps extremists out?">
			<p>
				The high threshold for winning a seat (a local plurality) does make it harder for
				fringe parties to gain representation. But it also shuts out many mainstream parties
				whose support is geographically spread rather than concentrated. The barrier is
				against any party without local strongholds, not specifically against extreme views.
			</p>
		</FAQItem>

		<FAQItem question="Why don't other countries use it?">
			<p>
				Most democracies that inherited First Past the Post from Britain have moved away from
				it. New Zealand switched to a mixed proportional system in 1996. Canada has had
				multiple commissions recommending change. Among major democracies, only the UK, the
				US, and India still use single-member plurality for national elections — and in all
				three, reform is an active debate.
			</p>
		</FAQItem>

		<FAQItem question="Did the UK ever vote on changing the system?">
			<p>
				Yes. In 2011, a referendum offered a switch to the Alternative Vote (a ranked-choice
				system for single-member seats). It was rejected 68% to 32%. Critics of the
				referendum argue that the Alternative Vote was a poor choice of alternative — it is
				not proportional — and that the campaign was heavily one-sided. The result did not
				settle the broader question of whether First Past the Post is fit for a multi-party
				democracy.
			</p>
		</FAQItem>

		<FAQItem question="What would happen if Britain switched away from FPTP?">
			<p>
				The answer depends entirely on which system replaced it. A proportional system would
				likely produce coalition governments, a more diverse Parliament, and the end of safe
				seats. An approval-based system in single-member constituencies would keep the
				current structure but reduce tactical voting and vote splitting. The effects are not
				unknowable — dozens of countries provide evidence for how each alternative performs
				in practice.
			</p>
		</FAQItem>
	</div>
</section>

<style>
	section {
		display: grid;
		gap: 1rem;
	}

	section > p {
		font-size: 1.05rem;
		line-height: 1.7;
	}

	section :global(.process-steps) {
		grid-template-columns: 1fr;
	}

	.problem-cards,
	.argument-cards,
	.comparison-cards {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	.problem-card,
	.argument-card,
	.comparison-card {
		background: var(--surface-subtle-gradient);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		padding: 1.25rem;
		box-shadow: var(--shadow-soft);
	}

	.problem-card h3,
	.argument-card h3,
	.comparison-card h3 {
		margin: 0 0 0.5rem;
		color: var(--accent-text);
		font-size: 1.1rem;
	}

	.problem-card p,
	.argument-card p,
	.comparison-card p {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.65;
	}

	/* Stats table */
	.stats-table-wrap {
		overflow-x: auto;
	}

	.stats-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.95rem;
	}

	.stats-table th,
	.stats-table td {
		padding: 0.65rem 1rem;
		text-align: left;
		border-bottom: 1px solid var(--border-color);
	}

	.stats-table th {
		font-weight: 700;
		color: var(--text-dark);
		background: var(--surface-muted);
	}

	.stats-table td {
		color: var(--text-color);
	}

	.stats-table .highlight {
		font-weight: 700;
		color: var(--accent-text);
	}
</style>
