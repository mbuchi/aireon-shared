// Curated avatar catalogue for the SwissNovo suite.
//
// Every app used to ship a byte-identical copy of this list. It now lives
// here so a user's avatar is defined once and looks the same in every app.
// The avatars themselves are rendered by DiceBear (https://dicebear.com).

export type AvatarStyle =
  | 'fun-emoji'
  | 'bottts'
  | 'big-ears'
  | 'adventurer'
  | 'lorelei'
  | 'thumbs';

export interface AvatarOption {
  /** Stable identifier persisted in the user's profile. */
  id: string;
  /** Human-readable label, shown as a tooltip in the picker. */
  label: string;
  style: AvatarStyle;
  /** DiceBear seed — together with `style` this fixes the rendered image. */
  seed: string;
}

const DICEBEAR = 'https://api.dicebear.com/9.x';

/** The full set of avatars a user can pick from. Order is the picker order. */
export const avatarOptions: AvatarOption[] = [
  { id: 'fox',      label: 'Fox',      style: 'fun-emoji',  seed: 'Felix' },
  { id: 'panda',    label: 'Panda',    style: 'fun-emoji',  seed: 'Aneka' },
  { id: 'tiger',    label: 'Tiger',    style: 'fun-emoji',  seed: 'Sasha' },
  { id: 'koala',    label: 'Koala',    style: 'fun-emoji',  seed: 'Bandit' },
  { id: 'owl',      label: 'Owl',      style: 'big-ears',   seed: 'Salem' },
  { id: 'rabbit',   label: 'Rabbit',   style: 'big-ears',   seed: 'Pixie' },
  { id: 'cat',      label: 'Cat',      style: 'big-ears',   seed: 'Mochi' },
  { id: 'dog',      label: 'Dog',      style: 'big-ears',   seed: 'Biscuit' },
  { id: 'bot-mint', label: 'Mint Bot', style: 'bottts',     seed: 'Sprout' },
  { id: 'bot-rose', label: 'Rose Bot', style: 'bottts',     seed: 'Cocoa' },
  { id: 'bot-sky',  label: 'Sky Bot',  style: 'bottts',     seed: 'Comet' },
  { id: 'bot-sun',  label: 'Sun Bot',  style: 'bottts',     seed: 'Honey' },
  { id: 'explorer', label: 'Explorer', style: 'adventurer', seed: 'Atlas' },
  { id: 'voyager',  label: 'Voyager',  style: 'adventurer', seed: 'River' },
  { id: 'lorelei',  label: 'Pal',      style: 'lorelei',    seed: 'Maple' },
  { id: 'thumbs',   label: 'Star',     style: 'thumbs',     seed: 'Nova' },
];

/** Render URL for a catalogue avatar. */
export function avatarUrl(opt: AvatarOption): string {
  return `${DICEBEAR}/${opt.style}/svg?seed=${encodeURIComponent(opt.seed)}&radius=50`;
}

/** Render URL for a catalogue avatar id, or `null` when the id is unknown. */
export function avatarUrlById(id: string | null | undefined): string | null {
  if (!id) return null;
  const opt = avatarOptions.find((a) => a.id === id);
  return opt ? avatarUrl(opt) : null;
}

/**
 * Render URL for a free-form seed (legacy "generated" avatar). Used only as a
 * fallback for users who never picked a catalogue avatar.
 */
export function avatarUrlFromSeed(seed: string): string {
  return `${DICEBEAR}/pixel-art/svg?seed=${encodeURIComponent(seed)}&radius=50`;
}
