// Surrounding-POI context enrichment for Claire.
//
// Claire's parcel context is fed from:
//  1. The host app's tile properties (geminiClient.buildParcelContextSummary).
//  2. Federal records — GWR, ARE, locality (claireContext.fetchClaireContext).
//  3. OpenStreetMap POIs within walking radius + a location-accessibility
//     score (this module).
//
// Each consuming app exposes an `/api/claire-pois` Vercel proxy that forwards
// `{ lat, lng }` to the RES backend's `/score/poi-osm` endpoint. RES serves
// the data from a local PostGIS dataset (`osm_pois`, refreshed monthly) using
// per-category radii that match scoore's SCORING_CONFIG.
//
// The categorised POIs are also scored with scoore's own walkability model
// (claireScore.computeLocationScore) so Claire can quote the parcel's
// scoore-equivalent location score.
//
// Best-effort: any failure (no proxy, network error, empty result) yields ''
// and Claire proceeds with the rest of the context.

import { computeLocationScore, type LocationScore } from './claireScore';

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

interface OverpassPayload {
  elements?: OverpassElement[];
}

const POI_ENDPOINT = '/api/claire-pois';

// OSM tag → scoore category id. The ids (Transport, Food_Dining, …) match
// scoore's SCORING_CONFIG so the same buckets drive both the POI summary and
// the location score. Anything not in this map is ignored.
const TAG_CATEGORY: Record<string, string> = {
  'amenity=restaurant': 'Food_Dining',
  'amenity=cafe': 'Food_Dining',
  'amenity=bar': 'Food_Dining',
  'amenity=pub': 'Food_Dining',
  'amenity=biergarten': 'Food_Dining',
  'amenity=fast_food': 'Food_Dining',
  'amenity=ice_cream': 'Food_Dining',
  'amenity=food_court': 'Food_Dining',
  'shop=supermarket': 'Groceries',
  'shop=convenience': 'Groceries',
  'shop=bakery': 'Groceries',
  'shop=butcher': 'Groceries',
  'shop=greengrocer': 'Groceries',
  'shop=deli': 'Groceries',
  'shop=organic': 'Groceries',
  'shop=beverages': 'Groceries',
  'shop=cheese': 'Groceries',
  'amenity=hospital': 'Health',
  'amenity=clinic': 'Health',
  'amenity=pharmacy': 'Health',
  'amenity=doctors': 'Health',
  'healthcare=doctor': 'Health',
  'healthcare=dentist': 'Health',
  'healthcare=clinic': 'Health',
  'healthcare=hospital': 'Health',
  'healthcare=pharmacy': 'Health',
  'amenity=school': 'Education',
  'amenity=kindergarten': 'Education',
  'amenity=library': 'Education',
  'amenity=university': 'Education',
  'amenity=college': 'Education',
  'amenity=childcare': 'Education',
  'amenity=bus_station': 'Transport',
  'highway=bus_stop': 'Transport',
  'railway=station': 'Transport',
  'railway=halt': 'Transport',
  'railway=tram_stop': 'Transport',
  'amenity=post_office': 'Public_Services',
  'amenity=police': 'Public_Services',
  'amenity=townhall': 'Public_Services',
  'amenity=marketplace': 'Public_Services',
  'amenity=bank': 'Utilities',
  'amenity=atm': 'Utilities',
  'amenity=money_exchange': 'Utilities',
  'amenity=fuel': 'Utilities',
  'amenity=charging_station': 'Utilities',
  'amenity=cinema': 'Recreation',
  'amenity=theatre': 'Recreation',
  'amenity=arts_centre': 'Recreation',
  'amenity=museum': 'Recreation',
  'amenity=gallery': 'Recreation',
  'leisure=sports_centre': 'Recreation',
  'leisure=fitness_centre': 'Recreation',
  'leisure=stadium': 'Recreation',
  'leisure=park': 'Outdoor',
  'leisure=playground': 'Outdoor',
  'amenity=community_centre': 'Community',
  'amenity=place_of_worship': 'Community',
  'amenity=social_facility': 'Community',
};

// scoore category id → human-readable label for the prompt.
const CATEGORY_LABEL: Record<string, string> = {
  Transport: 'Transport',
  Education: 'Education',
  Groceries: 'Groceries',
  Food_Dining: 'Food & dining',
  Health: 'Health',
  Public_Services: 'Public services',
  Recreation: 'Recreation',
  Outdoor: 'Outdoors',
  Utilities: 'Money & fuel',
  Community: 'Community',
};

// Display order — most useful for a property assistant first.
const CATEGORY_ORDER = [
  'Transport',
  'Education',
  'Groceries',
  'Food_Dining',
  'Health',
  'Public_Services',
  'Recreation',
  'Outdoor',
  'Utilities',
  'Community',
];

