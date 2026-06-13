import * as react_jsx_runtime from 'react/jsx-runtime';

interface ComparableInput {
    /** Reference parcel — typically the one open in the info panel. */
    ref: {
        lng: number;
        lat: number;
        properties: Record<string, unknown>;
    };
    /** Candidate pool from the map viewport. */
    pool: Array<{
        lng: number;
        lat: number;
        properties: Record<string, unknown>;
    }>;
    /** Max results. */
    limit?: number;
    /** Only consider parcels with `is_sell` true; default true. */
    onlyForSale?: boolean;
}
interface Comparable {
    parcelId: string;
    lng: number;
    lat: number;
    distanceM: number;
    priceM2: number;
    area: number | null;
    zone: string | null;
    city: string | null;
    similarity: number;
    properties: Record<string, unknown>;
}
declare function rankComparables(input: ComparableInput): Comparable[];

type Locale = 'de' | 'en' | 'fr' | 'it';
interface ComparablesLabels {
    /** Status text shown while ranking candidates. */
    loading: string;
    /** Shown when no for-sale comparables are found nearby. */
    empty: string;
    /**
     * aria-label for each comparable card. Receives the already-formatted price
     * (CHF/m², no unit), the rounded distance in metres, and the formatted plot
     * area (or "—" when unknown).
     */
    cardAria: (vals: {
        price: string;
        distance: number;
        area: string;
    }) => string;
}
declare const COMPARABLES_STRINGS: Record<Locale, ComparablesLabels>;
declare const getComparablesStrings: (locale?: Locale) => ComparablesLabels;

interface ComparablesPanelProps {
    refPriceM2: number | null;
    comparables: Comparable[];
    loading: boolean;
    darkMode: boolean;
    onJumpTo: (lng: number, lat: number) => void;
    /**
     * Localized strings. When omitted, the built-in defaults for `locale` are
     * used — so a host app can adopt the panel with only `locale`, or pass
     * `labels` to wire it to its own i18n.
     */
    labels?: ComparablesLabels;
    /** Locale for the built-in default labels when `labels` is not given. */
    locale?: Locale;
}
declare function ComparablesPanel({ refPriceM2, comparables, loading, darkMode, onJumpTo, labels, locale, }: ComparablesPanelProps): react_jsx_runtime.JSX.Element;

export { COMPARABLES_STRINGS, type Comparable, type ComparableInput, type ComparablesLabels, type Locale as ComparablesLocale, ComparablesPanel, ComparablesPanel as ComparablesPanelDefault, type ComparablesPanelProps, getComparablesStrings, rankComparables };
