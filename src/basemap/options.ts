import type { StyleSpecification } from 'maplibre-gl';
import { cloneStyle } from './restyle';
import { toLightMinimalStyle, toDarkMinimalStyle, toDarkDetailedStyle } from './specs';

// swisstopo public vector-tile style host — free, no API key (© swisstopo).
// See docs.geo.admin.ch/visualize-data/vector-tiles.html.
export const SWISSTOPO_VT = 'https://vectortiles.geo.admin.ch/styles';
export const SWISSTOPO_BASE_ID = 'swisstopo-base';
export const SWISSTOPO_LIGHT_BASEMAP_ID = 'swisstopo-light';
export const SWISSTOPO_DARK_BASEMAP_ID = 'swisstopo-dark';
export const SWISSTOPO_IMAGERY_ID = 'swisstopo-imagery';
export const LIGHT_MINIMAL_ID = 'light-minimal';
export const DARK_MINIMAL_ID = 'dark-minimal';

export interface BasemapOption {
  id: string;
  // Full swisstopo style.json URL loaded directly by MapLibre (no token).
  styleUrl: string;
  // Optional runtime transform applied to the fetched styleUrl JSON before it
  // reaches MapLibre. Used by Swisstopo Dark to restyle the swisstopo light
  // vector tiles into a dark canvas for the parcel choropleth.
  // When set, resolveBasemapStyle fetches + transforms the JSON instead of
  // handing the bare URL to setStyle.
  styleTransform?: (style: StyleSpecification) => StyleSpecification;
}

export const BASEMAP_OPTIONS: BasemapOption[] = [
  { id: SWISSTOPO_BASE_ID, styleUrl: `${SWISSTOPO_VT}/ch.swisstopo.basemap.vt/style.json` },
  { id: SWISSTOPO_LIGHT_BASEMAP_ID, styleUrl: `${SWISSTOPO_VT}/ch.swisstopo.lightbasemap.vt/style.json` },
  { id: LIGHT_MINIMAL_ID, styleUrl: `${SWISSTOPO_VT}/ch.swisstopo.lightbasemap.vt/style.json`, styleTransform: toLightMinimalStyle },
  { id: SWISSTOPO_DARK_BASEMAP_ID, styleUrl: `${SWISSTOPO_VT}/ch.swisstopo.lightbasemap.vt/style.json`, styleTransform: toDarkDetailedStyle },
  { id: DARK_MINIMAL_ID, styleUrl: `${SWISSTOPO_VT}/ch.swisstopo.lightbasemap.vt/style.json`, styleTransform: toDarkMinimalStyle },
  { id: SWISSTOPO_IMAGERY_ID, styleUrl: `${SWISSTOPO_VT}/ch.swisstopo.imagerybasemap.vt/style.json` },
];

export const themeBasemapId = (isDarkMode: boolean): string => (
  isDarkMode ? SWISSTOPO_DARK_BASEMAP_ID : SWISSTOPO_LIGHT_BASEMAP_ID
);

export const getBasemapOption = (basemapId: string): BasemapOption => (
  BASEMAP_OPTIONS.find((b) => b.id === basemapId) ?? BASEMAP_OPTIONS[0]
);

// Cache + fetch for raw, MapLibre-native style.json (the swisstopo vector
// basemaps). These need no token shim. We only fetch them here when a
// styleTransform has to mutate the JSON before it reaches the map. Re-selecting
// a basemap then reuses the cached fetch.
const rawStyleCache = new globalThis.Map<string, Promise<StyleSpecification>>();
async function fetchStyleJson(url: string): Promise<StyleSpecification> {
  if (!rawStyleCache.has(url)) {
    rawStyleCache.set(url, fetch(url).then(async (response) => {
      if (!response.ok) throw new Error(`Style ${url} failed with ${response.status}`);
      return await response.json() as StyleSpecification;
    }));
  }
  return cloneStyle(await rawStyleCache.get(url)!);
}

export async function resolveBasemapStyle(basemap: BasemapOption): Promise<string | StyleSpecification> {
  return basemap.styleTransform
    ? basemap.styleTransform(await fetchStyleJson(basemap.styleUrl))
    : basemap.styleUrl;
}
