// Error-log collection handler — the suite-wide `/api/errorlog-collect`
// proxy.
//
// A Vercel serverless function that forwards browser error logs / bug reports
// to the shared RES API, attaching the server-side bearer token so it never
// reaches the client. Mirrors the signal-collect handler but stays
// self-contained (a plain fetch, no typed client) so this module never depends
// on the RES OpenAPI schema being regenerated.
//
// Each consuming app's `api/errorlog-collect.ts` is a one-line re-export:
//   export { config, default } from '@aireon/shared/errorlog-collect';

export const config = {
  maxDuration: 10,
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

type NodeHeaders = Record<string, string | string[] | undefined>;
type NodeRequestLike = {
  method?: string;
  headers?: NodeHeaders;
  body?: unknown;
  connection?: { remoteAddress?: string };
  socket?: { remoteAddress?: string };
};
type NodeResponseLike = {
  status(code: number): NodeResponseLike;
  setHeader(name: string, value: string): void;
  end(body?: string): void;
};

function getHeader(headers: Headers | NodeHeaders | undefined, name: string): string | undefined {
  if (!headers) return undefined;
  if (headers instanceof Headers) return headers.get(name) ?? undefined;
  const value = headers[name] ?? headers[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value;
}

async function readBody(req: Request | NodeRequestLike): Promise<Record<string, unknown>> {
  if ('json' in req && typeof req.json === 'function') {
    const parsed = await req.json();
    return parsed && typeof parsed === 'object' ? parsed as Record<string, unknown> : {};
  }
  const body = (req as NodeRequestLike).body;
  if (!body) return {};
  if (typeof body === 'string') {
    const parsed = JSON.parse(body);
    return parsed && typeof parsed === 'object' ? parsed as Record<string, unknown> : {};
  }
  if (typeof body === 'object') return body as Record<string, unknown>;
  return {};
}

function nodeIp(req: NodeRequestLike): string | undefined {
  return req.connection?.remoteAddress ?? req.socket?.remoteAddress;
}

function jsonResponse(
  payload: string,
  init: { status: number },
  nodeRes?: NodeResponseLike,
): Response | void {
  if (!nodeRes) {
    return new Response(payload, {
      status: init.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  for (const [key, value] of Object.entries(corsHeaders)) nodeRes.setHeader(key, value);
  nodeRes.setHeader('Content-Type', 'application/json');
  nodeRes.status(init.status).end(payload);
}

async function forward(req: Request | NodeRequestLike): Promise<{ status: number; body: string }> {
  try {
    const body = await readBody(req);
    const { client_ip, ...errorData } = body ?? {};
    const headers = req.headers;

    const forwardedFor = [
      client_ip,
      getHeader(headers, 'x-forwarded-for') ??
      getHeader(headers, 'x-real-ip') ??
      (!('json' in req) ? nodeIp(req as NodeRequestLike) : undefined),
    ].find((value): value is string => typeof value === 'string' && value.length > 0);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8_000);
    let response: Response;
    try {
      response = await fetch(TARGET, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: AUTHORIZATION,
          ...(forwardedFor ? { 'X-Forwarded-For': forwardedFor } : {}),
        },
        body: JSON.stringify(errorData),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    const text = await response.text();
    return { status: response.status, body: text || '{}' };
  } catch (error) {
    const err = error as Error;
    const status = err.name === 'AbortError' ? 504 : 502;
    return {
      status,
      body: JSON.stringify({
        error: err.name === 'AbortError' ? 'errorlog upstream timeout' : err.message,
      }),
    };
  }
}

export default async function handler(
  req: Request | NodeRequestLike,
  res?: NodeResponseLike,
): Promise<Response | void> {
  if (req.method === 'OPTIONS') {
    return jsonResponse('{}', { status: 200 }, res);
  }

  const result = await forward(req);
  return jsonResponse(result.body, { status: result.status }, res);
}
