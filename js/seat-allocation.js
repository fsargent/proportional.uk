// Seat allocation logic for Proportional.uk
// This module handles the core seat allocation algorithms for Fair Share Voting
// 
// Fair Share Voting is a hybrid system that combines:
// 1. Closed list proportional representation (voters choose parties)
// 2. 5% threshold for seat qualification
// 3. Vote transfer system for below-threshold parties
// 4. Proportional allocation of remaining seats
//
// This is NOT pure closed list PR - it includes the transfer system to ensure
// maximum representation with no wasted votes.

// Create logger for this module
const seatAllocationLogger = typeof Logger !== 'undefined' ? new Logger('SeatAllocation') : null;

/**
 * Allocate seats using simple highest-averages method
 * @param {Object} votesByParty - Object with party keys and vote counts
 * @param {number} totalSeats - Total seats to allocate
 * @returns {Object} Object with party keys and seat counts
 */
function allocateSeatsFairShare(votesByParty, totalSeats = 650) {
  // Highest-averages seat allocation
  const quotients = [];
  Object.keys(votesByParty).forEach((party) => {
    const v = votesByParty[party];
    if (v > 0) {
      for (let d = 1; d <= totalSeats; d++) {
        quotients.push({ party, q: v / d });
      }
    }
  });

  quotients.sort((a, b) => b.q - a.q);
  const seats = {};
  Object.keys(votesByParty).forEach((p) => (seats[p] = 0));

  for (let i = 0; i < totalSeats; i++) {
    seats[quotients[i].party]++;
  }

  return seats;
}

/**
 * Allocate seats with transfers and detailed steps using the correct Fair Share Voting algorithm
 * @param {Object} votesByParty - Object with party keys and vote counts
 * @param {number} totalSeats - Total seats to allocate
 * @param {Object} prefs - Transfer preferences for each party
 * @param {number} threshold - Vote threshold for seats (default 5%)
 * @returns {Object} Object with seats, steps, and detailed round data
 */
