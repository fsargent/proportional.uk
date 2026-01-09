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
		background: white;
		border: 2px solid #ddd;
		border-radius: 8px;
		padding: 2rem;
		transition: all 0.3s ease;
	}

	.benefit-card:hover {
		border-color: #1d70b8;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		transform: translateY(-2px);
	}

	.benefit-card h3 {
		margin-top: 0;
		color: #1d70b8;
		font-size: 1.25rem;
		margin-bottom: 1rem;
	}

	.benefit-card p {
		margin: 0;
		color: #555;
		line-height: 1.6;
	}
</style>
