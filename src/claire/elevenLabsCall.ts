// Client helpers for Claire's voice-call mode (ElevenLabs Speech Engine).
//
// The actual mic/playback/turn-taking is owned by `@elevenlabs/client` and
// `Conversation.startSession`. These two helpers handle the two HTTP round
// trips the browser does around that session:
//
//   1. /api/claire-voice/token   — fetch a short-lived conversation token
//      from the host app's RES proxy (server-minted, API key never reaches
//      the browser).
//
//   2. /api/claire-voice/context — register the selected parcel's context
//      against the Speech Engine conversation id, so the project_RES
//      onTranscript handler can ground Gemini's answer in the right parcel.

import { VoiceConversation } from '@elevenlabs/client';

// Defensive monkey-patch for @elevenlabs/client@1.8.1 — its
// BaseConversation.handleErrorEvent reads `event.error_event.error_type`
// without a guard, so when the agent sends an "error" message in any shape
// other than `{type:"error", error_event:{...}}` the SDK throws an unhandled
// TypeError and never calls our `onError`. The UI then freezes while the
// LiveKit room disconnects in the background. We patch the prototype to:
//   (a) accept the documented nested shape unchanged,
//   (b) for any other shape, hand the raw payload to onError so the call UI
//       can surface what the server actually said, and end the session
//       cleanly instead of throwing.
// Remove once the SDK ships a fix upstream.
let voiceErrorEventPatched = false;
function patchVoiceErrorEvent(): void {
  if (voiceErrorEventPatched) return;
  const proto = Object.getPrototypeOf(
    VoiceConversation.prototype,
  ) as { handleErrorEvent?: (event: unknown) => void } | null;
  if (!proto || typeof proto.handleErrorEvent !== 'function') {
    voiceErrorEventPatched = true;
    return;
  }
  const original = proto.handleErrorEvent;
  proto.handleErrorEvent = function patchedHandleErrorEvent(
    this: {
      onError?: (msg: string, ctx?: unknown) => void;
      endSession?: () => Promise<unknown> | unknown;
    },
    event: unknown,
  ) {
    const e = event as { error_event?: unknown; message?: string } | null;
    if (e && typeof e === 'object' && e.error_event) {
      return original.call(this, event);
    }
    let summary = 'Voice agent error';
    try {
      summary = e?.message ? String(e.message) : JSON.stringify(event);
    } catch {
      /* JSON.stringify on circular payloads — keep default */
    }
    // eslint-disable-next-line no-console
    console.error('[claire-voice] malformed error event from agent:', event);
    try {
      this.onError?.(`Server error: ${summary}`, { rawEvent: event });
    } catch {
      /* host's onError shouldn't be able to break teardown */
    }
    try {
      void this.endSession?.();
    } catch {
      /* session may already be gone */
    }
  };
  voiceErrorEventPatched = true;
}
patchVoiceErrorEvent();

export async function fetchVoiceCallToken(signal?: AbortSignal): Promise<string> {
  const res = await fetch('/api/claire-voice/token', { signal });
  if (!res.ok) {
    let detail = `Token request failed (${res.status})`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body?.error) detail = body.error;
    } catch {
      /* keep status-code default */
    }
    throw new Error(detail);
  }
  const data = (await res.json()) as { token?: string };
  if (!data.token) throw new Error('Token endpoint returned no token.');
  return data.token;
}

export interface VoiceCallContextPayload {
  conversationId: string;
  context: string;
  appName: string;
  address?: string;
}

// Best-effort — a failed context registration just makes Claire less
// grounded; it must never break the live voice call.
export async function registerVoiceCallContext(
  payload: VoiceCallContextPayload,
  signal?: AbortSignal,
): Promise<void> {
  try {
    await fetch('/api/claire-voice/context', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal,
    });
  } catch {
    /* swallow */
  }
}
