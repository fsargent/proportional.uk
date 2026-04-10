import type { HexSeat, SeatPixelPosition } from "./types";

export const HEX_SIZE = 14;
export const HEX_WIDTH = Math.sqrt(3) * HEX_SIZE;
export const HEX_HEIGHT = HEX_SIZE * 2;
export const ROW_STEP = HEX_SIZE * 1.5;

const ODD_R_DIRECTIONS = {
  even: [
    [+1, 0],
    [0, +1],
    [-1, +1],
    [-1, 0],
    [-1, -1],
    [0, -1],
  ],
  odd: [
    [+1, 0],
    [+1, +1],
    [0, +1],
    [-1, 0],
    [0, -1],
    [+1, -1],
  ],
} as const;

export function oddRNeighbours(
  q: number,
  r: number,
): Array<{ q: number; r: number }> {
  const parity = Math.abs(r % 2) === 0 ? "even" : "odd";
  return ODD_R_DIRECTIONS[parity].map(([dq, dr]) => ({ q: q + dq, r: r + dr }));
}

export function oddRToPixel(
  q: number,
  r: number,
  size = HEX_SIZE,
): { x: number; y: number } {
  const x = Math.sqrt(3) * size * (q + 0.5 * (r & 1));
  const y = size * 1.5 * -r;
  return { x, y };
}

export function normaliseSeatPixels(
  seats: HexSeat[],
  size = HEX_SIZE,
): SeatPixelPosition[] {
  const points = seats.map((seat) => {
    const { x, y } = oddRToPixel(seat.q, seat.r, size);
    return { id: seat.id, x, y };
  });

  const minX = Math.min(...points.map((point) => point.x));
  const minY = Math.min(...points.map((point) => point.y));
  const padding = size * 2.2;

  return points.map((point) => ({
    ...point,
    x: point.x - minX + padding,
    y: point.y - minY + padding,
  }));
}

export function hexCornerPoints(
  x: number,
  y: number,
  size = HEX_SIZE,
): Array<{ x: number; y: number }> {
  return Array.from({ length: 6 }, (_, index) => {
    const angleDeg = 60 * index - 30;
    const angle = (Math.PI / 180) * angleDeg;
    return {
      x: x + size * Math.cos(angle),
      y: y + size * Math.sin(angle),
    };
  });
}

export function hexPolygonPoints(
  x: number,
  y: number,
  size = HEX_SIZE,
): string {
  return hexCornerPoints(x, y, size)
    .map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`)
    .join(" ");
}

export function datasetBounds(positions: SeatPixelPosition[], size = HEX_SIZE) {
  const maxX = Math.max(...positions.map((point) => point.x)) + size * 2.2;
  const maxY = Math.max(...positions.map((point) => point.y)) + size * 2.2;
  return { width: maxX, height: maxY };
}
