<script lang="ts">
	import { METHODS, type MethodId } from '$lib/data/methods';

	type BallotType = 'ranking' | 'approval' | 'party-list' | 'one-vote';
	type ValueKey =
		| 'vote-helps-win'
		| 'proportional'
		| 'broad-local-support'
		| 'decisive-government'
		| 'candidate-choice'
		| 'simple-ballot';

	type System = {
		/** When set, name and href derive from METHODS. */
		methodId?: MethodId;
		/** Fallback name when no methodId (e.g. the vanilla AMS reference row). */
		name?: string;
		/** Fallback href when no methodId. */
		href?: string;
		description: string;
		singleMemberOnly: boolean;
		needsSecondBallot: boolean;
		twoClassMPs: boolean;
		ballotType: BallotType;
		needsParliamentResize: boolean | 'helps';
	};

	// Order matters: when value preferences don't differentiate the systems,
	// JS's stable sort preserves this order. Proportional Approval leads as the
	// site's editorial focus.
	const systems: System[] = [
		{
			methodId: 'proportional-approval',
			description:
				'Vote for as many candidates as you like in <a href="/visualiser">multi-member districts</a>. A reweighting method ensures proportional results.',
			singleMemberOnly: false,
			needsSecondBallot: false,
			twoClassMPs: false,
			ballotType: 'approval',
			needsParliamentResize: false
		},
		{
			methodId: 'stv',
			description:
				'Voters rank candidates in <a href="/visualiser">multi-member districts</a>. Seats are filled using a quota and transfer system.',
			singleMemberOnly: false,
			needsSecondBallot: false,
			twoClassMPs: false,
			ballotType: 'ranking',
			needsParliamentResize: false
		},
		{
			methodId: 'ams-plus',
			description:
				'Approve local Members of Parliament instead of picking just one. A separate party vote tops up regional seats for proportional results. Keeps the constituency link.',
			singleMemberOnly: true,
			needsSecondBallot: true,
			twoClassMPs: true,
			ballotType: 'approval',
			needsParliamentResize: 'helps'
		},
		{
			methodId: 'party-list',
			description:
				"Vote for a party and optionally for specific candidates on that party's list. Seats allocated proportionally in larger regional districts.",
			singleMemberOnly: false,
			needsSecondBallot: false,
			twoClassMPs: false,
			ballotType: 'party-list',
			needsParliamentResize: false
		},
		{
			methodId: 'single-winner-approval',
			description:
				'Keep one Member of Parliament per constituency, but vote for as many candidates as you like. The most approved candidate wins.',
			singleMemberOnly: true,
			needsSecondBallot: false,
			twoClassMPs: false,
			ballotType: 'approval',
			needsParliamentResize: false
		}
	];

	function systemName(s: System): string {
		return s.methodId ? METHODS[s.methodId].name : (s.name ?? '');
	}
	function systemHref(s: System): string | undefined {
		return s.methodId ? METHODS[s.methodId].route : s.href;
	}

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
	let q4: Array<'approval' | 'ranking' | 'party-list' | 'one-vote'> = $state([]);
	let q5: Answer = $state(null);
	let values: ValueKey[] = $state([]);

	function toggleValue(key: ValueKey) {
		if (values.includes(key)) values = values.filter((v) => v !== key);
		else values = [...values, key];
	}

	function toggleQ4(option: 'approval' | 'ranking' | 'party-list' | 'one-vote') {
		if (q4.includes(option)) q4 = q4.filter((v) => v !== option);
		else q4 = [...q4, option];
	}

	function matchesBallotPreference(
		system: System,
		option: 'approval' | 'ranking' | 'party-list' | 'one-vote'
	): boolean {
		if (option === 'approval') return system.ballotType === 'approval' || system.ballotType === 'one-vote';
		if (option === 'ranking') return system.ballotType === 'ranking' || system.ballotType === 'one-vote';
		if (option === 'party-list') return system.ballotType === 'party-list' || system.ballotType === 'one-vote';
		if (option === 'one-vote') return system.ballotType === 'one-vote' || system.ballotType === 'approval';
		return true;
	}

	function valueScore(system: System): number {
		let score = 0;
		for (const v of values) {
			if (v === 'vote-helps-win') {
				if (system.ballotType === 'approval' || system.ballotType === 'ranking' || !system.singleMemberOnly)
					score += 1;
			}
			if (v === 'proportional') {
				if (system.methodId !== 'single-winner-approval') score += 2;
			}
			if (v === 'broad-local-support') {
				if (system.ballotType === 'approval' || system.singleMemberOnly) score += 1;
			}
			if (v === 'decisive-government') {
				if (system.methodId === 'single-winner-approval' || system.ballotType === 'one-vote')
					score += 2;
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

			if (q4.length > 0 && !q4.some((option) => matchesBallotPreference(s, option))) return false;

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
		q4 = [];
		q5 = null;
		values = [];
	}

	function matchNotes(system: System): string[] {
		const notes: string[] = [];
		if (q1 === 'single' && system.singleMemberOnly) notes.push('✓ Keeps single-member constituencies');
		if (q1 === 'sharing' && !system.singleMemberOnly) notes.push('✓ Uses multi-member districts');
		if (q2 === 'two-votes' && system.needsSecondBallot) notes.push('✓ Uses a two-vote ballot');
		if (q2 === 'one-ballot' && !system.needsSecondBallot) notes.push('✓ Single ballot');
		if (q3 === 'same-way' && !system.twoClassMPs) notes.push('✓ All Members of Parliament elected the same way');
		if (q3 === 'fine' && system.twoClassMPs)
			notes.push('✓ Mixes constituency and list Members of Parliament for fairness');
		if (q4.length > 0 && q4.some((option) => matchesBallotPreference(system, option))) {
			notes.push('✓ Matches your ballot preferences');
		}
		if (q5 === 'keep-650' && system.needsParliamentResize === false) notes.push('✓ Works with 650 Members of Parliament');
		if (q5 === 'keep-650' && system.needsParliamentResize !== false)
			notes.push('⚠ Works better with a different number of Members of Parliament');
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
			<p class="helper">Tick all that apply. Leave blank for no preference.</p>
			<div class="options checkbox-options">
				<label class:selected={q4.includes('approval')}>
					<input
						type="checkbox"
						checked={q4.includes('approval')}
						onchange={() => toggleQ4('approval')}
					/>
					Vote for all the candidates you'd be happy with
				</label>
				<label class:selected={q4.includes('ranking')}>
					<input
						type="checkbox"
						checked={q4.includes('ranking')}
						onchange={() => toggleQ4('ranking')}
					/>
					Rank the candidates in your order of preference
				</label>
				<label class:selected={q4.includes('party-list')}>
					<input
						type="checkbox"
						checked={q4.includes('party-list')}
						onchange={() => toggleQ4('party-list')}
					/>
					Vote for a party and let them decide which candidates get seats
				</label>
				<label class:selected={q4.includes('one-vote')}>
					<input
						type="checkbox"
						checked={q4.includes('one-vote')}
						onchange={() => toggleQ4('one-vote')}
					/>
					One vote is fine — just make it count more fairly
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
		<h2>Results</h2>
		{#if results.length === 0}
			<div class="no-results">
				<p>No systems match all your preferences. Try relaxing some of your answers.</p>
			</div>
		{:else}
			<div class="results-grid">
				{#each results as system}
					{@const name = systemName(system)}
					{@const href = systemHref(system)}
					<div class="result-card">
						<h3>
							{#if href}
								<a {href}>{name}</a>
							{:else}
								{name}
							{/if}
						</h3>
						<!-- eslint-disable-next-line svelte/no-at-html-tags -- descriptions are author-controlled and only contain anchor tags -->
					<p class="description">{@html system.description}</p>
						{#if matchNotes(system).length > 0}
							<ul class="match-notes">
								{#each matchNotes(system) as note}
									<li>{note}</li>
								{/each}
							</ul>
						{/if}
						{#if href}
							<a {href} class="learn-more">Learn more →</a>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.system-finder {
		max-width: 52rem;
		margin: 0 auto;
	}

	.questions {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		margin-bottom: 2rem;
	}

	.question-card {
		background: var(--surface-panel);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		padding: 1.5rem;
		box-shadow: var(--shadow-soft);
	}

	.question-card h3 {
		color: var(--text-dark);
		font-size: 1.05rem;
		margin: 0 0 1rem;
		line-height: 1.4;
	}

	.helper {
		margin: -0.35rem 0 0.8rem 0;
		font-size: 0.9rem;
		color: var(--text-soft);
	}

	.options {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.options label {
		display: flex;
		align-items: flex-start;
		gap: 0.6rem;
		padding: 0.65rem 0.85rem;
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
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

	.checkbox-options label {
		padding-right: 1rem;
	}

	.controls {
		text-align: right;
		margin-bottom: 2rem;
	}

	.reset-btn {
		background: var(--surface-muted);
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		padding: 0.5rem 1.2rem;
		color: var(--text-color);
		cursor: pointer;
		font-size: 0.9rem;
		transition: background 0.15s;
	}

	.reset-btn:hover {
		background: var(--surface-color);
	}

	.results h2 {
		color: var(--text-dark);
		font-size: 1.4rem;
		margin: 0 0 1rem;
	}

	.results-grid {
		display: grid;
		gap: 1rem;
	}

	.result-card {
		background: var(--surface-color);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		padding: 1.5rem;
		box-shadow: var(--shadow-soft);
	}

	.result-card h3 {
		margin: 0 0 0.5rem;
		font-size: 1.15rem;
		color: var(--text-dark);
	}

	.result-card h3 a {
		color: var(--link-color);
		text-decoration: none;
	}

	.result-card h3 a:hover {
		text-decoration: underline;
	}

	.description {
		color: var(--text-color);
		margin: 0 0 0.75rem;
		line-height: 1.5;
		font-size: 0.95rem;
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
		font-weight: 500;
	}

	.learn-more:hover {
		text-decoration: underline;
	}

	.no-results {
		background: var(--surface-muted);
		border-radius: var(--radius-md);
		padding: 2rem;
		text-align: center;
	}

	.no-results p {
		color: var(--text-color);
		margin: 0;
	}

	@media (min-width: 640px) {
		.results-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
