// Singleton search-history store — one shared source of truth that any component
// reads via `useSearchHistory` (useSyncExternalStore). It is deliberately
// decoupled from React auth: the token is resolved lazily through the module
// helper `getAuthToken()`, so the store works from `AddressSearch` even in an
// app that isn't wrapped in `<AuthProvider>`. Sign-in/out are picked up via the
// shared `userManager` events, so the view swaps identities even when no
// consumer supplies an auth-token hint.
//
// Storage strategy:
//  • Signed in  → RES backend is authoritative; mirrored to localStorage
//                 (namespaced by Zitadel `sub`) for instant first paint. The
//                 previous identity's mirror is dropped on a user change so it
//                 isn't readable on a shared device.
//  • Signed out → localStorage only (namespace `anon`); migrated up to the
//                 backend the first time the user signs in (only cleared once
//                 every entry is confirmed persisted, so a failed migrate never
//                 loses anonymous searches).

import { getAuthToken, userManager } from '../auth/userManager';
import {
  fetchSearchHistory,
  recordSearchEntry,
  deleteSearchEntry,
  clearSearchHistoryRemote,
} from './api';
import type {
  SearchHistoryEntry,
  RecordSearchInput,
  SearchHistoryStatus,
} from './types';

const MAX_ENTRIES = 50;
const STORAGE_PREFIX = 'aireon:search-history:';

export interface SearchHistorySnapshot {
  entries: SearchHistoryEntry[];
  status: SearchHistoryStatus;
  /** True when there is a signed-in user backing the history. */
  authed: boolean;
}

const EMPTY: SearchHistorySnapshot = { entries: [], status: 'idle', authed: false };

let snapshot: SearchHistorySnapshot = EMPTY;
const listeners = new Set<() => void>();

/** The Zitadel `sub` of the user whose data is currently loaded (or null). */
let currentSub: string | null = null;
let initialized = false;
// One monotonically increasing op id shared by load() and every mutator, so an
// identity change (or a newer write) cancels older in-flight reconciliations —
// the latest operation always wins, and each reconciliation re-fetches the full
// authoritative list, so "latest wins" is correct.
let opSeq = 0;

function emit() {
  for (const l of listeners) l();
}

function setSnapshot(next: Partial<SearchHistorySnapshot>) {
  snapshot = { ...snapshot, ...next };
  emit();
}

// ---- token / identity helpers ------------------------------------------------

/** getAuthToken(), but never throws — a storage/oidc error means "anonymous". */
async function safeAuthToken(): Promise<string | null> {
  try {
    return await getAuthToken();
  } catch {
    return null;
  }
}

/**
 * Decode the `sub` claim from a Zitadel JWT without verifying the signature
 * (the store runs client-side only; `atob` is always present in browsers).
 */
