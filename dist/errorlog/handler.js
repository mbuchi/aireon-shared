// src/errorlog/handler.ts
var config = {
  maxDuration: 10
};
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey"
};
var DEFAULT_BASE_URL = "https://res.zeroo.ch";
var DEFAULT_API_TOKEN = "JNpkPe-PFAZh8iQ6H63aiJXwGA3Hov.LP3tjijxF6PAtACakK*x!Yxj4TcXQAGe**CLzFbh7yUZxBvDKnPZBa*x4sC";
function readEnv(...names) {
  const env = globalThis.process?.env;
  if (env) {
    for (const name of names) {
      const value = env[name];
      if (value) return value;
    }
  }
  const denoEnv = globalThis.Deno?.env;
  if (denoEnv) {
    for (const name of names) {
      const value = denoEnv.get(name);
      if (value) return value;
    }
  }
  return void 0;
}
var RAW_TOKEN = readEnv("ERRORLOG_API_TOKEN", "VITE_ERRORLOG_API_TOKEN", "SIGNAL_API_TOKEN", "SIGNAL_API_BEARER") ?? DEFAULT_API_TOKEN;
var AUTHORIZATION = `Bearer ${RAW_TOKEN.replace(/^Bearer\s+/i, "")}`;
var API_URL = readEnv("ERRORLOG_API_URL", "SIGNAL_API_URL", "VITE_SIGNAL_API_URL");
var baseUrl = API_URL ? new URL(API_URL).origin : DEFAULT_BASE_URL;
var TARGET = `${baseUrl}/res_api/errorlog/collect`;
function getHeader(headers, name) {
  if (!headers) return void 0;
  if (headers instanceof Headers) return headers.get(name) ?? void 0;
  const value = headers[name] ?? headers[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value;
}
async function readBody(req) {
  if ("json" in req && typeof req.json === "function") {
    const parsed = await req.json();
    return parsed && typeof parsed === "object" ? parsed : {};
  }
  const body = req.body;
  if (!body) return {};
  if (typeof body === "string") {
    const parsed = JSON.parse(body);
    return parsed && typeof parsed === "object" ? parsed : {};
  }
  if (typeof body === "object") return body;
  return {};
}
function nodeIp(req) {
  return req.connection?.remoteAddress ?? req.socket?.remoteAddress;
}
function jsonResponse(payload, init, nodeRes) {
  if (!nodeRes) {
    return new Response(payload, {
      status: init.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
  for (const [key, value] of Object.entries(corsHeaders)) nodeRes.setHeader(key, value);
  nodeRes.setHeader("Content-Type", "application/json");
  nodeRes.status(init.status).end(payload);
}
async function forward(req) {
  try {
    const body = await readBody(req);
    const { client_ip, ...errorData } = body ?? {};
    const headers = req.headers;
    const forwardedFor = [
      client_ip,
      getHeader(headers, "x-forwarded-for") ?? getHeader(headers, "x-real-ip") ?? (!("json" in req) ? nodeIp(req) : void 0)
    ].find((value) => typeof value === "string" && value.length > 0);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8e3);
    let response;
    try {
      response = await fetch(TARGET, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: AUTHORIZATION,
          ...forwardedFor ? { "X-Forwarded-For": forwardedFor } : {}
        },
        body: JSON.stringify(errorData),
        signal: controller.signal
      });
    } finally {
      clearTimeout(timeout);
    }
    const text = await response.text();
    return { status: response.status, body: text || "{}" };
  } catch (error) {
    const err = error;
    const status = err.name === "AbortError" ? 504 : 502;
    return {
      status,
      body: JSON.stringify({
        error: err.name === "AbortError" ? "errorlog upstream timeout" : err.message
      })
    };
  }
}
async function handler(req, res) {
  if (req.method === "OPTIONS") {
    return jsonResponse("{}", { status: 200 }, res);
  }
  const result = await forward(req);
  return jsonResponse(result.body, { status: result.status }, res);
}

export { config, handler as default };
