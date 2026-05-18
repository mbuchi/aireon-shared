# Standard Suite Login UI — Design

**Date:** 2026-05-18
**Repo:** `@swissnovo/shared` (swissnovo-shared)
**Status:** Approved (Phase 1)

## Problem

The SwissNovo suite has three divergent login UIs and no shared component:

- **showroom** — `SignInGate.tsx`, full-page, hard-blocks the whole app.
- **proom** — `AuthGate` (inline in `App.tsx`), full-page, hard-blocks the whole app.
- **roofs / groove** — `WelcomeModal.tsx`, a dismissible modal shown once to anonymous
  first-time visitors.

The shared package already provides `AuthProvider` / `useAuth` (Zitadel OIDC, silent SSO)
but no login *surface*. Apps that want to gate a feature have nowhere standard to send an
anonymous user.

## Goal

One shared, branded login popup in `@swissnovo/shared` that any app can either (a) open
imperatively when an anonymous user reaches an auth-required feature, or (b) auto-show once
to a first-time anonymous visitor. Branding matches the toolbox: the SWISSNOVO wordmark in
Varela Round with red O's.

## Scope — Phase 1 (this task)

1. Build `LoginModal` + provider/hook plumbing in `@swissnovo/shared`; ship it (version
   bump, build, push, PR, merge).
2. Adopt it in the four apps that already have a login UI, deleting their bespoke
   components: **showroom**, **proom** (blocking), **roofs**, **groove** (dismissible,
   first-visit).

**Out of scope (follow-up):** rolling `requireAuth()` into the remaining ~27 apps as their
individual features gain auth requirements — that is per-app product work.

## Design

### New component — `src/auth/LoginModal.tsx`

A centered modal popup. Backdrop is `bg-black/50 backdrop-blur-sm`, container
`z-[200]`. Light/dark aware. No new dependencies (`lucide-react` is already a peer dep).

Layout, top to bottom:

- **SWISSNOVO wordmark** — Varela Round face, `SWISSN` + red `O` + `V` + red `O`,
  `aria-label="SWISSNOVO"`. Same treatment as `toolbox/src/components/Switchboard.tsx`.
- **Headline** — "Sign in to {appName}", with `appName` rendered through a small
  `oo`-in-red styler (any `oo` substring in the app name shown in `text-red-600`).
- **Description** — optional one-line string.
- **Feature list** — optional; rows of `{ icon, label, locked? }`. Locked rows are
  dimmed and carry a "Pro" badge. Mirrors the existing `WelcomeModal` `FeatureRow`.
- **Buttons** — "Create free account" (primary, calls `register`) and "Sign in"
  (secondary, calls `login`).
- **Footer** — lock icon + "Secured with single sign-on via Zitadel".
- **Dismiss** — backdrop click, `Esc`, and a "Continue without signing in" text link.
  All three are suppressed when `blocking` is true.

Props:

| Prop          | Type                                              | Notes                                        |
|---------------|---------------------------------------------------|----------------------------------------------|
| `open`        | `boolean`                                         | Render gate.                                 |
| `onClose`     | `() => void`                                      | Called by any dismiss path.                  |
| `appName`     | `string`                                          | Shown in the headline, `oo` styled red.      |
| `description` | `string` (optional)                               | One-line subtitle.                           |
| `features`    | `{ icon?: LucideIcon; label: string; locked?: boolean }[]` (optional) | Feature rows.            |
| `blocking`    | `boolean` (optional, default `false`)             | When true, no dismiss path is rendered.      |
| `login`       | `() => void`                                      | Sign-in action.                              |
| `register`    | `() => void`                                      | Sign-up action.                              |

The component is purely presentational — it does not read context — so it can also be
used standalone.

### `AuthProvider` — new optional props

`AuthProvider` currently takes only `children`. It gains optional login-modal config and
renders `<LoginModal>` itself, so apps get the surface for free:

