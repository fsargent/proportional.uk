<script lang="ts">
	type BallotType = 'ranking' | 'approval' | 'party-list' | 'one-vote';
	type ValueKey =
		| 'vote-helps-win'
		| 'proportional'
		| 'broad-local-support'
		| 'decisive-government'
		| 'candidate-choice'
		| 'simple-ballot';

	type System = {
		name: string;
		href?: string;
		description: string;
		singleMemberOnly: boolean;
		needsSecondBallot: boolean;
		twoClassMPs: boolean;
		ballotType: BallotType;
		needsParliamentResize: boolean | 'helps';
	};

	const systems: System[] = [
		{
			name: 'Single Transferable Vote',
			href: '/stv',
			description:
				'Voters rank candidates in multi-member districts. Seats are filled using a quota and transfer system.',
			singleMemberOnly: false,
			needsSecondBallot: false,
			twoClassMPs: false,
			ballotType: 'ranking',
			needsParliamentResize: false
		},
		{
			name: 'Additional Member System',
			href: '/ams-plus',
			description:
				'Keep your local MP, add a second vote for a party. Top-up seats make the overall result proportional.',
			singleMemberOnly: true,
			needsSecondBallot: true,
			twoClassMPs: true,
			ballotType: 'one-vote',
			needsParliamentResize: 'helps'
		},
		{
		name: 'Approval-Based Mixed System',
		href: '/ams-plus',
		description:
			'Like the Additional Member System but with approval voting for your local MP. Keeps the constituency link and adds proportionality.',
			singleMemberOnly: true,
			needsSecondBallot: true,
			twoClassMPs: true,
			ballotType: 'approval',
			needsParliamentResize: 'helps'
		},
		{
			name: 'Open-List Proportional Representation',
			description:
				"Vote for a party and optionally for specific candidates on that party's list. Seats allocated proportionally in larger regional districts.",
			singleMemberOnly: false,
			needsSecondBallot: false,
			twoClassMPs: false,
			ballotType: 'party-list',
			needsParliamentResize: false
		},
		{
			name: 'Single-Winner Approval',
			href: '/single-winner-approval',
			description:
				'Keep one MP per constituency, but vote for as many candidates as you like. The most approved candidate wins.',
			singleMemberOnly: true,
			needsSecondBallot: false,
			twoClassMPs: false,
			ballotType: 'approval',
			needsParliamentResize: false
		},
		{
			name: 'Proportional Approval Voting',
			href: '/proportional-approval',
			description:
				'Vote for as many candidates as you like in multi-member districts. A reweighting method ensures proportional results.',
			singleMemberOnly: false,
			needsSecondBallot: false,
			twoClassMPs: false,
			ballotType: 'approval',
			needsParliamentResize: false
		}
	];

	const valueOptions: { key: ValueKey; label: string }[] = [
		{ key: 'vote-helps-win', label: "My vote should help decide who wins, even if my first choice can't" },
		{ key: 'proportional', label: "Parliament's makeup should reflect how the country voted overall" },
		{ key: 'broad-local-support', label: 'Each area should elect candidates with broad local support' },
		{ key: 'decisive-government', label: 'Government should usually be clear and decisive' },
		{ key: 'candidate-choice', label: 'I want to choose between individual candidates, not just parties' },
		{ key: 'simple-ballot', label: 'The ballot should be simple to understand and fill in' }
	];

	type Answer = string | null;

	let q1: Answer = $state(null);
	let q2: Answer = $state(null);
	let q3: Answer = $state(null);
	let q4: Answer = $state(null);
	let q5: Answer = $state(null);
	let values: ValueKey[] = $state([]);

	function toggleValue(key: ValueKey) {
		if (values.includes(key)) values = values.filter((v) => v !== key);
		else values = [...values, key];
	}

	function valueScore(system: System): number {
		let score = 0;
		for (const v of values) {
			if (v === 'vote-helps-win') {
				if (system.ballotType === 'approval' || system.ballotType === 'ranking' || !system.singleMemberOnly)
					score += 1;
			}
			if (v === 'proportional') {
				if (system.name !== 'Single-Winner Approval') score += 2;
			}
			if (v === 'broad-local-support') {
				if (system.ballotType === 'approval' || system.singleMemberOnly) score += 1;
			}
			if (v === 'decisive-government') {
				if (system.name === 'Single-Winner Approval' || system.ballotType === 'one-vote') score += 2;
			}
			if (v === 'candidate-choice') {
				if (system.ballotType === 'approval' || system.ballotType === 'ranking') score += 2;
				if (system.ballotType === 'party-list') score += 0;
			}
			if (v === 'simple-ballot') {
				if (system.ballotType === 'approval' || system.ballotType === 'one-vote') score += 2;
				else if (system.ballotType === 'party-list') score += 1;
			}
		}
		return score;
	}

	let results = $derived.by(() => {
		let filtered = systems.filter((s) => {
			if (q1 === 'single' && !s.singleMemberOnly) return false;
			if (q2 === 'one-ballot' && s.needsSecondBallot) return false;
			if (q3 === 'same-way' && s.twoClassMPs) return false;

			if (q4 === 'approval') {
				if (s.ballotType === 'ranking' || s.ballotType === 'party-list') return false;
			} else if (q4 === 'ranking') {
				if (s.ballotType === 'approval' || s.ballotType === 'party-list') return false;
			} else if (q4 === 'party-list') {
				if (s.ballotType === 'approval' || s.ballotType === 'ranking') return false;
			} else if (q4 === 'one-vote') {
				if (s.ballotType === 'ranking' || s.ballotType === 'party-list') return false;
			}

			return true;
		});

		filtered.sort((a, b) => {
			if (q5 === 'keep-650') {
				const resizeA = a.needsParliamentResize === false ? 0 : 1;
				const resizeB = b.needsParliamentResize === false ? 0 : 1;
				if (resizeA !== resizeB) return resizeA - resizeB;
			}
			return valueScore(b) - valueScore(a);
		});

		return filtered;
	});

	function resetAll() {
		q1 = null;
		q2 = null;
		q3 = null;
		q4 = null;
		q5 = null;
		values = [];
	}

	function matchNotes(system: System): string[] {
		const notes: string[] = [];
		if (q1 === 'single' && system.singleMemberOnly) notes.push('✓ Keeps single-member constituencies');
		if (q1 === 'sharing' && !system.singleMemberOnly) notes.push('✓ Uses multi-member districts');
		if (q2 === 'two-votes' && system.needsSecondBallot) notes.push('✓ Uses a two-vote ballot');
		if (q2 === 'one-ballot' && !system.needsSecondBallot) notes.push('✓ Single ballot');
		if (q3 === 'same-way' && !system.twoClassMPs) notes.push('✓ All MPs elected the same way');
		if (q3 === 'fine' && system.twoClassMPs)
			notes.push('✓ Mixes constituency and list MPs for fairness');
		if (q4 && q4 !== 'no-pref' && system.ballotType === q4) notes.push('✓ Matches your ballot preference');
		if (q5 === 'keep-650' && system.needsParliamentResize === false) notes.push('✓ Works with 650 MPs');
		if (q5 === 'keep-650' && system.needsParliamentResize !== false)
			notes.push('⚠ Works better with a different number of MPs');
		if (values.length) notes.push(`✓ Matches ${valueScore(system)} of your selected priority points`);
		return notes;
	}
