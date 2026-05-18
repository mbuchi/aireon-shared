# Standard Suite Login UI — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a standard, branded `LoginModal` to `@swissnovo/shared` that any app can pop up when an anonymous user reaches an auth-gated feature, and adopt it in the four apps that already have a bespoke login UI.

**Architecture:** A presentational `LoginModal` component plus `AuthProvider` config props and `useAuth` actions (`requireAuth`, `promptLogin`, `closeLogin`). The provider owns the modal and renders it. Apps either flag it `loginBlocking` (hard gate) or `loginPromptOnFirstVisit` (welcome popup), or call `requireAuth()` from a gated handler.

**Tech Stack:** React 18, TypeScript, Tailwind, `lucide-react`, `oidc-client-ts`, `tsup`. No test runner in `@swissnovo/shared`; verification is `tsc --noEmit` + `npm run build` for the package and each adopting app.

**Verification note:** these repos have no unit-test runner for this code. Each task's verification step is a typecheck and/or build, not a unit test.

---

## File Structure

**`@swissnovo/shared`:**
- Create `src/auth/LoginModal.tsx` — presentational modal + `LoginModalFeature` type.
- Modify `src/auth/AuthProvider.tsx` — new props, modal state, new context members, renders `LoginModal`.
- Modify `src/index.ts` — export `LoginModal` + types.
- Bump `package.json` to `0.10.0`; rebuild `dist/`; tag `v0.10.0`.

**Adopting apps** (each: bump `@swissnovo/shared` to `#v0.10.0`, adopt, delete bespoke component, release notes):
- `showroom` — `App.tsx`, delete `components/SignInGate.tsx`.
- `proom` — `App.tsx` (AuthGate), `main.tsx`.
- `roofs` — `App.tsx`, `auth/AuthContext.tsx`, delete `components/WelcomeModal.tsx`.
- `groove` — `App.tsx`, `auth/AuthContext.tsx`, delete `components/WelcomeModal.tsx`.

---

## Task 1: `LoginModal` component

