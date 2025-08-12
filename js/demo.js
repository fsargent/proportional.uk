// Demo functionality for Proportional.uk
// This module handles the interactive demonstration and vote tuning

/**
 * Render the official results demonstration
 * @param {Object} customVotes - Custom vote totals (optional)
 * @param {Object} customPrefs - Custom transfer preferences (optional)
 */
function renderOfficial(customVotes, customPrefs) {
    const totalVotes = customVotes || OFFICIAL_VOTES;
    const prefs = customPrefs || DEFAULT_TRANSFER_PREFERENCES;

    const { seats: prSeats, steps } = allocateSeatsFairShareTransfersWithSteps(
        totalVotes, 
        CHART_CONFIG.totalSeats, 
        prefs, 
        CHART_CONFIG.threshold
    );

    // Render FPTP
    renderFPTPResults(prSeats);

    // Render PR
    renderPRResults(prSeats, steps, totalVotes, prefs);
}

/**
 * Render FPTP results
 * @param {Object} seatsByParty - Seat allocation by party
 */
function renderFPTPResults(seatsByParty) {
    const container = document.getElementById('official-fptp-chart');
    if (!container) return;
    
    container.innerHTML = '';
    const data = toChartData(OFFICIAL_FPTP_SEATS);
    createMobileParliamentChart(container, data);
}

/**
 * Render PR results
 * @param {Object} seatsByParty - Seat allocation by party
 * @param {Array} steps - Allocation steps
 * @param {Object} totalVotes - Total votes by party
 * @param {Object} prefs - Transfer preferences
 */
function renderPRResults(seatsByParty, steps, totalVotes, prefs) {
    const container = document.getElementById('official-pr-chart');
    const stepsDiv = document.getElementById('official-pr-steps');
    const tunerGrid = document.getElementById('vote-inputs');
    const applyBtn = document.getElementById('apply-custom-votes');
    const resetBtn = document.getElementById('reset-votes');
    const totalEl = document.getElementById('total-votes-value');
    
    if (!container) return;
    
    container.innerHTML = '';
    const data = toChartData(seatsByParty);
    createMobileParliamentChart(container, data);
    
    if (tunerGrid) {
        renderVoteTuner(tunerGrid, totalVotes, prefs, totalEl);
    }
    
    if (applyBtn) {
        applyBtn.onclick = () => applyCustomVotes(tunerGrid, prefs);
    }
    
    if (resetBtn) {
        resetBtn.onclick = () => resetToDefault();
    }
    
    if (stepsDiv) {
        renderAllocationSteps(stepsDiv, steps);
    }
}

/**
 * Render the vote tuner interface
 * @param {HTMLElement} tunerGrid - The table body element
 * @param {Object} totalVotes - Total votes by party
 * @param {Object} prefs - Transfer preferences
 * @param {HTMLElement} totalEl - Total votes display element
 */
function renderVoteTuner(tunerGrid, totalVotes, prefs, totalEl) {
    tunerGrid.innerHTML = ''; // Clear existing rows
    const parties = Object.keys(totalVotes);
    const total = parties.reduce((a, k) => a + totalVotes[k], 0);
    
    const makeRow = (k) => {
        const meta = PARTY_META[k] || { name: k };
        const tr = document.createElement('tr');
        const tdName = document.createElement('td');
        tdName.textContent = meta.name;
        
        // Add party color styling
        if (meta.color) {
            tdName.style.color = meta.color;
            tdName.style.fontWeight = 'bold';
        }
        
        const tdVotes = document.createElement('td');
        const tdPercent = document.createElement('td');
        const tdTransfers = document.createElement('td');

        const controls = document.createElement('div');
        controls.className = 'vote-input-cell';
        const slider = document.createElement('input');
        slider.type = 'range'; 
        slider.min = '0'; 
        slider.max = String(total); 
        slider.step = '1000';
        slider.value = Math.round(totalVotes[k]); 
        slider.dataset.key = k;
        slider.className = 'vote-slider';
        
        const number = document.createElement('input');
        number.type = 'text'; 
        number.value = Math.round(totalVotes[k]).toLocaleString(); 
        number.dataset.key = k;
        number.className = 'vote-number-input';
        
        controls.appendChild(slider); 
        controls.appendChild(number);

        const select = document.createElement('select'); 
        select.dataset.key = k;
        select.className = 'transfer-pref-select';
        const prefList = (prefs[k] || []);
        
        const optNone = document.createElement('option'); 
        optNone.value = ''; 
        optNone.textContent = '—'; 
        select.appendChild(optNone);
        
        Object.keys(PARTY_META).forEach(pk => { 
            if (pk !== k) { 
                const opt = document.createElement('option'); 
                opt.value = pk; 
                opt.textContent = PARTY_META[pk].name || pk; 
                if (prefList[0] === pk) opt.selected = true; 
                select.appendChild(opt); 
            } 
        });

        tdVotes.appendChild(controls);
        tdPercent.appendChild(document.createTextNode(''));
        tdTransfers.appendChild(select);
        
        tr.appendChild(tdName); 
        tr.appendChild(tdVotes); 
        tr.appendChild(tdPercent); 
        tr.appendChild(tdTransfers);
        tunerGrid.appendChild(tr);

        const sync = val => { 
            slider.value = String(val); 
            number.value = val.toLocaleString(); 
            updateTotal(); 
        };
        
        slider.oninput = () => sync(parseClean(slider.value));
        number.oninput = () => sync(parseClean(number.value));
    };
    
    parties.forEach(makeRow);
    updateTotal();
}

