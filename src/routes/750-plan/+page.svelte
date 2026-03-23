<script lang="ts">
	import { base } from '$app/paths';

	const headlineStats = [
		{ value: '650', label: 'constituency seats stay exactly as they are' },
		{ value: '100', label: 'extra seats are added from the national party vote' },
		{ value: '750', label: 'total seats, the same every election' },
		{ value: '2', label: 'ballots: one local, one national party vote' }
	] as const;

	const allocationSteps = [
		{
			title: 'Local elections stay as they are',
			description:
				'Every constituency keeps its current boundaries and elects one MP exactly as now. No local seat is abolished, merged, or recalculated.'
		},
		{
			title: 'Voters cast a national party vote',
			description:
				'Alongside the local ballot, each voter also chooses one party on a single UK-wide ballot.'
		},
		{
			title: 'That vote decides the 100 extra seats',
			description:
				'Those 100 seats are shared out by each party’s share of the national party vote. Local results do not change that calculation.'
		},
		{
			title: 'Parties fill those seats from their lists',
			description:
				'By default, parties use their own ordered closed list. If they want, they can let party members decide the order instead.'
		}
	] as const;

	const unchangedItems = [
		'All 650 constituency seats remain in place.',
		'Voters still choose a local MP in the usual way, but can select every candidate they like, and the candidate with the most votes wins.',
		'No constituency boundaries need redrawing for the reform itself.',
		'No local seat is taken away from any party because of the national count.'
	] as const;

	const changedItems = [
		'Parliament grows from 650 seats to 750 seats.',
		'Every voter gets a second ballot: a national party vote.',
		'100 extra seats are shared out using the national party vote.',
		'Parties may choose to let members decide list order through an internal election.'
	] as const;

	const listPrinciples = [
		{
			title: 'Default rule: parties choose the order',
			body:
				'The default is simple. Parties submit an ordered list and seats are filled from the top. Parties that want the familiar model can keep it.'
		},
		{
			title: 'Optional rule: members choose the order',
			body:
				'The law would let any party run a membership election to decide list order, using whatever ballot format and eligibility rules that party sets for itself.'
		},
		{
			title: 'Public support, party control',
			body:
				'The Electoral Commission would provide the practical infrastructure, but parties would still set their own rules. The state supports the process without trying to run the party.'
		}
	] as const;

	const ratchetEffects = [
		'The first major party to open its list can say, credibly, that it listens to its own members.',
		'Parties that keep closed lists can still do that, but they give up that argument.',
		'So the pressure moves toward more open internal democracy without forcing anyone to change overnight.'
	] as const;

	const lowAttackSurfacePoints = [
		'No constituency disappears, and no local MP is taken away.',
		'There is no complicated top-up rule linking the extra seats back to the local result.',
		'Parliament does not grow and shrink depending on the result. It stays at 750 seats.',
		'The national tier uses a seat-sharing rule written into law, not a moving political bargain.',
		'The reform can be summed up in one sentence: keep the 650 local seats, add 100 national seats.'
	] as const;

	const faqs = [
		{
			question: 'Does this change how I choose my local MP?',
			answer:
				'Yes, but only in one simple way. You still vote for your local MP on a local ballot, but instead of picking just one candidate, you can pick all the candidates you would be happy to elect. You also get a second ballot for a party.'
		},
		{
			question: 'Is this proportional representation?',
			answer:
				'Not fully, but it does move Westminster in a more proportional direction. The 100 extra seats are shared out in proportion to the national party vote. Just as important, the local ballot stops being first-past-the-post and becomes pick-all-you-like, so voters can support every candidate they like instead of trying to guess who is "viable". That local change does a lot of the heavy lifting: it cuts tactical voting, reduces vote-splitting, and makes local results more representative even before you add the national seats.'
		},
		{
			question: 'Why keep the total at 750 seats?',
			answer:
				'Because that keeps the system easy to explain and easy to trust. You always know how many seats there are, and you do not get extra seats added after the count to rebalance the result.'
		},
		{
			question: 'Do parties have to open their lists?',
			answer:
				'No. Closed lists remain the default. The proposal simply creates a lawful route for any party that wants members to choose the order, with public infrastructure available to support it.'
		}
	] as const;

	const technicalNotes = [
		{
			title: 'Seat formula',
			body:
				'The 100 national seats would be allocated using Sainte-Lague, a standard proportional seat-allocation formula.'
		},
		{
			title: 'System type',
			body:
				'This is mixed-member majoritarian, not mixed-member proportional. The national seats are added on top of the constituency results rather than used to top parties up.'
		},
		{
			title: 'Why the total stays at 750',
			body:
				'Because the local and national tiers are separate, there is no need for overhang seats or extra balancing seats. Parliament stays at 750 seats every time.'
		}
	] as const;

	const localCandidates = [
		{ name: 'Aisha Rahman', party: 'Labour' },
		{ name: 'James Carter', party: 'Conservative' },
		{ name: 'Megan Hughes', party: 'Liberal Democrat' },
		{ name: 'Tom Okafor', party: 'Green' },
		{ name: 'Rachel Morgan', party: 'Labour' },
		{ name: 'Daniel Foster', party: 'Conservative' },
		{ name: 'Sophie Ahmed', party: 'Green' },
		{ name: 'Ben Taylor', party: 'Reform UK' },
		{ name: 'Priya Shah', party: 'Independent' }
	] as const;

	const nationalParties = [
		{ name: 'Labour Party', note: 'Won seats in 2024' },
		{ name: 'Conservative Party', note: 'Won seats in 2024' },
		{ name: 'Liberal Democrats', note: 'Won seats in 2024' },
		{ name: 'Scottish National Party', note: 'Won seats in 2024' },
		{ name: 'Sinn Fein', note: 'Won seats in 2024' },
		{ name: 'Reform UK', note: 'Won seats in 2024' },
		{ name: 'Democratic Unionist Party', note: 'Won seats in 2024' },
		{ name: 'Green Party', note: 'Won seats in 2024' },
		{ name: 'Plaid Cymru', note: 'Won seats in 2024' },
		{ name: 'Social Democratic and Labour Party', note: 'Won seats in 2024' },
		{ name: 'Alliance Party', note: 'Won seats in 2024' },
		{ name: 'Traditional Unionist Voice', note: 'Won seats in 2024' },
		{ name: 'Ulster Unionist Party', note: 'Won seats in 2024' },
		{ name: 'Speaker', note: 'Won a seat in 2024' },
		{ name: 'Independent and other local winners', note: 'Won seats in 2024' }
	] as const;

	let selectedLocalCandidates = $state<Record<string, boolean>>({});
	let selectedNationalParty = $state<string | null>(null);