function allocateSeatsFairShareTransfersWithSteps(
  votesByParty,
  totalSeats = 650,
  prefs = {},
  threshold = 0.05,
) {
  // Deep copy votes
  const parties = {};
  let grandTotal = 0;
  Object.keys(votesByParty).forEach((k) => {
    const v = Math.max(0, votesByParty[k] || 0);
    parties[k] = {
      key: k,
      votes: v,
      seats: 0,
      unspent: 0,
      finalized: false,
      originalVotes: v,
    };
    grandTotal += v;
  });

  const thresholdVotes = threshold > 0 ? grandTotal * threshold : 0;
  const steps = [];
  const rounds = [];
  let roundNumber = 0;

  function fmt(n) {
    return Math.round(n).toLocaleString();
  }

  function seatsFilled() {
    return Object.values(parties).reduce((a, p) => a + p.seats, 0);
  }

  function totalUnspent() {
    return Object.values(parties).reduce(
      (a, p) => a + (p.finalized ? 0 : p.unspent),
      0,
    );
  }

  function remainingSeats() {
    return totalSeats - seatsFilled();
  }

  function logRound(roundNum, description) {
    steps.push(`🔄 Round ${roundNum}: ${description}`);
  }

  function logSeatCost(cost) {
    steps.push(`Seat cost: ${fmt(cost)} votes per seat`);
  }

  function logSeatsAwarded() {
    const seatList = Object.values(parties)
      .filter((p) => !p.finalized)
      .map(
        (p) =>
          `${PARTY_META[p.key]?.name || p.key}: ${p.seats} seats, ${fmt(p.unspent)} unspent`,
      )
      .join(", ");
    steps.push(`Seats awarded: ${seatList}`);
  }

  function logRemaining(seats, unspent) {
    steps.push(
      `${seats} of ${totalSeats} seats filled, ${remainingSeats()} seats remaining`,
    );
  }

  function captureRoundState(roundType, description) {
    const roundData = {
      number: roundNumber,
      type: roundType,
      description: description,
      parties: {},
      transfers: [],
      seatCost: 0,
      seatsAllocated: 0,
      seatsRemaining: remainingSeats(),
      totalSeats: seatsFilled(),
    };

    // Capture party states
    Object.values(parties).forEach((p) => {
      roundData.parties[p.key] = {
        name: PARTY_META[p.key]?.name || p.key,
        votes: p.votes,
        seats: p.seats,
        unspent: p.unspent,
        finalized: p.finalized,
        currentVotes: p.finalized ? 0 : p.unspent,
      };
    });

    return roundData;
  }

  // === ROUND 1: Initial Allocation ===
  roundNumber = 1;
  logRound(roundNumber, "Initial Allocation");
  steps.push(`Total votes: ${fmt(grandTotal)} (realistic UK turnout)`);

  const initialCost = Math.round(grandTotal / totalSeats);
  logSeatCost(initialCost);

  const thresholdSeats = Math.ceil(thresholdVotes / initialCost);
  steps.push(
    `Threshold: ${(threshold * 100).toFixed(0)}% = minimum ${thresholdSeats} seats to qualify`,
  );

  // Initial seat allocation
  Object.values(parties).forEach((p) => {
    p.seats = Math.floor(p.votes / initialCost);
    p.unspent = p.votes - p.seats * initialCost;
  });

  // Capture initial round state
  const initialRound = captureRoundState("initial", "Initial Allocation");
  initialRound.seatCost = initialCost;
  initialRound.thresholdVotes = thresholdVotes;
  initialRound.thresholdSeats = thresholdSeats;
  initialRound.totalVotes = grandTotal;

  logSeatsAwarded();
  logRemaining(seatsFilled(), totalUnspent());

  // Apply threshold: parties below threshold cannot keep seats
  const belowThreshold = Object.values(parties).filter(
    (p) => p.votes < thresholdVotes,
  );
  if (belowThreshold.length > 0) {
    steps.push(
      `Parties below threshold: ${belowThreshold.map((p) => PARTY_META[p.key]?.name || p.key).join(", ")}`,
    );

    belowThreshold.forEach((p) => {
      // Remove any seats awarded by rounding, then treat all their votes as unspent for transfer
      if (p.seats > 0) {
        p.unspent += p.seats * initialCost;
        p.seats = 0;
      }
      const target = (prefs[p.key] || []).find(
        (pk) => parties[pk] && !parties[pk].finalized,
      );
      if (target) {
        parties[target].unspent += p.votes;
        steps.push(
          `${PARTY_META[p.key]?.name || p.key} below threshold transfers ${fmt(p.votes)} votes to ${PARTY_META[target]?.name || target}`,
        );

        // Record transfer
        initialRound.transfers.push({
          from: p.key,
          fromName: PARTY_META[p.key]?.name || p.key,
          to: target,
          toName: PARTY_META[target]?.name || target,
          votes: p.votes,
          reason: "below_threshold",
        });
      }
      p.unspent = 0;
      p.finalized = true;
    });
  }

  rounds.push(initialRound);

  // === MAIN ROUNDS ===
  while (seatsFilled() < totalSeats && roundNumber < 100) {
    roundNumber++;

    // Start capturing round data
    const roundData = captureRoundState("allocation", `Round ${roundNumber}`);

    // Calculate current seat cost
    const currentCost = Math.round(totalUnspent() / remainingSeats());
    if (currentCost <= 0) break;

    roundData.seatCost = currentCost;

    logRound(
      roundNumber,
      `Seat cost recalculated: ${fmt(currentCost)} votes/seat`,
    );

    // Try to award seats from current unspent votes
    let seatsAwardedThisRound = 0;
    const seatAwards = [];

    Object.values(parties)
      .filter((p) => !p.finalized)
      .forEach((p) => {
        const extraSeats = Math.floor(p.unspent / currentCost);
        if (extraSeats > 0) {
          const take = Math.min(
            extraSeats,
            remainingSeats() - seatsAwardedThisRound,
          );
          p.seats += take;
          p.unspent -= take * currentCost;
          seatsAwardedThisRound += take;
          if (take > 0) {
            steps.push(
              `${PARTY_META[p.key]?.name || p.key} gains ${take} seat(s) (${fmt(p.unspent + take * currentCost)} ÷ ${fmt(currentCost)} = ${take})`,
            );
            seatAwards.push({
              party: p.key,
              partyName: PARTY_META[p.key]?.name || p.key,
              seats: take,
            });
          }
        }
      });

    roundData.seatsAllocated = seatsAwardedThisRound;
    roundData.seatAwards = seatAwards;

    if (seatsFilled() >= totalSeats) {
      rounds.push(roundData);
      break;
    }

    // Always finalize the party with fewest seats (tie-break by votes) if seats remain
    if (remainingSeats() > 0) {
      const candidatesToFinalize = Object.values(parties).filter(
        (p) => !p.finalized,
      );
      if (candidatesToFinalize.length === 0) {
        rounds.push(roundData);
        break;
      }

      // Sort by seats (ascending), then by votes (ascending)
      candidatesToFinalize.sort(
        (a, b) => a.seats - b.seats || a.votes - b.votes,
      );
      const loser = candidatesToFinalize[0];

      const target = (prefs[loser.key] || []).find(
        (pk) => parties[pk] && !parties[pk].finalized,
      );
      const targetName = target
        ? PARTY_META[target]?.name || target
        : "no target";
      steps.push(
        `${PARTY_META[loser.key]?.name || loser.key} finalized (fewest seats: ${loser.seats}), transfers ${fmt(loser.unspent)} votes to ${targetName}`,
      );

      // Transfer unspent votes
      if (loser.unspent > 0 && target) {
        parties[target].unspent += loser.unspent;

        // Record transfer
        roundData.transfers.push({
          from: loser.key,
          fromName: PARTY_META[loser.key]?.name || loser.key,
          to: target,
          toName: PARTY_META[target]?.name || target,
          votes: loser.unspent,
          reason: "finalized",
        });
      }
      loser.unspent = 0;
      loser.finalized = true;
    }

    // Log current state
    logSeatsAwarded();
    logRemaining(seatsFilled(), totalUnspent());

    // Update round data with final state
    roundData.parties = {};
    Object.values(parties).forEach((p) => {
      roundData.parties[p.key] = {
        name: PARTY_META[p.key]?.name || p.key,
        votes: p.votes,
        seats: p.seats,
        unspent: p.unspent,
        finalized: p.finalized,
        currentVotes: p.finalized ? 0 : p.unspent,
      };
    });

    rounds.push(roundData);
  }

  // Final summary
  steps.push(`\n🏆 Final Result: All ${totalSeats} seats allocated`);
  const finalSeats = Object.values(parties)
    .filter((p) => p.seats > 0)
    .map((p) => `${PARTY_META[p.key]?.name || p.key}: ${p.seats} seats`)
    .join(", ");
  steps.push(`Final seat distribution: ${finalSeats}`);

  const result = {};
  Object.keys(parties).forEach((k) => {
    result[k] = parties[k].seats;
  });

  // Create comprehensive output object
  const output = {
    seats: result,
    steps: steps,
    rounds: rounds,
    summary: {
      totalVotes: grandTotal,
      totalSeats: totalSeats,
      threshold: threshold,
      thresholdVotes: thresholdVotes,
      initialCostPerSeat: initialCost,
      finalParties: Object.values(parties)
        .map((p) => ({
          key: p.key,
          name: PARTY_META[p.key]?.name || p.key,
          originalVotes: p.originalVotes,
          finalSeats: p.seats,
          votesPerSeat: p.seats > 0 ? Math.round(p.originalVotes / p.seats) : 0,
        }))
        .sort((a, b) => b.finalSeats - a.finalSeats),
    },
  };

  // Log the structured output for debugging
  if (seatAllocationLogger) {
    seatAllocationLogger.debug("Fair Share Voting Allocation Results", output);
    seatAllocationLogger.trace("Detailed round data", output.rounds);
  }

  return output;
}

