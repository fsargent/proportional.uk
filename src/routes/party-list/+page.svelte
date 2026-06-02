<script lang="ts">
	import MethodPageBody from '$lib/components/MethodPageBody.svelte';
	import MethodNav from '$lib/components/MethodNav.svelte';
	import FAQItem from '$lib/components/FAQItem.svelte';

	type ListType = {
		name: string;
		voterPower: string;
		partyControl: string;
		description: string;
		examples: string;
	};

	const listTypes: ListType[] = [
		{
			name: 'Closed List',
			voterPower: 'Low',
			partyControl: 'High',
			description:
				'The party decides the order of candidates before the election. Voters choose a party and nothing else. Whoever the party placed at the top of the list gets the seats.',
			examples: 'Israel, Spain, South Africa, Argentina'
		},
		{
			name: 'Open List',
			voterPower: 'High',
			partyControl: 'Low',
			description:
				'Voters can vote for individual candidates within a party. The candidates with the most personal votes rise to the top of the list, regardless of the party\'s original ordering.',
			examples: 'Finland, Brazil, Poland, Latvia'
		},
		{
			name: 'Flexible List',
			voterPower: 'Medium',
			partyControl: 'Medium',
			description:
				'The party sets a default candidate order, but voters can express preferences. A candidate needs enough personal votes to override the party\'s ranking — otherwise the default order holds.',
			examples: 'Sweden, Belgium, Netherlands, Austria'
		}
	];

	type Threshold = {
		country: string;
		threshold: string;
		notes: string;
	};

	const thresholds: Threshold[] = [
		{ country: 'Turkey', threshold: '7%', notes: 'Highest in Europe; raised from 10% in 2022' },
		{ country: 'Germany', threshold: '5%', notes: 'Or 3 constituency seats (mixed system)' },
		{ country: 'Sweden', threshold: '4%', notes: 'Or 12% in a single constituency' },
		{ country: 'Israel', threshold: '3.25%', notes: 'Single nationwide district' },
		{ country: 'Denmark', threshold: '2%', notes: 'Compensatory seats lower the effective bar' },
		{ country: 'Netherlands', threshold: '0.67%', notes: 'Effectively one seat\'s worth of votes' }
	];

	const exampleVotes = { A: 10000, B: 8000, C: 3000 };
	const seatsToAllocate = 5;

	function computeDhondt(): { party: string; quotient: number }[] {
		const winners: { party: string; quotient: number }[] = [];
		const seats = { A: 0, B: 0, C: 0 };
		for (let i = 0; i < seatsToAllocate; i++) {
			const quotients = {
				A: exampleVotes.A / (seats.A + 1),
				B: exampleVotes.B / (seats.B + 1),
				C: exampleVotes.C / (seats.C + 1)
			};
			const winner = (Object.entries(quotients) as [string, number][]).sort((a, b) => b[1] - a[1])[0];
			winners.push({ party: winner[0], quotient: Math.round(winner[1]) });
			seats[winner[0] as keyof typeof seats]++;
		}
		return winners;
	}

	function computeSainteLague(): { party: string; quotient: number }[] {
		const winners: { party: string; quotient: number }[] = [];
		const seats = { A: 0, B: 0, C: 0 };
		for (let i = 0; i < seatsToAllocate; i++) {
			const quotients = {
				A: exampleVotes.A / (2 * seats.A + 1),
				B: exampleVotes.B / (2 * seats.B + 1),
				C: exampleVotes.C / (2 * seats.C + 1)
			};
			const winner = (Object.entries(quotients) as [string, number][]).sort((a, b) => b[1] - a[1])[0];
			winners.push({ party: winner[0], quotient: Math.round(winner[1]) });
			seats[winner[0] as keyof typeof seats]++;
		}
		return winners;
	}

	function countSeats(results: { party: string }[]): Record<string, number> {
		const counts: Record<string, number> = { A: 0, B: 0, C: 0 };
		for (const r of results) counts[r.party]++;
		return counts;
	}

	const dhondtResults = computeDhondt();
	const slResults = computeSainteLague();
	const dhondtSeats = countSeats(dhondtResults);
	const slSeats = countSeats(slResults);
