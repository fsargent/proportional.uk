<script lang="ts">
	import type { Snippet } from 'svelte';
	import { METHODS, type MethodId } from '$lib/data/methods';
	import { SLOT_TITLES } from './spine';
	import ComposeBadgeRow from './ComposeBadgeRow.svelte';
	import SiblingStrip from './SiblingStrip.svelte';
	import FAQItem from './FAQItem.svelte';

	type Props = {
		methodId: MethodId;
		/** Page H1. Defaults to the method's full name. */
		title?: string;
		/**
		 * Snippet overrides. When supplied, the snippet replaces the data-driven
		 * default for that spine slot — used where a method needs richer content
		 * than the data layer carries (interactive ballot demos, bespoke
		 * visualisations, longer-form prose). When omitted, MethodPageBody
		 * renders the default from methods.ts (or skips the section if the data
		 * is absent).
		 */
		mechanics?: Snippet;
		workedExample?: Snippet;
		strengths?: Snippet;
		tradeoffs?: Snippet;
		whereUsed?: Snippet;
		compare?: Snippet;
		faq?: Snippet;
		bottomLine?: Snippet;
	};

	let {
		methodId,
		title,
		mechanics,
		workedExample,
		strengths,
		tradeoffs,
		whereUsed,
		compare,
		faq,
		bottomLine
	}: Props = $props();

	const method = $derived(METHODS[methodId]);
	const heading = $derived(title ?? method.name);
</script>

<article class="method-body" aria-labelledby="method-h1">
	<header class="method-header">
		<h1 id="method-h1">{heading}</h1>
		{#if method.character}
			<p class="character">{method.name} — <em>{method.character}</em></p>
		{/if}
		{#if method.lede}
			<p class="lede">{method.lede}</p>
		{/if}
		<ComposeBadgeRow method={methodId} />
	</header>

	<!-- 3. Ballot mechanics -->
	{#if mechanics || method.shortDescription}
		<section class="method-section" aria-labelledby="sec-mechanics">
			<h2 id="sec-mechanics" class="section-header">{SLOT_TITLES.mechanics}</h2>
			{#if mechanics}
				{@render mechanics()}
			{:else}
				<p>{method.shortDescription}</p>
			{/if}
		</section>
	{/if}

	<!-- 4. Worked example (snippet-only — interactives live on the page) -->
	{#if workedExample}
		<section class="method-section" aria-labelledby="sec-worked">
			<h2 id="sec-worked" class="section-header">{SLOT_TITLES['worked-example']}</h2>
			{@render workedExample()}
		</section>
	{/if}

	<!-- 5. Strengths -->
	{#if strengths || (method.strengthHeadlines && method.strengthHeadlines.length)}
		<section class="method-section" aria-labelledby="sec-strengths">
			<h2 id="sec-strengths" class="section-header">{SLOT_TITLES.strengths}</h2>
			{#if strengths}
				{@render strengths()}
			{:else}
				<ul class="point-list strengths">
					{#each method.strengthHeadlines ?? [] as point (point)}
						<li>{point}</li>
					{/each}
				</ul>
			{/if}
		</section>
	{/if}

	<!-- 6. Trade-offs -->
	{#if tradeoffs || (method.tradeoffHeadlines && method.tradeoffHeadlines.length)}
		<section class="method-section" aria-labelledby="sec-tradeoffs">
			<h2 id="sec-tradeoffs" class="section-header">{SLOT_TITLES.tradeoffs}</h2>
			{#if tradeoffs}
				{@render tradeoffs()}
			{:else}
				<ul class="point-list tradeoffs">
					{#each method.tradeoffHeadlines ?? [] as point (point)}
						<li>{point}</li>
					{/each}
				</ul>
			{/if}
		</section>
	{/if}

	<!-- 7. Where it's used -->
	<section class="method-section" aria-labelledby="sec-where">
		<h2 id="sec-where" class="section-header">{SLOT_TITLES['where-used']}</h2>
		{#if whereUsed}
			{@render whereUsed()}
		{:else if method.usedBy.length}
			<ul class="usedby">
				{#each method.usedBy as place (place.code)}
					<li class="usedby-chip"><span class="flag" aria-hidden="true">{place.flag}</span>{place.name}</li>
				{/each}
			</ul>
		{:else}
			<p class="usedby-empty">
				No national legislature uses this exact configuration yet — see the method body above for the
				closest real-world systems.
			</p>
		{/if}
	</section>

	<!-- 8. How it compares (in-body editorial block — opt-in via snippet).
	     Curated peers also surface at the foot via <SiblingStrip>; this slot is
	     for a richer in-body comparison when a page wants one. The dedicated
	     /compare destination carries the heavy cross-method comparison. -->
	{#if compare}
		<section class="method-section" aria-labelledby="sec-compare">
			<h2 id="sec-compare" class="section-header">{SLOT_TITLES.compares}</h2>
			{@render compare()}
		</section>
	{/if}

	<!-- 9. Common questions -->
	{#if faq || (method.faqs && method.faqs.length)}
		<section class="method-section" aria-labelledby="sec-faq">
			<h2 id="sec-faq" class="section-header">{SLOT_TITLES.faq}</h2>
			{#if faq}
				{@render faq()}
			{:else}
				<div class="faq-list">
					{#each method.faqs ?? [] as item (item.q)}
						<FAQItem question={item.q}><p>{item.a}</p></FAQItem>
					{/each}
				</div>
			{/if}
		</section>
	{/if}

	<!-- 10. The bottom line -->
	{#if bottomLine || method.bottomLine}
		<section class="method-section bottom-line" aria-labelledby="sec-bottom">
			<h2 id="sec-bottom" class="section-header bottom-line-heading">{SLOT_TITLES['bottom-line']}</h2>
			{#if bottomLine}
				{@render bottomLine()}
			{:else}
				<p>{method.bottomLine}</p>
			{/if}
		</section>
	{/if}

	<SiblingStrip method={methodId} />
</article>

<style>
	.method-body {
		display: grid;
		gap: 2rem;
		min-width: 0;
	}

	.method-header {
		display: grid;
		gap: 1rem;
	}

	.method-header > * {
		min-width: 0;
		max-width: 100%;
	}

	.method-header h1 {
		margin: 0;
		min-width: 0;
		overflow-wrap: anywhere;
	}

	.character {
		margin: 0;
		font-size: 1.05rem;
		color: var(--text-soft);
	}

	.character em {
		font-style: italic;
		color: var(--accent-text);
	}

	.lede {
		margin: 0;
		font-size: 1.1rem;
		line-height: 1.7;
	}

	.method-section {
		display: grid;
		gap: 1rem;
		min-width: 0;
	}

	.method-section :global(p) {
		margin: 0;
		line-height: 1.7;
	}

	.point-list {
		margin: 0;
		padding-left: 1.25rem;
		display: grid;
		gap: 0.5rem;
	}

	.point-list li {
		line-height: 1.6;
	}

	.usedby {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.usedby-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.35rem 0.7rem;
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
		background: var(--surface-raised);
		font-size: 0.95rem;
	}

	.usedby-empty {
		color: var(--text-soft);
	}

	.faq-list {
		display: grid;
		gap: 0.85rem;
	}

	/* PRD: the Bottom Line heading uses the display face. Falls back gracefully
	   to the inherited font until the --font-display token lands in app.css. */
	.bottom-line-heading {
		font-family: var(--font-display, inherit);
	}
</style>
