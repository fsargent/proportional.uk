<script lang="ts">
	import { onMount } from 'svelte';
	import GlitchSpotA from '$lib/components/glitch/GlitchSpotA.svelte';

	type SceneSpec = {
		label: string;
		copy: string[];
		duration: string;
	};

	const sceneSpecs: SceneSpec[] = [
		{ label: 'Hook', copy: ['There\u2019s a bug in how we vote'], duration: '0\u20133s' },
		{ label: 'Distortion', copy: ['34% of votes', 'shouldn\u2019t equal', '63% of seats in parliament'], duration: '3\u20137s' },
		{ label: 'Patch', copy: ['We know how to fix it', 'Make Parliament listen'], duration: '7\u201311s' },
		{ label: 'Close', copy: ['Britain is ready', 'Fix the system'], duration: '11\u201315s' }
	];

	onMount(() => {
		document.body.classList.add('glitch-poc-body');
		return () => document.body.classList.remove('glitch-poc-body');
	});
</script>

<svelte:head>
	<title>Variant A — Glitch Spot • Proportional.uk</title>
	<meta
		name="description"
		content="A 15-second vertical HTML/CSS/GSAP proof of concept for a glitch-style proportional representation social video."
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="page">
	<section class="intro">
		<p class="eyebrow">Variant A</p>
		<h1>Dark Glitch / Signal Noise</h1>
		<p class="lede">
			Stark type, acid highlights, signal red, noisy texture, and hard transitions.
			Closer to a political campaign spot.
		</p>
	</section>

	<section class="preview-wrap">
		<div class="phone-shell">
			<GlitchSpotA />
		</div>

		<div class="notes">
			<h2>Storyboard</h2>
			<ol class="scene-list">
				{#each sceneSpecs as scene}
					<li>
						<strong>{scene.duration} — {scene.label}</strong>
						<ul>
							{#each scene.copy as line}
								<li>{line}</li>
							{/each}
						</ul>
					</li>
				{/each}
			</ol>

			<h3>Template structure</h3>
			<ul>
				<li><strong>Hook scene</strong> — problem / distortion / glitch</li>
				<li><strong>Diagnosis scene</strong> — one insight or stat</li>
				<li><strong>Patch scene</strong> — reform / answer / mechanism</li>
				<li><strong>Close scene</strong> — call to action</li>
			</ul>
		</div>
	</section>
</div>

<style>
	:global(body.glitch-poc-body) {
		background:
			radial-gradient(circle at top, rgba(236, 255, 109, 0.09), transparent 28%),
			linear-gradient(180deg, #0c0d13 0%, #12151f 100%);
	}

	.page { display: grid; gap: 2rem; color: #f3f5fa; }
	.intro { max-width: 54rem; }

	.eyebrow {
		margin: 0 0 0.5rem;
		text-transform: uppercase;
		letter-spacing: 0.16em;
		font-size: 0.78rem;
		font-weight: 800;
		color: #ecff6d;
	}

	h1 {
		margin: 0 0 0.75rem;
		font-size: clamp(2rem, 5vw, 3.4rem);
		line-height: 0.95;
		letter-spacing: -0.05em;
		color: #f7f9ff;
	}

	.lede {
		max-width: 48rem;
		font-size: 1.05rem;
		line-height: 1.58;
		color: rgba(243, 245, 250, 0.82);
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
		background: linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03));
		box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
		backdrop-filter: blur(12px);
	}

	.notes {
		padding: 1.2rem 1.25rem;
		border-radius: 1.25rem;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.notes h2, .notes h3 { margin-top: 0; letter-spacing: -0.03em; }
	.notes ol, .notes ul {
		padding-left: 1.1rem;
		line-height: 1.7;
		color: rgba(243, 245, 250, 0.84);
	}

	.scene-list > li + li { margin-top: 0.8rem; }

	@media (max-width: 900px) {
		.preview-wrap { grid-template-columns: 1fr; }
		.phone-shell { justify-self: center; }
	}
</style>
