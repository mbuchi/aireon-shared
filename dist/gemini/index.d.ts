declare const GEMINI_FALLBACK_CHAIN: readonly string[];
/** Statuses that should advance to the next model in the chain. */
declare function isRetriableGeminiStatus(status: number): boolean;
/** Build the model list to try for a single request. */
declare function buildGeminiModelChain(callerModel?: string | null): string[];
interface GeminiFallbackAttempt {
    model: string;
    status: number;
    error?: string;
}
interface GeminiFallbackResult {
    response: Response;
    model: string;
    attempts: GeminiFallbackAttempt[];
}
interface GeminiFallbackOptions {
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
/**
 * Issue a Gemini REST request and cascade through the fallback chain on
 * retriable failures (429 / 5xx). Resolves with the first successful Response.
 * If every model fails the function throws an Error whose `.cause` carries the
 * full attempt log for diagnostics.
 *
 * The returned Response is unread — callers consume it (.json(), .body stream).
 */
declare function fetchGeminiWithFallback(opts: GeminiFallbackOptions): Promise<GeminiFallbackResult>;

export { GEMINI_FALLBACK_CHAIN, type GeminiFallbackAttempt, type GeminiFallbackOptions, type GeminiFallbackResult, buildGeminiModelChain, fetchGeminiWithFallback, isRetriableGeminiStatus };
