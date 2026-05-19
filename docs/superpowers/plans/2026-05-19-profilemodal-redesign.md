# ProfileModal Redesign + Animal-Emoji Avatars Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the suite-standard `ProfileModal` to match `LoginModal` (dark theme, red accents) and replace the DiceBear avatar catalogue with 16 cute animal-emoji avatars rendered as flat Twemoji SVGs.

**Architecture:** All changes are confined to the `@swissnovo/shared` package (`swissnovo-shared` repo, `src/profile/`). The avatar render pipeline stays URL-based (`avatarUrlById` → `<img>`), so no consuming app is touched. Spec: `docs/superpowers/specs/2026-05-19-profilemodal-redesign-design.md`.

**Tech Stack:** TypeScript, React, Tailwind CSS, `tsup` build. No test framework in this repo — verification is `npm run typecheck`, `npm run build`, and a visual dev-server check.

---

## Notes for the implementer

- **No test framework exists** in `swissnovo-shared` (no `vitest`/`jest`, zero test files). Do **not** add one for this restyle — verification is `npm run typecheck` and `npm run build`, exactly as the repo already works.
- Work happens on branch `redesign/profile-modal` (already created; the design spec is already committed there).
- `git` identity for this repo is already set (`mbuchi` / `36930043+mbuchi@users.noreply.github.com`). Do not change it.
- The Twemoji tag `15.1.0` has been verified — all 16 codepoints below return HTTP 200 from `https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/<codepoint>.svg`.

---

## File Structure

| File | Responsibility | Action |
|------|----------------|--------|
| `src/profile/avatars.ts` | Avatar catalogue + URL builders | Rewrite |
| `src/profile/index.ts` | `profile` module barrel | Edit (drop `AvatarStyle`) |
| `src/index.ts` | Package root barrel | Edit (drop `AvatarStyle`) |
| `src/profile/ProfileModal.tsx` | The "View profile" modal | Rewrite |
| `src/profile/Avatar.tsx` | Reusable avatar `<img>` + initials fallback | Edit |
| `package.json` | Package version | Edit (bump) |

---

## Task 1: Replace the avatar catalogue

The catalogue API (`AvatarOption`, `avatarUrl`) changes shape, and the `AvatarStyle` type is removed. `avatars.ts` and both export barrels are edited together so the package never type-checks in a broken state.

**Files:**
- Modify: `src/profile/avatars.ts` (full rewrite)
- Modify: `src/profile/index.ts:18`
- Modify: `src/index.ts:68`

- [ ] **Step 1: Rewrite `src/profile/avatars.ts`**

Replace the entire file contents with:

```ts
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
```

- [ ] **Step 2: Drop `AvatarStyle` from the profile barrel**

In `src/profile/index.ts`, line 18 currently reads:

```ts
export type { AvatarOption, AvatarStyle } from './avatars';
```

Change it to:

```ts
export type { AvatarOption } from './avatars';
```

- [ ] **Step 3: Drop `AvatarStyle` from the root barrel**

In `src/index.ts`, the type-export block (around line 63-70) currently reads:

```ts
export type {
  ProfileModalProps,
  AvatarProps,
  UseUserProfileResult,
  AvatarOption,
  AvatarStyle,
  SwissnovoProfile,
  Gender,
} from './profile';
```

Remove the `AvatarStyle,` line so it reads:

```ts
export type {
  ProfileModalProps,
  AvatarProps,
  UseUserProfileResult,
  AvatarOption,
  SwissnovoProfile,
  Gender,
} from './profile';
```

- [ ] **Step 4: Type-check**

Run: `npm run typecheck`
Expected: PASS (exit 0, no errors). The removed `AvatarStyle` is no longer referenced anywhere; `avatarUrl`/`avatarUrlById`/`avatarOptions` keep their names so `ProfileModal.tsx` still compiles against them.

- [ ] **Step 5: Commit**