</script>

<div class="system-finder">
	<div class="questions">
		<div class="question-card">
			<h3>Should every area keep its own single MP?</h3>
			<div class="options">
				<label class:selected={q1 === 'single'}>
					<input type="radio" name="q1" value="single" bind:group={q1} />
					Yes — keep one MP per area
				</label>
				<label class:selected={q1 === 'sharing'}>
					<input type="radio" name="q1" value="sharing" bind:group={q1} />
					I'm open to sharing several MPs across a larger area
				</label>
				<label class:selected={q1 === 'no-pref'}>
					<input type="radio" name="q1" value="no-pref" bind:group={q1} />
					No preference
				</label>
			</div>
		</div>

		<div class="question-card">
			<h3>Should voters get a second vote for a party, alongside their local vote?</h3>
			<div class="options">
				<label class:selected={q2 === 'two-votes'}>
					<input type="radio" name="q2" value="two-votes" bind:group={q2} />
					Yes, I'd be comfortable with two votes
				</label>
				<label class:selected={q2 === 'one-ballot'}>
					<input type="radio" name="q2" value="one-ballot" bind:group={q2} />
					No, I'd prefer one ballot that does everything
				</label>
				<label class:selected={q2 === 'no-pref'}>
					<input type="radio" name="q2" value="no-pref" bind:group={q2} />
					No preference
				</label>
			</div>
		</div>

		<div class="question-card">
			<h3>Is it OK if some MPs represent local areas and others represent parties or regions?</h3>
			<div class="options">
				<label class:selected={q3 === 'fine'}>
					<input type="radio" name="q3" value="fine" bind:group={q3} />
					Yes, that's fine if it makes Parliament fairer overall
				</label>
				<label class:selected={q3 === 'same-way'}>
					<input type="radio" name="q3" value="same-way" bind:group={q3} />
					No, every MP should be elected the same way
				</label>
				<label class:selected={q3 === 'no-pref'}>
					<input type="radio" name="q3" value="no-pref" bind:group={q3} />
					No preference
				</label>
			</div>
		</div>

		<div class="question-card">
			<h3>
				Right now you can only vote for one candidate. If you could express more of your opinion, how
				would you prefer to do it?
			</h3>
			<div class="options">
				<label class:selected={q4 === 'approval'}>
					<input type="radio" name="q4" value="approval" bind:group={q4} />
					Vote for all the candidates you'd be happy with
				</label>
				<label class:selected={q4 === 'ranking'}>
					<input type="radio" name="q4" value="ranking" bind:group={q4} />
					Rank the candidates in your order of preference
				</label>
				<label class:selected={q4 === 'party-list'}>
					<input type="radio" name="q4" value="party-list" bind:group={q4} />
					Vote for a party and let them decide which candidates get seats
				</label>
				<label class:selected={q4 === 'one-vote'}>
					<input type="radio" name="q4" value="one-vote" bind:group={q4} />
					You should only be able to support one candidate and their party
				</label>
				<label class:selected={q4 === 'no-pref'}>
					<input type="radio" name="q4" value="no-pref" bind:group={q4} />
					No preference
				</label>
			</div>
		</div>

		<div class="question-card">
			<h3>Is it OK to change the number of MPs in Parliament?</h3>
			<div class="options">
				<label class:selected={q5 === 'keep-650'}>
					<input type="radio" name="q5" value="keep-650" bind:group={q5} />
					Keep it at 650
				</label>
				<label class:selected={q5 === 'open'}>
					<input type="radio" name="q5" value="open" bind:group={q5} />
					I'm open to changing it if there's a good reason
				</label>
				<label class:selected={q5 === 'no-pref'}>
					<input type="radio" name="q5" value="no-pref" bind:group={q5} />
					No preference
				</label>
			</div>
		</div>

		<div class="question-card">
			<h3>What matters to you? Tick all that apply.</h3>
			<p class="helper">This doesn't filter systems out; it reorders results toward your priorities.</p>
			<div class="options checkbox-options">
				{#each valueOptions as option}
					<label class:selected={values.includes(option.key)}>
						<input
							type="checkbox"
							checked={values.includes(option.key)}
							onchange={() => toggleValue(option.key)}
						/>
						{option.label}
					</label>
				{/each}
			</div>
		</div>
	</div>

	<div class="controls">
		<button class="reset-btn" onclick={resetAll}>Reset all</button>
	</div>

	<div class="results">
		<h3 class="results-heading">Results</h3>
		{#if results.length === 0}
			<div class="no-results">
				<p>No systems match all your preferences. Try relaxing some of your answers.</p>
			</div>
		{:else}
			<div class="results-grid">
				{#each results as system}
					<div class="result-card">
						<h4 class="result-name">
							{#if system.href}
								<a href={system.href}>{system.name}</a>
							{:else}
								{system.name}
							{/if}
						</h4>
						<p class="description">{system.description}</p>
						{#if matchNotes(system).length > 0}
							<ul class="match-notes">
								{#each matchNotes(system) as note}
									<li>{note}</li>
								{/each}
							</ul>
						{/if}
						{#if system.href}
							<a href={system.href} class="learn-more">Learn more →</a>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.system-finder {
		display: grid;
		gap: 1.5rem;
	}

	.questions {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
		gap: 1rem;
	}

	.question-card {
		background: var(--surface-subtle-gradient);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		padding: 1.25rem;
		box-shadow: var(--shadow-soft);
	}

	.question-card h3 {
		color: var(--text-dark);
		font-size: 1.05rem;
		margin: 0 0 0.75rem;
		line-height: 1.4;
	}

	.helper {
		margin: -0.25rem 0 0.75rem 0;
		font-size: 0.9rem;
		color: var(--text-soft);
	}

	.options {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.options label {
		display: flex;
		align-items: flex-start;
		gap: 0.6rem;
		padding: 0.55rem 0.75rem;
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
		cursor: pointer;
		color: var(--text-color);
		font-size: 0.95rem;
		line-height: 1.4;
		transition: border-color 0.15s, background 0.15s;
	}

	.options label:hover {
		border-color: var(--accent-border-strong);
		background: var(--surface-emphasis);
	}

	.options label.selected {
		border-color: var(--accent-text);
		background: var(--selection-bg);
		color: var(--text-dark);
	}

	.options input {
		margin-top: 0.15rem;
		flex-shrink: 0;
		accent-color: var(--accent-text);
	}

	.controls {
		display: flex;
		justify-content: flex-end;
	}

	.reset-btn {
		background: var(--surface-muted);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
		padding: 0.5rem 1.2rem;
		color: var(--text-color);
		cursor: pointer;
		font-size: 0.9rem;
		font-weight: 500;
		transition: background 0.15s, border-color 0.15s;
	}

	.reset-btn:hover {
		background: var(--surface-color);
		border-color: var(--border-strong);
	}

	.results-heading {
		color: var(--text-dark);
		font-size: 1.35rem;
		margin: 0.5rem 0 1rem;
		line-height: 1.2;
	}

	.results-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	.result-card {
		background: var(--surface-subtle-gradient);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		padding: 1.25rem;
		box-shadow: var(--shadow-soft);
		transition: border-color 0.2s, box-shadow 0.2s;
	}

	.result-card:hover {
		border-color: var(--border-strong);
		box-shadow: var(--shadow-strong);
	}

	.result-name {
		margin: 0 0 0.5rem;
		font-size: 1.1rem;
		color: var(--text-dark);
	}

	.result-name a {
		color: var(--link-color);
		text-decoration: none;
	}

	.result-name a:hover {
		text-decoration: underline;
	}

	.description {
		color: var(--text-color);
		margin: 0 0 0.75rem;
		line-height: 1.6;
		font-size: 0.96rem;
	}

	.match-notes {
		list-style: none;
		padding: 0;
		margin: 0 0 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.match-notes li {
		font-size: 0.88rem;
		color: var(--success-text);
	}

	.learn-more {
		color: var(--link-color);
		font-size: 0.9rem;
		text-decoration: none;
		font-weight: 600;
	}

	.learn-more:hover {
		text-decoration: underline;
	}

	.no-results {
		background: var(--surface-muted);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		padding: 2rem;
		text-align: center;
	}

	.no-results p {
		color: var(--text-color);
		margin: 0;
	}

	@media (max-width: 768px) {
		.questions {
			grid-template-columns: 1fr;
		}
	}
</style>