/**
 * Update the total votes display and percentages
 */
function updateTotal() {
    const tunerGrid = document.getElementById('vote-inputs');
    const totalEl = document.getElementById('total-votes-value');
    if (!tunerGrid || !totalEl) return;
    
    const inputs = tunerGrid.querySelectorAll('input[type="text"][data-key]');
    let sum = 0; 
    inputs.forEach(i => sum += parseInt(i.value.replace(/[^0-9]/g, '') || '0', 10));
    
    if (totalEl) totalEl.textContent = `Total Votes: ${sum.toLocaleString()}`;
    
    // Update percentages
    inputs.forEach(i => {
        const val = parseInt(i.value.replace(/[^0-9]/g, '') || '0', 10);
        const percent = sum > 0 ? (val / sum * 100) : 0;
        const percentCell = i.closest('tr').querySelector('td:nth-child(3)');
        if (percentCell) percentCell.textContent = percent.toFixed(1) + '%';
    });
}

/**
 * Apply custom vote changes
 * @param {HTMLElement} tunerGrid - The vote tuner grid
 * @param {Object} prefs - Current transfer preferences
 */
function applyCustomVotes(tunerGrid, prefs) {
    const inputs = tunerGrid.querySelectorAll('input[type="text"][data-key]');
    const updatedVotes = {};
    
    inputs.forEach(i => { 
        updatedVotes[i.dataset.key] = Math.max(0, parseInt(i.value.replace(/[^0-9]/g, '') || '0', 10)); 
    });
    
    // Update preferences from selects
    const selects = tunerGrid.querySelectorAll('select[data-key]');
    const updatedPrefs = {};
    selects.forEach(s => {
        const key = s.dataset.key;
        const pref = s.value ? [s.value] : [];
        updatedPrefs[key] = pref;
    });
    
    renderOfficial(updatedVotes, updatedPrefs);
}

/**
 * Reset to default values
 */
function resetToDefault() {
    renderOfficial(OFFICIAL_VOTES, DEFAULT_TRANSFER_PREFERENCES);
}

/**
 * Render allocation steps
 * @param {HTMLElement} stepsDiv - Container for steps
 * @param {Array} steps - Array of step descriptions
 */
function renderAllocationSteps(stepsDiv, steps) {
    stepsDiv.innerHTML = '';
    steps.forEach((s, idx) => {
        const p = document.createElement('div');
        p.className = 'step';
        p.textContent = `${idx + 1}. ${s}`;
        stepsDiv.appendChild(p);
    });
}

/**
 * Toggle demo section visibility
 * @param {string} contentId - ID of the content to toggle
 */
function toggleSection(contentId) {
    const content = document.getElementById(contentId);
    if (!content) return;
    
    const header = content.previousElementSibling;
    const toggle = header.querySelector('.collapse-toggle');
    
    if (content.classList.contains('collapsed')) {
        content.classList.remove('collapsed');
        toggle.textContent = '−';
    } else {
        content.classList.add('collapsed');
        toggle.textContent = '+';
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        renderOfficial,
        renderFPTPResults,
        renderPRResults,
        renderVoteTuner,
        updateTotal,
        applyCustomVotes,
        resetToDefault,
        renderAllocationSteps,
        toggleSection
    };
}
