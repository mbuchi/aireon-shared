import { useEffect, useSyncExternalStore } from 'react';
import { searchHistoryStore } from './store';
import type { SearchHistoryEntry, RecordSearchInput } from './types';

export interface UseSearchHistoryResult {
  /** The user's recent searches, newest first. */
  entries: SearchHistoryEntry[];
  /** Loading state of the initial/refresh fetch. */
  status: 'idle' | 'loading' | 'ready' | 'error';
  /** True when a signed-in user is backing the history. */
  authed: boolean;
  /** Record (or bump) a search. Optimistic; persists in the background. */
  record: (input: RecordSearchInput) => void;
  /** Remove one entry by id. */
  remove: (id: string) => void;
  /** Clear the whole history. */
  clear: () => void;
  /** Force a reload from the backend. */
  reload: () => void;
}

export interface UseSearchHistoryOptions {
  /**
   * Optional auth-token hint. Components that already have the auth context
   * (e.g. the account menu) can pass `getAccessToken()` here so the store
   * reloads the moment the user signs in or out. Components without auth context
   * (e.g. the address search box) can omit it — the store resolves the token
   * lazily on its own.
   */
  authToken?: string | null;
}

/**
 * `useSearchHistory` — subscribe to the suite-wide address search history. Backed
 * by a singleton store (one fetch shared across every consumer in the app) that
 * persists to the RES backend when signed in and to localStorage otherwise, so
 * the same history follows the user across every Aireon app.
 */
export function useSearchHistory(
  options: UseSearchHistoryOptions = {},
): UseSearchHistoryResult {
  const { authToken } = options;

  const snapshot = useSyncExternalStore(
    searchHistoryStore.subscribe,
    searchHistoryStore.getSnapshot,
    searchHistoryStore.getServerSnapshot,
  );

  useEffect(() => {
    searchHistoryStore.ensureInitialized();
  }, []);

  // Re-check identity whenever the caller-supplied token changes (sign in/out).
  useEffect(() => {
    if (authToken === undefined) return;
    void searchHistoryStore.notifyAuthChanged();
  }, [authToken]);

  return {
    entries: snapshot.entries,
    status: snapshot.status,
    authed: snapshot.authed,
    record: searchHistoryStore.record,
    remove: searchHistoryStore.remove,
    clear: searchHistoryStore.clear,
    reload: searchHistoryStore.reload,
  };
}
