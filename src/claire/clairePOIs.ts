// Surrounding-POI context enrichment for Claire.
//
// Claire's parcel context is fed from:
//  1. The host app's tile properties (geminiClient.buildParcelContextSummary).
//  2. Federal records — GWR, ARE, locality (claireContext.fetchClaireContext).
//  3. OpenStreetMap POIs within walking radius (this module).
//
// Each consuming app exposes an `/api/claire-pois` Vercel proxy that forwards
// `{ lat, lng }` to the RES backend's `/score/poi-osm` endpoint. RES serves
// the data from a local PostGIS dataset (`osm_pois`, refreshed monthly) using
// per-category radii (Education/Outdoor 5 km, Recreation/Public_Services 2 km,
// others 1 km — matches scoore's SCORING_CONFIG).
//
// Best-effort: any failure (no proxy, network error, empty result) yields ''
// and Claire proceeds with the rest of the context.

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

// OSM tag → Claire category. Mirrors scoore's overpassMapper so the same
// dataset surfaces here under human-readable labels. Anything not in this
// map is ignored (kept the prompt focused on amenities a parcel owner cares
// about).
const TAG_CATEGORY: Record<string, string> = {
  'amenity=restaurant': 'Food & dining',
  'amenity=cafe': 'Food & dining',
  'amenity=bar': 'Food & dining',
  'amenity=pub': 'Food & dining',
  'amenity=biergarten': 'Food & dining',
  'amenity=fast_food': 'Food & dining',
  'amenity=ice_cream': 'Food & dining',
  'amenity=food_court': 'Food & dining',
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
  'amenity=post_office': 'Public services',
  'amenity=police': 'Public services',
  'amenity=townhall': 'Public services',
  'amenity=marketplace': 'Public services',
  'amenity=bank': 'Money & fuel',
  'amenity=atm': 'Money & fuel',
  'amenity=money_exchange': 'Money & fuel',
  'amenity=fuel': 'Money & fuel',
  'amenity=charging_station': 'Money & fuel',
  'amenity=cinema': 'Recreation',
  'amenity=theatre': 'Recreation',
  'amenity=arts_centre': 'Recreation',
  'amenity=museum': 'Recreation',
  'amenity=gallery': 'Recreation',
  'leisure=sports_centre': 'Recreation',
  'leisure=fitness_centre': 'Recreation',
  'leisure=stadium': 'Recreation',
  'leisure=park': 'Outdoors',
  'leisure=playground': 'Outdoors',
  'amenity=community_centre': 'Community',
  'amenity=place_of_worship': 'Community',
  'amenity=social_facility': 'Community',
};

// Display order — most useful for a property assistant first.
const CATEGORY_ORDER = [
  'Transport',
  'Education',
  'Groceries',
  'Food & dining',
  'Health',
  'Public services',
  'Recreation',
  'Outdoors',
  'Money & fuel',
  'Community',
];

// Per-category cap on listed names. Keeps the prompt compact even in dense
// city centres where a 1 km radius can hit hundreds of POIs.
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
  // becomes "Bus stop". Anonymous benches/parking get a sensible label.
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
}

/**
 * Fetches and summarises surrounding OSM POIs for a parcel coordinate. The
 * returned text is a compact bulleted block ready to append to the parcel
 * context — counts per category plus the nearest few names with distances.
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
    if (!res.ok) return { text: '', count: 0 };
    data = (await res.json()) as OverpassPayload;
  } catch {
    return { text: '', count: 0 };
  }

  const elements = data.elements ?? [];
  if (elements.length === 0) return { text: '', count: 0 };

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

  const sections: string[] = [];
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
    sections.push(`- ${cat} (${items.length} within radius): ${list}${suffix}`);
  }

  if (sections.length === 0) return { text: '', count: 0 };

  return {
    text: `Surrounding points of interest (OpenStreetMap, walking-radius search):\n${sections.join('\n')}`,
    count: total,
  };
}
