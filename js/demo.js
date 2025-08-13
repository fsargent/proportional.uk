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

  const allocationResult = allocateSeatsFairShareTransfersWithSteps(
    totalVotes,
    CHART_CONFIG.totalSeats,
    prefs,
    CHART_CONFIG.threshold,
  );

  // Extract what we need from the structured result
  const { seats: prSeats, steps, rounds, summary } = allocationResult;

  // Render FPTP
  renderFPTPResults(prSeats);

  // Render PR with all the data
  renderPRResults(prSeats, steps, totalVotes, prefs, rounds, summary);
}

/**
 * Render FPTP results
 * @param {Object} seatsByParty - Seat allocation by party
 */
function renderFPTPResults(seatsByParty) {
  const container = document.getElementById("official-fptp-chart");
  if (!container) return;

  container.innerHTML = "";
  const data = toChartData(OFFICIAL_FPTP_SEATS);
  createMobileParliamentChart(container, data);
}

/**
 * Render PR results
 * @param {Object} seatsByParty - Seat allocation by party
 * @param {Array} steps - Allocation steps
 * @param {Object} totalVotes - Total votes by party
 * @param {Object} prefs - Transfer preferences
 * @param {Array} rounds - Round-by-round data
 * @param {Object} summary - Summary statistics
 */
