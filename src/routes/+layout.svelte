<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { METHODS, type MethodId } from '$lib/data/methods';
	import MethodNavMenu from '$lib/components/MethodNavMenu.svelte';
	let { children } = $props();
	const isGlitchPage = $derived(page.url.pathname.startsWith('/glitch-poc'));
	// Method pages span the full viewport so a 3-column grid can put the rail
	// beside (not inside) the article reading column at >=1280px viewports.
	// Below that, a hamburger drawer in the header replaces the rail.
	// Normalise trailing slashes since SvelteKit may serve either form.
	const normalisedPath = $derived(page.url.pathname.replace(/\/$/, ''));
	const currentMethodId = $derived<MethodId | undefined>(
		Object.values(METHODS).find((m) => m.route === normalisedPath)?.id
	);
	const isMethodPage = $derived(currentMethodId !== undefined);
	// The home page already shows the petition CTA in its body; non-home
	// pages get it in the footer instead of the tagline so every page
	// carries a call to action.
	const isHomePage = $derived(normalisedPath === '');
</script>

<a href="#main-content" class="govuk-skip-link">Skip to main content</a>

{#if !isGlitchPage}
	<header class="govuk-header">
		<div class="govuk-header__container">
			<div class="govuk-header__logo">
				<a href="/" class="govuk-header__link govuk-header__link--homepage">
					<span class="govuk-header__logotype-text">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							focusable="false"
							role="img"
							viewBox="0 0 65 55"
							height="30"
							width="30"
							fill="currentcolor"
							class="govuk-header__logotype"
							aria-label="Ballot Box"
						>
							<title>Ballot Box</title>
							<g>
								<circle cx="20" cy="17.6" r="3.7"></circle>
								<circle cx="10.2" cy="23.5" r="3.7"></circle>
								<circle cx="3.7" cy="33.2" r="3.7"></circle>
								<circle cx="31.7" cy="30.6" r="3.7"></circle>
								<circle cx="43.3" cy="17.6" r="3.7"></circle>
								<circle cx="53.2" cy="23.5" r="3.7"></circle>
								<circle cx="59.7" cy="33.2" r="3.7"></circle>
								<circle cx="31.7" cy="30.6" r="3.7"></circle>
								<path d="M33.1,9.8c.2-.1.3-.3.5-.5l4.6,2.4v-6.8l-4.6,1.5c-.1-.2-.3-.3-.5-.5l1.9-5.9h-6.7l1.9,5.9c-.2.1-.3.3-.5.5l-4.6-1.5v6.8l4.6-2.4c.1.2.3.3.5.5l-2.6,8c-.9,2.8,1.2,5.7,4.1,5.7h0c3,0,5.1-2.9,4.1-5.7l-2.6-8ZM37,37.9s-3.4,3.8-4.1,6.1c2.2,0,4.2-.5,6.4-2.8l-.7,8.5c-2-2.8-4.4-4.1-5.7-3.8.1,3.1.5,6.7,5.8,7.2,3.7.3,6.7-1.5,7-3.8.4-2.6-2-4.3-3.7-1.6-1.4-4.5,2.4-6.1,4.9-3.2-1.9-4.5-1.8-7.7,2.4-10.9,3,4,2.6,7.3-1.2,11.1,2.4-1.3,6.2,0,4,4.6-1.2-2.8-3.7-2.2-4.2.2-.3,1.7.7,3.7,3,4.2,1.9.3,4.7-.9,7-5.9-1.3,0-2.4.7-3.9,1.7l2.4-8c.6,2.3,1.4,3.7,2.2,4.5.6-1.6.5-2.8,0-5.3l5,1.8c-2.6,3.6-5.2,8.7-7.3,17.5-7.4-1.1-15.7-1.7-24.5-1.7h0c-8.8,0-17.1.6-24.5,1.7-2.1-8.9-4.7-13.9-7.3-17.5l5-1.8c-.5,2.5-.6,3.7,0,5.3.8-.8,1.6-2.3,2.2-4.5l2.4,8c-1.5-1-2.6-1.7-3.9-1.7,2.3,5,5.2,6.2,7,5.9,2.3-.4,3.3-2.4,3-4.2-.5-2.4-3-3.1-4.2-.2-2.2-4.6,1.6-6,4-4.6-3.7-3.7-4.2-7.1-1.2-11.1,4.2,3.2,4.3,6.4,2.4,10.9,2.5-2.8,6.3-1.3,4.9,3.2-1.8-2.7-4.1-1-3.7,1.6.3,2.3,3.3,4.1,7,3.8,5.4-.5,5.7-4.2,5.8-7.2-1.3-.2-3.7,1-5.7,3.8l-.7-8.5c2.2,2.3,4.2,2.7,6.4,2.8-.7-2.3-4.1-6.1-4.1-6.1h10.6,0Z"></path>
							</g>
						</svg>
						Proportional.uk
					</span>
				</a>
			</div>

			{#if !isGlitchPage}
				<MethodNavMenu current={currentMethodId} hasRail={isMethodPage} />
			{/if}
		</div>
	</header>
{/if}

<main id="main-content" class:govuk-main-wrapper={!isGlitchPage} class="main-shell">
	<div
		class:govuk-width-container={!isGlitchPage && !isMethodPage}
		class:method-width-container={isMethodPage}
		class:glitch-width-container={isGlitchPage}
	>
		<div class="content">
			{@render children()}
		</div>
	</div>
</main>

{#if !isGlitchPage}
	{#if isHomePage}
		<footer class="site-footer">
			<div class="footer-content">
				<p class="footer-tagline">Better voting for a better democracy</p>
				<p class="footer-credit">
					Built by
					<a href="https://felixsargent.com/" target="_blank" rel="noopener noreferrer">Felix Sargent</a>
				</p>
			</div>
		</footer>
	{:else}
		<footer class="site-footer petition-footer">
			<a
				class="petition-cta"
				href="https://www.open-britain.co.uk/ncer"
				target="_blank"
				rel="noopener noreferrer"
			>
				<span class="petition-eyebrow">Take action</span>
				<h2 class="petition-headline">
					Sign the petition for a National Commission on Electoral Reform
				</h2>
				<p class="petition-body">
					Parliament should establish an independent commission to assess whether First Past the
					Post is still fit for purpose — and if not, what should replace it. The single most useful
					thing you can do right now.
				</p>
				<span class="petition-action">Sign the petition at open-britain.co.uk →</span>
			</a>
		</footer>
	{/if}
{/if}

<style>
	.govuk-skip-link {
		display: block;
		padding: 0.85rem 1rem;
		margin: 0;
		overflow: hidden;
		background-color: var(--text-dark);
		color: var(--text-inverse);
		text-decoration: none;
		font-size: 0.95rem;
		font-weight: 700;
		position: absolute;
		left: -9999px;
		z-index: 999;
	}

	.govuk-skip-link:focus {
		left: 0;
		right: 0;
		top: 0;
		z-index: 999;
	}

	.govuk-header {
		background: linear-gradient(180deg, var(--header-bg) 0%, var(--header-bg-strong) 100%);
		border-bottom: none;
		margin-bottom: 0;
		width: 100%;
		box-shadow: 0 10px 24px rgba(17, 38, 59, 0.12);
	}

	.govuk-header__container {
		padding: 0.95rem 1rem;
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 4.5rem;
		gap: 1rem;
	}

	.govuk-header__logo {
		display: flex;
		align-items: center;
	}

	.govuk-header__link--homepage {
		font-family: inherit;
		font-weight: 700;
		font-size: 1.05rem;
		line-height: 1.2;
		color: var(--text-inverse);
		text-decoration: none;
		display: flex;
		align-items: center;
	}

	.govuk-header__link--homepage:hover {
		text-decoration: none;
		opacity: 0.92;
	}

	.govuk-header__logotype-text {
		font-size: 1.6rem;
		font-weight: 600;
		letter-spacing: -0.03em;
		line-height: 31px;
		color: var(--text-inverse);
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		vertical-align: top;
		height: 31px;
		-webkit-font-smoothing: antialiased;
	}

	:global(.govuk-header__logotype) {
		vertical-align: middle;
	}

	.govuk-header__link--homepage:focus-visible {
		outline-color: rgba(255, 255, 255, 0.45);
	}

	.main-shell {
		display: block;
	}

	.govuk-main-wrapper {
		padding-top: 2rem;
		padding-bottom: 1.25rem;
	}

	.govuk-width-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
	}

	/* Method pages span the full viewport (minus padding) so the page-level
	   3-column grid can put the rail in the actual viewport margin, not inside
	   the article reading column. */
	.method-width-container {
		max-width: none;
		margin: 0;
		padding: 0 1rem;
	}

	/* Override the 54rem cap that .content normally applies — the method-page
	   handles its own width via a centred grid. */
	.method-width-container :global(.content) {
		max-width: none;
	}

	.glitch-width-container {
		max-width: 1400px;
		margin: 0 auto;
		padding: 1rem;
	}

	.site-footer {
		background: var(--footer-gradient);
		border-top: 1px solid var(--border-color);
		padding: 1.85rem 1rem;
		margin-top: 2rem;
	}

	.footer-content {
		max-width: 1200px;
		margin: 0 auto;
		text-align: center;
	}

	.footer-tagline {
		margin: 0 0 1rem 0;
		color: var(--text-dark);
		font-weight: 600;
		font-size: 1.1rem;
	}

	.footer-credit {
		margin: 0;
		font-size: 0.95rem;
		color: var(--text-soft);
	}

	.footer-credit a {
		color: var(--link-color);
		text-decoration: none;
	}

	.footer-credit a:hover {
		text-decoration: underline;
	}

	.petition-footer {
		padding: 0;
	}

	.petition-cta {
		display: block;
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1.5rem 2.25rem;
		text-decoration: none;
		color: var(--text-dark);
		text-align: center;
		transition: background-color 0.2s ease;
	}

	.petition-cta:hover {
		background: var(--surface-emphasis);
	}

	.petition-cta:focus-visible {
		outline: 3px solid var(--focus-ring);
		outline-offset: -3px;
	}

	.petition-eyebrow {
		display: inline-block;
		font-size: 0.78rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-soft);
		margin-bottom: 0.6rem;
	}

	.petition-headline {
		margin: 0 0 0.75rem 0;
		color: var(--accent-text);
		font-size: clamp(1.25rem, 2.2vw, 1.6rem);
		line-height: 1.3;
	}

	.petition-body {
		margin: 0 auto 1rem;
		max-width: 48rem;
		font-size: 1rem;
		line-height: 1.6;
		color: var(--text-color);
	}

	.petition-action {
		display: inline-block;
		font-weight: 700;
		color: var(--link-color);
		font-size: 1rem;
	}

	.petition-cta:hover .petition-action {
		text-decoration: underline;
	}

	@media (max-width: 47.9375rem) {
		.govuk-header__container {
			flex-direction: column;
			gap: 0.75rem;
			padding: 1rem;
			align-items: flex-start;
		}

		.govuk-header__link--homepage {
			font-size: 1.25rem;
		}

		.govuk-header__logotype-text {
			font-size: 1.25rem;
		}
	}
</style>
