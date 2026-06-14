// Cross-app search-history client. Hits the RES backend directly — RES owns the
// `user_search_history` table and the Zitadel-authenticated REST surface, so a
// search recorded in any suite app is the same history read by every other app.
//
// Auth: the caller passes the END USER's Zitadel token (id_token/access_token,
// a JWT). RES decodes its `sub` claim to scope every row to the user — exactly
// like the PRM / swissnovo_user / claire routes.
//
// CORS: RES answers /res_api/* with `Access-Control-Allow-Origin: *` and allows
// the `Authorization` header, so cross-origin calls from *.aireon.ch work with
// no proxy.

import type { SearchHistoryEntry, RecordSearchInput } from './types';

const SEARCH_HISTORY_API_BASE = 'https://res.zeroo.ch/res_api/search_history';

/** Raw row shape returned by RES (snake_case). */
interface SearchHistoryRow {
  id: number | string;
  label: string;
  lat: number | null;
  lng: number | null;
  feature_id: string | null;
  app_name: string | null;
  search_count: number;
  created_at: string;
  last_searched_at: string;
}

function rowToEntry(row: SearchHistoryRow): SearchHistoryEntry {
  return {
    id: String(row.id),
    label: row.label,
    lat: row.lat,
    lng: row.lng,
    featureId: row.feature_id,
    appName: row.app_name,
    searchCount: row.search_count,
    createdAt: row.created_at,
    lastSearchedAt: row.last_searched_at,
  };
}

async function historyFetch<T>(
  path: string,
  init: RequestInit,
  token: string,
): Promise<T> {
  const res = await fetch(`${SEARCH_HISTORY_API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init.headers as Record<string, string> | undefined),
    },
  });
  if (!res.ok) {
    let detail = '';
    try {
      detail = (await res.json())?.error ?? '';
    } catch {
      /* non-JSON body */
    }
    throw new Error(`${res.status} ${res.statusText}${detail ? `: ${detail}` : ''}`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/** The current user's recent searches, newest first. */
export async function fetchSearchHistory(token: string): Promise<SearchHistoryEntry[]> {
  const rows = await historyFetch<SearchHistoryRow[]>('', { method: 'GET' }, token);
  return (rows ?? []).map(rowToEntry);
}

/** Record (or bump) one search. Returns the persisted entry. */
export async function recordSearchEntry(
  token: string,
  input: RecordSearchInput,
): Promise<SearchHistoryEntry> {
  const row = await historyFetch<SearchHistoryRow>(
    '',
    {
      method: 'POST',
      // The RES POST handler reads camelCase keys (featureId/appName); GET rows
      // come back snake_case and are mapped by rowToEntry. The asymmetry is
      // deliberate and matches the backend contract.
      body: JSON.stringify({
        label: input.label,
        lat: input.lat ?? null,
        lng: input.lng ?? null,
        featureId: input.featureId ?? null,
        appName: input.appName ?? null,
      }),
    },
    token,
  );
  return rowToEntry(row);
}

/** Remove a single history entry by id. */
export async function deleteSearchEntry(token: string, id: string): Promise<void> {
  await historyFetch<{ success: boolean }>(
    `/${encodeURIComponent(id)}`,
    { method: 'DELETE' },
    token,
  );
}

/** Clear the current user's entire history. */
export async function clearSearchHistoryRemote(token: string): Promise<void> {
  await historyFetch<{ success: boolean }>('', { method: 'DELETE' }, token);
}

export { SEARCH_HISTORY_API_BASE };
