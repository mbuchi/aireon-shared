# ProfileModal redesign + animal-emoji avatars — design

**Date:** 2026-05-19
**Package:** `@swissnovo/shared` (`swissnovo-shared` repo)
**Status:** approved, ready for implementation plan

## Problem

The suite-standard `ProfileModal` (`src/profile/ProfileModal.tsx`) looks out of
place against the SwissNovo dark theme:

- A tall (96px) blue→cyan gradient banner clashes with the near-black app UI.
- Blue accents (avatar selection ring, `Save changes` button) — the suite
  primary colour is **red**.
- Panel uses `dark:bg-gray-800`; the suite-standard `LoginModal` uses
  `dark:bg-gray-900`.

The avatar catalogue (`src/profile/avatars.ts`) is also a poor fit: it renders
DiceBear styles (`fun-emoji`, `bottts`, `adventurer`, …) with arbitrary seeds,
so the labels ("Fox", "Panda") do not match the rendered images (star-faced
emoji, robots, sunglasses faces).

## Goal

1. Restyle `ProfileModal` to be a visual sibling of `LoginModal`.
2. Replace the avatar catalogue with a coherent set of **cute animal-emoji
   avatars** rendered as flat **Twemoji** SVGs.

Both changes are confined to `@swissnovo/shared`. No consuming app is edited.

## Out of scope (follow-ups, not this effort)

1. **Cross-app rollout.** Apps pin a `@swissnovo/shared` version; they will not
   see this change until each app's `package.json` is bumped and the package is
   reinstalled. That is a separate ~26-app rollout task.
2. **Local ProfileModal copies.** `roots`, `boost`, `valooEngine`, and
   `handbook2` ship their own pre-shared profile code (`ProfileModal.tsx`,
   `AvatarPicker.tsx`, local `avatars.ts`, and in valooEngine a local
   `profileStore`). They do not consume the shared modal and are left untouched.

## Design

### 1. Avatar catalogue — `src/profile/avatars.ts`

Replace the DiceBear catalogue with 16 animal-emoji avatars:

| id | label | emoji | codepoint |
|----|-------|-------|-----------|
| `fox`      | Fox      | 🦊 | `1f98a` |
| `panda`    | Panda    | 🐼 | `1f43c` |
| `tiger`    | Tiger    | 🐯 | `1f42f` |
| `koala`    | Koala    | 🐨 | `1f428` |
| `owl`      | Owl      | 🦉 | `1f989` |
| `rabbit`   | Rabbit   | 🐰 | `1f430` |
| `cat`      | Cat      | 🐱 | `1f431` |
| `dog`      | Dog      | 🐶 | `1f436` |
| `bear`     | Bear     | 🐻 | `1f43b` |
| `monkey`   | Monkey   | 🐵 | `1f435` |
| `penguin`  | Penguin  | 🐧 | `1f427` |
| `lion`     | Lion     | 🦁 | `1f981` |
| `frog`     | Frog     | 🐸 | `1f438` |
| `chick`    | Chick    | 🐥 | `1f425` |
| `unicorn`  | Unicorn  | 🦄 | `1f984` |
| `octopus`  | Octopus  | 🐙 | `1f419` |

Type changes:

- `AvatarOption` becomes `{ id: string; label: string; codepoint: string; tint: string }`.
  - `codepoint` — lowercase Unicode hex, used to build the Twemoji URL.
  - `tint` — a soft pastel hex (e.g. `#fde4d3`) used as the picker tile
    background. One per animal; values chosen to read well on both a light
    (`bg-white`) and dark (`bg-gray-900`) panel.
- The `AvatarStyle` type is **removed** (DiceBear-specific, no other consumer).

Render functions:

- `avatarUrl(opt)` returns the pinned Twemoji CDN URL:
  `https://cdn.jsdelivr.net/gh/jdecked/twemoji@<TAG>/assets/svg/<codepoint>.svg`
  - `<TAG>` is a **pinned** release tag of the maintained `jdecked/twemoji`
    fork — not `@latest`. During implementation, verify the chosen tag and a
    sample asset URL (e.g. `.../<TAG>/assets/svg/1f98a.svg`) actually resolve
    before finalising.
- `avatarUrlById(id)` is **unchanged in signature/behaviour** — still
  `id → URL | null`. This keeps the `useUserProfile` → app-header pipeline
  working with zero app changes.
