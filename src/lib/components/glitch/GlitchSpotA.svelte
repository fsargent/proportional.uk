<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';

	interface Props {
		mode?: 'preview' | 'export';
	}

	let { mode = 'preview' }: Props = $props();

	let root: HTMLDivElement;

	function q(selector: string) {
		return root.querySelectorAll(selector);
	}

	function q1(selector: string) {
		return root.querySelector(selector);
	}

	function buildTimeline(opts: { repeat: number; repeatDelay: number; paused: boolean }) {
		gsap.set(q('.scene'), { autoAlpha: 0 });
		gsap.set(q1('.scene-1'), { autoAlpha: 1 });
		gsap.set(q1('.scene-1 .subhead'), { opacity: 1 });

		const tl = gsap.timeline({
			paused: opts.paused,
			repeat: opts.repeat,
			repeatDelay: opts.repeatDelay,
			defaults: { ease: 'power2.out' }
		});

		tl.set(q('.scene'), { autoAlpha: 0 })
			.set(q1('.scene-1'), { autoAlpha: 1 })
			.fromTo(
				q('.headline-1 .glitch-line'),
				{ yPercent: 120, opacity: 0 },
				{ yPercent: 0, opacity: 1, stagger: 0.08, duration: 0.5 }
			)
			.fromTo(q1('.scene-1 .subhead'), { y: 12, opacity: 0 }, { y: 0, opacity: 0.92, duration: 0.24 }, '-=0.18')
			.fromTo(q1('.system-noise'), { opacity: 0.2 }, { opacity: 0.58, duration: 0.18 }, '<')
			.to(q1('.scene-1'), { x: -12, duration: 0.04 })
			.to(q1('.scene-1'), { x: 7, duration: 0.04 })
			.to(q1('.scene-1'), { x: 0, duration: 0.06 })
			.to(q1('.scene-1 .flash-word'), {
				textShadow: '0 0 12px rgba(255,255,255,0.45), 4px 0 0 rgba(255,90,117,0.55), -4px 0 0 rgba(57,255,214,0.5)',
				duration: 0.06,
				repeat: 3,
				yoyo: true
			}, '-=0.1')
			.to(q1('.scene-1'), { autoAlpha: 0, duration: 0.18, delay: 1.45 })
			.set(q1('.scene-2'), { autoAlpha: 1 })
			.fromTo(q1('.scene-2 .panel'), { scale: 0.97, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.28 })
			.fromTo(q('.scene-2 .stat-line'), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, stagger: 0.07 }, '-=0.12')
			.fromTo(q1('.scene-2 .microcopy'), { y: 10, opacity: 0 }, { y: 0, opacity: 0.84, duration: 0.24 }, '-=0.16')
			.to(q1('.scene-2 .panel'), { filter: 'contrast(1.1) saturate(1.15)', duration: 0.08, repeat: 2, yoyo: true })
			.to(q1('.scene-2'), { autoAlpha: 0, duration: 0.18, delay: 1.45 })
			.set(q1('.scene-3'), { autoAlpha: 1 })
			.fromTo(q1('.scene-3 .fix'), { clipPath: 'inset(0 100% 0 0)', opacity: 0.25 }, { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 0.46 })
			.fromTo(q1('.scene-3 .sub'), { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.28 }, '-=0.14')
			.to(q('.scene-3 .grid-cell'), { backgroundColor: 'rgba(236,255,109,0.92)', stagger: 0.018, duration: 0.14 }, '-=0.18')
			.fromTo(q1('.scene-3 .patch-note'), { opacity: 0 }, { opacity: 0.92, duration: 0.2 }, '-=0.06')
			.to(q1('.scene-3'), { autoAlpha: 0, duration: 0.18, delay: 1.35 })
			.set(q1('.scene-4'), { autoAlpha: 1 })
			.fromTo(q('.scene-4 .cta-line'), { y: 18, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.28 })
			.fromTo(q1('.scene-4 .url'), { scaleX: 0.72, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.24 }, '-=0.04')
			.fromTo(q1('.scene-4 .variant-tag'), { opacity: 0 }, { opacity: 0.78, duration: 0.18 }, '-=0.05')
			.to(root, { filter: 'contrast(1.16) saturate(1.08)', duration: 0.08, repeat: 2, yoyo: true }, '<');

		if (mode === 'export') {
			tl.to({}, { duration: 1.0 });
		} else {
			tl.to(q1('.scene-4'), { autoAlpha: 0, duration: 0.18, delay: 1.7 });
		}

		return tl;
	}

	onMount(() => {
		let tl: gsap.core.Timeline;

		if (mode === 'export') {
			tl = buildTimeline({ repeat: 0, repeatDelay: 0, paused: true });
			(window as any).tl = tl;
		} else {
			const mm = gsap.matchMedia();
			mm.add('(prefers-reduced-motion: no-preference)', () => {
				tl = buildTimeline({ repeat: -1, repeatDelay: 0.55, paused: false });
			});
			return () => {
				mm.revert();
				tl?.kill();
			};
		}

		return () => {
			tl?.kill();
		};
	});
</script>

