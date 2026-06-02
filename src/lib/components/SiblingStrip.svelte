<script lang="ts">
	import { METHODS, type MethodId } from '$lib/data/methods';

	type Props = {
		method: MethodId;
	};
	let { method }: Props = $props();

	const source = $derived(METHODS[method]);

	// Hand-curated peers from methods.ts (replaces algorithmic atom-graph
	// siblings). Each peer carries its "why they're siblings" rationale —
	// the editorial work of choosing the comparison is the value.
	const peers = $derived(
		(source.peers ?? [])
			.map((id) => ({ method: METHODS[id], rationale: source.peerRationale?.[id] ?? '' }))
			.filter((p) => p.method)
	);
</script>

{#if peers.length > 0}
	<aside class="sibling-strip" aria-labelledby="sibling-strip-title">
		<header class="strip-head">
			<h2 id="sibling-strip-title" class="strip-title">Closely related</h2>
			<p class="strip-sub">Hand-picked peers — and why they're siblings.</p>
		</header>
		<ul class="cards">
			{#each peers as peer (peer.method.id)}
				<li>
					<a class="card family-{peer.method.family}" href={peer.method.route}>
						<header>
							<h3>{peer.method.name}</h3>
							<span class="character">{peer.method.character}</span>
						</header>
						{#if peer.rationale}
							<p class="delta">{peer.rationale}</p>
						{/if}
						<p class="short">{peer.method.shortDescription}</p>
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
