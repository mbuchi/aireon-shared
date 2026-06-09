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
interface MapboxStyleLike {
    glyphs?: string;
    sprite?: string | Array<{
        id: string;
        url: string;
    }>;
    sources?: Record<string, {
        url?: string;
        tiles?: string[];
    }>;
    [key: string]: unknown;
}
interface LoadMapboxStyleOptions {
    /** Mapbox public token (`pk.…`, safe to ship client-side). Appended as
     *  `access_token` to every resolved Mapbox URL (style document, glyphs,
     *  sprite, vector tiles). */
    token: string;
}
/** Rewrite a single `mapbox://…` resource URL to its https Mapbox-API equivalent
 *  (+ token). A URL that isn't `mapbox://` passes through untouched, so calling
 *  this on an already-resolved style is a no-op. */
declare function normalizeMapboxResourceUrl(url: string, token: string): string;
/** Rewrite every `mapbox://` reference inside a fetched style document (glyphs,
 *  sprite, source `url`/`tiles`) to https + token and strip Mapbox account
 *  metadata, so MapLibre can consume it directly. Returns a new object; the
 *  input is left untouched. */
declare function normalizeMapboxStyle(style: MapboxStyleLike, token: string): MapboxStyleLike;
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
declare function loadMapboxStyleForMapLibre(style: string, { token }: LoadMapboxStyleOptions): Promise<MapboxStyleLike>;

export { type LoadMapboxStyleOptions, type MapboxStyleLike, loadMapboxStyleForMapLibre, normalizeMapboxResourceUrl, normalizeMapboxStyle };
