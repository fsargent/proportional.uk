<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { readingMode, setReadingMode } from '$lib/stores/navigation';

	let { children } = $props();
	const isHomePage = $derived(page.url.pathname === '/');
</script>

<a href="#main-content" class="govuk-skip-link">Skip to main content</a>

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
							<path
								d="M33.1,9.8c.2-.1.3-.3.5-.5l4.6,2.4v-6.8l-4.6,1.5c-.1-.2-.3-.3-.5-.5l1.9-5.9h-6.7l1.9,5.9c-.2.1-.3.3-.5.5l-4.6-1.5v6.8l4.6-2.4c.1.2.3.3.5.5l-2.6,8c-.9,2.8,1.2,5.7,4.1,5.7h0c3,0,5.1-2.9,4.1-5.7l-2.6-8ZM37,37.9s-3.4,3.8-4.1,6.1c2.2,0,4.2-.5,6.4-2.8l-.7,8.5c-2-2.8-4.4-4.1-5.7-3.8.1,3.1.5,6.7,5.8,7.2,3.7.3,6.7-1.5,7-3.8.4-2.6-2-4.3-3.7-1.6-1.4-4.5,2.4-6.1,4.9-3.2-1.9-4.5-1.8-7.7,2.4-10.9,3,4,2.6,7.3-1.2,11.1,2.4-1.3,6.2,0,4,4.6-1.2-2.8-3.7-2.2-4.2.2-.3,1.7.7,3.7,3,4.2,1.9.3,4.7-.9,7-5.9-1.3,0-2.4.7-3.9,1.7l2.4-8c.6,2.3,1.4,3.7,2.2,4.5.6-1.6.5-2.8,0-5.3l5,1.8c-2.6,3.6-5.2,8.7-7.3,17.5-7.4-1.1-15.7-1.7-24.5-1.7h0c-8.8,0-17.1.6-24.5,1.7-2.1-8.9-4.7-13.9-7.3-17.5l5-1.8c-.5,2.5-.6,3.7,0,5.3.8-.8,1.6-2.3,2.2-4.5l2.4,8c-1.5-1-2.6-1.7-3.9-1.7,2.3,5,5.2,6.2,7,5.9,2.3-.4,3.3-2.4,3-4.2-.5-2.4-3-3.1-4.2-.2-2.2-4.6,1.6-6,4-4.6-3.7-3.7-4.2-7.1-1.2-11.1,4.2,3.2,4.3,6.4,2.4,10.9,2.5-2.8,6.3-1.3,4.9,3.2-1.8-2.7-4.1-1-3.7,1.6.3,2.3,3.3,4.1,7,3.8,5.4-.5,5.7-4.2,5.8-7.2-1.3-.2-3.7,1-5.7,3.8l-.7-8.5c2.2,2.3,4.2,2.7,6.4,2.8-.7-2.3-4.1-6.1-4.1-6.1h10.6,0Z"
							></path>
						</g>
					</svg>
					Proportional.uk
				</span>
			</a>
		</div>
		{#if isHomePage}
			<div class="header-actions">
				<div class="header-toggle" role="group" aria-label="Reading mode">
					<button
						type="button"
						class="header-toggle__button"
						class:is-active={$readingMode === 'pager'}
						aria-pressed={$readingMode === 'pager'}
						onclick={() => setReadingMode('pager')}
					>
						Guided Walkthrough
					</button>
					<button
						type="button"
						class="header-toggle__button"
						class:is-active={$readingMode === 'all'}
						aria-pressed={$readingMode === 'all'}
						onclick={() => setReadingMode('all')}
					>
						View as One Page
					</button>
				</div>
			</div>
		{/if}
	</div>
</header>

<main id="main-content" class="govuk-main-wrapper">
	<div class="govuk-width-container">
		<div class="content">
			{@render children()}
		</div>
	</div>
</main>

<footer class="site-footer">
	<div class="footer-content">
		<p class="footer-tagline">Better voting for a better democracy</p>
		<p class="footer-credit">
			Built by
			<a href="https://felixsargent.com/" target="_blank" rel="noopener noreferrer"
				>felixsargent.com</a
			>
		</p>
	</div>
</footer>

<style>
	.govuk-skip-link {
		display: block;
		padding: 0.85rem 1rem;
		margin: 0;
		overflow: hidden;
		background-color: var(--text-dark);
		color: var(--surface-color);
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
		color: var(--surface-color);
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
		color: var(--surface-color);
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

	.header-actions {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		margin-left: auto;
	}

	.header-toggle {
		display: inline-flex;
		flex-wrap: nowrap;
		justify-content: flex-end;
		gap: 0.2rem;
		padding: 0.22rem;
		border: 1px solid rgba(255, 255, 255, 0.18);
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.08);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
	}

	.header-toggle__button {
		border: 1px solid transparent;
		background: transparent;
		color: rgba(255, 255, 255, 0.9);
		font-weight: 600;
		font-size: 0.98rem;
		padding: 0.5rem 0.9rem;
		border-radius: 999px;
		font: inherit;
		cursor: pointer;
		transition:
			background-color 0.2s ease,
			color 0.2s ease,
			border-color 0.2s ease,
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.header-toggle__button:hover {
		background: rgba(255, 255, 255, 0.12);
		color: var(--surface-color);
		border-color: rgba(255, 255, 255, 0.14);
	}

	.header-toggle__button.is-active {
		background: rgba(255, 255, 255, 0.96);
		color: var(--header-bg-strong);
		border-color: rgba(255, 255, 255, 0.92);
		box-shadow: 0 6px 18px rgba(17, 38, 59, 0.16);
	}

	.header-toggle__button:focus-visible,
	.govuk-header__link--homepage:focus-visible {
		outline-color: rgba(255, 255, 255, 0.45);
	}

	.header-toggle__button:active {
		transform: translateY(1px);
	}

	.govuk-main-wrapper {
		display: block;
		padding-top: 2rem;
		padding-bottom: 1.25rem;
	}

	.govuk-width-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
	}

	.site-footer {
		background: linear-gradient(180deg, #edf3f8 0%, #e7eef5 100%);
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

		.header-actions {
			width: 100%;
			margin-left: 0;
			justify-content: flex-start;
		}

		.header-toggle {
			width: 100%;
			justify-content: flex-start;
			flex-wrap: wrap;
		}

		.header-toggle__button {
			font-size: 0.92rem;
		}
	}
</style>
