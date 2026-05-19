// Suite-wide client-side signal (telemetry) dispatcher.
//
// Every SwissNovo app emits usage signals to the shared RES API. The request
// goes through the app's own `/api/signal-collect` Vercel edge function (see
// `@swissnovo/shared/signal-collect`), which attaches the server-side bearer
// token. This module is the single browser-side dispatcher — an app creates
// one client bound to its name and calls `.send()` at each tracked action.
//
// Replaces the per-app `signalService.ts` / `signalCollect.ts` copies.

const DEFAULT_ENDPOINT = '/api/signal-collect';

/** The thing a signal is about — typically the selected parcel / address. */
export interface SignalTarget {
  /** Human-readable address. */
  address?: string;
  /** WGS84 latitude. */
  lat?: number;
  /** WGS84 longitude. */
  lng?: number;
  /** Free-form extra context, stored as the signal's `meta_data`. */
  metaData?: Record<string, unknown>;
}

export interface SignalClientOptions {
  /** App name recorded as `app_name` on every signal (e.g. "valoo"). */
  appName: string;
  /**
   * Endpoint to POST to. Defaults to the app's own `/api/signal-collect`
   * proxy — override only for tests or a non-standard deployment.
   */
  endpoint?: string;
}

export interface SignalClient {
  /**
   * Fire-and-forget: report one user action, optionally scoped to a target.
   * Never throws — telemetry must not interfere with the host app.
   */
  send(userAction: string, target?: SignalTarget): Promise<void>;
}

/**
 * Create a signal client bound to one app name.
 *
 * @example
 * const signal = createSignalClient({ appName: 'valoo' });
 * signal.send('Search for Address', { address, lat, lng });
 */
export function createSignalClient(options: SignalClientOptions): SignalClient {
  const { appName, endpoint = DEFAULT_ENDPOINT } = options;

  return {
    async send(userAction: string, target?: SignalTarget): Promise<void> {
      try {
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            app_name: appName,
            user_action: userAction,
            // The suite convention sends the target coordinates as both the
            // user `lat`/`lng` and the `target_*` fields; the RES API
            // resolves the canonical parcel from `target_lat`/`target_lng`.
            lat: target?.lat,
            lng: target?.lng,
            target_address: target?.address,
            target_lat: target?.lat,
            target_lng: target?.lng,
            meta_data: target?.metaData,
          }),
        });
      } catch (err) {
        // Network error — the host app is unaffected.
        console.error('Signal collection error:', err);
      }
    },
  };
}
