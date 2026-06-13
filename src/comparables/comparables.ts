// Ranking helper for the "Nearby comparables" section of the parcel info
// panel. Given the active parcel and a pool of nearby parcels (typically
// pulled from the rendered map via the host app's queryParcelsAround /
// map.queryRenderedFeatures), pick up to `limit` candidates that have
// estimated_price_m2 set and rank them by a similarity score blending
// distance, plot area, and zone match.
//
// Pure logic — no React, no DOM, no map engine. Safe to import in tests and
// node contexts via the `@aireon/shared/comparables` subpath.

export interface ComparableInput {
  /** Reference parcel — typically the one open in the info panel. */
  ref: {
    lng: number;
    lat: number;
    properties: Record<string, unknown>;
  };
  /** Candidate pool from the map viewport. */
  pool: Array<{
    lng: number;
    lat: number;
    properties: Record<string, unknown>;
  }>;
  /** Max results. */
  limit?: number;
  /** Only consider parcels with `is_sell` true; default true. */
  onlyForSale?: boolean;
}

export interface Comparable {
  parcelId: string;
  lng: number;
  lat: number;
  distanceM: number;
  priceM2: number;
  area: number | null;
  zone: string | null;
  city: string | null;
  similarity: number;
  properties: Record<string, unknown>;
}

function num(props: Record<string, unknown>, keys: string[]): number | null {
  for (const key of keys) {
    const v = props[key];
    if (v === null || v === undefined || v === '') continue;
    const n = typeof v === 'number' ? v : Number(v);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function str(props: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const v = props[key];
    if (v === null || v === undefined || v === '') continue;
    return String(v);
  }
  return null;
}

function isForSale(props: Record<string, unknown>): boolean {
  const v = props.is_sell;
  return v === true || v === 1 || v === 'true' || v === 'yes' || v === '1';
}

/**
 * Haversine distance in metres between two WGS84 points.
 */
function distanceMeters(a: [number, number], b: [number, number]): number {
  const R = 6_371_000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[1] - a[1]);
  const dLng = toRad(b[0] - a[0]);
  const sa =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[1])) * Math.cos(toRad(b[1])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(sa));
}

export function rankComparables(input: ComparableInput): Comparable[] {
  const { ref, pool, limit = 5, onlyForSale = true } = input;
  const refId = String(ref.properties.parcel_id ?? ref.properties.egrid ?? '');
  const refArea = num(ref.properties, [
    'area_m2',
    'parcel_area',
    'flaeche',
    'grundflaeche',
    'area',
  ]);
  const refZone = str(ref.properties, [
    'cz_local',
    'construction_zone',
    'bauzone',
    'nutzungszone',
  ]);

  const candidates: Comparable[] = [];

  for (const c of pool) {
    const id = String(c.properties.parcel_id ?? c.properties.egrid ?? '');
    if (!id || id === refId) continue;
    if (onlyForSale && !isForSale(c.properties)) continue;
    const priceM2 = num(c.properties, ['estimated_price_m2', 'price_m2']);
    if (priceM2 == null) continue;

    const distance = distanceMeters([ref.lng, ref.lat], [c.lng, c.lat]);
    const area = num(c.properties, [
      'area_m2',
      'parcel_area',
      'flaeche',
      'grundflaeche',
      'area',
    ]);
    const zone = str(c.properties, [
      'cz_local',
      'construction_zone',
      'bauzone',
      'nutzungszone',
    ]);

    // Similarity score, higher is better. 0..1 each component, weighted.
    const distScore = 1 / (1 + distance / 200); // 200 m half-life
    const areaScore =
      refArea && area
        ? 1 - Math.min(1, Math.abs(Math.log(area / refArea)))
        : 0.5;
    const zoneScore = refZone && zone ? (refZone === zone ? 1 : 0.4) : 0.5;

    const similarity = distScore * 0.5 + areaScore * 0.3 + zoneScore * 0.2;

    candidates.push({
      parcelId: id,
      lng: c.lng,
      lat: c.lat,
      distanceM: distance,
      priceM2,
      area,
      zone,
      city:
        str(c.properties, ['city', 'ort', 'cityname', 'municipality', 'fso_name_2021']),
      similarity,
      properties: c.properties,
    });
  }

  candidates.sort((a, b) => b.similarity - a.similarity);
  return candidates.slice(0, limit);
}
