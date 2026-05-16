import type { ChangeKind } from './types';

/** Languages supported across the SwissNovo suite. */
export type Locale = 'de' | 'en' | 'fr' | 'it';

export interface ReleaseNotesStrings {
  /** Panel <h1>, followed by the brand wordmark. */
  whatsNewIn: string;
  /** Subtitle lead-in, followed by "vX · codename · date". */
  subtitleLead: string;
  /** Suffix on the pulsing "vX <live>" badge. */
  live: string;
  /** "{n} releases" badge. */
  releases: string;
  /** "{n} changes" badge. */
  changes: string;
  /** Link to the repo's pull-request list. */
  viewAllPRs: string;
  /** Search input placeholder. */
  searchPlaceholder: string;
  /** "All" filter chip. */
  filterAll: string;
  /** Empty-state when a filter/search matches nothing. */
  noMatch: string;
  /** "Latest" badge on the newest release. */
  latest: string;
  /** Singular / plural noun for the per-release change count. */
  change: string;
  changesPlural: string;
  /** Footer sentence, split around the linked "SemVer" word. */
  footerPre: string;
  footerPost: string;
  /** Footer dismiss button + close-icon aria-label. */
  close: string;
  /** Dialog aria-label. */
  dialogLabel: string;
  /** Button tooltip / aria-label lead-in, followed by " — vX". */
  whatsNew: string;
  /** Change-kind labels (badges + filter chips). */
  kind: Record<ChangeKind, string>;
}

export const RELEASE_NOTES_STRINGS: Record<Locale, ReleaseNotesStrings> = {
  en: {
    whatsNewIn: "What's new in",
    subtitleLead: 'Every shipped change, grouped by version. Latest release',
    live: 'live',
    releases: 'releases',
    changes: 'changes',
    viewAllPRs: 'View all PRs',
    searchPlaceholder: 'Search changes, versions, or PR numbers… ( / to focus)',
    filterAll: 'All',
    noMatch: 'No changes match that filter.',
    latest: 'Latest',
    change: 'change',
    changesPlural: 'changes',
    footerPre: 'Versions follow',
    footerPost: '. History is reconstructed from merged pull requests.',
    close: 'Close',
    dialogLabel: 'Release notes',
    whatsNew: "What's new",
    kind: { new: 'New', improved: 'Improved', fixed: 'Fixed', breaking: 'Breaking', docs: 'Docs' },
  },
  de: {
    whatsNewIn: 'Neuigkeiten in',
    subtitleLead: 'Jede ausgelieferte Änderung, nach Version gruppiert. Neueste Version',
    live: 'live',
    releases: 'Versionen',
    changes: 'Änderungen',
    viewAllPRs: 'Alle PRs ansehen',
    searchPlaceholder: 'Änderungen, Versionen oder PR-Nummern suchen… ( / zum Fokussieren)',
    filterAll: 'Alle',
    noMatch: 'Keine Änderungen passen zu diesem Filter.',
    latest: 'Neueste',
    change: 'Änderung',
    changesPlural: 'Änderungen',
    footerPre: 'Versionen folgen',
    footerPost: '. Der Verlauf wird aus zusammengeführten Pull Requests rekonstruiert.',
    close: 'Schließen',
    dialogLabel: 'Versionshinweise',
    whatsNew: 'Neuigkeiten',
    kind: { new: 'Neu', improved: 'Verbessert', fixed: 'Behoben', breaking: 'Breaking', docs: 'Docs' },
  },
  fr: {
    whatsNewIn: 'Nouveautés dans',
    subtitleLead: 'Chaque changement livré, regroupé par version. Dernière version',
    live: 'en ligne',
    releases: 'versions',
    changes: 'changements',
    viewAllPRs: 'Voir toutes les PR',
    searchPlaceholder: 'Rechercher changements, versions ou numéros de PR… ( / pour cibler)',
    filterAll: 'Tous',
    noMatch: 'Aucun changement ne correspond à ce filtre.',
    latest: 'Dernière',
    change: 'changement',
    changesPlural: 'changements',
    footerPre: 'Les versions suivent',
    footerPost: '. L’historique est reconstruit à partir des pull requests fusionnées.',
    close: 'Fermer',
    dialogLabel: 'Notes de version',
    whatsNew: 'Nouveautés',
    kind: { new: 'Nouveau', improved: 'Amélioré', fixed: 'Corrigé', breaking: 'Breaking', docs: 'Docs' },
  },
  it: {
    whatsNewIn: 'Novità in',
    subtitleLead: 'Ogni modifica rilasciata, raggruppata per versione. Ultima versione',
    live: 'attiva',
    releases: 'versioni',
    changes: 'modifiche',
    viewAllPRs: 'Vedi tutte le PR',
    searchPlaceholder: 'Cerca modifiche, versioni o numeri di PR… ( / per mettere a fuoco)',
    filterAll: 'Tutti',
    noMatch: 'Nessuna modifica corrisponde a questo filtro.',
    latest: 'Ultima',
    change: 'modifica',
    changesPlural: 'modifiche',
    footerPre: 'Le versioni seguono',
    footerPost: '. La cronologia è ricostruita dalle pull request unite.',
    close: 'Chiudi',
    dialogLabel: 'Note di rilascio',
    whatsNew: 'Novità',
    kind: { new: 'Nuovo', improved: 'Migliorato', fixed: 'Corretto', breaking: 'Breaking', docs: 'Docs' },
  },
};

export const getReleaseNotesStrings = (locale: Locale = 'en'): ReleaseNotesStrings =>
  RELEASE_NOTES_STRINGS[locale] ?? RELEASE_NOTES_STRINGS.en;
