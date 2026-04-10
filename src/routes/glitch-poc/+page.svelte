<script lang="ts">
	import { onMount } from 'svelte';
	import GlitchSpotA from '$lib/components/glitch/GlitchSpotA.svelte';
	import GlitchSpotB from '$lib/components/glitch/GlitchSpotB.svelte';

	type ManifestEntry = {
		file: string;
		exportedAt: string;
		fps: number;
	};

	type Manifest = Record<string, ManifestEntry>;

	let manifest: Manifest | null = $state(null);

	onMount(() => {
		document.body.classList.add('glitch-poc-body');

		fetch('/video/manifest.json')
			.then((res) => (res.ok ? res.json() : null))
			.then((data) => { if (data) manifest = data; })
			.catch(() => {});

		return () => document.body.classList.remove('glitch-poc-body');
	});

	function formatDate(iso: string) {
		return new Date(iso).toLocaleString('en-GB', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>Glitch Spot Proof of Concept • Proportional.uk</title>
	<meta
		name="description"
		content="15-second vertical HTML/CSS/GSAP proof of concept for a glitch-style proportional representation social video."
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
		<h1>Glitch Teaser</h1>
		<p class="lede">
			Two art directions for a 15-second vertical social video built in HTML, CSS and GSAP.
			Same campaign message, different visual mood. Both are exportable to MP4 via the video pipeline.
		</p>
		<ul class="specs">
			<li>Format: 9:16 social video</li>
			<li>Length target: roughly 15 seconds</li>
			<li>Approach: reusable template — each spot is just copy + colour changes</li>
		</ul>
	</section>

	<section class="variant-row">
		<div class="variant-meta">
			<h2>Dark Glitch / Signal Noise</h2>
			<p class="desc">
				Stark type, acid highlights, signal red, noisy texture, hard transitions.
				Closer to a political campaign spot.
			</p>
			<a href="/glitch-poc/a" class="link">View full page &rarr;</a>
		</div>
		<div class="previews" class:has-video={!!manifest?.a}>
			{#if manifest?.a}
				<details class="preview-toggle" open>
					<summary>Exported video <span class="export-info">{formatDate(manifest.a.exportedAt)} · {manifest.a.fps}fps</span></summary>
					<div class="video-wrap dark">
						<video src={manifest.a.file} autoplay loop muted playsinline>
							<track kind="captions" />
						</video>
					</div>
				</details>
			{/if}
			<details class="preview-toggle" open>
				<summary>Live animation</summary>
				<div class="phone-shell dark">
					<GlitchSpotA />
				</div>
			</details>
		</div>
	</section>

	<section class="variant-row">
		<div class="variant-meta">
			<h2>Graphic Realism / Prototype</h2>
			<p class="desc">
				Brighter, sleeker, neon-glitch. More like concept-art than a dark political ad.
			</p>
			<a href="/glitch-poc/b" class="link pink">View full page &rarr;</a>
		</div>
		<div class="previews" class:has-video={!!manifest?.b}>
			{#if manifest?.b}
				<details class="preview-toggle" open>
					<summary>Exported video <span class="export-info">{formatDate(manifest.b.exportedAt)} · {manifest.b.fps}fps</span></summary>
					<div class="video-wrap light">
						<video src={manifest.b.file} autoplay loop muted playsinline>
							<track kind="captions" />
						</video>
					</div>
				</details>
			{/if}
			<details class="preview-toggle" open>
				<summary>Live animation</summary>
				<div class="phone-shell light">
					<GlitchSpotB />
				</div>
			</details>
		</div>
	</section>

	<section class="notes-section">
		<h2>Template Structure</h2>
		<ul>
			<li><strong>Hook scene</strong> — problem / distortion / glitch</li>
			<li><strong>Diagnosis scene</strong> — one insight or stat</li>
			<li><strong>Patch scene</strong> — reform / answer / mechanism</li>
			<li><strong>Close scene</strong> — call to action</li>
		</ul>

		<h3>Video Export</h3>
		<p>
			Run <code>bun run export:video</code> with the dev server running.
			Videos are written to <code>static/video/</code> with timestamped filenames
			and appear here automatically.
		</p>
	</section>
</div>

<style>
	:global(body.glitch-poc-body) {
		background:
			radial-gradient(circle at top, rgba(236, 255, 109, 0.09), transparent 28%),
			linear-gradient(180deg, #0c0d13 0%, #12151f 100%);
	}

	.page { display: grid; gap: 2.5rem; color: #f3f5fa; }
	.intro { max-width: 54rem; }

	.page h1 {
		margin: 0 0 0.75rem;
		font-size: clamp(2rem, 5vw, 3.4rem);
		line-height: 0.95;
		letter-spacing: -0.05em;
		color: #f7f9ff;
	}

	.page h2 {
		color: #f7f9ff;
	}

	.lede {
		max-width: 48rem;
		font-size: 1.05rem;
		line-height: 1.58;
		color: rgba(243, 245, 250, 0.82);
	}

	.specs {
		margin: 1rem 0 0;
		padding-left: 1.1rem;
		color: rgba(243, 245, 250, 0.85);
		line-height: 1.7;
	}

	.variant-row {
		display: grid;
		gap: 1.5rem;
	}

	.variant-meta h2 {
		margin: 0.2rem 0 0.5rem;
		font-size: clamp(1.4rem, 3.5vw, 2rem);
		letter-spacing: -0.03em;
		color: #f7f9ff;
	}

	.desc {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.55;
		color: rgba(243, 245, 250, 0.78);
	}

	.link {
		display: inline-block;
		margin-top: 0.6rem;
		font-size: 0.85rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		color: #ecff6d;
		text-decoration: none;
	}

	.link.pink { color: #ff5f7f; }
	.link:hover { text-decoration: underline; }

	.previews {
		display: grid;
		grid-template-columns: minmax(0, 320px);
		gap: 1.5rem;
		justify-content: center;
	}

	.previews.has-video {
		grid-template-columns: repeat(2, minmax(0, 320px));
	}

	.preview-toggle {
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 1rem;
		overflow: hidden;
	}

	.preview-toggle summary {
		padding: 0.5rem 0.75rem;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(243, 245, 250, 0.55);
		cursor: pointer;
		user-select: none;
	}

	.preview-toggle summary:hover {
		color: rgba(243, 245, 250, 0.85);
	}

	.export-info {
		font-weight: 400;
		letter-spacing: 0.02em;
		text-transform: none;
		color: rgba(243, 245, 250, 0.38);
	}

	.video-wrap {
		border-radius: 1.75rem;
		overflow: hidden;
		backdrop-filter: blur(12px);
	}

	.video-wrap.dark {
		background: linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03));
		box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
	}

	.video-wrap.light {
		background: linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0.28));
		box-shadow: 0 24px 80px rgba(83, 58, 111, 0.16);
	}

	.video-wrap video {
		display: block;
		width: 100%;
		border-radius: 1.75rem;
	}

	.phone-shell {
		border-radius: 1.5rem;
		overflow: hidden;
	}

	.notes-section {
		max-width: 54rem;
		padding: 1.5rem;
		border-radius: 1.25rem;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.notes-section h2, .notes-section h3 {
		margin-top: 0;
		letter-spacing: -0.03em;
		color: #f7f9ff;
	}

	.notes-section h3 { margin-top: 1.5rem; }

	.notes-section ul {
		padding-left: 1.1rem;
		line-height: 1.7;
		color: rgba(243, 245, 250, 0.84);
	}

	.notes-section p {
		line-height: 1.6;
		color: rgba(243, 245, 250, 0.82);
	}

	.notes-section code {
		padding: 0.15em 0.35em;
		border-radius: 0.3em;
		background: rgba(255, 255, 255, 0.1);
		font-size: 0.88em;
	}

	@media (max-width: 720px) {
		.previews.has-video {
			grid-template-columns: minmax(0, 320px);
		}
	}
</style>
