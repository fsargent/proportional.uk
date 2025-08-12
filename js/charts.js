// Chart rendering for Proportional.uk
// This module handles the parliament visualization and other charts

/**
 * Create a mobile-friendly parliament chart
 * @param {HTMLElement} container - Container element for the chart
 * @param {Array} data - Array of party data with seats, color, and name
 * @param {Object} options - Optional chart options
 */
function createMobileParliamentChart(container, data, options = {}) {
    if (!data || data.length === 0) return;

    const totalSeats = data.reduce((sum, item) => sum + item.seats, 0);
    if (totalSeats === 0) return;

    const chartWrapper = document.createElement('div');
    chartWrapper.className = 'mobile-parliament-chart';
    container.appendChild(chartWrapper);
    
    const canvas = document.createElement('canvas');
    canvas.className = 'parliament-canvas';
    
    // Check if this is a compact chart
    const isCompact = container.classList.contains('compact') || options.compact;
    
    const containerWidth = chartWrapper.offsetWidth || container.offsetWidth || (isCompact ? 300 : 600);
    const padding = isCompact ? 16 : 32;
    const maxWidth = Math.min(containerWidth - padding, isCompact ? 300 : 600);
    const canvasWidth = Math.max(isCompact ? 200 : 320, maxWidth);
    
    let aspectRatio = 0.5;
    if (canvasWidth < 400) aspectRatio = 0.7; 
    else if (canvasWidth < 500) aspectRatio = 0.6;
    
    const canvasHeight = canvasWidth * aspectRatio;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    canvas.style.width = canvasWidth + 'px';
    canvas.style.height = canvasHeight + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    
    let seatRadius, rowHeight;
    if (isCompact) {
        // Smaller elements for compact charts
        if (canvasWidth < 250) { seatRadius = 2; rowHeight = 5; }
        else { seatRadius = 2.5; rowHeight = 6; }
    } else {
        // Standard sizing for regular charts
        if (canvasWidth < 350) { seatRadius = 2.5; rowHeight = 6; }
        else if (canvasWidth < 400) { seatRadius = 3; rowHeight = 7; }
        else if (canvasWidth < 500) { seatRadius = 4; rowHeight = 8; }
        else { seatRadius = 5; rowHeight = 10; }
    }

    const chartOptions = { sections: 1, sectionGap: 0, seatRadius, rowHeight };
    const totalSeatsInChart = data.reduce((sum, item) => sum + item.seats, 0);
    const seatPositions = calculateParliamentPoints(totalSeatsInChart, chartOptions, canvasWidth);
    const seatPositionsWithAngle = seatPositions.map((pos) => {
        const dx = pos.x - (canvasWidth / 2);
        const dy = (canvasHeight) - pos.y;
        const angle = Math.atan2(dy, dx);
        return { ...pos, angle };
    });
    seatPositionsWithAngle.sort((a, b) => b.angle - a.angle);
    
    const seatData = [];
    let seatIndex = 0;
    data.forEach(party => {
        for (let i = 0; i < party.seats; i++) {
            if (seatIndex < seatPositionsWithAngle.length) {
                seatData.push({ 
                    x: seatPositionsWithAngle[seatIndex].x, 
                    y: seatPositionsWithAngle[seatIndex].y, 
                    color: party.color, 
                    name: party.name, 
                    partySeats: party.seats 
                });
                seatIndex++;
            }
        }
    });
    
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    seatData.forEach(seat => {
        ctx.beginPath();
        ctx.arc(seat.x, seat.y, chartOptions.seatRadius, 0, 2 * Math.PI);
        ctx.fillStyle = seat.color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
    });
    
    chartWrapper.appendChild(canvas);
    
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * dpr;
        const y = (e.clientY - rect.top) * dpr;
        let hoveredSeat = null;
        seatData.forEach(seat => {
            const distance = Math.sqrt(Math.pow(x - seat.x * dpr, 2) + Math.pow(y - seat.y * dpr, 2));
            if (distance <= chartOptions.seatRadius * dpr) hoveredSeat = seat;
        });
        canvas.style.cursor = hoveredSeat ? 'pointer' : 'default';
        canvas.title = hoveredSeat ? `${hoveredSeat.name}: ${hoveredSeat.partySeats} seats` : '';
    });

    const legend = document.createElement('div');
    legend.className = 'parliament-legend';
    if (isCompact) {
        legend.className += ' compact';
    }
    
    data.forEach(party => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        const colorBox = document.createElement('div');
        colorBox.className = 'legend-color';
        colorBox.style.backgroundColor = party.color;
        const label = document.createElement('span');
        label.className = 'legend-label';
        label.textContent = `${party.name}: ${party.seats}`;
        legendItem.appendChild(colorBox);
        legendItem.appendChild(label);
        legend.appendChild(legendItem);
    });
    chartWrapper.appendChild(legend);
}

