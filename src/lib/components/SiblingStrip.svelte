<script lang="ts">
	import { type MethodId } from '$lib/data/methods';
	import { deltaLine, relatedMethods, type Relation } from '$lib/data/atom-graph';

	type Props = {
		method: MethodId;
		/**
		 * Minimum number of shared atoms required for inclusion. Default 1 — relaxed
		 * because with only 6 methods on the site, the spec's "≥2 of 3" rule leaves
		 * 4 of 6 methods with no siblings. Pass 2 to enforce strict.
		 */
		minShared?: number;
	};
	let { method, minShared = 1 }: Props = $props();

	const all = $derived(relatedMethods(method));
	const visible = $derived<Relation[]>(all.filter((r) => r.sharedAxes.length >= minShared));
</script>

{#if visible.length > 0}
	<aside class="sibling-strip" aria-labelledby="sibling-strip-title">
		<header class="strip-head">
			<h2 id="sibling-strip-title" class="strip-title">Closely related</h2>
			<p class="strip-sub">Same atoms shared, others swapped.</p>
		</header>
		<ul class="cards">
			{#each visible as rel (rel.method.id)}
				<li>
					<a class="card family-{rel.method.family}" href={rel.method.route}>
						<header>
							<h3>{rel.method.name}</h3>
							<span class="character">{rel.method.character}</span>
						</header>
						<p class="delta">{deltaLine(rel)}</p>
						<p class="short">{rel.method.shortDescription}</p>
					</a>
				</li>
			{/each}
		</ul>
	</aside>
{/if}

<style>
	.sibling-strip {
		display: grid;
		gap: 0.85rem;
	}

	.strip-head {
		display: grid;
		gap: 0.15rem;
	}
	.strip-title {
		margin: 0;
		font-size: 1.25rem;
	}
	.strip-sub {
		margin: 0;
		font-size: 0.9rem;
		color: var(--text-soft);
	}

	.cards {
		list-style: none;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 0.85rem;
		padding: 0;
		margin: 0;
	}

	.card {
		display: grid;
		gap: 0.5rem;
		padding: 1rem 1.1rem;
		border: 1px solid var(--border-color);
		border-left-width: 4px;
		border-radius: var(--radius-md);
		background: var(--surface-color);
		box-shadow: var(--shadow-soft);
		text-decoration: none;
		color: var(--text-dark);
		transition:
			border-color 0.15s ease,
			transform 0.15s ease,
			box-shadow 0.15s ease;
	}

	.card.family-approval {
		border-left-color: var(--family-approval);
	}
	.card.family-ranked {
		border-left-color: var(--family-ranked);
	}
	.card.family-mixed {
		border-left-color: var(--family-mixed);
	}
	.card.family-single-mark {
		border-left-color: var(--family-single-mark);
	}

	.card:hover {
		border-color: var(--accent-border-strong);
		transform: translateY(-1px);
		box-shadow: var(--shadow-strong);
	}

	.card header {
		display: grid;
		gap: 0.1rem;
	}

	.card h3 {
		margin: 0;
		font-size: 1.05rem;
		color: var(--link-color);
	}
	.character {
		font-size: 0.85rem;
		color: var(--text-soft);
		font-style: italic;
	}

	.delta {
		margin: 0;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text-color);
	}
	.short {
		margin: 0;
		font-size: 0.92rem;
		line-height: 1.45;
		color: var(--text-color);
	}
</style>
