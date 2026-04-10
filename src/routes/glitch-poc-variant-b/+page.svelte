<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';

	let frame: HTMLDivElement;
	let tl: gsap.core.Timeline;

	onMount(() => {
		document.body.classList.add('glitch-poc-body');

		const mm = gsap.matchMedia();

		gsap.set('.scene', { autoAlpha: 0 });
		gsap.set('.scene-1', { autoAlpha: 1 });

		mm.add('(prefers-reduced-motion: no-preference)', () => {
			tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5, defaults: { ease: 'power2.out' } });

			tl.set('.scene', { autoAlpha: 0 })
				.set('.scene-1', { autoAlpha: 1 })
				.fromTo('.scene-1 .headline-line', { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.08, duration: 0.46 })
				.fromTo('.scene-1 .subhead', { y: 16, opacity: 0 }, { y: 0, opacity: 0.95, duration: 0.25 }, '-=0.15')
				.to('.scene-1 .headline', {
					textShadow: '0 0 14px rgba(255,255,255,0.55), 4px 0 0 rgba(255,85,125,0.35), -4px 0 0 rgba(83,240,214,0.35)',
					duration: 0.08,
					repeat: 2,
					yoyo: true
				})
				.to('.scene-1', { autoAlpha: 0, duration: 0.18, delay: 1.2 })
				.set('.scene-2', { autoAlpha: 1 })
				.fromTo('.stat-card', { scale: 0.96, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.28 })
				.fromTo('.stat-line', { y: 16, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.28 }, '-=0.1')
				.fromTo('.seat-stack .seat', { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.03, duration: 0.18 }, '-=0.12')
				.to('.scene-2', { autoAlpha: 0, duration: 0.18, delay: 1.3 })
				.set('.scene-3', { autoAlpha: 1 })
				.fromTo('.scene-3 .fix-line', { x: -30, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.08, duration: 0.32 })
				.fromTo('.scene-3 .proto-box', { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.26 }, '-=0.08')
				.to('.proto-grid .cell', { backgroundColor: 'rgba(255,255,255,0.92)', stagger: 0.015, duration: 0.12 }, '-=0.1')
				.to('.scene-3', { autoAlpha: 0, duration: 0.18, delay: 1.35 })
				.set('.scene-4', { autoAlpha: 1 })
				.fromTo('.scene-4 .cta', { y: 18, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.26 })
				.fromTo('.scene-4 .link-chip', { scale: 0.84, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.22 }, '-=0.05')
				.to(frame, { filter: 'contrast(1.08) saturate(1.08)', duration: 0.08, repeat: 2, yoyo: true }, '<')
				.to('.scene-4', { autoAlpha: 0, duration: 0.18, delay: 1.5 });
		});

		return () => {
			document.body.classList.remove('glitch-poc-body');
			mm.revert();
			tl?.kill();
		};
	});
</script>

<svelte:head>
	<title>Glitch Spot Variant B • Proportional.uk</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
</svelte:head>

