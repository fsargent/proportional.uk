<script lang="ts">
	import MethodNav from './MethodNav.svelte';
	import type { MethodId } from '$lib/data/methods';

	type Props = {
		current?: MethodId;
		/** Whether a desktop rail handles this nav at >=1280px. When true, the
		 * hamburger hides at wide viewports (rail takes over). When false, the
		 * hamburger stays visible — useful on pages without a rail. */
		hasRail?: boolean;
	};
	let { current, hasRail = false }: Props = $props();

	let open = $state(false);

	function close() {
		open = false;
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') close();
	}
</script>

<svelte:window {onkeydown} />

<button
	class="menu-button"
	class:menu-button--has-rail={hasRail}
	type="button"
	aria-expanded={open}
	aria-controls="method-nav-drawer"
	aria-label="Open methods navigation"
	onclick={() => (open = !open)}
>
	<svg
		viewBox="0 0 24 24"
		width="24"
		height="24"
		aria-hidden="true"
		focusable="false"
		fill="none"
		stroke="currentColor"
		stroke-width="2.2"
		stroke-linecap="round"
	>
		{#if open}
			<line x1="6" y1="6" x2="18" y2="18" />
			<line x1="18" y1="6" x2="6" y2="18" />
		{:else}
			<line x1="4" y1="7" x2="20" y2="7" />
			<line x1="4" y1="12" x2="20" y2="12" />
			<line x1="4" y1="17" x2="20" y2="17" />
		{/if}
	</svg>
	<span class="menu-label">Methods</span>
</button>

{#if open}
	<button
		class="backdrop"
		class:backdrop--has-rail={hasRail}
		type="button"
		aria-label="Close menu"
		onclick={close}
		tabindex="-1"
	></button>
	<aside
		id="method-nav-drawer"
		class="drawer"
		class:drawer--has-rail={hasRail}
		aria-label="Voting methods navigation"
	>
		<header class="drawer-head">
			<span class="drawer-title">Voting methods</span>
			<button
				class="close-button"
				type="button"
				aria-label="Close menu"
				onclick={close}
			>
				<svg
					viewBox="0 0 24 24"
					width="20"
					height="20"
					aria-hidden="true"
					focusable="false"
					fill="none"
					stroke="currentColor"
					stroke-width="2.2"
					stroke-linecap="round"
				>
					<line x1="6" y1="6" x2="18" y2="18" />
					<line x1="18" y1="6" x2="6" y2="18" />
				</svg>
			</button>
		</header>
		<div class="drawer-body" onclickcapture={close} role="presentation">
			<MethodNav {current} />
		</div>
	</aside>
{/if}

<style>
	.menu-button {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.5rem 0.85rem;
		border: 1px solid rgba(255, 255, 255, 0.35);
		border-radius: var(--radius-sm);
		background: transparent;
		color: var(--text-inverse);
		font-family: inherit;
		font-size: 0.9rem;
		font-weight: 600;
		line-height: 1;
		cursor: pointer;
		transition:
			background-color 0.15s ease,
			border-color 0.15s ease;
	}

	.menu-button:hover {
		background: rgba(255, 255, 255, 0.1);
		border-color: rgba(255, 255, 255, 0.55);
	}

	.menu-button:focus-visible {
		outline: 2px solid rgba(255, 255, 255, 0.7);
		outline-offset: 2px;
	}

	.menu-label {
		display: inline;
	}

	.backdrop {
		position: fixed;
		inset: 0;
		background: rgba(15, 23, 32, 0.55);
		border: 0;
		padding: 0;
		cursor: pointer;
		z-index: 90;
		animation: fade-in 0.15s ease;
	}

	.drawer {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		width: min(20rem, 92vw);
		background: var(--surface-color);
		box-shadow: -10px 0 30px rgba(0, 0, 0, 0.25);
		z-index: 100;
		display: grid;
		grid-template-rows: auto 1fr;
		animation: slide-in 0.18s ease;
	}

	.drawer-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.85rem 1rem;
		border-bottom: 1px solid var(--border-color);
		background: var(--surface-emphasis);
	}

	.drawer-title {
		font-size: 0.78rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: var(--text-soft);
	}

	.close-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		padding: 0;
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
		background: var(--surface-color);
		color: var(--text-dark);
		cursor: pointer;
	}

	.close-button:hover {
		background: var(--surface-muted);
	}

	.drawer-body {
		padding: 1rem;
		overflow-y: auto;
	}

	/* On pages with a desktop rail, hide the hamburger at >=1280px since the
	   rail takes over. On pages without a rail (home, etc.), keep it visible. */
	@media (min-width: 1280px) {
		.menu-button--has-rail,
		.backdrop--has-rail,
		.drawer--has-rail {
			display: none;
		}
	}

	/* Drop the label text on very narrow viewports to keep the button compact. */
	@media (max-width: 480px) {
		.menu-label {
			display: none;
		}
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes slide-in {
		from {
			transform: translateX(100%);
		}
		to {
			transform: translateX(0);
		}
	}
</style>
