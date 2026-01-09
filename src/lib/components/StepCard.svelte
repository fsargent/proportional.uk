<script lang="ts">
	interface Props {
		number: number;
		title: string;
		description: string;
	}

	let { number, title, description }: Props = $props();
</script>

<div class="step-card">
	<div class="step-number">{number}</div>
	<h3>{title}</h3>
	<p>{description}</p>
</div>

<style>
	.step-card {
		background: white;
		border: 2px solid #ddd;
		border-radius: 8px;
		padding: 2rem;
		text-align: center;
		transition: all 0.3s ease;
	}

	.step-card:hover {
		border-color: #1d70b8;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.step-number {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 3rem;
		height: 3rem;
		background: #1d70b8;
		color: white;
		border-radius: 50%;
		font-size: 1.5rem;
		font-weight: bold;
		margin: 0 auto 1rem;
	}

	.step-card h3 {
		margin: 0 0 0.75rem 0;
		color: #0b0c0c;
		font-size: 1.1rem;
	}

	.step-card p {
		margin: 0;
		color: #555;
		font-size: 0.95rem;
		line-height: 1.5;
	}
</style>
