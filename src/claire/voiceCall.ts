// Browser client for Claire's voice-call mode (Gemini Live, via the
// project_RES WebSocket bridge at /res_api/claire/voice/ws).
//
// The public surface deliberately mirrors the subset of the ElevenLabs
// `Conversation.startSession()` API that ClaireAssistant.tsx used to consume,
// so the swap is a near-zero change at the call site:
//
//   const session = await startVoiceCall({
//       appName, parcelContext, address, language,
//       onConnect, onDisconnect, onModeChange, onMessage, onError, onDebug,
//   });
//   // ... later
//   await session.endSession();
//
// All audio I/O happens through two small AudioWorklets (mic capture at
// 16 kHz, speaker playback at 24 kHz — matching Gemini Live's wire rates).
// No third-party audio SDK; no token round-trip; the parcel context travels
// in the WS setup frame.

import { MIC_WORKLET_SOURCE, SPEAKER_WORKLET_SOURCE } from './voiceWorklets';

// Default points at the production RES voice bridge. Consumers may override
// (e.g. for a local RES on http://localhost:3000/res_api/claire/voice/ws via
// ws://, or a staging host).
const DEFAULT_WS_URL = 'wss://res.zeroo.ch/res_api/claire/voice/ws';

const MIC_BUFFER_SIZE = 1600; // 100 ms at 16 kHz
const MIC_SAMPLE_RATE = 16000;
const SPEAKER_SAMPLE_RATE = 24000;

export type CallMode = 'listening' | 'speaking';
export type CallRole = 'user' | 'agent';

export interface VoiceCallCallbacks {
    /** Fired once the upstream voice session is ready to accept audio. */
    onConnect?: (info: { conversationId: string }) => void;
    /** Fired once the session has fully torn down (for any reason). */
    onDisconnect?: () => void;
    /** Fired when Claire transitions between listening / speaking states. */
    onModeChange?: (info: { mode: CallMode }) => void;
    /** Fired with each transcript chunk (user STT or agent TTS). */
    onMessage?: (info: { role: CallRole; message: string }) => void;
    /** Fired when the user interrupted Claire — buffered speech is dropped. */
    onInterrupted?: () => void;
    /** Fired with a human-readable failure message; call also tears down. */
    onError?: (message: string) => void;
    /** Free-form diagnostic events for the host app's console / telemetry. */
    onDebug?: (info: unknown) => void;
}

export interface StartVoiceCallOptions extends VoiceCallCallbacks {
    /** Name of the app mounting Claire (e.g. "valoo"). Used in the prompt. */
    appName: string;
    /** Selected-parcel context string Claire should ground her answers in. */
    parcelContext: string;
    /** Optional street address — used to title the call in Claire's prompt. */
    address?: string;
    /** UI locale — maps to Gemini Live's language_code (de / en / fr / it). */
    language?: string;
    /** Override the WebSocket endpoint; defaults to the prod RES bridge. */
    wsUrl?: string;
}

export interface VoiceCallSession {
    /** Locally generated id, useful for telemetry / log correlation. */
    conversationId: string;
    /** Hang up the call and release mic + audio contexts. Idempotent. */
    endSession: () => Promise<void>;
}

