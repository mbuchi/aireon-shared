# People avatar pack for the shared profile — design

**Date:** 2026-06-10
**Package:** `@aireon/shared` (target release `v1.13.0`)
**Status:** approved (decisions confirmed with owner)

## Problem

The suite-wide avatar catalogue (`src/profile/avatars.ts`) offered only 16 cute
animal emoji, rendered as Twemoji SVGs from the jsDelivr GitHub CDN. The owner
supplied a new pack of 10 flat-illustration human portrait avatars and wants
users to be able to pick them from their profile in every aireon app.

## Decisions

- **People first, emoji secondary.** The 10 illustrated people become the
  primary group at the top of the picker; the 16 emoji animals remain as a
  second group below. (Not a replacement — keeps every existing user's chosen
  avatar working.)
- **Friendly first names** as labels: Mia, Leo, Lena, Noah, Luca, Nina, Felix,
  Clara, Theo, Maya. Stable ids (`person-01`…`person-10`) are decoupled from the
  labels, so a label can change without breaking a persisted `avatar_id`.

## Assets

- The supplied pack had 10 × 1254px PNG originals (~1 MB each) plus 10 × 256px
  compressed JPGs (~7–8 KB each). Only the 256px JPGs are committed
  (`assets/avatars/person-01.jpg`…`person-10.jpg`, ~84 KB total). 256px is ample
  for an avatar shown at ≤80px even on 3× displays; the 1 MB PNGs are kept out of
  git to keep the repo lean.
- Each image is a coloured circle inscribed in a neutral grey square. Rendered
  `rounded-full`, the disc fills and the grey corners are clipped away.

## Serving

People images are served from the **jsDelivr GitHub CDN pinned to the release
tag** — the same approach already used for Twemoji:

```
https://cdn.jsdelivr.net/gh/mbuchi/aireon-shared@v1.13.0/assets/avatars/person-01.jpg
```

`aireon-shared` is a public repo, so jsDelivr can serve it. The tag pin gives
stable bytes and a permanent CDN cache. `PEOPLE_ASSET_TAG` in `avatars.ts` only
needs bumping if the image files themselves change — not on every package
release. The release tag `v1.13.0` must be pushed for the URLs to resolve.

## Code

- **`avatars.ts`** — `AvatarOption` gains `group: 'people' | 'emoji'` and an
  optional `file` (people) alongside the existing optional `codepoint` (emoji).
  `avatarUrl()` branches: `file` → CDN image URL, else → Twemoji SVG.
  `avatarOptions` lists the 10 people first, then the 16 emoji. New exported type
  `AvatarGroup`.
- **`ProfileModal.tsx`** — the picker renders one labelled sub-section per group
  ("People", then "Emoji"). People tiles render the photo `rounded-full
  object-cover`; emoji tiles keep the tinted `object-contain` treatment. Microcopy
  updated "SwissNovo" → "aireon".
- **No change** to `Avatar`, `useUserProfile`, or `profileStore`: `avatar_id`
  already flows through `avatarUrlById()` transparently, so the header avatar,
  localStorage persistence, and RES sync all work unchanged for the new ids.

## Testing

`src/profile/avatars.test.ts` (vitest): unique ids; exactly 10 people listed
before the emoji; each option carries exactly one render source for its group;
people resolve to the CDN image URL and emoji to a Twemoji SVG; `avatarUrlById`
resolves known ids and returns `null` otherwise.

## Rollout

Shipping the shared change makes the pack *available* suite-wide. Each app picks
it up by bumping its `@aireon/shared` git dependency to `#v1.13.0`
(`npm install "github:mbuchi/aireon-shared#v1.13.0"`) — a separate, optional
follow-up across the ~30 apps.

## Update — v1.13.1 (2026-06-11): WebP optimization

The shipped JPEGs were re-derived from the 1254px PNG originals as **256px WebP**
(`cwebp -q 80 -m 6 -sharp_yuv`), replacing `person-NN.jpg` with `person-NN.webp`.
Total payload for the 10 avatars dropped **74 KB → 33 KB (−56%)** while improving
sharpness (no JPEG ringing on the flat-art edges; sourced from clean originals,
not re-compressed). 256px is retained — it covers the largest display (80px) at
3× DPI. WebP is universally supported by the suite's browsers, and `Avatar` falls
back to initials on any load failure, so no JPEG fallback is needed.
`PEOPLE_ASSET_TAG` bumped to `v1.13.1` (the assets changed, so the CDN pin and
git tag move together).

## Out of scope

- Rolling the new tag into the individual apps (separate task).
- High-resolution (1254px) originals and any per-avatar retina variants.
- Custom user-uploaded avatars.
