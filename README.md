# @swissnovo/shared

Shared UI components and utilities for the [SwissNovo](https://toolbox.swissnovo.com) app suite.
Eliminates file-for-file duplication across the ~30 sibling apps — fix a bug once here, bump the
tag, and every consumer picks it up.

## Install

Consumed directly from this Git repo, pinned to a release tag (no npm registry):

```jsonc
// package.json of a consuming app
"dependencies": {
  "@swissnovo/shared": "github:mbuchi/swissnovo-shared#v0.2.0"
}
```

Then `npm install`. The built `dist/` is committed, so installs need no build step.

## Tailwind

The components ship Tailwind utility classes. Each consuming app must let its Tailwind build
**see** those classes, or they get purged. Add the package to `tailwind.config.js` `content`:

```js
content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}',
  './node_modules/@swissnovo/shared/dist/**/*.js',
],
```

The red `oo` wordmark uses the `Varela Round` font — already loaded by every suite app.

## Exports

### `ReleaseNotesButton` / `ReleaseNotesPanel`

The versioned changelog pill + slide-in panel. Each app keeps its own `src/data/releaseNotes.ts`
(the `RELEASES` data) and imports the types/`KIND_META` from here.

```tsx
import { ReleaseNotesButton } from '@swissnovo/shared';
import { RELEASES, REPO_URL } from '../data/releaseNotes';

<ReleaseNotesButton
  releases={RELEASES}
  repoUrl={REPO_URL}
  storageKey="boom:lastSeenReleaseVersion"
  brandPrefix="b"
  brandSuffix="m"
  zIndex={2000}        // optional, default 60
/>
```

```ts
// src/data/releaseNotes.ts
import type { Release } from '@swissnovo/shared';
export const RELEASES: Release[] = [ /* ... */ ];
export const CURRENT_VERSION = RELEASES[0].version;
export const REPO_URL = 'https://github.com/mbuchi/<app>';
```

## Developing this package

```sh
npm install
npm run build      # rebuilds dist/ via tsup
npm run typecheck
```

**`dist/` is committed.** After any source change: `npm run build`, commit the rebuilt `dist/`,
then tag a new version (`git tag v0.x.y && git push --tags`). Consuming apps bump their tag to
pick it up.
