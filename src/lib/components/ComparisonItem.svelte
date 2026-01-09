<script lang="ts">
	interface Props {
		title: string;
		items: string[];
	}

	let { title, items }: Props = $props();
</script>

<div class="comparison-item">
	<h3>{title}</h3>
	<div class="comparison-content">
		<ul>
			{#each items as item}
				<li>{item}</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	.comparison-item {
		border: 2px solid #ddd;
		border-radius: 0.5rem;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.comparison-item h3 {
		background: #1d70b8;
		color: white;
		margin: 0;
		padding: 1rem;
		font-size: 1.25rem;
	}

	.comparison-content {
		display: flex;
		flex-direction: column;
		flex: 1;
		padding: 1.5rem;
	}

	.comparison-content ul {
		margin: 0;
		padding-left: 1.5rem;
	}

	.comparison-content li {
		margin-bottom: 0.75rem;
		line-height: 1.6;
	}
</style>