- `avatarUrlFromSeed(seed)` is **kept as-is**. It is a public package export
  with no current consumer; removing it would be a needless breaking change.

Back-compat for persisted `avatar_id` values:

- The 8 ids that already exist (`fox`, `panda`, `tiger`, `koala`, `owl`,
  `rabbit`, `cat`, `dog`) carry over unchanged — users keep their avatar.
- Retired ids (`bot-mint`, `bot-rose`, `bot-sky`, `bot-sun`, `explorer`,
  `voyager`, `lorelei`, `thumbs`) are no longer in the catalogue, so
  `avatarUrlById` returns `null` and `Avatar` falls back to initials. This is
  existing, graceful behaviour — no migration code required.

### 2. ProfileModal layout — `src/profile/ProfileModal.tsx`

Restyle to match `LoginModal` (Option A — "LoginModal-aligned"):

- **Remove** the `h-24 bg-gradient-to-br from-blue-500 to-cyan-500` banner.
- Top edge becomes the suite accent strip: a `1.5`-tall bar,
  `bg-gradient-to-r from-red-500 via-red-600 to-rose-700` — identical to
  `LoginModal`.
- Panel background: `dark:bg-gray-800` → `dark:bg-gray-900` (matches LoginModal).
- Avatar sits centred at the top of the body — no banner, no negative top
  margin. Size ~80px, subtle ring border.
- Close `X`: a quiet ghost button in the top-right of the body
  (`text-gray-400 hover:text-gray-600 dark:hover:text-gray-300`), replacing the
  `bg-white/20` button that sat on the banner.
- Identity block (name, email, "Active session" pill) unchanged. The green
  status dot stays — green is a status indicator, not a brand accent.
- Avatar picker grid:
  - Each tile uses its animal's `tint` as background, `rounded-xl`.
  - The Twemoji image is `object-contain` with small padding so the emoji is
    inset within the tile.
  - Selected tile: blue ring/border → **red**
    (`border-red-500 ring-2 ring-red-500/30`). The check badge: `bg-blue-500` →
    `bg-red-500`.
- Form fields (Gender select, Age input, About textarea):
  - Dark background `dark:bg-gray-900` → `dark:bg-gray-800` so the field is
    visible against the now-`gray-900` panel.
  - Focus ring `focus:ring-blue-500` → `focus:ring-red-500`.
- Actions:
  - `Close` — unchanged quiet ghost button.
  - `Save changes` — `bg-blue-600 hover:bg-blue-700` → `bg-red-600
    hover:bg-red-700`, `rounded-lg` → `rounded-xl` to match LoginModal's
    primary button.
- The `swn-profile-in` keyframe animation and `createPortal` mount are
  unchanged.

### 3. Avatar component — `src/profile/Avatar.tsx`

- Twemoji SVGs are transparent. The image branch background `bg-white` becomes
  a soft neutral tint, with `object-cover` → `object-contain` plus small
  padding so the emoji breathes inside the circular frame. This is a single
  generic change; no consuming app/header is touched.
- Initials-fallback background `bg-blue-600` → `bg-red-600` for suite
  consistency.

## Files touched

| File | Change |
|------|--------|
| `src/profile/avatars.ts`      | New catalogue, new `AvatarOption`, drop `AvatarStyle`, Twemoji `avatarUrl` |
| `src/profile/ProfileModal.tsx`| Option A restyle (no banner, red accents, gray-900 panel) |
| `src/profile/Avatar.tsx`      | Transparent-emoji-friendly bg + `object-contain`; red initials fallback |
| `src/index.ts`                | Remove the `AvatarStyle` re-export |

## Verification

- `npm run build` (or the repo's type-check/lint script) passes — in
  particular `src/index.ts` no longer re-exports the removed `AvatarStyle`.
- Confirm the pinned Twemoji asset URL resolves (HTTP 200) for at least one
  codepoint.
- Visual check: ProfileModal rendered against a dark app shows the red accent
  strip, gray-900 panel, animal-emoji grid, red selection ring, red Save
  button — no blue, no cyan banner.

## Release

`@swissnovo/shared` change — bump the package version per the repo's
versioning convention and follow the shared-package publish/commit flow. The
cross-app rollout (bumping each app's dependency) is the separate follow-up
noted under "Out of scope".
