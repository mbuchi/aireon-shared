import { IndexedDBCache } from '../cache';

export const GEOADMIN_ADDRESS_SEARCH_ENDPOINT =
  'https://api3.geo.admin.ch/rest/services/ech/SearchServer';

export const GEOADMIN_ADDRESS_SEARCH_CACHE_TTL_MINUTES = 7 * 24 * 60;
export const GEOADMIN_ADDRESS_SEARCH_CACHE_MAX_BYTES = 2 * 1024 * 1024;

export type GeoAdminAddressSearchLanguage = 'de' | 'fr' | 'it' | 'en';

export interface GeoAdminAddressResult {
  id: string;
  label: string;
  lat: number;
  lng: number;
  featureId?: string;
  origin?: string;
  rank?: number;
  weight?: number;
}

export type GeoAdminFetch = (
  input: string,
  init?: RequestInit,
) => Promise<Response>;

export interface GeoAdminAddressSearchOptions {
  signal?: AbortSignal;
  limit?: number;
  minQueryLength?: number;
  lang?: GeoAdminAddressSearchLanguage;
  origins?: string;
  endpoint?: string;
  cache?: IndexedDBCache<GeoAdminAddressResult[]> | false;
  fetcher?: GeoAdminFetch;
}

interface GeoAdminSearchResponse {
  results?: GeoAdminSearchHit[];
}

interface GeoAdminSearchHit {
  id?: number | string;
  weight?: number;
  attrs?: {
    featureId?: number | string;
    label?: string;
    detail?: string;
    lat?: number | string;
    lon?: number | string;
    origin?: string;
    rank?: number | string;
  };
}

const defaultAddressSearchCache = new IndexedDBCache<GeoAdminAddressResult[]>(
  'aireon-geoadmin-address-search',
  'results',
  {
    ttlMinutes: GEOADMIN_ADDRESS_SEARCH_CACHE_TTL_MINUTES,
    maxBytes: GEOADMIN_ADDRESS_SEARCH_CACHE_MAX_BYTES,
  },
);

export function normalizeAddressSearchQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, ' ');
}

function createAbortError(): Error {
  if (typeof DOMException !== 'undefined') {
    return new DOMException('Aborted', 'AbortError');
  }
  const err = new Error('Aborted');
  err.name = 'AbortError';
  return err;
}

function numberOrNull(value: number | string | undefined): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string') {
    const n = Number.parseFloat(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function decodeHtmlEntity(entity: string): string {
  const named: Record<string, string> = {
    '&amp;': '&',
    '&apos;': "'",
    '&gt;': '>',
    '&lt;': '<',
    '&quot;': '"',
    '&#39;': "'",
  };
  if (named[entity]) return named[entity];

  const decimal = entity.match(/^&#(\d+);$/);
  if (decimal) return String.fromCodePoint(Number.parseInt(decimal[1], 10));

  const hex = entity.match(/^&#x([a-fA-F0-9]+);$/);
  if (hex) return String.fromCodePoint(Number.parseInt(hex[1], 16));

  return entity;
}

function cleanGeoAdminLabel(label: string | undefined, fallback: string): string {
  return (label || fallback)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&(?:amp|apos|gt|lt|quot|#39|#\d+|#x[a-fA-F0-9]+);/g, decodeHtmlEntity)
    .replace(/\s+/g, ' ')
    .trim();
}

function buildCacheKey(
  query: string,
  {
    lang = 'de',
    limit = 5,
    origins = 'address',
  }: Pick<GeoAdminAddressSearchOptions, 'lang' | 'limit' | 'origins'>,
): string {
  return [
    'v1',
    lang,
    Math.max(1, limit),
    origins,
    normalizeAddressSearchQuery(query),
  ].join(':');
}

function mapGeoAdminHit(hit: GeoAdminSearchHit): GeoAdminAddressResult | null {
  const attrs = hit.attrs;
  if (!attrs) return null;

  const lat = numberOrNull(attrs.lat);
  const lng = numberOrNull(attrs.lon);
  if (lat === null || lng === null) return null;

  const featureId = attrs.featureId === undefined ? undefined : String(attrs.featureId);
  const origin = attrs.origin || 'address';
  const id = `${origin}:${featureId ?? hit.id ?? `${lat},${lng}`}`;
  const label = cleanGeoAdminLabel(attrs.label, attrs.detail || `${lat}, ${lng}`);
  const rank = numberOrNull(attrs.rank);

  return {
    id,
    label,
    lat,
    lng,
    ...(featureId ? { featureId } : {}),
    ...(origin ? { origin } : {}),
    ...(rank !== null ? { rank } : {}),
    ...(typeof hit.weight === 'number' ? { weight: hit.weight } : {}),
  };
}

/**
 * Search Swiss building addresses through geo.admin.ch SearchServer.
 *
 * The result shape matches the suite's existing address-combobox contract:
 * display `label` while typing, then use `lat`/`lng` directly on selection.
 */
export async function searchGeoAdminAddresses(
  query: string,
  options: GeoAdminAddressSearchOptions = {},
): Promise<GeoAdminAddressResult[]> {
  const trimmed = query.trim();
  const minQueryLength = options.minQueryLength ?? 3;
  if (trimmed.length < minQueryLength) return [];
  if (options.signal?.aborted) throw createAbortError();

  const limit = options.limit ?? 5;
  const lang = options.lang ?? 'de';
  const origins = options.origins ?? 'address';
  const cache = options.cache === false ? null : options.cache ?? defaultAddressSearchCache;
  const cacheKey = buildCacheKey(trimmed, { lang, limit, origins });

  const cached = await cache?.get(cacheKey);
  if (cached) return cached;
  if (options.signal?.aborted) throw createAbortError();

  const url = new URL(options.endpoint ?? GEOADMIN_ADDRESS_SEARCH_ENDPOINT);
  url.searchParams.set('searchText', trimmed);
  url.searchParams.set('type', 'locations');
  url.searchParams.set('origins', origins);
  url.searchParams.set('limit', String(Math.max(1, limit)));
  url.searchParams.set('sr', '4326');
  url.searchParams.set('lang', lang);

  const fetcher = options.fetcher ?? fetch;
  const res = await fetcher(url.toString(), { signal: options.signal });
  if (!res.ok) throw new Error(`geo.admin.ch address search failed: ${res.status}`);

  const data = (await res.json()) as GeoAdminSearchResponse;
  const results = (data.results ?? [])
    .map(mapGeoAdminHit)
    .filter((result): result is GeoAdminAddressResult => result !== null);

  await cache?.set(cacheKey, results);
  return results;
}
