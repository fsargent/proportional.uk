import type { DistrictMetrics, HexDistrict, HexSeat, HexSeatWithNeighbours, Nation } from './types';
import { oddRNeighbours } from './geometry';

export function withNeighbours(seats: HexSeat[]): HexSeatWithNeighbours[] {
	const idsByCoord = new Map(seats.map((seat) => [`${seat.q},${seat.r}`, seat.id]));

	return seats.map((seat) => ({
		...seat,
		neighbours: oddRNeighbours(seat.q, seat.r)
			.map((coord) => idsByCoord.get(`${coord.q},${coord.r}`))
			.filter((value): value is string => Boolean(value))
	}));
}

function buildSeatMap(seats: HexSeatWithNeighbours[]): Map<string, HexSeatWithNeighbours> {
	return new Map(seats.map((seat) => [seat.id, seat]));
}

function districtSortKey(seat: HexSeatWithNeighbours) {
	return `${seat.nation}|${seat.r.toString().padStart(5, '0')}|${seat.q.toString().padStart(5, '0')}|${seat.name}`;
}

function average(values: number[]): number {
	return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function pickSeed(unassignedSeats: HexSeatWithNeighbours[]): HexSeatWithNeighbours {
	const ordered = [...unassignedSeats].sort((a, b) => {
		const scoreA = a.neighbours.length;
		const scoreB = b.neighbours.length;
		return scoreA - scoreB || a.r - b.r || a.q - b.q || a.name.localeCompare(b.name);
	});
	return ordered[0];
}

function sharedNeighbourCount(candidate: HexSeatWithNeighbours, districtSeatIds: Set<string>): number {
	return candidate.neighbours.filter((neighbourId) => districtSeatIds.has(neighbourId)).length;
}

function scoreCandidate(
	candidate: HexSeatWithNeighbours,
	districtSeats: HexSeatWithNeighbours[],
	districtSeatIds: Set<string>,
	targetMembers: number
): number {
	const centroidQ = average(districtSeats.map((seat) => seat.q));
	const centroidR = average(districtSeats.map((seat) => seat.r));
	const nextCentroidQ = average([...districtSeats.map((seat) => seat.q), candidate.q]);
	const nextCentroidR = average([...districtSeats.map((seat) => seat.r), candidate.r]);
	const centroidDistance = Math.hypot(candidate.q - centroidQ, candidate.r - centroidR);
	const nextQs = [...districtSeats.map((seat) => seat.q), candidate.q];
	const nextRs = [...districtSeats.map((seat) => seat.r), candidate.r];
	const width = Math.max(...nextQs) - Math.min(...nextQs);
	const height = Math.max(...nextRs) - Math.min(...nextRs);
	const aspectPenalty = Math.abs(width - height);
	const sharedEdges = sharedNeighbourCount(candidate, districtSeatIds);
	const sameRegionBonus = candidate.regionCode === districtSeats[0].regionCode ? 1.25 : 0;
	const centrePull = Math.hypot(candidate.q - nextCentroidQ, candidate.r - nextCentroidR);
	const fillPressure = districtSeats.length / Math.max(1, targetMembers);

	return (
		sharedEdges * 4.5 +
		sameRegionBonus * (fillPressure < 0.7 ? 1.5 : 0.75) -
		centroidDistance * 1.8 -
		centrePull * 1.4 -
		aspectPenalty * 0.7
	);
}

function bestRemainingByDistance(
	allSeatsInNation: HexSeatWithNeighbours[],
	unassigned: Set<string>,
	districtSeats: HexSeatWithNeighbours[]
): HexSeatWithNeighbours | undefined {
	const centroidQ = average(districtSeats.map((seat) => seat.q));
	const centroidR = average(districtSeats.map((seat) => seat.r));

	return allSeatsInNation
		.filter((seat) => unassigned.has(seat.id))
		.sort((a, b) => {
			const distA = Math.hypot(a.q - centroidQ, a.r - centroidR);
			const distB = Math.hypot(b.q - centroidQ, b.r - centroidR);
			return distA - distB || a.r - b.r || a.q - b.q || a.name.localeCompare(b.name);
		})[0];
}

function growCompactDistrict(
	seed: HexSeatWithNeighbours,
	nationSeats: HexSeatWithNeighbours[],
	seatMap: Map<string, HexSeatWithNeighbours>,
	unassigned: Set<string>,
	targetMembers: number
): HexSeatWithNeighbours[] {
	const districtSeats: HexSeatWithNeighbours[] = [seed];
	const districtSeatIds = new Set<string>([seed.id]);
	unassigned.delete(seed.id);

	while (districtSeats.length < targetMembers) {
		const frontier = new Map<string, HexSeatWithNeighbours>();
		for (const seat of districtSeats) {
			for (const neighbourId of seat.neighbours) {
				if (!unassigned.has(neighbourId)) continue;
				const neighbour = seatMap.get(neighbourId);
				if (!neighbour || neighbour.nation !== seed.nation) continue;
				frontier.set(neighbour.id, neighbour);
			}
		}

		let candidate: HexSeatWithNeighbours | undefined;
		if (frontier.size > 0) {
			candidate = [...frontier.values()].sort(
				(a, b) =>
					scoreCandidate(b, districtSeats, districtSeatIds, targetMembers) -
					scoreCandidate(a, districtSeats, districtSeatIds, targetMembers) ||
					a.r - b.r ||
					a.q - b.q ||
					a.name.localeCompare(b.name)
			)[0];
		} else {
			candidate = bestRemainingByDistance(nationSeats, unassigned, districtSeats);
		}

		if (!candidate) break;
		unassigned.delete(candidate.id);
		districtSeats.push(candidate);
		districtSeatIds.add(candidate.id);
	}

	return districtSeats;
}

function assignNationDistricts(
	nation: Nation,
	nationSeats: HexSeatWithNeighbours[],
	seatMap: Map<string, HexSeatWithNeighbours>,
	targetMembers: number,
	startingDistrictNumber: number
): { districts: HexDistrict[]; nextDistrictNumber: number } {
	const unassigned = new Set(nationSeats.map((seat) => seat.id));
	const districts: HexDistrict[] = [];
	let districtNumber = startingDistrictNumber;

	while (unassigned.size > 0) {
		const remainingSeats = nationSeats.filter((seat) => unassigned.has(seat.id));
		const remainingCount = remainingSeats.length;
		const desiredSize =
			remainingCount <= targetMembers + 1 ? remainingCount : Math.max(1, Math.min(targetMembers, remainingCount));
		const seed = pickSeed(remainingSeats);
		const districtSeats = growCompactDistrict(seed, nationSeats, seatMap, unassigned, desiredSize);

		districts.push({
			id: `${nation.toLowerCase().replace(/\s+/g, '-')}-${districtNumber}`,
			nation,
			seatIds: districtSeats.map((seat) => seat.id),
			memberCount: districtSeats.length,
			regionNames: [...new Set(districtSeats.map((seat) => seat.regionName))]
		});
		districtNumber++;
	}

	return { districts, nextDistrictNumber: districtNumber };
}

export function buildDistricts(seats: HexSeat[], targetMembers: number): HexDistrict[] {
	const enrichedSeats = withNeighbours(seats);
	const seatMap = buildSeatMap(enrichedSeats);
	const byNation = new Map<Nation, HexSeatWithNeighbours[]>();

	for (const seat of enrichedSeats) {
		const group = byNation.get(seat.nation) ?? [];
		group.push(seat);
		byNation.set(seat.nation, group);
	}

	for (const nationSeats of byNation.values()) {
		nationSeats.sort((a, b) => districtSortKey(a).localeCompare(districtSortKey(b)));
	}

	const orderedNations: Nation[] = ['England', 'Scotland', 'Wales', 'Northern Ireland'];
	const districts: HexDistrict[] = [];
	let districtNumber = 1;

	for (const nation of orderedNations) {
		const nationSeats = byNation.get(nation) ?? [];
		if (nationSeats.length === 0) continue;
		const result = assignNationDistricts(
			nation,
			nationSeats,
			seatMap,
			Math.max(1, targetMembers),
			districtNumber
		);
		districts.push(...result.districts);
		districtNumber = result.nextDistrictNumber;
	}

	return districts;
}

export function districtAssignments(districts: HexDistrict[]): Map<string, string> {
	const assignments = new Map<string, string>();
	for (const district of districts) {
		for (const seatId of district.seatIds) assignments.set(seatId, district.id);
	}
	return assignments;
}

export function calculateDistrictMetrics(
	districts: HexDistrict[],
	targetMembers: number,
	totalSeats: number
): DistrictMetrics {
	const sizes = districts.map((district) => district.memberCount);
	return {
		totalSeats,
		totalDistricts: districts.length,
		targetMembers,
		minDistrictSize: Math.min(...sizes),
		maxDistrictSize: Math.max(...sizes),
		averageDistrictSize: sizes.reduce((sum, size) => sum + size, 0) / sizes.length
	};
}
