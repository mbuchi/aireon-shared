// One recorded address search, as stored on the RES backend
// (`public.user_search_history`) and surfaced to the UI. Field names are
// camelCase here; the backend rows are snake_case and mapped in `api.ts`.
export interface SearchHistoryEntry {
  /** Backend row id (number) when persisted, or a synthetic local id offline. */
  id: string;
  /** The address/place label that was searched (the de-dup key per user). */
  label: string;
  lat: number | null;
  lng: number | null;
  /** The provider feature id of the picked result (e.g. geo.admin id), if any. */
  featureId?: string | null;
  /** Which app recorded the search (telemetry / "where did I find this"). */
  appName?: string | null;
  /** How many times this exact place has been searched. */
  searchCount: number;
  /** ISO timestamps. */
  createdAt: string;
  lastSearchedAt: string;
}

/** What a caller passes to record a search — the rest is filled by the backend. */
export interface RecordSearchInput {
  label: string;
  lat?: number | null;
  lng?: number | null;
  featureId?: string | null;
  appName?: string | null;
}

export type SearchHistoryStatus = 'idle' | 'loading' | 'ready' | 'error';
