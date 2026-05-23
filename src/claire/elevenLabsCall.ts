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
