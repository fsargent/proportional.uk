# UK Hex District Visualiser Spec

## Goal

Create a reusable UK Westminster hex cartogram visualiser that can power multiple electoral-system explainers:

- STV constituency regrouping
- SPAV regional grouping
- AMS+ local seats + regional overlays
- future boundary/proportionality experiments

The visualiser should be based on a **single canonical seat-level hex map** and should not attempt to infer the shape of the UK at runtime from raw polygons.

## Core design choice

The app's runtime map model is a curated **hex cartogram of Westminster constituencies**.

That means the map is driven by a dataset where each current Westminster constituency has:

- a stable seat id
- a display name
- nation / region metadata
- a fixed hex-grid coordinate

Everything else is derived from that.

## Canonical source

Use the Open Innovations 2023 Westminster constituency HexJSON layout as the base source of truth.

Why this source:

- already designed as a public-facing UK constituency hex map
- preserves large-scale UK shape, nations, and regional blocks
- explicitly intended for reuse and improvement
- closely matches the visual style Felix wants to preserve

## Runtime data model

```ts
export type Nation = 'England' | 'Scotland' | 'Wales' | 'Northern Ireland';

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
```

Derived at runtime/build-time:

```ts
export interface HexSeatWithNeighbours extends HexSeat {
  neighbours: string[];
}

export interface DistrictAssignment {
  seatId: string;
  districtId: string;
}

export interface HexDistrict {
  id: string;
  seatIds: string[];
  nation: Nation;
  memberCount: number;
  centroid: { x: number; y: number };
}
```

## Rendering model

- pointy-topped hexes
- source coordinates are `odd-r`
- SVG renderer converts `q/r` to pixel positions
- each seat is drawn as one hex
- district boundaries are derived by suppressing shared internal edges
- district labels are placed at district centroids

## Adjacency model

Adjacency is determined from hex-grid neighbours using the `odd-r` layout.

This gives the visualiser a stable contiguity graph without requiring geographic polygon intersection at runtime.

## District grouping model (MVP)

The first version groups adjacent seats into contiguous districts of approximately `N` members.

Rules:

1. never cross nation boundaries
2. prefer to stay inside region boundaries while grouping
3. ensure districts are contiguous in the hex graph
4. target district size = chosen number of members
5. allow final leftover districts to be `N - 1` or `N + 1` where necessary

Algorithm:

1. partition seats by nation
2. within each nation, sort seats top-to-bottom / left-to-right for deterministic seeding
3. grow districts with BFS/flood-fill from each unassigned seed
4. prefer neighbours in same region, then nearest available neighbours
5. merge or rebalance tiny leftovers into adjacent districts

This is intentionally a **visual and structural** grouping engine, not a legal boundary redistricting engine.

## Reuse across systems

The same base visualiser should support multiple assignment layers:

- STV: grouped multi-member districts
- SPAV: larger grouped regional districts
- AMS+: single-seat constituencies plus optional overlay regions

So the renderer accepts:

- a base seat list
- a seat -> district assignment map
- a styling mode

## Metrics for the visualiser (MVP)

Structural metrics only for now:

- total current seats
- total grouped districts
- target members per district
- smallest district size
- largest district size
- average district size

Future metrics:

- effective threshold
- Gallagher index
- Loosemore–Hanby
- vote aggregation by grouped district

## Deliverables for first implementation

1. `uk-westminster-hexes.json`
   - canonical seat-level dataset derived from Open Innovations HexJSON
2. hex-grid utilities
   - coordinate conversion
   - adjacency derivation
   - district grouping
3. reusable `HexMap` Svelte component
4. reusable `DistrictMetrics` Svelte component
5. `/visualiser` route demonstrating the map with a district-size slider

## Explicit non-goals for MVP

- no exact STV count simulation
- no live polygon-based UK geography engine
- no legal/commission-grade boundary generation
- no final argument text for every system yet

## Success criteria

The feature is successful when:

- the UK looks recognisably British on a hex cartogram
- changing members-per-district visibly redraws grouped constituency boundaries
- the code can be reused later for STV, SPAV, and AMS+
- the base map data is canonical, local, versioned, and independent of runtime web fetches
