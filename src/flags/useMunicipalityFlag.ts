import { useEffect, useRef, useState } from 'react';
import { getFlagByBfs, type FlagFetchOptions, type FlagRecord } from './client';

export interface UseMunicipalityFlagResult {
  /** The resolved flag, or `null` while loading / when none exists. */
  flag: FlagRecord | null;
  /** True while the lookup is in flight. */
  loading: boolean;
  /** Set when the lookup hit a transport/server error (not a missing flag). */
  error: Error | null;
}

/**
 * React hook resolving a single municipality flag by BFS code via
 * {@link getFlagByBfs}. Re-fetches when `bfsCode` or `imageMode` change, and
 * ignores stale responses if the inputs change mid-flight. A missing flag
 * resolves to `flag: null` with no error.
 *
 * Pass `bfsCode = null/undefined` to stand the hook down (e.g. before a
 * municipality is selected).
 */
export function useMunicipalityFlag(
  bfsCode: number | null | undefined,
  options: FlagFetchOptions = {},
): UseMunicipalityFlagResult {
  const [flag, setFlag] = useState<FlagRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(bfsCode != null);
  const [error, setError] = useState<Error | null>(null);

  // Pull primitives out so the effect doesn't re-run on a fresh options object.
  const { imageMode, apiBase, noCache } = options;

  // Guards against setting state after unmount / for a superseded request.
  const requestId = useRef(0);

  useEffect(() => {
    if (bfsCode == null) {
      setFlag(null);
      setLoading(false);
      setError(null);
      return;
    }

    const id = ++requestId.current;
    setLoading(true);
    setError(null);

    getFlagByBfs(bfsCode, { imageMode, apiBase, noCache })
      .then((record) => {
        if (id !== requestId.current) return;
        setFlag(record);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (id !== requestId.current) return;
        setFlag(null);
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      });

    return () => {
      // Invalidate this request so a late resolve can't clobber newer state.
      requestId.current++;
    };
  }, [bfsCode, imageMode, apiBase, noCache]);

  return { flag, loading, error };
}
