// src/gemini/fallback.ts
var GEMINI_FALLBACK_CHAIN = Object.freeze([
  "gemini-3.5-flash",
  "gemini-3.1-flash-lite",
  "gemini-3-flash-preview"
]);
function isRetriableGeminiStatus(status) {
  if (status === 429) return true;
  if (status === 408) return true;
  if (status >= 500 && status <= 599) return true;
  return false;
}
function buildGeminiModelChain(callerModel) {
  const chain = [...GEMINI_FALLBACK_CHAIN];
  if (!callerModel) return chain;
  const trimmed = callerModel.trim();
  if (!trimmed) return chain;
  return [trimmed, ...chain.filter((m) => m !== trimmed)];
}
var DEFAULT_TIMEOUT_MS = 15e3;
async function fetchGeminiWithFallback(opts) {
  if (!opts.apiKey) throw new Error("Gemini API key is required");
  const models = buildGeminiModelChain(opts.model);
  const isRetriable = opts.isRetriable ?? isRetriableGeminiStatus;
  const timeoutMs = opts.timeoutMs === void 0 ? DEFAULT_TIMEOUT_MS : opts.timeoutMs;
  const attempts = [];
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    const url = opts.buildUrl(model, opts.apiKey);
    const ctrl = new AbortController();
    const onAbort = () => ctrl.abort();
    if (opts.signal) {
      if (opts.signal.aborted) ctrl.abort();
      else opts.signal.addEventListener("abort", onAbort, { once: true });
    }
    const timer = timeoutMs > 0 ? setTimeout(() => ctrl.abort(), timeoutMs) : null;
    let response = null;
    let networkError = null;
    try {
      response = await fetch(url, { ...opts.requestInit, signal: ctrl.signal });
    } catch (err) {
      networkError = err;
    } finally {
      if (timer) clearTimeout(timer);
      if (opts.signal) opts.signal.removeEventListener("abort", onAbort);
    }
    if (response && response.ok) {
      attempts.push({ model, status: response.status });
      return { response, model, attempts };
    }
    if (networkError) {
      const aborted = opts.signal?.aborted === true;
      const msg = networkError instanceof Error ? networkError.message : String(networkError);
      attempts.push({ model, status: 0, error: msg });
      if (aborted) {
        const e2 = new Error("Gemini request aborted");
        e2.cause = { attempts };
        throw e2;
      }
      continue;
    }
    if (response) {
      const status = response.status;
      let detail = "";
      try {
        detail = await response.text();
      } catch {
      }
      attempts.push({ model, status, error: detail || void 0 });
      if (!isRetriable(status)) {
        const e2 = new Error(
          `Gemini request failed (${status})${detail ? `: ${detail.slice(0, 200)}` : ""}`
        );
        e2.cause = { attempts };
        throw e2;
      }
    }
  }
  const summary = attempts.map((a) => `${a.model}\u2192${a.status}${a.error ? ` (${a.error.slice(0, 80)})` : ""}`).join(", ");
  const e = new Error(
    `All Gemini models exhausted after ${attempts.length} attempt(s): ${summary}`
  );
  e.cause = { attempts };
  throw e;
}

export { GEMINI_FALLBACK_CHAIN, buildGeminiModelChain, fetchGeminiWithFallback, isRetriableGeminiStatus };
