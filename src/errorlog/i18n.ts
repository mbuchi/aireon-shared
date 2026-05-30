// Localised strings for the BugReportButton widget — de / en / fr / it,
// matching the suite's four-language convention.

export type Locale = 'de' | 'en' | 'fr' | 'it';

export interface BugReportStrings {
  /** Floating button label + aria-label. */
  button: string;
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
