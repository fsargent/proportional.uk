import type {
  DistrictMetrics,
  HexDistrict,
  HexSeat,
  HexSeatWithNeighbours,
  Nation,
} from "./types";
import { oddRNeighbours } from "./geometry";

interface SeatGroup {
  seats: HexSeatWithNeighbours[];
}

export function withNeighbours(seats: HexSeat[]): HexSeatWithNeighbours[] {
  const idsByCoord = new Map(
    seats.map((seat) => [`${seat.q},${seat.r}`, seat.id]),
  );

  return seats.map((seat) => ({
    ...seat,
    neighbours: oddRNeighbours(seat.q, seat.r)
      .map((coord) => idsByCoord.get(`${coord.q},${coord.r}`))
      .filter((value): value is string => Boolean(value)),
  }));
}

function buildSeatMap(
  seats: HexSeatWithNeighbours[],
): Map<string, HexSeatWithNeighbours> {
  return new Map(seats.map((seat) => [seat.id, seat]));
}

function districtSortKey(seat: HexSeatWithNeighbours) {
  return `${seat.nation}|${seat.r.toString().padStart(5, "0")}|${seat.q.toString().padStart(5, "0")}|${seat.name}`;
}

function average(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function pickSeed(
  unassignedSeats: HexSeatWithNeighbours[],
  unassigned: Set<string>,
  seatMap: Map<string, HexSeatWithNeighbours>,
  shouldPreserveRemainder: boolean,
): HexSeatWithNeighbours {
  const ordered = [...unassignedSeats].sort((a, b) => {
    const scoreA = a.neighbours.length;
    const scoreB = b.neighbours.length;
    return (
      scoreA - scoreB || a.r - b.r || a.q - b.q || a.name.localeCompare(b.name)
    );
  });

  return shouldPreserveRemainder
    ? ordered.find((seat) =>
        leavesRemainderConnected(seat.id, unassigned, seatMap),
      ) ?? ordered[0]
    : ordered[0];
}

function sharedNeighbourCount(
  candidate: HexSeatWithNeighbours,
  districtSeatIds: Set<string>,
): number {
  return candidate.neighbours.filter((neighbourId) =>
    districtSeatIds.has(neighbourId),
  ).length;
}

function scoreCandidate(
  candidate: HexSeatWithNeighbours,
  districtSeats: HexSeatWithNeighbours[],
  districtSeatIds: Set<string>,
  targetMembers: number,
): number {
  const centroidQ = average(districtSeats.map((seat) => seat.q));
  const centroidR = average(districtSeats.map((seat) => seat.r));
  const nextCentroidQ = average([
    ...districtSeats.map((seat) => seat.q),
    candidate.q,
  ]);
  const nextCentroidR = average([
    ...districtSeats.map((seat) => seat.r),
    candidate.r,
  ]);
  const centroidDistance = Math.hypot(
    candidate.q - centroidQ,
    candidate.r - centroidR,
  );
  const nextQs = [...districtSeats.map((seat) => seat.q), candidate.q];
  const nextRs = [...districtSeats.map((seat) => seat.r), candidate.r];
  const width = Math.max(...nextQs) - Math.min(...nextQs);
  const height = Math.max(...nextRs) - Math.min(...nextRs);
  const aspectPenalty = Math.abs(width - height);
  const sharedEdges = sharedNeighbourCount(candidate, districtSeatIds);
  const sameRegionBonus =
    candidate.regionCode === districtSeats[0].regionCode ? 1.25 : 0;
  const centrePull = Math.hypot(
    candidate.q - nextCentroidQ,
    candidate.r - nextCentroidR,
  );
  const fillPressure = districtSeats.length / Math.max(1, targetMembers);

  return (
    sharedEdges * 4.5 +
    sameRegionBonus * (fillPressure < 0.7 ? 1.5 : 0.75) -
    centroidDistance * 1.8 -
    centrePull * 1.4 -
    aspectPenalty * 0.7
  );
}

function connectedSeatGroups(
  nationSeats: HexSeatWithNeighbours[],
  seatMap: Map<string, HexSeatWithNeighbours>,
): SeatGroup[] {
  const unvisited = new Set(nationSeats.map((seat) => seat.id));
  const groups: SeatGroup[] = [];

  while (unvisited.size > 0) {
    const startId = [...unvisited].sort()[0];
    const stack = [startId];
    const component: HexSeatWithNeighbours[] = [];
    unvisited.delete(startId);

    while (stack.length > 0) {
      const seatId = stack.pop();
      if (!seatId) continue;
      const seat = seatMap.get(seatId);
      if (!seat) continue;
      component.push(seat);

      const nextIds = seat.neighbours
        .filter((neighbourId) => unvisited.has(neighbourId))
        .sort();
      for (const neighbourId of nextIds) {
        unvisited.delete(neighbourId);
        stack.push(neighbourId);
      }
    }

    component.sort((a, b) =>
      districtSortKey(a).localeCompare(districtSortKey(b)),
    );
    groups.push({ seats: component });
  }

  return groups.sort(
    (a, b) =>
      b.seats.length - a.seats.length ||
      districtSortKey(a.seats[0]).localeCompare(districtSortKey(b.seats[0])),
  );
}

function connectedComponentSize(
  startId: string,
  availableSeatIds: Set<string>,
  seatMap: Map<string, HexSeatWithNeighbours>,
): number {
  const visited = new Set<string>([startId]);
  const stack = [startId];

  while (stack.length > 0) {
    const seatId = stack.pop();
    if (!seatId) continue;
    const seat = seatMap.get(seatId);
    if (!seat) continue;

    for (const neighbourId of seat.neighbours) {
      if (!availableSeatIds.has(neighbourId) || visited.has(neighbourId)) {
        continue;
      }
      visited.add(neighbourId);
      stack.push(neighbourId);
    }
  }

  return visited.size;
}

function leavesRemainderConnected(
  candidateId: string,
  unassigned: Set<string>,
  seatMap: Map<string, HexSeatWithNeighbours>,
): boolean {
  if (unassigned.size <= 1) return true;

  let startId: string | undefined;
  for (const seatId of unassigned) {
    if (seatId !== candidateId) {
      startId = seatId;
      break;
    }
  }
  if (!startId) return true;

  const remainingIds = new Set(unassigned);
  remainingIds.delete(candidateId);

  return (
    connectedComponentSize(startId, remainingIds, seatMap) ===
    remainingIds.size
  );
}

function growCompactDistrict(
  seed: HexSeatWithNeighbours,
  seatMap: Map<string, HexSeatWithNeighbours>,
  unassigned: Set<string>,
  targetMembers: number,
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

    if (frontier.size === 0) break;

    const rankedCandidates = [...frontier.values()].sort(
      (a, b) =>
        scoreCandidate(b, districtSeats, districtSeatIds, targetMembers) -
          scoreCandidate(a, districtSeats, districtSeatIds, targetMembers) ||
        a.r - b.r ||
        a.q - b.q ||
        a.name.localeCompare(b.name),
    );

    const candidate =
      rankedCandidates.find((seat) =>
        leavesRemainderConnected(seat.id, unassigned, seatMap),
      ) ?? rankedCandidates[0];

    if (!candidate) break;
    unassigned.delete(candidate.id);
    districtSeats.push(candidate);
    districtSeatIds.add(candidate.id);
  }

  return districtSeats;
}

