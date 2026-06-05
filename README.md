# @aireon/shared

Shared UI components and utilities for the [aireon](https://toolbox.swissnovo.com) app suite.
Eliminates file-for-file duplication across the ~30 sibling apps — fix a bug once here, bump the
tag, and every consumer picks it up.

## Install

Consumed directly from this Git repo, pinned to a release tag (no npm registry):

```jsonc
// package.json of a consuming app
"dependencies": {
  "@aireon/shared": "github:mbuchi/aireon-shared#v1.0.0"
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
  './node_modules/@aireon/shared/dist/**/*.js',
],
```

The red `oo` wordmark uses the `Varela Round` font — already loaded by every suite app.

### Page title convention

The browser tab `<title>` (and any runtime title source — an i18n `meta.title` key, or the
toolbox catalog's `capabilityMatrix.title`) uses the format **`appname - Subtitle`** with a
plain ASCII hyphen separator (`-`), never an em dash (`—`):

```html
<!-- do -->
<title>room - Swiss Zoning Density Explorer</title>
<!-- don't -->
<title>room — Swiss Zoning Density Explorer</title>
```

Em dashes are fine as ordinary punctuation in descriptions, `og:title`, or `twitter:title` —
the rule applies only to the app-name → subtitle separator in the browser title. New apps
should ship the hyphen form from the start.

## Exports

### `ReleaseNotesButton` / `ReleaseNotesPanel`

The versioned changelog pill + slide-in panel. Each app keeps its own `src/data/releaseNotes.ts`
(the `RELEASES` data) and imports the types/`KIND_META` from here.

```tsx
import { ReleaseNotesButton } from '@aireon/shared';
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
import type { Release } from '@aireon/shared';
export const RELEASES: Release[] = [ /* ... */ ];
export const CURRENT_VERSION = RELEASES[0].version;
export const REPO_URL = 'https://github.com/mbuchi/<app>';
```

### `createResApiClient` — typed RES API client

A fully typed client for the [RES API](https://res.zeroo.ch/api-docs), generated from its
OpenAPI 3.1 contract. Replaces ad-hoc `fetch` calls with one typed surface, and always sends
`X-RES-API-Version: 2` so callers get proper `4xx`/`5xx` status codes + JSON error bodies.

**Import it from the `/api` subpath** in server-side code (Vercel functions, Node, edge):

```ts
import { createResApiClient } from '@aireon/shared/api';
```

The `/api` subpath is server-safe — it omits the browser-only modules (the auth module
touches `window` at load), so it works in Vercel edge/serverless functions. The same export
is also re-exported from the package root for browser code.

**Authentication** — both options are server-side only; never ship a token to the browser:

- `token` — sent as the `token` header. Used by the parcel, score, OEREB and legacy-image endpoints.
- `bearerToken` — sent as `Authorization: Bearer …`. Used by the `/res_api/signal/*` endpoints
  and the `/image/swissnovo/*` endpoints.

In the browser, point `baseUrl` at your app's own `/api/*` proxy and pass no token.

```ts
import { createResApiClient } from '@aireon/shared/api';

const res = createResApiClient({ token: process.env.RES_TOKEN });

const { data, error, response } = await res.POST('/res_api/parcel_data', {
  body: { lat: 47.3769, lng: 8.5417, structure: 'tree' },
});
if (error) throw new Error(error.error);     // typed JsonError
// `data` is typed from the OpenAPI contract
```

Binary / plain-text endpoints (`parcel_image`, `parcel_boundary_data`, the `/res_api` health
check) need an explicit `parseAs`, e.g. `res.GET('/res_api/parcel_image', { params, parseAs: 'blob' })`.

The contract is vendored as `openapi.json`; regenerate the types after it changes with
`npm run generate:api`.

## Developing this package

```sh
npm install
npm run build      # rebuilds dist/ via tsup
npm run typecheck
```

**`dist/` is committed.** After any source change: `npm run build`, commit the rebuilt `dist/`,
then tag a new version (`git tag v0.x.y && git push --tags`). Consuming apps bump their tag to
pick it up.
