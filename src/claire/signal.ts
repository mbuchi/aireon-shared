// Claire usage telemetry.
//
// Each message sent to Claire emits a parcel-scoped signal to the shared RES
// API, so the admin dashboard can count assistant interactions per parcel.
// The request goes through the consuming app's own /api/signal-collect proxy
// (a Vercel edge function that attaches the server-side bearer token).

const SIGNAL_ENDPOINT = '/api/signal-collect';

interface ClaireMessageSignal {
  /** App emitting the signal — recorded as app_name. */
  appName: string;
  /** WGS84 latitude of the parcel the conversation is scoped to. */
  lat: number;
  /** WGS84 longitude of the parcel the conversation is scoped to. */
  lng: number;
  /** Human-readable parcel address, when known. */
  address?: string;
  /** Where the message originated — typed vs. a quick-prompt chip. */
  source?: 'composer' | 'quick_prompt';
}

/**
 * Fire-and-forget: reports one message sent to Claire, scoped to the parcel
 * under discussion. Each call is one message, so the admin signal dashboard
 * can count Claire interactions per parcel. Never throws — telemetry must
 * not interfere with the chat.
 */
export async function sendClaireMessageSignal({
  appName,
  lat,
  lng,
  address,
  source,
}: ClaireMessageSignal): Promise<void> {
  try {
    await fetch(SIGNAL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app_name: appName,
        user_action: 'Claire Assistant Message',
        // No parcel_id is sent: the RES API resolves the canonical parcel
        // (SwissTopo EGRID) from target_lat/lng, so the Claire signal stays
        // consistent with the address-search signal instead of recording an
        // app-internal tile id.
        lat,
        lng,
        target_address: address,
        target_lat: lat,
        target_lng: lng,
        meta_data: source ? { source } : undefined,
      }),
    });
  } catch (err) {
    console.error('Signal collection error:', err);
  }
}
