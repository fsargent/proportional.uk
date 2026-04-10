<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';

	type SceneSpec = {
		label: string;
		copy: string[];
		duration: string;
	};

	const sceneSpecs: SceneSpec[] = [
		{
			label: 'Hook',
			copy: ['There’s a bug in how we vote'],
			duration: '0–3s'
		},
		{
			label: 'Distortion',
			copy: ['34% of votes', 'shouldn’t equal', '63% of seats in parliament'],
			duration: '3–7s'
		},
		{
			label: 'Patch',
			copy: ['We know how to fix it', 'Make Parliament listen'],
			duration: '7–11s'
		},
		{
			label: 'Close',
			copy: ['Britain is ready', 'Fix the system'],
			duration: '11–15s'
		}
	];

	let frame: HTMLDivElement;
	let tl: gsap.core.Timeline;

	onMount(() => {
		document.body.classList.add('glitch-poc-body');

		const mm = gsap.matchMedia();

		gsap.set('.scene', { autoAlpha: 0 });
		gsap.set('.scene-1', { autoAlpha: 1 });
		gsap.set('.scene-1 .subhead', { opacity: 1 });

		mm.add('(prefers-reduced-motion: no-preference)', () => {
			tl = gsap.timeline({ repeat: -1, repeatDelay: 0.55, defaults: { ease: 'power2.out' } });

			tl.set('.scene', { autoAlpha: 0 })
				.set('.scene-1', { autoAlpha: 1 })
				.fromTo(
					'.headline-1 .glitch-line',
					{ yPercent: 120, opacity: 0 },
					{ yPercent: 0, opacity: 1, stagger: 0.08, duration: 0.5 }
				)
				.fromTo('.scene-1 .subhead', { y: 12, opacity: 0 }, { y: 0, opacity: 0.92, duration: 0.24 }, '-=0.18')
				.fromTo('.system-noise', { opacity: 0.2 }, { opacity: 0.58, duration: 0.18 }, '<')
				.to('.scene-1', { x: -12, duration: 0.04 })
				.to('.scene-1', { x: 7, duration: 0.04 })
				.to('.scene-1', { x: 0, duration: 0.06 })
				.to('.scene-1 .flash-word', {
					textShadow: '0 0 12px rgba(255,255,255,0.45), 4px 0 0 rgba(255,90,117,0.55), -4px 0 0 rgba(57,255,214,0.5)',
					duration: 0.06,
					repeat: 3,
					yoyo: true
				}, '-=0.1')
				.to('.scene-1', { autoAlpha: 0, duration: 0.18, delay: 1.45 })
				.set('.scene-2', { autoAlpha: 1 })
				.fromTo('.scene-2 .panel', { scale: 0.97, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.28 })
				.fromTo('.scene-2 .stat-line', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, stagger: 0.07 }, '-=0.12')
				.fromTo('.scene-2 .microcopy', { y: 10, opacity: 0 }, { y: 0, opacity: 0.84, duration: 0.24 }, '-=0.16')
				.to('.scene-2 .panel', { filter: 'contrast(1.1) saturate(1.15)', duration: 0.08, repeat: 2, yoyo: true })
				.to('.scene-2', { autoAlpha: 0, duration: 0.18, delay: 1.45 })
				.set('.scene-3', { autoAlpha: 1 })
				.fromTo('.scene-3 .fix', { clipPath: 'inset(0 100% 0 0)', opacity: 0.25 }, { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 0.46 })
				.fromTo('.scene-3 .sub', { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.28 }, '-=0.14')
				.to('.scene-3 .grid-cell', { backgroundColor: 'rgba(236,255,109,0.92)', stagger: 0.018, duration: 0.14 }, '-=0.18')
				.fromTo('.scene-3 .patch-note', { opacity: 0 }, { opacity: 0.92, duration: 0.2 }, '-=0.06')
				.to('.scene-3', { autoAlpha: 0, duration: 0.18, delay: 1.35 })
				.set('.scene-4', { autoAlpha: 1 })
				.fromTo('.scene-4 .cta-line', { y: 18, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.28 })
				.fromTo('.scene-4 .url', { scaleX: 0.72, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.24 }, '-=0.04')
				.fromTo('.scene-4 .variant-tag', { opacity: 0 }, { opacity: 0.78, duration: 0.18 }, '-=0.05')
				.to(frame, {
					filter: 'contrast(1.16) saturate(1.08)',
					duration: 0.08,
					repeat: 2,
					yoyo: true
				}, '<')
				.to('.scene-4', { autoAlpha: 0, duration: 0.18, delay: 1.7 });
		});

		return () => {
			document.body.classList.remove('glitch-poc-body');
			mm.revert();
			tl?.kill();
		};
	});
