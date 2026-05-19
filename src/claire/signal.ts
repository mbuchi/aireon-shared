// Claire usage telemetry.
//
// Each message sent to Claire emits a parcel-scoped signal to the shared RES
// API, so the admin dashboard can count assistant interactions per parcel.
// This is a thin wrapper over the suite-wide signal client — see
// `../signal/client`.

import { createSignalClient } from '../signal/client';

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
  // No parcel_id is sent: the RES API resolves the canonical parcel
  // (SwissTopo EGRID) from target_lat/lng, so the Claire signal stays
  // consistent with the address-search signal instead of recording an
  // app-internal tile id.
  await createSignalClient({ appName }).send('Claire Assistant Message', {
    address,
    lat,
    lng,
    metaData: source ? { source } : undefined,
  });
}
