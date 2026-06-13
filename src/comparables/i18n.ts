// Default localized labels for the shared ComparablesPanel. Apps may pass their
// own `labels` (e.g. wired to their existing i18n) — these defaults exist so a
// new app can adopt the panel with nothing more than a `locale` prop.
//
// Only the three strings the panel itself renders live here. The section
// heading ("Nearby comparables (for sale)") is drawn by the host parcel panel,
// so it stays in each app's own i18n.

export type Locale = 'de' | 'en' | 'fr' | 'it';

export interface ComparablesLabels {
  /** Status text shown while ranking candidates. */
  loading: string;
  /** Shown when no for-sale comparables are found nearby. */
  empty: string;
  /**
   * aria-label for each comparable card. Receives the already-formatted price
   * (CHF/m², no unit), the rounded distance in metres, and the formatted plot
   * area (or "—" when unknown).
   */
  cardAria: (vals: { price: string; distance: number; area: string }) => string;
}

const en: ComparablesLabels = {
  loading: 'Looking for nearby for-sale parcels…',
  empty: 'No for-sale comparables found nearby. Zoom out for a wider catchment.',
  cardAria: ({ price, distance, area }) =>
    `Comparable parcel at ${price} CHF per m², ${distance}m away, ${area} m²`,
};

const fr: ComparablesLabels = {
  loading: 'Recherche de parcelles à vendre à proximité…',
  empty: 'Aucune parcelle à vendre à proximité. Dézoomez pour élargir la zone.',
  cardAria: ({ price, distance, area }) =>
    `Parcelle comparable à ${price} CHF par m², à ${distance} m, ${area} m²`,
};

const de: ComparablesLabels = {
  loading: 'Suche nach Verkaufsparzellen in der Nähe…',
  empty:
    'Keine Verkaufsparzellen in der Nähe gefunden. Herauszoomen für einen grösseren Radius.',
  cardAria: ({ price, distance, area }) =>
    `Vergleichsparzelle zu ${price} CHF pro m², ${distance} m entfernt, ${area} m²`,
};

const it: ComparablesLabels = {
  loading: 'Ricerca di parcelle in vendita nelle vicinanze…',
  empty:
    'Nessuna parcella in vendita nelle vicinanze. Allontana lo zoom per ampliare il raggio.',
  cardAria: ({ price, distance, area }) =>
    `Parcella comparabile a ${price} CHF al m², ${distance} m di distanza, ${area} m²`,
};

export const COMPARABLES_STRINGS: Record<Locale, ComparablesLabels> = {
  en,
  fr,
  de,
  it,
};

export const getComparablesStrings = (
  locale: Locale = 'en',
): ComparablesLabels => COMPARABLES_STRINGS[locale] ?? COMPARABLES_STRINGS.en;
