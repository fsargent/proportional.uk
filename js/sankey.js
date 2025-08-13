// Sankey diagram functionality for vote transfer visualization
// Uses Google Charts Sankey diagram to show vote flows

// Create logger for this module
const sankeyLogger = typeof Logger !== 'undefined' ? new Logger('Sankey') : null;

/**
 * Create a Sankey diagram from structured round data
 * @param {Array} rounds - Round-by-round data from allocation
 * @param {Object} initialVotes - Initial vote counts
 * @param {Object} finalSeats - Final seat allocation
 * @param {string} containerId - ID of the container element
 */
function createSankeyFromRounds(rounds, initialVotes, finalSeats, containerId) {
  // Wait for Google Charts to load
  if (typeof google === "undefined" || !google.charts) {
    if (sankeyLogger) {
      sankeyLogger.debug("Google Charts not loaded yet, retrying...");
    }
    setTimeout(
      () =>
        createSankeyFromRounds(rounds, initialVotes, finalSeats, containerId),
      100,
    );
    return;
  }

  // Load the Sankey package
  google.charts.load("current", { packages: ["sankey"] });
  google.charts.setOnLoadCallback(() => {
    drawSankeyFromRounds(rounds, initialVotes, finalSeats, containerId);
  });
}

/**
 * Draw the Sankey diagram from round data
 * @param {Array} rounds - Round data
 * @param {Object} initialVotes - Initial votes
 * @param {Object} finalSeats - Final seats
 * @param {string} containerId - Container element ID
 */
function drawSankeyFromRounds(rounds, initialVotes, finalSeats, containerId) {
  const data = new google.visualization.DataTable();
  data.addColumn("string", "From");
  data.addColumn("string", "To");
  data.addColumn("number", "Votes");

  const flows = [];

  // Process each round
  rounds.forEach((round, roundIndex) => {
    const roundLabel = `Round ${round.number}`;

    if (roundIndex === 0) {
      // Initial round - show all parties with their starting votes
      Object.entries(round.parties).forEach(([key, party]) => {
        if (party.votes > 0) {
          flows.push([party.name, `${roundLabel}: ${party.name}`, party.votes]);
        }
      });
    }

    // Handle transfers in this round
    round.transfers.forEach((transfer) => {
      flows.push([
        `${roundLabel}: ${transfer.fromName}`,
        `${roundLabel}: ${transfer.toName}`,
        transfer.votes,
      ]);
    });

    // Flow to next round (for parties that didn't transfer)
    if (roundIndex < rounds.length - 1) {
      const nextRound = rounds[roundIndex + 1];
      const nextRoundLabel = `Round ${nextRound.number}`;

      Object.entries(round.parties).forEach(([key, party]) => {
        if (!party.finalized && party.currentVotes > 0) {
          // Check if this party transferred votes in this round
          const wasTransferSource = round.transfers.some((t) => t.from === key);
          if (!wasTransferSource) {
            flows.push([
              `${roundLabel}: ${party.name}`,
              `${nextRoundLabel}: ${party.name}`,
              party.currentVotes,
            ]);
          }
        }
      });
    }
  });

  // Final round to seats
  const lastRound = rounds[rounds.length - 1];
  const lastRoundLabel = `Round ${lastRound.number}`;

  Object.entries(lastRound.parties).forEach(([key, party]) => {
    if (party.seats > 0) {
      // For the final visualization, show votes flowing to seats
      const votesForSeats = party.originalVotes || party.votes;
      flows.push([
        `${lastRoundLabel}: ${party.name}`,
        `${party.name} (${party.seats} seats)`,
        votesForSeats,
      ]);
    }
  });

  // Convert flows to data rows
  data.addRows(flows);

  // Set chart options
  const options = {
    width: "100%",
    height: Math.min(800, 400 + rounds.length * 50), // Dynamic height based on rounds
    sankey: {
      node: {
        label: {
          fontSize: 11,
          bold: true,
          color: "#333",
        },
        width: 20,
        nodePadding: 30,
        interactivity: true,
        colors: generateNodeColorsFromRounds(rounds, initialVotes),
      },
      link: {
        colorMode: "gradient",
        color: {
          fillOpacity: 0.5,
        },
      },
      iterations: 64,
    },
    tooltip: {
      textStyle: {
        fontSize: 14,
      },
      showColorCode: true,
    },
  };

  // Instantiate and draw the chart
  const container = document.getElementById(containerId);
  if (container) {
    const chart = new google.visualization.Sankey(container);

    // Add custom formatting for tooltips
    const formatter = new google.visualization.NumberFormat({
      pattern: "#,###",
    });
    formatter.format(data, 2);

    chart.draw(data, options);
  }
}

/**
 * Generate node colors based on party colors
 * @param {Array} rounds - Round data
 * @param {Object} initialVotes - Initial votes
 * @returns {Array} Array of color strings
 */
function generateNodeColorsFromRounds(rounds, initialVotes) {
  const colors = [];
  const nodeNames = new Set();

  // Collect all unique node names
  // Initial party nodes
  Object.keys(initialVotes).forEach((key) => {
    const party = PARTY_META[key]?.name || key;
    nodeNames.add(party);
  });

  // Round nodes
  rounds.forEach((round) => {
    Object.entries(round.parties).forEach(([key, party]) => {
      nodeNames.add(`Round ${round.number}: ${party.name}`);
      if (party.seats > 0) {
        nodeNames.add(`${party.name} (${party.seats} seats)`);
      }
    });
  });

  // Convert to array and assign colors
  Array.from(nodeNames).forEach((nodeName) => {
    let color = "#999999"; // Default gray

    // Find the party name in the node name
    Object.entries(PARTY_META).forEach(([key, meta]) => {
      if (nodeName.includes(meta.name)) {
        color = meta.color || "#999999";

        // Slightly different shades for different node types
        if (nodeName.includes("Round")) {
          color = adjustColorBrightness(color, 0.9);
        } else if (nodeName.includes("seats)")) {
          color = adjustColorBrightness(color, 1.1);
        }
      }
    });

    colors.push(color);
  });

  return colors;
}

/**
 * Adjust color brightness
 * @param {string} hexColor - Hex color string
 * @param {number} factor - Brightness factor (< 1 = darker, > 1 = lighter)
 * @returns {string} Adjusted hex color
 */
function adjustColorBrightness(hexColor, factor) {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  const newR = Math.round(Math.min(255, r * factor));
  const newG = Math.round(Math.min(255, g * factor));
  const newB = Math.round(Math.min(255, b * factor));

  return (
    "#" +
    newR.toString(16).padStart(2, "0") +
    newG.toString(16).padStart(2, "0") +
    newB.toString(16).padStart(2, "0")
  );
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    createSankeyFromRounds,
  };
}
