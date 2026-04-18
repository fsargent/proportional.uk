<script lang="ts">
	import { onMount } from 'svelte';
	import GlitchSpotA from '$lib/components/glitch/GlitchSpotA.svelte';
	import GlitchSpotB from '$lib/components/glitch/GlitchSpotB.svelte';
	import GlitchSpotC from '$lib/components/glitch/GlitchSpotC.svelte';
	import GlitchSpotD from '$lib/components/glitch/GlitchSpotD.svelte';
	import GlitchSpotE from '$lib/components/glitch/GlitchSpotE.svelte';
	import GlitchSpotF from '$lib/components/glitch/GlitchSpotF.svelte';
	import GlitchSpotG from '$lib/components/glitch/GlitchSpotG.svelte';
	import GlitchSpotH from '$lib/components/glitch/GlitchSpotH.svelte';

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
	<title>Glitch Spot Variants • Proportional.uk</title>
	<meta
		name="description"
		content="Citizen Sector campaign proofs of concept: eight 15-second vertical glitch-style social spots for message-tested PR and commission-on-reform campaigning."
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
		<h1>Glitch Teaser Variants</h1>
		<p class="lede">
			Eight art directions for a 15-second vertical social video. Same four-scene template
			(hook, diagnosis, patch, close), different copy and imagery combinations.
			Variants C–H use emotive background images from the ERS archive and polling-tested phrases.
		</p>
		<div class="legend">
			<span class="legend-chip dark-chip">Dark mode</span>
			<span class="legend-chip light-chip">Light mode</span>
			<span class="legend-chip image-chip">+ Background imagery</span>
		</div>
		<div class="attribution-block">
			<p class="attribution">
				<a
					href="https://www.citizensector.org/"
					target="_blank"
					rel="noopener noreferrer"
				>Citizen Sector</a>
				campaign proofs of concept
			</p>
			<p class="attribution-context">
				Developed through
				<a
					href="https://www.citizensector.org/"
					target="_blank"
					rel="noopener noreferrer"
				>citizensector.org</a>
				for social campaigns, drive engagement, and build pressure for a national commission on electoral reform and proportional representation.
			</p>
		</div>
	</section>

	<section class="variant-grid">
		<div class="variant-card">
			<div class="variant-header">
				<h2>A — Dark Glitch / Signal Noise</h2>
				<p class="desc">Stark type, acid highlights, signal red, noisy texture, hard transitions. The original dark political campaign spot.</p>
				<a href="/glitch-poc/a" class="link">View full page &rarr;</a>
			</div>
			<div class="phone-shell dark"><GlitchSpotA /></div>
		</div>

		<div class="variant-card">
			<div class="variant-header">
				<h2>B — Graphic Realism / Prototype</h2>
				<p class="desc">Brighter, sleeker, neon-glitch. The original light concept-art direction.</p>
				<a href="/glitch-poc/b" class="link pink">View full page &rarr;</a>
			</div>
			<div class="phone-shell light"><GlitchSpotB /></div>
		</div>

		<div class="variant-card">
			<div class="variant-header">
				<h2>C — Reform Stats + "One Rule For Them"</h2>
				<p class="desc">"28% of votes, 60% of MPs — make it make sense." Uses the Boris/One Rule image as background. Dark mode with emotive imagery.</p>
				<p class="polling-tag">Polling phrases: Reform stat (28%/60%) · "The maths are simple" · "Fairer votes = better representation"</p>
			</div>
			<div class="phone-shell dark"><GlitchSpotC /></div>
		</div>

		<div class="variant-card">
			<div class="variant-header">
				<h2>D — Old Playbook + Veterans</h2>
				<p class="desc">"The Old Playbook Is Failing. It's Time for a Rewrite." Veteran/poppy imagery layered behind the glitch. Patriotic emotional weight.</p>
				<p class="polling-tag">Polling phrases: "Old Playbook Is Failing" · "We've Done It Before" · "When people believe their vote matters"</p>
			</div>
			<div class="phone-shell dark"><GlitchSpotD /></div>
		</div>

		<div class="variant-card">
			<div class="variant-header">
				<h2>E — System Works For Them + Bouncer</h2>
				<p class="desc">"The System Works for Them. Let's Make It Work for Us." The bouncer/no-voice image behind a closed-club message.</p>
				<p class="polling-tag">Polling phrases: "System Works for Them" · "Politics is a closed club" · "System's Rigged" · "Take Back Control"</p>
			</div>
			<div class="phone-shell dark"><GlitchSpotE /></div>
		</div>

		<div class="variant-card">
			<div class="variant-header">
				<h2>F — Votes Matter + Poppies (Light)</h2>
				<p class="desc">"When People Believe, They Show Up." Light mode with poppy field and veteran imagery blended through.</p>
				<p class="polling-tag">Polling phrases: "When people believe their vote matters" · "Higher turnouts" · "Vote shouldn't depend on where you live"</p>
			</div>
			<div class="phone-shell light"><GlitchSpotF /></div>
		</div>

		<div class="variant-card">
			<div class="variant-header">
				<h2>G — 22 Million Votes + They Lied</h2>
				<p class="desc">"22 Million Votes Didn't Count." Hard-hitting stat opener with bouncer and Boris imagery. Dark confrontational tone.</p>
				<p class="polling-tag">Polling phrases: "22 million votes" · "They Told You Voting Was Enough. They Lied" · "Changing the Game"</p>
			</div>
			<div class="phone-shell dark"><GlitchSpotG /></div>
		</div>

		<div class="variant-card">
			<div class="variant-header">
				<h2>H — 35% of Your Wages (Light)</h2>
				<p class="desc">"You Wouldn't Accept 35% of Your Wages — Why Accept It in Your Vote?" Light mode with One Rule imagery. Personal, relatable hook.</p>
				<p class="polling-tag">Polling phrases: "35% of your wages" · "Value of your vote depends on where you live" · "Fairer votes = better representation"</p>
			</div>
			<div class="phone-shell light"><GlitchSpotH /></div>
		</div>
	</section>

	<section class="notes-section">
		<h2>Template Structure</h2>
		<ul>
			<li><strong>Hook scene</strong> — problem / distortion / glitch</li>
			<li><strong>Diagnosis scene</strong> — one stat or emotional insight</li>
			<li><strong>Patch scene</strong> — reform / answer / mechanism</li>
			<li><strong>Close scene</strong> — call to action</li>
		</ul>

		<h3>Background Images</h3>
		<p>
			Variants C–H layer emotive ERS archive images behind each scene. Images fade in with
			the scene transition and sit behind the text at reduced opacity with blend modes
			(luminosity for dark, multiply for light) so they reinforce the message without
			competing with readability.
		</p>

		<h3>Polling Copy</h3>
		<p>
			Copy is drawn from A/B-tested polling phrases ranked by win rate. The top performers
			are distributed across variants so each spot leads with a different angle — stats,
			fairness, personal cost, or institutional critique.
		</p>

		<h3>Video Export</h3>
		<p>
			Run <code>bun run export:video</code> with the dev server running.
			Videos are written to <code>static/video/</code> with timestamped filenames.
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

	.legend {
		display: flex;
		gap: 0.5rem;
		margin-top: 1rem;
		flex-wrap: wrap;
	}

	.legend-chip {
		padding: 0.25rem 0.6rem;
		border-radius: 999px;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.dark-chip {
		background: rgba(255,255,255,0.08);
		color: rgba(243,245,250,0.7);
		border: 1px solid rgba(255,255,255,0.12);
	}

	.light-chip {
		background: rgba(255,255,255,0.15);
		color: rgba(243,245,250,0.85);
		border: 1px solid rgba(255,255,255,0.2);
	}

	.image-chip {
		background: rgba(236,255,109,0.12);
		color: #ecff6d;
		border: 1px solid rgba(236,255,109,0.25);
	}

	.attribution-block {
		margin-top: 1.25rem;
		max-width: 42rem;
		display: grid;
		gap: 0.45rem;
	}

	.attribution {
		margin: 0;
		font-size: 0.88rem;
		line-height: 1.45;
		font-weight: 600;
		letter-spacing: -0.01em;
		color: rgba(243, 245, 250, 0.78);
	}

	.attribution-context {
		margin: 0;
		font-size: 0.8rem;
		line-height: 1.55;
		color: rgba(243, 245, 250, 0.48);
	}

	.attribution a,
	.attribution-context a {
		color: rgba(236, 255, 109, 0.78);
		font-weight: 600;
		text-decoration: none;
	}

	.attribution a:hover,
	.attribution-context a:hover {
		color: #ecff6d;
		text-decoration: underline;
	}

	.variant-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
		gap: 2rem;
	}

	.variant-card {
		display: grid;
		gap: 1rem;
		padding: 1.25rem;
		border-radius: 1.25rem;
		background: rgba(255,255,255,0.03);
		border: 1px solid rgba(255,255,255,0.08);
		transition: border-color 0.2s;
	}

	.variant-card:hover {
		border-color: rgba(255,255,255,0.16);
	}

	.variant-header h2 {
		margin: 0 0 0.4rem;
		font-size: 1.15rem;
		letter-spacing: -0.02em;
	}

	.desc {
		margin: 0;
		font-size: 0.88rem;
		line-height: 1.5;
		color: rgba(243, 245, 250, 0.72);
	}

	.polling-tag {
		margin: 0.4rem 0 0;
		font-size: 0.75rem;
		line-height: 1.45;
		color: rgba(236,255,109,0.65);
		font-style: italic;
	}

	.link {
		display: inline-block;
		margin-top: 0.5rem;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		color: #ecff6d;
		text-decoration: none;
	}

	.link.pink { color: #ff5f7f; }
	.link:hover { text-decoration: underline; }

	.phone-shell {
		border-radius: 1.5rem;
		overflow: hidden;
		width: 100%;
		max-width: 320px;
		margin: 0 auto;
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
		.variant-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
