// FPTP Challenge Game Logic

const electionData = [
  {
    year: 2024,
    leader: "Starmer",
    description: "Largest majority on record",
    seats: 412,
    seatMajority: 174,
    actualVoteShare: 33.7,
    context: "Labour won with the largest seat majority in recent history",
  },
  {
    year: 2019,
    leader: "Johnson",
    description: "Conservative landslide",
    seats: 365,
    seatMajority: 80,
    actualVoteShare: 43.6,
    context: "Conservative party achieved a commanding majority",
  },
  {
    year: 2017,
    leader: "May",
    description: "Minority government",
    seats: 318,
    seatMajority: -16,
    actualVoteShare: 42.4,
    context: "May lost her majority and had to form a coalition",
  },
  {
    year: 2015,
    leader: "Cameron",
    description: "Coalition government",
    seats: 330,
    seatMajority: 10,
    actualVoteShare: 36.8,
    context: "Conservative party won most seats but fell short of majority",
  },
  {
    year: 2010,
    leader: "Cameron/Coalition",
    description: "First hung parliament in 36 years",
    seats: 363,
    seatMajority: 76,
    actualVoteShare: 59.2,
    context: "Conservative-LibDem coalition formed a government",
  },
  {
    year: 2005,
    leader: "Blair",
    description: "Labour majority",
    seats: 356,
    seatMajority: 64,
    actualVoteShare: 35.2,
    context: "Labour won a strong majority",
  },
  {
    year: 2001,
    leader: "Blair",
    description: "Labour landslide",
    seats: 412,
    seatMajority: 165,
    actualVoteShare: 40.7,
    context: "Blair's government won a decisive victory",
  },
  {
    year: 1997,
    leader: "Blair",
    description: "Historic Labour victory",
    seats: 419,
    seatMajority: 177,
    actualVoteShare: 43.2,
    context: "Blair's New Labour swept to power with a historic majority",
  },
  {
    year: 1992,
    leader: "Major",
    description: "Conservative victory",
    seats: 336,
    seatMajority: 21,
    actualVoteShare: 41.9,
    context: "Major's Conservatives won against expectations",
  },
  {
    year: 1983,
    leader: "Thatcher",
    description: "Conservative landslide",
    seats: 397,
    seatMajority: 144,
    actualVoteShare: 42.4,
    context: "Thatcher won with a commanding majority",
  },
];

class FPTPChallenge {
  constructor() {
    this.currentIndex = 0;
    this.scores = [];
    this.userGuesses = [];
    this.gameStarted = false;
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    if (!this.gameStarted) {
      this.renderStartScreen();
    } else if (this.currentIndex < electionData.length) {
      this.renderChallenge();
    } else {
      this.renderResults();
    }
  }

  renderStartScreen() {
    const challengeStage = document.getElementById("challenge-stage");
    const electionsHtml = electionData
      .map(
        (election, index) => `
      <div class="election-card" onclick="game.selectElection(${index})">
        <div class="election-year">${election.year}</div>
        <div class="election-leader">${election.leader}</div>
        <div class="election-stats">
          <div class="stat-inline">
            <div class="stat-label">Seats</div>
            <div class="stat-value">${election.seats}</div>
          </div>
          <div class="stat-inline">
            <div class="stat-label">Seat Share</div>
            <div class="stat-value">${Math.round((election.seats / 650) * 100)}%</div>
          </div>
        </div>
        <div class="election-status">→ Click to guess vote share</div>
      </div>
    `,
      )
      .join("");

    challengeStage.innerHTML = `
      <div class="challenge-card">
        <div class="challenge-header">
          <h2>Choose an Election</h2>
          <p>Test your intuition by guessing the vote share for each election result</p>
        </div>

        <div class="intro-content">
          <h3>How It Works</h3>
          <p>For each election, you'll see the number of seats won and seat percentage. Your task is to guess what percentage of the popular vote they received.</p>
          <p><strong>Hint:</strong> Most UK vote shares fall between 33% and 44%, but sometimes it's wildly different!</p>
        </div>

        <div class="elections-grid">
          ${electionsHtml}
        </div>
      </div>
    `;
  }

  selectElection(index) {
    this.currentIndex = index;
    this.gameStarted = true;
    this.render();
  }

