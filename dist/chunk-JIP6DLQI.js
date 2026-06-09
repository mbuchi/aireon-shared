// src/map/maplibreStyle.ts
var MAPBOX_STYLE_METADATA_KEYS = [
  "created",
  "modified",
  "id",
  "owner",
  "visibility",
  "protected",
  "draft",
  "name",
  "fog",
  "projection"
];
var styleCache = /* @__PURE__ */ new Map();
function addToken(url, token) {
  return `${url}${url.includes("?") ? "&" : "?"}access_token=${token}`;
}
function normalizeMapboxResourceUrl(url, token) {
  if (!url.startsWith("mapbox://")) return url;
  const resource = url.slice("mapbox://".length);
  if (resource.startsWith("fonts/")) {
    const [, owner, ...rest] = resource.split("/");
    return addToken(`https://api.mapbox.com/fonts/v1/${owner}/${rest.join("/")}`, token);
  }
  if (resource.startsWith("sprites/")) {
    const [, owner, styleId, ...rest] = resource.split("/");
    const extraPath = rest.length > 0 ? `/${rest.join("/")}` : "";
    return addToken(`https://api.mapbox.com/styles/v1/${owner}/${styleId}/sprite${extraPath}`, token);
  }
  if (resource.startsWith("styles/")) {
    const [, owner, styleId] = resource.split("/");
    return addToken(`https://api.mapbox.com/styles/v1/${owner}/${styleId}`, token);
  }
  return addToken(`https://api.mapbox.com/v4/${resource}.json?secure=true`, token);
}
function cloneStyle(style) {
  return JSON.parse(JSON.stringify(style));
}
function normalizeMapboxStyle(style, token) {
  const next = cloneStyle(style);
  for (const key of MAPBOX_STYLE_METADATA_KEYS) {
    delete next[key];
  }
  if (typeof next.glyphs === "string") {
    next.glyphs = normalizeMapboxResourceUrl(next.glyphs, token);
  }
  if (typeof next.sprite === "string") {
    next.sprite = normalizeMapboxResourceUrl(next.sprite, token);
  } else if (Array.isArray(next.sprite)) {
    next.sprite = next.sprite.map((sprite) => ({
      ...sprite,
      url: normalizeMapboxResourceUrl(sprite.url, token)
    }));
  }
  for (const source of Object.values(next.sources ?? {})) {
    if (typeof source.url === "string") {
      source.url = normalizeMapboxResourceUrl(source.url, token);
    }
    if (Array.isArray(source.tiles)) {
      source.tiles = source.tiles.map((tile) => normalizeMapboxResourceUrl(tile, token));
    }
  }
  return next;
}
function styleDocumentUrl(style, token) {
  if (style.startsWith("mapbox://styles/")) {
    const [owner, styleId] = style.slice("mapbox://styles/".length).split("/");
    return addToken(`https://api.mapbox.com/styles/v1/${owner}/${styleId}`, token);
  }
  if (style.startsWith("mapbox://")) {
    return normalizeMapboxResourceUrl(style, token);
  }
  return style.includes("access_token=") ? style : addToken(style, token);
}
async function loadMapboxStyleForMapLibre(style, { token }) {
  const cacheKey = `${style}::${token}`;
  if (!styleCache.has(cacheKey)) {
    const url = styleDocumentUrl(style, token);
    styleCache.set(
      cacheKey,
      fetch(url).then(async (response) => {
        if (!response.ok) {
          throw new Error(`Mapbox style "${style}" failed to load (${response.status})`);
        }
        return normalizeMapboxStyle(await response.json(), token);
      }).catch((error) => {
        styleCache.delete(cacheKey);
        throw error;
      })
    );
  }
  return cloneStyle(await styleCache.get(cacheKey));
}

export { loadMapboxStyleForMapLibre, normalizeMapboxResourceUrl, normalizeMapboxStyle };
