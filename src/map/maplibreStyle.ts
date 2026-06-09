/**
 * Mapbox-hosted style → MapLibre loader (the suite's maplibre-gl migration helper).
 *
 * The Aireon map-first apps are migrating their renderer from `mapbox-gl` to the
 * open-source `maplibre-gl` while keeping the same Mapbox-hosted basemap styles
 * (Streets / Satellite / Light / Dark / …). MapLibre does NOT understand the
 * `mapbox://` URL scheme or Mapbox's implicit access-token handling, so a style
 * referenced as `mapbox://styles/mapbox/dark-v11` must be (a) fetched from the
 * Mapbox Styles REST API as a concrete style document and (b) rewritten so every
 * `mapbox://` glyphs / sprite / source / tile URL inside it becomes a plain https
 * URL carrying `?access_token=…`. This module does exactly that, with a per-style
 * promise cache so toggling a basemap back and forth doesn't refetch.
 *
 * Engine-agnostic on purpose: it only transforms strings + a plain style-JSON
 * object and `fetch`es, so `@aireon/shared` imports NEITHER mapbox-gl NOR
 * maplibre-gl at runtime (both stay OPTIONAL peer deps — same principle as
 * `parcelInteraction.ts`). The returned object is structurally a MapLibre
 * `StyleSpecification`; the calling app casts it at the boundary:
 *
 *   import { loadMapboxStyleForMapLibre } from '@aireon/shared';
 *   import maplibregl, { type StyleSpecification } from 'maplibre-gl';
 *
 *   const style = await loadMapboxStyleForMapLibre(
 *     'mapbox://styles/mapbox/dark-v11', { token: MAPBOX_TOKEN },
 *   );
 *   const map = new maplibregl.Map({
 *     container, style: style as unknown as StyleSpecification,
 *   });
 *   // basemap swap:
 *   map.setStyle(await loadMapboxStyleForMapLibre(basemap.style, { token: MAPBOX_TOKEN }) as unknown as StyleSpecification);
 *
 * One place owns the `mapbox://` → https rewrite for the whole suite, so all the
 * migrating apps stay consistent and the gnarly URL logic lives exactly once.
 */

/** Minimal structural view of a Mapbox/MapLibre style document — only the fields
 *  this loader rewrites. A freshly-fetched Mapbox style satisfies this, as does a
 *  MapLibre `StyleSpecification`. */
export interface MapboxStyleLike {
  glyphs?: string;
  sprite?: string | Array<{ id: string; url: string }>;
  sources?: Record<string, { url?: string; tiles?: string[] }>;
  [key: string]: unknown;
}

export interface LoadMapboxStyleOptions {
  /** Mapbox public token (`pk.…`, safe to ship client-side). Appended as
   *  `access_token` to every resolved Mapbox URL (style document, glyphs,
   *  sprite, vector tiles). */
  token: string;
}

// Mapbox style documents carry editor/account metadata that MapLibre warns about
// (and rejects under strict validation); strip the known account-scoped keys.
const MAPBOX_STYLE_METADATA_KEYS = [
  'created',
  'modified',
  'id',
  'owner',
  'visibility',
  'protected',
  'draft',
  'name',
  'fog',
  'projection',
] as const;

const styleCache = new Map<string, Promise<MapboxStyleLike>>();

function addToken(url: string, token: string): string {
  return `${url}${url.includes('?') ? '&' : '?'}access_token=${token}`;
}

/** Rewrite a single `mapbox://…` resource URL to its https Mapbox-API equivalent
 *  (+ token). A URL that isn't `mapbox://` passes through untouched, so calling
 *  this on an already-resolved style is a no-op. */
export function normalizeMapboxResourceUrl(url: string, token: string): string {
  if (!url.startsWith('mapbox://')) return url;

  const resource = url.slice('mapbox://'.length);
  if (resource.startsWith('fonts/')) {
    const [, owner, ...rest] = resource.split('/');
    return addToken(`https://api.mapbox.com/fonts/v1/${owner}/${rest.join('/')}`, token);
  }

  if (resource.startsWith('sprites/')) {
    const [, owner, styleId, ...rest] = resource.split('/');
    const extraPath = rest.length > 0 ? `/${rest.join('/')}` : '';
    return addToken(`https://api.mapbox.com/styles/v1/${owner}/${styleId}/sprite${extraPath}`, token);
  }

  if (resource.startsWith('styles/')) {
    const [, owner, styleId] = resource.split('/');
    return addToken(`https://api.mapbox.com/styles/v1/${owner}/${styleId}`, token);
  }

  // Tileset reference (`mapbox://mapbox.satellite`, `mapbox://owner.tileset`, …)
  // → its TileJSON document.
  return addToken(`https://api.mapbox.com/v4/${resource}.json?secure=true`, token);
}

