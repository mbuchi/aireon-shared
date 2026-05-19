# Shared signal helper — design

**Date:** 2026-05-19
**Status:** Approved (design); implementation plan pending
**Scope:** `@swissnovo/shared` + a suite-wide rollout. ~30 apps depend on
`@swissnovo/shared`; the 4 brokereum/realioo repos are excluded, leaving ~26
apps to migrate (1 pilot + ~22 standard + ~2 outliers).

## Problem

Every SwissNovo app emits usage *signals* (telemetry) to the RES API
(`res.zeroo.ch` → `/res_api/signal/collect`). The path has two halves and both
are duplicated and inconsistent across the suite:

1. **Browser dispatcher** — the code that POSTs a signal to the app's own
   `/api/signal-collect` proxy. Reimplemented per app as
   `src/services/signalService.ts`, `src/lib/signalCollect.ts`, or an inline
   `fetch`. Four apps (boom, groove, valoo, valooEngine) carry *two* competing
   copies.
2. **Edge proxy** — the Vercel edge function `api/signal-collect.ts` that
   attaches the server-side bearer token and forwards to the RES API. 19 apps
   have one; **only valoo's uses `createResApiClient` from `@swissnovo/shared`** —
   the other 18 are older ad-hoc copies. ~11 apps have no proxy at all.

`@swissnovo/shared` already exists to "eliminate file-for-file duplication
across the ~30 sibling apps". Signal handling is the next clear candidate.

## Goal

Make `@swissnovo/shared` the single source of truth for the entire signal
path — both halves — then migrate every standard SwissNovo app to consume it,
and add telemetry to the apps that lack it.

Non-goals: changing the RES API contract; the `signal` *dashboard* readers
(scoops `api/signal-proxy.ts`); the brokereum/realioo repos (separate
ownership).

## Design

### 1. `@swissnovo/shared` — a new `src/signal/` module

Two halves, mirroring the existing `auth` (browser) / `api` (server-safe)
split.

**a) Browser dispatcher — exported from the main barrel (`@swissnovo/shared`)**

```ts
const signal = createSignalClient({ appName: 'valoo' });
signal.send('Search for Address', { address, lat, lng, metaData });
```

- `createSignalClient({ appName, endpoint? })` returns `{ send(userAction, target?) }`.
- `endpoint` defaults to `/api/signal-collect`.
- `send()` builds the canonical payload accepted by RES
  `/res_api/signal/collect`: `app_name`, `user_action`, `lat`, `lng`,
  `target_address`, `target_lat`, `target_lng`, `meta_data`.
- Fire-and-forget; never throws — telemetry must not break the host app.
- `target` is an optional object: `{ address?, lat?, lng?, metaData? }`.
- The existing `sendClaireMessageSignal` (`src/claire/signal.ts`) is
  re-implemented as a thin wrapper over `createSignalClient` and kept as a
  back-compat export — no consumer change required.

**b) Edge handler — a new server-safe subpath (`@swissnovo/shared/signal-collect`)**

- Generalised from valoo's current `api/signal-collect.ts` (already uses
  `createResApiClient`). Exports `default` (the handler) and `config`
  (`{ runtime: 'edge' }`).
- Reads `SIGNAL_API_TOKEN` from env, with the existing fallback retained
  (see Decision 1). CORS headers + `OPTIONS` preflight handled as today.
- Forwards the client IP via `X-Forwarded-For`.

**Build & release**

- `tsup.config.ts` gains a 3rd entry for the edge handler. It must be
  server-safe (edge runtime — no React, no `window` at module load), like the
  existing `src/api/index.ts` entry.
- `package.json` `exports` gains the `./signal-collect` subpath.
- Version **0.10.1 → 0.11.0** (minor; additive). `dist/` rebuilt and
  committed; tag `v0.11.0`; per the package's own release workflow.

### 2. Per-app shape after migration

For each standard app:

