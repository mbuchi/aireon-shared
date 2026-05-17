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
