export type BasemapLocale = 'en' | 'fr' | 'de' | 'it';

export interface BasemapLabels {
  /** aria-label for the picker trigger / control. */
  control: string;
  /** basemap id → display name. */
  options: Record<string, string>;
}

export const BASEMAP_STRINGS: Record<BasemapLocale, BasemapLabels> = {
  en: { control: 'Basemap', options: {
    'swisstopo-base': 'Standard', 'swisstopo-light': 'Light', 'light-minimal': 'Light Minimal',
    'swisstopo-dark': 'Dark', 'dark-minimal': 'Dark Minimal', 'swisstopo-imagery': 'Aerial',
  } },
  fr: { control: 'Fond de carte', options: {
    'swisstopo-base': 'Standard', 'swisstopo-light': 'Clair', 'light-minimal': 'Clair épuré',
    'swisstopo-dark': 'Sombre', 'dark-minimal': 'Sombre épuré', 'swisstopo-imagery': 'Aérien',
  } },
  de: { control: 'Grundkarte', options: {
    'swisstopo-base': 'Standard', 'swisstopo-light': 'Hell', 'light-minimal': 'Hell minimal',
    'swisstopo-dark': 'Dunkel', 'dark-minimal': 'Dunkel minimal', 'swisstopo-imagery': 'Luftbild',
  } },
  it: { control: 'Mappa di base', options: {
    'swisstopo-base': 'Standard', 'swisstopo-light': 'Chiaro', 'light-minimal': 'Chiaro minimale',
    'swisstopo-dark': 'Scuro', 'dark-minimal': 'Scuro minimale', 'swisstopo-imagery': 'Aerea',
  } },
};

export function getBasemapStrings(locale: string): BasemapLabels {
  return BASEMAP_STRINGS[(locale as BasemapLocale)] ?? BASEMAP_STRINGS.en;
}