  renderChallenge() {
    const election = electionData[this.currentIndex];
    const challengeStage = document.getElementById("challenge-stage");
    const seatSharePercent = Math.round((election.seats / 650) * 100);

    challengeStage.innerHTML = `
      <div class="challenge-card">
        <div class="challenge-header">
          <h2>${election.year} UK General Election</h2>
          <div class="challenge-meta">
            <span class="counter">${this.currentIndex + 1} of ${electionData.length}</span>
          </div>
          <p>${election.description}</p>
        </div>

        <div class="election-result">
          <h3>${election.leader}</h3>
          <div class="result-metrics">
            <div class="metric-item">
              <div class="metric-label">Seats Won</div>
              <div class="metric-value">${election.seats}</div>
            </div>
            <div class="metric-item">
              <div class="metric-label">Seat Share %</div>
              <div class="metric-value">${seatSharePercent}%</div>
            </div>
          </div>
          <p class="election-context">${election.context}</p>
        </div>

        <div class="question-section">
          <h3>What do you think their vote share was?</h3>
          <p style="text-align: center; color: #666;">
            Start from the seat share % and adjust to guess the vote share
          </p>

          <div class="vote-guess-container">
            <div class="slider-wrapper">
              <div class="slider-track">
                <div class="seat-share-marker" id="seatShareMarker" style="left: ${seatSharePercent}%"></div>
                <div class="vote-difference-indicator" id="voteDifferenceIndicator"></div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value="${seatSharePercent}"
                  class="guess-slider"
                  id="voteSlider"
                  onchange="game.updateGuess(this.value)"
                  oninput="game.updateGuess(this.value)"
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
              <p class="guess-percentage" id="guessDisplay">${seatSharePercent}%</p>
              <div class="difference-display" id="differenceDisplay"></div>
            </div>
          </div>
        </div>

        <div class="button-group">
          <button class="btn-submit" onclick="game.submitGuess()">
            Submit Guess
          </button>
          <button class="btn-submit" style="background: #666;" onclick="game.goBack()">
            Go Back
          </button>
        </div>
      </div>
    `;

    // Set up slider event listener
    const slider = document.getElementById("voteSlider");
    if (slider) {
      slider.addEventListener("input", (e) => {
        this.updateGuess(e.target.value);
      });
      // Initialize with seat share value
      this.updateGuess(seatSharePercent);
    }
  }

  updateGuess(value) {
    const percentage = parseInt(value);
    const election = electionData[this.currentIndex];
    const seatSharePercent = Math.round((election.seats / 650) * 100);
    const difference = percentage - seatSharePercent;

    const display = document.getElementById("guessDisplay");
    if (display) {
      display.textContent = `${percentage}%`;
    }

    // Update difference display
    const differenceDisplay = document.getElementById("differenceDisplay");
    if (differenceDisplay) {
      if (difference === 0) {
        differenceDisplay.innerHTML = '<p class="difference-text neutral">Same as seat share</p>';
      } else if (difference < 0) {
        differenceDisplay.innerHTML = `<p class="difference-text below">${Math.abs(difference)}% below seat share</p>`;
      } else {
        differenceDisplay.innerHTML = `<p class="difference-text above">${difference}% above seat share</p>`;
      }
    }

    // Update visual indicator (red line when below seat share)
    const indicator = document.getElementById("voteDifferenceIndicator");
    if (indicator) {
      if (percentage < seatSharePercent) {
        // Show red line from vote position to seat position
        const diff = seatSharePercent - percentage;
        indicator.style.display = "block";
        indicator.style.left = `${percentage}%`;
        indicator.style.width = `${diff}%`;
        indicator.style.backgroundColor = "#d4351c";
        indicator.classList.add("animate");
      } else if (percentage > seatSharePercent) {
        // Show green line from seat position to vote position
        const diff = percentage - seatSharePercent;
        indicator.style.display = "block";
        indicator.style.left = `${seatSharePercent}%`;
        indicator.style.width = `${diff}%`;
        indicator.style.backgroundColor = "#00703c";
        indicator.classList.add("animate");
      } else {
        indicator.style.display = "none";
        indicator.classList.remove("animate");
      }
    }
  }

  submitGuess() {
    const slider = document.getElementById("voteSlider");
    const submitButton = document.querySelector(".btn-submit");
    const guess = parseInt(slider.value);
    const election = electionData[this.currentIndex];
    const actual = Math.round(election.actualVoteShare * 10) / 10; // Round to 1 decimal

    this.userGuesses[this.currentIndex] = guess;

    // Calculate score: 10 points if within 2%, 5 if within 5%, 0 otherwise
    const difference = Math.abs(guess - actual);
    let score = 0;
    if (difference <= 2) {
      score = 10;
    } else if (difference <= 5) {
      score = 5;
    } else {
      score = 0;
    }

    this.scores[this.currentIndex] = score;

    // Disable submit button and slider
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Revealing...";
    }
    if (slider) {
      slider.disabled = true;
      slider.style.cursor = "not-allowed";
    }

