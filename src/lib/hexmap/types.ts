export type Nation = "England" | "Scotland" | "Wales" | "Northern Ireland";

export interface HexSeat {
  id: string;
  name: string;
  nation: Nation;
  regionCode: string;
  regionName: string;
  q: number;
  r: number;
  sourceColour?: string;
}

export interface HexDataset {
  source: string;
  layout: string;
  version: string;
  seatCount: number;
  seats: HexSeat[];
}

export interface HexSeatWithNeighbours extends HexSeat {
  neighbours: string[];
}

export interface SeatPixelPosition {
  id: string;
  x: number;
  y: number;
}

export interface HexDistrict {
  id: string;
  nation: Nation;
  seatIds: string[];
  memberCount: number;
  regionNames: string[];
}

export interface DistrictMetrics {
  totalSeats: number;
  totalDistricts: number;
  targetMembers: number;
  minDistrictSize: number;
  maxDistrictSize: number;
  averageDistrictSize: number;
}
