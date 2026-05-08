<script lang="ts">
	import { page } from '$app/state';
	import { METHODS, type Method, type MethodId } from '$lib/data/methods';
	import {
		ATOM_VALUE_LABEL,
		AXIS_LABEL,
		SWAP_AXES,
		type SwapAxis
	} from '$lib/data/atom-graph';

	type Props = { destination: MethodId };
	let { destination }: Props = $props();

	const fromParam = $derived(page.url.searchParams.get('from'));
	const swapParam = $derived(page.url.searchParams.get('swap'));

	const fromMethod = $derived<Method | null>(
		fromParam && fromParam in METHODS ? METHODS[fromParam as MethodId] : null
	);
	const swappedAxis = $derived<SwapAxis | null>(
		swapParam && (SWAP_AXES as readonly string[]).includes(swapParam) ? (swapParam as SwapAxis) : null
	);

	const dest = $derived(METHODS[destination]);

	const visible = $derived(fromMethod !== null && swappedAxis !== null);
</script>

{#if visible && fromMethod && swappedAxis}
	<aside class="just-changed" role="status" aria-live="polite">
		<p class="message">
			You swapped the <strong>{AXIS_LABEL[swappedAxis].toLowerCase()}</strong> from
			<strong>{ATOM_VALUE_LABEL[fromMethod.atoms[swappedAxis]]}</strong> to
			<strong>{ATOM_VALUE_LABEL[dest.atoms[swappedAxis]]}</strong>.
		</p>
		<a class="back-link" href={fromMethod.route}>← back to {fromMethod.name}</a>
	</aside>
{/if}

<style>
	.just-changed {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem 1rem;
		padding: 0.7rem 1rem;
		border: 1px solid var(--accent-border-strong);
		border-left-width: 4px;
		border-radius: var(--radius-sm);
		background: var(--surface-emphasis);
	}

	.message {
		margin: 0;
		font-size: 0.92rem;
		color: var(--text-dark);
	}

	.message strong {
		font-weight: 700;
	}

	.back-link {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--link-color);
		text-decoration: none;
		white-space: nowrap;
	}

	.back-link:hover {
		text-decoration: underline;
	}
</style>
