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
		background: white;
		border: 1px solid #ddd;
		border-radius: 8px;
		padding: 1.5rem;
		transition: all 0.2s ease;
	}

	.faq-item:hover {
		border-color: #1d70b8;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.faq-item h3 {
		margin-top: 0;
		color: #1d70b8;
		font-size: 1.1rem;
		margin-bottom: 0.75rem;
	}

	.faq-content :global(p) {
		margin: 0;
		color: #555;
		line-height: 1.6;
	}

	.faq-content :global(ul) {
		margin: 1rem 0;
		padding-left: 1.5rem;
	}

	.faq-content :global(li) {
		margin-bottom: 0.5rem;
	}

	.faq-content :global(a) {
		color: #005ea5;
		text-decoration: none;
		border-bottom: 1px solid rgba(0, 94, 165, 0.2);
	}

	.faq-content :global(a:hover) {
		color: #004d84;
		border-bottom-color: rgba(0, 77, 132, 0.35);
	}
</style>
