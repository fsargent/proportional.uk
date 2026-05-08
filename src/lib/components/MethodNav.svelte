<script lang="ts">
	import { METHODS, type Method, type MethodFamily, type MethodId } from '$lib/data/methods';

	type Props = { current: MethodId };
	let { current }: Props = $props();

	// Family ordering — leads with approval (the site's editorial focus), then mixed,
	// then ranked, then single-mark.
	const FAMILY_ORDER: readonly MethodFamily[] = ['approval', 'mixed', 'ranked', 'single-mark'];

	const FAMILY_LABEL: Record<MethodFamily, string> = {
		approval: 'Approval',
		mixed: 'Mixed',
		ranked: 'Ranked',
		'single-mark': 'Single-mark'
	};

	type Group = { family: MethodFamily; methods: Method[] };
	const groups: Group[] = FAMILY_ORDER
		.map((family) => ({
			family,
			methods: Object.values(METHODS).filter((m) => m.family === family)
		}))
		.filter((g) => g.methods.length > 0);
</script>

<nav class="method-nav" aria-label="Voting methods">
	<a class="home-link" href="/">← Home</a>

	{#each groups as group (group.family)}
		<div class="row family-{group.family}">
			<span class="row-label">{FAMILY_LABEL[group.family]}</span>
			<ul class="pills">
				{#each group.methods as m (m.id)}
					<li>
						{#if m.id === current}
							<span class="pill pill-current" aria-current="page">{m.name}</span>
						{:else}
							<a class="pill" href={m.route}>{m.name}</a>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	{/each}
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
		padding-left: 0.6rem;
		border-left: 3px solid transparent;
	}

	.row.family-approval {
		border-left-color: var(--family-approval);
	}
	.row.family-mixed {
		border-left-color: var(--family-mixed);
	}
	.row.family-ranked {
		border-left-color: var(--family-ranked);
	}
	.row.family-single-mark {
		border-left-color: var(--family-single-mark);
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
