import { describe, it, expect } from 'vitest';
import { nextThemeBasemap } from './BasemapPicker';

describe('nextThemeBasemap', () => {
  it('returns the theme basemap when not pinned', () => {
    expect(nextThemeBasemap({ dark: true, pinned: false, current: 'swisstopo-light' })).toBe('swisstopo-dark');
    expect(nextThemeBasemap({ dark: false, pinned: false, current: 'swisstopo-dark' })).toBe('swisstopo-light');
  });
  it('returns null (no change) when pinned', () => {
    expect(nextThemeBasemap({ dark: true, pinned: true, current: 'swisstopo-imagery' })).toBeNull();
  });
  it('returns null when already on the matching theme basemap', () => {
    expect(nextThemeBasemap({ dark: true, pinned: false, current: 'swisstopo-dark' })).toBeNull();
  });
});
