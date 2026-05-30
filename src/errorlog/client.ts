// Suite-wide client-side error logger + bug-report dispatcher.
//
// Every SwissNovo app reports its client errors (uncaught exceptions, promise
// rejections, React render errors) and user bug reports to the shared RES API.
// The request goes through the app's own `/api/errorlog-collect` Vercel edge
// function (see `@swissnovo/shared/errorlog-collect`), which attaches the
// server-side bearer token. This module is the single browser-side dispatcher.
//
// Mirrors the signal client: one logger bound to the app name, fire-and-forget,
// never throws — error reporting must never break the host app.

const DEFAULT_ENDPOINT = '/api/errorlog-collect';
const DEFAULT_MAX_EVENTS = 25;
const DEDUPE_WINDOW_MS = 60_000;

export type ErrorSeverity = 'error' | 'warning' | 'info';
export type ErrorKind =
  | 'runtime'
  | 'promise'
  | 'react'
  | 'console'
  | 'network'
  | 'user_report';

/** Live context attached to every captured event (selected parcel, signed-in user). */
export interface ErrorLogContext {
  /** Human-readable address in context. */
  address?: string;
  /** Parcel EGRID in context. */
  parcelId?: string;
  /** WGS84 latitude in context. */
  lat?: number;
  /** WGS84 longitude in context. */
  lng?: number;
  /** Reporter email, if signed in. */
  email?: string;
  /** Free-form extra context, merged into `meta_data`. */
  metaData?: Record<string, unknown>;
}

export interface ErrorLoggerOptions {
  /** App name recorded as `app_name` on every log (e.g. "valoo"). */
  appName: string;
  /** Endpoint to POST to. Defaults to the app's `/api/errorlog-collect` proxy. */
  endpoint?: string;
  /** Pull live context (selected parcel, signed-in email) at capture time. */
  getContext?: () => ErrorLogContext | undefined;
  /** Max events sent per page session (flood guard). Default 25. */
  maxEventsPerSession?: number;
}

export interface ErrorLogger {
  /**
   * Fire-and-forget: report one error. Accepts an Error, a string, or anything
   * thrown. Never throws. De-duplicated and rate-limited within the session.
   */
  capture(
    error: unknown,
    extra?: {
      severity?: ErrorSeverity;
      kind?: ErrorKind;
      source?: string;
      metaData?: Record<string, unknown>;
    },
  ): void;
  /**
   * Submit a user bug report. Awaitable — resolves `true` on success so a
   * report form can show confirmation. Always recorded as a distinct row.
   */
  report(input: {
    message: string;
    email?: string;
    metaData?: Record<string, unknown>;
  }): Promise<boolean>;
  /**
   * Attach global `error` + `unhandledrejection` listeners. Idempotent.
   * Returns an uninstall function.
   */
  install(): () => void;
}

/** Messages that are pure noise — never worth reporting. */
const NOISE = [
  'ResizeObserver loop',
  'Script error.', // opaque cross-origin error, no actionable info
  'Non-Error promise rejection captured',
  'Load failed', // generic Safari fetch abort on navigation
];

function isNoise(message: string, source?: string): boolean {
  if (source && /(^|\/\/)(chrome|moz|safari-web)-extension:\/\//.test(source)) {
    return true;
  }
  return NOISE.some((n) => message.includes(n));
}

/** Normalise anything thrown into a message + stack. */
function normaliseError(error: unknown): { message: string; stack?: string } {
  if (error instanceof Error) {
    return { message: error.message || error.name || 'Error', stack: error.stack };
  }
  if (typeof error === 'string') return { message: error };
  if (error && typeof error === 'object') {
    const maybe = error as { message?: unknown; stack?: unknown };
    if (typeof maybe.message === 'string') {
      return {
        message: maybe.message,
        stack: typeof maybe.stack === 'string' ? maybe.stack : undefined,
      };
    }
    try {
      return { message: JSON.stringify(error).slice(0, 500) };
    } catch {
      return { message: 'Unserialisable error' };
    }
  }
  return { message: String(error) };
}

/**
 * Create an error logger bound to one app name.
 *
 * @example
 * const logger = createErrorLogger({ appName: 'valoo' });
 * logger.install();                 // capture global errors
 * logger.capture(err, { kind: 'network' });
 */