<div class="video-frame" class:export-mode={mode === 'export'} bind:this={root}>
	<div class="system-noise"></div>
	<div class="scanlines"></div>
	<div class="vignette"></div>
	<div class="corner corner-a"></div>
	<div class="corner corner-b"></div>

	<div class="scene scene-1">
		<div class="kicker">National Commission on Electoral Reform</div>
		<div class="headline headline-1">
			<div class="clip"><span class="glitch-line">THERE'S A</span></div>
			<div class="clip"><span class="glitch-line acid flash-word">BUG</span></div>
			<div class="clip"><span class="glitch-line">IN HOW WE VOTE</span></div>
		</div>
		<div class="subhead">Britain deserves results that reflect how people actually vote.</div>
	</div>

	<div class="scene scene-2">
		<div class="panel stat-panel">
			<div class="tiny-label">The Distortion</div>
			<div class="stat-line">34% OF VOTES</div>
			<div class="stat-line dim">SHOULDN'T EQUAL</div>
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
		<div class="variant-tag">Your vote should count. Make it.</div>
	</div>
</div>

<style>
	.video-frame {
		position: relative;
		aspect-ratio: 9 / 16;
		width: 100%;
		overflow: hidden;
		border-radius: 1.5rem;
		background:
			radial-gradient(circle at 18% 10%, rgba(255, 90, 117, 0.18), transparent 22%),
			radial-gradient(circle at 82% 16%, rgba(57, 255, 214, 0.12), transparent 20%),
			linear-gradient(180deg, #05070d 0%, #0a0d14 55%, #0d111b 100%);
		border: 1px solid rgba(255, 255, 255, 0.08);
		font-family: 'Space Grotesk', Inter, ui-sans-serif, system-ui, sans-serif;
		color: #f3f5fa;
	}

	.video-frame.export-mode {
		width: 100%;
		height: 100%;
		aspect-ratio: auto;
		border-radius: 0;
		border: 0;
	}

	.scene, .system-noise, .scanlines, .vignette, .corner {
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

	.export-mode .system-noise { animation: none; }

	.scanlines {
		background: repeating-linear-gradient(180deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 4px);
		opacity: 0.09;
		pointer-events: none;
	}

	.vignette {
		box-shadow: inset 0 0 90px rgba(0,0,0,0.82);
		pointer-events: none;
	}

	.corner-a::before, .corner-b::before {
		content: '';
		position: absolute;
		width: 4rem;
		height: 4rem;
		border: 1px solid rgba(236,255,109,0.32);
	}

	.corner-a::before { top: 0.7rem; right: 0.7rem; border-left: 0; border-bottom: 0; }
	.corner-b::before { left: 0.7rem; bottom: 0.7rem; border-right: 0; border-top: 0; }

	.kicker, .tiny-label, .brand-mark, .variant-tag {
		font-size: 0.72rem;
		font-weight: 500;
		letter-spacing: 0.17em;
		text-transform: uppercase;
		color: rgba(243,245,250,0.72);
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

	.clip { overflow: hidden; }

	.glitch-line {
		display: inline-block;
		text-shadow: 3px 0 0 rgba(255,90,117,0.34), -3px 0 0 rgba(57,255,214,0.3);
	}

	.acid { color: #ecff6d; }

	.subhead {
		margin-top: 0.8rem;
		max-width: 13rem;
		font-size: 0.97rem;
		line-height: 1.3;
		color: rgba(243,245,250,0.92);
		text-transform: uppercase;
		font-weight: 500;
	}

	.patch-note {
		margin-top: 0.9rem;
		font-size: 0.86rem;
		line-height: 1.35;
		max-width: 14rem;
		color: rgba(243,245,250,0.84);
		text-transform: uppercase;
		font-weight: 700;
	}

	.panel {
		margin-top: 4rem;
		padding: 1rem;
		border: 1px solid rgba(255,255,255,0.12);
		background: rgba(255,255,255,0.05);
		backdrop-filter: blur(10px);
	}

	.stat-panel { margin-top: 3.4rem; }

	.stat-line {
		margin-top: 0.9rem;
		font-size: clamp(1.5rem, 8vw, 2.9rem);
		font-weight: 700;
		line-height: 0.94;
		letter-spacing: -0.06em;
		text-transform: uppercase;
	}

	.stat-line.dim { color: rgba(243,245,250,0.74); }

	.microcopy {
		margin-top: 1rem;
		max-width: 12rem;
		font-size: 0.92rem;
		line-height: 1.35;
		color: rgba(243,245,250,0.84);
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
		color: rgba(243,245,250,0.9);
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
		background: rgba(255,255,255,0.12);
		border: 1px solid rgba(255,255,255,0.05);
	}

	.scene-4 { align-content: center; justify-items: start; }

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
		border: 1px solid rgba(236,255,109,0.55);
		color: #ecff6d;
		text-transform: uppercase;
		font-size: 0.8rem;
		letter-spacing: 0.14em;
		font-weight: 800;
		transform-origin: left center;
	}

	.variant-tag { margin-top: 0.9rem; font-size: 0.63rem; letter-spacing: 0.13em; }

	@keyframes drift {
		from { transform: translate3d(0, 0, 0); }
		to { transform: translate3d(-24px, -24px, 0); }
	}
</style>
