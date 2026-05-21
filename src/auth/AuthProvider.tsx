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
 * Wraps the app, runs the suite-standard hidden-iframe silent SSO on mount,
 * and exposes auth state via {@link useAuth}. Apps must also ship a
 * `public/silent-callback.html` (served at `/silent-callback.html`).
 */
export function AuthProvider({
  children,
  appName,
  loginDescription,
  loginFeatures,
  loginBlocking = false,
  loginPromptOnFirstVisit = false,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initStarted = useRef(false);
  const [loginRequested, setLoginRequested] = useState(false);
  const firstVisitDecided = useRef(false);

  // Death-switch: every mount unconditionally flips out of `isLoading` after
  // 8s, regardless of how the silent-SSO init goes. This is the only guard
  // that survives React 18 StrictMode's double-effect dance — the init
  // effect below is gated by `initStarted.current` so the second mount
  // skips re-running the IIFE, and the first mount's `setIsLoading` would
  // be a no-op against the live (second) mount. The death-switch instead
  // captures the CURRENT mount's setter on every mount, so it always
  // updates the live tree.
  //
  // Defensive against any path the init might fail to settle: Zitadel's
  // `Content-Security-Policy: frame-ancestors 'none'` keeps the silent-SSO
  // iframe from ever reaching silent-callback.html, and oidc-client-ts's
  // own `silentRequestTimeoutInSeconds` does NOT reliably propagate the
  // rejection through to our await in every scenario.
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
  // the live mount via this listener.
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
            console.warn('[auth] sign-in callback failed', err);
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

        // Hidden-iframe silent SSO with a 6s race timeout as defence-in-depth.
        // A positive resolution lets the app settle to authenticated promptly
        // rather than waiting the full 8s on the death-switch when the
        // network round-trip is just slow.
        if (sessionStorage.getItem(SSO_ATTEMPTED_KEY) !== '1') {
          sessionStorage.setItem(SSO_ATTEMPTED_KEY, '1');
          try {
            const silent = await Promise.race([
              userManager.signinSilent(),
              new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error('silent SSO hard timeout')), 6000),
              ),
            ]);
            finish(silent && !silent.expired ? silent : null);
            return;
          } catch {
            /* no session, CSP-blocked iframe, or hard timeout — fall through */
          }
        }
        finish(null);
      } catch (err) {
        console.warn('[auth] init error', err);
        finish(null);
      }
    })();
  }, []);

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
