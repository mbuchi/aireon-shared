// src/cache/clientCache.ts
var LocalStorageCache = class {
  constructor(prefix, ttlMinutes = 60) {
    this.prefix = prefix;
    this.ttlMs = ttlMinutes * 60 * 1e3;
  }
  getKey(key) {
    return `${this.prefix}:${key}`;
  }
  get(key) {
    try {
      const item = localStorage.getItem(this.getKey(key));
      if (!item) return null;
      const entry = JSON.parse(item);
      const now = Date.now();
      if (now - entry.timestamp > this.ttlMs) {
        this.delete(key);
        return null;
      }
      return entry.data;
    } catch {
      return null;
    }
  }
  set(key, data) {
    try {
      const entry = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(this.getKey(key), JSON.stringify(entry));
    } catch {
    }
  }
  delete(key) {
    localStorage.removeItem(this.getKey(key));
  }
  clear() {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  }
};
var IndexedDBCache = class {
  constructor(dbName, storeName, options = {}) {
    this.db = null;
    this.dbName = dbName;
    this.storeName = storeName;
    this.ttlMs = options.ttlMinutes && options.ttlMinutes > 0 ? options.ttlMinutes * 60 * 1e3 : 0;
    this.maxBytes = options.maxBytes ?? Infinity;
    this.version = options.version ?? 1;
  }
  byteLength(data) {
    try {
      return new TextEncoder().encode(JSON.stringify(data)).length;
    } catch {
      return 0;
    }
  }
  async openDB() {
    if (this.db) return this.db;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: "key" });
        }
      };
      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };
      request.onerror = () => reject(request.error);
    });
  }
  async get(key) {
    try {
      const db = await this.openDB();
      const entry = await new Promise((resolve) => {
        const tx = db.transaction(this.storeName, "readonly");
        const request = tx.objectStore(this.storeName).get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(void 0);
      });
      if (!entry) return null;
      if (entry.ttlMs > 0 && Date.now() - entry.timestamp > entry.ttlMs) {
        await this.delete(key);
        return null;
      }
      this.touch(key).catch(() => {
      });
      return entry.data;
    } catch {
      return null;
    }
  }
  /** Update an entry's lastAccessed timestamp without rewriting its data. */
  async touch(key) {
    const db = await this.openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(this.storeName, "readwrite");
      const store = tx.objectStore(this.storeName);
      const request = store.get(key);
      request.onsuccess = () => {
        const entry = request.result;
        if (entry) {
          entry.lastAccessed = Date.now();
          store.put(entry);
        }
      };
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  }
  async set(key, data) {
    try {
      const db = await this.openDB();
      const now = Date.now();
      const entry = {
        key,
        data,
        timestamp: now,
        lastAccessed: now,
        size: this.byteLength(data),
        ttlMs: this.ttlMs
      };
      await new Promise((resolve, reject) => {
        const tx = db.transaction(this.storeName, "readwrite");
        const request = tx.objectStore(this.storeName).put(entry);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
      if (this.maxBytes !== Infinity) {
        await this.enforceSizeLimit();
      }
    } catch {
    }
  }
  /** Evict least-recently-used entries until total size is within `maxBytes`. */
  async enforceSizeLimit() {
    try {
      const db = await this.openDB();
      const entries = await new Promise((resolve) => {
        const tx = db.transaction(this.storeName, "readonly");
        const request = tx.objectStore(this.storeName).getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => resolve([]);
      });
      let total = entries.reduce((sum, e) => sum + (e.size || 0), 0);
      if (total <= this.maxBytes) return;
      const ordered = entries.slice().sort((a, b) => (a.lastAccessed || a.timestamp) - (b.lastAccessed || b.timestamp));
      await new Promise((resolve) => {
        const tx = db.transaction(this.storeName, "readwrite");
        const store = tx.objectStore(this.storeName);
        for (const entry of ordered) {
          if (total <= this.maxBytes) break;
          store.delete(entry.key);
          total -= entry.size || 0;
        }
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    } catch {
    }
  }
  async delete(key) {
    try {
      const db = await this.openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(this.storeName, "readwrite");
        const store = tx.objectStore(this.storeName);
        store.delete(key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    } catch {
    }
  }
  /** Remove every entry in this store. */
  async clear() {
    try {
      const db = await this.openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(this.storeName, "readwrite");
        tx.objectStore(this.storeName).clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    } catch {
    }
  }
};

// src/geoadmin/addressSearch.ts
var GEOADMIN_ADDRESS_SEARCH_ENDPOINT = "https://api3.geo.admin.ch/rest/services/ech/SearchServer";
var GEOADMIN_ADDRESS_SEARCH_CACHE_TTL_MINUTES = 7 * 24 * 60;
var GEOADMIN_ADDRESS_SEARCH_CACHE_MAX_BYTES = 2 * 1024 * 1024;
var defaultAddressSearchCache = new IndexedDBCache(
  "aireon-geoadmin-address-search",
  "results",
  {
    ttlMinutes: GEOADMIN_ADDRESS_SEARCH_CACHE_TTL_MINUTES,
    maxBytes: GEOADMIN_ADDRESS_SEARCH_CACHE_MAX_BYTES
  }
);
function normalizeAddressSearchQuery(query) {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}
function createAbortError() {
  if (typeof DOMException !== "undefined") {
    return new DOMException("Aborted", "AbortError");
  }
  const err = new Error("Aborted");
  err.name = "AbortError";
  return err;
}
function numberOrNull(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const n = Number.parseFloat(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}
function decodeHtmlEntity(entity) {
  const named = {
    "&amp;": "&",
    "&apos;": "'",
    "&gt;": ">",
    "&lt;": "<",
    "&quot;": '"',
    "&#39;": "'"
  };
  if (named[entity]) return named[entity];
  const decimal = entity.match(/^&#(\d+);$/);
  if (decimal) return String.fromCodePoint(Number.parseInt(decimal[1], 10));
  const hex = entity.match(/^&#x([a-fA-F0-9]+);$/);
  if (hex) return String.fromCodePoint(Number.parseInt(hex[1], 16));
  return entity;
}
function cleanGeoAdminLabel(label, fallback) {
  return (label || fallback).replace(/<[^>]*>/g, " ").replace(/&(?:amp|apos|gt|lt|quot|#39|#\d+|#x[a-fA-F0-9]+);/g, decodeHtmlEntity).replace(/\s+/g, " ").trim();
}
function buildCacheKey(query, {
  lang = "de",
  limit = 5,
  origins = "address"
}) {
  return [
    "v1",
    lang,
    Math.max(1, limit),
    origins,
    normalizeAddressSearchQuery(query)
  ].join(":");
}
function mapGeoAdminHit(hit) {
  const attrs = hit.attrs;
  if (!attrs) return null;
  const lat = numberOrNull(attrs.lat);
  const lng = numberOrNull(attrs.lon);
  if (lat === null || lng === null) return null;
  const featureId = attrs.featureId === void 0 ? void 0 : String(attrs.featureId);
  const origin = attrs.origin || "address";
  const id = `${origin}:${featureId ?? hit.id ?? `${lat},${lng}`}`;
  const label = cleanGeoAdminLabel(attrs.label, attrs.detail || `${lat}, ${lng}`);
  const rank = numberOrNull(attrs.rank);
  return {
    id,
    label,
    lat,
    lng,
    ...featureId ? { featureId } : {},
    ...{ origin } ,
    ...rank !== null ? { rank } : {},
    ...typeof hit.weight === "number" ? { weight: hit.weight } : {}
  };
}
async function searchGeoAdminAddresses(query, options = {}) {
  const trimmed = query.trim();
  const minQueryLength = options.minQueryLength ?? 3;
  if (trimmed.length < minQueryLength) return [];
  if (options.signal?.aborted) throw createAbortError();
  const limit = options.limit ?? 5;
  const lang = options.lang ?? "de";
  const origins = options.origins ?? "address";
  const cache = options.cache === false ? null : options.cache ?? defaultAddressSearchCache;
  const cacheKey = buildCacheKey(trimmed, { lang, limit, origins });
  const cached = await cache?.get(cacheKey);
  if (cached) return cached;
  if (options.signal?.aborted) throw createAbortError();
  const url = new URL(options.endpoint ?? GEOADMIN_ADDRESS_SEARCH_ENDPOINT);
  url.searchParams.set("searchText", trimmed);
  url.searchParams.set("type", "locations");
  url.searchParams.set("origins", origins);
  url.searchParams.set("limit", String(Math.max(1, limit)));
  url.searchParams.set("sr", "4326");
  url.searchParams.set("lang", lang);
  const fetcher = options.fetcher ?? fetch;
  const res = await fetcher(url.toString(), { signal: options.signal });
  if (!res.ok) throw new Error(`geo.admin.ch address search failed: ${res.status}`);
  const data = await res.json();
  const results = (data.results ?? []).map(mapGeoAdminHit).filter((result) => result !== null);
  await cache?.set(cacheKey, results);
  return results;
}

export { GEOADMIN_ADDRESS_SEARCH_CACHE_MAX_BYTES, GEOADMIN_ADDRESS_SEARCH_CACHE_TTL_MINUTES, GEOADMIN_ADDRESS_SEARCH_ENDPOINT, IndexedDBCache, LocalStorageCache, normalizeAddressSearchQuery, searchGeoAdminAddresses };
