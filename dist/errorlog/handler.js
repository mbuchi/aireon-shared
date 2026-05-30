// src/errorlog/handler.ts
var config = {
  runtime: "edge"
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
async function handler(req) {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }
  try {
    const body = await req.json();
    const { client_ip, ...errorData } = body ?? {};
    const forwardedFor = client_ip ?? req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? void 0;
    const response = await fetch(TARGET, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: AUTHORIZATION,
        ...forwardedFor ? { "X-Forwarded-For": forwardedFor } : {}
      },
      body: JSON.stringify(errorData)
    });
    const text = await response.text();
    return new Response(text || "{}", {
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
