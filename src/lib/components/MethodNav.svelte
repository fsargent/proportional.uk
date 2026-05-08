<script lang="ts">
	type Slug =
		| 'fptp'
		| 'single-winner-approval'
		| 'ams-plus'
		| 'proportional-approval'
		| 'stv'
		| 'party-list';

	type Method = {
		slug: Slug;
		href: string;
		label: string;
	};

	// PR methods ordered to lead with approval-based reforms (the site's editorial lean),
	// then ranked, then party-list.
	const proportional: Method[] = [
		{ slug: 'ams-plus', href: '/ams-plus', label: 'AMS+' },
		{ slug: 'proportional-approval', href: '/proportional-approval', label: 'Proportional Approval' },
		{ slug: 'stv', href: '/stv', label: 'STV' },
		{ slug: 'party-list', href: '/party-list', label: 'List PR' }
	];

	const singleWinner: Method[] = [
		{ slug: 'single-winner-approval', href: '/single-winner-approval', label: 'Single-Winner Approval' },
		{ slug: 'fptp', href: '/fptp', label: 'First Past the Post' }
	];

	let { current }: { current: Slug } = $props();
</script>

<nav class="method-nav" aria-label="Voting methods">
	<a class="home-link" href="/">← Home</a>

	<div class="row">
		<span class="row-label">Proportional</span>
		<ul class="pills">
			{#each proportional as m (m.slug)}
				<li>
					{#if m.slug === current}
						<span class="pill pill-current" aria-current="page">{m.label}</span>
					{:else}
						<a class="pill" href={m.href}>{m.label}</a>
					{/if}
				</li>
			{/each}
		</ul>
	</div>

	<div class="row">
		<span class="row-label">Single-winner</span>
		<ul class="pills">
			{#each singleWinner as m (m.slug)}
				<li>
					{#if m.slug === current}
						<span class="pill pill-current" aria-current="page">{m.label}</span>
					{:else}
						<a class="pill" href={m.href}>{m.label}</a>
					{/if}
				</li>
			{/each}
		</ul>
	</div>
</nav>

<style>
	.method-nav {
		display: grid;
		gap: 0.6rem;
		padding: 1rem 1.1rem;
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		background: var(--surface-raised);
		box-shadow: var(--shadow-soft);
	}

	.home-link {
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--link-color);
		text-decoration: none;
	}

	.home-link:hover {
		text-decoration: underline;
	}

	.row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem 0.85rem;
	}

	.row-label {
		font-size: 0.78rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-soft);
		min-width: 5.5rem;
	}

	.pills {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.pill {
		display: inline-block;
		padding: 0.4rem 0.85rem;
		border-radius: 999px;
		border: 1px solid var(--border-color);
		background: var(--surface-color);
		color: var(--link-color);
		font-size: 0.92rem;
		font-weight: 600;
		text-decoration: none;
		line-height: 1.2;
		transition:
			border-color 0.15s ease,
			background-color 0.15s ease,
			color 0.15s ease;
	}

	a.pill:hover {
		border-color: var(--accent-border-strong);
		background: var(--surface-emphasis);
	}

	.pill-current {
		background: linear-gradient(180deg, var(--header-bg) 0%, var(--header-bg-strong) 100%);
		border-color: transparent;
		color: var(--text-inverse);
		cursor: default;
	}

	@media (max-width: 600px) {
		.row {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.4rem;
		}
		.row-label {
			min-width: 0;
		}
	}
</style>
