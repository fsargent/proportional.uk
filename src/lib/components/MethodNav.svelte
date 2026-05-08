<script lang="ts">
	import { METHODS, type Method, type MethodFamily, type MethodId } from '$lib/data/methods';

	type Props = { current?: MethodId };
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
	const groups: Group[] = FAMILY_ORDER.map((family) => ({
		family,
		methods: Object.values(METHODS).filter((m) => m.family === family)
	})).filter((g) => g.methods.length > 0);
</script>

<nav class="method-nav" aria-label="Voting methods">
	<a class="home-link" href="/">← Home</a>

	{#each groups as group (group.family)}
		<section class="group family-{group.family}">
			<h2 class="group-label">{FAMILY_LABEL[group.family]}</h2>
			<ul class="methods">
				{#each group.methods as m (m.id)}
					<li>
						{#if m.id === current}
							<span class="link link-current" aria-current="page">{m.name}</span>
						{:else}
							<a class="link" href={m.route}>{m.name}</a>
						{/if}
					</li>
				{/each}
			</ul>
		</section>
	{/each}

	<section class="group group-tools">
		<h2 class="group-label">Tools</h2>
		<ul class="methods">
			<li>
				<a class="link" href="/visualiser">Multi-Member District Visualiser</a>
			</li>
		</ul>
	</section>
</nav>

<style>
	.method-nav {
		display: grid;
		gap: 0.85rem;
		padding: 1rem 1.1rem;
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		background: var(--surface-raised);
		box-shadow: var(--shadow-soft);
	}

	.home-link {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--link-color);
		text-decoration: none;
	}
	.home-link:hover {
		text-decoration: underline;
	}

	.group {
		padding-left: 0.7rem;
		border-left: 3px solid transparent;
		display: grid;
		gap: 0.35rem;
	}

	.group.family-approval {
		border-left-color: var(--family-approval);
	}
	.group.family-mixed {
		border-left-color: var(--family-mixed);
	}
	.group.family-ranked {
		border-left-color: var(--family-ranked);
	}
	.group.family-single-mark {
		border-left-color: var(--family-single-mark);
	}

	.group-tools {
		border-left-color: var(--border-strong);
	}

	.group-label {
		margin: 0;
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: var(--text-soft);
	}

	.methods {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.15rem;
	}

	.link {
		display: block;
		padding: 0.35rem 0.55rem;
		border-radius: var(--radius-sm);
		font-size: 0.92rem;
		font-weight: 500;
		line-height: 1.3;
		color: var(--link-color);
		text-decoration: none;
		transition:
			background-color 0.15s ease,
			color 0.15s ease;
	}

	a.link:hover {
		background: var(--surface-emphasis);
	}

	.link-current {
		background: var(--surface-muted);
		color: var(--text-dark);
		font-weight: 700;
		cursor: default;
	}
</style>