export function createErrorLogger(options: ErrorLoggerOptions): ErrorLogger {
  // Lowercase the app name defensively so the RES dashboard's `by_app`
  // aggregation can never be fragmented by a stray capital — same rule as
  // the signal client and the rest of the suite.
  const appName = options.appName.toLowerCase();
  const endpoint = options.endpoint ?? DEFAULT_ENDPOINT;
  const maxEvents = options.maxEventsPerSession ?? DEFAULT_MAX_EVENTS;

  let sent = 0;
  const recent = new Map<string, number>(); // fingerprint -> last-sent epoch ms

  function buildBody(
    message: string,
    severity: ErrorSeverity,
    kind: ErrorKind,
    stack?: string,
    source?: string,
    metaData?: Record<string, unknown>,
    emailOverride?: string,
  ): Record<string, unknown> {
    const ctx = (() => {
      try {
        return options.getContext?.();
      } catch {
        return undefined;
      }
    })();
    const meta = { ...(ctx?.metaData ?? {}), ...(metaData ?? {}) };
    return {
      app_name: appName,
      message,
      severity,
      kind,
      stack,
      source,
      page_url: typeof location !== 'undefined' ? location.href : undefined,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      user_email: emailOverride ?? ctx?.email,
      target_address: ctx?.address,
      parcel_id: ctx?.parcelId,
      target_lat: ctx?.lat,
      target_lng: ctx?.lng,
      meta_data: Object.keys(meta).length ? meta : undefined,
    };
  }

  function post(body: Record<string, unknown>): Promise<Response | null> {
    try {
      return fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        // Survive page unload — errors often fire as the user navigates away.
        keepalive: true,
      }).catch((err) => {
        console.error('Error log dispatch failed:', err);
        return null;
      });
    } catch (err) {
      console.error('Error log dispatch failed:', err);
      return Promise.resolve(null);
    }
  }

  const capture: ErrorLogger['capture'] = (error, extra) => {
    try {
      const { message, stack } = normaliseError(error);
      const source = extra?.source;
      if (!message || isNoise(message, source)) return;
      if (sent >= maxEvents) return;

      // Client-side de-dupe: the same error within a short window is dropped
      // (the server also de-dupes by occurrence count).
      const fp = `${message}|${source ?? ''}|${extra?.kind ?? 'runtime'}`;
      const now = Date.now();
      const last = recent.get(fp);
      if (last && now - last < DEDUPE_WINDOW_MS) return;
      recent.set(fp, now);

      sent += 1;
      void post(
        buildBody(
          message,
          extra?.severity ?? 'error',
          extra?.kind ?? 'runtime',
          stack,
          source,
          extra?.metaData,
        ),
      );
    } catch {
      // Reporting must never throw.
    }
  };

  const report: ErrorLogger['report'] = async (input) => {
    try {
      const message = (input.message ?? '').trim();
      if (!message) return false;
      const res = await post(
        buildBody(message, 'info', 'user_report', undefined, undefined, input.metaData, input.email),
      );
      return Boolean(res && res.ok);
    } catch {
      return false;
    }
  };

  const install: ErrorLogger['install'] = () => {
    if (typeof window === 'undefined') return () => {};
    const w = window as unknown as { __swissnovoErrorLogInstalled?: boolean };
    if (w.__swissnovoErrorLogInstalled) return () => {};
    w.__swissnovoErrorLogInstalled = true;

    const onError = (event: ErrorEvent) => {
      const where = event.filename
        ? `${event.filename}:${event.lineno ?? 0}:${event.colno ?? 0}`
        : undefined;
      capture(event.error ?? event.message, { kind: 'runtime', source: where });
    };
    const onRejection = (event: PromiseRejectionEvent) => {
      capture(event.reason ?? 'Unhandled promise rejection', { kind: 'promise' });
    };

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);

    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
      w.__swissnovoErrorLogInstalled = false;
    };
  };

  return { capture, report, install };
}

/**
 * One-liner setup: create a logger, attach global handlers, and return it.
 * Drop into an app entrypoint (e.g. `main.tsx`):
 *
 *   installErrorLogging({ appName: 'valoo' });
 */
export function installErrorLogging(options: ErrorLoggerOptions): ErrorLogger {
  const logger = createErrorLogger(options);
  logger.install();
  return logger;
}
