<script lang="ts">
	import { METHODS, type Method } from '$lib/data/methods';

	const rows: Method[] = Object.values(METHODS);
</script>

<svelte:head>
	<title>Dev — METHODS preview</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main>
	<header>
		<h1>METHODS data preview</h1>
		<p class="subtitle">
			Dev-only inspection of <code>src/lib/data/methods.ts</code>. Not linked from the site.
		</p>
		<p class="counts">
			{rows.length} methods · multi-member: {rows.filter((m) => m.atoms.district === 'multi-member')
				.length} · approval-family: {rows.filter((m) => m.family === 'approval').length} ·
			proportional: {rows.filter((m) => m.proportionality === 'full').length}
		</p>
	</header>

	{#each rows as m (m.id)}
		<article class="method-card">
			<header class="card-head">
				<h2>
					<a href={m.route}>{m.name}</a>
					<span class="character">— {m.character}</span>
				</h2>
				<code class="id">{m.id}</code>
			</header>

			<dl class="grid">
				<dt>Family</dt>
				<dd><code>{m.family}</code></dd>

				<dt>Atoms</dt>
				<dd>
					<code>{m.atoms.ballot}</code> ·
					<code>{m.atoms.district}</code> ·
					<code>{m.atoms.allocation}</code>
				</dd>

				<dt>Route</dt>
				<dd><code>{m.route}</code></dd>

				<dt>Short description</dt>
				<dd>{m.shortDescription}</dd>

				<dt>Tradeoff</dt>
				<dd>{m.tradeoff}</dd>

				<dt>Used by</dt>
				<dd>
					{#if m.usedBy.length === 0}
						<span class="empty">— none authored —</span>
					{:else}
						<ul class="chips">
							{#each m.usedBy as chip (chip.code)}
								<li>
									<span class="flag" aria-hidden="true">{chip.flag}</span>
									<span>{chip.name}</span>
									<code>{chip.code}</code>
								</li>
							{/each}
						</ul>
					{/if}
				</dd>

				<dt>Tags</dt>
				<dd>
					<ul class="tags">
						{#each m.tags as tag (tag)}
							<li><code>{tag}</code></li>
						{/each}
					</ul>
				</dd>

				<dt>Voting machines</dt>
				<dd>
					<strong>{m.votingMachineCompatibility.existingMachines ? 'compatible' : 'needs new equipment'}</strong>
					— {m.votingMachineCompatibility.note}
				</dd>

				<dt>Proportionality</dt>
				<dd><code>{m.proportionality}</code></dd>
			</dl>
		</article>
	{/each}
</main>

<style>
	main {
		max-width: 960px;
		margin: 0 auto;
		padding: 2rem 1.5rem 4rem;
		font-family:
			ui-sans-serif,
			system-ui,
			-apple-system,
			sans-serif;
		color: #1a1a1a;
	}

	header h1 {
		margin: 0 0 0.25rem;
		font-size: 2rem;
	}

	.subtitle {
		margin: 0 0 0.5rem;
		color: #555;
	}

	.counts {
		margin: 0 0 2rem;
		font-size: 0.9rem;
		color: #444;
		font-family: ui-monospace, SFMono-Regular, monospace;
	}

	.method-card {
		border: 1px solid #ddd;
		border-radius: 8px;
		padding: 1.25rem 1.5rem;
		margin-bottom: 1.5rem;
		background: #fff;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
	}

	.card-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.card-head h2 {
		margin: 0;
		font-size: 1.25rem;
	}

	.card-head a {
		color: #0b5fff;
		text-decoration: none;
	}

	.card-head a:hover {
		text-decoration: underline;
	}

	.character {
		color: #777;
		font-weight: 400;
		font-style: italic;
		font-size: 0.95rem;
	}

	.id {
		color: #888;
		font-size: 0.85rem;
	}

	.grid {
		display: grid;
		grid-template-columns: 11rem 1fr;
		gap: 0.5rem 1rem;
		margin: 0;
	}

	.grid dt {
		color: #555;
		font-size: 0.85rem;
		font-weight: 500;
	}

	.grid dd {
		margin: 0;
	}

	code {
		background: #f3f3f3;
		padding: 0.05rem 0.35rem;
		border-radius: 3px;
		font-size: 0.85em;
		font-family: ui-monospace, SFMono-Regular, monospace;
	}

	.chips,
	.tags {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.chips li {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		border: 1px solid #e0e0e0;
		border-radius: 999px;
		padding: 0.15rem 0.6rem;
		background: #fafafa;
		font-size: 0.85rem;
	}

	.flag {
		font-size: 1rem;
		line-height: 1;
	}

	.empty {
		color: #999;
		font-style: italic;
		font-size: 0.9rem;
	}
</style>
