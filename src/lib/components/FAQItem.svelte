<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		question: string;
		children: Snippet;
	}

	let { question, children }: Props = $props();
</script>

<div class="faq-item">
	<h3>{question}</h3>
	<div class="faq-content">
		{@render children()}
	</div>
</div>

<style>
	.faq-item {
		background: rgba(255, 255, 255, 0.94);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		padding: 1.5rem;
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease,
			transform 0.2s ease;
		box-shadow: var(--shadow-soft);
	}

	.faq-item:hover {
		border-color: var(--border-strong);
		box-shadow: var(--shadow-strong);
		transform: translateY(-1px);
	}

	.faq-item h3 {
		margin-top: 0;
		color: var(--header-bg);
		font-size: 1.1rem;
		margin-bottom: 0.75rem;
	}

	.faq-content {
		display: grid;
		gap: 0.85rem;
	}

	.faq-content :global(p) {
		margin: 0;
		color: var(--text-color);
		line-height: 1.7;
		max-width: none;
	}

	.faq-content :global(ul) {
		margin: 1rem 0;
		padding-left: 1.5rem;
	}

	.faq-content :global(li) {
		margin-bottom: 0.5rem;
	}

	.faq-content :global(a) {
		color: var(--link-color);
		text-decoration: none;
		border-bottom: 1px solid rgba(10, 92, 151, 0.2);
	}

	.faq-content :global(a:hover) {
		color: var(--link-hover);
		border-bottom-color: rgba(8, 74, 122, 0.35);
	}
</style>
