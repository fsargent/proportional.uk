// Utility functions for Proportional.uk
// This module contains helper functions used across the application

/**
 * Clamp a value between 0 and 1
 * @param {number} x - The value to clamp
 * @returns {number} The clamped value
 */
function clamp01(x) { 
    return Math.max(0, Math.min(1, x)); 
}

/**
 * Generate a normally distributed random number
 * @param {number} mean - The mean of the distribution
 * @param {number} std - The standard deviation
 * @returns {number} A normally distributed random number
 */
function normalRandom(mean = 0, std = 1) {
    // Box-Muller transform
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return mean + z * std;
}

/**
 * Generate district vote shares with variance
 * @param {number} variance - The variance to add to national shares
 * @returns {Object} Object with party keys and vote shares
 */
function generateDistrictShares(variance = 0.06) {
    // Start from national shares and add noise, then renormalize
    const raw = {};
    let sum = 0;
    
    // Use the candidates from config
    const candidates = [
        { key: 'reform-uk', name: 'Reform UK', color: '#12B6CF' },
        { key: 'conservative', name: 'Conservative', color: '#0087DC' },
        { key: 'liberal-democrats', name: 'Liberal Democrats', color: '#FAA61A' },
        { key: 'labour', name: 'Labour', color: '#E4003B' },
        { key: 'green', name: 'Green', color: '#6AB023' }
    ];
    
    const nationalShares = {
        'labour': 0.40,
        'conservative': 0.25,
        'reform-uk': 0.15,
        'liberal-democrats': 0.12,
        'green': 0.08
    };
    
    candidates.forEach(c => {
        const base = nationalShares[c.key] || 0;
        const noisy = clamp01(base + normalRandom(0, variance));
        raw[c.key] = noisy;
        sum += noisy;
    });
    
    // Normalize
    const shares = {};
    candidates.forEach(c => { 
        shares[c.key] = sum > 0 ? raw[c.key] / sum : (1 / candidates.length); 
    });
    return shares;
}

/**
 * Sample votes from vote shares
 * @param {Object} shares - Object with party keys and vote shares
 * @param {number} voters - Total number of voters
 * @returns {Object} Object with party keys and vote counts
 */
function sampleVotesFromShares(shares, voters) {
    const votes = {};
    const candidates = [
        { key: 'reform-uk', name: 'Reform UK', color: '#12B6CF' },
        { key: 'conservative', name: 'Conservative', color: '#0087DC' },
        { key: 'liberal-democrats', name: 'Liberal Democrats', color: '#FAA61A' },
        { key: 'labour', name: 'Labour', color: '#E4003B' },
        { key: 'green', name: 'Green', color: '#6AB023' }
    ];
    
    candidates.forEach(c => { votes[c.key] = 0; });
    
    // Simple deterministic rounding by shares (faster than multinomial sampling)
    let allocated = 0;
    candidates.forEach(c => {
        const count = Math.floor(shares[c.key] * voters);
        votes[c.key] += count;
        allocated += count;
    });
    
    // Distribute remainder to highest fractional shares
    const remainders = candidates.map(c => ({ 
        key: c.key, 
        frac: shares[c.key] * voters - Math.floor(shares[c.key] * voters) 
    }));
    remainders.sort((a, b) => b.frac - a.frac);
    
    for (let i = 0; i < voters - allocated; i++) {
        votes[remainders[i % remainders.length].key]++;
    }
    
    return votes;
}

/**
 * Scale seats to a target total
 * @param {Object} seatsByParty - Object with party keys and seat counts
 * @param {number} totalSeats - Target total seats
 * @returns {Object} Scaled seat counts
 */
function scaleSeatsTo650(seatsByParty, totalSeats) {
    if (totalSeats === 650) return seatsByParty;
    
    const scaled = {};
    let sum = 0;
    Object.keys(seatsByParty).forEach(k => { sum += seatsByParty[k]; });
    if (sum === 0) return seatsByParty;
    
    let allocated = 0;
    const entries = Object.keys(seatsByParty).map(k => ({ 
        key: k, 
        exact: (seatsByParty[k] * 650) / totalSeats 
    }));
    
    entries.forEach(e => { 
        scaled[e.key] = Math.floor(e.exact); 
        allocated += Math.floor(e.exact); 
    });
    
    // Assign remaining to largest fractional parts
    entries.sort((a, b) => (b.exact - Math.floor(b.exact)) - (a.exact - Math.floor(a.exact)));
    for (let i = 0; i < 650 - allocated; i++) {
        scaled[entries[i % entries.length].key]++;
    }
    
    return scaled;
}

/**
 * Format a number as a percentage
 * @param {number} n - The number to format (0-1)
 * @returns {string} Formatted percentage string
 */
function formatPercent(n) { 
    return (n * 100).toFixed(1) + '%'; 
}

/**
 * Parse a clean integer from a string
 * @param {string} s - The string to parse
 * @returns {number} The parsed integer
 */
function parseClean(s) {
    return parseInt(String(s).replace(/[^0-9]/g, '') || '0', 10);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        clamp01,
        normalRandom,
        generateDistrictShares,
        sampleVotesFromShares,
        scaleSeatsTo650,
        formatPercent,
        parseClean
    };
}
