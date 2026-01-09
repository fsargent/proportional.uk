<script lang="ts">
	import { base } from '$app/paths';

	interface ElectionData {
		year: number;
		leader: string;
		description: string;
		seats: number;
		seatMajority: number;
		actualVoteShare: number;
		context: string;
	}

	const electionData: ElectionData[] = [
		{
			year: 2024,
			leader: 'Starmer',
			description: 'Largest majority on record',
			seats: 412,
			seatMajority: 174,
			actualVoteShare: 33.7,
			context: 'Labour won with the largest seat majority in recent history'
		},
		{
			year: 2019,
			leader: 'Johnson',
			description: 'Conservative landslide',
			seats: 365,
			seatMajority: 80,
			actualVoteShare: 43.6,
			context: 'Conservative party achieved a commanding majority'
		},
		{
			year: 2017,
			leader: 'May',
			description: 'Minority government',
			seats: 318,
			seatMajority: -16,
			actualVoteShare: 42.4,
			context: 'May lost her majority and had to form a coalition'
		},
		{
			year: 2015,
			leader: 'Cameron',
			description: 'Coalition government',
			seats: 330,
			seatMajority: 10,
			actualVoteShare: 36.8,
			context: 'Conservative party won most seats but fell short of majority'
		},
		{
			year: 2010,
			leader: 'Cameron/Coalition',
			description: 'First hung parliament in 36 years',
			seats: 363,
			seatMajority: 76,
			actualVoteShare: 59.2,
			context: 'Conservative-LibDem coalition formed a government'
		},
		{
			year: 2005,
			leader: 'Blair',
			description: 'Labour majority',
			seats: 356,
			seatMajority: 64,
			actualVoteShare: 35.2,
			context: 'Labour won a strong majority'
		},
		{
			year: 2001,
			leader: 'Blair',
			description: 'Labour landslide',
			seats: 412,
			seatMajority: 165,
			actualVoteShare: 40.7,
			context: "Blair's government won a decisive victory"
		},
		{
			year: 1997,
			leader: 'Blair',
			description: 'Historic Labour victory',
			seats: 419,
			seatMajority: 177,
			actualVoteShare: 43.2,
			context: "Blair's New Labour swept to power with a historic majority"
		},
		{
			year: 1992,
			leader: 'Major',
			description: 'Conservative victory',
			seats: 336,
			seatMajority: 21,
			actualVoteShare: 41.9,
			context: "Major's Conservatives won against expectations"
		},
		{
			year: 1983,
			leader: 'Thatcher',
			description: 'Conservative landslide',
			seats: 397,
			seatMajority: 144,
			actualVoteShare: 42.4,
			context: 'Thatcher won with a commanding majority'
		}
	];

	let currentIndex = $state(0);
	let scores = $state<number[]>([]);
	let userGuesses = $state<number[]>([]);
	let gameStarted = $state(false);
	let guessSubmitted = $state(false);
	let sliderValue = $state(50);
	let showActualMarker = $state(false);

	$effect(() => {
		if (gameStarted && !guessSubmitted) {
			const seatSharePercent = Math.round((electionData[currentIndex].seats / 650) * 100);
			sliderValue = seatSharePercent;
		}
	});

	function selectElection(index: number) {
		currentIndex = index;
		gameStarted = true;
		guessSubmitted = false;
		showActualMarker = false;
		const seatSharePercent = Math.round((electionData[currentIndex].seats / 650) * 100);
		sliderValue = seatSharePercent;
	}

	function submitGuess() {
		const guess = sliderValue;
		const election = electionData[currentIndex];
		const actual = Math.round(election.actualVoteShare * 10) / 10;

		userGuesses[currentIndex] = guess;

		const difference = Math.abs(guess - actual);
		let score = 0;
		if (difference <= 2) {
			score = 10;
		} else if (difference <= 5) {
			score = 5;
		} else {
			score = 0;
		}

		scores[currentIndex] = score;
		guessSubmitted = true;

		setTimeout(() => {
			showActualMarker = true;
		}, 100);
	}

	function nextElection() {
		currentIndex++;
		guessSubmitted = false;
		showActualMarker = false;
		if (currentIndex < electionData.length) {
			const seatSharePercent = Math.round((electionData[currentIndex].seats / 650) * 100);
			sliderValue = seatSharePercent;
		}
	}

	function goBack() {
		currentIndex = 0;
		gameStarted = false;
		guessSubmitted = false;
		showActualMarker = false;
		scores = [];
		userGuesses = [];
	}

	function calculateAverageAccuracy(): string {
		if (userGuesses.length === 0) return '0';
		const avgDiff =
			userGuesses.reduce((sum, guess, idx) => {
				return sum + Math.abs(guess - electionData[idx].actualVoteShare);
			}, 0) / userGuesses.length;

		if (avgDiff < 2) return '95';
		if (avgDiff < 3) return '90';
		if (avgDiff < 5) return '80';
		if (avgDiff < 8) return '60';
		return '40';
	}

	function findBestGuess(): { year: number; diff: number } {
		let bestIdx = 0;
		let bestDiff = Math.abs(userGuesses[0] - electionData[0].actualVoteShare);

		for (let i = 1; i < userGuesses.length; i++) {
			const diff = Math.abs(userGuesses[i] - electionData[i].actualVoteShare);
			if (diff < bestDiff) {
				bestDiff = diff;
				bestIdx = i;
			}
		}

		return { year: electionData[bestIdx].year, diff: bestDiff };
	}

	function findWorstGuess(): { year: number; diff: number } {
		let worstIdx = 0;
		let worstDiff = Math.abs(userGuesses[0] - electionData[0].actualVoteShare);

		for (let i = 1; i < userGuesses.length; i++) {
			const diff = Math.abs(userGuesses[i] - electionData[i].actualVoteShare);
			if (diff > worstDiff) {
				worstDiff = diff;
				worstIdx = i;
			}
		}

		return { year: electionData[worstIdx].year, diff: worstDiff };
	}

	// Derived values
	let currentElection = $derived(electionData[currentIndex]);
	let seatSharePercent = $derived(currentElection ? Math.round((currentElection.seats / 650) * 100) : 0);
	let difference = $derived(sliderValue - seatSharePercent);
	let isGameComplete = $derived(gameStarted && currentIndex >= electionData.length);

	// Results calculations
	let totalScore = $derived(scores.reduce((a, b) => a + b, 0));
	let maxScore = $derived(electionData.length * 10);
	let scorePercentage = $derived(Math.round((totalScore / maxScore) * 100));
	let correctGuesses = $derived(scores.filter((s) => s === 10).length);

	// Feedback for current guess
	let currentDifference = $derived(
		guessSubmitted ? Math.abs(userGuesses[currentIndex] - currentElection.actualVoteShare) : 0
	);
	let feedbackClass = $derived(currentDifference <= 5 ? 'correct' : 'incorrect');
	let feedbackTitle = $derived(
		currentDifference <= 2
			? '✅ Excellent guess!'
			: currentDifference <= 5
				? '✅ Pretty close!'
				: 'Not quite'
	);
	let feedbackMessage = $derived(
		currentDifference <= 2
			? "You were within 2 percentage points - that's really close!"
			: currentDifference <= 5
				? `You were ${currentDifference.toFixed(1)} percentage points off. That's a good guess!`
				: `The actual vote share was ${currentDifference.toFixed(1)} percentage points different. FPTP can be unpredictable!`
	);