function generateConversationId(): string {
    const c = typeof globalThis !== 'undefined' ? globalThis.crypto : undefined;
    if (c && typeof (c as { randomUUID?: () => string }).randomUUID === 'function') {
        return (c as { randomUUID: () => string }).randomUUID();
    }
    return `cv_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

async function registerWorklet(
    ctx: AudioContext,
    source: string,
): Promise<void> {
    const blob = new Blob([source], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    try {
        await ctx.audioWorklet.addModule(url);
    } finally {
        URL.revokeObjectURL(url);
    }
}

export async function startVoiceCall(
    options: StartVoiceCallOptions,
): Promise<VoiceCallSession> {
    const conversationId = generateConversationId();
    const wsUrl = options.wsUrl || DEFAULT_WS_URL;

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        throw new Error('Voice calls require a browser with mic support.');
    }

    let stream: MediaStream;
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                channelCount: 1,
                sampleRate: MIC_SAMPLE_RATE,
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
            },
        });
    } catch {
        throw new Error('Microphone permission was denied or unavailable.');
    }

    // Two AudioContexts at the exact rates Gemini Live uses. Skipping
    // resampling keeps the worklets trivial and the audio cleaner. Browsers
    // that ignore the requested rate (rare today) will sound slightly off
    // but won't fail to start.
    const AudioCtor: typeof AudioContext =
        (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext })
            .AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
    if (!AudioCtor) {
        stream.getTracks().forEach((t) => t.stop());
        throw new Error('Voice calls require AudioContext support.');
    }

    const micCtx = new AudioCtor({ sampleRate: MIC_SAMPLE_RATE });
    const playCtx = new AudioCtor({ sampleRate: SPEAKER_SAMPLE_RATE });

    try {
        await Promise.all([
            registerWorklet(micCtx, MIC_WORKLET_SOURCE),
            registerWorklet(playCtx, SPEAKER_WORKLET_SOURCE),
        ]);
    } catch (err) {
        stream.getTracks().forEach((t) => t.stop());
        await micCtx.close().catch(() => {});
        await playCtx.close().catch(() => {});
        throw new Error(
            err instanceof Error
                ? `Could not initialise audio worklets: ${err.message}`
                : 'Could not initialise audio worklets.',
        );
    }

    // Some browsers create AudioContexts in 'suspended' state outside a user
    // gesture. The call is always started by a click, so resuming succeeds.
    await Promise.all([
        micCtx.state === 'suspended' ? micCtx.resume() : Promise.resolve(),
        playCtx.state === 'suspended' ? playCtx.resume() : Promise.resolve(),
    ]);

    const speakerNode = new AudioWorkletNode(playCtx, 'claire-speaker-processor');
    speakerNode.connect(playCtx.destination);

    const micSource = micCtx.createMediaStreamSource(stream);
    const micNode = new AudioWorkletNode(micCtx, 'claire-mic-processor', {
        processorOptions: { bufferSize: MIC_BUFFER_SIZE },
    });
    micSource.connect(micNode);
    // Intentionally not connecting micNode to micCtx.destination — that would
    // route the user's voice back to their own speakers (loop / echo).

    let closed = false;
    let teardownPromise: Promise<void> | null = null;

    const ws = new WebSocket(wsUrl);
    ws.binaryType = 'arraybuffer';

    micNode.port.onmessage = (event) => {
        if (closed || ws.readyState !== WebSocket.OPEN) return;
        const samples = event.data as Int16Array | undefined;
        if (!samples || samples.length === 0) return;
        try {
            ws.send(samples.buffer);
        } catch {
            /* socket closing — next loop will detect */
        }
    };

    function teardown(): Promise<void> {
        if (teardownPromise) return teardownPromise;
        teardownPromise = (async () => {
            closed = true;
            try { micNode.port.onmessage = null; } catch { /* noop */ }
            try { micNode.disconnect(); } catch { /* noop */ }
            try { micSource.disconnect(); } catch { /* noop */ }
            try { speakerNode.port.postMessage({ type: 'clear' }); } catch { /* noop */ }
            try { speakerNode.disconnect(); } catch { /* noop */ }
            try { stream.getTracks().forEach((t) => t.stop()); } catch { /* noop */ }
            try {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ type: 'end' }));
                }
            } catch { /* noop */ }
            try { ws.close(); } catch { /* noop */ }
            await micCtx.close().catch(() => {});
            await playCtx.close().catch(() => {});
            options.onDisconnect?.();
        })();
        return teardownPromise;
    }

    ws.addEventListener('open', () => {
        try {
            ws.send(
                JSON.stringify({
                    type: 'setup',
                    conversationId,
                    appName: options.appName,
                    language: (options.language || 'de').toLowerCase(),
                    address: options.address || '',
                    parcelContext: options.parcelContext || '',
                }),
            );
            options.onDebug?.({ type: 'setup_sent', conversationId });
        } catch {
            options.onError?.('Failed to send setup frame.');
            void teardown();
        }
    });

    ws.addEventListener('message', (event) => {
        if (closed) return;
        if (typeof event.data === 'string') {
            let msg: Record<string, unknown>;
            try {
                msg = JSON.parse(event.data) as Record<string, unknown>;
            } catch {
                return;
            }
            const type = msg.type;
            if (type === 'connected') {
                options.onConnect?.({ conversationId });
            } else if (type === 'mode') {
                const mode = msg.mode;
                if (mode === 'listening' || mode === 'speaking') {
                    options.onModeChange?.({ mode });
                }
            } else if (type === 'transcript') {
                const role = msg.role;
                const text = msg.text;
                if (
                    (role === 'user' || role === 'agent') &&
                    typeof text === 'string'
                ) {
                    options.onMessage?.({ role, message: text });
                }
            } else if (type === 'interrupted') {
                try { speakerNode.port.postMessage({ type: 'clear' }); } catch { /* noop */ }
                options.onInterrupted?.();
            } else if (type === 'error') {
                options.onError?.(
                    typeof msg.message === 'string' ? msg.message : 'Voice call error.',
                );
                void teardown();
            } else if (type === 'closed') {
                options.onDebug?.({ type: 'closed', reason: msg.reason });
                void teardown();
            }
        } else if (event.data instanceof ArrayBuffer) {
            const samples = new Int16Array(event.data);
            try {
                speakerNode.port.postMessage({ type: 'audio', samples });
            } catch {
                /* worklet may have torn down */
            }
        }
    });

    ws.addEventListener('close', () => {
        if (!closed) void teardown();
    });

    ws.addEventListener('error', () => {
        if (!closed) {
            options.onError?.('Voice connection failed.');
            void teardown();
        }
    });

    return {
        conversationId,
        async endSession() {
            await teardown();
        },
    };
}
