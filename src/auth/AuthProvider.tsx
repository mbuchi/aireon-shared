import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { User } from 'oidc-client-ts';
import {
  SSO_ATTEMPTED_KEY,
  stripAuthParams,
  urlHasAuthParams,
  userManager,
} from './userManager';
import LoginModal, { type LoginModalFeature } from './LoginModal';

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous';

const LOGIN_DISMISSED_KEY = 'swissnovo:login-prompt-dismissed';

export interface AuthContextValue {
  /** The raw OIDC user, or null when anonymous. */
  user: User | null;
  /** Coarse auth state — handy for switch/ternary rendering. */
  status: AuthStatus;
  /** True once a non-expired user is loaded. */
  isAuthenticated: boolean;
  /** True until the initial silent-SSO attempt settles. */
  isLoading: boolean;
  /** Start an interactive (full-page redirect) sign-in. */
  login: () => Promise<void>;
  /** Start an interactive sign-up — sends the user to the Zitadel registration form (prompt=create). */
  register: () => Promise<void>;
  /** Sign out (redirect), falling back to a local session clear. */
  logout: () => Promise<void>;
  /** The current access token, if any. */
  getAccessToken: () => string | undefined;
  /** Best-effort display name (name → given+family → email → "User"). */
  displayName: string;
  email: string;
  /** 1–2 letter initials derived from the name or email. */
  initials: string;
  /** Profile picture URL, or null. */
  picture: string | null;
  /** Open the standard login modal. */
  promptLogin: () => void;
  /** Returns `isAuthenticated`; opens the login modal as a side effect when false. */
  requireAuth: () => boolean;
  /** Close the login modal (no-op while a blocking modal is shown). */
  closeLogin: () => void;
  /** True while the login modal is visible. */
  isLoginModalOpen: boolean;
}

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
  /**
   * Attempt automatic cross-app SSO on mount. Defaults to `true` (the
   * suite-standard behaviour — this is what makes "sign in to one Aireon app,
   * be signed in to all of them" work).
   *
   * Mechanism: when no local session exists, the app does a top-level
   * `prompt=none` redirect to Zitadel. Because that is a first-party navigation
   * to the IdP, the shared Zitadel session cookie is sent: if the user has
   * signed in to *any* Aireon app, Zitadel returns a code and this app logs in
   * silently; if not, Zitadel returns `error=login_required` and the app settles
   * to anonymous. It is attempted at most once per browser tab
   * ({@link SSO_ATTEMPTED_KEY}), so reloads don't re-bounce and there is no
   * redirect loop. `prompt=none` never renders a Zitadel UI, so the round-trip
   * is two fast 3xx hops with no visible login page.
   *
   * This replaces the old hidden-iframe silent SSO, which is permanently dead:
   * Zitadel serves every authorize page with `frame-ancestors 'none'`, so the
   * iframe was always CSP-blocked. The redirect path needs no iframe, no
   * `silent-callback.html`, and no third-party cookies — so it is robust on
   * every browser regardless of cookie policy.
   *
   * Pass `false` only for a surface that should never auto-authenticate (e.g. a
   * purely public marketing/landing page): it then settles instantly from the
   * locally-persisted session, or to anonymous, with no redirect. Interactive
   * `login()`/`register()` are unaffected either way.
   */
  silentSso?: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function computeInitials(name: string, email: string): string {
  const source = name.trim() || email.trim();
  if (!source) return '?';
  if (source.includes('@')) return source[0]!.toUpperCase();
  const parts = source.split(/\s+/).filter(Boolean);
  return (
    parts.slice(0, 2).map((p) => p[0]!.toUpperCase()).join('') ||
    source[0]!.toUpperCase()
  );
}

/**
 * Wraps the app, runs the suite-standard hidden-iframe silent SSO on mount
 * (unless {@link AuthProviderProps.silentSso} is `false`), and exposes auth
 * state via {@link useAuth}. Apps that keep silent SSO on must also ship a
 * `public/silent-callback.html` (served at `/silent-callback.html`).
 */
