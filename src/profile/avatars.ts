// Curated avatar catalogue for the SwissNovo suite.
//
// Every app used to ship a byte-identical copy of this list. It now lives
// here so a user's avatar is defined once and looks the same in every app.
// Avatars are cute animal emoji, rendered as flat Twemoji SVGs so they look
// identical on every operating system and browser.

export interface AvatarOption {
  /** Stable identifier persisted in the user's profile. */
  id: string;
  /** Human-readable label, shown as a tooltip in the picker. */
  label: string;
  /** Lowercase Unicode codepoint of the emoji — builds the Twemoji URL. */
  codepoint: string;
  /** Soft pastel background for the picker tile (reads on light + dark). */
  tint: string;
}

// Pinned Twemoji release (the maintained `jdecked` fork). Pinned, not
// `@latest`, so the rendered image is stable and CDN-cache-friendly.
const TWEMOJI_TAG = '15.1.0';
const TWEMOJI_BASE = `https://cdn.jsdelivr.net/gh/jdecked/twemoji@${TWEMOJI_TAG}/assets/svg`;

/** The full set of avatars a user can pick from. Order is the picker order. */
export const avatarOptions: AvatarOption[] = [
  { id: 'fox',     label: 'Fox',     codepoint: '1f98a', tint: '#fde4d3' },
  { id: 'panda',   label: 'Panda',   codepoint: '1f43c', tint: '#e8eef2' },
  { id: 'tiger',   label: 'Tiger',   codepoint: '1f42f', tint: '#fdeecb' },
  { id: 'koala',   label: 'Koala',   codepoint: '1f428', tint: '#e3e7ea' },
  { id: 'owl',     label: 'Owl',     codepoint: '1f989', tint: '#ece1d2' },
  { id: 'rabbit',  label: 'Rabbit',  codepoint: '1f430', tint: '#f6e7ee' },
  { id: 'cat',     label: 'Cat',     codepoint: '1f431', tint: '#fbe6cf' },
  { id: 'dog',     label: 'Dog',     codepoint: '1f436', tint: '#f0e4d4' },
  { id: 'bear',    label: 'Bear',    codepoint: '1f43b', tint: '#e9ddcf' },
  { id: 'monkey',  label: 'Monkey',  codepoint: '1f435', tint: '#ede0d1' },
  { id: 'penguin', label: 'Penguin', codepoint: '1f427', tint: '#dde6ec' },
  { id: 'lion',    label: 'Lion',    codepoint: '1f981', tint: '#fdeccb' },
  { id: 'frog',    label: 'Frog',    codepoint: '1f438', tint: '#dff0d8' },
  { id: 'chick',   label: 'Chick',   codepoint: '1f425', tint: '#fdf3cf' },
  { id: 'unicorn', label: 'Unicorn', codepoint: '1f984', tint: '#f1e3f5' },
  { id: 'octopus', label: 'Octopus', codepoint: '1f419', tint: '#f7dde0' },
];

/** Render URL for a catalogue avatar. */
export function avatarUrl(opt: AvatarOption): string {
  return `${TWEMOJI_BASE}/${opt.codepoint}.svg`;
}

/** Render URL for a catalogue avatar id, or `null` when the id is unknown. */
export function avatarUrlById(id: string | null | undefined): string | null {
  if (!id) return null;
  const opt = avatarOptions.find((a) => a.id === id);
  return opt ? avatarUrl(opt) : null;
}

/**
 * Render URL for a free-form seed (legacy "generated" avatar). Retained as a
 * public package export for backward compatibility; it has no current
 * consumer. Falls back to a DiceBear pixel-art avatar.
 */
export function avatarUrlFromSeed(seed: string): string {
  return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(seed)}&radius=50`;
}