</script>

<svelte:head>
	<title>Party-List Proportional Representation — How It Works</title>
	<meta
		name="description"
		content="A comprehensive guide to party-list proportional representation: open vs closed lists, electoral thresholds, D'Hondt vs Sainte-Laguë allocation, and where it is used around the world."
	/>
</svelte:head>

<section class="method-page">
	<aside class="rail">
		<MethodNav current="party-list" />
	</aside>
	<div class="page-body">
		<MethodPageBody methodId="party-list" title="Party-List Proportional Representation">
			{#snippet mechanics()}
				<p>
					The core idea is straightforward: voters choose a party, and seats in parliament are divided
					in proportion to how many votes each party received. A party that wins 30% of the vote gets
					roughly 30% of the seats. The differences between party-list systems come down to three
					questions: how much say voters get over which candidates fill those seats, what minimum vote
					share a party needs to qualify, and which formula is used to convert votes into seat numbers.
				</p>

				<p class="ballot-intro">
					The ballot itself looks different depending on which kind of list system is in use. Two
					typical examples — same election, two ballot styles — make the difference concrete:
				</p>

				<div class="ballot-pair">
					<article class="ballot-mock">
						<header class="ballot-header">
							<h3>Closed-list ballot</h3>
							<p class="ballot-meta">e.g. Israel, Spain, South Africa</p>
						</header>
						<div class="ballot-body">
							<p class="ballot-instruction">Mark <strong>one party</strong></p>
							<ul class="ballot-options">
								<li><span class="check check-square"></span><span>Labour</span></li>
								<li><span class="check check-square checked"></span><span>Liberal Democrats</span></li>
								<li><span class="check check-square"></span><span>Conservative</span></li>
								<li><span class="check check-square"></span><span>Green</span></li>
								<li><span class="check check-square"></span><span>Reform UK</span></li>
							</ul>
						</div>
						<footer class="ballot-footnote">
							Your vote sets each party's share of the seats. Whoever the party put at the top of its
							list takes the seats it wins, in that order.
						</footer>
					</article>

					<article class="ballot-mock">
						<header class="ballot-header">
							<h3>Open-list ballot</h3>
							<p class="ballot-meta">e.g. Finland, Brazil, Poland</p>
						</header>
						<div class="ballot-body">
							<p class="ballot-instruction">
								Mark <strong>one candidate</strong>. Your vote also counts for that candidate's party.
							</p>
							<div class="party-block">
								<h4>Labour</h4>
								<ul class="ballot-options">
									<li><span class="check check-circle"></span><span>Sarah Johnson</span></li>
									<li><span class="check check-circle"></span><span>James Mitchell</span></li>
									<li><span class="check check-circle"></span><span>Aisha Patel</span></li>
								</ul>
							</div>
							<div class="party-block">
								<h4>Liberal Democrats</h4>
								<ul class="ballot-options">
									<li><span class="check check-circle"></span><span>Tom Wright</span></li>
									<li><span class="check check-circle checked"></span><span>Priya Sharma</span></li>
								</ul>
							</div>
							<div class="party-block">
								<h4>Conservative</h4>
								<ul class="ballot-options">
									<li><span class="check check-circle"></span><span>Emma Williams</span></li>
									<li><span class="check check-circle"></span><span>Robert Davies</span></li>
								</ul>
							</div>
							<div class="party-block">
								<h4>Green</h4>
								<ul class="ballot-options">
									<li><span class="check check-circle"></span><span>Daniel Okoro</span></li>
								</ul>
							</div>
						</div>
						<footer class="ballot-footnote">
							Your vote counts for the party total <em>and</em> lifts that candidate up the party's list,
							so personal popularity changes who actually wins seats.
						</footer>
					</article>
				</div>

				<h3>Open, closed, and flexible lists</h3>
				<p>
					The biggest practical difference between party-list systems is how much control voters have
					over which candidates actually take the seats their party wins. This ranges from none at all
					(closed lists) to full control (open lists), with a middle ground (flexible lists) that lets
					voters override the party's order if enough of them agree.
				</p>
				<div class="list-comparison">
					{#each listTypes as listType (listType.name)}
						<article class="list-card">
							<h4>{listType.name}</h4>
							<div class="list-meta">
								<span class="meta-tag">Voter power: {listType.voterPower}</span>
								<span class="meta-tag">Party control: {listType.partyControl}</span>
							</div>
							<p>{listType.description}</p>
							<p class="list-examples">Used in: {listType.examples}</p>
						</article>
					{/each}
				</div>

				<h3>Electoral thresholds</h3>
				<p>
					Most party-list systems set a minimum vote share that a party must reach before it qualifies
					for any seats. The purpose is to prevent extreme fragmentation — a parliament with dozens of
					tiny parties, each holding one or two seats, can make stable government difficult. But higher
					thresholds also shut out smaller parties that may represent real constituencies of voters.
				</p>
				<div class="threshold-table-wrap">
					<table class="threshold-table">
						<thead>
							<tr>
								<th>Country</th>
								<th>Threshold</th>
								<th>Notes</th>
							</tr>
						</thead>
						<tbody>
							{#each thresholds as t (t.country)}
								<tr>
									<td>{t.country}</td>
									<td class="threshold-value">{t.threshold}</td>
									<td class="threshold-notes">{t.notes}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
				<p>
					The trade-off is real. Germany's 5% threshold kept the Bundestag manageable for decades but
					also excluded parties with millions of supporters. The Netherlands' near-zero threshold
					produces a highly fragmented parliament that typically requires complex coalition negotiations.
					There is no objectively correct number — it depends on how much a country values broad
					representation versus governmental stability.
				</p>

				<h3>How votes become seats: allocation methods</h3>
				<p>
					Once you know each party's vote total, you need a formula to convert those totals into
					seats. We recommend <strong>Sainte-Laguë</strong> as the default — it is the most
					proportional of the common methods and does not systematically advantage the largest
					parties. D'Hondt and Largest Remainder are the main alternatives; both have known biases
					that Sainte-Laguë largely avoids.
				</p>

				<div class="method-cards">
					<article class="method-card method-card-recommended">
						<h4>Sainte-Laguë <span class="recommended-tag">recommended</span></h4>
						<p class="method-aka">Also called the Webster method</p>
						<p>
							Divide each party's vote total by 1, then 3, then 5, then 7, and so on (the odd
							numbers). This produces the most proportional results: small parties are not
							systematically penalised, large parties are not systematically rewarded, and the
							outcome tracks vote shares more closely than any other widely used method.
						</p>
						<p class="method-used">Used in: Sweden, Norway, Denmark, Germany (Bundestag), New Zealand (party list tier), Latvia</p>
					</article>

					<article class="method-card">
						<h4>D'Hondt</h4>
						<p class="method-aka">Also called the Jefferson method</p>
						<p>
							Divide each party's vote total by 1, then 2, then 3, and so on. The highest quotients
							across all parties win seats. This method <strong>systematically favours larger
							parties</strong> because their early quotients (divided by 1 and 2) tend to stay
							high — which is why we recommend Sainte-Laguë instead.
						</p>
						<p class="method-used">Used in: Spain, Portugal, Belgium, Finland, Poland, Argentina, Japan (party list tier)</p>
					</article>

					<article class="method-card">
						<h4>Largest Remainder</h4>
						<p class="method-aka">Using the Hare quota</p>
						<p>
							Divide total votes by total seats to get a quota. Each party gets one seat per full
							quota of votes. Leftover seats go to the parties with the largest remaining
							fractions. Simple and intuitive, but can produce paradoxes where winning more votes
							costs a party a seat.
						</p>
						<p class="method-used">Used in: Italy (historically), Hong Kong, Colombia, Tunisia</p>
					</article>
				</div>
			{/snippet}

			{#snippet workedExample()}
				<p>
					Three parties competing for {seatsToAllocate} seats. Party A received {exampleVotes.A.toLocaleString()} votes,
					Party B received {exampleVotes.B.toLocaleString()}, and Party C received {exampleVotes.C.toLocaleString()}.
					Same vote totals, two methods, two different outcomes — Sainte-Laguë gives a fairer result.
				</p>

				<div class="example-grid">
					<div class="example-block">
						<h3>Sainte-Laguë allocation (recommended)</h3>
						<table class="alloc-table">
							<thead>
								<tr>
									<th>Seat</th>
									<th>Winning party</th>
									<th>Quotient</th>
								</tr>
							</thead>
							<tbody>
								{#each slResults as result, i}
									<tr>
										<td>{i + 1}</td>
										<td>Party {result.party}</td>
										<td>{result.quotient.toLocaleString()}</td>
									</tr>
								{/each}
							</tbody>
						</table>
						<p class="seat-summary">
							Result: A = {slSeats.A}, B = {slSeats.B}, C = {slSeats.C}
						</p>
					</div>

					<div class="example-block">
						<h3>D'Hondt allocation</h3>
						<table class="alloc-table">
							<thead>
								<tr>
									<th>Seat</th>
									<th>Winning party</th>
									<th>Quotient</th>
								</tr>
							</thead>
							<tbody>
								{#each dhondtResults as result, i}
									<tr>
										<td>{i + 1}</td>
										<td>Party {result.party}</td>
										<td>{result.quotient.toLocaleString()}</td>
									</tr>
								{/each}
							</tbody>
						</table>
						<p class="seat-summary">
							Result: A = {dhondtSeats.A}, B = {dhondtSeats.B}, C = {dhondtSeats.C}
						</p>
					</div>
				</div>

				<p>
					Sainte-Laguë gives Party C a seat — a fair reflection of its 14% of the vote. D'Hondt
					shuts Party C out entirely, handing all five seats to the larger parties. This is the
					systematic large-party bias built into D'Hondt's divisors, and it's the main reason we
					recommend Sainte-Laguë for any new UK reform.
				</p>
			{/snippet}

			{#snippet strengths()}
				<div class="tradeoff-grid">
					<article class="tradeoff-card">
						<h3>Strong proportionality</h3>
						<p>
							Party-list systems produce some of the most proportional results of any electoral method.
							Seats closely track votes, which means fewer wasted votes and less distortion than
							single-member systems.
						</p>
					</article>
					<article class="tradeoff-card">
						<h3>Simpler than ranking</h3>
						<p>
							The ballot is straightforward — pick a party, and in open-list variants, mark a preferred
							candidate. There is no need to rank multiple candidates in order, which reduces ballot
							complexity and counting time.
						</p>
					</article>
				</div>
			{/snippet}

			{#snippet tradeoffs()}
				<div class="tradeoff-grid">
					<article class="tradeoff-card">
						<h3>Weaker local link</h3>
						<p>
							Because districts are large (or nationwide), voters typically do not have a single
							identifiable local representative. This is the most common criticism in countries like
							the UK that value the constituency link.
						</p>
					</article>
					<article class="tradeoff-card">
						<h3>Party control varies</h3>
						<p>
							Closed lists give party leadership significant power over who enters parliament. Open and
							flexible lists shift that power toward voters, but at the cost of more complex ballots and
							intra-party competition.
						</p>
					</article>
				</div>
			{/snippet}

			{#snippet whereUsed()}
				<p>
					Party-list proportional representation is the most widely used electoral system in the world.
					Most European democracies use some variant, as do many countries in Latin America, Africa, and
					Asia. The specific combination of list type, threshold, and allocation method varies
					considerably.
				</p>
				<div class="usage-grid">
					<article class="usage-card">
						<h3>Closed-list countries</h3>
						<p>
							Israel (single nationwide district, 3.25% threshold), Spain (provincial districts, D'Hondt),
							South Africa (national and regional lists), Russia (parallel system, party-list component),
							Argentina (provincial districts).
						</p>
					</article>
					<article class="usage-card">
						<h3>Open-list countries</h3>
						<p>
							Finland (D'Hondt, no threshold in practice), Brazil (state-level districts, open list with
							party coalitions), Poland (5% threshold, D'Hondt), Latvia (Sainte-Laguë), Czech Republic
							(D'Hondt, 5% threshold).
						</p>
					</article>
					<article class="usage-card">
						<h3>Flexible-list countries</h3>
						<p>
							Sweden (4% threshold, Sainte-Laguë), Belgium (D'Hondt, flexible with preference threshold),
							Netherlands (D'Hondt, near-zero threshold, 150-seat chamber), Austria (regional and federal
							tiers), Denmark (Sainte-Laguë with compensatory seats).
						</p>
					</article>
				</div>
			{/snippet}

			{#snippet faq()}
				<div class="faq-section">
					<FAQItem question="Do I lose my local MP?">
						<p>
							In a pure party-list system, yes — there are no single-member constituencies. Instead,
							you would have several MPs representing a larger region. Some countries address this by
							using a mixed system (like Germany's Additional Member System) that keeps local MPs
							alongside a party-list tier.
						</p>
					</FAQItem>

					<FAQItem question="Can independent candidates stand?">
						<p>
							It depends on the rules. In most party-list systems, candidates must be on a party's list.
							Some countries allow independent lists or single-candidate parties, but the system is
							fundamentally designed around parties. This is one of its limitations compared to
							candidate-centred systems like the Single Transferable Vote or approval voting.
						</p>
					</FAQItem>

					<FAQItem question="What stops extremist parties getting seats?">
						<p>
							Electoral thresholds are the main mechanism. A 5% threshold means a party needs roughly
							one in twenty votes before it wins any seats at all. Countries set this bar based on their
							own judgment about the trade-off between representation and fragmentation. Some also ban
							parties that violate constitutional principles.
						</p>
					</FAQItem>

					<FAQItem question="Which version would work best for the UK?">
						<p>
							That depends on priorities. An open or flexible list would give voters more say over
							candidates, which matters in a country used to choosing individual MPs. Regional districts
							(rather than a single national list) would preserve some geographic connection. A moderate
							threshold (3–5%) would prevent extreme fragmentation while still allowing new parties to
							break through. But the UK's strong tradition of local constituency representation is the
							main reason party-list PR has rarely featured in British reform debates — most proposals
							focus on systems that keep some form of local MP.
						</p>
					</FAQItem>

					<FAQItem question="How does this compare to the other systems on this site?">
						<p>
							Party-list PR is the most party-centred system covered here. The Single Transferable Vote
							and approval-based systems are candidate-centred — voters choose people, not parties. The
							Additional Member System is a hybrid that uses a party-list tier alongside local
							constituencies. Each approach makes different trade-offs between proportionality, voter
							choice, and the local link.
						</p>
					</FAQItem>
				</div>
			{/snippet}
		</MethodPageBody>
	</div>
</section>

<style>
	.method-page { display: grid; gap: 2rem; max-width: 54rem; margin: 0 auto; }
	.page-body { display: grid; gap: 2rem; min-width: 0; }
	.rail { display: none; }

	.ballot-intro {
		margin: 0;
		color: var(--text-color);
	}

	.ballot-pair {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.25rem;
	}

	.ballot-mock {
		display: flex;
		flex-direction: column;
		gap: 0;
		background: #fffdf7;
		border: 1px solid var(--border-strong);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-soft);
		overflow: hidden;
		font-family: 'Times New Roman', Times, serif;
	}

	.ballot-header {
		padding: 0.85rem 1.1rem 0.6rem;
		border-bottom: 2px solid var(--text-dark);
	}

	.ballot-header h3 {
		margin: 0;
		font-family: ui-sans-serif, system-ui, sans-serif;
		font-size: 1rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-dark);
	}

	.ballot-meta {
		margin: 0.2rem 0 0;
		font-family: ui-sans-serif, system-ui, sans-serif;
		font-size: 0.78rem;
		color: var(--text-soft);
		font-style: italic;
	}

	.ballot-body {
		padding: 0.9rem 1.1rem;
		flex: 1;
	}

	.ballot-instruction {
		margin: 0 0 0.85rem;
		font-family: ui-sans-serif, system-ui, sans-serif;
		font-size: 0.88rem;
		color: var(--text-color);
	}

	.ballot-options {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.5rem;
	}

	.ballot-options li {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		font-size: 1rem;
		color: var(--text-dark);
		margin: 0;
	}

	.check {
		display: inline-block;
		width: 1.05rem;
		height: 1.05rem;
		border: 1.5px solid var(--text-dark);
		flex-shrink: 0;
		position: relative;
	}

	.check-circle {
		border-radius: 999px;
	}

	.check.checked::after {
		content: '✓';
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		font-family: ui-sans-serif, system-ui, sans-serif;
		font-size: 0.85rem;
		font-weight: 700;
		color: var(--text-dark);
		line-height: 1;
	}

	.party-block {
		margin-top: 0.85rem;
	}

	.party-block:first-child {
		margin-top: 0;
	}

	.party-block h4 {
		margin: 0 0 0.4rem;
		padding-bottom: 0.25rem;
		font-family: ui-sans-serif, system-ui, sans-serif;
		font-size: 0.92rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--text-dark);
		border-bottom: 1px solid var(--border-color);
	}

	.party-block .ballot-options li {
		font-size: 0.95rem;
		padding-left: 0.4rem;
	}

	.ballot-footnote {
		padding: 0.75rem 1.1rem 0.95rem;
		border-top: 1px solid var(--border-color);
		font-family: ui-sans-serif, system-ui, sans-serif;
		font-size: 0.85rem;
		line-height: 1.55;
		color: var(--text-soft);
		background: var(--surface-color);
	}

	.ballot-footnote em {
		font-style: italic;
		color: var(--text-color);
	}

	@media (prefers-color-scheme: dark) {
		.ballot-mock {
			background: #f4f1e8;
			color: #1a1f25;
		}
		.ballot-mock h3,
		.ballot-mock h4,
		.ballot-options li {
			color: #1a1f25;
		}
		.ballot-meta,
		.ballot-instruction {
			color: #4b5b69;
		}
		.check {
			border-color: #1a1f25;
		}
		.check.checked::after {
			color: #1a1f25;
		}
		.ballot-footnote {
			background: #ece8de;
			color: #4b5b69;
			border-top-color: #c8c2b3;
		}
		.party-block h4 {
			border-bottom-color: #c8c2b3;
		}
	}

	@media (max-width: 720px) {
		.ballot-pair {
			grid-template-columns: 1fr;
		}
	}

	.list-comparison {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	.list-card {
		background: var(--surface-subtle-gradient);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		padding: 1.25rem;
		box-shadow: var(--shadow-soft);
	}

	.list-card h4 {
		margin: 0 0 0.5rem;
		color: var(--text-dark);
		font-size: 1.15rem;
	}

	.list-card p {
		margin: 0 0 0.75rem;
		font-size: 0.95rem;
		line-height: 1.6;
	}

	.list-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.meta-tag {
		display: inline-block;
		padding: 0.25rem 0.6rem;
		border-radius: 999px;
		background: var(--surface-overlay);
		border: 1px solid var(--accent-border);
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--accent-text);
	}

	.list-examples {
		font-size: 0.88rem;
		color: var(--text-soft);
		font-style: italic;
		margin-bottom: 0;
	}

	/* Threshold table */
	.threshold-table-wrap {
		overflow-x: auto;
	}

	.threshold-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.95rem;
	}

	.threshold-table th,
	.threshold-table td {
		padding: 0.65rem 1rem;
		text-align: left;
		border-bottom: 1px solid var(--border-color);
	}

	.threshold-table th {
		font-weight: 700;
		color: var(--text-dark);
		background: var(--surface-muted);
	}

	.threshold-table td {
		color: var(--text-color);
	}

	.threshold-value {
		font-weight: 700;
		color: var(--accent-text);
	}

	.threshold-notes {
		font-size: 0.9rem;
		color: var(--text-soft);
	}

	/* Allocation method cards */
	.method-cards {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	.method-card {
		background: var(--surface-subtle-gradient);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		padding: 1.25rem;
		box-shadow: var(--shadow-soft);
	}

	.method-card h4 {
		margin: 0 0 0.25rem;
		color: var(--text-dark);
		font-size: 1.15rem;
	}

	.recommended-tag {
		display: inline-block;
		margin-left: 0.4rem;
		padding: 0.1rem 0.5rem;
		border-radius: 999px;
		background: var(--success-bg, var(--surface-overlay));
		border: 1px solid var(--success-border, var(--accent-border));
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--success-text, var(--accent-text));
		vertical-align: middle;
	}

	.method-aka {
		margin: 0 0 0.75rem;
		font-size: 0.88rem;
		color: var(--text-soft);
		font-style: italic;
	}

	.method-card p {
		font-size: 0.95rem;
		line-height: 1.6;
		margin: 0 0 0.75rem;
	}

	.method-used {
		font-size: 0.88rem;
		color: var(--text-soft);
		margin-bottom: 0;
	}

	/* Worked example */
	.example-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.5rem;
	}

	.example-block {
		background: var(--surface-subtle-gradient);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		padding: 1.25rem;
		box-shadow: var(--shadow-soft);
	}

	.example-block h3 {
		margin: 0 0 0.75rem;
		font-size: 1.05rem;
		color: var(--text-dark);
	}

	.alloc-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.92rem;
		margin-bottom: 0.75rem;
	}

	.alloc-table th,
	.alloc-table td {
		padding: 0.45rem 0.75rem;
		text-align: left;
		border-bottom: 1px solid var(--border-color);
	}

	.alloc-table th {
		font-weight: 700;
		color: var(--text-dark);
	}

	.alloc-table td {
		color: var(--text-color);
	}

	.seat-summary {
		font-weight: 700;
		color: var(--accent-text);
		font-size: 0.95rem;
		margin: 0;
	}

	/* Usage grid */
	.usage-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	.usage-card {
		background: var(--surface-subtle-gradient);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		padding: 1.25rem;
		box-shadow: var(--shadow-soft);
	}

	.usage-card h3 {
		margin: 0 0 0.5rem;
		color: var(--text-dark);
		font-size: 1.05rem;
	}

	.usage-card p {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.6;
	}

	/* Trade-offs */
	.tradeoff-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	.tradeoff-card {
		background: var(--surface-subtle-gradient);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		padding: 1.25rem;
		box-shadow: var(--shadow-soft);
	}

	.tradeoff-card h3 {
		margin: 0 0 0.5rem;
		color: var(--accent-text);
		font-size: 1.1rem;
	}

	.tradeoff-card p {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.65;
	}

	@media (max-width: 768px) {
		.example-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (min-width: 1280px) {
		.method-page {
			max-width: none;
			grid-template-columns: minmax(16rem, 1fr) minmax(0, 54rem) minmax(0, 1fr);
			column-gap: 2rem;
			align-items: start;
		}
		.rail { display: block; grid-column: 3; grid-row: 1; justify-self: start; width: 16rem; position: sticky; top: 1rem; }
		.page-body { grid-column: 2; grid-row: 1; }
	}
</style>
