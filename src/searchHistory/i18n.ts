// Localized strings for the search-history UI (account-menu row, modal, and the
// AddressSearch "Recent" dropdown). Mirrors src/prm/i18n.ts: English defaults so
// a consumer can drop the feature in with no strings, plus de/fr/it.

export type Locale = 'de' | 'en' | 'fr' | 'it';

export interface SearchHistoryStrings {
  /** Account-menu row + modal title. */
  menuRow: string;
  title: string;
  /** Header above the recent list in the AddressSearch dropdown. */
  recent: string;
  empty: string;
  emptyHint: string;
  signinRequired: string;
  clearAll: string;
  /** Confirming label after the first "Clear all" click. */
  clearAllConfirm: string;
  /** Per-row "open this place again" action. */
  open: string;
  remove: string;
  close: string;
  /** Trailing meta, e.g. "searched 3×". */
  searchedTimes: (n: number) => string;
}

const en: SearchHistoryStrings = {
  menuRow: 'My search history',
  title: 'My search history',
  recent: 'Recent searches',
  empty: 'No searches yet',
  emptyHint: 'Addresses you search across Aireon apps appear here.',
  signinRequired: 'Sign in to keep your search history across apps',
  clearAll: 'Clear all',
  clearAllConfirm: 'Confirm clear?',
  open: 'Open',
  remove: 'Remove',
  close: 'Close',
  searchedTimes: (n) => (n > 1 ? `searched ${n}×` : 'searched once'),
};

const de: SearchHistoryStrings = {
  menuRow: 'Mein Suchverlauf',
  title: 'Mein Suchverlauf',
  recent: 'Zuletzt gesucht',
  empty: 'Noch keine Suchen',
  emptyHint: 'Adressen, die du in Aireon-Apps suchst, erscheinen hier.',
  signinRequired: 'Melde dich an, um deinen Suchverlauf appübergreifend zu behalten',
  clearAll: 'Alle löschen',
  clearAllConfirm: 'Wirklich löschen?',
  open: 'Öffnen',
  remove: 'Entfernen',
  close: 'Schliessen',
  searchedTimes: (n) => (n > 1 ? `${n}× gesucht` : 'einmal gesucht'),
};

const fr: SearchHistoryStrings = {
  menuRow: 'Mon historique de recherche',
  title: 'Mon historique de recherche',
  recent: 'Recherches récentes',
  empty: 'Aucune recherche',
  emptyHint: 'Les adresses recherchées dans les apps Aireon apparaissent ici.',
  signinRequired: 'Connectez-vous pour conserver votre historique entre les apps',
  clearAll: 'Tout effacer',
  clearAllConfirm: 'Confirmer ?',
  open: 'Ouvrir',
  remove: 'Supprimer',
  close: 'Fermer',
  searchedTimes: (n) => (n > 1 ? `recherché ${n}×` : 'recherché une fois'),
};

const it: SearchHistoryStrings = {
  menuRow: 'Cronologia ricerche',
  title: 'Cronologia ricerche',
  recent: 'Ricerche recenti',
  empty: 'Nessuna ricerca',
  emptyHint: 'Gli indirizzi cercati nelle app Aireon compaiono qui.',
  signinRequired: 'Accedi per mantenere la cronologia tra le app',
  clearAll: 'Cancella tutto',
  clearAllConfirm: 'Confermi?',
  open: 'Apri',
  remove: 'Rimuovi',
  close: 'Chiudi',
  searchedTimes: (n) => (n > 1 ? `cercato ${n}×` : 'cercato una volta'),
};

export const SEARCH_HISTORY_STRINGS: Record<Locale, SearchHistoryStrings> = {
  en,
  de,
  fr,
  it,
};

export function getSearchHistoryStrings(locale: Locale = 'en'): SearchHistoryStrings {
  return SEARCH_HISTORY_STRINGS[locale] ?? en;
}
