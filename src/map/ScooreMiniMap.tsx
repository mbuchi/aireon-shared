import { useEffect, useMemo, useRef, useState } from 'react';
import type {
  GeoJSONSource,
  LngLatBounds,
  Map as MapboxMap,
  Marker,
  Popup,
} from 'mapbox-gl';
import type mapboxgl from 'mapbox-gl';
import type { ClairePoiMapPoint } from '../claire/clairePOIs';
import type { LocationScore } from '../claire/claireScore';

const LIGHT_STYLE = 'mapbox://styles/mapbox/light-v11';
const DARK_STYLE = 'mapbox://styles/mapbox/dark-v11';
const STATIC_STYLE = 'mapbox/light-v11';
const DEFAULT_ZOOM = 16.5;
const METERS_PER_DEGREE_AT_EQUATOR = 111_319.9;

const PARCEL_TILES_URL = 'https://res-mbtiles-x.gisjoe.com/parcel_2025_07_z12_16';
const PARCEL_SOURCE_LAYER = 'parcel_2025_07';
const PARCEL_ID_PROP = 'parcel_id';

export const SCOORE_RADIUS_CIRCLES = [
  { radius: 100, label: '100 m' },
  { radius: 200, label: '200 m' },
  { radius: 500, label: '500 m' },
];

export const SCOORE_CATEGORY_COLORS: Record<string, string> = {
  Groceries: '#EF4444',
  Food_Dining: '#F97316',
  Utilities: '#14B8A6',
  Public_Services: '#EC4899',
  Health: '#EAB308',
  Transport: '#3B82F6',
  Education: '#0EA5E9',
  Recreation: '#22C55E',
  Community: '#8B5CF6',
  Outdoor: '#10B981',
};

export interface ScooreMiniMapLabels {
  title?: string;
  ariaLabel?: string;
  scoreLabel?: string;
  loading?: string;
  noPoiData?: string;
  source?: string;
}

export interface ScooreMiniMapProps {
  lat: number;
  lng: number;
  mapboxToken: string;
  address?: string;
  points?: ClairePoiMapPoint[];
  score?: LocationScore | null;
  labels?: ScooreMiniMapLabels;
  isDarkMode?: boolean;
  className?: string;
  mapClassName?: string;
  maxInitialPoiDistance?: number;
  preserveDrawingBuffer?: boolean;
}

type MapboxGl = typeof mapboxgl;

export function createScooreCircleGeoJSON(
  centerLng: number,
  centerLat: number,
  radiusMeters: number,
  points = 64,
): GeoJSON.Feature<GeoJSON.Polygon> {
  const coords: [number, number][] = [];
  const latRad = centerLat * (Math.PI / 180);

  for (let i = 0; i <= points; i += 1) {
    const angle = (i / points) * 2 * Math.PI;
    const dLat = (radiusMeters / METERS_PER_DEGREE_AT_EQUATOR) * Math.cos(angle);
    const dLng =
      (radiusMeters / (METERS_PER_DEGREE_AT_EQUATOR * Math.cos(latRad))) *
      Math.sin(angle);
    coords.push([centerLng + dLng, centerLat + dLat]);
  }

  return {
    type: 'Feature',
    properties: {},
    geometry: { type: 'Polygon', coordinates: [coords] },
  };
}

