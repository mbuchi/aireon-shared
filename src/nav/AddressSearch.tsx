import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Search, X, MapPin, Clock } from 'lucide-react';
import {
  searchGeoAdminAddresses,
  type GeoAdminAddressSearchLanguage,
} from '../geoadmin/addressSearch';
import { useSearchHistory } from '../searchHistory/useSearchHistory';

/** Default provider: the shared Swiss geo.admin geocoder (lang bridged to its union). */
const defaultProvider = (
  text: string,
  opts: { signal?: AbortSignal; lang?: string },
): Promise<AddressSearchResult[]> =>
  searchGeoAdminAddresses(text, {
    signal: opts.signal,
    lang: opts.lang as GeoAdminAddressSearchLanguage | undefined,
  });

export interface AddressSearchResult {
  id: string;
  label: string;
  lat: number;
  lng: number;
}

export interface AddressSearchLabels {
  placeholder: string;
  loading: string;
  noResults: string;
  clear: string;
  /** Optional sr-only live-region count, e.g. n => `${n} results`. */
  resultsCount?: (n: number) => string;
  /** Header above the recent-searches list. Defaults to "Recent searches". */
  recent?: string;
}

export interface AddressSearchProps {
  dark?: boolean;
  /** Locale forwarded to the (default geo.admin) provider. */
  locale?: string;
  labels: AddressSearchLabels;
  /** Called when the user picks a result. */
  onSelect: (result: AddressSearchResult) => void;
  /**
   * Address provider. Defaults to the shared Swiss geo.admin search. Pass a
   * custom async fn (e.g. a Mapbox geocoder) returning {id,label,lat,lng}[].
   */
  search?: (
    text: string,
    opts: { signal?: AbortSignal; lang?: string },
  ) => Promise<AddressSearchResult[]>;
  /** Min chars before searching. Default 3. */
  minChars?: number;
  /** Debounce in ms. Default 300. */
  debounceMs?: number;
  /** Called on a non-abort search error (e.g. to toast). */
  onError?: (err: unknown) => void;
  /**
   * Record every pick into the user's cross-app search history (and surface a
   * "Recent searches" dropdown when the box is focused empty). Default `true`.
   * The history persists per user on the RES backend, so it follows the user to
   * every Aireon app.
   */
  history?: boolean;
  /** App id stored alongside recorded searches (telemetry / provenance). */
  appName?: string;
  /** Max recent searches to show in the dropdown. Default 6. */
  maxRecent?: number;
  className?: string;
}

/**
 * `AddressSearch` — the suite's address autocomplete: a search box with a
 * debounced, abortable lookup and a keyboard-navigable result dropdown (combobox
 * a11y, loading spinner, empty state). Defaults to the shared Swiss geo.admin
 * geocoder; pass `search` to plug in any provider. When `history` is on (the
 * default) every pick is saved to the user's cross-app search history and the
 * box shows a "Recent searches" dropdown on focus. Self-contained styling via
 * `@aireon/shared/map-ui.css` (the `aireon-search-*` classes), so it matches in
 * any host without Tailwind.
 */
