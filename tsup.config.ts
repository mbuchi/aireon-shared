import { defineConfig } from 'tsup';

export default defineConfig({
  // Four entries: the main barrel; a server-safe `/api` subpath that omits
  // the browser-only modules (auth touches `window` at module load); the
  // `/signal-collect` Vercel edge handler (also server-safe); and the
  // `/gemini` model-fallback helper (server-safe, no React).
  entry: [
    'src/index.ts',
    'src/api/index.ts',
    'src/signal/handler.ts',
    'src/errorlog/handler.ts',
    'src/gemini/index.ts',
    // geo.admin.ch address suggestions/geocoding for suite map search boxes.
    'src/geoadmin/index.ts',
    // Side-effect-free parcel-interaction zoom gate — a dedicated subpath so it
    // can be imported in node/test contexts without dragging in the barrel's
    // browser-only modules (auth touches `window` at module load).
    'src/map/parcelInteraction.ts',
    // Engine-agnostic Mapbox-style → MapLibre loader for the maplibre-gl
    // migration (imports neither mapbox-gl nor maplibre-gl, so its own subpath).
    'src/map/maplibreStyle.ts',
    // Shared swisstopo basemap system (restyle engine + 6 basemaps + picker).
    // Dedicated subpath to keep it out of the window-touching auth barrel;
    // maplibre-gl stays an external peer.
    'src/basemap/index.ts',
  ],
  format: ['esm'],
  dts: true,
  clean: true,
  loader: {
    '.webp': 'dataurl',
  },
  onSuccess: 'mkdir -p dist/assets/brand && cp assets/brand/* dist/assets/brand/',
  treeshake: true,
  external: [
    'react',
    'react-dom',
    'lucide-react',
    'maplibre-gl',
    'oidc-client-ts',
    'openapi-fetch',
    '@tanstack/react-table',
    '@tanstack/react-virtual',
    // Optional peer dep, loaded via dynamic import only when an app opts in to
    // OpenReplay session replay. Keep it external so it's never bundled here.
    '@openreplay/tracker',
  ],
});
