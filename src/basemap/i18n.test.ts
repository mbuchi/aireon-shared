import { describe, it, expect } from 'vitest';
import { getBasemapStrings, BASEMAP_STRINGS } from './i18n';
import { BASEMAP_OPTIONS } from './options';

const LOCALES = ['en', 'fr', 'de', 'it'] as const;

describe('basemap i18n', () => {
  it('has a label for every basemap id in every locale + a control label', () => {
    for (const loc of LOCALES) {
      const s = getBasemapStrings(loc);
      expect(s.control.length).toBeGreaterThan(0);
      for (const opt of BASEMAP_OPTIONS) {
        expect(s.options[opt.id], `${loc}/${opt.id}`).toBeTruthy();
      }
    }
  });

  it('carries no "Swisstopo" prefix in the english labels', () => {
    const s = getBasemapStrings('en');
    for (const v of Object.values(s.options)) expect(v).not.toMatch(/swisstopo/i);
  });

  it('falls back to english for an unknown locale', () => {
    expect(getBasemapStrings('xx' as any)).toEqual(BASEMAP_STRINGS.en);
  });
});
