import {
  UserManager,
  WebStorageStateStore,
  type User,
  type UserManagerSettings,
} from 'oidc-client-ts';

// The whole SwissNovo suite authenticates against a single shared Zitadel
// OIDC client, so this config is identical for every app — no per-app setup.
const ZITADEL_AUTHORITY = 'https://swissnovo-ekqvxs.ch1.zitadel.cloud/';
const ZITADEL_CLIENT_ID = '366334583324661156';

const origin = typeof window !== 'undefined' ? window.location.origin : '';

const settings: UserManagerSettings = {
  authority: ZITADEL_AUTHORITY,
  client_id: ZITADEL_CLIENT_ID,
  redirect_uri: `${origin}/`,
  post_logout_redirect_uri: `${origin}/`,
  silent_redirect_uri: `${origin}/silent-callback.html`,
  response_type: 'code',
  scope: 'openid profile email',
  loadUserInfo: true,
  automaticSilentRenew: true,
  monitorSession: false,
  // Bound the hidden-iframe silent SSO. oidc-client-ts defaults to 10s, so a
  // visitor with no Zitadel session waits the full 10s before the app settles
  // to anonymous. A logged-in check resolves in well under a second; 5s leaves
  // ample room for a slow network while capping the worst case.
  silentRequestTimeoutInSeconds: 5,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  stateStore: new WebStorageStateStore({ store: window.localStorage }),
};

/** The shared OIDC client for the whole suite. */
export const userManager = new UserManager(settings);

userManager.events.addSilentRenewError((e) => {
  console.warn('[auth] silent renew error', e);
});

/** sessionStorage flag so silent SSO is attempted at most once per browser tab. */
export const SSO_ATTEMPTED_KEY = 'swissnovo:silent_sso_attempted';

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