| Prop                   | Type                          | Notes                                                              |
|------------------------|-------------------------------|--------------------------------------------------------------------|
| `appName`              | `string` (optional)           | Required for the modal to be useful; if omitted the modal is inert. |
| `loginDescription`     | `string` (optional)           | Passed to `LoginModal.description`.                                |
| `loginFeatures`        | feature-row array (optional)  | Passed to `LoginModal.features`.                                   |
| `loginBlocking`        | `boolean` (optional)          | Modal renders non-dismissible whenever `status === 'anonymous'`.   |
| `loginPromptOnFirstVisit` | `boolean` (optional)       | Auto-open the modal once for an anonymous visitor after silent SSO settles. |

Behaviour:

- **`loginBlocking`** — once auth settles, if `status === 'anonymous'` the modal is open
  and non-dismissible. Replaces the showroom/proom full-page gate.
- **`loginPromptOnFirstVisit`** — after the initial silent-SSO attempt settles, if the
  user is anonymous, the modal opens once. Suppressed if dismissed before (sessionStorage
  key `swissnovo:login-prompt-dismissed`) or the URL carries `lat` + `lng` deep-link
  params. Replaces the roofs/groove `WelcomeModal` flow.
- Imperative open via `promptLogin()` works regardless of the two flags above.

### `useAuth()` — new context members

| Member                  | Type                  | Notes                                                          |
|-------------------------|-----------------------|----------------------------------------------------------------|
| `promptLogin()`         | `() => void`          | Opens the modal.                                               |
| `requireAuth()`         | `() => boolean`       | Returns `isAuthenticated`; opens the modal as a side effect when false. |
| `closeLogin()`          | `() => void`          | Closes the modal (no-op when `blocking`).                      |
| `isLoginModalOpen`      | `boolean`             | Current modal state.                                           |

Gated handler pattern:

```tsx
const { requireAuth } = useAuth();
function handleSave() {
  if (!requireAuth()) return; // anonymous → modal opens, handler aborts
  // ...authenticated work...
}
```

### Export surface (`src/index.ts`)

Add `LoginModal` (default or named) and its prop types. `AuthContextValue` extends with
the four new members. No breaking changes — all additions.

## Per-app adoption

| App      | Before                              | After                                                                 |
|----------|-------------------------------------|------------------------------------------------------------------------|
| showroom | `<SignInGate/>` rendered in `App.tsx` when `!isAuthenticated` | `AuthProvider` gets `appName="showroom"` + `loginBlocking` + features; `App.tsx` always renders the app; delete `SignInGate.tsx`. |
| proom    | inline `AuthGate` full-page          | same as showroom — `loginBlocking`; delete the `AuthGate` block.       |
| roofs    | `<WelcomeModal/>` + local welcome context | `AuthProvider` gets `loginPromptOnFirstVisit`; delete `WelcomeModal.tsx` and the local welcome context. |
| groove   | `<WelcomeModal/>` + `WelcomeProvider` in `auth/AuthContext.tsx` | same as roofs; delete `WelcomeModal.tsx` and `WelcomeProvider`. |

Each app's `auth/AuthContext.tsx` wrapper (where present) stays as the thin re-export; it
just forwards the new props and the `useAuth` shape already spreads all shared members, so
`promptLogin`/`requireAuth` flow through automatically.

The four apps follow the suite publish workflow (version bump, release notes, build,
commit, push, PR, merge).

## Error handling

- `login`/`register` are fire-and-forget redirects; failures are already logged by
  `AuthProvider`. The modal does not surface auth errors inline (a redirect leaves the
  page anyway).
- `requireAuth()` called before auth settles (`status === 'loading'`) returns `false` and
  opens the modal — acceptable; the silent-SSO window is sub-second and gated actions are
  user-initiated clicks that occur well after load.
- `appName` omitted → `AuthProvider` renders no modal and `promptLogin()` is a no-op
  (warns once in dev).

## Testing

`@swissnovo/shared` builds with `tsup` and has no test runner today; Phase 1 verification
is typecheck + build of the shared package and of each of the four adopting apps, plus the
existing visual checks. No new test runner is introduced in this task.

## Rollout / publish order

1. swissnovo-shared: implement, `tsc --noEmit`, `npm run build`, version bump, PR, merge.
2. Each app: bump the `@swissnovo/shared` dependency, adopt, delete bespoke component,
   typecheck + build, release notes, PR, merge.
