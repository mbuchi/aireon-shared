import { describe, it, expect } from 'vitest';
import { avatarOptions, avatarUrl, avatarUrlById } from './avatars';

describe('avatar catalogue', () => {
  it('has unique, non-empty ids', () => {
    const ids = avatarOptions.map((o) => o.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('lists the illustrated people before the emoji animals', () => {
    const people = avatarOptions.filter((o) => o.group === 'people');
    const emoji = avatarOptions.filter((o) => o.group === 'emoji');
    // 10 original "person-*" + 20 female + 19 male illustrated headshots.
    expect(people).toHaveLength(49);
    expect(emoji.length).toBeGreaterThan(0);
    // People occupy the front of the array (people-first picker order).
    expect(avatarOptions.slice(0, people.length).every((o) => o.group === 'people')).toBe(true);
  });

  it('every option carries exactly one render source for its group', () => {
    for (const opt of avatarOptions) {
      if (opt.group === 'people') {
        expect(opt.file, opt.id).toBeTruthy();
        expect(opt.codepoint).toBeUndefined();
      } else {
        expect(opt.codepoint, opt.id).toBeTruthy();
        expect(opt.file).toBeUndefined();
      }
    }
  });

  it('people resolve to a CDN image URL, emoji to a Twemoji SVG', () => {
    const mia = avatarOptions.find((o) => o.id === 'person-01')!;
    expect(avatarUrl(mia)).toBe(
      'https://cdn.jsdelivr.net/gh/mbuchi/aireon-shared@v1.14.0/assets/avatars/person-01.webp',
    );
    const emma = avatarOptions.find((o) => o.id === 'female-01')!;
    expect(avatarUrl(emma)).toBe(
      'https://cdn.jsdelivr.net/gh/mbuchi/aireon-shared@v1.14.0/assets/avatars/female-01.webp',
    );
    const fox = avatarOptions.find((o) => o.id === 'fox')!;
    expect(avatarUrl(fox)).toContain('jdecked/twemoji');
    expect(avatarUrl(fox)).toMatch(/\.svg$/);
  });

  it('avatarUrlById resolves known ids and returns null otherwise', () => {
    expect(avatarUrlById('person-10')).toContain('person-10.webp');
    expect(avatarUrlById('male-19')).toContain('male-19.webp');
    expect(avatarUrlById('panda')).toContain('1f43c.svg');
    expect(avatarUrlById('does-not-exist')).toBeNull();
    expect(avatarUrlById(null)).toBeNull();
    expect(avatarUrlById(undefined)).toBeNull();
  });
});
