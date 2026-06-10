import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  BASEMAP_OPTIONS, getBasemapOption, themeBasemapId, resolveBasemapStyle,
} from './options';

describe('basemap options', () => {
  it('defines exactly the six unified basemaps in order', () => {
    expect(BASEMAP_OPTIONS.map((b) => b.id)).toEqual([
      'swisstopo-base', 'swisstopo-light', 'light-minimal',
      'swisstopo-dark', 'dark-minimal', 'swisstopo-imagery',
    ]);
  });

  it('themeBasemapId maps dark/light to the detailed dark/light basemaps', () => {
    expect(themeBasemapId(true)).toBe('swisstopo-dark');
    expect(themeBasemapId(false)).toBe('swisstopo-light');
  });

  it('getBasemapOption falls back to the first option for an unknown id', () => {
    expect(getBasemapOption('nope').id).toBe('swisstopo-base');
  });

  it('resolveBasemapStyle returns the bare URL when there is no transform', async () => {
    const base = getBasemapOption('swisstopo-base');
    expect(await resolveBasemapStyle(base)).toBe(base.styleUrl);
  });

  it('resolveBasemapStyle fetches + transforms when a transform is set', async () => {
    const fakeStyle = { version: 8, sources: {}, layers: [] };
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => fakeStyle });
    vi.stubGlobal('fetch', fetchMock);
    const dark = getBasemapOption('swisstopo-dark'); // has styleTransform
    const out = await resolveBasemapStyle(dark);
    expect(fetchMock).toHaveBeenCalledWith(dark.styleUrl);
    expect(typeof out).toBe('object'); // transformed style object, not a URL string
  });
});

beforeEach(() => vi.unstubAllGlobals());
