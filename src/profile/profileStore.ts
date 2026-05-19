// Single source of truth for a SwissNovo user's profile.
//
// Replaces the per-app split between `useAvatar` (a chosen avatar id) and a
// separate `services/profile` (a random-seed "avatar_icon" + gender/age/about)
// — two stores that drifted apart, so "View profile" showed a different
// avatar than the one the user actually picked.
//
// One store, one avatar. Persisted to localStorage (reliable, instant) and
// mirrored best-effort to the RES API so the profile follows the user across
// devices. A module-level subscriber list keeps every mounted component in
// sync the moment the profile changes — no page refresh.

export type Gender = 'male' | 'female' | 'other' | 'unspecified';

/** The complete, unified SwissNovo user profile. */
export interface SwissnovoProfile {
  /** Id of the chosen catalogue avatar (see `avatars.ts`), or `null`. */
  avatar_id: string | null;
  gender: Gender;
  age: number | null;
  /** Short free-text bio. */
  about: string;
}

const LS_KEY = 'swissnovo:profile';
/** Legacy key written by the old standalone `useAvatar` hook. */
const LEGACY_AVATAR_KEY = 'swissnovo:avatar_id';

const DEFAULT_PROFILE_URL = 'https://res.zeroo.ch/res_api/swissnovo_user/profile';

/** RES profile endpoint — overridable via `VITE_PROFILE_API_URL`. */
function profileApiUrl(): string {
  try {
    const env = (import.meta as unknown as { env?: Record<string, string> }).env;
    const override = env?.VITE_PROFILE_API_URL?.trim();
    if (override) return override;
  } catch {
    /* import.meta.env unavailable — use the default */
  }
  return DEFAULT_PROFILE_URL;
}

export function defaultProfile(): SwissnovoProfile {
  return { avatar_id: null, gender: 'unspecified', age: null, about: '' };
}

function coerce(raw: Partial<SwissnovoProfile> | null | undefined): SwissnovoProfile {
  const base = defaultProfile();
  if (!raw || typeof raw !== 'object') return base;
  return {
    avatar_id: typeof raw.avatar_id === 'string' && raw.avatar_id ? raw.avatar_id : null,
    gender: (['male', 'female', 'other', 'unspecified'] as const).includes(raw.gender as Gender)
      ? (raw.gender as Gender)
      : 'unspecified',
    age: typeof raw.age === 'number' && Number.isFinite(raw.age) ? raw.age : null,
    about: typeof raw.about === 'string' ? raw.about : '',
  };
}

function loadLocal(): SwissnovoProfile {
  if (typeof window === 'undefined') return defaultProfile();
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (raw) return coerce(JSON.parse(raw) as Partial<SwissnovoProfile>);
    // One-time migration from the old standalone avatar store.
    const legacy = window.localStorage.getItem(LEGACY_AVATAR_KEY);
    if (legacy) return coerce({ avatar_id: legacy });
  } catch {
    /* fall through to default */
  }
  return defaultProfile();
}

function writeLocal(p: SwissnovoProfile): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(p));
    // Keep the legacy key in step so any not-yet-migrated app still reads the
    // right avatar during the rollout.
    if (p.avatar_id) window.localStorage.setItem(LEGACY_AVATAR_KEY, p.avatar_id);
    else window.localStorage.removeItem(LEGACY_AVATAR_KEY);
  } catch {
    /* storage unavailable — in-memory state still updated */
  }
}

// --- module-level state + subscriptions ------------------------------------

let current: SwissnovoProfile | null = null;
const subscribers = new Set<(p: SwissnovoProfile) => void>();

/** The current profile, lazily initialised from localStorage. */
export function getProfile(): SwissnovoProfile {
  if (!current) current = loadLocal();
  return current;
}

/** Subscribe to profile changes. Returns an unsubscribe function. */
export function subscribe(cb: (p: SwissnovoProfile) => void): () => void {
  subscribers.add(cb);
  return () => {
    subscribers.delete(cb);
  };
}

function broadcast(next: SwissnovoProfile): void {
  current = next;
  writeLocal(next);
  subscribers.forEach((cb) => cb(next));
}

// --- RES API sync (best-effort) --------------------------------------------

let warnedAboutRemote = false;

function isDev(): boolean {
  try {
    return Boolean((import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV);
  } catch {
    return false;
  }
}

/** Fetch the profile stored on the RES API, or `null` on any failure. */
export async function fetchRemoteProfile(
  accessToken: string | undefined,
): Promise<SwissnovoProfile | null> {
  if (!accessToken) return null;
  try {
    const res = await fetch(profileApiUrl(), {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      avatar_icon?: string | null;
      gender?: string;
      age?: number | null;
      account_info?: Record<string, unknown> | null;
    };
    return coerce({
      avatar_id: typeof data?.avatar_icon === 'string' ? data.avatar_icon : null,
      gender: data?.gender as Gender,
      age: typeof data?.age === 'number' ? data.age : null,
      about:
        typeof data?.account_info?.about === 'string'
          ? (data.account_info.about as string)
          : '',
    });
  } catch {
    return null;
  }
}

/** Push the profile to the RES API. Failures are swallowed (localStorage wins). */
async function pushRemoteProfile(
  p: SwissnovoProfile,
  accessToken: string | undefined,
): Promise<void> {
  if (!accessToken) return;
  try {
    const res = await fetch(profileApiUrl(), {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        avatar_icon: p.avatar_id,
        gender: p.gender,
        age: p.age,
        account_info: { about: p.about },
      }),
    });
    if (!res.ok && !warnedAboutRemote && isDev()) {
      warnedAboutRemote = true;
      console.info('[profile] RES API profile PUT returned', res.status, '— using localStorage only.');
    }
  } catch {
    /* network error — localStorage already holds the change */
  }
}

// --- public mutators -------------------------------------------------------

/**
 * Merge `patch` into the current profile, persist it, broadcast to every
 * subscriber, and mirror it to the RES API.
 */
export function updateProfile(
  patch: Partial<SwissnovoProfile>,
  accessToken?: string,
): SwissnovoProfile {
  const next = coerce({ ...getProfile(), ...patch });
  broadcast(next);
  void pushRemoteProfile(next, accessToken);
  return next;
}

/**
 * Pull the profile from the RES API and adopt it locally. Called once after
 * sign-in so a profile set on another device shows up here.
 */
export async function hydrateFromRemote(accessToken: string | undefined): Promise<void> {
  const remote = await fetchRemoteProfile(accessToken);
  if (remote) broadcast(remote);
}