function cloneStyle(style: MapboxStyleLike): MapboxStyleLike {
  return JSON.parse(JSON.stringify(style)) as MapboxStyleLike;
}

/** Rewrite every `mapbox://` reference inside a fetched style document (glyphs,
 *  sprite, source `url`/`tiles`) to https + token and strip Mapbox account
 *  metadata, so MapLibre can consume it directly. Returns a new object; the
 *  input is left untouched. */
export function normalizeMapboxStyle(style: MapboxStyleLike, token: string): MapboxStyleLike {
  const next = cloneStyle(style);
  for (const key of MAPBOX_STYLE_METADATA_KEYS) {
    delete (next as Record<string, unknown>)[key];
  }

  if (typeof next.glyphs === 'string') {
    next.glyphs = normalizeMapboxResourceUrl(next.glyphs, token);
  }

  if (typeof next.sprite === 'string') {
    next.sprite = normalizeMapboxResourceUrl(next.sprite, token);
  } else if (Array.isArray(next.sprite)) {
    next.sprite = next.sprite.map((sprite) => ({
      ...sprite,
      url: normalizeMapboxResourceUrl(sprite.url, token),
    }));
  }

  for (const source of Object.values(next.sources ?? {})) {
    if (typeof source.url === 'string') {
      source.url = normalizeMapboxResourceUrl(source.url, token);
    }
    if (Array.isArray(source.tiles)) {
      source.tiles = source.tiles.map((tile) => normalizeMapboxResourceUrl(tile, token));
    }
  }

  return next;
}

/** Turn a `mapbox://styles/{owner}/{styleId}` (or already-https) style reference
 *  into the concrete Mapbox Styles-API URL the style document is fetched from. */
function styleDocumentUrl(style: string, token: string): string {
  if (style.startsWith('mapbox://styles/')) {
    const [owner, styleId] = style.slice('mapbox://styles/'.length).split('/');
    return addToken(`https://api.mapbox.com/styles/v1/${owner}/${styleId}`, token);
  }
  if (style.startsWith('mapbox://')) {
    return normalizeMapboxResourceUrl(style, token);
  }
  // Already an https style URL — make sure it carries the token.
  return style.includes('access_token=') ? style : addToken(style, token);
}

/**
 * Fetch a Mapbox-hosted style and return a MapLibre-ready style object (every
 * `mapbox://` resource rewritten to https + token, account metadata stripped).
 * Cached per `(style, token)` so toggling basemaps back and forth is instant. A
 * failed fetch is evicted from the cache so a later call can retry.
 *
 * `style` accepts a `mapbox://styles/{owner}/{id}` reference (e.g.
 * `mapbox://styles/mapbox/dark-v11`) or a full https style URL. The result is
 * structurally a MapLibre `StyleSpecification` — cast it at the call site.
 */
export async function loadMapboxStyleForMapLibre(
  style: string,
  { token }: LoadMapboxStyleOptions,
): Promise<MapboxStyleLike> {
  const cacheKey = `${style}::${token}`;
  if (!styleCache.has(cacheKey)) {
    const url = styleDocumentUrl(style, token);
    styleCache.set(
      cacheKey,
      fetch(url)
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(`Mapbox style "${style}" failed to load (${response.status})`);
          }
          return normalizeMapboxStyle((await response.json()) as MapboxStyleLike, token);
        })
        .catch((error) => {
          // Don't poison the cache with a permanent rejection — let a retry refetch.
          styleCache.delete(cacheKey);
          throw error;
        }),
    );
  }
  // Hand back a fresh clone each call: MapLibre mutates the style object it's
  // given, so a shared cached copy must never be passed out directly.
  return cloneStyle(await styleCache.get(cacheKey)!);
}