<div class="variant-page">
	<section class="intro">
		<p class="eyebrow">Variant B</p>
		<h1>Graphic Realism / Prototype Treatment</h1>
		<p class="lede">
			Same core idea. Different art direction: brighter, sleeker, neon-glitch, poppier, more like a
			concept-art motion board than a dark political ad.
		</p>
	</section>

	<section class="layout">
		<div class="phone-shell">
			<div class="video-frame" bind:this={frame}>
				<div class="glow glow-pink"></div>
				<div class="glow glow-mint"></div>
				<div class="mesh"></div>
				<div class="grain"></div>

				<div class="scene scene-1">
					<div class="tag">WIP / PROTOTYPE / CONCEPT</div>
					<div class="headline">
						<div class="clip"><span class="headline-line">THERE’S A BUG</span></div>
						<div class="clip"><span class="headline-line accent">IN HOW WE VOTE</span></div>
					</div>
					<div class="subhead">Beautiful system. Wrong output.</div>
				</div>

				<div class="scene scene-2">
					<div class="stat-card">
						<div class="tiny">DISTORTION</div>
						<div class="stat-line">34% OF VOTES</div>
						<div class="stat-line quiet">SHOULDN’T EQUAL</div>
						<div class="stat-line accent">63% OF SEATS</div>
						<div class="tiny foot">IN PARLIAMENT</div>
					</div>
					<div class="seat-stack">
						{#each Array(10) as _, i}
							<div class="seat" class:hot={i > 2}></div>
						{/each}
					</div>
				</div>

				<div class="scene scene-3">
					<div class="fix-line">WE KNOW HOW</div>
					<div class="fix-line accent">TO FIX IT</div>
					<div class="proto-box">
						<div class="tiny">MAKE PARLIAMENT LISTEN</div>
						<div class="proto-grid">
							{#each Array(12) as _, i}
								<div class="cell"></div>
							{/each}
						</div>
					</div>
				</div>

				<div class="scene scene-4">
					<div class="brand">OPEN BRITAIN • NCER</div>
					<div class="cta">BRITAIN IS READY</div>
					<div class="cta accent">FIX THE SYSTEM</div>
					<a class="link-chip" href="https://www.open-britain.co.uk/ncer" target="_blank" rel="noreferrer">open-britain.co.uk/ncer</a>
				</div>
			</div>
		</div>

		<div class="notes">
			<h2>Direction</h2>
			<ul>
				<li>Lighter base tones, less black.</li>
				<li>Glossy panel treatment and softer gradients.</li>
				<li>Neon mint + coral-pink palette from the deck universe.</li>
				<li>Deliberately “prototype / concept art” presentation.</li>
			</ul>
		</div>
	</section>
</div>

<style>
	:global(body.glitch-poc-body) {
		background: linear-gradient(180deg, #f7efe8 0%, #efe9ff 100%);
	}

	.variant-page {
		display: grid;
		gap: 2rem;
		color: #1f2230;
	}

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
	.layout {
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
	.video-frame {
		position: relative;
		aspect-ratio: 9/16;
		width: min(100%, 390px);
		overflow: hidden;
		border-radius: 1.5rem;
		border: 1px solid rgba(255,255,255,0.75);
		background: linear-gradient(180deg, #fff8f4 0%, #ffeaf0 44%, #e8fff9 100%);
		font-family: 'Space Grotesk', Inter, sans-serif;
	}
	.scene,.glow,.mesh,.grain { position:absolute; inset:0; }
	.scene { padding: 1.25rem; display:grid; align-content:start; }
	.glow { filter: blur(28px); opacity: 0.55; }
	.glow-pink { background: radial-gradient(circle at 18% 18%, rgba(255,95,127,0.42), transparent 24%); }
	.glow-mint { background: radial-gradient(circle at 80% 24%, rgba(74,235,201,0.36), transparent 24%); }
	.mesh {
		background-image: linear-gradient(90deg, rgba(22,25,39,0.05) 0 1px, transparent 1px), linear-gradient(rgba(22,25,39,0.05) 0 1px, transparent 1px);
		background-size: 32px 32px;
		opacity: 0.5;
	}
	.grain {
		background: repeating-linear-gradient(180deg, rgba(255,255,255,0.12) 0 2px, transparent 2px 5px);
		opacity: 0.22;
	}
	.tag,.tiny,.brand {
		font-size: 0.72rem;
		letter-spacing: 0.17em;
		text-transform: uppercase;
		font-weight: 500;
		color: rgba(22,25,39,0.62);
	}
	.headline {
		margin-top: 2.4rem;
		display:grid;
		gap:0.2rem;
		font-size: clamp(2rem, 11vw, 3.8rem);
		font-weight: 700;
		line-height: 0.9;
		letter-spacing: -0.065em;
		text-transform: uppercase;
		color: #171a28;
	}
	.clip { overflow:hidden; }
	.accent { color: #ff5f7f; }
	.subhead {
		margin-top: 1rem;
		font-size: 1rem;
		font-weight: 500;
		text-transform: uppercase;
		color: rgba(22,25,39,0.72);
	}
	.stat-card {
		margin-top: 3.2rem;
		padding: 1rem;
		border-radius: 1.2rem;
		background: rgba(255,255,255,0.58);
		border: 1px solid rgba(255,255,255,0.8);
		box-shadow: 0 14px 40px rgba(83,58,111,0.1);
	}
	.stat-line {
		margin-top: 0.85rem;
		font-size: clamp(1.55rem, 8vw, 2.8rem);
		line-height: 0.94;
		font-weight: 700;
		letter-spacing: -0.06em;
		text-transform: uppercase;
		color: #161927;
	}
	.stat-line.quiet { color: rgba(22,25,39,0.55); }
	.foot { margin-top: 0.9rem; }
	.seat-stack {
		position: absolute;
		right: 1.2rem;
		bottom: 1.2rem;
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 0.35rem;
		width: 8.5rem;
	}
	.seat {
		aspect-ratio: 1;
		border-radius: 0.35rem;
		background: rgba(74,235,201,0.85);
		box-shadow: 0 6px 18px rgba(74,235,201,0.22);
	}
	.seat.hot { background: rgba(255,95,127,0.92); box-shadow: 0 6px 18px rgba(255,95,127,0.2); }
	.fix-line {
		margin-top: 3rem;
		font-size: clamp(2rem, 10vw, 3.2rem);
		font-weight: 700;
		line-height: 0.92;
		letter-spacing: -0.06em;
		text-transform: uppercase;
		color: #161927;
	}
	.proto-box {
		margin-top: 1rem;
		padding: 1rem;
		border-radius: 1.1rem;
		background: rgba(255,255,255,0.56);
		border: 1px solid rgba(255,255,255,0.78);
	}
	.proto-grid {
		margin-top: 1rem;
		display:grid;
		grid-template-columns: repeat(4,1fr);
		gap:0.35rem;
	}
	.cell {
		aspect-ratio: 1;
		border-radius: 0.35rem;
		background: rgba(22,25,39,0.12);
	}
	.scene-4 { align-content: center; }
	.cta {
		font-size: clamp(2rem, 10vw, 3.35rem);
		font-weight: 700;
		line-height: 0.92;
		letter-spacing: -0.06em;
		text-transform: uppercase;
		color: #161927;
	}
	.link-chip {
		display:inline-block;
		margin-top: 1rem;
		padding: 0.5rem 0.7rem;
		border-radius: 999px;
		background: rgba(255,255,255,0.78);
		border: 1px solid rgba(255,95,127,0.35);
		color: #161927;
		text-decoration: none;
		font-size: 0.8rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		font-weight: 500;
	}
	.notes {
		padding: 1.2rem 1.25rem;
		border-radius: 1.25rem;
		background: rgba(255,255,255,0.5);
		border: 1px solid rgba(255,255,255,0.75);
	}
	.notes ul { padding-left: 1.1rem; line-height: 1.7; }
	@media (max-width: 900px) {
		.layout { grid-template-columns: 1fr; }
		.phone-shell { justify-self:center; }
	}
</style>
