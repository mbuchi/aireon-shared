// Suite-wide municipality-flag client.
//
// Every Swiss municipality has a flag (SVG + optional rasterised PNG) stored on
// Vercel Blob and indexed in the roolez `municipality_flags` table by `bfs_code`
// (the federal BFS municipality number) and `canton`. The roolez backend lives
// in project_RES and exposes a wide-open-CORS read surface under
// `/roolez_api/*`, so ANY swissnovo app can fetch a flag straight from the
// browser without a token or a per-app proxy.
//
// This module is the single consumable client for that surface. It wraps the
// three public read endpoints, de-dupes concurrent requests, and keeps a small
// front-of-cache (in-memory + localStorage) so repeated lookups for the same
// municipality cost zero network. It also generalises roolez-api's internal
// `svgUtils.fetchSvgMarkup` into a reusable helper so callers that need the raw
// SVG markup (inline render, recolour, export) share one cached round-trip.
//
// Flags are keyed by BFS municipality code and canton — there is no
// country-code dimension (the dataset is Swiss-only). Callers that have a
// canton abbreviation (e.g. "ZH") or a BFS code resolve a flag directly; a
// municipality name is not a lookup key.

import { LocalStorageCache } from '../cache/clientCache';

/** Which stored asset to resolve: the original (usually SVG) or the PNG raster. */
export type FlagImageMode = 'original' | 'png';

/** One municipality flag record, mirroring the roolez_api response envelope. */
export interface FlagRecord {
  /** Federal BFS municipality number (e.g. 261 = Zürich). */
  bfs_code: number;
  /** Municipality name as held in the roolez dataset. */
  municipality_name: string;
  /** Two-letter canton abbreviation, uppercase (e.g. "ZH"). */
  canton: string;
  /** Public Vercel Blob URL of the original asset (`.svg` for most), or null. */
  storage_url: string | null;
  /** Public Vercel Blob URL of the rasterised PNG, or null when not generated. */
  png_storage_url: string | null;
  /** Edge length in px of the square PNG, or null. */
  png_size: number | null;
  /** The URL for the requested `imageMode` — the field most callers render. */
  flag_url: string | null;
  /** Echoes the resolved image mode. */
  imageMode: FlagImageMode;
}

export interface FlagFetchOptions {
  /** `'original'` (default) returns the SVG blob; `'png'` returns the raster. */
  imageMode?: FlagImageMode;
  /** Override the roolez_api base URL (defaults to {@link getFlagApiBase}). */
  apiBase?: string;
  /** Skip the local front-of-cache for this call (always hit the network). */
  noCache?: boolean;
}

/** Raised when a flag fetch hits a transport/HTTP error (not a 404 "no flag"). */
export class FlagApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'FlagApiError';
  }
}

// ---------------------------------------------------------------------------
// Base URL
// ---------------------------------------------------------------------------

const DEFAULT_FLAG_API_BASE = 'https://res.zeroo.ch/roolez_api';
let flagApiBase = DEFAULT_FLAG_API_BASE;

/** Current roolez_api base URL used by this client. */
export function getFlagApiBase(): string {
  return flagApiBase;
}

/**
 * Override the roolez_api base URL process-wide (e.g. to point at a preview or
 * a self-hosted RES). Trailing slashes are stripped. Pass nothing or an empty
 * string to reset to the default.
 */
export function setFlagApiBase(base?: string | null): void {
  flagApiBase = (base && base.trim()) ? base.replace(/\/+$/, '') : DEFAULT_FLAG_API_BASE;
}

// ---------------------------------------------------------------------------
// Caches (front-of-cache; the backend has its own Redis layer)
// ---------------------------------------------------------------------------

// Metadata is tiny (a few hundred bytes per record) and stable, so a 24h
// localStorage TTL is plenty and survives reloads. In-memory promise maps
// collapse concurrent identical lookups into one round-trip.
const metaCache = new LocalStorageCache<FlagRecord | null>('swissnovo-flags', 24 * 60);
const recordPromises = new Map<string, Promise<FlagRecord | null>>();
const listPromises = new Map<string, Promise<FlagRecord[]>>();

const svgMarkupCache = new Map<string, string | null>();
const svgMarkupPromises = new Map<string, Promise<string | null>>();

/** Clear every in-memory and persisted flag cache (testing / cache-busting). */
export function clearFlagCache(): void {
  metaCache.clear();
  recordPromises.clear();
  listPromises.clear();
  svgMarkupCache.clear();
  svgMarkupPromises.clear();
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function normaliseMode(mode?: FlagImageMode): FlagImageMode {
  return mode === 'png' ? 'png' : 'original';
}

async function getJson(url: string): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(url);
  } catch (err) {
    throw new FlagApiError(
      `Flag request failed: ${err instanceof Error ? err.message : 'network error'}`,
    );
  }
  if (response.status === 404) return { __notFound: true };
  if (!response.ok) {
    throw new FlagApiError(`Flag request failed with ${response.status}`, response.status);
  }
  return response.json();
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Resolve the flag for a single municipality by its BFS code.
 *
 * Returns the {@link FlagRecord} (whose `flag_url` is the asset for the
 * requested `imageMode`), or `null` when no flag exists for that code (or no
 * PNG exists in `'png'` mode). Throws {@link FlagApiError} only on transport or
 * server errors — a missing flag is `null`, never a throw.
 */
