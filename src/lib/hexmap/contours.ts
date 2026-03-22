import { HEX_SIZE, hexCornerPoints, normaliseSeatPixels } from './geometry';
import type { HexDistrict, HexSeat } from './types';

interface Point {
	x: number;
	y: number;
}

interface Edge {
	start: Point;
	end: Point;
}

function pointKey(point: Point): string {
	return `${point.x.toFixed(2)},${point.y.toFixed(2)}`;
}

function edgeKey(a: Point, b: Point): string {
	const aKey = pointKey(a);
	const bKey = pointKey(b);
	return aKey < bKey ? `${aKey}|${bKey}` : `${bKey}|${aKey}`;
}

function signedArea(points: Point[]): number {
	let area = 0;
	for (let i = 0; i < points.length; i++) {
		const current = points[i];
		const next = points[(i + 1) % points.length];
		area += current.x * next.y - next.x * current.y;
	}
	return area / 2;
}

function toSvgPath(points: Point[]): string {
	if (points.length === 0) return '';
	const [first, ...rest] = points;
	return `M ${first.x.toFixed(2)} ${first.y.toFixed(2)} ${rest
		.map((point) => `L ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
		.join(' ')} Z`;
}

export function buildDistrictContours(seats: HexSeat[], districts: HexDistrict[]): Map<string, string[]> {
	const positions = normaliseSeatPixels(seats);
	const positionById = new Map(positions.map((position) => [position.id, position]));
	const contours = new Map<string, string[]>();

	for (const district of districts) {
		const edgeMap = new Map<string, Edge>();

		for (const seatId of district.seatIds) {
			const seat = seats.find((candidate) => candidate.id === seatId);
			const position = positionById.get(seatId);
			if (!seat || !position) continue;

			const corners = hexCornerPoints(position.x, position.y, HEX_SIZE);
			for (let i = 0; i < corners.length; i++) {
				const start = corners[i];
				const end = corners[(i + 1) % corners.length];
				const key = edgeKey(start, end);
				if (edgeMap.has(key)) {
					edgeMap.delete(key);
				} else {
					edgeMap.set(key, { start, end });
				}
			}
		}

		const outgoing = new Map<string, Point[]>();
		for (const edge of edgeMap.values()) {
			const startKey = pointKey(edge.start);
			const edges = outgoing.get(startKey) ?? [];
			edges.push(edge.end);
			outgoing.set(startKey, edges);
		}

		const used = new Set<string>();
		const paths: string[] = [];

		for (const edge of edgeMap.values()) {
			const startKey = `${pointKey(edge.start)}>${pointKey(edge.end)}`;
			if (used.has(startKey)) continue;

			const ring: Point[] = [edge.start];
			let current = edge.start;
			let next = edge.end;

			while (true) {
				ring.push(next);
				used.add(`${pointKey(current)}>${pointKey(next)}`);

				const options = outgoing.get(pointKey(next)) ?? [];
				const candidate = options.find((point) => !used.has(`${pointKey(next)}>${pointKey(point)}`));
				if (!candidate) break;
				current = next;
				next = candidate;
				if (pointKey(current) === pointKey(ring[0]) && pointKey(next) === pointKey(ring[1])) {
					break;
				}
				if (pointKey(next) === pointKey(ring[0])) {
					ring.push(next);
					used.add(`${pointKey(current)}>${pointKey(next)}`);
					break;
				}
			}

			const deduped = ring.filter(
				(point, index) => index === 0 || pointKey(point) !== pointKey(ring[index - 1])
			);
			if (deduped.length >= 3) {
				const open = deduped[deduped.length - 1];
				const closed = pointKey(open) === pointKey(deduped[0]) ? deduped.slice(0, -1) : deduped;
				if (closed.length >= 3 && Math.abs(signedArea(closed)) > 0.5) {
					paths.push(toSvgPath(closed));
				}
			}
		}

		contours.set(district.id, paths);
	}

	return contours;
}
