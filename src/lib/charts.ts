// Chart utilities for Proportional.uk
import { PARTY_META } from './config';

export interface SeatPosition {
	x: number;
	y: number;
	angle?: number;
}

export interface PartyChartData {
	seats: number;
	color: string;
	name: string;
}

export interface ChartOptions {
	sections?: number;
	sectionGap?: number;
	seatRadius: number;
	rowHeight: number;
}

/**
 * Calculate parliament seat positions in a semicircle
 */
export function calculateParliamentPoints(
	totalPoints: number,
	options: ChartOptions,
	graphicWidth: number
): SeatPosition[] {
	const graphicHeight = graphicWidth / 2;
	const { seatRadius, rowHeight, sectionGap = 0 } = options;
	const startRad = 0;
	const endRad = Math.PI;
	const padding = seatRadius * 2;
	const graphRadius = graphicHeight - padding;
	const points: SeatPosition[] = [];
	let currentRow = 0;

	while (points.length < totalPoints) {
		const currentRowRadius = graphRadius - rowHeight * currentRow;
		const currentRowGapRad = Math.atan((seatRadius + sectionGap / 2) / currentRowRadius);
		const currentRowStartRad = startRad + currentRowGapRad;
		const currentRowEndRad = endRad - currentRowGapRad;

		if (currentRowEndRad <= currentRowStartRad || currentRowRadius <= 0) break;

		const spacingFactor = totalPoints > 400 ? 2.0 : 2.5;
		const currRadStep = Math.atan((spacingFactor * seatRadius) / currentRowRadius);
		const rowSeats = Math.min(
			Math.floor((currentRowEndRad - currentRowStartRad) / currRadStep),
			totalPoints - points.length
		);
		const roundedRadStep = rowSeats > 0 ? (currentRowEndRad - currentRowStartRad) / rowSeats : 0;

		for (let currSeat = 0; currSeat < rowSeats; currSeat++) {
			const currentAngle =
				rowSeats > 0
					? currSeat * roundedRadStep + currentRowStartRad + roundedRadStep / 2
					: (currentRowStartRad + currentRowEndRad) / 2;
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
 * Convert seat data to chart format
 */
export function toChartData(seatsByParty: Record<string, number>): PartyChartData[] {
	const entries = Object.keys(seatsByParty)
		.map((k) => ({ key: k, seats: seatsByParty[k] }))
		.filter((e) => e.seats > 0)
		.sort((a, b) => b.seats - a.seats);

	return entries.map((e) => ({
		seats: e.seats,
		color: PARTY_META[e.key]?.color || '#888888',
		name: PARTY_META[e.key]?.name || e.key
	}));
}

/**
 * Draw a parliament chart on a canvas
 */
export function drawParliamentChart(
	canvas: HTMLCanvasElement,
	data: PartyChartData[],
	options: { compact?: boolean } = {}
): void {
	if (!data || data.length === 0) return;

	const totalSeats = data.reduce((sum, item) => sum + item.seats, 0);
	if (totalSeats === 0) return;

	const isCompact = options.compact;
	const containerWidth = canvas.parentElement?.offsetWidth || (isCompact ? 300 : 600);
	const padding = isCompact ? 16 : 32;
	const maxWidth = Math.min(containerWidth - padding, isCompact ? 300 : 600);
	const canvasWidth = Math.max(isCompact ? 200 : 320, maxWidth);

	let aspectRatio = 0.5;
	if (canvasWidth < 400) aspectRatio = 0.7;
	else if (canvasWidth < 500) aspectRatio = 0.6;

	const canvasHeight = canvasWidth * aspectRatio;
	const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
	canvas.width = canvasWidth * dpr;
	canvas.height = canvasHeight * dpr;
	canvas.style.width = canvasWidth + 'px';
	canvas.style.height = canvasHeight + 'px';

	const ctx = canvas.getContext('2d');
	if (!ctx) return;

	ctx.scale(dpr, dpr);

	let seatRadius: number, rowHeight: number;
	if (isCompact) {
		if (canvasWidth < 250) {
			seatRadius = 2;
			rowHeight = 5;
		} else {
			seatRadius = 2.5;
			rowHeight = 6;
		}
	} else {
		if (canvasWidth < 350) {
			seatRadius = 2.5;
			rowHeight = 6;
		} else if (canvasWidth < 400) {
			seatRadius = 3;
			rowHeight = 7;
		} else if (canvasWidth < 500) {
			seatRadius = 4;
			rowHeight = 8;
		} else {
			seatRadius = 5;
			rowHeight = 10;
		}
	}

	const chartOptions: ChartOptions = { sections: 1, sectionGap: 0, seatRadius, rowHeight };
	const seatPositions = calculateParliamentPoints(totalSeats, chartOptions, canvasWidth);

	// Sort seats by angle for proper party grouping
	const seatPositionsWithAngle = seatPositions.map((pos) => {
		const dx = pos.x - canvasWidth / 2;
		const dy = canvasHeight - pos.y;
		const angle = Math.atan2(dy, dx);
		return { ...pos, angle };
	});
	seatPositionsWithAngle.sort((a, b) => b.angle - a.angle);

	// Assign colors to seats
	interface SeatData {
		x: number;
		y: number;
		color: string;
		name: string;
		partySeats: number;
	}

	const seatData: SeatData[] = [];
	let seatIndex = 0;
	data.forEach((party) => {
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

	// Draw seats
	ctx.shadowColor = 'transparent';
	ctx.shadowBlur = 0;
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;

	seatData.forEach((seat) => {
		ctx.beginPath();
		ctx.arc(seat.x, seat.y, chartOptions.seatRadius, 0, 2 * Math.PI);
		ctx.fillStyle = seat.color;
		ctx.fill();
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
		ctx.lineWidth = 0.5;
		ctx.stroke();
	});
}