function assignSeatGroupDistricts(
  nation: Nation,
  seatGroup: SeatGroup,
  seatMap: Map<string, HexSeatWithNeighbours>,
  targetMembers: number,
  startingDistrictNumber: number,
): { districts: HexDistrict[]; nextDistrictNumber: number } {
  const unassigned = new Set(seatGroup.seats.map((seat) => seat.id));
  const districts: HexDistrict[] = [];
  let districtNumber = startingDistrictNumber;

  while (unassigned.size > 0) {
    const remainingSeats = seatGroup.seats.filter((seat) =>
      unassigned.has(seat.id),
    );
    const remainingCount = remainingSeats.length;
    const desiredSize =
      remainingCount <= targetMembers + 1
        ? remainingCount
        : Math.max(1, Math.min(targetMembers, remainingCount));
    const seed = pickSeed(
      remainingSeats,
      unassigned,
      seatMap,
      remainingCount > desiredSize,
    );
    const districtSeats = growCompactDistrict(
      seed,
      seatMap,
      unassigned,
      desiredSize,
    );

    districts.push({
      id: `${nation.toLowerCase().replace(/\s+/g, "-")}-${districtNumber}`,
      nation,
      seatIds: districtSeats.map((seat) => seat.id),
      memberCount: districtSeats.length,
      regionNames: [...new Set(districtSeats.map((seat) => seat.regionName))],
    });
    districtNumber++;
  }

  return { districts, nextDistrictNumber: districtNumber };
}

function assignNationDistricts(
  nation: Nation,
  nationSeats: HexSeatWithNeighbours[],
  seatMap: Map<string, HexSeatWithNeighbours>,
  targetMembers: number,
  startingDistrictNumber: number,
): { districts: HexDistrict[]; nextDistrictNumber: number } {
  const seatGroups = connectedSeatGroups(nationSeats, seatMap);
  const districts: HexDistrict[] = [];
  let districtNumber = startingDistrictNumber;

  for (const seatGroup of seatGroups) {
    const result = assignSeatGroupDistricts(
      nation,
      seatGroup,
      seatMap,
      targetMembers,
      districtNumber,
    );
    districts.push(...result.districts);
    districtNumber = result.nextDistrictNumber;
  }

  return { districts, nextDistrictNumber: districtNumber };
}

export function buildDistricts(
  seats: HexSeat[],
  targetMembers: number,
): HexDistrict[] {
  const enrichedSeats = withNeighbours(seats);
  const seatMap = buildSeatMap(enrichedSeats);
  const byNation = new Map<Nation, HexSeatWithNeighbours[]>();

  for (const seat of enrichedSeats) {
    const group = byNation.get(seat.nation) ?? [];
    group.push(seat);
    byNation.set(seat.nation, group);
  }

  for (const nationSeats of byNation.values()) {
    nationSeats.sort((a, b) =>
      districtSortKey(a).localeCompare(districtSortKey(b)),
    );
  }

  const orderedNations: Nation[] = [
    "England",
    "Scotland",
    "Wales",
    "Northern Ireland",
  ];
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
      districtNumber,
    );
    districts.push(...result.districts);
    districtNumber = result.nextDistrictNumber;
  }

  return districts;
}

export function districtAssignments(
  districts: HexDistrict[],
): Map<string, string> {
  const assignments = new Map<string, string>();
  for (const district of districts) {
    for (const seatId of district.seatIds) assignments.set(seatId, district.id);
  }
  return assignments;
}

export function calculateDistrictMetrics(
  districts: HexDistrict[],
  targetMembers: number,
  totalSeats: number,
): DistrictMetrics {
  const sizes = districts.map((district) => district.memberCount);
  return {
    totalSeats,
    totalDistricts: districts.length,
    targetMembers,
    minDistrictSize: Math.min(...sizes),
    maxDistrictSize: Math.max(...sizes),
    averageDistrictSize:
      sizes.reduce((sum, size) => sum + size, 0) / sizes.length,
  };
}