```bash
git add src/profile/avatars.ts src/profile/index.ts src/index.ts
git commit -m "feat(profile): animal-emoji avatar catalogue via Twemoji

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Restyle ProfileModal (LoginModal-aligned)

Removes the blue→cyan banner, switches the panel to `gray-900`, adds the suite red accent strip, and recolours every blue accent to red.

**Files:**
- Modify: `src/profile/ProfileModal.tsx` (full rewrite of the JSX return + the picker)

- [ ] **Step 1: Rewrite `src/profile/ProfileModal.tsx`**

Replace the entire file contents with:

```tsx
// The suite-standard "View profile" modal.
//
// One surface for the whole SwissNovo suite: it shows the user's identity and
// the avatar they actually chose, lets them change that avatar from the
// catalogue, and edit a few profile details. Backed by `useUserProfile`, so
// the avatar shown here and in every app header is always the same one.
//
// Styled as a sibling of the suite `LoginModal`: a near-black panel with the
// thin red accent strip — never the old bright banner.

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, X } from 'lucide-react';
import type { User } from 'oidc-client-ts';
import { Avatar } from './Avatar';
import { avatarOptions, avatarUrl } from './avatars';
import { emailOf, fullNameOf, initialsOf } from './identity';
import { useUserProfile } from './useUserProfile';
import type { Gender, SwissnovoProfile } from './profileStore';

export interface ProfileModalProps {
  /** The signed-in OIDC user. */
  user: User;
  /** Called on any dismiss path (backdrop, Esc, close buttons). */
  onClose: () => void;
  /**
   * Force dark styling. Only needed for apps that theme via a boolean rather
   * than a `dark` class on an ancestor element.
   */
  dark?: boolean;
}

const GENDER_OPTIONS: Array<{ value: Gender; label: string }> = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'unspecified', label: 'Prefer not to say' },
];

const FIELD_CLASS =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 ' +
  'focus:outline-none focus:ring-2 focus:ring-red-500 ' +
  'dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100';

