<script lang="ts">
	import { METHODS, type MethodId } from '$lib/data/methods';
	import {
		AXIS_LABEL,
		ATOM_VALUE_LABEL,
		SWAP_AXES,
		swaps,
		type AxisSwap,
		type SwapOption
	} from '$lib/data/atom-graph';

	type Props = {
		method: MethodId;
	};
	let { method }: Props = $props();

	const source = $derived(METHODS[method]);
	const data = $derived(swaps(method));

	function swapHref(opt: SwapOption): string {
		if (!opt.method) return '';
		// `?from=X&swap=ballot` lets the destination page show a "just changed" affordance.
		return `${opt.method.route}?from=${source.id}&swap=${opt.axis}`;
	}
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
			{@const swap: AxisSwap = data[axis]}
			<li class="badge-cell">
				<details class="badge">
					<summary>
						<span class="axis-label">{AXIS_LABEL[axis]}</span>
						<span class="axis-value">{ATOM_VALUE_LABEL[swap.currentValue]}</span>
					</summary>
					<div class="panel">
						<p class="panel-title">Swap to:</p>
						<ul class="options">
							{#each swap.options as opt (opt.value)}
								<li class:disabled={!opt.method}>
									{#if opt.method}
										<a href={swapHref(opt)}>
											<span class="opt-value">{ATOM_VALUE_LABEL[opt.value]}</span>
											<span class="opt-arrow" aria-hidden="true">→</span>
											<span class="opt-method">{opt.method.name}</span>
										</a>
									{:else}
										<span class="disabled-row" title="No named method has this combination">
											<span class="opt-value">{ATOM_VALUE_LABEL[opt.value]}</span>
											<span class="opt-arrow" aria-hidden="true">→</span>
											<span class="opt-method opt-method--empty">no named system</span>
										</span>
									{/if}
								</li>
							{/each}
						</ul>
					</div>
				</details>
			</li>
		{/each}
	</ul>
</aside>

<style>
	.compose-badge-row {
		display: grid;
		gap: 0.6rem;
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
		margin: 0;
		padding: 0;
	}

	.badge-cell {
		min-width: 0;
	}

	.badge {
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
		background: var(--surface-emphasis);
		overflow: hidden;
	}

	.badge summary {
		list-style: none;
		cursor: pointer;
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.6rem;
		padding: 0.6rem 0.85rem;
		font-size: 0.95rem;
		color: var(--text-dark);
		transition:
			background-color 0.15s ease,
			border-color 0.15s ease;
	}
	.badge summary::-webkit-details-marker {
		display: none;
	}
	.badge summary:hover {
		background: var(--field-hover);
	}
	.badge[open] summary {
		background: var(--surface-muted);
	}

	.axis-label {
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-soft);
	}
	.axis-value {
		font-weight: 600;
		text-align: right;
	}

	.panel {
		padding: 0.65rem 0.85rem 0.85rem;
		border-top: 1px solid var(--border-color);
	}
	.panel-title {
		margin: 0 0 0.4rem;
		font-size: 0.78rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-soft);
	}

	.options {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.25rem;
	}

	.options li a,
	.options li .disabled-row {
		display: grid;
		grid-template-columns: 7.5rem auto 1fr;
		align-items: baseline;
		gap: 0.5rem;
		padding: 0.4rem 0.5rem;
		border-radius: var(--radius-sm);
		font-size: 0.92rem;
		text-decoration: none;
		color: var(--text-dark);
	}

	.options li a:hover {
		background: var(--surface-muted);
	}

	.options li.disabled .disabled-row {
		color: var(--text-soft);
		cursor: not-allowed;
	}

	.opt-value {
		font-weight: 600;
	}
	.opt-arrow {
		color: var(--text-soft);
	}
	.opt-method {
		color: var(--link-color);
	}
	.opt-method--empty {
		font-style: italic;
		color: var(--text-soft);
	}

	@media (max-width: 640px) {
		.badges {
			grid-template-columns: 1fr;
		}
	}
</style>