</script>

<svelte:head>
	<title>FPTP Challenge - Electoral Reform for the UK</title>
	<meta
		name="description"
		content="Test your intuition about First Past The Post voting system with the FPTP Challenge"
	/>
</svelte:head>

<div class="challenge-container">
	{#if !gameStarted}
		<!-- Start Screen -->
		<div class="challenge-stage">
			<div class="challenge-card">
				<div class="challenge-header">
					<h2>Choose an Election</h2>
					<p>Test your intuition by guessing the vote share for each election result</p>
				</div>

				<div class="intro-content">
					<h3>How It Works</h3>
					<p>
						For each election, you'll see the number of seats won and seat percentage. Your task is
						to guess what percentage of the popular vote they received.
					</p>
					<p>
						<strong>Hint:</strong> Most UK vote shares fall between 33% and 44%, but sometimes it's wildly
						different!
					</p>
				</div>

				<div class="elections-grid">
					{#each electionData as election, index}
						<button class="election-card" onclick={() => selectElection(index)}>
							<div class="election-year">{election.year}</div>
							<div class="election-leader">{election.leader}</div>
							<div class="election-stats">
								<div class="stat-inline">
									<div class="stat-label">Seats</div>
									<div class="stat-value">{election.seats}</div>
								</div>
								<div class="stat-inline">
									<div class="stat-label">Seat Share</div>
									<div class="stat-value">{Math.round((election.seats / 650) * 100)}%</div>
								</div>
							</div>
							<div class="election-status">→ Click to guess vote share</div>
						</button>
					{/each}
				</div>
			</div>
		</div>
	{:else if !isGameComplete}
		<!-- Challenge Screen -->
		<div class="challenge-stage">
			<div class="challenge-card">
				<div class="challenge-header">
					<h2>{currentElection.year} UK General Election</h2>
					<div class="challenge-meta">
						<span class="counter">{currentIndex + 1} of {electionData.length}</span>
					</div>
					<p>{currentElection.description}</p>
				</div>

				<div class="election-result">
					<h3>{currentElection.leader}</h3>
					<div class="result-metrics">
						<div class="metric-item">
							<div class="metric-label">Seats Won</div>
							<div class="metric-value">{currentElection.seats}</div>
						</div>
						<div class="metric-item">
							<div class="metric-label">Seat Share %</div>
							<div class="metric-value">{seatSharePercent}%</div>
						</div>
					</div>
					<p class="election-context">{currentElection.context}</p>
				</div>

				<div class="question-section">
					<h3>What do you think their vote share was?</h3>
					<p style="text-align: center; color: #666;">
						Start from the seat share % and adjust to guess the vote share
					</p>

					<div class="vote-guess-container">
						<div class="slider-wrapper">
							<div class="slider-track">
								<div class="seat-share-marker" style="left: {seatSharePercent}%"></div>
								{#if showActualMarker}
									<div
										class="actual-vote-share-marker"
										style="left: {currentElection.actualVoteShare}%"
									></div>
								{/if}
								{#if !guessSubmitted}
									{#if sliderValue < seatSharePercent}
										<div
											class="vote-difference-indicator animate"
											style="left: {sliderValue}%; width: {seatSharePercent - sliderValue}%; background-color: #d4351c;"
										></div>
									{:else if sliderValue > seatSharePercent}
										<div
											class="vote-difference-indicator animate"
											style="left: {seatSharePercent}%; width: {sliderValue - seatSharePercent}%; background-color: #00703c;"
										></div>
									{/if}
								{/if}
								<input
									type="range"
									min="0"
									max="100"
									bind:value={sliderValue}
									class="guess-slider"
									disabled={guessSubmitted}
								/>
							</div>
							<div class="slider-labels">
								<span>0%</span>
								<span>50%</span>
								<span>100%</span>
							</div>
						</div>

						<div class="guess-display">
							<div class="guess-label">Your Guess</div>
							<p class="guess-percentage">{sliderValue}%</p>
							<div class="difference-display">
								{#if difference === 0}
									<p class="difference-text neutral">Same as seat share</p>
								{:else if difference < 0}
									<p class="difference-text below">{Math.abs(difference)}% below seat share</p>
								{:else}
									<p class="difference-text above">{difference}% above seat share</p>
								{/if}
							</div>
						</div>
					</div>
				</div>

				{#if guessSubmitted}
					<div class="inline-results">
						<div class="result-feedback {feedbackClass}">
							<h4>{feedbackTitle}</h4>
							<div class="guess-vs-actual">
								<div class="comparison-item">
									<h5>Your Guess</h5>
									<p class="comparison-value guess-value">{userGuesses[currentIndex]}%</p>
								</div>
								<div class="comparison-item">
									<h5>Actual Vote Share</h5>
									<p class="comparison-value actual-value">{currentElection.actualVoteShare}%</p>
								</div>
							</div>
							<p>{feedbackMessage}</p>
						</div>
					</div>
				{/if}

				<div class="button-group">
					{#if !guessSubmitted}
						<button class="btn-submit" onclick={submitGuess}>Submit Guess</button>
					{:else}
						<button class="btn-submit" onclick={nextElection}>Next Election →</button>
					{/if}
					<button class="btn-submit" style="background: #666;" onclick={goBack}>Go Back</button>
				</div>
			</div>
		</div>
	{:else}
		<!-- Results Screen -->
		<div class="results-stage">
			<div class="results-summary">
				<h2>Challenge Complete! 🎉</h2>

				<div class="score-display">
					<div class="score-label">Your Score</div>
					<p class="score-value">{scorePercentage}%</p>
					<p class="score-fraction">{totalScore} out of {maxScore} points</p>
				</div>

				<div class="performance-stats">
					<div class="stat-box">
						<div class="stat-label">Perfect Guesses</div>
						<div class="stat-value">{correctGuesses}</div>
					</div>
					<div class="stat-box">
						<div class="stat-label">Elections Played</div>
						<div class="stat-value">{electionData.length}</div>
					</div>
					<div class="stat-box">
						<div class="stat-label">Average Accuracy</div>
						<div class="stat-value">{calculateAverageAccuracy()}%</div>
					</div>
				</div>

				<div class="insight-box">
					<h4>📊 Your Challenge Insights</h4>
					<p>
						<strong>Best guess:</strong>
						{findBestGuess().year} (off by {findBestGuess().diff.toFixed(1)}%)
					</p>
					<p>
						<strong>Toughest guess:</strong>
						{findWorstGuess().year} (off by {findWorstGuess().diff.toFixed(1)}%)
					</p>
					<p>
						<strong>Key insight:</strong> FPTP creates unpredictable results. Small vote share changes
						create massive seat swings. This is why proportional representation provides more stable
						and fair outcomes.
					</p>
					<ul>
						<li>Vote shares vary from 33.7% (2024) to 59.2% (2010 coalition)</li>
						<li>One election had a negative majority (minority government)</li>
						<li>FPTP heavily amplifies small vote share differences into huge seat differences</li>
					</ul>
				</div>

				<div class="button-group">
					<button class="btn-start-over" onclick={goBack}>Try Again</button>
					<a href={base || '/'} class="btn-next">Back to AMS+</a>
				</div>
			</div>
		</div>
	{/if}
</div>

<div class="key-takeaway" style="margin-top: 2rem">
	<h3 style="margin-top: 0">🎯 The Absurdity of FPTP</h3>
	<p>
		Most UK election results fall within a narrow 41-44% vote share band, yet produce wildly
		different seat outcomes. Thatcher won a 144-seat majority with 42.4% in 1983, while May lost 16
		seats with the exact same 42.4% in 2017. Meanwhile, Starmer's near-record majority (412 seats)
		coincides with Cameron's record low minority (330 seats) — both achieved within the 33-36% vote
		share range.
	</p>
	<p>
		FPTP makes election results unpredictable and fundamentally unfair. Vote for change through
		<a
			href="https://www.makevotesmatter.org.uk/"
			target="_blank"
			style="color: var(--header-bg); font-weight: 600">Make Votes Matter</a
		>, a campaign for proportional representation.
	</p>
</div>

<style>
	/* ===== FPTP CHALLENGE STYLES ===== */

	.challenge-container {
		width: 100%;
	}

	.challenge-stage,
	.results-stage {
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		opacity: 1;
	}

	/* Intro Content within Challenge Card */
	.intro-content {
		background: linear-gradient(
			135deg,
			rgba(0, 112, 60, 0.08) 0%,
			rgba(29, 112, 184, 0.08) 100%
		);
		border-left: 4px solid var(--neutral-color, #1d70b8);
		border-radius: 4px;
		padding: 1.5rem;
		margin: 1.5rem 0;
	}

	.intro-content h3 {
		margin: 0 0 0.75rem 0;
		color: var(--neutral-color, #1d70b8);
		font-size: 1.1rem;
	}

	.intro-content p {
		margin: 0.5rem 0;
		font-size: 0.95rem;
		line-height: 1.5;
	}

	.intro-content p:last-child {
		margin-bottom: 0;
	}

	/* Challenge Card */
	.challenge-card {
		background: #ffffff;
		border: 3px solid #1d70b8;
		border-radius: 12px;
		padding: 2.5rem;
		margin: 1.5rem auto;
		max-width: 700px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
	}

	@media (prefers-color-scheme: dark) {
		.challenge-card {
			background: #1a1a1a;
			box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
		}
	}

	@media (max-width: 768px) {
		.challenge-card {
			margin: 1rem auto;
			padding: 1.5rem;
		}
	}

	.challenge-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.challenge-header h2 {
		margin: 0 0 0.5rem 0;
		font-size: 1.8rem;
	}

	.challenge-meta {
		font-size: 0.95rem;
		margin: 0.5rem 0;
	}

	.challenge-meta .counter {
		font-weight: 600;
		color: #1d70b8;
	}

	/* Elections Grid */
	.elections-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
		margin: 2rem 0;
	}

	.election-card {
		background: #ffffff;
		border: 2px solid #ddd;
		border-radius: 8px;
		padding: 1.5rem;
		text-align: center;
		transition: all 0.3s ease;
		cursor: pointer;
		width: 100%;
		font-family: inherit;
	}

	@media (prefers-color-scheme: dark) {
		.election-card {
			background: #2d2d2d;
			border-color: #444;
		}
	}

	.election-card:hover {
		border-color: #1d70b8;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		transform: translateY(-2px);
	}

	.election-year {
		font-size: 0.9rem;
		color: #666;
		margin-bottom: 0.5rem;
	}

	.election-leader {
		font-size: 1.3rem;
		font-weight: 600;
		margin: 0.5rem 0;
	}

	.election-stats {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin: 1rem 0;
		padding: 1rem;
		background: rgba(29, 112, 184, 0.05);
		border-radius: 6px;
	}

	.stat-inline {
		text-align: center;
	}

	.stat-label {
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: #666;
		margin-bottom: 0.35rem;
	}

	.stat-value {
		font-size: 1.4rem;
		font-weight: bold;
		color: #1d70b8;
	}

	.election-status {
		font-size: 0.85rem;
		color: #00703c;
		font-weight: 600;
		margin-top: 1rem;
	}

	/* Election Result Display */
	.election-result {
		background: #f9f9f9;
		border: 2px solid #ddd;
		border-radius: 8px;
		padding: 1.5rem;
		margin: 2rem 0;
		text-align: center;
	}

	@media (prefers-color-scheme: dark) {
		.election-result {
			background: #2d2d2d;
			border-color: #444;
		}
	}

	.election-result h3 {
		margin: 0 0 1rem 0;
		font-size: 1.4rem;
	}

	.result-metrics {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
		margin: 1.5rem 0;
	}

	@media (max-width: 600px) {
		.result-metrics {
			grid-template-columns: 1fr;
		}
	}

	.metric-item {
		padding: 1.25rem;
		background: linear-gradient(135deg, rgba(29, 112, 184, 0.1), rgba(29, 112, 184, 0.05));
		border-radius: 8px;
		border: 2px solid rgba(29, 112, 184, 0.2);
		text-align: center;
	}

	.metric-label {
		font-size: 0.85rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: #666;
		margin-bottom: 0.75rem;
	}

	.metric-value {
		font-size: 2.5rem;
		font-weight: bold;
		color: #1d70b8;
	}

	.election-context {
		margin-top: 1rem;
		font-style: italic;
		color: #666;
	}

	/* Question Section */
	.question-section {
		margin: 2.5rem 0;
	}

	.question-section h3 {
		margin: 0 0 1.5rem 0;
		text-align: center;
		font-size: 1.3rem;
	}

	/* Slider */
	.vote-guess-container {
		margin: 2rem 0;
	}

	.slider-wrapper {
		position: relative;
		margin: 2rem 0;
	}

	.slider-track {
		position: relative;
		width: 100%;
		height: 32px;
		margin: calc(1rem - 5px) 0;
		padding: 0;
		box-sizing: border-box;
		top: -5px;
		display: flex;
		align-items: center;
	}

	.slider-track::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 0;
		width: 100%;
		height: 8px;
		transform: translateY(-50%);
		border-radius: 5px;
		background: linear-gradient(to right, #ddd 0%, #999 50%, #ddd 100%);
		z-index: 0;
	}

	.seat-share-marker {
		position: absolute;
		top: 0;
		width: 3px;
		height: 100%;
		background: #ffffff;
		transform: translateX(-50%);
		z-index: 2;
		pointer-events: none;
		box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
	}

	.seat-share-marker::before {
		content: '';
		position: absolute;
		top: -8px;
		left: 50%;
		transform: translateX(-50%);
		width: 0;
		height: 0;
		border-left: 6px solid transparent;
		border-right: 6px solid transparent;
		border-top: 8px solid #ffffff;
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
	}

	.seat-share-marker::after {
		content: 'Seat Share';
		position: absolute;
		top: -30px;
		left: 50%;
		transform: translateX(-50%);
		white-space: nowrap;
		font-size: 0.75rem;
		color: #ffffff;
		font-weight: 600;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
	}

	.actual-vote-share-marker {
		position: absolute;
		top: 0;
		width: 3px;
		height: 100%;
		background: #ffd700;
		transform: translateX(-50%);
		z-index: 4;
		pointer-events: none;
		box-shadow: 0 0 4px rgba(255, 215, 0, 0.6);
		animation: fadeIn 0.6s ease;
	}

	.actual-vote-share-marker::before {
		content: '';
		position: absolute;
		top: -8px;
		left: 50%;
		transform: translateX(-50%);
		width: 0;
		height: 0;
		border-left: 6px solid transparent;
		border-right: 6px solid transparent;
		border-top: 8px solid #ffd700;
	}

	.actual-vote-share-marker::after {
		content: 'Actual';
		position: absolute;
		top: -30px;
		left: 50%;
		transform: translateX(-50%);
		white-space: nowrap;
		font-size: 0.75rem;
		color: #ffd700;
		font-weight: 600;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
	}

	.vote-difference-indicator {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		height: 4px;
		z-index: 1;
		pointer-events: none;
	}

	.vote-difference-indicator.animate {
		animation: pulse 1.5s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.7;
		}
		50% {
			opacity: 1;
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.guess-slider {
		position: relative;
		width: 100%;
		height: 8px;
		background: transparent;
		outline: none;
		-webkit-appearance: none;
		appearance: none;
		z-index: 3;
		margin: 0;
		padding: 0;
	}

	.guess-slider::-webkit-slider-runnable-track {
		height: 8px;
		width: 100%;
		cursor: pointer;
		background: transparent;
		border-radius: 5px;
	}

	.guess-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: #666666;
		cursor: pointer;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
		transition: all 0.2s ease;
		margin-top: -12px;
	}

	.guess-slider::-webkit-slider-thumb:hover {
		transform: scale(1.15);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		background: #555555;
	}

	.guess-slider::-moz-range-thumb {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: #666666;
		cursor: pointer;
		border: none;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	}

	.guess-slider:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.slider-labels {
		display: flex;
		justify-content: space-between;
		margin-top: 0.75rem;
		font-size: 0.85rem;
		color: #666;
		font-weight: 500;
	}

	/* Guess Display */
	.guess-display {
		text-align: center;
		margin: 1.5rem 0;
		padding: 1.5rem;
		background: #f9f9f9;
		border: 2px dashed #1d70b8;
		border-radius: 8px;
	}

	@media (prefers-color-scheme: dark) {
		.guess-display {
			background: #2d2d2d;
		}
	}

	.guess-label {
		font-size: 0.9rem;
		color: #666;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		margin-bottom: 0.5rem;
	}

	.guess-percentage {
		font-size: 3rem;
		font-weight: bold;
		color: #1d70b8;
		margin: 0;
	}

	.difference-display {
		margin-top: 1rem;
		text-align: center;
	}

	.difference-text {
		margin: 0;
		font-size: 0.95rem;
		font-weight: 600;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		display: inline-block;
	}

	.difference-text.neutral {
		color: #1d70b8;
		background: rgba(29, 112, 184, 0.1);
	}

	.difference-text.below {
		color: #d4351c;
		background: rgba(212, 53, 28, 0.1);
	}

	.difference-text.above {
		color: #00703c;
		background: rgba(0, 112, 60, 0.1);
	}

	/* Button Styles */
	.button-group {
		display: flex;
		gap: 1rem;
		justify-content: center;
		margin: 2.5rem 0;
		flex-wrap: wrap;
	}

	@media (max-width: 600px) {
		.button-group {
			flex-direction: column;
		}
	}

	.btn-submit,
	.btn-next,
	.btn-start-over {
		padding: 0.875rem 2rem;
		border: none;
		border-radius: 6px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		min-width: 180px;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		line-height: 1.5;
	}

	.btn-submit {
		background: #1d70b8;
		color: white;
	}

	.btn-submit:hover:not(:disabled) {
		background: #1a5fa0;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
		transform: translateY(-2px);
	}

	.btn-next,
	.btn-start-over {
		background: #00703c;
		color: white;
	}

	.btn-next:hover,
	.btn-start-over:hover {
		background: #005a2a;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
		transform: translateY(-2px);
	}

	/* Inline Results */
	.inline-results {
		margin: 2rem 0;
		animation: fadeInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.result-feedback {
		margin: 2rem 0;
		padding: 1.5rem;
		border-radius: 8px;
		border-left: 4px solid;
	}

	.result-feedback.correct {
		background: #f0fdf4;
		border-color: #00703c;
		color: #165b33;
	}

	.result-feedback.incorrect {
		background: #fef2f2;
		border-color: #d4351c;
		color: #7f1d1d;
	}

	@media (prefers-color-scheme: dark) {
		.result-feedback.correct {
			background: rgba(0, 112, 60, 0.25);
			color: #7bed9f;
		}

		.result-feedback.incorrect {
			background: rgba(212, 53, 28, 0.25);
			color: #ff9d8f;
		}
	}

	.result-feedback h4 {
		margin: 0 0 0.75rem 0;
		font-size: 1.2rem;
	}

	.result-feedback p {
		margin: 0.5rem 0;
		line-height: 1.6;
	}

	.guess-vs-actual {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
		margin: 1.5rem 0;
	}

	@media (max-width: 600px) {
		.guess-vs-actual {
			grid-template-columns: 1fr;
		}
	}

	.comparison-item {
		padding: 1.5rem;
		background: #f9f9f9;
		border: 2px solid #ddd;
		border-radius: 8px;
		text-align: center;
	}

	@media (prefers-color-scheme: dark) {
		.comparison-item {
			background: #2d2d2d;
			border-color: #444;
		}
	}

	.comparison-item h5 {
		margin: 0 0 1rem 0;
		font-size: 0.95rem;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: #666;
	}

	.comparison-value {
		font-size: 2.5rem;
		font-weight: bold;
		margin: 0;
	}

	.guess-value {
		color: #1d70b8;
	}

	.actual-value {
		color: #00703c;
	}

	/* Results Summary */
	.results-summary {
		background: #ffffff;
		border: 3px solid #1d70b8;
		border-radius: 12px;
		padding: 2.5rem;
		margin: 2rem auto;
		max-width: 700px;
		text-align: center;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
	}

	@media (prefers-color-scheme: dark) {
		.results-summary {
			background: #1a1a1a;
			box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
		}
	}

	.results-summary h2 {
		margin: 0 0 1rem 0;
		font-size: 2rem;
	}

	.score-display {
		margin: 2rem 0;
		padding: 2rem;
		background: linear-gradient(135deg, #f0f8f0 0%, #e8f5ff 100%);
		border-radius: 8px;
		border: 2px solid #1d70b8;
	}

	@media (prefers-color-scheme: dark) {
		.score-display {
			background: linear-gradient(
				135deg,
				rgba(0, 112, 60, 0.15) 0%,
				rgba(29, 112, 184, 0.15) 100%
			);
		}
	}

	.score-label {
		font-size: 1rem;
		color: #666;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		margin-bottom: 1rem;
	}

	.score-value {
		font-size: 3.5rem;
		font-weight: bold;
		color: #1d70b8;
		margin: 0;
	}

	.score-fraction {
		font-size: 1.2rem;
		margin-top: 0.5rem;
	}

	.performance-stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
		margin: 2rem 0;
	}

	@media (max-width: 600px) {
		.performance-stats {
			grid-template-columns: 1fr;
		}
	}

	.stat-box {
		padding: 1.5rem;
		background: #f9f9f9;
		border: 2px solid #ddd;
		border-radius: 8px;
		text-align: center;
	}

	@media (prefers-color-scheme: dark) {
		.stat-box {
			background: #2d2d2d;
			border-color: #444;
		}
	}

	/* Insight Box */
	.insight-box {
		background: #fef3c7;
		border: 2px solid #fcd34d;
		border-radius: 8px;
		padding: 1.5rem;
		margin: 1.5rem 0;
		text-align: left;
	}

	@media (prefers-color-scheme: dark) {
		.insight-box {
			background: rgba(217, 119, 6, 0.2);
			border-color: rgba(217, 119, 6, 0.4);
		}
	}

	.insight-box h4 {
		margin: 0 0 0.75rem 0;
		color: #92400e;
		font-size: 1.1rem;
	}

	@media (prefers-color-scheme: dark) {
		.insight-box h4 {
			color: #fbbf24;
		}
	}

	.insight-box p {
		margin: 0.5rem 0;
		color: #78350f;
		line-height: 1.6;
	}

	@media (prefers-color-scheme: dark) {
		.insight-box p {
			color: #fed7aa;
		}
	}

	.insight-box ul {
		margin: 1rem 0 0 1.5rem;
		padding-left: 0;
	}

	.insight-box li {
		margin: 0.5rem 0;
		color: #78350f;
	}

	@media (prefers-color-scheme: dark) {
		.insight-box li {
			color: #fed7aa;
		}
	}
</style>
