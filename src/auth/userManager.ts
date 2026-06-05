import {
  UserManager,
  WebStorageStateStore,
  type User,
  type UserManagerSettings,
} from 'oidc-client-ts';

// The whole Aireon suite authenticates against a single shared Zitadel OIDC
// client, so this config is identical for every app — no per-app setup. Because
// every app shares this one client_id and Zitadel keeps a single SSO session
// cookie on its own domain, a `prompt=none` authorize redirect from any app
// resolves silently once the user has signed in anywhere — this is what powers
// cross-app SSO (see AuthProvider).
const ZITADEL_AUTHORITY = 'https://swissnovo-ekqvxs.ch1.zitadel.cloud/';
const ZITADEL_CLIENT_ID = '366334583324661156';

const origin = typeof window !== 'undefined' ? window.location.origin : '';

const settings: UserManagerSettings = {
  authority: ZITADEL_AUTHORITY,
  client_id: ZITADEL_CLIENT_ID,
  redirect_uri: `${origin}/`,
  post_logout_redirect_uri: `${origin}/`,
  response_type: 'code',
  scope: 'openid profile email',
  loadUserInfo: true,
  // Hidden-iframe flows (silent renew, signinSilent) are permanently dead: every
  // Zitadel authorize page is served with `Content-Security-Policy:
  // frame-ancestors 'none'`, so the browser blocks the renew iframe. Cross-app
  // SSO and token refresh are instead handled by a top-level `prompt=none`
  // redirect to Zitadel (see AuthProvider) — first-party to the IdP, so the
  // shared Zitadel session cookie is sent and no iframe is involved. Leaving
  // automaticSilentRenew on would only arm a CSP-blocked iframe that logs noise.
  automaticSilentRenew: false,
  monitorSession: false,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  stateStore: new WebStorageStateStore({ store: window.localStorage }),
};

/** The shared OIDC client for the whole suite. */
export const userManager = new UserManager(settings);

/**
 * sessionStorage flag so the automatic `prompt=none` SSO redirect is attempted
 * at most once per browser tab. It is set *before* the redirect and survives the
 * round-trip back from Zitadel (same origin, same tab), so the callback never
 * re-triggers the redirect — this is the primary guard against a redirect loop.
 * sessionStorage (not localStorage) is deliberate: it persists across reloads
 * within a tab but a fresh tab re-checks, so a session signed in elsewhere is
 * picked up promptly.
 */
export const SSO_ATTEMPTED_KEY = 'aireon:silent_sso_attempted';

/**
 * True if the automatic `prompt=none` SSO redirect has already been attempted in
 * this tab. Fails *safe*: if sessionStorage is unreadable (a locked-down or
 * private browser that throws on access), it reports `true` so the caller never
 * fires a redirect it can't guard — an unguarded redirect would loop. The app
 * then simply degrades to anonymous, exactly as it would today.
 */
export function ssoAttempted(): boolean {
  try {
    return sessionStorage.getItem(SSO_ATTEMPTED_KEY) === '1';
  } catch {
    return true;
  }
}

/**
 * Record that the SSO redirect was attempted this tab. Returns `false` if the
 * flag could not be persisted (storage blocked) — callers MUST NOT redirect in
 * that case, or the un-guarded redirect would loop on the way back.
 */
export function markSsoAttempted(): boolean {
  try {
    sessionStorage.setItem(SSO_ATTEMPTED_KEY, '1');
    return true;
  } catch {
    return false;
  }
}

/**
 * The currently stored, non-expired OIDC user, or null. Use this to attach a
 * token to API requests (e.g. the screenshot/image service) outside React.
 */
export async function getExistingUser(): Promise<User | null> {
  try {
    const user = await userManager.getUser();
    return user && !user.expired ? user : null;
  } catch {
    return null;
  }
}

/**
 * The current user's bearer token for API calls made outside React — the
 * id_token (a JWT, so a backend can decode `sub`) when present, else the
 * access_token. Null when there is no signed-in, non-expired user.
 */
export async function getAuthToken(): Promise<string | null> {
  const user = await getExistingUser();
  return user ? user.id_token ?? user.access_token ?? null : null;
}

/** True when the current URL carries an OIDC redirect-callback (code/error + state). */
export function urlHasAuthParams(url: URL = new URL(window.location.href)): boolean {
  const p = url.searchParams;
  return (p.has('code') || p.has('error')) && p.has('state');
}

/** Strips OIDC callback query params from the address bar. */
export function stripAuthParams(): void {
  const url = new URL(window.location.href);
  ['code', 'state', 'session_state', 'iss', 'error', 'error_description'].forEach((k) =>
    url.searchParams.delete(k),
  );
  window.history.replaceState({}, document.title, `${url.pathname}${url.search}${url.hash}`);
}