    // Add actual vote share marker with animation
    this.showActualVoteShareMarker(actual, () => {
      // Show results inline after marker appears
      this.showInlineResults(guess, actual, difference, score);

      // Re-enable button for next election
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Next Election →";
        submitButton.onclick = () => this.nextElection();
      }
    });
  }

  showActualVoteShareMarker(actualValue, callback) {
    const sliderTrack = document.querySelector(".slider-track");
    if (!sliderTrack) {
      callback();
      return;
    }

    // Remove existing actual marker if present
    const existingMarker = document.getElementById("actualVoteShareMarker");
    if (existingMarker) {
      existingMarker.remove();
    }

    // Create new marker for actual vote share
    const marker = document.createElement("div");
    marker.id = "actualVoteShareMarker";
    marker.className = "actual-vote-share-marker";
    marker.style.left = `${actualValue}%`;
    marker.style.opacity = "0";
    marker.style.transform = "translateX(-50%) scale(0.8)";

    sliderTrack.appendChild(marker);

    // Animate marker appearance
    setTimeout(() => {
      marker.style.transition = "opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)";
      marker.style.opacity = "1";
      marker.style.transform = "translateX(-50%) scale(1)";

      setTimeout(callback, 600);
    }, 50);
  }

  showInlineResults(userGuess, actual, difference, score) {
    const challengeCard = document.querySelector(".challenge-card");
    if (!challengeCard) return;

    let feedbackClass = "correct";
    let feedbackTitle = "✅ Excellent guess!";
    let feedbackMessage = `You were within 2 percentage points - that's really close!`;

    if (difference > 2 && difference <= 5) {
      feedbackClass = "correct";
      feedbackTitle = "✅ Pretty close!";
      feedbackMessage = `You were ${difference.toFixed(1)} percentage points off. That's a good guess!`;
    } else if (difference > 5) {
      feedbackClass = "incorrect";
      feedbackTitle = "Not quite";
      feedbackMessage = `The actual vote share was ${difference.toFixed(1)} percentage points different. FPTP can be unpredictable!`;
    }

    // Create results section and insert it after the question section
    const questionSection = challengeCard.querySelector(".question-section");
    if (questionSection) {
      // Remove any existing results
      const existingResults = challengeCard.querySelector(".inline-results");
      if (existingResults) {
        existingResults.remove();
      }

      const resultsHtml = `
        <div class="inline-results">
          <div class="result-feedback ${feedbackClass}">
            <h4>${feedbackTitle}</h4>
            <div class="guess-vs-actual">
              <div class="comparison-item">
                <h5>Your Guess</h5>
                <p class="comparison-value guess-value">${userGuess}%</p>
              </div>
              <div class="comparison-item">
                <h5>Actual Vote Share</h5>
                <p class="comparison-value actual-value">${actual}%</p>
              </div>
            </div>
            <p>${feedbackMessage}</p>
          </div>
        </div>
      `;

      questionSection.insertAdjacentHTML("afterend", resultsHtml);

      // Scroll results into view smoothly only if needed
      setTimeout(() => {
        const resultsElement = challengeCard.querySelector(".inline-results");
        if (resultsElement) {
          const rect = resultsElement.getBoundingClientRect();
          const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
          if (!isVisible) {
            resultsElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        }
      }, 100);
    }
  }

  renderFeedback() {
    const election = electionData[this.currentIndex];
    const userGuess = this.userGuesses[this.currentIndex];
    const actual = election.actualVoteShare;
    const difference = Math.abs(userGuess - actual);

    let feedbackClass = "correct";
    let feedbackTitle = "✅ Excellent guess!";
    let feedbackMessage = `You were within 2 percentage points - that's really close!`;

    if (difference > 2 && difference <= 5) {
      feedbackClass = "correct";
      feedbackTitle = "✅ Pretty close!";
      feedbackMessage = `You were ${difference.toFixed(1)} percentage points off. That's a good guess!`;
    } else if (difference > 5) {
      feedbackClass = "incorrect";
      feedbackTitle = "Not quite";
      feedbackMessage = `The actual vote share was ${difference.toFixed(1)} percentage points different. FPTP can be unpredictable!`;
    }

    const challengeStage = document.getElementById("challenge-stage");
    const feedbackHtml = `
      <div class="challenge-card">
        <div class="challenge-header">
          <h2>${election.year} - Feedback</h2>
        </div>

        <div class="election-result">
          <h3>${election.leader}</h3>
        </div>

        <div class="result-feedback ${feedbackClass}">
          <h4>${feedbackTitle}</h4>
          <div class="guess-vs-actual">
            <div class="comparison-item">
              <h5>Your Guess</h5>
              <p class="comparison-value guess-value">${userGuess}%</p>
            </div>
            <div class="comparison-item">
              <h5>Actual Vote Share</h5>
              <p class="comparison-value actual-value">${actual}%</p>
            </div>
          </div>
          <p>${feedbackMessage}</p>
        </div>

        <div class="button-group">
          <button class="btn-next" onclick="game.nextElection()">
            Next Election →
          </button>
          <button class="btn-submit" style="background: #666;" onclick="game.goBack()">
            Go Back
          </button>
        </div>
      </div>
    `;

    challengeStage.innerHTML = feedbackHtml;
  }

  nextElection() {
    this.currentIndex++;
    if (this.currentIndex < electionData.length) {
      this.render();
    } else {
      this.render();
    }
  }

  goBack() {
    this.currentIndex = 0;
    this.gameStarted = false;
    this.scores = [];
    this.userGuesses = [];
    this.render();
  }

  renderResults() {
    const resultsStage = document.getElementById("results-stage");
    const challengeStage = document.getElementById("challenge-stage");

    // Hide challenge stage
    if (challengeStage) challengeStage.classList.add("hidden");
    if (resultsStage) resultsStage.classList.remove("hidden");

    const totalScore = this.scores.reduce((a, b) => a + b, 0);
    const maxScore = electionData.length * 10;
    const percentage = Math.round((totalScore / maxScore) * 100);
    const correctGuesses = this.scores.filter((s) => s === 10).length;

    const insightsHtml = this.generateInsights();

    resultsStage.innerHTML = `
      <div class="results-summary">
        <h2>Challenge Complete! 🎉</h2>

        <div class="score-display">
          <div class="score-label">Your Score</div>
          <p class="score-value">${percentage}%</p>
          <p class="score-fraction">${totalScore} out of ${maxScore} points</p>
        </div>

        <div class="performance-stats">
          <div class="stat-box">
            <div class="stat-label">Perfect Guesses</div>
            <div class="stat-value">${correctGuesses}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Elections Played</div>
            <div class="stat-value">${electionData.length}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Average Accuracy</div>
            <div class="stat-value">${this.calculateAverageAccuracy()}%</div>
          </div>
        </div>

        ${insightsHtml}

        <div class="button-group">
          <button class="btn-start-over" onclick="game.goBack()">
            Try Again
          </button>
          <a href="/" class="btn-next" style="text-decoration: none; text-align: center; line-height: 3.5;">
            Back to AMS+
          </a>
        </div>
      </div>
    `;
  }

  calculateAverageAccuracy() {
    const avgDiff =
      this.userGuesses.reduce((sum, guess, idx) => {
        return sum + Math.abs(guess - electionData[idx].actualVoteShare);
      }, 0) / electionData.length;

    if (avgDiff < 2) return "95";
    if (avgDiff < 3) return "90";
    if (avgDiff < 5) return "80";
    if (avgDiff < 8) return "60";
    return "40";
  }

  generateInsights() {
    const worstGuess = this.findWorstGuess();
    const bestGuess = this.findBestGuess();

    return `
      <div class="insight-box">
        <h4>📊 Your Challenge Insights</h4>
        <p>
          <strong>Best guess:</strong> ${bestGuess.year} (off by ${bestGuess.diff.toFixed(1)}%)
        </p>
        <p>
          <strong>Toughest guess:</strong> ${worstGuess.year} (off by ${worstGuess.diff.toFixed(1)}%)
        </p>
        <p>
          <strong>Key insight:</strong> FPTP creates unpredictable results. Small vote share changes create
          massive seat swings. This is why proportional representation provides
          more stable and fair outcomes.
        </p>
        <ul>
          <li>Vote shares vary from 33.7% (2024) to 59.2% (2010 coalition)</li>
          <li>One election had a negative majority (minority government)</li>
          <li>FPTP heavily amplifies small vote share differences into huge seat differences</li>
        </ul>
      </div>
    `;
  }

  findBestGuess() {
    let bestIdx = 0;
    let bestDiff = Math.abs(
      this.userGuesses[0] - electionData[0].actualVoteShare,
    );

    for (let i = 1; i < this.userGuesses.length; i++) {
      const diff = Math.abs(
        this.userGuesses[i] - electionData[i].actualVoteShare,
      );
      if (diff < bestDiff) {
        bestDiff = diff;
        bestIdx = i;
      }
    }

    return {
      year: electionData[bestIdx].year,
      diff: bestDiff,
    };
  }

  findWorstGuess() {
    let worstIdx = 0;
    let worstDiff = Math.abs(
      this.userGuesses[0] - electionData[0].actualVoteShare,
    );

    for (let i = 1; i < this.userGuesses.length; i++) {
      const diff = Math.abs(
        this.userGuesses[i] - electionData[i].actualVoteShare,
      );
      if (diff > worstDiff) {
        worstDiff = diff;
        worstIdx = i;
      }
    }

    return {
      year: electionData[worstIdx].year,
      diff: worstDiff,
    };
  }
}

// Initialize game when DOM is ready
let game;

document.addEventListener("DOMContentLoaded", () => {
  game = new FPTPChallenge();
});