function formatDistance(metres: number): string {
  if (!Number.isFinite(metres)) return '';
  return metres >= 1000 ? `${(metres / 1000).toFixed(1)} km` : `${Math.round(metres)} m`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function staticThumbUrl(lat: number, lng: number, token: string): string {
  const pin = `pin-s+dc2626(${lng},${lat})`;
  return `https://api.mapbox.com/styles/v1/${STATIC_STYLE}/static/${pin}/${lng},${lat},16.5,0/640x360@2x?access_token=${token}`;
}

function addRadiusCircles(map: MapboxMap, lng: number, lat: number): void {
  SCOORE_RADIUS_CIRCLES.forEach(({ radius, label }) => {
    const sourceId = `scoore-mini-radius-${radius}`;
    const fillId = `${sourceId}-fill`;
    const lineId = `${sourceId}-line`;
    const labelId = `${sourceId}-label`;
    const labelSourceId = `${sourceId}-label-src`;
    const geojson = createScooreCircleGeoJSON(lng, lat, radius);
    const source = map.getSource(sourceId) as GeoJSONSource | undefined;

    if (source) {
      source.setData(geojson);
    } else {
      map.addSource(sourceId, { type: 'geojson', data: geojson });
    }

    if (!map.getLayer(fillId)) {
      map.addLayer({
        id: fillId,
        type: 'fill',
        source: sourceId,
        paint: { 'fill-color': '#dc2626', 'fill-opacity': 0.04 },
      });
    }

    if (!map.getLayer(lineId)) {
      map.addLayer({
        id: lineId,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': '#dc2626',
          'line-width': 1.2,
          'line-opacity': 0.5,
          'line-dasharray': [4, 3],
        },
      });
    }

    const labelPoint = createScooreCircleGeoJSON(lng, lat, radius, 1);
    const topCoord = labelPoint.geometry.coordinates[0][0];
    const labelData: GeoJSON.Feature<GeoJSON.Point> = {
      type: 'Feature',
      properties: { label },
      geometry: { type: 'Point', coordinates: topCoord },
    };

    const labelSource = map.getSource(labelSourceId) as GeoJSONSource | undefined;
    if (labelSource) {
      labelSource.setData(labelData);
    } else {
      map.addSource(labelSourceId, { type: 'geojson', data: labelData });
    }

    if (!map.getLayer(labelId)) {
      map.addLayer({
        id: labelId,
        type: 'symbol',
        source: labelSourceId,
        layout: {
          'text-field': ['get', 'label'],
          'text-size': 10,
          'text-font': ['DIN Pro Medium', 'Arial Unicode MS Regular'],
          'text-offset': [0, -0.6],
          'text-anchor': 'bottom',
        },
        paint: {
          'text-color': '#dc2626',
          'text-halo-color': 'rgba(255,255,255,0.9)',
          'text-halo-width': 1.2,
          'text-opacity': 0.78,
        },
      });
    }
  });
}

function addParcelLayers(map: MapboxMap): void {
  if (map.getSource('scoore-mini-parcel-tiles')) return;

  map.addSource('scoore-mini-parcel-tiles', {
    type: 'vector',
    url: PARCEL_TILES_URL,
    promoteId: { [PARCEL_SOURCE_LAYER]: PARCEL_ID_PROP },
  });

  const firstSymbolId = map.getStyle().layers?.find((layer) => layer.type === 'symbol')?.id;

  map.addLayer(
    {
      id: 'scoore-mini-parcel-fill',
      type: 'fill',
      source: 'scoore-mini-parcel-tiles',
      'source-layer': PARCEL_SOURCE_LAYER,
      paint: { 'fill-color': '#000', 'fill-opacity': 0.001 },
    },
    firstSymbolId,
  );
  map.addLayer(
    {
      id: 'scoore-mini-parcel-outline',
      type: 'line',
      source: 'scoore-mini-parcel-tiles',
      'source-layer': PARCEL_SOURCE_LAYER,
      paint: {
        'line-color': '#475569',
        'line-width': ['interpolate', ['linear'], ['zoom'], 12, 0.5, 16, 1.5],
        'line-opacity': 0.75,
      },
    },
    firstSymbolId,
  );
  map.addLayer(
    {
      id: 'scoore-mini-parcel-selected-fill',
      type: 'fill',
      source: 'scoore-mini-parcel-tiles',
      'source-layer': PARCEL_SOURCE_LAYER,
      paint: {
        'fill-color': '#ffffff',
        'fill-opacity': ['case', ['boolean', ['feature-state', 'selected'], false], 0.28, 0],
      },
    },
    firstSymbolId,
  );
  map.addLayer(
    {
      id: 'scoore-mini-parcel-selected-outline',
      type: 'line',
      source: 'scoore-mini-parcel-tiles',
      'source-layer': PARCEL_SOURCE_LAYER,
      paint: {
        'line-color': '#ffffff',
        'line-width': ['case', ['boolean', ['feature-state', 'selected'], false], 2.5, 0],
        'line-opacity': ['case', ['boolean', ['feature-state', 'selected'], false], 1, 0],
      },
    },
    firstSymbolId,
  );
}

function buildPoiPopupHtml(point: ClairePoiMapPoint, color: string): string {
  return [
    '<div style="font-family:system-ui,-apple-system,sans-serif;min-width:180px;max-width:260px;">',
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">',
    `<span style="width:22px;height:22px;border-radius:50%;background:${color};color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">${escapeHtml(point.categoryLabel.slice(0, 1))}</span>`,
    `<span style="font-weight:650;font-size:13px;color:inherit;">${escapeHtml(point.name)}</span>`,
    '</div>',
    '<div style="display:flex;gap:6px;flex-wrap:wrap;">',
    `<span style="font-size:10px;padding:2px 8px;border-radius:9999px;background:${color}20;color:${color};font-weight:600;">${escapeHtml(point.categoryLabel)}</span>`,
    `<span style="font-size:10px;padding:2px 8px;border-radius:9999px;background:rgba(120,120,120,.15);font-weight:600;">${escapeHtml(formatDistance(point.distance))}</span>`,
    '</div>',
    '</div>',
  ].join('');
}

