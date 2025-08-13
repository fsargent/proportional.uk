// Main application module for Proportional.uk
// This module initializes the application and handles the main functionality

// Create logger for this module
const mainLogger = typeof Logger !== 'undefined' ? new Logger('Main') : null;

// Set log level based on URL parameter or default to INFO
if (typeof Logger !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const logLevel = urlParams.get('loglevel');
    
    if (logLevel) {
        const level = LOG_LEVELS[logLevel.toUpperCase()];
        if (level !== undefined) {
            Logger.setLogLevel(level);
            if (mainLogger) {
                mainLogger.info(`Log level set to ${logLevel.toUpperCase()}`);
            }
        }
    }
}

/**
 * Initialize the application
 */
function initApp() {
    // Render the initial official results
    renderOfficial();
    
    // Add any additional initialization here
    if (mainLogger) {
        mainLogger.info('Proportional.uk initialized successfully');
    }
}

/**
 * Run simulation with custom parameters
 */
function runSimulation() {
    const numDistricts = parseInt(document.getElementById('num-districts')?.value, 10) || 650;
    const votersPerDistrict = parseInt(document.getElementById('voters-per-district')?.value, 10) || 2000;
    
    const { totalVotes, fptpSeats } = simulateElections(numDistricts, votersPerDistrict);
    
    // Update national summary if element exists
    const summaryEl = document.getElementById('national-summary');
    if (summaryEl) {
        const total = Object.values(totalVotes).reduce((a, b) => a + b, 0);
        const candidates = [
            { key: 'reform-uk', name: 'Reform UK', color: '#12B6CF' },
            { key: 'conservative', name: 'Conservative', color: '#0087DC' },
            { key: 'liberal-democrats', name: 'Liberal Democrats', color: '#FAA61A' },
            { key: 'labour', name: 'Labour', color: '#E4003B' },
            { key: 'green', name: 'Green', color: '#6AB023' }
        ];
        const parts = candidates.map(c => `${c.name}: ${formatPercent((totalVotes[c.key] || 0) / total)}`).join(' · ');
        summaryEl.textContent = `Simulated national vote share — ${parts}`;
    }
    
    // Allocate seats using Fair Share
    const fairSeats = allocateSeatsFairShare(totalVotes, 650);
    const fptpScaled = scaleSeatsTo650(fptpSeats, numDistricts);
    
    // Render results if containers exist
    const fptpContainer = document.getElementById('fptp-chart');
    const fptpWinner = document.getElementById('fptp-winner');
    const prContainer = document.getElementById('pr-chart');
    const prWinner = document.getElementById('pr-winner');
    
    if (fptpContainer && fptpWinner) {
        renderParliament('fptp-chart', 'fptp-winner', fptpScaled);
    }
    
    if (prContainer && prWinner) {
        renderParliament('pr-chart', 'pr-winner', fairSeats);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initApp,
        runSimulation
    };
}
