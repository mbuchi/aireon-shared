// Signal-collection edge handler — the suite-wide `/api/signal-collect` proxy.
//
// A Vercel edge function that forwards browser usage signals to the shared RES
// API, attaching the server-side bearer token so it never reaches the client.
// Uses the typed RES API client from this same package.
//
// Each consuming app's `api/signal-collect.ts` is a one-line re-export:
//   export { config, default } from '@swissnovo/shared/signal-collect';
//
// Server-safe: imports only the `/api` client, never the browser modules.

import { createResApiClient } from '../api/client';

export const config = {
  runtime: 'edge',
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, X-Client-Info, Apikey',
};

// Suite RES API bearer token. A default is shipped so apps deploy with zero
// config (matching the package's stated philosophy); override per app with
// the `SIGNAL_API_TOKEN` env var. See the design doc, Decision 1.
const DEFAULT_API_TOKEN =
  'Bearer JNpkPe-PFAZh8iQ6H63aiJXwGA3Hov.LP3tjijxF6PAtACakK*x!Yxj4TcXQAGe**CLzFbh7yUZxBvDKnPZBa*x4sC';

function readEnv(...names: string[]): string | undefined {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process?.env;
  if (env) {
    for (const name of names) {
      const value = env[name];
      if (value) return value;
    }
  }
  const denoEnv = (globalThis as { Deno?: { env?: { get(name: string): string | undefined } } })
    .Deno?.env;
  if (denoEnv) {
    for (const name of names) {
      const value = denoEnv.get(name);
      if (value) return value;
    }
  }
  return undefined;
}

const API_TOKEN =
  readEnv('SIGNAL_API_TOKEN', 'VITE_SIGNAL_API_TOKEN', 'SIGNAL_API_BEARER') ??
  DEFAULT_API_TOKEN;

// Optional non-production override. The typed client takes a base URL, so
// derive the origin from the legacy full-URL env var when it is set.
const SIGNAL_API_URL = readEnv('SIGNAL_API_URL', 'VITE_SIGNAL_API_URL');
const baseUrl = SIGNAL_API_URL ? new URL(SIGNAL_API_URL).origin : undefined;

// createResApiClient sends `X-RES-API-Version: 2` and the bearer token.
const resApi = createResApiClient({ baseUrl, bearerToken: API_TOKEN });

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { client_ip, ...signalData } = body;

    const forwardedFor =
      client_ip ??
      req.headers.get('x-forwarded-for') ??
      req.headers.get('x-real-ip') ??
      undefined;

    const { data, error, response } = await resApi.POST('/res_api/signal/collect', {
      body: signalData,
      ...(forwardedFor ? { headers: { 'X-Forwarded-For': forwardedFor } } : {}),
    });

    return new Response(JSON.stringify(data ?? error ?? {}), {
      status: response.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
