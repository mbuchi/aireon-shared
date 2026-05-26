import type { Locale } from '../releaseNotes/i18n';

/** Display labels for each locale. Static; UI labels stay in their own
 *  language regardless of the currently active locale (DE, EN, FR, IT). */
const LOCALE_LABELS: Record<Locale, string> = {
  en: 'EN',
  fr: 'FR',
  de: 'DE',
  it: 'IT',
};

/** Order shown in the dropdown — matches the canonical suite ordering
 *  established by the scoore navbar. */
const LOCALE_OPTIONS: Locale[] = ['en', 'fr', 'de', 'it'];

export interface LocaleSelectorProps {
  /** Currently active locale. */
  locale: Locale;
  /** Called with the newly chosen locale when the user changes selection. */
  onChange: (locale: Locale) => void;
  /** Accessible label for screen readers. Defaults to "Select language". */
  ariaLabel?: string;
  /** Extra class names appended to the default styling. */
  className?: string;
}

/**
 * Compact suite-wide language selector. A 4-letter dropdown that switches the
 * active UI locale among the four SwissNovo languages (EN / FR / DE / IT).
 *
 * State is owned by the host app — pass the current `locale` and an
 * `onChange` handler. Styling matches the scoore navbar; consumers can extend
 * with `className`.
 */
export function LocaleSelector({
  locale,
  onChange,
  ariaLabel,
  className,
}: LocaleSelectorProps): JSX.Element {
  // Inline font-family pins Varela Round (the suite logo font) so the chip
  // reads as part of the brand cluster instead of falling back to the OS
  // default sans. Every app already loads the font via the Google Fonts
  // link in its index.html; sans-serif is the safety fallback.
  return (
    <select
      value={locale}
      onChange={(e) => onChange(e.target.value as Locale)}
      aria-label={ariaLabel ?? 'Select language'}
      style={{ fontFamily: "'Varela Round', sans-serif" }}
      className={[
        'h-9 text-xs font-semibold text-gray-500 dark:text-gray-400',
        'bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg px-1.5',
        'hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer',
        'focus:outline-none focus:ring-2 focus:ring-red-500/40',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {LOCALE_OPTIONS.map((l) => (
        <option
          key={l}
          value={l}
          style={{ fontFamily: "'Varela Round', sans-serif" }}
          className="bg-white dark:bg-gray-900"
        >
          {LOCALE_LABELS[l]}
        </option>
      ))}
    </select>
  );
}

export default LocaleSelector;