</script>

<svelte:head>
	<title>Glitch Spot Proof of Concept • Proportional.uk</title>
	<meta
		name="description"
		content="A tighter 15-second vertical HTML/CSS/GSAP proof of concept for a glitch-style proportional representation social video."
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
		<p class="eyebrow">Proof of Concept</p>
		<h1>Citizen-Sector-Style Glitch Teaser</h1>
		<p class="lede">
			A sharper vertical motion prototype built in HTML, CSS and GSAP. This version aims for tighter
			timing, stronger campaign copy, and a visual system closer to the deck style: stark type,
			acid highlights, signal red, noisy texture, and hard transitions.
		</p>
		<ul>
			<li>Format: 9:16 social video</li>
			<li>Length target: roughly 15 seconds</li>
			<li>Approach: reusable template rather than one-off generated video</li>
		</ul>
	</section>

	<section class="preview-wrap">
		<div class="phone-shell">
			<div class="video-frame" bind:this={frame}>
				<div class="system-noise"></div>
				<div class="scanlines"></div>
				<div class="vignette"></div>
				<div class="corner corner-a"></div>
				<div class="corner corner-b"></div>

				<div class="scene scene-1">
					<div class="kicker">National Commission on Electoral Reform</div>
					<div class="headline headline-1">
						<div class="clip"><span class="glitch-line">THERE’S A</span></div>
						<div class="clip"><span class="glitch-line acid flash-word">BUG</span></div>
						<div class="clip"><span class="glitch-line">IN HOW WE VOTE</span></div>
					</div>
					<div class="subhead">Britain deserves results that reflect how people actually vote.</div>
				</div>

				<div class="scene scene-2">
					<div class="panel stat-panel">
						<div class="tiny-label">The Distortion</div>
						<div class="stat-line">34% OF VOTES</div>
						<div class="stat-line dim">SHOULDN’T EQUAL</div>
						<div class="stat-line acid">63% OF SEATS</div>
						<div class="microcopy">In parliament.</div>
					</div>
				</div>

				<div class="scene scene-3">
					<div class="tiny-label">We Can Fix This</div>
					<div class="fix">WE KNOW HOW<br />TO FIX IT</div>
					<div class="sub">Make Parliament listen.</div>
					<div class="patch-note">Fairer. Clearer. Harder to ignore.</div>
					<div class="grid">
						{#each Array(18) as _, i}
							<div class="grid-cell" style={`animation-delay:${i * 0.03}s`}></div>
						{/each}
					</div>
				</div>

				<div class="scene scene-4">
					<div class="brand-mark">Open Britain • National Commission on Electoral Reform</div>
					<div class="cta-line">BRITAIN IS READY</div>
					<div class="cta-line acid">FIX THE SYSTEM</div>
					<a class="url" href="https://www.open-britain.co.uk/ncer" target="_blank" rel="noreferrer"
						>open-britain.co.uk/ncer</a
					>
					<div class="variant-tag">Teaser Variant A • Learn More / Back the Case / Join In</div>
				</div>
			</div>
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

			<h3>Recommended next iterations</h3>
			<ul>
				<li>Replace placeholder stats with the exact Citizen Sector line you want to emphasize.</li>
				<li>Test three endings: <em>Learn More</em>, <em>Join Us</em>, and <em>Back the Campaign</em>.</li>
				<li>Fine-tune the Space Grotesk weights and tracking against the deck once we pick final copy.</li>
				<li>Expand this into a reusable template so each future spot is just copy + colour changes.</li>
			</ul>

			<h3>Template structure I’d recommend</h3>
			<ul>
				<li><strong>Hook scene</strong> — problem / distortion / glitch</li>
				<li><strong>Diagnosis scene</strong> — one insight or stat</li>
				<li><strong>Patch scene</strong> — reform / answer / mechanism</li>
				<li><strong>Close scene</strong> — call to action</li>
			</ul>
		</div>
	</section>

	<section class="variant-b-section">
		<div class="variant-header">
			<p class="eyebrow">Variant B</p>
			<h2>Graphic Realism / Prototype Treatment</h2>
			<p>
				Brighter, sleeker, more neon and more obviously concept-art / work-in-progress. Same message,
				different visual mood.
			</p>
		</div>
		<iframe
			title="Glitch proof of concept variant B"
			src="/glitch-poc-variant-b"
			class="variant-frame"
			loading="lazy"
		></iframe>
	</section>
</div>

<style>
	:global(body.glitch-poc-body) {
		background:
			radial-gradient(circle at top, rgba(236, 255, 109, 0.09), transparent 28%),
			linear-gradient(180deg, #0c0d13 0%, #12151f 100%);
	}

	.page {
		display: grid;
		gap: 2rem;
		color: #f3f5fa;
	}

	.intro {
		max-width: 54rem;
	}

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

	.intro ul {
		margin: 1rem 0 0;
		padding-left: 1.1rem;
		color: rgba(243, 245, 250, 0.85);
		line-height: 1.7;
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

	.video-frame {
		position: relative;
		aspect-ratio: 9 / 16;
		width: min(100%, 390px);
		overflow: hidden;
		border-radius: 1.5rem;
		background:
			radial-gradient(circle at 18% 10%, rgba(255, 90, 117, 0.18), transparent 22%),
			radial-gradient(circle at 82% 16%, rgba(57, 255, 214, 0.12), transparent 20%),
			linear-gradient(180deg, #05070d 0%, #0a0d14 55%, #0d111b 100%);
		border: 1px solid rgba(255, 255, 255, 0.08);
		font-family: 'Space Grotesk', Inter, ui-sans-serif, system-ui, sans-serif;
	}

	.scene,
	.system-noise,
	.scanlines,
	.vignette,
	.corner {
		position: absolute;
		inset: 0;
	}

	.scene {
		padding: 1.25rem;
		display: grid;
		align-content: start;
	}

	.system-noise {
		background-image:
			linear-gradient(90deg, rgba(255,255,255,0.07) 0 1px, transparent 1px),
			linear-gradient(rgba(255,255,255,0.04) 0 1px, transparent 1px);
		background-size: 34px 34px, 22px 22px;
		mix-blend-mode: overlay;
		opacity: 0.28;
		animation: drift 8s linear infinite;
	}

	.scanlines {
		background: repeating-linear-gradient(
			180deg,
			rgba(255, 255, 255, 0.05) 0 1px,
			transparent 1px 4px
		);
		opacity: 0.09;
		pointer-events: none;
	}

	.vignette {
		box-shadow: inset 0 0 90px rgba(0, 0, 0, 0.82);
		pointer-events: none;
	}

	.corner-a::before,
	.corner-b::before {
		content: '';
		position: absolute;
		width: 4rem;
		height: 4rem;
		border: 1px solid rgba(236, 255, 109, 0.32);
	}

	.corner-a::before {
		top: 0.7rem;
		right: 0.7rem;
		border-left: 0;
		border-bottom: 0;
	}

	.corner-b::before {
		left: 0.7rem;
		bottom: 0.7rem;
		border-right: 0;
		border-top: 0;
	}

	.kicker,
	.tiny-label,
	.brand-mark,
	.variant-tag {
		font-size: 0.72rem;
		font-weight: 500;
		letter-spacing: 0.17em;
		text-transform: uppercase;
		color: rgba(243, 245, 250, 0.72);
	}

	.headline {
		margin-top: 2rem;
		display: grid;
		gap: 0.16rem;
		font-weight: 700;
		line-height: 0.88;
		letter-spacing: -0.07em;
		font-size: clamp(2.2rem, 12vw, 4.2rem);
	}

	.clip {
		overflow: hidden;
	}

	.glitch-line {
		display: inline-block;
		text-shadow: 3px 0 0 rgba(255, 90, 117, 0.34), -3px 0 0 rgba(57, 255, 214, 0.3);
	}

	.acid {
		color: #ecff6d;
	}

	.subhead {
		margin-top: 0.8rem;
		max-width: 13rem;
		font-size: 0.97rem;
		line-height: 1.3;
		color: rgba(243, 245, 250, 0.92);
		text-transform: uppercase;
		font-weight: 500;
	}

	.patch-note {
		margin-top: 0.9rem;
		font-size: 0.86rem;
		line-height: 1.35;
		max-width: 14rem;
		color: rgba(243, 245, 250, 0.84);
		text-transform: uppercase;
		font-weight: 700;
	}

	.panel {
		margin-top: 4rem;
		padding: 1rem;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(10px);
	}

	.stat-panel {
		margin-top: 3.4rem;
	}

	.stat-line {
		margin-top: 0.9rem;
		font-size: clamp(1.5rem, 8vw, 2.9rem);
		font-weight: 700;
		line-height: 0.94;
		letter-spacing: -0.06em;
		text-transform: uppercase;
	}

	.stat-line.dim {
		color: rgba(243, 245, 250, 0.74);
	}

	.microcopy {
		margin-top: 1rem;
		max-width: 12rem;
		font-size: 0.92rem;
		line-height: 1.35;
		color: rgba(243, 245, 250, 0.84);
	}

	.fix {
		margin-top: 3.8rem;
		font-size: clamp(2rem, 10vw, 3.35rem);
		font-weight: 700;
		line-height: 0.92;
		letter-spacing: -0.06em;
		text-transform: uppercase;
	}

	.sub {
		margin-top: 0.85rem;
		max-width: 13rem;
		font-size: 0.98rem;
		line-height: 1.35;
		color: rgba(243, 245, 250, 0.9);
	}

	.grid {
		margin-top: auto;
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 0.35rem;
	}

	.grid-cell {
		aspect-ratio: 1;
		border-radius: 0.35rem;
		background: rgba(255, 255, 255, 0.12);
		border: 1px solid rgba(255, 255, 255, 0.05);
	}

	.scene-4 {
		align-content: center;
		justify-items: start;
	}

	.cta-line {
		font-size: clamp(2rem, 10vw, 3.55rem);
		font-weight: 700;
		line-height: 0.92;
		letter-spacing: -0.06em;
		text-transform: uppercase;
	}

	.url {
		margin-top: 1rem;
		padding: 0.42rem 0.6rem;
		border: 1px solid rgba(236, 255, 109, 0.55);
		color: #ecff6d;
		text-transform: uppercase;
		font-size: 0.8rem;
		letter-spacing: 0.14em;
		font-weight: 800;
		transform-origin: left center;
	}

	.variant-tag {
		margin-top: 0.9rem;
		font-size: 0.63rem;
		letter-spacing: 0.13em;
	}

	.notes {
		padding: 1.2rem 1.25rem;
		border-radius: 1.25rem;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.notes h2,
	.notes h3 {
		margin-top: 0;
		letter-spacing: -0.03em;
	}

	.notes ol,
	.notes ul {
		padding-left: 1.1rem;
		line-height: 1.7;
		color: rgba(243, 245, 250, 0.84);
	}

	.scene-list > li + li {
		margin-top: 0.8rem;
	}

	@keyframes drift {
		from {
			transform: translate3d(0, 0, 0);
		}
		to {
			transform: translate3d(-24px, -24px, 0);
		}
	}

	.variant-b-section {
		margin-top: 1rem;
		display: grid;
		gap: 1rem;
	}

	.variant-header {
		max-width: 54rem;
	}

	.variant-header h2 {
		margin: 0.2rem 0 0.6rem;
		font-size: clamp(1.6rem, 4vw, 2.4rem);
		color: #f7f9ff;
	}

	.variant-header p {
		margin: 0;
		color: rgba(243, 245, 250, 0.82);
		line-height: 1.55;
	}

	.variant-frame {
		width: 100%;
		min-height: 1200px;
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 1.25rem;
		background: rgba(255, 255, 255, 0.04);
	}

	@media (max-width: 900px) {
		.preview-wrap {
			grid-template-columns: 1fr;
		}

		.phone-shell {
			justify-self: center;
		}

		.variant-frame {
			min-height: 980px;
		}
	}
</style>
