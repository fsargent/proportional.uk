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
		background: rgba(255, 255, 255, 0.92);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		padding: 2rem;
		text-align: center;
		transition:
			border-color 0.22s ease,
			box-shadow 0.22s ease,
			transform 0.22s ease;
		box-shadow: var(--shadow-soft);
	}

	.step-card:hover {
		border-color: var(--border-strong);
		box-shadow: var(--shadow-strong);
		transform: translateY(-2px);
	}

	.step-number {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 3rem;
		height: 3rem;
		background: linear-gradient(180deg, var(--header-bg) 0%, var(--header-bg-strong) 100%);
		color: var(--surface-color);
		border-radius: 50%;
		font-size: 1.5rem;
		font-weight: bold;
		margin: 0 auto 1rem;
	}

	.step-card h3 {
		margin: 0 0 0.75rem 0;
		color: var(--text-dark);
		font-size: 1.1rem;
	}

	.step-card p {
		margin: 0;
		color: var(--text-color);
		font-size: 0.95rem;
		line-height: 1.6;
		max-width: none;
	}
</style>