/** The standard SwissNovo profile modal. Render it only while open. */
export function ProfileModal({ user, onClose, dark = false }: ProfileModalProps) {
  const { profile, avatarId, avatarUrl: chosenUrl, setAvatarId, updateProfile } =
    useUserProfile(user);

  // Avatar changes apply instantly; the text/select details use a draft so a
  // RES sync only fires when the user explicitly saves.
  const [draft, setDraft] = useState<Pick<SwissnovoProfile, 'gender' | 'age' | 'about'>>({
    gender: profile.gender,
    age: profile.age,
    about: profile.about,
  });

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const name = fullNameOf(user) || initialsOf(user);
  const email = emailOf(user);
  const initials = initialsOf(user);

  const dirty = useMemo(
    () =>
      draft.gender !== profile.gender ||
      draft.age !== profile.age ||
      draft.about !== profile.about,
    [draft, profile],
  );

  function handleSave() {
    updateProfile(draft);
    onClose();
  }

  return createPortal(
    <div
      className={`${dark ? 'dark ' : ''}fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Profile"
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-sm flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'swn-profile-in 0.22s cubic-bezier(0.34,1.56,0.64,1) both' }}
      >
        {/* Suite accent strip — matches LoginModal */}
        <div className="h-1.5 shrink-0 bg-gradient-to-r from-red-500 via-red-600 to-rose-700" />

        <div className="relative flex-1 overflow-y-auto px-5 pb-5 pt-6">
          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            aria-label="Close"
          >
            <X size={16} />
          </button>

          {/* Identity */}
          <div className="flex flex-col items-center">
            <span className="rounded-full ring-2 ring-gray-100 dark:ring-gray-800">
              <Avatar url={chosenUrl} initials={initials} size={80} />
            </span>
            <div className="mt-3 text-center">
              <div className="max-w-[16rem] truncate text-base font-semibold text-gray-900 dark:text-gray-100">
                {name}
              </div>
              {email && (
                <div className="max-w-[16rem] truncate text-xs text-gray-500 dark:text-gray-400">
                  {email}
                </div>
              )}
              <div className="mt-1.5 flex items-center justify-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                <span className="text-[11px] font-medium text-green-600 dark:text-green-400">
                  Active session
                </span>
              </div>
            </div>
          </div>

          {/* Avatar picker */}
          <div className="mt-5">
            <div className="mb-2 text-xs font-medium text-gray-700 dark:text-gray-300">
              Choose your avatar
            </div>
            <p className="mb-3 text-[11px] text-gray-500 dark:text-gray-400">
              Your pick follows you across every Swissnovo app.
            </p>
            <div className="grid grid-cols-4 gap-2.5">
              {avatarOptions.map((opt) => {
                const selected = opt.id === avatarId;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAvatarId(opt.id)}
                    title={opt.label}
                    aria-label={opt.label}
                    aria-pressed={selected}
                    className={`relative aspect-square rounded-xl border-2 p-1.5 transition-all ${
                      selected
                        ? 'border-red-500 ring-2 ring-red-500/30'
                        : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    style={{ backgroundColor: opt.tint }}
                  >
                    <img
                      src={avatarUrl(opt)}
                      alt={opt.label}
                      className="h-full w-full object-contain"
                    />
                    {selected && (
                      <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow">
                        <Check size={12} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details */}
          <div className="mt-5 space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Gender
              </label>
              <select
                value={draft.gender}
                onChange={(e) => setDraft((d) => ({ ...d, gender: e.target.value as Gender }))}
                className={FIELD_CLASS}
              >
                {GENDER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Age
              </label>
              <input
                type="number"
                min={0}
                max={120}
                value={draft.age ?? ''}
                onChange={(e) => {
                  const v = e.target.value;
                  setDraft((d) => ({
                    ...d,
                    age: v === '' ? null : Math.max(0, Math.min(120, Number(v))),
                  }));
                }}
                placeholder="—"
                className={FIELD_CLASS}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                About
              </label>
              <textarea
                rows={3}
                value={draft.about}
                onChange={(e) => setDraft((d) => ({ ...d, about: e.target.value }))}
                placeholder="A short bio (optional)"
                className={`${FIELD_CLASS} resize-none`}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!dirty}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes swn-profile-in{from{opacity:0;transform:scale(0.9) translateY(12px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </div>,
    document.body,
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npm run typecheck`
Expected: PASS (exit 0). All imports (`avatarOptions`, `avatarUrl`, `Avatar`, identity helpers, `Gender`, `SwissnovoProfile`) are unchanged names.

- [ ] **Step 3: Commit**

```bash
git add src/profile/ProfileModal.tsx
git commit -m "feat(profile): restyle ProfileModal to match LoginModal

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Update the Avatar component

Twemoji SVGs are transparent, so the header avatar `<img>` needs a soft background and `object-contain` with padding. The initials fallback recolours from blue to suite red.

**Files:**
- Modify: `src/profile/Avatar.tsx:23` and `src/profile/Avatar.tsx:38`

- [ ] **Step 1: Recolour the initials fallback**

In `src/profile/Avatar.tsx`, the fallback `<span>` (around line 23) currently has:

```tsx
className={`inline-flex items-center justify-center rounded-full bg-blue-600 font-semibold text-white ${className}`}
```

Change `bg-blue-600` to `bg-red-600`:

```tsx
className={`inline-flex items-center justify-center rounded-full bg-red-600 font-semibold text-white ${className}`}
```

- [ ] **Step 2: Give the image branch a transparent-emoji-friendly background**

In the same file, the `<img>` (around line 38) currently has:

```tsx
className={`rounded-full bg-white object-cover ${className}`}
```

Change it to a soft neutral background with `object-contain` and a little padding so the emoji sits inside the circular frame:

```tsx
className={`rounded-full bg-gray-100 object-contain p-0.5 dark:bg-gray-700 ${className}`}
```

- [ ] **Step 3: Type-check**

Run: `npm run typecheck`
Expected: PASS (exit 0). Class-name strings only — no API change.

- [ ] **Step 4: Commit**

```bash
git add src/profile/Avatar.tsx
git commit -m "feat(profile): tune Avatar for transparent emoji art

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Build, version bump, and publish

**Files:**
- Modify: `package.json` (version)

- [ ] **Step 1: Build the package**

Run: `npm run build`
Expected: PASS — `tsup` completes, `dist/` regenerated, no errors. This confirms `dist/index.d.ts` no longer references `AvatarStyle`.

- [ ] **Step 2: Bump the package version**

In `package.json`, change `"version": "0.14.0"` to `"version": "0.15.0"` (minor bump — new avatar catalogue + restyle; the `AvatarStyle` type removal is a contained internal-suite type change).

- [ ] **Step 3: Commit the version bump**

```bash
git add package.json
git commit -m "chore: release @swissnovo/shared 0.15.0

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 4: Visual verification (dev-side smoke check)**

There is no automated UI test. Confirm by inspection / a consuming app:
- The ProfileModal shows the thin red accent strip at the top, a `gray-900` panel, **no** blue→cyan banner.
- The avatar grid shows 16 animal emoji on pastel tiles; the selected tile has a **red** ring + red check badge.
- `Gender`/`Age`/`About` fields show a **red** focus ring; `Save changes` is **red**.
- At least one Twemoji asset loads — e.g. open `https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/1f98a.svg` (the fox) in a browser; it returns the SVG.

- [ ] **Step 5: Push the branch and open a PR**

```bash
git push -u origin redesign/profile-modal
gh pr create --title "Redesign ProfileModal + animal-emoji avatars" --body "$(cat <<'EOF'
## Summary
- Restyle the suite-standard `ProfileModal` as a sibling of `LoginModal`: drop the blue→cyan banner, near-black `gray-900` panel, thin red accent strip, red Save button + selection ring.
- Replace the DiceBear avatar catalogue with 16 cute animal-emoji avatars rendered as flat Twemoji SVGs (pinned `jdecked/twemoji@15.1.0`).
- `Avatar` component tuned for transparent emoji art; initials fallback recoloured blue → suite red.

## Scope
- Confined to `@swissnovo/shared`. The avatar pipeline stays URL-based, so no consuming app is edited.
- Pre-existing avatar ids `fox/panda/tiger/koala/owl/rabbit/cat/dog` carry over; retired ids fall back to initials.

## Follow-ups (not in this PR)
- Cross-app rollout: bump each app's `@swissnovo/shared` dependency to `0.15.0`.
- The local pre-shared ProfileModal copies in `roots`/`boost`/`valooEngine`/`handbook2` are untouched.

Design spec: `docs/superpowers/specs/2026-05-19-profilemodal-redesign-design.md`

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 6: Merge the PR**

Confirm the active `gh` account is `mbuchi` (`gh auth status`; if not, `gh auth switch --user mbuchi`), then:

```bash
gh pr merge --squash --delete-branch
```

- [ ] **Step 7: Report**

Summarise: PR URL, merged ✓, new `@swissnovo/shared` version (`0.15.0`), and the reminder that apps must bump their dependency to pick this up.

---

## Self-Review

**Spec coverage:**
- Section 1 (avatar catalogue) → Task 1. 16 animals, `codepoint`+`tint`, Twemoji `avatarUrl`, `AvatarStyle` removed, `avatarUrlById`/`avatarUrlFromSeed` retained ✓
- Section 2 (ProfileModal layout) → Task 2. Banner removed, red strip, `gray-900`, centred avatar, ghost close, red picker selection, `gray-800` fields, red focus ring, red `rounded-xl` Save ✓
- Section 3 (Avatar component) → Task 3. Neutral bg + `object-contain`, red initials fallback ✓
- "Files touched" incl. `src/index.ts` → Task 1 Step 3 ✓
- Spec "Verification" (build passes, Twemoji URL resolves, visual check) → Task 4 Steps 1, 4 ✓
- Spec "Release" (version bump + publish flow) → Task 4 ✓
- Out-of-scope items (cross-app rollout, local copies) → recorded in the PR body, not implemented ✓

**Placeholder scan:** No `TBD`/`TODO`. Every code step shows complete file content or an exact before/after edit. The Twemoji tag is a concrete pinned value (`15.1.0`), verified.

**Type consistency:** `AvatarOption` defined in Task 1 with `{ id, label, codepoint, tint }`; Task 2 reads `opt.id`, `opt.label`, `opt.tint` and calls `avatarUrl(opt)` — all consistent. `avatarOptions`, `avatarUrl`, `avatarUrlById` keep their Task-1 names everywhere they are used. `FIELD_CLASS` is defined once in `ProfileModal.tsx` and reused by all three fields.
