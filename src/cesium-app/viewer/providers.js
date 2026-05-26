// Cesium provider factories.
//
// Terrain stays on swisstopo's high-resolution Swiss DEM tileset — that's the
// authoritative source for the country and feeds the building footprints +
// the precise sun-on-roof analysis.
//
// Imagery switched in v0.3.7 from swisstopo's `karte-farbe` topographic tiles
// (Swiss-only, level 17 max) to **Esri ArcGIS World Imagery** (global, level
// 23 max). The satellite imagery looks dramatically richer at the zoom levels
// hood actually uses, and Esri's `services.arcgisonline.com` endpoint serves
// these tiles without an API key. The trade-off is that the satellite frames
// have baked-in solar shadows — when the day-tour runs we swap to **ArcGIS
// World Hillshade** (terrain shading only, no sun) so the dynamic shadows we
// cast read cleanly.
//
// Both ArcGIS providers are global / Web Mercator and Cesium figures out the
// tiling scheme + LOD levels from the service metadata.

const ARCGIS_IMAGERY_URL =
    'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer';

const ARCGIS_HILLSHADE_URL =
    'https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer';

const ARCGIS_STREETS_URL =
    'https://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer';

const ARCGIS_LIGHT_URL =
    'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer';

const ARCGIS_DARK_URL =
    'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer';

export async function createTerrainProvider() {
    return await Cesium.CesiumTerrainProvider.fromUrl(
        '//3d.geo.admin.ch/ch.swisstopo.terrain.3d/v1/',
        {
            credit: new Cesium.Credit(
                '<a href="https://www.swisstopo.ch/" target="_blank">&copy; swisstopo</a> ',
                true
            )
        }
    );
}

// Cesium World Terrain (Ion asset id 1). Requires a valid
// Cesium.Ion.defaultAccessToken. Paired with the OSM Buildings preset so the
// global tileset has matching global terrain.
export async function createCesiumWorldTerrainProvider() {
    return await Cesium.createWorldTerrainAsync();
}

// Google Photorealistic 3D Tiles — global photogrammetric mesh that includes
// its own terrain and imagery. Requires a Google Maps Platform "Map Tiles
// API" key in VITE_GOOGLE_MAPS_API_KEY. When this preset is active the
// imagery globe + the Swiss / OSM building tilesets are hidden, since the
// Google tiles already cover everything.
export async function createGooglePhotorealisticTileset() {
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!key) {
        throw new Error('VITE_GOOGLE_MAPS_API_KEY is not set');
    }
    return await Cesium.Cesium3DTileset.fromUrl(
        `https://tile.googleapis.com/v1/3dtiles/root.json?key=${encodeURIComponent(key)}`,
        { showCreditsOnScreen: true }
    );
}

export async function createImageryProvider() {
    return await Cesium.ArcGisMapServerImageryProvider.fromUrl(ARCGIS_IMAGERY_URL, {
        enablePickFeatures: false
    });
}

export async function createHillshadeImageryProvider() {
    return await Cesium.ArcGisMapServerImageryProvider.fromUrl(ARCGIS_HILLSHADE_URL, {
        enablePickFeatures: false
    });
}

export async function createStreetsImageryProvider() {
    return await Cesium.ArcGisMapServerImageryProvider.fromUrl(ARCGIS_STREETS_URL, {
        enablePickFeatures: false
    });
}

export async function createLightImageryProvider() {
    return await Cesium.ArcGisMapServerImageryProvider.fromUrl(ARCGIS_LIGHT_URL, {
        enablePickFeatures: false
    });
}

export async function createDarkImageryProvider() {
    return await Cesium.ArcGisMapServerImageryProvider.fromUrl(ARCGIS_DARK_URL, {
        enablePickFeatures: false
    });
}

// swisstopo "pixelkarte-farbe" — the authoritative Swiss topographic map.
// WMTS, Web Mercator (EPSG:3857), tiled at zoom 0–19. Anonymous access is OK
// for non-commercial / interactive use per swisstopo's terms; the credit
// banner Cesium renders satisfies the attribution requirement.
export async function createSwissTopoImageryProvider() {
    return new Cesium.UrlTemplateImageryProvider({
        url: 'https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg',
        minimumLevel: 0,
        maximumLevel: 19,
        credit: new Cesium.Credit(
            '<a href="https://www.swisstopo.ch/" target="_blank">&copy; swisstopo</a>',
            true
        )
    });
}

export function getCesiumTileset() {
    return Cesium.Cesium3DTileset.fromUrl(
        '//vectortiles.geo.admin.ch/3d-tiles/ch.swisstopo.swisstlm3d.3d/20201020/tileset.json'
    );
}