/**
 * Calculate parliament seat positions
 * @param {number} totalPoints - Total number of seats
 * @param {Object} options - Chart options
 * @param {number} graphicWidth - Width of the graphic
 * @returns {Array} Array of seat positions
 */
function calculateParliamentPoints(totalPoints, options, graphicWidth) {
    const graphicHeight = graphicWidth / 2;
    const { seatRadius, rowHeight, sectionGap } = options;
    const startRad = 0;
    const endRad = Math.PI;
    const padding = seatRadius * 2;
    const graphRadius = graphicHeight - padding;
    const points = [];
    let currentRow = 0;
    
    while (points.length < totalPoints) {
        const currentRowRadius = graphRadius - (rowHeight * currentRow);
        const currentRowGapRad = Math.atan((seatRadius + (sectionGap / 2)) / currentRowRadius);
        const currentRowStartRad = startRad + currentRowGapRad;
        const currentRowEndRad = endRad - currentRowGapRad;
        
        if (currentRowEndRad <= currentRowStartRad || currentRowRadius <= 0) break;
        
        const spacingFactor = totalPoints > 400 ? 2.0 : 2.5;
        const currRadStep = Math.atan((spacingFactor * seatRadius) / currentRowRadius);
        const rowSeats = Math.min(Math.floor((currentRowEndRad - currentRowStartRad) / currRadStep), totalPoints - points.length);
        const roundedRadStep = rowSeats > 0 ? (currentRowEndRad - currentRowStartRad) / rowSeats : 0;
        
        for (let currSeat = 0; currSeat < rowSeats; currSeat++) {
            const currentAngle = rowSeats > 0 ? 
                (currSeat * roundedRadStep + currentRowStartRad + roundedRadStep / 2) : 
                ((currentRowStartRad + currentRowEndRad) / 2);
            points.push({ 
                x: Math.cos(currentAngle) * currentRowRadius + graphicHeight, 
                y: graphicHeight - Math.sin(currentAngle) * currentRowRadius - seatRadius 
            });
        }
        currentRow++;
    }
    
    return points;
}

/**
 * Render parliament visualization
 * @param {string} containerId - ID of the container element
 * @param {string} winnerId - ID of the winner display element
 * @param {Object} seatsByParty - Object with party keys and seat counts
 */
function renderParliament(containerId, winnerId, seatsByParty) {
    const container = document.getElementById(containerId);
    const winnerDiv = document.getElementById(winnerId);
    if (!container || !winnerDiv) return;
    
    container.innerHTML = '';
    winnerDiv.innerHTML = '';

    const chartData = [];
    const seatDistribution = [];
    
    // Use PARTY_META from config
    Object.keys(seatsByParty).forEach(partyKey => {
        const seatCount = seatsByParty[partyKey] || 0;
        if (seatCount > 0) {
            const meta = PARTY_META[partyKey] || { name: partyKey, color: '#888888' };
            chartData.push({ seats: seatCount, color: meta.color, name: meta.name });
            seatDistribution.push(`${meta.name}: ${seatCount}`);
        }
    });
    
    if (chartData.length === 0) {
        winnerDiv.textContent = 'No seats allocated';
        return;
    }
    
    createMobileParliamentChart(container, chartData);
    winnerDiv.textContent = '🏆 Seat Allocation: ' + seatDistribution.join(', ');
}

/**
 * Convert seat data to chart format
 * @param {Object} seatsByParty - Object with party keys and seat counts
 * @returns {Array} Array formatted for chart rendering
 */
function toChartData(seatsByParty) {
    const entries = Object.keys(seatsByParty).map(k => ({ key: k, seats: seatsByParty[k] }))
        .filter(e => e.seats > 0)
        .sort((a, b) => b.seats - a.seats);
    
    return entries.map(e => ({
        seats: e.seats,
        color: (PARTY_META[e.key] && PARTY_META[e.key].color) || '#888888',
        name: (PARTY_META[e.key] && PARTY_META[e.key].name) || e.key
    }));
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createMobileParliamentChart,
        calculateParliamentPoints,
        renderParliament,
        toChartData
    };
}
