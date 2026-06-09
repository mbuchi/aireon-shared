/**
 * Suite-wide parcel-interaction zoom gate.
 *
 * The Aireon map-first apps render parcel vector tiles at z12–16 and open the
 * map at ~z16.5. Below ~block level the viewport fills with thousands of tiny
 * parcels: they're too small to target precisely, a click almost always lands
 * on the "wrong" parcel, and per-mousemove hover work re-tessellates the hover
 * layer each frame (which pegs low-spec CPUs). So across the suite we treat a
 * zoomed-out map as read-only overview context and switch parcel interaction —
 * BOTH the hover-highlight and click-to-select — off until the user zooms in
 * past this floor.
 *
 * One constant, one place: change `PARCEL_INTERACTION_MIN_ZOOM` here and every
 * map-first app that imports it moves together. This is the single source of
 * truth the per-app gates share, so hover and click can never drift apart.
 */
declare const PARCEL_INTERACTION_MIN_ZOOM = 15;
/** True when the map is zoomed in far enough for parcel hover + click-to-select.
 *  Apps guard their live map-click handler with this; address-search and
 *  ?lat/?lng deep-links fly the map in first, so those selection paths stay
 *  unaffected and should NOT be gated. */
declare function isParcelInteractive(zoom: number): boolean;
/**
 * Minimal structural view of a Mapbox `Map` — only what the click gate needs —
 * so `@aireon/shared` keeps `mapbox-gl` an OPTIONAL peer dependency and never
 * imports it at runtime. A real `mapbox-gl` Map satisfies this shape, as does
 * any object exposing `getZoom`/`on`/`off`.
 */
interface ZoomGatedClickMap {
    getZoom(): number;
    on(type: 'click', layer: string, listener: (ev: unknown) => void): unknown;
    off(type: 'click', layer: string, listener: (ev: unknown) => void): unknown;
}
/**
 * Wire a zoom-gated, layer-scoped parcel click. `onSelect` fires only when the
 * map is at/above {@link PARCEL_INTERACTION_MIN_ZOOM}, mirroring the hover gate,
 * so a zoomed-out overview map ignores parcel clicks. Returns an unbind fn.
 *
 * Convenience for apps whose click is a clean `map.on('click', layerId, cb)`.
 * Apps with an unlayered `map.on('click', cb)` (whole-map hit-test) or a
 * non-Mapbox map should instead guard their existing handler directly with
 * `if (!isParcelInteractive(map.getZoom())) return;` — identical behavior.
 *
 * Unlike hover (which fires on every mousemove and is fully detached when
 * zoomed out for perf), clicks are rare, so we keep the listener bound and just
 * check the zoom inside it — the simplest correct thing.
 */
declare function wireZoomGatedParcelClick<Ev = unknown>(map: ZoomGatedClickMap, layerId: string, onSelect: (ev: Ev) => void): () => void;

export { PARCEL_INTERACTION_MIN_ZOOM, type ZoomGatedClickMap, isParcelInteractive, wireZoomGatedParcelClick };
