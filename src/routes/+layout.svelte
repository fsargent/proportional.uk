<script lang="ts">
	import '../app.css';

	let { children } = $props();
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
						aria-label="GOV.UK Crown"
					>
						<title>GOV.UK Crown</title>
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
					AMS+ | Electoral Reform
				</span>
			</a>
		</div>
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
	AMS+ | A proposal for electoral reform in the United Kingdom
</footer>

<style>
	.govuk-skip-link {
		display: block;
		padding: 12px 15px;
		margin: 0;
		overflow: hidden;
		background-color: #000;
		color: #fff;
		text-decoration: none;
		font-size: 14px;
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
		background-color: #1d70b8;
		border-bottom: none;
		margin-bottom: 0;
		width: 100%;
		box-shadow: 0 2px 2px rgba(0, 0, 0, 0.08);
	}

	.govuk-header__container {
		padding: 12px 15px;
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		min-height: 60px;
	}

	.govuk-header__logo {
		display: flex;
		align-items: center;
	}

	.govuk-header__link--homepage {
		font-family: inherit;
		font-weight: 700;
		font-size: 18px;
		line-height: 1.2;
		color: #ffffff;
		text-decoration: none;
		display: flex;
		align-items: center;
	}

	.govuk-header__link--homepage:hover {
		text-decoration: underline;
	}

	.govuk-header__logotype-text {
		font-size: 31px;
		font-weight: 400;
		letter-spacing: -0.465px;
		line-height: 31px;
		color: #ffffff;
		display: inline-table;
		vertical-align: top;
		height: 31px;
		-webkit-font-smoothing: antialiased;
		margin-left: 0.5rem;
	}

	:global(.govuk-header__logotype) {
		vertical-align: middle;
	}

	.govuk-main-wrapper {
		display: block;
		padding-top: 20px;
		padding-bottom: 20px;
	}

	.govuk-width-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 15px;
	}

	.site-footer {
		text-align: center;
		color: #666;
		font-size: 0.9rem;
		margin: 1.5rem 0 2.5rem;
	}

	@media (max-width: 47.9375rem) {
		.govuk-header__link--homepage {
			font-size: 1.5rem;
		}
	}
</style>
