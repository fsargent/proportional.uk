<script lang="ts">
	interface Candidate {
		id: string;
		name: string;
		party: string;
	}

	interface Props {
		candidates: Candidate[];
		/** Approval mode: set of approved candidate ids. */
		approvals?: string[];
		/** Ranked mode: ordered list of preferences (rank 1 = first). When set,
		 * the ballot renders rank numbers instead of checkmarks. */
		ranking?: string[];
		title?: string;
		instruction?: string;
	}

	let { candidates, approvals, ranking, title = 'Sample ballot', instruction }: Props = $props();

	const isRanked = $derived(Boolean(ranking));
	const defaultInstruction = $derived(
		isRanked
			? 'Rank candidates in order of preference (1 = most preferred)'
			: "Approve any candidates you'd accept"
	);
	const resolvedInstruction = $derived(instruction ?? defaultInstruction);

	function rankFor(id: string): number | null {
		if (!ranking) return null;
		const idx = ranking.indexOf(id);
		return idx >= 0 ? idx + 1 : null;
	}
</script>

<div class="sample-ballot">
	{#if title}
		<p class="ballot-title">{title}</p>
	{/if}
	<p class="ballot-instruction">{isRanked ? '①' : '✓'} {resolvedInstruction}</p>
	<ul class="ballot-list">
		{#each candidates as c}
			{#if isRanked}
				{@const rank = rankFor(c.id)}
				<li class="ballot-row" class:approved={rank !== null}>
					<span class="rank-pill" class:filled={rank !== null}>
						{rank ?? ''}
					</span>
					<span class="ballot-name">{c.name}</span>
					<span class="ballot-party">{c.party}</span>
				</li>
			{:else}
				{@const approved = (approvals ?? []).includes(c.id)}
				<li class="ballot-row" class:approved>
					<span class="check" class:checked={approved}>{approved ? '✓' : ''}</span>
					<span class="ballot-name">{c.name}</span>
					<span class="ballot-party">{c.party}</span>
				</li>
			{/if}
		{/each}
	</ul>
</div>

<style>
	.sample-ballot {
		background: var(--surface-raised);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		padding: 1.25rem 1.5rem;
		max-width: 26rem;
		box-shadow: var(--shadow-soft);
	}

	.ballot-title {
		margin: 0 0 0.25rem;
		color: var(--text-dark);
		font-weight: 700;
		font-size: 1rem;
	}

	.ballot-instruction {
		color: var(--accent-text);
		font-weight: 600;
		margin: 0 0 0.85rem;
		font-size: 0.85rem;
	}

	.ballot-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.ballot-row {
		display: grid;
		grid-template-columns: 1.25rem 1fr auto;
		align-items: center;
		gap: 0.75rem;
		padding: 0.45rem 0.65rem;
		background: var(--surface-color);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
		font-size: 0.9rem;
	}

	.ballot-row.approved {
		border-color: var(--header-bg);
		background: var(--field-hover, var(--surface-color));
	}

	.check {
		width: 1.05rem;
		height: 1.05rem;
		border: 1px solid var(--border-strong);
		border-radius: 3px;
		background: var(--surface-color);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		color: transparent;
		line-height: 1;
		font-size: 0.75rem;
		flex-shrink: 0;
	}

	.check.checked {
		background: var(--header-bg);
		border-color: var(--header-bg);
		color: var(--text-inverse);
	}

	.rank-pill {
		width: 1.15rem;
		height: 1.15rem;
		border: 1px solid var(--border-strong);
		border-radius: 50%;
		background: var(--surface-color);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		color: var(--text-soft);
		line-height: 1;
		font-size: 0.75rem;
		flex-shrink: 0;
	}

	.rank-pill.filled {
		background: var(--header-bg);
		border-color: var(--header-bg);
		color: var(--text-inverse);
	}

	.ballot-name {
		color: var(--text-dark);
		font-weight: 500;
	}

	.ballot-row.approved .ballot-name {
		font-weight: 600;
	}

	.ballot-party {
		color: var(--text-soft);
		font-size: 0.8rem;
		white-space: nowrap;
	}
</style>