// Per-category cap on listed names. Keeps the prompt compact even in dense
// city centres where the radius can hit hundreds of POIs.
const CAP_PER_CATEGORY = 5;

function haversineMetres(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6_371_000;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function coordsOf(el: OverpassElement): { lat: number; lng: number } | null {
  if (typeof el.lat === 'number' && typeof el.lon === 'number')
    return { lat: el.lat, lng: el.lon };
  if (el.center) return { lat: el.center.lat, lng: el.center.lon };
  return null;
}

function categoryOf(tags: Record<string, string>): string | null {
  for (const [k, v] of Object.entries(tags)) {
    const cat = TAG_CATEGORY[`${k}=${v}`];
    if (cat) return cat;
  }
  return null;
}

function nameOf(tags: Record<string, string>): string {
  if (tags.name) return tags.name;
  // Fall back to the matched OSM primary tag, prettified — e.g. `bus_stop`
  // becomes "Bus stop".
  const primary =
    tags.amenity ??
    tags.shop ??
    tags.leisure ??
    tags.railway ??
    tags.highway ??
    tags.healthcare;
  if (primary) {
    return (
      primary.charAt(0).toUpperCase() + primary.slice(1).replace(/_/g, ' ')
    );
  }
  return 'Unnamed';
}

function formatDistance(metres: number): string {
  if (metres < 1000) return `${Math.round(metres)} m`;
  if (metres < 10_000) return `${(metres / 1000).toFixed(1)} km`;
  return `${Math.round(metres / 1000)} km`;
}

export interface ClairePOIs {
  /** Ready-to-append context block; '' on error or when nothing found. */
  text: string;
  /** Total POIs surfaced after categorisation (for telemetry / debug). */
  count: number;
  /** scoore-equivalent location-accessibility score; null when no POIs. */
  score: LocationScore | null;
}

/**
 * Fetches surrounding OSM POIs for a parcel coordinate, computes scoore's
 * location-accessibility score from them, and returns a compact context
 * block: the score (overall + per category) followed by the nearest few
 * POIs per category with distances.
 *
 * Never throws — best-effort enrichment, like fetchClaireContext.
 */
export async function fetchClairePOIs(
  lng: number,
  lat: number,
  signal?: AbortSignal,
): Promise<ClairePOIs> {
  let data: OverpassPayload;
  try {
    const res = await fetch(POI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat, lng }),
      signal,
    });
    if (!res.ok) return { text: '', count: 0, score: null };
    data = (await res.json()) as OverpassPayload;
  } catch {
    return { text: '', count: 0, score: null };
  }

  const elements = data.elements ?? [];
  if (elements.length === 0) return { text: '', count: 0, score: null };

  type Item = { name: string; distance: number };
  const buckets: Record<string, Item[]> = {};
  let total = 0;

  for (const el of elements) {
    if (!el.tags) continue;
    const c = coordsOf(el);
    if (!c) continue;
    const cat = categoryOf(el.tags);
    if (!cat) continue;
    const distance = haversineMetres(lat, lng, c.lat, c.lng);
    (buckets[cat] ??= []).push({ name: nameOf(el.tags), distance });
    total += 1;
  }

  if (total === 0) return { text: '', count: 0, score: null };

  // scoore-equivalent location score from the same buckets.
  const distancesByCategory: Record<string, number[]> = {};
  for (const [cat, items] of Object.entries(buckets)) {
    distancesByCategory[cat] = items.map((i) => i.distance);
  }
  const score = computeLocationScore(distancesByCategory);

  // Per-category score line, in display order.
  const perCategory = CATEGORY_ORDER.map(
    (cat) => `${CATEGORY_LABEL[cat]} ${score.byCategory[cat].toFixed(1)}`,
  ).join(', ');

  // Nearest-POI bullets, in display order.
  const poiLines: string[] = [];
  for (const cat of CATEGORY_ORDER) {
    const items = buckets[cat];
    if (!items || items.length === 0) continue;
    items.sort((a, b) => a.distance - b.distance);
    const top = items.slice(0, CAP_PER_CATEGORY);
    const list = top
      .map((p) => `${p.name} (${formatDistance(p.distance)})`)
      .join(', ');
    const suffix =
      items.length > top.length ? `, +${items.length - top.length} more` : '';
    poiLines.push(
      `- ${CATEGORY_LABEL[cat]} (${items.length} within radius): ${list}${suffix}`,
    );
  }

  const text =
    `Surrounding location & amenities (OpenStreetMap):\n` +
    `Location-accessibility score (scoore walkability model, 0–6 where 6 means key amenities are at the doorstep): ${score.total.toFixed(1)} / 6.\n` +
    `Per category (0–6): ${perCategory}.\n` +
    `Nearest points of interest:\n${poiLines.join('\n')}`;

  return { text, count: total, score };
}
