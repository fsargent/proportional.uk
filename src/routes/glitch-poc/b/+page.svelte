<script lang="ts">
	import { onMount } from 'svelte';
	import GlitchSpotB from '$lib/components/glitch/GlitchSpotB.svelte';

	onMount(() => {
		document.body.classList.add('glitch-poc-body-light');
		return () => document.body.classList.remove('glitch-poc-body-light');
	});
</script>

<svelte:head>
	<title>Variant B — Glitch Spot • Proportional.uk</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="page">
	<section class="intro">
		<p class="eyebrow">Variant B</p>
		<h1>Graphic Realism / Prototype Treatment</h1>
		<p class="lede">
			Same core idea. Different art direction: brighter, sleeker, neon-glitch, more like a
			concept-art motion board than a dark political ad.
		</p>
	</section>

	<section class="preview-wrap">
		<div class="phone-shell">
			<GlitchSpotB />
		</div>

		<div class="notes">
			<h2>Direction</h2>
			<ul>
				<li>Lighter base tones, less black.</li>
				<li>Glossy panel treatment and softer gradients.</li>
				<li>Neon mint + coral-pink palette from the deck universe.</li>
				<li>Deliberately "prototype / concept art" presentation.</li>
			</ul>
		</div>
	</section>
</div>

<style>
	:global(body.glitch-poc-body-light) {
		background: linear-gradient(180deg, #f7efe8 0%, #efe9ff 100%);
	}

	.page { display: grid; gap: 2rem; color: #1f2230; }
	.intro { max-width: 54rem; }

	.eyebrow {
		margin: 0 0 0.5rem;
		text-transform: uppercase;
		letter-spacing: 0.16em;
		font-size: 0.78rem;
		font-weight: 700;
		color: #ff5f7f;
	}

	h1 {
		margin: 0 0 0.75rem;
		font-size: clamp(2rem, 5vw, 3.4rem);
		line-height: 0.95;
		letter-spacing: -0.05em;
		color: #161927;
	}

	.lede {
		max-width: 48rem;
		font-size: 1.05rem;
		line-height: 1.58;
		color: rgba(22,25,39,0.78);
	}

	.preview-wrap {
		display: grid;
		grid-template-columns: minmax(0, 420px) minmax(0, 1fr);
		gap: 2rem;
		align-items: start;
	}

	.phone-shell {
		padding: 1rem;
		border-radius: 2rem;
		background: linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0.28));
		box-shadow: 0 24px 80px rgba(83, 58, 111, 0.16);
		backdrop-filter: blur(14px);
	}

	.notes {
		padding: 1.2rem 1.25rem;
		border-radius: 1.25rem;
		background: rgba(255,255,255,0.5);
		border: 1px solid rgba(255,255,255,0.75);
	}

	.notes ul { padding-left: 1.1rem; line-height: 1.7; }

	@media (max-width: 900px) {
		.preview-wrap { grid-template-columns: 1fr; }
		.phone-shell { justify-self: center; }
	}
</style>
