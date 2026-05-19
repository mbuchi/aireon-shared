import { createResApiClient } from '../chunk-J3SBZ4RV.js';

// src/signal/handler.ts
var config = {
  runtime: "edge"
};
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey"
};
var DEFAULT_API_TOKEN = "Bearer JNpkPe-PFAZh8iQ6H63aiJXwGA3Hov.LP3tjijxF6PAtACakK*x!Yxj4TcXQAGe**CLzFbh7yUZxBvDKnPZBa*x4sC";
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
var API_TOKEN = readEnv("SIGNAL_API_TOKEN", "VITE_SIGNAL_API_TOKEN", "SIGNAL_API_BEARER") ?? DEFAULT_API_TOKEN;
var SIGNAL_API_URL = readEnv("SIGNAL_API_URL", "VITE_SIGNAL_API_URL");
var baseUrl = SIGNAL_API_URL ? new URL(SIGNAL_API_URL).origin : void 0;
var resApi = createResApiClient({ baseUrl, bearerToken: API_TOKEN });
async function handler(req) {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }
  try {
    const body = await req.json();
    const { client_ip, ...signalData } = body;
    const forwardedFor = client_ip ?? req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? void 0;
    const { data, error, response } = await resApi.POST("/res_api/signal/collect", {
      body: signalData,
      ...forwardedFor ? { headers: { "X-Forwarded-For": forwardedFor } } : {}
    });
    return new Response(JSON.stringify(data ?? error ?? {}), {
      status: response.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}

export { config, handler as default };
