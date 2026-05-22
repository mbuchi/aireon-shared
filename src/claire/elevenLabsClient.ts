// Lightweight client for ElevenLabs' Text-to-Speech API — it gives Claire a
// spoken voice. The API key, voice and model are supplied by the consuming
// app (read from its own Vite env) so the shared package stays config-free,
// exactly like the Gemini client. When no key is supplied the voice feature
// is simply absent — Claire stays a text-only assistant.

// `eleven_turbo_v2_5` — low-latency multilingual model (auto-detects the
// reply language, so Claire speaks French answers in French etc.). Quality
// is high enough for a chat assistant while keeping time-to-first-audio
// short; apps may override via the elevenLabsModel prop.
const DEFAULT_TTS_MODEL = 'eleven_turbo_v2_5';

// "Rachel" — a calm, professional ElevenLabs preset voice. A sensible
// default for Claire; apps may override via the elevenLabsVoiceId prop.
const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM';

const TTS_ENDPOINT = (voiceId: string) =>
  `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`;

export class ElevenLabsConfigError extends Error {
  constructor() {
    super('ElevenLabs API key missing — Claire’s voice is disabled.');
    this.name = 'ElevenLabsConfigError';
  }
}

export interface SpeechOptions {
  /** ElevenLabs API key — supplied by the consuming app from its Vite env. */
  apiKey: string;
  /** Voice id; defaults to the "Rachel" preset. */
  voiceId?: string;
  /** Model id; defaults to eleven_turbo_v2_5. */
  model?: string;
  /** The assistant text to speak (markdown is flattened before synthesis). */
  text: string;
  signal?: AbortSignal;
}

// Claire's replies carry light markdown — **bold**, "- " bullet lines,
// `code`, and blank-line paragraphs. Spoken verbatim these become "asterisk
// asterisk" etc., so flatten the text to clean prose before synthesis.
export function plainSpeechText(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1') // **bold** -> bold
    .replace(/`([^`]+)`/g, '$1') // `code` -> code
    .replace(/^\s*[-*]\s+/gm, '') // strip bullet markers
    .replace(/\n{2,}/g, '. ') // paragraph breaks -> sentence stop
    .replace(/\n/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Synthesize speech for one Claire reply, returning an MP3 blob the caller
 * can play via an <audio> element. Throws ElevenLabsConfigError when no key
 * is configured, or a plain Error with the ElevenLabs message on failure.
 */
export async function synthesizeSpeech({
  apiKey,
  voiceId,
  model,
  text,
  signal,
}: SpeechOptions): Promise<Blob> {
  if (!apiKey) throw new ElevenLabsConfigError();

  const clean = plainSpeechText(text);
  if (!clean) throw new Error('Nothing to speak.');

  const res = await fetch(TTS_ENDPOINT(voiceId || DEFAULT_VOICE_ID), {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text: clean,
      model_id: model || DEFAULT_TTS_MODEL,
      // Balanced settings: stable enough for an informational assistant,
      // with a touch of expressiveness so Claire doesn't sound robotic.
      voice_settings: {
        stability: 0.45,
        similarity_boost: 0.8,
        style: 0.1,
        use_speaker_boost: true,
      },
    }),
    signal,
  });

  if (!res.ok) {
    let detail = `ElevenLabs request failed (${res.status})`;
    try {
      const err = (await res.json()) as {
        detail?: string | { message?: string };
      };
      const d = err?.detail;
      if (typeof d === 'string') detail = d;
      else if (d?.message) detail = d.message;
    } catch {
      /* keep the status-code default */
    }
    throw new Error(detail);
  }

  return res.blob();
}
