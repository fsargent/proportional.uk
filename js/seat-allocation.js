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

/**
 * Allocate seats using simple highest-averages method
 * @param {Object} votesByParty - Object with party keys and vote counts
 * @param {number} totalSeats - Total seats to allocate
 * @returns {Object} Object with party keys and seat counts
 */
function allocateSeatsFairShare(votesByParty, totalSeats = 650) {
    // Highest-averages seat allocation
    const quotients = [];
    Object.keys(votesByParty).forEach(party => {
        const v = votesByParty[party];
        if (v > 0) {
            for (let d = 1; d <= totalSeats; d++) {
                quotients.push({ party, q: v / d });
            }
        }
    });
    
    quotients.sort((a, b) => b.q - a.q);
    const seats = {};
    Object.keys(votesByParty).forEach(p => seats[p] = 0);
    
    for (let i = 0; i < totalSeats; i++) {
        seats[quotients[i].party]++;
    }
    
    return seats;
}

/**
 * Allocate seats with transfers and detailed steps
 * @param {Object} votesByParty - Object with party keys and vote counts
 * @param {number} totalSeats - Total seats to allocate
 * @param {Object} prefs - Transfer preferences for each party
 * @param {number} threshold - Vote threshold for seats (default 5%)
 * @returns {Object} Object with seats and allocation steps
 */
function allocateSeatsFairShareTransfersWithSteps(votesByParty, totalSeats = 650, prefs = {}, threshold = 0.05) {
    // Deep copy votes
    const parties = {};
    let grandTotal = 0;
    Object.keys(votesByParty).forEach(k => {
        const v = Math.max(0, votesByParty[k] || 0);
        parties[k] = { key: k, votes: v, seats: 0, unspent: 0, finalized: false };
        grandTotal += v;
    });
    
    const thresholdVotes = threshold > 0 ? grandTotal * threshold : 0;
    const steps = [];
    
    function fmt(n) { 
        return Math.round(n).toLocaleString(); 
    }

    // Helper to compute seat cost for remaining pool
    function computeSeatCost() {
        const remainingSeats = totalSeats - Object.values(parties).reduce((a, p) => a + p.seats, 0);
        const totalUnspent = Object.values(parties).reduce((a, p) => a + (p.finalized ? 0 : p.unspent), 0);
        if (remainingSeats <= 0) return 0;
        return totalUnspent > 0 ? totalUnspent / remainingSeats : 0;
    }

    function seatsFilled() { 
        return Object.values(parties).reduce((a, p) => a + p.seats, 0); 
    }

    // Initial Hare-like allocation
    const initialCost = grandTotal / totalSeats;
    Object.values(parties).forEach(p => {
        p.seats = Math.floor(p.votes / initialCost);
        p.unspent = p.votes - p.seats * initialCost;
    });
    
    steps.push(`Initial seat cost: ${fmt(initialCost)} votes/seat.`);
    
    // Raw initial seats listing
    const initialList = Object.values(parties)
        .map(p => `${(PARTY_META[p.key]?.name) || p.key}: ${p.seats}`)
        .join(', ');
    steps.push(`Initial seats (raw, by floor(votes ÷ cost)): ${initialList}.`);
    
    // Count seats below threshold
    const below = Object.values(parties).filter(p => p.votes < thresholdVotes);
    const belowSeatCount = below.reduce((a, p) => a + p.seats, 0);
    if (below.length > 0) {
        const belowNames = below.map(p => (PARTY_META[p.key]?.name) || p.key).join(', ');
        steps.push(`Below threshold (${(threshold * 100).toFixed(0)}%): ${below.length} parties (${belowSeatCount} initial seat(s)) → their votes transfer by preference: ${belowNames}.`);
    }

    // Apply threshold: parties below threshold cannot keep seats; transfer all votes
    Object.values(parties)
        .filter(p => p.votes < thresholdVotes)
        .forEach(p => {
            // Remove any seats awarded by rounding, then treat all their votes as unspent for transfer
            if (p.seats > 0) {
                // Return their seat-equivalent to the unspent pool
                p.unspent += p.seats * initialCost;
                p.seats = 0;
            }
            const target = (prefs[p.key] || []).find(pk => parties[pk] && !parties[pk].finalized);
            if (target) {
                parties[target].unspent += p.votes; // transfer full votes
            }
            p.unspent = 0;
            p.finalized = true;
            steps.push(`${(PARTY_META[p.key]?.name) || p.key} below threshold transfers ${fmt(p.votes)} votes to ${(PARTY_META[(prefs[p.key] || [])[0]]?.name) || (prefs[p.key] || [])[0] || 'no target'}.`);
        });

    // Main loop
    let guard = 0;
    while (seatsFilled() < totalSeats && guard++ < 5000) {
        const cost = computeSeatCost();
        if (cost <= 0) break;

        // Try awarding seats from current unspent
        let awardedThisRound = 0;
        Object.values(parties)
            .filter(p => !p.finalized)
            .forEach(p => {
                const extra = Math.floor(p.unspent / cost);
                if (extra > 0) {
                    const take = Math.min(extra, totalSeats - seatsFilled() - awardedThisRound);
                    p.seats += take;
                    p.unspent -= take * cost;
                    awardedThisRound += take;
                    steps.push(`${(PARTY_META[p.key]?.name) || p.key} receives ${take} seat(s) at ~${cost.toFixed(0)} votes each from unspent votes.`);
                }
            });
        
        if (seatsFilled() >= totalSeats) break;

        // If no one could afford a seat, finalize the party with fewest seats, tie-break by votes
        if (awardedThisRound === 0) {
            const candidatesToFinalize = Object.values(parties).filter(p => !p.finalized);
            if (candidatesToFinalize.length === 0) break;
            
            candidatesToFinalize.sort((a, b) => (a.seats - b.seats) || (a.votes - b.votes));
            const loser = candidatesToFinalize[0];
            
            // Transfer only unspent votes
            if (loser.unspent > 0) {
                const target = (prefs[loser.key] || []).find(pk => parties[pk] && !parties[pk].finalized);
                if (target) {
                    parties[target].unspent += loser.unspent;
                    steps.push(`${(PARTY_META[loser.key]?.name) || loser.key} finalized; transfers ${Math.round(loser.unspent).toLocaleString()} unspent votes to ${(PARTY_META[target]?.name) || target}.`);
                }
            }
            loser.unspent = 0;
            loser.finalized = true;
            continue;
        }
    }

    const result = {};
    Object.keys(parties).forEach(k => { result[k] = parties[k].seats; });
    return { seats: result, steps };
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
        { key: 'reform-uk', name: 'Reform UK', color: '#12B6CF' },
        { key: 'conservative', name: 'Conservative', color: '#0087DC' },
        { key: 'liberal-democrats', name: 'Liberal Democrats', color: '#FAA61A' },
        { key: 'labour', name: 'Labour', color: '#E4003B' },
        { key: 'green', name: 'Green', color: '#6AB023' }
    ];
    
    candidates.forEach(c => { 
        totalVotes[c.key] = 0; 
        fptpSeats[c.key] = 0; 
    });

    for (let d = 0; d < numDistricts; d++) {
        const shares = generateDistrictShares();
        const votes = sampleVotesFromShares(shares, votersPerDistrict);
        
        // Aggregate national votes
        candidates.forEach(c => { totalVotes[c.key] += votes[c.key]; });
        
        // FPTP seat winner
        let winner = candidates[0].key;
        let max = -1;
        candidates.forEach(c => { 
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
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        allocateSeatsFairShare,
        allocateSeatsFairShareTransfersWithSteps,
        simulateElections
    };
}
