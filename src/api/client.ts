// Typed RES API client for the SwissNovo suite.
//
// A thin wrapper around `openapi-fetch`, typed against the RES API's OpenAPI
// 3.1 contract (see `schema.ts`, generated from project_RES). It replaces the
// ad-hoc `fetch` calls scattered across the apps with one fully typed client.
//
// SECURITY — where to use this:
//   - Server-side (Vercel functions, Node): pass `token`; the client calls
//     `https://res.zeroo.ch` directly.
//   - Browser: do NOT pass `token`. Call your app's own `/api/*` proxy
//     instead — point `baseUrl` at it — so the RES token stays server-side.
//
// The client always sends `X-RES-API-Version: 2`, so callers get the
// corrected error contract (proper 4xx/5xx status codes + JSON `{ error }`
// bodies) rather than the legacy HTTP-200-plain-text behaviour.

import createClient, { type Client } from 'openapi-fetch';
import type { paths } from './schema';

/** Production RES API host. */
export const RES_API_BASE_URL = 'https://res.zeroo.ch';

export interface ResApiClientOptions {
  /** Base URL of the RES API (or of an app's proxy). Defaults to production. */
  baseUrl?: string;
  /**
   * RES API token, sent as the `token` header. Provide for server-side use
   * only — never ship it to the browser.
   */
  token?: string;
  /** Optional `fetch` implementation, e.g. for tests or non-browser runtimes. */
  fetch?: typeof globalThis.fetch;
}

/** A fully typed RES API client, as returned by {@link createResApiClient}. */
export type ResApiClient = Client<paths>;

/**
 * Create a typed RES API client.
 *
 * @example
 * // Server-side (Vercel function / Node):
 * const res = createResApiClient({ token: process.env.RES_TOKEN });
 * const { data, error } = await res.POST('/res_api/parcel_data', {
 *   body: { lat: 47.3769, lng: 8.5417, structure: 'tree' },
 * });
 */
export function createResApiClient(options: ResApiClientOptions = {}): ResApiClient {
  const { baseUrl = RES_API_BASE_URL, token, fetch } = options;

  const headers: Record<string, string> = {
    // Opt in to the corrected error contract — see project_RES openapi.json.
    'X-RES-API-Version': '2',
  };
  if (token) {
    headers.token = token;
  }

  return createClient<paths>({
    baseUrl,
    headers,
    ...(fetch ? { fetch } : {}),
  });
}