function clearMarkers(markers: Marker[]): void {
  markers.forEach((marker) => marker.remove());
}

export function ScooreMiniMap({
  lat,
  lng,
  mapboxToken,
  address,
  points = [],
  score,
  labels,
  isDarkMode = false,
  className = '',
  mapClassName = 'h-52',
  maxInitialPoiDistance = 2000,
  preserveDrawingBuffer = true,
}: ScooreMiniMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const mapboxRef = useRef<MapboxGl | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const sourceMarkerRef = useRef<Marker | null>(null);
  const popupRef = useRef<Popup | null>(null);
  const selectedParcelIdRef = useRef<string | number | null>(null);
  const [failed, setFailed] = useState(false);

  const validCoords = Number.isFinite(lat) && Number.isFinite(lng) && (lat !== 0 || lng !== 0);
  const sortedPoints = useMemo(
    () =>
      points
        .filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng))
        .slice()
        .sort((a, b) => a.distance - b.distance),
    [points],
  );

  useEffect(() => {
    if (!validCoords || !containerRef.current || !mapboxToken) return;
    let cancelled = false;
    let map: MapboxMap | null = null;

    (async () => {
      try {
        const loaded = await import('mapbox-gl');
        const mod = (loaded.default ?? loaded) as unknown as MapboxGl;
        if (cancelled || !containerRef.current) return;
        mapboxRef.current = mod;
        mod.accessToken = mapboxToken;

        map = new mod.Map({
          container: containerRef.current,
          style: isDarkMode ? DARK_STYLE : LIGHT_STYLE,
          center: [lng, lat],
          zoom: DEFAULT_ZOOM,
          attributionControl: false,
          interactive: true,
          pitch: 0,
          bearing: 0,
          antialias: true,
          preserveDrawingBuffer,
        });
        map.addControl(new mod.AttributionControl({ compact: true }), 'bottom-left');
        mapRef.current = map;

        map.on('style.load', () => {
          if (!map) return;
          addParcelLayers(map);
          addRadiusCircles(map, lng, lat);
        });
        map.on('idle', () => {
          if (!map || !map.getLayer('scoore-mini-parcel-fill')) return;
          const point = map.project([lng, lat]);
          const hit = map.queryRenderedFeatures(point, {
            layers: ['scoore-mini-parcel-fill'],
          })[0];
          const id = hit?.id as string | number | undefined;
          if (id == null || selectedParcelIdRef.current === id) return;
          if (selectedParcelIdRef.current != null) {
            map.setFeatureState(
              {
                source: 'scoore-mini-parcel-tiles',
                sourceLayer: PARCEL_SOURCE_LAYER,
                id: selectedParcelIdRef.current,
              },
              { selected: false },
            );
          }
          selectedParcelIdRef.current = id;
          map.setFeatureState(
            { source: 'scoore-mini-parcel-tiles', sourceLayer: PARCEL_SOURCE_LAYER, id },
            { selected: true },
          );
        });
        map.on('error', () => {});
        requestAnimationFrame(() => {
          if (!cancelled) map?.resize();
        });
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      popupRef.current?.remove();
      clearMarkers(markersRef.current);
      markersRef.current = [];
      sourceMarkerRef.current?.remove();
      map?.remove();
      mapRef.current = null;
      selectedParcelIdRef.current = null;
    };
  }, [validCoords, lat, lng, mapboxToken, isDarkMode, preserveDrawingBuffer]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !validCoords) return;
    const apply = () => addRadiusCircles(map, lng, lat);
    if (map.isStyleLoaded()) apply();
    else map.once('style.load', apply);
  }, [validCoords, lat, lng]);

  useEffect(() => {
    const map = mapRef.current;
    const mapbox = mapboxRef.current;
    if (!map || !mapbox || !validCoords) return;

    sourceMarkerRef.current?.remove();
    const el = document.createElement('div');
    el.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 24 30" fill="none"><path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 18 12 18s12-9 12-18C24 5.4 18.6 0 12 0z" fill="#dc2626"/><circle cx="12" cy="11" r="4.5" fill="white"/></svg>';
    sourceMarkerRef.current = new mapbox.Marker({ element: el, anchor: 'bottom' })
      .setLngLat([lng, lat])
      .addTo(map);

    const bounds = new mapbox.LngLatBounds() as LngLatBounds;
    bounds.extend([lng, lat]);
    sortedPoints.forEach((point) => {
      if (point.distance <= maxInitialPoiDistance) bounds.extend([point.lng, point.lat]);
    });
    map.fitBounds(bounds, { padding: 42, maxZoom: DEFAULT_ZOOM, duration: 500 });
  }, [validCoords, lat, lng, sortedPoints, maxInitialPoiDistance]);

  useEffect(() => {
    const map = mapRef.current;
    const mapbox = mapboxRef.current;
    if (!map || !mapbox) return;

    popupRef.current?.remove();
    clearMarkers(markersRef.current);
    markersRef.current = [];

    sortedPoints.forEach((point, index) => {
      const color = SCOORE_CATEGORY_COLORS[point.category] ?? '#64748b';
      const el = document.createElement('button');
      el.type = 'button';
      el.setAttribute('aria-label', `${point.categoryLabel}: ${point.name}`);
      el.style.cssText =
        'width:24px;height:24px;border:0;padding:0;background:transparent;cursor:pointer;';

      const inner = document.createElement('span');
      inner.style.cssText = `width:24px;height:24px;border-radius:50%;background:${color};color:white;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;border:2px solid rgba(255,255,255,0.92);box-shadow:0 1px 4px rgba(0,0,0,0.35);transition:transform 0.15s ease;`;
      inner.textContent = String(index + 1);
      el.appendChild(inner);
      el.addEventListener('mouseenter', () => {
        inner.style.transform = 'scale(1.2)';
      });
      el.addEventListener('mouseleave', () => {
        inner.style.transform = 'scale(1)';
      });
      el.addEventListener('click', (event) => {
        event.stopPropagation();
        popupRef.current?.remove();
        popupRef.current = new mapbox.Popup({
          offset: 16,
          closeButton: true,
          closeOnClick: true,
          maxWidth: '280px',
          className: 'scoore-popup',
        })
          .setLngLat([point.lng, point.lat])
          .setHTML(buildPoiPopupHtml(point, color))
          .addTo(map);
      });

      markersRef.current.push(new mapbox.Marker({ element: el }).setLngLat([point.lng, point.lat]).addTo(map));
    });
  }, [sortedPoints]);

  if (!validCoords) return null;

  const title = labels?.title ?? 'Scoore mini-map';
  const scoreText =
    score && Number.isFinite(score.total) ? `${score.total.toFixed(1)} / 6` : null;

  return (
    <div
      data-screenshot-ignore="true"
      className={`overflow-hidden rounded-lg ring-1 ring-black/[0.08] dark:ring-white/[0.08] bg-white dark:bg-white/[0.03] shadow-sm ${className}`}
    >
      <div className={`relative w-full bg-gray-100 dark:bg-white/[0.04] ${mapClassName}`}>
        {failed ? (
          <img
            src={staticThumbUrl(lat, lng, mapboxToken)}
            alt={labels?.ariaLabel ?? (address ? `Map of ${address}` : title)}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div
            ref={containerRef}
            className="absolute inset-0"
            aria-label={labels?.ariaLabel ?? (address ? `Map of ${address}` : title)}
          />
        )}
        <div className="absolute left-2 top-2 z-10 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex h-6 items-center rounded-md bg-black/60 px-2 text-[10px] font-semibold text-white backdrop-blur-sm">
            {title}
          </span>
          {scoreText && (
            <span className="inline-flex h-6 items-center rounded-md bg-white/90 px-2 text-[10px] font-bold text-gray-900 ring-1 ring-black/10 backdrop-blur-sm dark:bg-gray-950/85 dark:text-white dark:ring-white/10">
              {(labels?.scoreLabel ?? 'Score')}: {scoreText}
            </span>
          )}
        </div>
        {sortedPoints.length === 0 && (
          <span className="absolute bottom-2 left-2 z-10 rounded-md bg-white/90 px-2 py-1 text-[10px] font-medium text-gray-700 ring-1 ring-black/10 backdrop-blur-sm dark:bg-gray-950/85 dark:text-slate-200 dark:ring-white/10">
            {labels?.noPoiData ?? 'No Scoore POIs loaded yet'}
          </span>
        )}
      </div>
    </div>
  );
}

export default ScooreMiniMap;