function renderPRResults(
  seatsByParty,
  steps,
  totalVotes,
  prefs,
  rounds,
  summary,
) {
  const container = document.getElementById("official-pr-chart");
  const stepsDiv = document.getElementById("official-pr-steps");
  const tunerGrid = document.getElementById("vote-inputs");
  const applyBtn = document.getElementById("apply-custom-votes");
  const resetBtn = document.getElementById("reset-votes");
  const totalEl = document.getElementById("total-votes-value");
  const sankeyContainer = document.getElementById("sankey-diagram");

  if (!container) return;

  container.innerHTML = "";
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

  if (stepsDiv && rounds) {
    renderAllocationSteps(stepsDiv, rounds);
  }

  // Create Sankey diagram if container exists using the structured round data
  if (sankeyContainer && rounds) {
    createSankeyFromRounds(rounds, totalVotes, seatsByParty, "sankey-diagram");
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
  tunerGrid.innerHTML = ""; // Clear existing rows
  const parties = Object.keys(totalVotes);
  const total = parties.reduce((a, k) => a + totalVotes[k], 0);

  const makeRow = (k) => {
    const meta = PARTY_META[k] || { name: k };
    const tr = document.createElement("tr");
    const tdName = document.createElement("td");
    tdName.textContent = meta.name;

    // Add party color styling
    if (meta.color) {
      tdName.style.color = meta.color;
      tdName.style.fontWeight = "bold";
    }

    const tdVotes = document.createElement("td");
    const tdPercent = document.createElement("td");
    const tdTransfers = document.createElement("td");

    const controls = document.createElement("div");
    controls.className = "vote-input-cell";
    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = "0";
    slider.max = String(total);
    slider.step = "1000";
    slider.value = Math.round(totalVotes[k]);
    slider.dataset.key = k;
    slider.className = "vote-slider";

    const number = document.createElement("input");
    number.type = "text";
    number.value = Math.round(totalVotes[k]).toLocaleString();
    number.dataset.key = k;
    number.className = "vote-number-input";

    controls.appendChild(slider);
    controls.appendChild(number);

    const select = document.createElement("select");
    select.dataset.key = k;
    select.className = "transfer-pref-select";
    const prefList = prefs[k] || [];

    const optNone = document.createElement("option");
    optNone.value = "";
    optNone.textContent = "—";
    select.appendChild(optNone);

    Object.keys(PARTY_META).forEach((pk) => {
      if (pk !== k) {
        const opt = document.createElement("option");
        opt.value = pk;
        opt.textContent = PARTY_META[pk].name || pk;
        if (prefList[0] === pk) opt.selected = true;
        select.appendChild(opt);
      }
    });

    tdVotes.appendChild(controls);
    tdPercent.appendChild(document.createTextNode(""));
    tdTransfers.appendChild(select);

    tr.appendChild(tdName);
    tr.appendChild(tdVotes);
    tr.appendChild(tdPercent);
    tr.appendChild(tdTransfers);
    tunerGrid.appendChild(tr);

    const sync = (val) => {
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
  const tunerGrid = document.getElementById("vote-inputs");
  const totalEl = document.getElementById("total-votes-value");
  if (!tunerGrid || !totalEl) return;

  const inputs = tunerGrid.querySelectorAll('input[type="text"][data-key]');
  let sum = 0;
  inputs.forEach(
    (i) => (sum += parseInt(i.value.replace(/[^0-9]/g, "") || "0", 10)),
  );

  if (totalEl) totalEl.textContent = `Total Votes: ${sum.toLocaleString()}`;

  // Update percentages
  inputs.forEach((i) => {
    const val = parseInt(i.value.replace(/[^0-9]/g, "") || "0", 10);
    const percent = sum > 0 ? (val / sum) * 100 : 0;
    const percentCell = i.closest("tr").querySelector("td:nth-child(3)");
    if (percentCell) percentCell.textContent = percent.toFixed(1) + "%";
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

  inputs.forEach((i) => {
    updatedVotes[i.dataset.key] = Math.max(
      0,
      parseInt(i.value.replace(/[^0-9]/g, "") || "0", 10),
    );
  });

  // Update preferences from selects
  const selects = tunerGrid.querySelectorAll("select[data-key]");
  const updatedPrefs = {};
  selects.forEach((s) => {
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
 * @param {Array} rounds - Array of round data from seat allocation
 */
function renderAllocationSteps(stepsDiv, rounds) {
  stepsDiv.innerHTML = "";

  if (!rounds || rounds.length === 0) {
    stepsDiv.innerHTML = "<p>No allocation data available</p>";
    return;
  }

  // Render each round
  rounds.forEach((round, index) => {
    const roundDiv = document.createElement("div");
    roundDiv.className = "allocation-round";
    
    // Round header
    const roundHeader = document.createElement("h4");
    roundHeader.className = "round-header";
    roundHeader.innerHTML = `<span class="round-icon">🔄</span> Round ${round.number}`;
    if (round.description) {
      const descSpan = document.createElement("span");
      descSpan.className = "round-description";
      descSpan.textContent = ` - ${round.description}`;
      roundHeader.appendChild(descSpan);
    }
    roundDiv.appendChild(roundHeader);
    
    // Show initial data for first round
    if (index === 0 && round.thresholdVotes) {
      const summaryDiv = document.createElement("div");
      summaryDiv.className = "round-summary";
      
      // Calculate total votes from parties if not directly available
      let totalVotes = round.totalVotes;
      if (!totalVotes && round.parties) {
        totalVotes = Object.values(round.parties).reduce((sum, party) => sum + party.votes, 0);
      }
      
      summaryDiv.innerHTML = `
        <p><strong>Total votes:</strong> ${totalVotes ? totalVotes.toLocaleString() : 'N/A'} (realistic UK turnout)</p>
        <p><strong>Cost per seat:</strong> ${round.seatCost.toLocaleString()} votes per seat</p>
        <p><strong>Threshold:</strong> ${totalVotes ? `${(round.thresholdVotes / totalVotes * 100).toFixed(0)}% = minimum ${round.thresholdSeats} seats to qualify` : 'N/A'}</p>
      `;
      roundDiv.appendChild(summaryDiv);
    }
    
    // Create allocation table from parties data
    if (round.parties && Object.keys(round.parties).length > 0) {
      const allocations = [];
      
      // For Round 1, show all parties
      if (round.number === 1) {
        Object.entries(round.parties).forEach(([key, party]) => {
          if (party.seats > 0 || party.votes > 0) {
            allocations.push({
              key: key,
              name: party.name,
              votesAvailable: party.votes,
              seatsGained: party.seats,
              unspent: party.unspent
            });
          }
        });
      } else {
        // For later rounds, show parties that gained seats
        if (round.seatAwards && round.seatAwards.length > 0) {
          round.seatAwards.forEach(award => {
            const party = round.parties[award.party];
            if (party) {
              allocations.push({
                key: award.party,
                name: party.name,
                votesAvailable: party.currentVotes + (award.seats * round.seatCost),
                seatsGained: award.seats,
                unspent: party.currentVotes
              });
            }
          });
        }
      }
      
      // Sort by votes (descending) for better display
      allocations.sort((a, b) => b.votesAvailable - a.votesAvailable);
      
      if (allocations.length > 0) {
        const table = createAllocationTable(allocations, round.seatCost, round.thresholdVotes, round.number);
        roundDiv.appendChild(table);
      }
    }
    
    // Parties below threshold (Round 1 only)
    if (round.number === 1 && round.belowThreshold) {
      const belowParties = [];
      Object.entries(round.parties).forEach(([key, party]) => {
        if (party.votes < round.thresholdVotes) {
          belowParties.push(party.name);
        }
      });
      
      if (belowParties.length > 0) {
        const belowDiv = document.createElement("div");
        belowDiv.className = "below-threshold-notice";
        belowDiv.innerHTML = `<span class="threshold-icon">⚠️</span> Parties below threshold: ${belowParties.join(", ")}`;
        roundDiv.appendChild(belowDiv);
      }
    }
    
    // Transfer steps
    if (round.transfers && round.transfers.length > 0) {
      const transfersDiv = document.createElement("div");
      transfersDiv.className = "transfers-container";
      
      round.transfers.forEach(transfer => {
        const transferDiv = document.createElement("div");
        transferDiv.className = "transfer-step";
        const targetName = transfer.to ? transfer.toName : "no target";
        transferDiv.innerHTML = `<span class="transfer-icon">→</span> ${transfer.fromName} ${transfer.reason === 'threshold' ? 'below threshold' : 'finalized'} transfers ${transfer.votes.toLocaleString()} votes to ${targetName}`;
        transfersDiv.appendChild(transferDiv);
      });
      
      roundDiv.appendChild(transfersDiv);
    }
    
    // Progress update
    if (round.seatsRemaining !== undefined) {
      const progressDiv = document.createElement("div");
      progressDiv.className = "progress-update";
      progressDiv.textContent = `${round.totalSeats} of 650 seats filled, ${round.seatsRemaining} seats remaining`;
      roundDiv.appendChild(progressDiv);
    }
    
    stepsDiv.appendChild(roundDiv);
  });
  
  // Final result
  const lastRound = rounds[rounds.length - 1];
  if (lastRound && lastRound.seatsRemaining === 0) {
    const finalDiv = document.createElement("div");
    finalDiv.className = "final-result-section";
    finalDiv.innerHTML = "<h4>🏆 Final Result</h4>";
    
    // Create final distribution from last round's parties
    const finalParties = [];
    Object.entries(lastRound.parties).forEach(([key, party]) => {
      if (party.seats > 0) {
        finalParties.push({
          name: party.name,
          seats: party.seats
        });
      }
    });
    
    // Sort by seats (descending)
    finalParties.sort((a, b) => b.seats - a.seats);
    
    const parties = finalParties
      .map(party => {
        return `<span class="final-party-seats">${party.name}: ${party.seats}</span>`;
        })
        .join("");
    finalDiv.innerHTML += `<div class="final-seats-grid">${parties}</div>`;
    
    stepsDiv.appendChild(finalDiv);
  }
}

// Helper function to create an allocation table
function createAllocationTable(allocations, costPerSeat, thresholdVotes, roundNumber) {
  const table = document.createElement("table");
  table.className = "allocation-table";
  
  // Create header
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  headerRow.innerHTML = `
    <th>Party</th>
    <th>Votes Available</th>
    <th>Cost per Seat</th>
    <th>Seats Gained</th>
    <th>Unused Votes</th>
  `;
  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  // Create body
  const tbody = document.createElement("tbody");
  
  allocations.forEach(party => {
    const row = document.createElement("tr");
    const partyMeta = PARTY_META[party.key] || { name: party.name, color: "#666" };
    
    // Check if party is below threshold (only matters in Round 1)
    const isBelowThreshold = roundNumber === 1 && thresholdVotes && party.votesAvailable < thresholdVotes;
    if (isBelowThreshold) {
      row.className = "below-threshold-row";
    }
    
    row.innerHTML = `
      <td class="party-name" style="color: ${partyMeta.color}; font-weight: bold;">
        ${partyMeta.name}
      </td>
      <td class="votes-available">${party.votesAvailable.toLocaleString()}</td>
      <td class="cost-per-seat">${costPerSeat.toLocaleString()}</td>
      <td class="seats-gained">${party.seatsGained}</td>
      <td class="unused-votes">${party.unspent.toLocaleString()}</td>
    `;
    
    tbody.appendChild(row);
  });
  
  table.appendChild(tbody);
  return table;
}



/**
 * Toggle demo section visibility
 * @param {string} contentId - ID of the content to toggle
 */
function toggleSection(contentId) {
  const content = document.getElementById(contentId);
  if (!content) return;

  const header = content.previousElementSibling;
  const toggle = header.querySelector(".collapse-toggle");

  if (content.classList.contains("collapsed")) {
    content.classList.remove("collapsed");
    toggle.textContent = "−";
  } else {
    content.classList.add("collapsed");
    toggle.textContent = "+";
  }
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    renderOfficial,
    renderFPTPResults,
    renderPRResults,
    renderVoteTuner,
    updateTotal,
    applyCustomVotes,
    resetToDefault,
    renderAllocationSteps,
    toggleSection,
  };
}
