<section class="uk-pr-bridge" aria-labelledby="uk-pr-bridge-title">
	<div class="bridge-copy">
		<h2 id="uk-pr-bridge-title" class="section-header">Where the UK PR conversation stands</h2>
		<p class="intro-text">
			If you already follow electoral reform, you will know some of these names. If you do not, here is
			a quick orientation. The UK is not starting from scratch. Several proportional systems are already
			used for elections in different parts of the country, and reformers have been debating them for
			decades.
		</p>
		<p>
			This site is aimed at both audiences: people encountering proportional representation for the
			first time, and people who already know the main options but want to ask whether the ballot itself
			could be simpler.
		</p>
	</div>

	<div class="bridge-grid">
		<article class="bridge-card">
			<h3>STV — Single Transferable Vote</h3>
			<p>
				<strong>What it is:</strong> voters rank candidates in order of preference in multi-member
				districts. As candidates are elected or eliminated, lower preferences transfer to remaining
				candidates.
			</p>
			<p>
				<strong>Where it is used:</strong> Northern Ireland (Assembly, local elections), Scottish local
				elections, Republic of Ireland (all elections).
			</p>
			<p>
				<strong>Main strength:</strong> proportional results without closed party lists — voters choose
				individual candidates, not just parties.
			</p>
			<p>
				<strong>Main tradeoff:</strong> ranking many candidates can be demanding, and the transfer
				count is harder to follow than a simple tally.
			</p>
		</article>
		<article class="bridge-card">
			<h3>AMS / MMP — Additional Member System</h3>
			<p>
				<strong>What it is:</strong> voters get two votes — one for a local constituency MP (elected
				like FPTP), and one for a party. Extra "top-up" seats are then allocated from party lists to
				make the overall result more proportional.
			</p>
			<p>
				<strong>Where it is used:</strong> Scottish Parliament, Welsh Senedd (until 2026), London
				Assembly. Also used in Germany and New Zealand.
			</p>
			<p>
				<strong>Main strength:</strong> keeps a named local MP while adding proportionality through the
				second tier.
			</p>
			<p>
				<strong>Main tradeoff:</strong> the local vote is still FPTP, which means the tactical squeeze
				and vote-splitting survive in the constituency tier.
			</p>
		</article>
		<article class="bridge-card">
			<h3>List PR — List Proportional Representation</h3>
			<p>
				<strong>What it is:</strong> voters choose a party (and sometimes a preferred candidate within
				that party's list). Seats are allocated to parties in proportion to their vote share.
			</p>
			<p>
				<strong>Where it is used:</strong> was used for European Parliament elections in Great Britain;
				being adopted for the Welsh Senedd from 2026. Also used across Scandinavia, the Netherlands,
				and many other countries.
			</p>
			<p>
				<strong>Main strength:</strong> the most direct route to proportional seat shares.
			</p>
			<p>
				<strong>Main tradeoff:</strong> with closed lists, party officials choose who gets elected. Open
				lists (as in Finland) fix this, but the system still shifts more power to party-level
				competition.
			</p>
		</article>
	</div>

	<div class="bridge-note">
		<p>
			These are all serious, well-tested systems. This site does not dismiss them. It asks a further
			question: given that the ballot is where the voter meets the system, could the ballot itself be
			made simpler and more expressive? That is what the next sections explore.
		</p>
	</div>
</section>

<style>
	.uk-pr-bridge {
		display: grid;
		gap: 1.5rem;
	}

	.bridge-copy {
		max-width: 56rem;
	}

	.bridge-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1rem;
	}

	.bridge-card {
		padding: 1.25rem;
		border-radius: var(--radius-md);
		border: 1px solid var(--border-color);
		background: var(--surface-raised);
		box-shadow: var(--shadow-soft);
	}

	.bridge-card h3 {
		margin: 0 0 0.45rem 0;
	}

	.bridge-card p {
		margin: 0.4rem 0 0 0;
		font-size: 0.96rem;
		line-height: 1.5;
	}

	.bridge-note {
		max-width: 56rem;
		padding: 1.1rem 1.3rem;
		border-radius: var(--radius-md);
		background: var(--surface-subtle-gradient);
		border: 1px solid var(--border-color);
	}

	.bridge-note p {
		margin: 0;
	}
</style>