export function AddressSearch({
  dark = false,
  locale,
  labels,
  onSelect,
  search = defaultProvider,
  minChars = 3,
  debounceMs = 300,
  onError,
  history = true,
  appName,
  maxRecent = 6,
  className,
}: AddressSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AddressSearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const abortRef = useRef<AbortController | null>(null);
  const listboxId = useId();

  const { entries, record } = useSearchHistory();

  // The recent list only makes sense for entries we can re-open (need coords).
  const recentResults = useMemo<AddressSearchResult[]>(() => {
    if (!history) return [];
    return entries
      .filter((e) => e.lat != null && e.lng != null)
      .slice(0, maxRecent)
      .map((e) => ({
        id: `recent:${e.id}`,
        label: e.label,
        lat: e.lat as number,
        lng: e.lng as number,
      }));
  }, [history, entries, maxRecent]);

  // Below `minChars` we're in "recent" mode (show history); at/above it we show
  // live geocoder results. `activeOptions` is whichever list is on screen, so
  // keyboard navigation and selection treat both lists uniformly.
  const isRecentMode = query.trim().length < minChars;
  const activeOptions = isRecentMode ? recentResults : results;

  const runSearch = useCallback(
    async (text: string) => {
      if (text.trim().length < minChars) {
        setResults([]);
        // Keep the dropdown open for recent searches if we have any.
        return;
      }
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setIsLoading(true);
      try {
        const matches = await search(text, { signal: controller.signal, lang: locale });
        if (controller.signal.aborted) return;
        setResults(matches);
        // Open even with zero matches so the user sees the empty state.
        setIsOpen(true);
        setSelectedIndex(-1);
      } catch (err) {
        if ((err as Error)?.name !== 'AbortError') {
          setResults([]);
          setIsOpen(false);
          onError?.(err);
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    },
    [search, locale, minChars, onError],
  );

  const handleInputChange = (value: string) => {
    setQuery(value);
    setSelectedIndex(-1);
    if (value.trim().length < minChars) setIsOpen(true); // reveal recent list
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(value), debounceMs);
  };

  const handleSelect = (result: AddressSearchResult) => {
    setQuery(result.label);
    setIsOpen(false);
    setResults([]);
    if (history && Number.isFinite(result.lat) && Number.isFinite(result.lng)) {
      record({
        label: result.label,
        lat: result.lat,
        lng: result.lng,
        featureId: result.id.startsWith('recent:') ? undefined : result.id,
        appName,
      });
    }
    onSelect(result);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || activeOptions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((p) => (p < activeOptions.length - 1 ? p + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((p) => (p > 0 ? p - 1 : activeOptions.length - 1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      const opt = activeOptions[selectedIndex];
      if (opt) handleSelect(opt);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSelectedIndex(-1);
    // Leave the dropdown open so the recent list takes over after clearing.
    setIsOpen(recentResults.length > 0);
  };

  useEffect(() => {
    const onPointer = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointer);
    return () => document.removeEventListener('mousedown', onPointer);
  }, []);

  // The recent list can shrink out-of-band (the shared store mutates when the
  // user records/removes elsewhere). Clamp the highlight so aria-activedescendant
  // and Enter never reference an index past the end of the rendered list.
  useEffect(() => {
    setSelectedIndex((i) => (i >= activeOptions.length ? -1 : i));
  }, [activeOptions.length]);

  const renderOption = (result: AddressSearchResult, index: number, recent: boolean) => (
    <button
      key={result.id}
      id={`${listboxId}-opt-${index}`}
      role="option"
      aria-selected={index === selectedIndex}
      onClick={() => handleSelect(result)}
      className={'aireon-search-option' + (index === selectedIndex ? ' aireon-search-option--active' : '')}
    >
      {recent ? (
        <Clock size={16} className="aireon-search-option-icon" aria-hidden="true" />
      ) : (
        <MapPin size={16} className="aireon-search-option-icon" aria-hidden="true" />
      )}
      <span className="aireon-search-option-label">{result.label}</span>
    </button>
  );

  const showRecentDropdown = isOpen && !isLoading && isRecentMode && recentResults.length > 0;
  const showResultsDropdown =
    isOpen && !isLoading && !isRecentMode && (results.length > 0 || query.trim().length >= minChars);
  const showDropdown = showRecentDropdown || showResultsDropdown;
  const hasOptions = activeOptions.length > 0;
  const recentLabel = labels.recent ?? 'Recent searches';

  return (
    <div
      ref={containerRef}
      className={'aireon-search' + (dark ? ' aireon-search--dark' : '') + (className ? ` ${className}` : '')}
    >
      <div className="aireon-search-field">
        <Search size={16} className="aireon-search-icon" aria-hidden="true" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (activeOptions.length > 0 || (query.trim().length >= minChars && !isLoading)) {
              setIsOpen(true);
            }
          }}
          placeholder={labels.placeholder}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={selectedIndex >= 0 ? `${listboxId}-opt-${selectedIndex}` : undefined}
          aria-autocomplete="list"
          aria-busy={isLoading}
          aria-label={labels.placeholder}
          className="aireon-search-input"
        />
        {isLoading ? (
          <span className="aireon-search-spinner" aria-hidden="true" />
        ) : (
          query && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label={labels.clear}
              title={labels.clear}
              className="aireon-search-clear"
            >
              <X size={14} aria-hidden="true" />
            </button>
          )
        )}
      </div>

      {showDropdown && (
        <div
          id={listboxId}
          role={hasOptions ? 'listbox' : undefined}
          aria-label={labels.placeholder}
          className="aireon-search-menu"
        >
          {!hasOptions ? (
            <div role="status" className="aireon-search-empty">
              <Search size={16} aria-hidden="true" />
              <span>{labels.noResults}</span>
            </div>
          ) : showRecentDropdown ? (
            <div role="group" aria-label={recentLabel}>
              <p className="aireon-search-section" aria-hidden="true">
                <Clock size={12} aria-hidden="true" />
                <span>{recentLabel}</span>
              </p>
              {activeOptions.map((result, index) => renderOption(result, index, true))}
            </div>
          ) : (
            activeOptions.map((result, index) => renderOption(result, index, false))
          )}
        </div>
      )}

      <div className="sr-only" role="status" aria-live="polite">
        {isLoading
          ? labels.loading
          : isOpen && results.length > 0
            ? (labels.resultsCount?.(results.length) ?? '')
            : isOpen && !isRecentMode && query.trim().length >= minChars
              ? labels.noResults
              : ''}
      </div>
    </div>
  );
}

export default AddressSearch;
