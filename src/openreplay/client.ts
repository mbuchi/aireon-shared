// Suite-wide opt-in OpenReplay session replay.
//
// Phase 2 of the OpenReplay rollout (see the toolbox /en/openreplay brief):
// every SwissNovo app can opt in to self-hosted session replay by calling
// `initOpenReplay({ projectKey })` once at startup. Data goes to our own
// Swiss-hosted OpenReplay instance (https://openreplay.zeroo.ch) — no third
// party — with client-side PII obscuring on by default for GDPR/data residency.
//
// Design notes:
//  - The `@openreplay/tracker` package is an OPTIONAL peer dependency. It is
//    loaded via a dynamic `import()` only when `initOpenReplay()` actually runs,
//    so apps that never opt in don't bundle it and builds don't break if it's
//    absent. The import specifier is held in a variable so bundlers treat it as a
//    runtime (code-split) import rather than trying to resolve it at build time.
//  - Nothing here ever throws: telemetry must never break the host app.
//
// Mirrors the factory style of `createErrorLogger` — plain functions, no React.

/** Minimal structural type for the tracker instance we use (avoids a hard type dep). */
interface TrackerLike {
  start: (startOpts?: unknown) => Promise<unknown> | unknown;
  setUserID: (id: string) => void;
  setMetadata: (key: string, value: string) => void;
  stop?: () => void;
}

export interface OpenReplayOptions {
  /**
   * The OpenReplay project key (from Preferences → Projects). REQUIRED — when
   * absent, `initOpenReplay` is a no-op, so the call can ship to production
   * before a key exists and activate via env/config later.
   */
  projectKey?: string;
  /**
   * Ingest endpoint of the self-hosted instance.
   * Default: https://openreplay.zeroo.ch/ingest
   */
  ingestPoint?: string;
  /**
   * Obscure all text nodes' emails (default true). Obscured content never
   * leaves the browser.
   */
  obscureTextEmails?: boolean;
  /** Obscure all text nodes' numbers (default true). */
  obscureTextNumbers?: boolean;
  /** Obscure email inputs (default true). */
  obscureInputEmails?: boolean;
  /** Obscure numeric inputs (default true). */
  obscureInputNumbers?: boolean;
  /** Obscure date inputs (default true). */
  obscureInputDates?: boolean;
  /** Respect the browser's Do Not Track setting (default false). */
  respectDoNotTrack?: boolean;
  /**
   * Extra options passed straight through to the `new Tracker(...)` constructor,
   * merged last (lets an app set anything we don't surface explicitly).
   */
  trackerOptions?: Record<string, unknown>;
}

export interface OpenReplay {
  /** True once the tracker has been constructed and start() invoked. */
  readonly started: boolean;
  /** Associate the current replay with a user id + optional string metadata. */
  identify(userId: string, metadata?: Record<string, string>): void;
  /** Stop recording (best-effort). */
  stop(): void;
}

const DEFAULT_INGEST = 'https://openreplay.zeroo.ch/ingest';

// Module-level singleton so repeat init() calls (e.g. React StrictMode double
// invoke, or several apps importing the shared barrel) never start twice.
let tracker: TrackerLike | null = null;
let started = false;

const noopHandle: OpenReplay = {
  get started() {
    return started;
  },
  identify(userId, metadata) {
    identifyOpenReplayUser(userId, metadata);
  },
  stop() {
    stopOpenReplay();
  },
};

/**
 * Initialise and start the OpenReplay tracker exactly once.
 *
 * Safe no-op (never throws, returns a handle) when:
 *  - no `projectKey` is provided,
 *  - running outside a browser (SSR),
 *  - the `@openreplay/tracker` package isn't installed,
 *  - or the tracker fails to construct/start.
 *
 * Returns synchronously; the tracker loads + starts asynchronously in the
 * background. Use the returned handle (or the standalone functions) to identify
 * the user once auth resolves.
 */
export function initOpenReplay(options: OpenReplayOptions = {}): OpenReplay {
  if (started || tracker) return noopHandle;
  if (typeof window === 'undefined') return noopHandle; // SSR guard
  const projectKey = options.projectKey;
  if (!projectKey) return noopHandle; // disabled until a key is provided

  const ingestPoint = options.ingestPoint || DEFAULT_INGEST;

  // Variable specifier → bundlers keep this as a runtime/code-split import and
  // don't fail the build when the optional peer dep is absent.
  const trackerPkg = '@openreplay/tracker';

  void (async () => {
    try {
      const mod = (await import(/* @vite-ignore */ trackerPkg)) as {
        default: new (opts: Record<string, unknown>) => TrackerLike;
      };
      const Tracker = mod.default;
      const instance = new Tracker({
        projectKey,
        ingestPoint,
        obscureTextEmails: options.obscureTextEmails ?? true,
        obscureTextNumbers: options.obscureTextNumbers ?? true,
        obscureInputEmails: options.obscureInputEmails ?? true,
        obscureInputNumbers: options.obscureInputNumbers ?? true,
        obscureInputDates: options.obscureInputDates ?? true,
        respectDoNotTrack: options.respectDoNotTrack ?? false,
        ...(options.trackerOptions ?? {}),
      });
      tracker = instance;
      // start() can reject if the ingest endpoint is unreachable (e.g. before the
      // tunnel/DNS is live). Swallow it so it never surfaces as an unhandled
      // rejection that the suite-wide error logger would file as a false bug.
      await Promise.resolve(instance.start()).catch((err: unknown) => {
        console.warn('[openreplay] start failed', err);
      });
      started = true;
    } catch (err) {
      // Package missing or construction failed — stay disabled, never throw.
      console.warn('[openreplay] init skipped', err);
      tracker = null;
    }
  })();

  return noopHandle;
}

/**
 * Associate the current replay with an authenticated user (e.g. Zitadel email)
 * plus optional string metadata. Safe to call before init / before the tracker
 * has finished starting — no-ops until it's running.
 */
export function identifyOpenReplayUser(
  userId: string,
  metadata?: Record<string, string>,
): void {
  if (!tracker || !userId) return;
  try {
    tracker.setUserID(userId);
    if (metadata) {
      for (const [key, value] of Object.entries(metadata)) {
        tracker.setMetadata(key, value);
      }
    }
  } catch {
    /* no-op: never let telemetry break the app */
  }
}

/** Stop recording (best-effort). Safe to call when not started. */
export function stopOpenReplay(): void {
  try {
    tracker?.stop?.();
  } catch {
    /* no-op */
  }
}