function subFromToken(token: string | null): string | null {
  if (!token || typeof atob !== 'function') return null;
  try {
    const part = token.split('.')[1];
    if (!part) return null;
    const b64 = part.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(b64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    const payload = JSON.parse(json) as { sub?: string };
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

// ---- localStorage mirror -----------------------------------------------------

function storageKey(sub: string | null): string {
  return STORAGE_PREFIX + (sub ?? 'anon');
}

function readLocal(sub: string | null): SearchHistoryEntry[] {
  try {
    const raw = localStorage.getItem(storageKey(sub));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SearchHistoryEntry[]) : [];
  } catch {
    return [];
  }
}

function writeLocal(sub: string | null, entries: SearchHistoryEntry[]) {
  try {
    localStorage.setItem(storageKey(sub), JSON.stringify(entries.slice(0, MAX_ENTRIES)));
  } catch {
    /* storage full / blocked — non-fatal, backend remains source of truth */
  }
}

function removeLocal(sub: string | null) {
  try {
    localStorage.removeItem(storageKey(sub));
  } catch {
    /* ignore */
  }
}

const labelKey = (label: string) => label.trim().toLowerCase();

// ---- pure entry helpers ------------------------------------------------------

/** Insert/refresh an entry by label (case-insensitive), newest first, capped. */
function upsertLocal(
  entries: SearchHistoryEntry[],
  input: RecordSearchInput,
  nowIso: string,
): SearchHistoryEntry[] {
  const key = labelKey(input.label);
  const existing = entries.find((e) => labelKey(e.label) === key);
  const rest = entries.filter((e) => labelKey(e.label) !== key);
  const merged: SearchHistoryEntry = existing
    ? {
        ...existing,
        lat: input.lat ?? existing.lat,
        lng: input.lng ?? existing.lng,
        featureId: input.featureId ?? existing.featureId,
        appName: input.appName ?? existing.appName,
        searchCount: existing.searchCount + 1,
        lastSearchedAt: nowIso,
      }
    : {
        id: `local:${key}`,
        label: input.label.trim(),
        lat: input.lat ?? null,
        lng: input.lng ?? null,
        featureId: input.featureId ?? null,
        appName: input.appName ?? null,
        searchCount: 1,
        createdAt: nowIso,
        lastSearchedAt: nowIso,
      };
  return [merged, ...rest].slice(0, MAX_ENTRIES);
}

// ---- core load ---------------------------------------------------------------

async function load() {
  const seq = ++opSeq;
  const token = await safeAuthToken();
  const sub = subFromToken(token);
  const prevSub = currentSub;
  currentSub = sub;

  // Privacy: when the signed-in identity changes (sign-out, or sign-in as a
  // different user) drop the previous identity's local mirror so it can't be
  // read in localStorage on a shared device.
  if (prevSub !== null && prevSub !== sub) removeLocal(prevSub);

  // Instant paint from the per-user local mirror.
  const local = readLocal(sub);
  if (seq === opSeq) {
    setSnapshot({
      entries: local,
      status: token ? 'loading' : 'ready',
      authed: !!token,
    });
  }

  if (!token) return; // anonymous: localStorage is the whole story.

  try {
    let remote = await fetchSearchHistory(token);

    // First sign-in: lift any anonymous searches up to the account. Only clear
    // the anon mirror for entries we actually persisted — a failed migrate keeps
    // its entry for a retry on the next sign-in (no silent data loss).
    const anon = readLocal(null);
    if (anon.length > 0) {
      const have = new Set(remote.map((e) => labelKey(e.label)));
      const toMigrate = anon.filter((e) => !have.has(labelKey(e.label)));
      if (toMigrate.length === 0) {
        // Everything already on the account — safe to drop the anon mirror.
        removeLocal(null);
      } else {
        const settled = await Promise.allSettled(
          toMigrate.map((e) =>
            recordSearchEntry(token, {
              label: e.label,
              lat: e.lat,
              lng: e.lng,
              featureId: e.featureId,
              appName: e.appName,
            }),
          ),
        );
        const anyOk = settled.some((s) => s.status === 'fulfilled');
        const allOk = settled.every((s) => s.status === 'fulfilled');
        if (anyOk) remote = await fetchSearchHistory(token);
        if (allOk) {
          removeLocal(null);
        } else {
          // Keep only the entries whose migrate POST failed, to retry later.
          const failed = new Set(
            settled
              .map((s, i) => (s.status === 'rejected' ? labelKey(toMigrate[i].label) : null))
              .filter((k): k is string => k != null),
          );
          writeLocal(null, anon.filter((e) => failed.has(labelKey(e.label))));
        }
      }
    }

    if (seq === opSeq) {
      writeLocal(sub, remote);
      setSnapshot({ entries: remote, status: 'ready', authed: true });
    }
  } catch {
    // Network/backend down — fall back to the local mirror we already painted.
    if (seq === opSeq) setSnapshot({ status: local.length ? 'ready' : 'error' });
  }
}

// ---- public store API --------------------------------------------------------

export const searchHistoryStore = {
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getSnapshot(): SearchHistorySnapshot {
    return snapshot;
  },

  getServerSnapshot(): SearchHistorySnapshot {
    return EMPTY;
  },

  /** Load once (first hook mount). Safe to call repeatedly. */
  ensureInitialized() {
    if (initialized) return;
    initialized = true;
    // Re-check identity on sign-in / sign-out even when no consumer passes an
    // auth-token hint (e.g. an app where only AddressSearch is mounted).
    try {
      userManager.events.addUserLoaded(() => {
        void load();
      });
      userManager.events.addUserUnloaded(() => {
        void load();
      });
    } catch {
      /* events unavailable — fall back to hint-driven reloads */
    }
    void load();
  },

  /** Re-check identity; reload when the signed-in user changed (login/logout). */
  async notifyAuthChanged() {
    const token = await safeAuthToken();
    const sub = subFromToken(token);
    if (sub !== currentSub || !initialized) {
      initialized = true;
      await load();
    }
  },

  /** Force a reload from the backend. */
  reload() {
    return load();
  },

  /** Record (or bump) a search — optimistic, then persisted. */
  async record(input: RecordSearchInput) {
    const label = input.label?.trim();
    if (!label) return;
    const seq = ++opSeq;
    const nowIso = new Date().toISOString();
    // The optimistic update always applies; only the async reconciliation below
    // is gated on still being the latest op.
    const optimistic = upsertLocal(snapshot.entries, { ...input, label }, nowIso);
    setSnapshot({ entries: optimistic });

    const token = await safeAuthToken();
    const sub = subFromToken(token);
    if (!token) {
      if (seq === opSeq) writeLocal(null, optimistic);
      return;
    }
    try {
      await recordSearchEntry(token, { ...input, label });
      const remote = await fetchSearchHistory(token);
      if (seq === opSeq) {
        writeLocal(sub, remote);
        setSnapshot({ entries: remote, status: 'ready', authed: true });
      }
    } catch {
      // Keep the optimistic entry; it'll reconcile on the next reload.
      if (seq === opSeq) writeLocal(sub, optimistic);
    }
  },

  /** Remove one entry. */
  async remove(id: string) {
    const seq = ++opSeq;
    const next = snapshot.entries.filter((e) => e.id !== id);
    setSnapshot({ entries: next });
    const token = await safeAuthToken();
    const sub = subFromToken(token);
    if (seq === opSeq) writeLocal(sub, next);
    if (token && !id.startsWith('local:')) {
      try {
        await deleteSearchEntry(token, id);
      } catch {
        /* best effort — local state already updated */
      }
    }
  },

  /** Clear the whole history for the current user. */
  async clear() {
    const seq = ++opSeq;
    setSnapshot({ entries: [] });
    const token = await safeAuthToken();
    const sub = subFromToken(token);
    if (seq === opSeq) writeLocal(sub, []);
    if (token) {
      try {
        await clearSearchHistoryRemote(token);
      } catch {
        /* best effort */
      }
    }
  },
};

export type SearchHistoryStore = typeof searchHistoryStore;
