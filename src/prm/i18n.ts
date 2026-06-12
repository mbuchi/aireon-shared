import type { PrmState, PrmPriority } from './api';

export type Locale = 'de' | 'en' | 'fr' | 'it';

export interface SavedParcelsStrings {
  title: string;
  /** Account-card edit-profile button text (lowercase verb, e.g. "edit"). */
  editProfile: string;
  totalParcels: string;
  refresh: string;
  exportCsv: string;
  openInProom: string;
  searchPlaceholder: string;
  filterAllStates: string;
  showingAll: (n: number) => string;
  showingFiltered: (n: number, total: number) => string;
  empty: string;
  emptyHint: string;
  noMatch: string;
  loadFailed: string;
  signinRequired: string;
  colAddress: string;
  colMunicipality: string;
  colState: string;
  colPriority: string;
  colTags: string;
  colUpdated: string;
  colActions: string;
  openHere: string;
  openInToolbox: string;
  openInGeopool: string;
  delete: string;
  tagPlaceholder: string;
  addTag: string;
  removeTag: (tag: string) => string;
  confirmDeleteTitle: string;
  confirmDeleteBody: string;
  close: string;
  cancel: string;
  state: Record<PrmState, string>;
  priority: Record<PrmPriority, string>;
}

const en: SavedParcelsStrings = {
  title: 'My saved parcels',
  editProfile: 'edit',
  totalParcels: 'total parcels',
  refresh: 'Refresh',
  exportCsv: 'Export CSV',
  openInProom: 'Open in proom',
  searchPlaceholder: 'Search address, tag, parcel ID…',
  filterAllStates: 'All states',
  showingAll: (n) => `${n} parcels`,
  showingFiltered: (n, total) => `${n} of ${total}`,
  empty: 'No saved parcels yet',
  emptyHint:
    'Save a parcel from any SwissNovo app and it will land here — and in proom.',
  noMatch: 'No parcels match your filter.',
  loadFailed: 'Could not load saved parcels',
  signinRequired: 'Sign in to view your saved parcels',
  colAddress: 'Address',
  colMunicipality: 'Municipality',
  colState: 'State',
  colPriority: 'Priority',
  colTags: 'Tags',
  colUpdated: 'Updated',
  colActions: 'Actions',
  openHere: 'Open here',
  openInToolbox: 'Open in toolbox',
  openInGeopool: 'Open in geopool',
  delete: 'Remove',
  tagPlaceholder: 'Tag…',
  addTag: 'Add',
  removeTag: (tag) => `Remove tag ${tag}`,
  confirmDeleteTitle: 'Stop tracking this parcel?',
  confirmDeleteBody:
    'It will be removed from proom too. This cannot be undone.',
  close: 'Close',
  cancel: 'Cancel',
  state: {
    new: 'New',
    contacted: 'Contacted',
    negotiation: 'Negotiation',
    due_diligence: 'Due Diligence',
    closed: 'Closed',
    rejected: 'Rejected',
  },
  priority: { low: 'Low', medium: 'Medium', high: 'High', urgent: 'Urgent' },
};

const fr: SavedParcelsStrings = {
  title: 'Mes parcelles enregistrées',
  editProfile: 'modifier',
  totalParcels: 'parcelles au total',
  refresh: 'Actualiser',
  exportCsv: 'Exporter en CSV',
  openInProom: 'Ouvrir dans proom',
  searchPlaceholder: 'Rechercher adresse, tag, ID…',
  filterAllStates: 'Tous les statuts',
  showingAll: (n) => `${n} parcelles`,
  showingFiltered: (n, total) => `${n} sur ${total}`,
  empty: 'Aucune parcelle enregistrée',
  emptyHint:
    'Enregistrez une parcelle depuis n\'importe quelle app SwissNovo — elle apparaîtra ici et dans proom.',
  noMatch: 'Aucune parcelle ne correspond.',
  loadFailed: 'Impossible de charger les parcelles',
  signinRequired: 'Connectez-vous pour voir vos parcelles',
  colAddress: 'Adresse',
  colMunicipality: 'Commune',
  colState: 'Statut',
  colPriority: 'Priorité',
  colTags: 'Tags',
  colUpdated: 'Mis à jour',
  colActions: 'Actions',
  openHere: 'Ouvrir ici',
  openInToolbox: 'Ouvrir dans toolbox',
  openInGeopool: 'Ouvrir dans geopool',
  delete: 'Supprimer',
  tagPlaceholder: 'Tag…',
  addTag: 'Ajouter',
  removeTag: (tag) => `Retirer le tag ${tag}`,
  confirmDeleteTitle: 'Ne plus suivre cette parcelle ?',
  confirmDeleteBody:
    'Elle sera aussi retirée de proom. Action irréversible.',
  close: 'Fermer',
  cancel: 'Annuler',
  state: {
    new: 'Nouveau',
    contacted: 'Contacté',
    negotiation: 'Négociation',
    due_diligence: 'Due diligence',
    closed: 'Clôturé',
    rejected: 'Rejeté',
  },
  priority: { low: 'Basse', medium: 'Moyenne', high: 'Haute', urgent: 'Urgent' },
};

