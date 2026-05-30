// Error-log collection edge handler — the suite-wide `/api/errorlog-collect`
// proxy.
//
// A Vercel edge function that forwards browser error logs / bug reports to the
// shared RES API, attaching the server-side bearer token so it never reaches
// the client. Mirrors the signal-collect handler but stays self-contained (a
// plain fetch, no typed client) so this module never depends on the RES
// OpenAPI schema being regenerated.
//
// Each consuming app's `api/errorlog-collect.ts` is a one-line re-export:
//   export { config, default } from '@swissnovo/shared/errorlog-collect';

export const config = {
  runtime: 'edge',
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, X-Client-Info, Apikey',
};

const DEFAULT_BASE_URL = 'https://res.zeroo.ch';

// Suite RES API bearer token. A default is shipped so apps deploy with zero
// config (matching the package's stated philosophy); override per app with the
// `ERRORLOG_API_TOKEN` (or shared `SIGNAL_API_TOKEN`) env var.
const DEFAULT_API_TOKEN =
  'JNpkPe-PFAZh8iQ6H63aiJXwGA3Hov.LP3tjijxF6PAtACakK*x!Yxj4TcXQAGe**CLzFbh7yUZxBvDKnPZBa*x4sC';

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

const RAW_TOKEN =
  readEnv('ERRORLOG_API_TOKEN', 'VITE_ERRORLOG_API_TOKEN', 'SIGNAL_API_TOKEN', 'SIGNAL_API_BEARER') ??
  DEFAULT_API_TOKEN;
const AUTHORIZATION = `Bearer ${RAW_TOKEN.replace(/^Bearer\s+/i, '')}`;

const API_URL = readEnv('ERRORLOG_API_URL', 'SIGNAL_API_URL', 'VITE_SIGNAL_API_URL');
const baseUrl = API_URL ? new URL(API_URL).origin : DEFAULT_BASE_URL;
const TARGET = `${baseUrl}/res_api/errorlog/collect`;

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { client_ip, ...errorData } = body ?? {};

    const forwardedFor =
      client_ip ??
      req.headers.get('x-forwarded-for') ??
      req.headers.get('x-real-ip') ??
      undefined;

    const response = await fetch(TARGET, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: AUTHORIZATION,
        ...(forwardedFor ? { 'X-Forwarded-For': forwardedFor } : {}),
      },
      body: JSON.stringify(errorData),
    });

    const text = await response.text();
    return new Response(text || '{}', {
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