</script>

<svelte:head>
	<title>Keep 650 Constituencies, Add 100 National Seats</title>
	<meta
		name="description"
		content="A proposal for Westminster elections that keeps all 650 constituency seats, adds 100 extra seats from a national party vote, and leaves Parliament at 750 seats."
	/>
</svelte:head>

<section class="proposal-page">
	<div class="hero">
		<p class="eyebrow">Proposal</p>
		<h1>Keep the 650 constituency seats. Add 100 national seats.</h1>
		<p class="lede">
			This plan leaves every existing constituency untouched, adds a national tier of 100 seats,
			and keeps Parliament at 750 seats. Voters cast one ballot for their local MP and one national
			party vote. That second vote decides who gets the 100 extra seats.
		</p>
		<p class="hero-note">
			In plain English: the second vote adds seats. It does not cancel out or rebalance the local
			winners.
		</p>
	</div>

	<div class="stats-grid" aria-label="Proposal at a glance">
		{#each headlineStats as stat (stat.label)}
			<div class="stat-card">
				<div class="stat-value">{stat.value}</div>
				<p>{stat.label}</p>
			</div>
		{/each}
	</div>

	<section class="summary-band">
		<div>
			<h2>The pitch in one sentence</h2>
			<p>
				Keep the current Westminster map and the current local vote. Add a national party vote that
				shares out 100 extra seats, with no extra complication and no change to Parliament's size.
			</p>
		</div>
		<div class="summary-callout">
			<p class="callout-label">What this avoids</p>
			<p>
				No local seat losses. No seat subtraction. No Parliament size that changes after the count.
			</p>
		</div>
	</section>

	<section>
		<h2 class="section-header">How the system works</h2>
		<div class="process-grid">
			{#each allocationSteps as step, index (step.title)}
				<article class="process-card">
					<p class="process-number">{index + 1}</p>
					<h3>{step.title}</h3>
					<p>{step.description}</p>
				</article>
			{/each}
		</div>
	</section>

	<section>
		<h2 class="section-header">Two ballots, both easy to explain</h2>
		<div class="ballot-grid">
			<article class="ballot-panel">
				<div class="ballot-header">
					<p class="ballot-kicker">Ballot one</p>
					<h3>Local constituency ballot</h3>
					<p>Pick all the local candidates you would be happy to elect.</p>
				</div>
				<div class="ballot-paper">
					{#each localCandidates as candidate (candidate.name)}
						<label class="ballot-row" class:selected={selectedLocalCandidates[candidate.name]}>
							<input
								type="checkbox"
								bind:checked={selectedLocalCandidates[candidate.name]}
							/>
							<span>
								<strong>{candidate.name}</strong>
								<small>{candidate.party}</small>
							</span>
						</label>
					{/each}
				</div>
				<p class="ballot-footnote">
					{#if localCandidates.some((candidate) => selectedLocalCandidates[candidate.name])}
						Pick all you like. Every tick counts toward that candidate's total in your constituency.
						The candidate with the most votes wins.
					{:else}
						Try clicking one or more candidates. This ballot is not pick one. It is pick all you like.
					{/if}
				</p>
			</article>

			<article class="ballot-panel">
				<div class="ballot-header">
					<p class="ballot-kicker">Ballot two</p>
					<h3>National party vote</h3>
					<p>One vote for a party to decide the 100 extra seats.</p>
				</div>
				<div class="ballot-paper ballot-paper-scroll">
					{#each nationalParties as party (party.name)}
						<label class="ballot-row" class:selected={selectedNationalParty === party.name}>
							<input
								type="radio"
								name="national-ballot"
								value={party.name}
								bind:group={selectedNationalParty}
							/>
							<span>
								<strong>{party.name}</strong>
								<small>{party.note}. Counts only toward the 100 extra seats.</small>
							</span>
						</label>
					{/each}
				</div>
				<p class="ballot-footnote">
					{#if selectedNationalParty}
						You picked <strong>{selectedNationalParty}</strong>. This vote has no effect on who wins
						your constituency.
					{:else}
						Try clicking a party. This vote has no effect on who wins your constituency.
					{/if}
				</p>
			</article>
		</div>
	</section>

	<section>
		<h2 class="section-header">What changes and what does not</h2>
		<div class="change-grid">
			<article class="change-panel">
				<h3>What stays the same</h3>
				<ul>
					{#each unchangedItems as item (item)}
						<li>{item}</li>
					{/each}
				</ul>
			</article>
			<article class="change-panel accent">
				<h3>What changes</h3>
				<ul>
					{#each changedItems as item (item)}
						<li>{item}</li>
					{/each}
				</ul>
			</article>
		</div>
	</section>

	<section>
		<h2 class="section-header">Closed lists by default, more open lists if parties want them</h2>
		<p class="section-intro">
			The default rule is deliberately cautious: parties control their own list order unless they
			choose otherwise. That makes the reform easy to adopt, because it does not force parties to
			change unless they want to. But the legislation also creates a clear route for parties that
			do want to open the process up.
		</p>
		<div class="principles-grid">
			{#each listPrinciples as principle (principle.title)}
				<article class="principle-card">
					<h3>{principle.title}</h3>
					<p>{principle.body}</p>
				</article>
			{/each}
		</div>
		<div class="key-takeaway">
			<h3>Why this matters</h3>
			<ul>
				{#each ratchetEffects as point (point)}
					<li>{point}</li>
				{/each}
			</ul>
		</div>
	</section>

	<section>
		<h2 class="section-header">Why this is easy to adopt</h2>
		<p class="section-intro">
			This proposal asks very little of voters, parties, or constituency politics. It keeps the
			current local map, adds a clear second vote, and does not force parties to change how they
			choose their lists unless they want to.
		</p>
		<div class="attack-grid">
			{#each lowAttackSurfacePoints as point (point)}
				<article class="attack-card">
					<p>{point}</p>
				</article>
			{/each}
		</div>
	</section>

	<section>
		<h2 class="section-header">Common questions</h2>
		<div class="faq-grid">
			{#each faqs as item (item.question)}
				<article class="faq-card">
					<h3>{item.question}</h3>
					<p>{item.answer}</p>
				</article>
			{/each}
		</div>
	</section>

	<section>
		<h2 class="section-header">Technical notes</h2>
		<p class="section-intro">
			If you want the formal language, these are the key technical details behind the proposal.
		</p>
		<div class="faq-grid">
			{#each technicalNotes as item (item.title)}
				<article class="faq-card">
					<h3>{item.title}</h3>
					<p>{item.body}</p>
				</article>
			{/each}
		</div>
	</section>

	<section class="closing-section">
		<h2>Simple to state, hard to caricature</h2>
		<p>
			The proposal does not ask voters to relearn local elections. It does not ask parties to accept
			seat losses from a top-up formula. It does not ask Parliament to live with a variable size. It
			adds a proportional national tier, keeps the local tier intact, and lets parties compete over
			how open they want to be.
		</p>
		<div class="closing-actions">
			<a class="primary-link" href={`${base}/`}>Back to the main explainer</a>
			<a class="secondary-link" href={`${base}/fptp-challenge/`}>Try the FPTP challenge</a>
		</div>
	</section>
</section>

<style>
	.proposal-page {
		display: grid;
		gap: clamp(3rem, 6vw, 5rem);
		padding-bottom: 2rem;
	}

	.hero {
		max-width: 52rem;
		padding-top: 0.75rem;
	}

	.eyebrow {
		display: inline-flex;
		align-items: center;
		padding: 0.45rem 0.85rem;
		border-radius: 999px;
		border: 1px solid var(--accent-border);
		background: var(--surface-overlay);
		color: var(--accent-text);
		font-size: 0.92rem;
		font-weight: 700;
		letter-spacing: 0.03em;
		text-transform: uppercase;
	}

	.lede {
		font-size: clamp(1.15rem, 1.75vw, 1.42rem);
		max-width: 48rem;
	}

	.hero-note {
		max-width: 44rem;
		padding: 1rem 1.15rem;
		border-left: 4px solid var(--header-bg);
		background: var(--surface-accent-gradient);
		border-radius: 0 var(--radius-md) var(--radius-md) 0;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1rem;
	}

	.stat-card {
		padding: 1.4rem;
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		background: var(--surface-panel);
		box-shadow: var(--shadow-soft);
	}

	.stat-value {
		font-size: clamp(2rem, 4vw, 2.9rem);
		font-weight: 700;
		line-height: 1;
		color: var(--accent-text);
		margin-bottom: 0.65rem;
	}

	.stat-card p {
		margin: 0;
		color: var(--text-soft);
	}

	.summary-band {
		display: grid;
		grid-template-columns: minmax(0, 1.5fr) minmax(18rem, 1fr);
		gap: 1.25rem;
		align-items: stretch;
	}

	.summary-band h2 {
		margin-top: 0;
		margin-bottom: 0.75rem;
	}

	.summary-band > div,
	.summary-callout {
		padding: 1.5rem;
		border-radius: var(--radius-md);
		border: 1px solid var(--border-color);
		background: var(--surface-panel);
		box-shadow: var(--shadow-soft);
	}

	.callout-label {
		font-size: 0.82rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--danger-color);
	}

	.process-grid,
	.ballot-grid,
	.change-grid,
	.principles-grid,
	.attack-grid,
	.faq-grid {
		display: grid;
		gap: 1.25rem;
	}

	.process-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.process-card,
	.principle-card,
	.attack-card,
	.faq-card,
	.change-panel,
	.ballot-panel {
		padding: 1.5rem;
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		background: var(--surface-panel);
		box-shadow: var(--shadow-soft);
	}

	.process-number {
		width: 2.4rem;
		height: 2.4rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		margin: 0 0 1rem 0;
		background: linear-gradient(180deg, var(--header-bg) 0%, var(--header-bg-strong) 100%);
		color: var(--text-inverse);
		font-weight: 700;
	}

	.process-card h3,
	.principle-card h3,
	.faq-card h3,
	.ballot-header h3,
	.change-panel h3,
	.closing-section h2 {
		margin-top: 0;
	}

	.ballot-grid,
	.change-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.ballot-header p,
	.ballot-header h3 {
		margin-bottom: 0.55rem;
	}

	.ballot-kicker {
		font-size: 0.82rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--accent-text);
	}

	.ballot-paper {
		display: grid;
		gap: 0.7rem;
		margin: 1.25rem 0;
		padding: 1rem;
		border-radius: var(--radius-sm);
		background: var(--surface-accent-gradient);
		border: 1px solid var(--accent-border-soft);
	}

	.ballot-paper-scroll {
		max-height: 24rem;
		overflow-y: auto;
		padding-right: 0.75rem;
		scrollbar-gutter: stable;
	}

	.ballot-row {
		display: flex;
		align-items: flex-start;
		gap: 0.85rem;
		padding: 0.85rem 0.9rem;
		border-radius: 0.7rem;
		background: var(--surface-raised);
		border: 1px solid var(--accent-border-soft);
		cursor: pointer;
		transition:
			border-color 0.2s ease,
			background-color 0.2s ease,
			box-shadow 0.2s ease,
			transform 0.2s ease;
	}

	.ballot-row input {
		margin-top: 0.1rem;
		accent-color: var(--header-bg);
	}

	.ballot-row:hover {
		border-color: var(--accent-border-strong);
		background: var(--surface-color);
		box-shadow: 0 8px 18px rgba(22, 33, 43, 0.06);
		transform: translateY(-1px);
	}

	.ballot-row.selected {
		border-color: var(--accent-border-strong);
		background: var(--surface-accent-gradient);
		box-shadow: 0 10px 20px rgba(22, 33, 43, 0.08);
	}

	.ballot-row:focus-within {
		outline: 3px solid var(--focus-ring-soft);
		outline-offset: 2px;
	}

	.ballot-row span {
		display: grid;
		gap: 0.15rem;
	}

	.ballot-row strong {
		color: var(--text-dark);
	}

	.ballot-row small {
		color: var(--text-soft);
	}

	.ballot-footnote {
		margin-bottom: 0;
		color: var(--text-soft);
		font-size: 0.95rem;
	}

	.change-panel ul,
	.key-takeaway ul {
		margin: 0;
	}

	.change-panel li,
	.key-takeaway li {
		color: var(--text-color);
	}

	.change-panel.accent {
		background: var(--surface-accent-gradient);
	}

	.section-intro {
		max-width: 46rem;
	}

	.principles-grid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.attack-grid,
	.faq-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.attack-card {
		padding: 1.25rem 1.3rem;
	}

	.attack-card p,
	.faq-card p,
	.principle-card p,
	.process-card p {
		margin-bottom: 0;
	}

	.closing-section {
		padding: 1.75rem;
		border-radius: var(--radius-lg);
		background: var(--surface-subtle-gradient);
		border: 1px solid var(--border-color);
		box-shadow: var(--shadow-soft);
	}

	.closing-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.9rem;
		margin-top: 1.5rem;
	}

	.primary-link,
	.secondary-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.85rem 1.15rem;
		border-radius: 999px;
		font-weight: 600;
		text-decoration: none;
		border: 1px solid transparent;
	}

	.primary-link {
		background: linear-gradient(180deg, var(--header-bg) 0%, var(--header-bg-strong) 100%);
		color: var(--text-inverse);
	}

	.secondary-link {
		background: var(--surface-overlay);
		border-color: var(--border-color);
		color: var(--text-dark);
	}

	@media (max-width: 900px) {
		.stats-grid,
		.process-grid,
		.ballot-grid,
		.change-grid,
		.principles-grid,
		.attack-grid,
		.faq-grid,
		.summary-band {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 640px) {
		.stat-card,
		.process-card,
		.principle-card,
		.attack-card,
		.faq-card,
		.change-panel,
		.ballot-panel,
		.closing-section,
		.summary-band > div,
		.summary-callout {
			padding: 1.2rem;
		}

		.closing-actions {
			flex-direction: column;
		}

		.primary-link,
		.secondary-link {
			width: 100%;
		}
	}
</style>