export function AuthProvider({
  children,
  appName,
  loginDescription,
  loginFeatures,
  loginBlocking = false,
  loginPromptOnFirstVisit = false,
  silentSso = true,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initStarted = useRef(false);
  const [loginRequested, setLoginRequested] = useState(false);
  const firstVisitDecided = useRef(false);

  // Death-switch: every mount unconditionally flips out of `isLoading` after
  // 8s, regardless of how init goes. This is the only guard that survives
  // React 18 StrictMode's double-effect dance — the init effect below is gated
  // by `initStarted.current` so the second mount skips re-running the IIFE, and
  // the first mount's `setIsLoading` would be a no-op against the live (second)
  // mount. The death-switch instead captures the CURRENT mount's setter on
  // every mount, so it always updates the live tree.
  //
  // Defensive against any path init might fail to settle (e.g. a hung OIDC
  // discovery/token fetch on the callback leg — oidc-client-ts network calls
  // have no built-in timeout). The normal prompt=none SSO path navigates away
  // before this fires.
  useEffect(() => {
    const t = setTimeout(() => {
      setIsLoading((prev) => {
        if (prev) console.warn('[auth] init death-switch fired — falling to anonymous');
        return false;
      });
    }, 8000);
    return () => clearTimeout(t);
  }, []);

  // userManager events run on every mount: even when the init IIFE settled
  // on a stale (now-unmounted) instance, a real userLoaded event still hits
  // the live mount via this listener. The shared userManager has
  // automaticSilentRenew off (the renew iframe is CSP-dead), so there is no
  // renew timer to tear down here. When the access token expires we drop to
  // anonymous; the next load (or tab) re-runs the prompt=none SSO and, as long
  // as the Zitadel session is still alive, silently signs the user back in.
  useEffect(() => {
    const onLoaded = (u: User) => setUser(u);
    const onUnloaded = () => setUser(null);
    const onExpired = () => {
      userManager.removeUser().finally(() => setUser(null));
    };
    userManager.events.addUserLoaded(onLoaded);
    userManager.events.addUserUnloaded(onUnloaded);
    userManager.events.addAccessTokenExpired(onExpired);
    return () => {
      userManager.events.removeUserLoaded(onLoaded);
      userManager.events.removeUserUnloaded(onUnloaded);
      userManager.events.removeAccessTokenExpired(onExpired);
    };
  }, []);

  useEffect(() => {
    if (initStarted.current) return;
    initStarted.current = true;

    const finish = (loaded: User | null) => {
      setUser(loaded);
      setIsLoading(false);
    };

    (async () => {
      try {
        // Returning from any Zitadel authorize redirect — interactive login OR
        // the prompt=none SSO probe. A successful probe carries `code`; a
        // session-less probe carries `error=login_required` (and other
        // `*_required` errors), which signinRedirectCallback() rejects on. Both
        // are terminal: we mark SSO attempted so we never re-redirect, strip the
        // params, and settle. This is what stops the redirect from looping.
        if (urlHasAuthParams()) {
          try {
            const completed = await userManager.signinRedirectCallback();
            sessionStorage.setItem(SSO_ATTEMPTED_KEY, '1');
            stripAuthParams();
            finish(completed ?? null);
            return;
          } catch (err) {
            sessionStorage.setItem(SSO_ATTEMPTED_KEY, '1');
            stripAuthParams();
            // login_required from a prompt=none probe is the normal "no Zitadel
            // session" outcome, not an error worth shouting about.
            finish(null);
            return;
          }
        }

        const existing = await userManager.getUser();
        if (existing && !existing.expired) {
          finish(existing);
          return;
        }
        if (existing?.expired) await userManager.removeUser().catch(() => {});

        // Cross-app SSO: a top-level prompt=none redirect to Zitadel. First-party
        // to the IdP, so the shared Zitadel session cookie is sent — if the user
        // signed in to any Aireon app, Zitadel bounces straight back with a code
        // and this app logs in with no UI; otherwise it returns login_required
        // (handled by the callback branch above on the next load). Attempted at
        // most once per tab so reloads don't re-bounce. Skipped when `silentSso`
        // is off. The redirect navigates away, so nothing after it runs.
        if (silentSso && sessionStorage.getItem(SSO_ATTEMPTED_KEY) !== '1') {
          sessionStorage.setItem(SSO_ATTEMPTED_KEY, '1');
          try {
            await userManager.signinRedirect({ extraQueryParams: { prompt: 'none' } });
            return;
          } catch (err) {
            console.warn('[auth] cross-app SSO redirect failed to start', err);
          }
        }
        finish(null);
      } catch (err) {
        console.warn('[auth] init error', err);
        finish(null);
      }
    })();
  }, [silentSso]);

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

  const login = useCallback(async () => {
    sessionStorage.removeItem(SSO_ATTEMPTED_KEY);
    await userManager.signinRedirect();
  }, []);

  const register = useCallback(async () => {
    sessionStorage.removeItem(SSO_ATTEMPTED_KEY);
    await userManager.signinRedirect({ extraQueryParams: { prompt: 'create' } });
  }, []);

  const logout = useCallback(async () => {
    sessionStorage.setItem(SSO_ATTEMPTED_KEY, '1');
    try {
      await userManager.signoutRedirect();
    } catch {
      await userManager.removeUser().catch(() => {});
      setUser(null);
    }
  }, []);

  const getAccessToken = useCallback(() => user?.access_token, [user]);

  const promptLogin = useCallback(() => setLoginRequested(true), []);
  const closeLogin = useCallback(() => {
    sessionStorage.setItem(LOGIN_DISMISSED_KEY, '1');
    setLoginRequested(false);
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const profile = user?.profile;
    const displayName =
      (profile?.name as string | undefined) ||
      [profile?.given_name, profile?.family_name].filter(Boolean).join(' ') ||
      '';
    const email = (profile?.email as string | undefined) ?? '';
    const picture = (profile?.picture as string | undefined) ?? null;
    const isAuthenticated = !!user && !user.expired;

    return {
      user,
      status: isLoading ? 'loading' : isAuthenticated ? 'authenticated' : 'anonymous',
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
      getAccessToken,
      displayName: displayName || email || 'User',
      email,
      initials: computeInitials(displayName, email),
      picture,
      promptLogin,
      requireAuth: () => {
        if (!isAuthenticated) setLoginRequested(true);
        return isAuthenticated;
      },
      closeLogin,
      isLoginModalOpen:
        !isAuthenticated && (loginRequested || (loginBlocking && !isLoading)),
    };
  }, [
    user,
    isLoading,
    login,
    register,
    logout,
    getAccessToken,
    promptLogin,
    closeLogin,
    loginRequested,
    loginBlocking,
  ]);

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
}

/** Auth state + actions. Must be called inside an {@link AuthProvider}. */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
