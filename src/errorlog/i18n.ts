// Localised strings for the BugReportButton widget — de / en / fr / it,
// matching the suite's four-language convention.

export type Locale = 'de' | 'en' | 'fr' | 'it';

export interface BugReportCategoryOption {
  id: string;
  label: string;
}

export interface BugReportStrings {
  /** Floating button label + aria-label. */
  button: string;
  /** Report type selector: bug. */
  bug: string;
  /** Report type selector: feedback. */
  feedback: string;
  /** Optional category group label. */
  categoryPrompt: string;
  /** Optional categories shown when reporting an error. */
  bugCategories: BugReportCategoryOption[];
  /** Optional categories shown when sending feedback. */
  feedbackCategories: BugReportCategoryOption[];
  /** Dialog heading. */
  title: string;
  /** Short helper line under the heading. */
  subtitle: string;
  /** Description textarea placeholder. */
  messagePlaceholder: string;
  /** Email input label. */
  emailLabel: string;
  /** Email input placeholder. */
  emailPlaceholder: string;
  /** Submit button (idle). */
  send: string;
  /** Submit button (in-flight). */
  sending: string;
  /** Success confirmation. */
  successTitle: string;
  successBody: string;
  /** Failure message. */
  error: string;
  /** Close button / icon aria-label. */
  close: string;
  /** Dialog aria-label. */
  dialogLabel: string;
}

