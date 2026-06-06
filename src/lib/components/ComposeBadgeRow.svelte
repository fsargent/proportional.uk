<script lang="ts">
	import { METHODS, type MethodId } from '$lib/data/methods';
	import { AXIS_LABEL, ATOM_VALUE_LABEL, SWAP_AXES } from '$lib/data/atom-graph';

	type Props = {
		method: MethodId;
	};
	let { method }: Props = $props();

	const source = $derived(METHODS[method]);
</script>

<aside
	class="compose-badge-row family-{source.family}"
	aria-label="Composition of {source.name}"
>
	<header class="row-head">
		<span class="row-eyebrow">Made of</span>
	</header>
	<ul class="badges">
		{#each SWAP_AXES as axis (axis)}
			<li class="badge">
				<span class="axis-label">{AXIS_LABEL[axis]}</span>
				<span class="axis-value">{ATOM_VALUE_LABEL[source.atoms[axis]]}</span>
			</li>
		{/each}
	</ul>
</aside>

<style>
	.compose-badge-row {
		display: grid;
		gap: 0.6rem;
		width: 100%;
		min-width: 0;
		padding: 0.9rem 1rem 1rem;
		border: 1px solid var(--border-color);
		border-left-width: 4px;
		border-radius: var(--radius-md);
		background: var(--surface-color);
		box-shadow: var(--shadow-soft);
	}

	.compose-badge-row.family-approval {
		border-left-color: var(--family-approval);
	}
	.compose-badge-row.family-ranked {
		border-left-color: var(--family-ranked);
	}
	.compose-badge-row.family-mixed {
		border-left-color: var(--family-mixed);
	}
	.compose-badge-row.family-single-mark {
		border-left-color: var(--family-single-mark);
	}

	.row-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
	}
	.row-eyebrow {
		font-size: 0.78rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-soft);
	}

	.badges {
		list-style: none;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.5rem;
		width: 100%;
		min-width: 0;
		margin: 0;
		padding: 0;
	}

	.badge {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.6rem;
		width: 100%;
		padding: 0.6rem 0.85rem;
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
		background: var(--surface-emphasis);
		font-size: 0.95rem;
		color: var(--text-dark);
		min-width: 0;
	}

	.axis-label {
		min-width: 0;
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-soft);
	}
	.axis-value {
		min-width: 0;
		font-weight: 600;
		text-align: right;
		overflow-wrap: anywhere;
	}

	@media (max-width: 640px) {
		.badges {
			grid-template-columns: 1fr;
		}
	}
</style>
