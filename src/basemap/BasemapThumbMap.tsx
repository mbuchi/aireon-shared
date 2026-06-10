import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import type { BasemapOption } from './options';
import { resolveBasemapStyle } from './options';

// Centre of the gallery thumbnails — a dense Zürich block so the four styles
// read as a true side-by-side comparison (streets, water, buildings all visible).
const BASEMAP_THUMB_CENTER: [number, number] = [8.5417, 47.3769];
const BASEMAP_THUMB_ZOOM = 12.2;

// A tiny, non-interactive LIVE preview of a basemap, rendered through the exact
// same style resolution as the main map — so the custom Swisstopo Dark restyle
// previews accurately (no static-image API matches the swisstopo vector styles).
// Mounted only while the gallery is open and removed on close, so each preview's
// WebGL context is short-lived (≤4 extra contexts alongside the main map).
export const BasemapThumbMap = ({ basemap }: { basemap: BasemapOption }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    let map: maplibregl.Map | null = null;
    let ro: ResizeObserver | null = null;
    let cancelled = false;
    setReady(false);
    void resolveBasemapStyle(basemap)
      .then((style) => {
        if (cancelled || !containerRef.current) return;
        const container = containerRef.current;
        map = new maplibregl.Map({
          container,
          style,
          center: BASEMAP_THUMB_CENTER,
          zoom: BASEMAP_THUMB_ZOOM,
          interactive: false,
          attributionControl: false,
          fadeDuration: 0,
        });
        const created = map;
        created.on('load', () => { if (!cancelled) setReady(true); });
        // The gallery opens dynamically, so MapLibre can capture a 0×0 container
        // at creation — for basemaps whose style resolves in a microtask the
        // thumb's aspect-ratio height isn't laid out yet, leaving a blank canvas
        // that never repaints. Resize once the container has real dimensions (the
        // observer fires on the initial measure and any later layout change).
        ro = new ResizeObserver(() => { try { created.resize(); } catch { /* removed */ } });
        ro.observe(container);
      })
      .catch(() => { /* WebGL unavailable / style error — leave the skeleton */ });
    return () => {
      cancelled = true;
      ro?.disconnect();
      map?.remove();
    };
  }, [basemap]);

  // Semantic class names (defined in basemap.css) rather than Tailwind utilities
  // so the live preview renders identically in non-Tailwind hosts (e.g. goody).
  return (
    <>
      <div ref={containerRef} className="aireon-bm__thumbcanvas" />
      {!ready && <div className="aireon-bm__thumbskel" />}
    </>
  );
};
