// Shared Gemini model fallback chain.
//
// Default order: gemini-3.5-flash → gemini-3.1-flash-lite → gemini-3-flash-preview.
// On every request the chain is tried in order; the next model is attempted only
// when the previous one returns a retriable failure (rate limit / overload / 5xx).
//
// If a caller supplies an explicit model it is prepended to the chain so the
// caller's preference is tried first, then the default chain runs as a safety
// net (deduplicated).

export const GEMINI_FALLBACK_CHAIN: readonly string[] = Object.freeze([
  'gemini-3.5-flash',
  'gemini-3.1-flash-lite',
  'gemini-3-flash-preview',
]);

/** Statuses that should advance to the next model in the chain. */
export function isRetriableGeminiStatus(status: number): boolean {
  if (status === 429) return true;
  if (status === 408) return true;
  if (status >= 500 && status <= 599) return true;
  return false;
}

/** Build the model list to try for a single request. */
export function buildGeminiModelChain(callerModel?: string | null): string[] {
  const chain = [...GEMINI_FALLBACK_CHAIN];
  if (!callerModel) return chain;
  const trimmed = callerModel.trim();
  if (!trimmed) return chain;
  return [trimmed, ...chain.filter((m) => m !== trimmed)];
}

export interface GeminiFallbackAttempt {
  model: string;
  status: number;
  error?: string;
}

export interface GeminiFallbackResult {
  response: Response;
  model: string;
  attempts: GeminiFallbackAttempt[];
}

export interface GeminiFallbackOptions {
  apiKey: string;
  /** Optional caller-preferred model; prepended to the default chain. */
  model?: string | null;
  /**
   * Build the fetch URL for a given model. Lets callers pick the REST verb
   * (`:generateContent`, `:streamGenerateContent`, etc.) and append query
   * params like `alt=sse`.
   */
  buildUrl: (model: string, apiKey: string) => string;
  /** Request init reused across attempts (method, headers, body). */
  requestInit: Omit<RequestInit, 'signal'>;
  /** Optional caller abort signal — aborts the in-flight attempt only. */
  signal?: AbortSignal;
  /** Per-attempt timeout. Pass 0 to disable. Default: 15s. */
  timeoutMs?: number;
  /** Custom retriable predicate; defaults to {@link isRetriableGeminiStatus}. */
  isRetriable?: (status: number) => boolean;
}

const DEFAULT_TIMEOUT_MS = 15_000;

/**
 * Issue a Gemini REST request and cascade through the fallback chain on
 * retriable failures (429 / 5xx). Resolves with the first successful Response.
 * If every model fails the function throws an Error whose `.cause` carries the
 * full attempt log for diagnostics.
 *
 * The returned Response is unread — callers consume it (.json(), .body stream).
 */
export async function fetchGeminiWithFallback(
  opts: GeminiFallbackOptions,
): Promise<GeminiFallbackResult> {
  if (!opts.apiKey) throw new Error('Gemini API key is required');

  const models = buildGeminiModelChain(opts.model);
  const isRetriable = opts.isRetriable ?? isRetriableGeminiStatus;
  const timeoutMs =
    opts.timeoutMs === undefined ? DEFAULT_TIMEOUT_MS : opts.timeoutMs;
  const attempts: GeminiFallbackAttempt[] = [];

  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    const url = opts.buildUrl(model, opts.apiKey);

    const ctrl = new AbortController();
    const onAbort = () => ctrl.abort();
    if (opts.signal) {
      if (opts.signal.aborted) ctrl.abort();
      else opts.signal.addEventListener('abort', onAbort, { once: true });
    }
    const timer =
      timeoutMs > 0 ? setTimeout(() => ctrl.abort(), timeoutMs) : null;

    let response: Response | null = null;
    let networkError: unknown = null;
    try {
      response = await fetch(url, { ...opts.requestInit, signal: ctrl.signal });
    } catch (err) {
      networkError = err;
    } finally {
      if (timer) clearTimeout(timer);
      if (opts.signal) opts.signal.removeEventListener('abort', onAbort);
    }

    if (response && response.ok) {
      attempts.push({ model, status: response.status });
      return { response, model, attempts };
    }

    if (networkError) {
      const aborted = opts.signal?.aborted === true;
      const msg =
        networkError instanceof Error ? networkError.message : String(networkError);
      attempts.push({ model, status: 0, error: msg });
      if (aborted) {
        const e = new Error('Gemini request aborted');
        (e as Error & { cause?: unknown }).cause = { attempts };
        throw e;
      }
      // Network failure / timeout — treat as retriable.
      continue;
    }

    if (response) {
      const status = response.status;
      let detail = '';
      try {
        detail = await response.text();
      } catch {
        // ignore body-read failure
      }
      attempts.push({ model, status, error: detail || undefined });

      if (!isRetriable(status)) {
        const e = new Error(
          `Gemini request failed (${status})${detail ? `: ${detail.slice(0, 200)}` : ''}`,
        );
        (e as Error & { cause?: unknown }).cause = { attempts };
        throw e;
      }
      // Retriable — fall through to next model.
    }
  }

  const summary = attempts
    .map((a) => `${a.model}→${a.status}${a.error ? ` (${a.error.slice(0, 80)})` : ''}`)
    .join(', ');
  const e = new Error(
    `All Gemini models exhausted after ${attempts.length} attempt(s): ${summary}`,
  );
  (e as Error & { cause?: unknown }).cause = { attempts };
  throw e;
}