**Files:**
- Create: `swissnovo-shared/src/auth/LoginModal.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { useEffect } from 'react';
import { Lock, type LucideIcon } from 'lucide-react';

export interface LoginModalFeature {
  /** Optional leading icon. */
  icon?: LucideIcon;
  label: string;
  /** Dim the row and show a "Pro" badge. */
  locked?: boolean;
}

export interface LoginModalProps {
  open: boolean;
  /** Called by any dismiss path (backdrop / Esc / link). Ignored when blocking. */
  onClose: () => void;
  /** App name shown in the headline; any `oo` substring renders in brand red. */
  appName: string;
  description?: string;
  features?: LoginModalFeature[];
  /** When true, no dismiss path is rendered. */
  blocking?: boolean;
  login: () => void;
  register: () => void;
}

/** Renders an app name with any `oo` substrings in brand red. */
function StyledAppName({ name }: { name: string }) {
  return (
    <>
      {name.split(/(oo)/gi).map((part, i) =>
        part.toLowerCase() === 'oo' ? (
          <span key={i} className="text-red-600">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

/**
 * Suite-standard login popup. Branded with the SWISSNOVO wordmark, it offers
 * "Create free account" and "Sign in". Presentational only — it reads no
 * context, so it can be driven by {@link AuthProvider} or used standalone.
 */
export default function LoginModal({
  open,
  onClose,
  appName,
  description,
  features,
  blocking = false,
  login,
  register,
}: LoginModalProps) {
  useEffect(() => {
    if (!open || blocking) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [open, blocking, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={blocking ? undefined : onClose}
      />

      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-red-500 via-red-600 to-rose-700" />

        <div className="px-8 pt-7 pb-6">
          <div className="flex flex-col items-center text-center">
            <p
              className="text-2xl sm:text-3xl font-normal leading-none select-none"
              style={{ fontFamily: "'Varela Round', sans-serif" }}
              aria-label="SWISSNOVO"
            >
              <span className="text-gray-900 dark:text-white">SWISSN</span>
              <span className="text-red-600">O</span>
              <span className="text-gray-900 dark:text-white">V</span>
              <span className="text-red-600">O</span>
            </p>
            <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Sign in to{' '}
              <span style={{ fontFamily: "'Varela Round', sans-serif" }}>
                <StyledAppName name={appName} />
              </span>
            </h2>
            {description && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {features && features.length > 0 && (
            <div className="mt-6 space-y-2">
              {features.map((f, i) => (
                <FeatureRow key={i} feature={f} />
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={register}
              className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              Create free account
            </button>
            <button
              onClick={login}
              className="w-full py-2.5 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Sign in
            </button>
          </div>

          <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500">
            <Lock size={11} />
            <span>Secured with single sign-on via Zitadel</span>
          </div>

          {!blocking && (
            <div className="mt-3 text-center">
              <button
                onClick={onClose}
                className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors underline-offset-2 hover:underline"
              >
                Continue without signing in
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FeatureRow({ feature }: { feature: LoginModalFeature }) {
  const { icon: Icon, label, locked } = feature;
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
        locked
          ? 'text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50'
          : 'text-gray-700 dark:text-gray-300 bg-red-50/60 dark:bg-red-900/10'
      }`}
    >
      {Icon && (
        <span className={locked ? 'text-gray-400 dark:text-gray-500' : 'text-red-500 dark:text-red-400'}>
          <Icon size={15} />
        </span>
      )}
      <span className="flex-1">{label}</span>
      {locked && (
        <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded">
          Pro
        </span>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck** — `cd swissnovo-shared && npx tsc --noEmit` → no errors.

## Task 2: `AuthProvider` props + modal plumbing

**Files:**
- Modify: `swissnovo-shared/src/auth/AuthProvider.tsx`

- [ ] **Step 1: Add imports** — at the top, add `LoginModal` and its types:

```tsx
import LoginModal, { type LoginModalFeature } from './LoginModal';
```

- [ ] **Step 2: Extend `AuthContextValue`** — add to the interface (after `picture`):

```tsx
  /** Open the standard login modal. */
  promptLogin: () => void;
  /** Returns `isAuthenticated`; opens the login modal as a side effect when false. */
  requireAuth: () => boolean;
  /** Close the login modal (no-op while a blocking modal is shown). */
  closeLogin: () => void;
  /** True while the login modal is visible. */
  isLoginModalOpen: boolean;
```

- [ ] **Step 3: Add `AuthProviderProps` and change the signature**

Replace `export function AuthProvider({ children }: { children: ReactNode }) {` with:

```tsx
const LOGIN_DISMISSED_KEY = 'swissnovo:login-prompt-dismissed';

export interface AuthProviderProps {
  children: ReactNode;
  /** App name for the login modal. When omitted, no modal is rendered. */
  appName?: string;
  loginDescription?: string;
  loginFeatures?: LoginModalFeature[];
  /** Hard gate: modal is open and non-dismissible whenever the user is anonymous. */
  loginBlocking?: boolean;
  /** Auto-open the modal once for an anonymous first-time visitor. */
  loginPromptOnFirstVisit?: boolean;
}

export function AuthProvider({
  children,
  appName,
  loginDescription,
  loginFeatures,
  loginBlocking = false,
  loginPromptOnFirstVisit = false,
}: AuthProviderProps) {
```

- [ ] **Step 4: Add modal state** — just after `const initStarted = useRef(false);`:

```tsx
  const [loginRequested, setLoginRequested] = useState(false);
  const firstVisitDecided = useRef(false);
```

- [ ] **Step 5: Add first-visit effect** — after the existing init `useEffect` block (before `const login = useCallback`):

```tsx
  const isAuthenticatedNow = !!user && !user.expired;

  // Auto-open the modal once for an anonymous first-time visitor, after the
  // silent-SSO attempt settles. Suppressed if dismissed before or if the URL
  // carries a ?lat=&lng= deep link (the suite parcel deep-link convention).
  useEffect(() => {
    if (!loginPromptOnFirstVisit || isLoading || firstVisitDecided.current) return;
    firstVisitDecided.current = true;
    if (isAuthenticatedNow) return;
    if (sessionStorage.getItem(LOGIN_DISMISSED_KEY)) return;
    const params = new URLSearchParams(window.location.search);
    if (params.has('lat') && params.has('lng')) return;
    setLoginRequested(true);
  }, [loginPromptOnFirstVisit, isLoading, isAuthenticatedNow]);
```

- [ ] **Step 6: Add modal callbacks** — after the existing `getAccessToken` callback:

```tsx
  const promptLogin = useCallback(() => setLoginRequested(true), []);
  const closeLogin = useCallback(() => {
    sessionStorage.setItem(LOGIN_DISMISSED_KEY, '1');
    setLoginRequested(false);
  }, []);
```

- [ ] **Step 7: Extend the value memo** — inside the `useMemo`, add the four members to the returned object (after `picture`) and add `requireAuth`:

```tsx
      promptLogin,
      requireAuth: () => {
        if (!isAuthenticated) setLoginRequested(true);
        return isAuthenticated;
      },
      closeLogin,
      isLoginModalOpen: !isAuthenticated && (loginRequested || (loginBlocking && !isLoading)),
```

Add `promptLogin, closeLogin, loginRequested, loginBlocking` to the `useMemo` dependency array (alongside the existing deps).

- [ ] **Step 8: Render the modal** — replace the `return` statement:

```tsx
  return (
    <AuthContext.Provider value={value}>
      {children}
      {appName && (
        <LoginModal
          open={value.isLoginModalOpen}
          onClose={closeLogin}
          appName={appName}
          description={loginDescription}
          features={loginFeatures}
          blocking={loginBlocking}
          login={login}
          register={register}
        />
      )}
    </AuthContext.Provider>
  );
```

- [ ] **Step 9: Typecheck** — `cd swissnovo-shared && npx tsc --noEmit` → no errors.

## Task 3: Export surface

**Files:**
- Modify: `swissnovo-shared/src/index.ts`

- [ ] **Step 1: Add exports** — after the `AuthProvider` export line:

```tsx
export { default as LoginModal } from './auth/LoginModal';
export type { LoginModalProps, LoginModalFeature } from './auth/LoginModal';
export type { AuthProviderProps } from './auth/AuthProvider';
```

- [ ] **Step 2: Build** — `cd swissnovo-shared && npm run build` → succeeds, `dist/` regenerated.

## Task 4: Ship `@swissnovo/shared` v0.10.0

- [ ] **Step 1:** Bump `swissnovo-shared/package.json` `version` to `0.10.0`.
- [ ] **Step 2:** `npm run build` again so `dist/` reflects the version bump.
- [ ] **Step 3:** Commit on branch `feat/standard-login-modal` (include `dist/`), push, open PR, merge to `main`.
- [ ] **Step 4:** Tag `v0.10.0` on `main` and push the tag (apps install via `github:mbuchi/swissnovo-shared#v0.10.0`).

## Task 5: Adopt in showroom (blocking)

**Files:**
- Modify: `showroom/package.json`, `showroom/src/App.tsx`
- Delete: `showroom/src/components/SignInGate.tsx`

- [ ] **Step 1:** In `showroom/package.json` set `"@swissnovo/shared": "github:mbuchi/swissnovo-shared#v0.10.0"`, then `npm install`.
- [ ] **Step 2:** Showroom's `src/auth/AuthContext.tsx` wraps the shared provider — pass the new props. Replace its `AuthProvider` function body:

```tsx
export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SharedAuthProvider
      appName="showroom"
      loginBlocking
      loginDescription="A private gallery for your parcel exports — screenshots, reports, and rendered outputs from across the Swissnovo toolbox."
      loginFeatures={[
        { label: 'Smart parcel grouping' },
        { label: 'Polished gallery & lightbox' },
        { label: 'Private to your account' },
      ]}
    >
      {children}
    </SharedAuthProvider>
  );
}
```

- [ ] **Step 3:** In `showroom/src/App.tsx` delete the `import SignInGate` line. Replace the `if (!isAuthenticated) return <SignInGate />;` block with a plain backdrop (the blocking modal from the provider covers the screen):

```tsx
  if (!isAuthenticated) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-950" />;
  }
```

- [ ] **Step 4:** Delete `showroom/src/components/SignInGate.tsx`.
- [ ] **Step 5:** `cd showroom && npx tsc --noEmit && npm run build` → both succeed.
- [ ] **Step 6:** Bump showroom `package.json` to `0.7.0`, add a release note, commit on a branch, PR, merge.

## Task 6: Adopt in proom (blocking)

**Files:**
- Modify: `proom/package.json`, `proom/src/main.tsx`, `proom/src/App.tsx`

- [ ] **Step 1:** Set `"@swissnovo/shared": "github:mbuchi/swissnovo-shared#v0.10.0"`, `npm install`.
- [ ] **Step 2:** In `proom/src/main.tsx`, pass props to the provider:

```tsx
    <AuthProvider appName="proom" loginBlocking loginDescription="Sign in to manage your parcel pipeline.">
      <App />
    </AuthProvider>
```

- [ ] **Step 3:** In `proom/src/App.tsx`, delete the whole `if (!user) { return ( ... ) }` block inside `AuthGate` (lines rendering the bespoke Varela "zoom prm" gate). Keep the `isLoading` spinner and the authenticated `return`. When anonymous, `AuthGate` falls through; guard it so it renders a backdrop instead of the app:

```tsx
  if (!user) {
    return <div className="min-h-screen bg-slate-900" />;
  }
```

- [ ] **Step 4:** `cd proom && npx tsc --noEmit && npm run build` → both succeed.
- [ ] **Step 5:** Bump proom `package.json` minor, add a release note, commit on a branch, PR, merge.

## Task 7: Adopt in roofs (first-visit popup)

**Files:**
- Modify: `roofs/package.json`, `roofs/src/auth/AuthContext.tsx`, `roofs/src/App.tsx`
- Delete: `roofs/src/components/WelcomeModal.tsx`

- [ ] **Step 1:** Set `"@swissnovo/shared": "github:mbuchi/swissnovo-shared#v0.10.0"`, `npm install`.
- [ ] **Step 2:** In `roofs/src/auth/AuthContext.tsx`, delete the `WelcomeProvider`, `WelcomeContext`, `WELCOME_DISMISSED_KEY`, and `WelcomeContextValue` — the shared provider now owns this. Simplify to:

```tsx
import type { ReactNode } from 'react';
import { AuthProvider as SharedAuthProvider, useAuth as useSharedAuth } from '@swissnovo/shared';

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SharedAuthProvider
      appName="roofs"
      loginPromptOnFirstVisit
      loginDescription="Create a free account or sign in to unlock the full experience."
      loginFeatures={[
        { label: 'Full parcel map with advanced filters' },
        { label: 'Real-time signal dashboard' },
        { label: 'Saved searches & export tools', locked: true },
        { label: 'Team collaboration & sharing', locked: true },
      ]}
    >
      {children}
    </SharedAuthProvider>
  );
}

export function useAuth() {
  const auth = useSharedAuth();
  return { ...auth, avatarUrl: auth.picture ?? '' };
}
```

- [ ] **Step 3:** In `roofs/src/App.tsx`, delete the `import WelcomeModal` line and the `<WelcomeModal />` element.
- [ ] **Step 4:** Delete `roofs/src/components/WelcomeModal.tsx`.
- [ ] **Step 5:** Grep `roofs/src` for any remaining `showWelcomeModal` / `dismissWelcomeModal` usages and remove them (no other consumer expected).
- [ ] **Step 6:** `cd roofs && npx tsc --noEmit && npm run build` → both succeed.
- [ ] **Step 7:** Bump roofs `package.json` minor, add a release note, commit on a branch, PR, merge.

## Task 8: Adopt in groove (first-visit popup)

**Files:**
- Modify: `groove/package.json`, `groove/src/auth/AuthContext.tsx`, `groove/src/App.tsx`
- Delete: `groove/src/components/WelcomeModal.tsx`

- [ ] **Step 1:** Set `"@swissnovo/shared": "github:mbuchi/swissnovo-shared#v0.10.0"`, `npm install`.
- [ ] **Step 2:** Rewrite `groove/src/auth/AuthContext.tsx` the same way as roofs Task 7 Step 2, but `appName="groove"` and groove-appropriate `loginFeatures` (reuse roofs' feature list — the WelcomeModal text was identical).
- [ ] **Step 3:** In `groove/src/App.tsx`, delete the `import WelcomeModal` line and the `<WelcomeModal />` element.
- [ ] **Step 4:** Delete `groove/src/components/WelcomeModal.tsx`.
- [ ] **Step 5:** Grep `groove/src` for remaining `showWelcomeModal` / `dismissWelcomeModal` usages and remove them.
- [ ] **Step 6:** `cd groove && npx tsc --noEmit && npm run build` → both succeed.
- [ ] **Step 7:** Bump groove `package.json` minor, add a release note, commit on a branch, PR, merge.

---

## Self-Review

- **Spec coverage:** LoginModal (T1), AuthProvider props + first-visit + blocking (T2), useAuth members (T2 step 2/7), exports (T3), ship (T4), per-app adoption showroom/proom/roofs/groove (T5–T8). All spec sections covered.
- **Type consistency:** `LoginModalFeature` defined in T1, imported in T2/T3 and used in app props (T5/T7/T8). `AuthProviderProps` defined T2, exported T3. `requireAuth`/`promptLogin`/`closeLogin`/`isLoginModalOpen` declared in `AuthContextValue` (T2 s2) and provided (T2 s7) — names match.
- **Placeholder scan:** none — all code is concrete.
- **Note:** showroom currently pins shared `#v0.5.0` and groove `#v0.5.0`; Task 5/8 jump them straight to `#v0.10.0`. Their `useAuth` wrappers already spread all shared members, so `requireAuth` etc. flow through. Watch for type errors from the older pinned version's API during `npm install` + typecheck.
