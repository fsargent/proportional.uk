<script lang="ts">
	interface Candidate {
		id: string;
		name: string;
		party: string;
	}

	interface Props {
		title: string;
		subtitle: string;
		instruction: string;
		explanation: string;
		candidates: Candidate[];
		type: 'approval' | 'single';
	}

	let { title, subtitle, instruction, explanation, candidates, type }: Props = $props();

	let selections = $state<Record<string, boolean>>({});
	let selectedParty = $state<string | null>(null);

	function toggleCandidate(id: string) {
		if (type === 'approval') {
			selections[id] = !selections[id];
		} else {
			selectedParty = id;
		}
	}
</script>

<div class="voting-section">
	<h3>{title}</h3>
	<p><strong>{subtitle}</strong></p>
	<p class="instruction">✓ {instruction}</p>
	<p class="explanation-text">
		<strong>What this does:</strong>
		{explanation}
	</p>

	<div class="ballot-example" class:party-selection={type === 'single'}>
		{#each candidates as candidate}
			<div class="candidate-item" class:party-item={type === 'single'}>
				{#if type === 'approval'}
					<input
						type="checkbox"
						id={candidate.id}
						class="candidate-checkbox"
						checked={selections[candidate.id] || false}
						onchange={() => toggleCandidate(candidate.id)}
					/>
				{:else}
					<input
						type="radio"
						id={candidate.id}
						name="party-select"
						class="party-radio"
						checked={selectedParty === candidate.id}
						onchange={() => toggleCandidate(candidate.id)}
					/>
				{/if}
				<label for={candidate.id}>
					<div class="candidate-name">{candidate.name}</div>
					{#if candidate.party}
						<div class="candidate-party">{candidate.party}</div>
					{/if}
				</label>
			</div>
		{/each}
	</div>
</div>

<style>
	.voting-section {
		background: #f9f9f9;
		border: 1px solid #ddd;
		border-radius: 8px;
		padding: 2rem;
		display: flex;
		flex-direction: column;
	}

	.voting-section h3 {
		margin-top: 0;
		color: #0b0c0c;
		font-size: 1.3rem;
		margin-bottom: 0.5rem;
	}

	.voting-section > p:first-of-type {
		margin: 0 0 0.5rem 0;
		font-weight: 600;
		color: #1d70b8;
	}

	.instruction {
		color: #1d70b8;
		font-weight: 600;
		font-size: 0.95rem;
		margin-bottom: 1.5rem;
	}

	.explanation-text {
		font-size: 0.95rem;
		color: #555;
		margin: 0.75rem 0 1.5rem 0;
		min-height: 7rem;
	}

	.ballot-example {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin: 1.5rem 0;
		flex-grow: 1;
	}

	.candidate-item,
	.party-item {
		display: flex;
		align-items: center;
		padding: 1rem;
		background: white;
		border: 1px solid #ddd;
		border-radius: 4px;
		transition: all 0.2s ease;
	}

	.candidate-item:hover,
	.party-item:hover {
		background: #f0f8f0;
		border-color: #1d70b8;
	}

	.candidate-checkbox,
	.party-radio {
		width: 1.25rem;
		height: 1.25rem;
		margin-right: 1rem;
		cursor: pointer;
		flex-shrink: 0;
	}

	.candidate-item label,
	.party-item label {
		cursor: pointer;
		flex: 1;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.candidate-name {
		font-weight: 600;
		color: #0b0c0c;
	}

	.candidate-party {
		font-size: 0.9rem;
		color: #555;
	}
</style>