export const BUG_REPORT_STRINGS: Record<Locale, BugReportStrings> = {
  de: {
    button: 'Problem melden',
    bug: 'Fehler',
    feedback: 'Feedback',
    categoryPrompt: 'Worum geht es? (optional)',
    bugCategories: [
      { id: 'data_error', label: 'Datenfehler' },
      { id: 'ui_bug', label: 'Oberflächenfehler' },
      { id: 'map_location', label: 'Karte oder Adresse' },
      { id: 'login_access', label: 'Login oder Zugriff' },
      { id: 'performance_crash', label: 'Absturz oder langsam' },
    ],
    feedbackCategories: [
      { id: 'feature_request', label: 'Funktionswunsch' },
      { id: 'data_improvement', label: 'Daten verbessern' },
      { id: 'usability', label: 'Bedienung' },
      { id: 'design_content', label: 'Design oder Inhalte' },
      { id: 'general_feedback', label: 'Allgemeines Feedback' },
    ],
    title: 'Ein Problem melden',
    subtitle: 'Etwas funktioniert nicht? Beschreiben Sie es kurz — wir kümmern uns darum.',
    messagePlaceholder: 'Was ist passiert? Was haben Sie erwartet?',
    emailLabel: 'E-Mail (optional)',
    emailPlaceholder: 'sie@beispiel.ch',
    send: 'Senden',
    sending: 'Wird gesendet …',
    successTitle: 'Danke!',
    successBody: 'Ihre Meldung ist bei uns eingegangen.',
    error: 'Senden fehlgeschlagen. Bitte später erneut versuchen.',
    close: 'Schliessen',
    dialogLabel: 'Problem melden',
  },
  en: {
    button: 'Report a problem',
    bug: 'Bug',
    feedback: 'Feedback',
    categoryPrompt: 'What is it about? (optional)',
    bugCategories: [
      { id: 'data_error', label: 'Data error' },
      { id: 'ui_bug', label: 'Application UI bug' },
      { id: 'map_location', label: 'Map or address issue' },
      { id: 'login_access', label: 'Login or access issue' },
      { id: 'performance_crash', label: 'Crash or performance' },
    ],
    feedbackCategories: [
      { id: 'feature_request', label: 'Feature request' },
      { id: 'data_improvement', label: 'Data improvement' },
      { id: 'usability', label: 'Usability' },
      { id: 'design_content', label: 'Design or content' },
      { id: 'general_feedback', label: 'General feedback' },
    ],
    title: 'Report a problem',
    subtitle: 'Something not working? Tell us briefly — we’ll look into it.',
    messagePlaceholder: 'What happened? What did you expect?',
    emailLabel: 'Email (optional)',
    emailPlaceholder: 'you@example.ch',
    send: 'Send',
    sending: 'Sending …',
    successTitle: 'Thank you!',
    successBody: 'Your report has reached us.',
    error: 'Could not send. Please try again later.',
    close: 'Close',
    dialogLabel: 'Report a problem',
  },
  fr: {
    button: 'Signaler un problème',
    bug: 'Bug',
    feedback: 'Avis',
    categoryPrompt: 'De quoi s’agit-il ? (facultatif)',
    bugCategories: [
      { id: 'data_error', label: 'Erreur de données' },
      { id: 'ui_bug', label: 'Bug d’interface' },
      { id: 'map_location', label: 'Carte ou adresse' },
      { id: 'login_access', label: 'Connexion ou accès' },
      { id: 'performance_crash', label: 'Blocage ou lenteur' },
    ],
    feedbackCategories: [
      { id: 'feature_request', label: 'Demande de fonction' },
      { id: 'data_improvement', label: 'Amélioration des données' },
      { id: 'usability', label: 'Utilisation' },
      { id: 'design_content', label: 'Design ou contenu' },
      { id: 'general_feedback', label: 'Avis général' },
    ],
    title: 'Signaler un problème',
    subtitle: 'Quelque chose ne fonctionne pas ? Décrivez-le brièvement — nous nous en occupons.',
    messagePlaceholder: 'Que s’est-il passé ? À quoi vous attendiez-vous ?',
    emailLabel: 'E-mail (facultatif)',
    emailPlaceholder: 'vous@exemple.ch',
    send: 'Envoyer',
    sending: 'Envoi …',
    successTitle: 'Merci !',
    successBody: 'Votre signalement nous est bien parvenu.',
    error: 'Échec de l’envoi. Veuillez réessayer plus tard.',
    close: 'Fermer',
    dialogLabel: 'Signaler un problème',
  },
  it: {
    button: 'Segnala un problema',
    bug: 'Bug',
    feedback: 'Feedback',
    categoryPrompt: 'Di cosa si tratta? (facoltativo)',
    bugCategories: [
      { id: 'data_error', label: 'Errore nei dati' },
      { id: 'ui_bug', label: 'Bug interfaccia app' },
      { id: 'map_location', label: 'Mappa o indirizzo' },
      { id: 'login_access', label: 'Login o accesso' },
      { id: 'performance_crash', label: 'Crash o lentezza' },
    ],
    feedbackCategories: [
      { id: 'feature_request', label: 'Richiesta funzione' },
      { id: 'data_improvement', label: 'Miglioramento dati' },
      { id: 'usability', label: 'Usabilità' },
      { id: 'design_content', label: 'Design o contenuti' },
      { id: 'general_feedback', label: 'Feedback generale' },
    ],
    title: 'Segnala un problema',
    subtitle: 'Qualcosa non funziona? Descrivilo brevemente — ce ne occupiamo noi.',
    messagePlaceholder: 'Cosa è successo? Cosa ti aspettavi?',
    emailLabel: 'E-mail (facoltativo)',
    emailPlaceholder: 'tu@esempio.ch',
    send: 'Invia',
    sending: 'Invio …',
    successTitle: 'Grazie!',
    successBody: 'La tua segnalazione ci è arrivata.',
    error: 'Invio non riuscito. Riprova più tardi.',
    close: 'Chiudi',
    dialogLabel: 'Segnala un problema',
  },
};

export function getBugReportStrings(locale: Locale | string | undefined): BugReportStrings {
  if (locale && locale in BUG_REPORT_STRINGS) {
    return BUG_REPORT_STRINGS[locale as Locale];
  }
  return BUG_REPORT_STRINGS.de;
}