/**
 * Simulate elections across multiple districts
 * @param {number} numDistricts - Number of districts to simulate
 * @param {number} votersPerDistrict - Voters per district
 * @returns {Object} Object with total votes and FPTP seats
 */
function simulateElections(numDistricts, votersPerDistrict) {
  const totalVotes = {};
  const fptpSeats = {};

  const candidates = [
    { key: "reform-uk", name: "Reform UK", color: "#12B6CF" },
    { key: "conservative", name: "Conservative", color: "#0087DC" },
    { key: "liberal-democrats", name: "Liberal Democrats", color: "#FAA61A" },
    { key: "labour", name: "Labour", color: "#E4003B" },
    { key: "green", name: "Green", color: "#6AB023" },
  ];

  candidates.forEach((c) => {
    totalVotes[c.key] = 0;
    fptpSeats[c.key] = 0;
  });

  for (let d = 0; d < numDistricts; d++) {
    const shares = generateDistrictShares();
    const votes = sampleVotesFromShares(shares, votersPerDistrict);

    // Aggregate national votes
    candidates.forEach((c) => {
      totalVotes[c.key] += votes[c.key];
    });

    // FPTP seat winner
    let winner = candidates[0].key;
    let max = -1;
    candidates.forEach((c) => {
      if (votes[c.key] > max) {
        max = votes[c.key];
        winner = c.key;
      }
    });
    fptpSeats[winner]++;
  }

  return { totalVotes, fptpSeats };
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    allocateSeatsFairShare,
    allocateSeatsFairShareTransfersWithSteps,
    simulateElections,
  };
}
