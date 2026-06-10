/**
 * Suite-wide client-side cache primitives. Two flavours:
 *
 *   - `LocalStorageCache<T>` — small, synchronous, TTL-only. Right for tiny
 *     responses (≤ a few KB) you want to keep across reloads: geocoder hints,
 *     small JSON config, last-N selections.
 *
 *   - `IndexedDBCache<T>` — asynchronous, optional TTL, optional byte-budget
 *     with LRU eviction. Right for larger responses (tens to hundreds of KB)
 *     where you also want a hard size ceiling, e.g. parcel-data / zone-stats
 *     payloads from RES. Every failure path is silent so a broken IndexedDB
 *     never breaks a user-facing fetch.
 *
 * Originally ported from scoore → room → here. Suite convention: this is the
 * **front-of-cache layer**, sitting in front of RES (whose endpoints have their
 * own server-side Redis cache — see `feedback-redis-backend-cache`). Use both:
 * IDB makes the hot path zero-network for the same user; Redis makes the cold
 * path warm for every other user.
 *
 * IDB version-bump caveat: this implementation opens its database at version 1
 * with a single store created in `onupgradeneeded`. If you keep multiple
 * `IndexedDBCache` instances against the SAME `dbName` with different
 * `storeName`s, the *first* one to open wins; subsequent stores will be
 * missing because `onupgradeneeded` won't fire for them. Either give each
 * store its own `dbName`, or bump the constructor's `version` parameter and
 * create all stores in the upgrade handler.
 */
declare class LocalStorageCache<T> {
    private prefix;
    private ttlMs;
    constructor(prefix: string, ttlMinutes?: number);
    private getKey;
    get(key: string): T | null;
    set(key: string, data: T): void;
    delete(key: string): void;
    clear(): void;
}
interface IndexedDBCacheOptions {
    /** Time-to-live in minutes. `0` or omitted means entries never expire. */
    ttlMinutes?: number;
    /** Maximum total cache size in bytes. Once exceeded, the least-recently-used
     *  entries are evicted. Omitted means unbounded. */
    maxBytes?: number;
    /** IDB schema version. Bump this when adding a new store to an existing DB,
     *  otherwise the new store will not be created on already-installed clients.
     *  Defaults to 1. */
    version?: number;
}
declare class IndexedDBCache<T> {
    private dbName;
    private storeName;
    private ttlMs;
    private maxBytes;
    private version;
    private db;
    constructor(dbName: string, storeName: string, options?: IndexedDBCacheOptions);
    private byteLength;
    private openDB;
    get(key: string): Promise<T | null>;
    /** Update an entry's lastAccessed timestamp without rewriting its data. */
    private touch;
    set(key: string, data: T): Promise<void>;
    /** Evict least-recently-used entries until total size is within `maxBytes`. */
    private enforceSizeLimit;
    delete(key: string): Promise<void>;
    /** Remove every entry in this store. */
    clear(): Promise<void>;
}

declare const GEOADMIN_ADDRESS_SEARCH_ENDPOINT = "https://api3.geo.admin.ch/rest/services/ech/SearchServer";
declare const GEOADMIN_ADDRESS_SEARCH_CACHE_TTL_MINUTES: number;
declare const GEOADMIN_ADDRESS_SEARCH_CACHE_MAX_BYTES: number;
type GeoAdminAddressSearchLanguage = 'de' | 'fr' | 'it' | 'en';
interface GeoAdminAddressResult {
    id: string;
    label: string;
    lat: number;
    lng: number;
    featureId?: string;
    origin?: string;
    rank?: number;
    weight?: number;
}
type GeoAdminFetch = (input: string, init?: RequestInit) => Promise<Response>;
interface GeoAdminAddressSearchOptions {
    signal?: AbortSignal;
    limit?: number;
    minQueryLength?: number;
    lang?: GeoAdminAddressSearchLanguage;
    origins?: string;
    endpoint?: string;
    cache?: IndexedDBCache<GeoAdminAddressResult[]> | false;
    fetcher?: GeoAdminFetch;
}
declare function normalizeAddressSearchQuery(query: string): string;
/**
 * Search Swiss building addresses through geo.admin.ch SearchServer.
 *
 * The result shape matches the suite's existing address-combobox contract:
 * display `label` while typing, then use `lat`/`lng` directly on selection.
 */
declare function searchGeoAdminAddresses(query: string, options?: GeoAdminAddressSearchOptions): Promise<GeoAdminAddressResult[]>;

export { GEOADMIN_ADDRESS_SEARCH_CACHE_MAX_BYTES as G, IndexedDBCache as I, LocalStorageCache as L, GEOADMIN_ADDRESS_SEARCH_CACHE_TTL_MINUTES as a, GEOADMIN_ADDRESS_SEARCH_ENDPOINT as b, type GeoAdminAddressResult as c, type GeoAdminAddressSearchLanguage as d, type GeoAdminAddressSearchOptions as e, type GeoAdminFetch as f, type IndexedDBCacheOptions as g, normalizeAddressSearchQuery as n, searchGeoAdminAddresses as s };