const de: SavedParcelsStrings = {
  title: 'Meine gespeicherten Parzellen',
  editProfile: 'bearbeiten',
  totalParcels: 'Parzellen total',
  refresh: 'Aktualisieren',
  exportCsv: 'CSV exportieren',
  openInProom: 'In proom öffnen',
  searchPlaceholder: 'Adresse, Tag, Parzellen-ID…',
  filterAllStates: 'Alle Status',
  showingAll: (n) => `${n} Parzellen`,
  showingFiltered: (n, total) => `${n} von ${total}`,
  empty: 'Noch keine Parzellen gespeichert',
  emptyHint:
    'Speichere eine Parzelle aus einer beliebigen SwissNovo-App — sie erscheint hier und in proom.',
  noMatch: 'Keine Parzelle entspricht dem Filter.',
  loadFailed: 'Parzellen konnten nicht geladen werden',
  signinRequired: 'Melde dich an, um deine Parzellen zu sehen',
  colAddress: 'Adresse',
  colMunicipality: 'Gemeinde',
  colState: 'Status',
  colPriority: 'Priorität',
  colTags: 'Tags',
  colUpdated: 'Aktualisiert',
  colActions: 'Aktionen',
  openHere: 'Hier öffnen',
  openInToolbox: 'In toolbox öffnen',
  openInGeopool: 'In geopool öffnen',
  delete: 'Entfernen',
  tagPlaceholder: 'Tag…',
  addTag: 'Hinzufügen',
  removeTag: (tag) => `Tag ${tag} entfernen`,
  confirmDeleteTitle: 'Parzelle nicht mehr verfolgen?',
  confirmDeleteBody:
    'Sie wird auch aus proom entfernt. Diese Aktion ist endgültig.',
  close: 'Schliessen',
  cancel: 'Abbrechen',
  state: {
    new: 'Neu',
    contacted: 'Kontaktiert',
    negotiation: 'Verhandlung',
    due_diligence: 'Due Diligence',
    closed: 'Abgeschlossen',
    rejected: 'Abgelehnt',
  },
  priority: { low: 'Niedrig', medium: 'Mittel', high: 'Hoch', urgent: 'Dringend' },
};

const it: SavedParcelsStrings = {
  title: 'Le mie particelle salvate',
  editProfile: 'modifica',
  totalParcels: 'particelle totali',
  refresh: 'Aggiorna',
  exportCsv: 'Esporta CSV',
  openInProom: 'Apri in proom',
  searchPlaceholder: 'Cerca indirizzo, tag, ID particella…',
  filterAllStates: 'Tutti gli stati',
  showingAll: (n) => `${n} particelle`,
  showingFiltered: (n, total) => `${n} di ${total}`,
  empty: 'Nessuna particella salvata',
  emptyHint:
    'Salva una particella da una qualsiasi app SwissNovo — comparirà qui e in proom.',
  noMatch: 'Nessuna particella corrisponde.',
  loadFailed: 'Impossibile caricare le particelle',
  signinRequired: 'Accedi per vedere le tue particelle',
  colAddress: 'Indirizzo',
  colMunicipality: 'Comune',
  colState: 'Stato',
  colPriority: 'Priorità',
  colTags: 'Tag',
  colUpdated: 'Aggiornata',
  colActions: 'Azioni',
  openHere: 'Apri qui',
  openInToolbox: 'Apri in toolbox',
  openInGeopool: 'Apri in geopool',
  delete: 'Rimuovi',
  tagPlaceholder: 'Tag…',
  addTag: 'Aggiungi',
  removeTag: (tag) => `Rimuovi tag ${tag}`,
  confirmDeleteTitle: 'Smettere di seguire questa particella?',
  confirmDeleteBody:
    'Sarà rimossa anche da proom. Azione irreversibile.',
  close: 'Chiudi',
  cancel: 'Annulla',
  state: {
    new: 'Nuova',
    contacted: 'Contattata',
    negotiation: 'Negoziazione',
    due_diligence: 'Due diligence',
    closed: 'Chiusa',
    rejected: 'Rifiutata',
  },
  priority: { low: 'Bassa', medium: 'Media', high: 'Alta', urgent: 'Urgente' },
};

export const SAVED_PARCELS_STRINGS: Record<Locale, SavedParcelsStrings> = {
  en, fr, de, it,
};

export const getSavedParcelsStrings = (
  locale: Locale = 'en',
): SavedParcelsStrings => SAVED_PARCELS_STRINGS[locale] ?? SAVED_PARCELS_STRINGS.en;
