// Claire conversation persistence.
//
// Each Claire chat thread is stored on the shared RES API (res.zeroo.ch),
// keyed by the signed-in user and the parcel under discussion, so revisiting
// the same parcel restores the same conversation — and future apps can list
// a user's Claire history by parcel. Signed-out visitors get an in-memory
// session only (no token, nothing to key on); persistence simply no-ops.
//
// Authenticated with the user's own Zitadel token.

const CLAIRE_API_BASE = 'https://res.zeroo.ch/res_api/claire';

export interface ClaireTurn {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Loads the stored conversation for a parcel. Returns [] when the visitor is
 * signed out, the parcel has no history, or the request fails — Claire then
 * starts fresh. Never throws.
 */
export async function loadClaireConversation(
  parcelId: string,
  accessToken: string | undefined,
): Promise<ClaireTurn[]> {
  if (!accessToken || !parcelId) return [];
  try {
    const url = `${CLAIRE_API_BASE}/conversation?parcel_id=${encodeURIComponent(
      parcelId,
    )}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { messages?: unknown };
    return sanitizeTurns(data?.messages);
  } catch {
    return [];
  }
}

interface SaveClaireConversationParams {
  parcelId: string;
  messages: ClaireTurn[];
  accessToken: string | undefined;
  /** App the conversation happened on — stored as app_name. */
  appName: string;
  /** Parcel address — stored so the future history view reads nicely. */
  address?: string;
  lat?: number;
  lng?: number;
}

/**
 * Fire-and-forget: upserts the full conversation for a parcel. No-ops for
 * signed-out visitors. Never throws — persistence must not break the chat.
 */
export async function saveClaireConversation({
  parcelId,
  messages,
  accessToken,
  appName,
  address,
  lat,
  lng,
}: SaveClaireConversationParams): Promise<void> {
  if (!accessToken || !parcelId) return;
  try {
    await fetch(`${CLAIRE_API_BASE}/conversation`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parcel_id: parcelId,
        app_name: appName,
        messages: messages.map(({ role, content }) => ({ role, content })),
        target_address: address,
        target_lat: lat,
        target_lng: lng,
      }),
    });
  } catch {
    /* network error — the in-memory conversation is unaffected */
  }
}

/**
 * One row in the user's Claire history — every parcel they've ever chatted
 * Claire about, across every app in the suite. Backed by the shared
 * `claire_conversation` table (one row per user × parcel), so the same
 * parcel discussed in two apps surfaces here as one entry, attributed to
 * whichever app most recently wrote the row.
 */
export interface ClaireConversationSummary {
  parcel_id: string;
  app_name: string | null;
  target_address: string | null;
  target_lat: number | null;
  target_lng: number | null;
  message_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * Lists every conversation the signed-in user has had with Claire, newest
 * first. Powers the doorway "studio history" — a unified view of every
 * parcel chat across the suite. Returns [] for signed-out visitors or on
 * any network/server failure; never throws.
 */
export async function listClaireConversations(
  accessToken: string | undefined,
): Promise<ClaireConversationSummary[]> {
  if (!accessToken) return [];
  try {
    const res = await fetch(`${CLAIRE_API_BASE}/conversations`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as unknown;
    return sanitizeSummaries(data);
  } catch {
    return [];
  }
}

function sanitizeSummaries(raw: unknown): ClaireConversationSummary[] {
  if (!Array.isArray(raw)) return [];
  const out: ClaireConversationSummary[] = [];
  for (const row of raw) {
    if (!row || typeof row !== 'object') continue;
    const r = row as Record<string, unknown>;
    if (typeof r.parcel_id !== 'string' || !r.parcel_id) continue;
    out.push({
      parcel_id: r.parcel_id,
      app_name: typeof r.app_name === 'string' ? r.app_name : null,
      target_address: typeof r.target_address === 'string' ? r.target_address : null,
      target_lat: typeof r.target_lat === 'number'
        ? r.target_lat
        : r.target_lat != null && !Number.isNaN(Number(r.target_lat))
          ? Number(r.target_lat)
          : null,
      target_lng: typeof r.target_lng === 'number'
        ? r.target_lng
        : r.target_lng != null && !Number.isNaN(Number(r.target_lng))
          ? Number(r.target_lng)
          : null,
      message_count: Number(r.message_count) || 0,
      created_at: typeof r.created_at === 'string' ? r.created_at : '',
      updated_at: typeof r.updated_at === 'string' ? r.updated_at : '',
    });
  }
  return out;
}

// Defensive: the API should only ever return well-formed turns, but a bad
// row must never crash the chat — drop anything that isn't a clean turn.
function sanitizeTurns(raw: unknown): ClaireTurn[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (t): t is ClaireTurn =>
        !!t &&
        typeof t === 'object' &&
        ((t as ClaireTurn).role === 'user' ||
          (t as ClaireTurn).role === 'assistant') &&
        typeof (t as ClaireTurn).content === 'string',
    )
    .map(({ role, content }) => ({ role, content }));
}