export async function getFlagByBfs(
  bfsCode: number,
  options: FlagFetchOptions = {},
): Promise<FlagRecord | null> {
  const mode = normaliseMode(options.imageMode);
  const base = (options.apiBase ?? flagApiBase).replace(/\/+$/, '');
  const cacheKey = `bfs:${base}:${bfsCode}:${mode}`;

  if (!options.noCache) {
    const cached = metaCache.get(cacheKey);
    if (cached !== null) return cached;
    const inflight = recordPromises.get(cacheKey);
    if (inflight) return inflight;
  }

  const promise = (async () => {
    const url = `${base}/get-flags-by-bfs-code?bfs_code=${encodeURIComponent(bfsCode)}&imageMode=${mode}`;
    const body = (await getJson(url)) as
      | { data?: FlagRecord; error?: string; __notFound?: boolean }
      | undefined;
    const record = body && !body.__notFound && body.data ? body.data : null;
    if (!options.noCache) metaCache.set(cacheKey, record);
    return record;
  })().finally(() => recordPromises.delete(cacheKey));

  if (!options.noCache) recordPromises.set(cacheKey, promise);
  return promise;
}

/**
 * Resolve every flag in a canton, ordered by BFS code. In `'png'` mode only
 * municipalities with a generated PNG are returned. Returns `[]` on error or
 * for an unknown canton.
 */
export async function getFlagsByCanton(
  canton: string,
  options: FlagFetchOptions = {},
): Promise<FlagRecord[]> {
  const mode = normaliseMode(options.imageMode);
  const base = (options.apiBase ?? flagApiBase).replace(/\/+$/, '');
  const code = canton.trim().toUpperCase();
  const cacheKey = `canton:${base}:${code}:${mode}`;

  if (!options.noCache) {
    const inflight = listPromises.get(cacheKey);
    if (inflight) return inflight;
  }

  const promise = (async () => {
    const url = `${base}/get-flags-by-canton?canton=${encodeURIComponent(code)}&imageMode=${mode}`;
    const body = (await getJson(url)) as { data?: FlagRecord[]; __notFound?: boolean } | undefined;
    return body && !body.__notFound && Array.isArray(body.data) ? body.data : [];
  })().finally(() => listPromises.delete(cacheKey));

  if (!options.noCache) listPromises.set(cacheKey, promise);
  return promise;
}

/**
 * Resolve every flag in the dataset (~2,000 municipalities), ordered by BFS
 * code. This is a large response; prefer {@link getFlagByBfs} /
 * {@link getFlagsByCanton} for targeted lookups. Returns `[]` on error.
 */
export async function getAllFlags(options: FlagFetchOptions = {}): Promise<FlagRecord[]> {
  const mode = normaliseMode(options.imageMode);
  const base = (options.apiBase ?? flagApiBase).replace(/\/+$/, '');
  const cacheKey = `all:${base}:${mode}`;

  if (!options.noCache) {
    const inflight = listPromises.get(cacheKey);
    if (inflight) return inflight;
  }

  const promise = (async () => {
    const url = `${base}/get-all-flags?imageMode=${mode}`;
    const body = (await getJson(url)) as { data?: FlagRecord[]; __notFound?: boolean } | undefined;
    return body && !body.__notFound && Array.isArray(body.data) ? body.data : [];
  })().finally(() => listPromises.delete(cacheKey));

  if (!options.noCache) listPromises.set(cacheKey, promise);
  return promise;
}

/** True when a blob URL points at an SVG asset (its path ends in `.svg`). */
export function isSvgFlagUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.split('?')[0].toLowerCase().endsWith('.svg');
}

/**
 * Fetch the raw SVG markup for a flag from its `.svg` blob URL, with in-memory
 * de-duplication and caching so concurrent callers (inline render, recolour,
 * ZIP export) share one network round-trip. Returns `null` when the URL is not
 * an SVG blob or the fetch fails.
 *
 * This is the generalised, app-agnostic form of roolez-api's internal
 * `svgUtils.fetchSvgMarkup` — the "SVG flag extraction helper / flag cache"
 * any suite app can now import instead of reimplementing.
 */
export async function fetchFlagSvgMarkup(url: string | null | undefined): Promise<string | null> {
  if (!isSvgFlagUrl(url)) return null;
  const key = url as string;
  if (svgMarkupCache.has(key)) return svgMarkupCache.get(key) ?? null;
  const inflight = svgMarkupPromises.get(key);
  if (inflight) return inflight;

  const promise = (async () => {
    try {
      const response = await fetch(key);
      if (!response.ok) return null;
      const text = await response.text();
      const markup = text.trim().startsWith('<') ? text : null;
      svgMarkupCache.set(key, markup);
      return markup;
    } catch {
      return null;
    } finally {
      svgMarkupPromises.delete(key);
    }
  })();

  svgMarkupPromises.set(key, promise);
  return promise;
}
