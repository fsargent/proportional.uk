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
	<div class="step-body">
		<h3>{title}</h3>
		<p>{description}</p>
	</div>
</div>

<style>
	.step-card {
		display: flex;
		align-items: flex-start;
		gap: 1.25rem;
		background: var(--surface-raised);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		padding: 1.25rem 1.5rem;
		transition:
			border-color 0.22s ease,
			box-shadow 0.22s ease;
		box-shadow: var(--shadow-soft);
	}

	.step-card:hover {
		border-color: var(--border-strong);
		box-shadow: var(--shadow-strong);
	}

	.step-number {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		background: linear-gradient(180deg, var(--header-bg) 0%, var(--header-bg-strong) 100%);
		color: var(--text-inverse);
		border-radius: 50%;
		font-size: 1.2rem;
		font-weight: bold;
		flex-shrink: 0;
	}

	.step-body {
		flex: 1;
		min-width: 0;
	}

	.step-card h3 {
		margin: 0 0 0.4rem 0;
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