- **`api/signal-collect.ts`** → one line:
  `export { config, default } from '@swissnovo/shared/signal-collect';`
- **`src/services/signalService.ts` / `src/lib/signalCollect.ts`** → deleted
  (dup-copy apps lose both files).
- **`src/lib/signal.ts`** (new, 3 lines) binds the app name once:
  ```ts
  import { createSignalClient } from '@swissnovo/shared';
  export const signal = createSignalClient({ appName: '<app>' });
  ```
- **Call sites** change to `signal.send('<action>', { … })`. toolbox's inline
  `fetch` in `PrmProvider` collapses into the same call.
- **`package.json`** — `@swissnovo/shared` tag bumped to `#v0.11.0`,
  `npm install`.

Apps with **no telemetry today** (capabilityMatrix `signal: no` — roolez,
taxoo, vacoo, booklet, coolimmo, and any confirmed by audit): the change is
additive — create the `api/signal-collect.ts` re-export and `src/lib/signal.ts`,
and wire one `signal.send(...)` at the app's primary user action.

Net effect: ~150–200 lines of per-app signal code collapse to ~4 lines, and
every edge function becomes identical and current.

### 3. Rollout phasing

| Phase | Work | PRs |
|---|---|---|
| 1 | `@swissnovo/shared`: add both modules, build, tag `v0.11.0` | 1 |
| 2 | Pilot: migrate **valoo** fully, verify end-to-end | 1 |
| 3 | Migrate the ~22 standard-template apps | 1 each |
| 4 | Outliers — **hood** (vanilla JS) and **voogle2** (Next/netlify shape) handled individually | ≤2 |
| 5 | `toolbox/src/data/tools.json`: flip `capabilityMatrix.signal` for apps that gained telemetry | folded into the toolbox PR |

Each app PR follows the standard publish workflow (release notes, verify,
PR, squash-merge).

### 4. Scope — repos in and out

- **In:** every standard SwissNovo SPA that depends on `@swissnovo/shared`.
- **Out:** `brokereum-admin`, `brokereum-ico-dashboard`, `brokereum_node`,
  `realioo-supabase` — separate ownership, PR-and-stop.
- **Untouched:** scoops `api/signal-proxy.ts` (reads the signal feed for its
  dashboard — a different concern); scoops may still *emit* via the shared
  client.

## Decisions

1. **Hardcoded token fallback retained.** valoo's edge function carries
   `DEFAULT_API_TOKEN` as a fallback for `SIGNAL_API_TOKEN`. Centralising the
   handler moves that fallback into `@swissnovo/shared/dist/`, but it collapses
   18 copies into 1 — a net improvement — and preserves zero-config Vercel
   deploys (the shared package's stated philosophy). The env var is **not**
   made hard-required; that would force setting it across ~30 Vercel projects.
   Logged as a known item, not fixed here.

2. **A 3-line per-app `src/lib/signal.ts` is kept** rather than passing
   `appName` at every call site — one bound instance per app, imported by call
   sites.

3. **`createSignalClient` factory** (app name bound once) over a bare
   `sendSignal({ appName, … })` function — less repetition at call sites.

## Risks

- **Edge re-export from a node module.** A Vercel `api/*.ts` file
  re-exporting `default`/`config` from `@swissnovo/shared/signal-collect` must
  be validated on the valoo pilot (Phase 2) before the sweep.
- **Tag-pinned dependency.** Apps pin `@swissnovo/shared` by git tag, so each
  app PR must bump the tag *and* `npm install`; a stale lockfile would silently
  keep the old code.
- **`tsup` server-safe entry.** The edge handler entry must not import the
  browser-only modules; verified by `npm run typecheck` + a build check.

## Out of scope / follow-ups

- Migrating the other capability gaps (`tour`, `imageExport`, `langSupport`).
- Auditing/correcting other stale `capabilityMatrix` flags (e.g. `langSupport`
  under-reported for apps that already have i18n).
