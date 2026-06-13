import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import {
  searchGeoAdminAddresses,
  type GeoAdminAddressSearchLanguage,
} from '../geoadmin/addressSearch';

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
  className?: string;
}

/**
 * `AddressSearch` — the suite's address autocomplete: a search box with a
 * debounced, abortable lookup and a keyboard-navigable result dropdown (combobox
 * a11y, loading spinner, empty state). Defaults to the shared Swiss geo.admin
 * geocoder; pass `search` to plug in any provider. Self-contained styling via
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

  const runSearch = useCallback(
    async (text: string) => {
      if (text.trim().length < minChars) {
        setResults([]);
        setIsOpen(false);
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
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(value), debounceMs);
  };

  const handleSelect = (result: AddressSearchResult) => {
    setQuery(result.label);
    setIsOpen(false);
    setResults([]);
    onSelect(result);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((p) => (p < results.length - 1 ? p + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((p) => (p > 0 ? p - 1 : results.length - 1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
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

  const showDropdown = isOpen && !isLoading && (results.length > 0 || query.trim().length >= minChars);

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
            if (results.length > 0 || (query.trim().length >= minChars && !isLoading)) setIsOpen(true);
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
        <div id={listboxId} role="listbox" aria-label={labels.placeholder} className="aireon-search-menu">
          {results.length > 0 ? (
            results.map((result, index) => (
              <button
                key={result.id}
                id={`${listboxId}-opt-${index}`}
                role="option"
                aria-selected={index === selectedIndex}
                onClick={() => handleSelect(result)}
                className={'aireon-search-option' + (index === selectedIndex ? ' aireon-search-option--active' : '')}
              >
                <MapPin size={16} className="aireon-search-option-icon" aria-hidden="true" />
                <span className="aireon-search-option-label">{result.label}</span>
              </button>
            ))
          ) : (
            <div role="status" className="aireon-search-empty">
              <Search size={16} aria-hidden="true" />
              <span>{labels.noResults}</span>
            </div>
          )}
        </div>
      )}

      <div className="sr-only" role="status" aria-live="polite">
        {isLoading
          ? labels.loading
          : isOpen && results.length > 0
            ? (labels.resultsCount?.(results.length) ?? '')
            : isOpen && query.trim().length >= minChars
              ? labels.noResults
              : ''}
      </div>
    </div>
  );
}

export default AddressSearch;
