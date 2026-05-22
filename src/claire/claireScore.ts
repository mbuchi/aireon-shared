// Location-accessibility score for Claire — a faithful port of scoore's
// walkability model (scoore/src/utils/accessibility.ts + config/scoring.ts).
// It lets Claire state a parcel's scoore-equivalent score without an extra
// backend call: the POI distances clairePOIs already computes are fed
// straight into the same formula scoore uses.
//
// Keep SCORE_CATEGORIES in sync with scoore/src/config/scoring.ts — RES's
// per-category `/score/poi-osm` radii are also derived from these.

interface ScoreCategory {
  /** scoore category id — must match the keys of the input distance map. */
  name: string;
  minPOIs: number;
  perfectDistance: number;
  radius: number;
  penaltyFactor: number;
  weight: number;
}

// Mirror of scoore's SCORING_CONFIG.categories. All weights are 1, so the
// overall score is a plain average of the ten category scores.
const SCORE_CATEGORIES: ScoreCategory[] = [
  { name: 'Transport', minPOIs: 2, perfectDistance: 100, radius: 1000, penaltyFactor: 1, weight: 1 },
  { name: 'Utilities', minPOIs: 2, perfectDistance: 100, radius: 1000, penaltyFactor: 1, weight: 1 },
  { name: 'Education', minPOIs: 1, perfectDistance: 200, radius: 5000, penaltyFactor: 1, weight: 1 },
  { name: 'Health', minPOIs: 2, perfectDistance: 200, radius: 1000, penaltyFactor: 1, weight: 1 },
  { name: 'Groceries', minPOIs: 3, perfectDistance: 50, radius: 1000, penaltyFactor: 1, weight: 1 },
  { name: 'Food_Dining', minPOIs: 3, perfectDistance: 50, radius: 1000, penaltyFactor: 1, weight: 1 },
  { name: 'Recreation', minPOIs: 2, perfectDistance: 200, radius: 2000, penaltyFactor: 1, weight: 1 },
  { name: 'Public_Services', minPOIs: 2, perfectDistance: 200, radius: 2000, penaltyFactor: 1, weight: 1 },
  { name: 'Community', minPOIs: 2, perfectDistance: 200, radius: 1000, penaltyFactor: 1, weight: 1 },
  { name: 'Outdoor', minPOIs: 2, perfectDistance: 300, radius: 5000, penaltyFactor: 1, weight: 1 },
];

// Single-POI score: 6 at (or inside) the perfect distance, falling by
// `penaltyFactor` per doubling of distance, clamped to [0, 6].
function poiScore(
  distance: number,
  perfectDistance: number,
  penaltyFactor: number,
): number {
  if (distance <= 0) return 6;
  const score = 6 - penaltyFactor * Math.log2(distance / perfectDistance);
  return Math.max(0, Math.min(6, score));
}

// Category score: average the closest `minPOIs` POIs within radius, padding
// with zeros when fewer than `minPOIs` are found.
function categoryScore(cat: ScoreCategory, distances: number[]): number {
  const nearest = distances
    .filter((d) => d <= cat.radius)
    .sort((a, b) => a - b)
    .slice(0, cat.minPOIs)
    .map((d) => poiScore(d, cat.perfectDistance, cat.penaltyFactor));
  while (nearest.length < cat.minPOIs) nearest.push(0);
  return nearest.reduce((acc, s) => acc + s, 0) / cat.minPOIs;
}

export interface LocationScore {
  /** Overall accessibility score, 0–6 (6 = key amenities at the doorstep). */
  total: number;
  /** Per-category sub-scores, 0–6, keyed by scoore category id. */
  byCategory: Record<string, number>;
}

/**
 * Computes scoore's location-accessibility score from per-category POI
 * distances (metres). Mirrors scoore's `calculateLocationScore` exactly:
 * an unweighted average of the ten category scores, each 0–6.
 */
export function computeLocationScore(
  categoryDistances: Record<string, number[]>,
): LocationScore {
  const byCategory: Record<string, number> = {};
  let weightedSum = 0;
  let totalWeight = 0;

  for (const cat of SCORE_CATEGORIES) {
    const distances = categoryDistances[cat.name] ?? [];
    const score = distances.length > 0 ? categoryScore(cat, distances) : 0;
    byCategory[cat.name] = Math.round(score * 100) / 100;
    weightedSum += score * cat.weight;
    totalWeight += cat.weight;
  }

  const total =
    totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 100) / 100 : 0;
  return { total, byCategory };
}
