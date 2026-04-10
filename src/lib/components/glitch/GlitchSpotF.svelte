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

		const tl = gsap.timeline({
			paused: opts.paused,
			repeat: opts.repeat,
			repeatDelay: opts.repeatDelay,
			defaults: { ease: 'power2.out' }
		});

		tl.set(q('.scene'), { autoAlpha: 0 })
			.set(q1('.scene-1'), { autoAlpha: 1 })
			.fromTo(q1('.scene-1 .bg-image'), { scale: 1.1, opacity: 0 }, { scale: 1, opacity: 0.45, duration: 0.7 })
			.fromTo(q('.scene-1 .headline-line'), { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.08, duration: 0.46 }, '-=0.35')
			.fromTo(q1('.scene-1 .subhead'), { y: 16, opacity: 0 }, { y: 0, opacity: 0.95, duration: 0.25 }, '-=0.15')
			.to(q1('.scene-1 .headline'), {
				textShadow: '0 0 14px rgba(255,255,255,0.55), 4px 0 0 rgba(255,85,125,0.35), -4px 0 0 rgba(83,240,214,0.35)',
				duration: 0.08,
				repeat: 2,
				yoyo: true
			})
			.to(q1('.scene-1'), { autoAlpha: 0, duration: 0.18, delay: 1.2 })

			.set(q1('.scene-2'), { autoAlpha: 1 })
			.fromTo(q1('.scene-2 .bg-image'), { scale: 1.06, opacity: 0 }, { scale: 1, opacity: 0.35, duration: 0.5 })
			.fromTo(q1('.stat-card'), { scale: 0.96, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.28 }, '-=0.25')
			.fromTo(q('.stat-line'), { y: 16, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.28 }, '-=0.1')
			.fromTo(q('.seat-stack .seat'), { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.03, duration: 0.18 }, '-=0.12')
			.to(q1('.scene-2'), { autoAlpha: 0, duration: 0.18, delay: 1.3 })

			.set(q1('.scene-3'), { autoAlpha: 1 })
			.fromTo(q1('.scene-3 .bg-image'), { scale: 1.05, opacity: 0 }, { scale: 1, opacity: 0.3, duration: 0.45 })
			.fromTo(q('.scene-3 .fix-line'), { x: -30, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.08, duration: 0.32 }, '-=0.2')
			.fromTo(q1('.scene-3 .proto-box'), { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.26 }, '-=0.08')
			.to(q('.proto-grid .cell'), { backgroundColor: 'rgba(255,255,255,0.92)', stagger: 0.015, duration: 0.12 }, '-=0.1')
			.to(q1('.scene-3'), { autoAlpha: 0, duration: 0.18, delay: 1.35 })

			.set(q1('.scene-4'), { autoAlpha: 1 })
			.fromTo(q('.scene-4 .cta'), { y: 18, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.26 })
			.fromTo(q1('.scene-4 .link-chip'), { scale: 0.84, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.22 }, '-=0.05')
			.to(root, { filter: 'contrast(1.08) saturate(1.08)', duration: 0.08, repeat: 2, yoyo: true }, '<');

		if (mode === 'export') {
			tl.to({}, { duration: 1.0 });
		} else {
			tl.to(q1('.scene-4'), { autoAlpha: 0, duration: 0.18, delay: 1.5 });
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
				tl = buildTimeline({ repeat: -1, repeatDelay: 0.5, paused: false });
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
	<div class="glow glow-pink"></div>
	<div class="glow glow-mint"></div>
	<div class="mesh"></div>
	<div class="grain"></div>

	<div class="scene scene-1">
		<img class="bg-image" src="/images/glitch/ERS_Veteran_Asset_003.png" alt="" aria-hidden="true" />
		<div class="headline">
			<div class="clip"><span class="headline-line">WHEN PEOPLE</span></div>
			<div class="clip"><span class="headline-line accent">BELIEVE</span></div>
			<div class="clip"><span class="headline-line">THEY SHOW UP</span></div>
		</div>
		<div class="subhead">When people believe their vote matters, they show up.</div>
	</div>

	<div class="scene scene-2">
		<img class="bg-image" src="/images/glitch/ERS_Veteran_Asset_002.png" alt="" aria-hidden="true" />
		<div class="stat-card">
			<div class="stat-line">DIFFERENT</div>
			<div class="stat-line">SYSTEMS</div>
			<div class="stat-line accent">HIGHER</div>
			<div class="stat-line accent">TURNOUTS</div>
		</div>
		<div class="seat-stack">
			{#each Array(10) as _, i}
				<div class="seat" class:hot={i > 5}></div>
			{/each}
		</div>
	</div>

	<div class="scene scene-3">
		<img class="bg-image" src="/images/glitch/ERS_Veteran_Asset_003.png" alt="" aria-hidden="true" />
		<div class="fix-line">YOUR VOTE</div>
		<div class="fix-line accent">SHOULDN'T DEPEND</div>
		<div class="fix-line">ON WHERE YOU LIVE</div>
		<div class="proto-box">
			<div class="tiny">A FAIRER SYSTEM</div>
			<div class="proto-grid">
				{#each Array(12) as _, i}
					<div class="cell"></div>
				{/each}
			</div>
		</div>
	</div>

	<div class="scene scene-4">
		<div class="brand">OPEN BRITAIN • NCER</div>
		<div class="cta">YOUR VOTE</div>
		<div class="cta accent">SHOULD COUNT</div>
		<a class="link-chip" href="https://www.open-britain.co.uk/ncer" target="_blank" rel="noreferrer"
			>open-britain.co.uk/ncer</a
		>
	</div>
</div>

<style>
	.video-frame {
		position: relative;
		aspect-ratio: 9 / 16;
		width: 100%;
		overflow: hidden;
		border-radius: 1.5rem;
		border: 1px solid rgba(255,255,255,0.75);
		background: linear-gradient(180deg, #fff8f4 0%, #ffeaf0 44%, #e8fff9 100%);
		font-family: 'Space Grotesk', Inter, sans-serif;
		color: #1f2230;
	}

	.video-frame.export-mode {
		width: 100%;
		height: 100%;
		aspect-ratio: auto;
		border-radius: 0;
		border: 0;
	}

	.scene, .glow, .mesh, .grain { position: absolute; inset: 0; }

	.scene {
		padding: 1.25rem;
		display: grid;
		align-content: start;
	}

	.bg-image {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0;
		mix-blend-mode: multiply;
		filter: contrast(1.1) saturate(0.8);
		z-index: 0;
		pointer-events: none;
	}

	.scene > *:not(.bg-image) {
		position: relative;
		z-index: 1;
	}

	.glow { filter: blur(28px); opacity: 0.55; }
	.glow-pink { background: radial-gradient(circle at 18% 18%, rgba(255,95,127,0.42), transparent 24%); }
	.glow-mint { background: radial-gradient(circle at 80% 24%, rgba(74,235,201,0.36), transparent 24%); }

	.mesh {
		background-image:
			linear-gradient(90deg, rgba(22,25,39,0.05) 0 1px, transparent 1px),
			linear-gradient(rgba(22,25,39,0.05) 0 1px, transparent 1px);
		background-size: 32px 32px;
		opacity: 0.5;
	}

	.grain {
		background: repeating-linear-gradient(180deg, rgba(255,255,255,0.12) 0 2px, transparent 2px 5px);
		opacity: 0.22;
	}

	.tiny, .brand {
		font-size: 0.72rem;
		letter-spacing: 0.17em;
		text-transform: uppercase;
		font-weight: 500;
		color: rgba(22,25,39,0.62);
	}

	.headline {
		margin-top: 2.4rem;
		display: grid;
		gap: 0.2rem;
		font-size: clamp(2rem, 11vw, 3.8rem);
		font-weight: 700;
		line-height: 0.9;
		letter-spacing: -0.065em;
		text-transform: uppercase;
		color: #171a28;
	}

	.clip { overflow: hidden; }
	.accent { color: #ff5f7f; }

	.subhead {
		margin-top: 1rem;
		font-size: 0.95rem;
		font-weight: 500;
		text-transform: uppercase;
		color: rgba(22,25,39,0.72);
	}

	.stat-card {
		margin-top: 3.2rem;
		padding: 1rem;
		border-radius: 1.2rem;
		background: rgba(255,255,255,0.72);
		border: 1px solid rgba(255,255,255,0.8);
		box-shadow: 0 14px 40px rgba(83,58,111,0.1);
	}

	.stat-line {
		margin-top: 0.85rem;
		font-size: clamp(1.3rem, 7vw, 2.4rem);
		line-height: 0.94;
		font-weight: 700;
		letter-spacing: -0.06em;
		text-transform: uppercase;
		color: #161927;
	}

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
		font-size: clamp(1.8rem, 9vw, 2.8rem);
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
		background: rgba(255,255,255,0.72);
		border: 1px solid rgba(255,255,255,0.78);
	}

	.proto-grid {
		margin-top: 1rem;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.35rem;
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
		display: inline-block;
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
</style>
