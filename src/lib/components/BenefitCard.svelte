<script lang="ts">
	interface Props {
		emoji: string;
		title: string;
		description: string;
	}

	let { emoji, title, description }: Props = $props();
</script>

<div class="benefit-card">
	<h3>{emoji} {title}</h3>
	<p>{description}</p>
</div>

<style>
	.benefit-card {
		background: rgba(255, 255, 255, 0.92);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		padding: 2rem;
		transition:
			border-color 0.22s ease,
			box-shadow 0.22s ease,
			transform 0.22s ease,
			background-color 0.22s ease;
		box-shadow: var(--shadow-soft);
	}

	.benefit-card:hover {
		border-color: var(--border-strong);
		background: var(--surface-color);
		box-shadow: var(--shadow-strong);
		transform: translateY(-2px);
	}

	.benefit-card h3 {
		margin-top: 0;
		color: var(--header-bg);
		font-size: 1.25rem;
		margin-bottom: 1rem;
		line-height: 1.25;
	}

	.benefit-card p {
		margin: 0;
		color: var(--text-color);
		line-height: 1.7;
		max-width: none;
	}
</style>
