import {
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import {
  AlertCircle,
  Loader2,
  Phone,
  PhoneOff,
  Send,
  Volume2,
  VolumeX,
  X,
  Zap,
} from 'lucide-react';
import {
  type ChatTurn,
  GeminiConfigError,
  buildParcelContextSummary,
  generateParcelChatReply,
} from './geminiClient';
import { synthesizeSpeech } from './elevenLabsClient';
import { startVoiceCall, type VoiceCallSession } from './voiceCall';
import { sendClaireMessageSignal } from './signal';
import { fetchClaireContext } from './claireContext';
import { fetchClairePOIs } from './clairePOIs';
import {
  loadClaireConversation,
  saveClaireConversation,
} from './claireConversation';
import { useAuth } from '../auth/AuthProvider';

// Claire's avatar — a self-contained blinking SVG, inlined as a data URI so
// the logo ships with this package (no per-app public/ asset needed). The
// CSS @keyframes blink animation runs inside the <img>.
const CLAIRE_SVG = `<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <style>
    .open-eyes { animation: openBlink 2.2s infinite; transform-origin: center; }
    .closed-eyes { animation: closedBlink 2.2s infinite; opacity: 0; }
    @keyframes openBlink { 0%, 78%, 100% { opacity: 1; } 82%, 88% { opacity: 0; } }
    @keyframes closedBlink { 0%, 78%, 100% { opacity: 0; } 82%, 88% { opacity: 1; } }
  </style>
  <path d="M91 98 C84 105 74 109 63 109 C38 109 18 89 18 64 C18 39 38 19 63 19 C88 19 108 39 108 64 L108 93 C108 102 112 107 118 108" fill="none" stroke="#141414" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"></path>
  <g class="open-eyes" fill="#141414">
    <circle cx="51" cy="58" r="4"></circle>
    <circle cx="77" cy="58" r="4"></circle>
  </g>
  <g class="closed-eyes" fill="none" stroke="#141414" stroke-width="4" stroke-linecap="round">
    <path d="M46 58 Q51 62 56 58"></path>
    <path d="M72 58 Q77 62 82 58"></path>
  </g>
  <path d="M56 75 Q64 82 72 75" fill="none" stroke="#141414" stroke-width="4" stroke-linecap="round"></path>
</svg>`;
const CLAIRE_AVATAR = `data:image/svg+xml,${encodeURIComponent(CLAIRE_SVG)}`;

export interface ClaireAssistantProps {
  /** App mounting Claire — feeds telemetry, persistence, and the prompt. */
  appName: string;
  /** Gemini API key, read by the app from its own VITE_GEMINI_API_KEY. */
  geminiApiKey?: string;
  /** Optional Gemini model override (defaults to gemini-3.1-flash-lite). */
  geminiModel?: string;
  /**
   * ElevenLabs API key — when supplied, Claire can speak her replies aloud
   * via text-to-speech. Read by the app from its own VITE_ELEVENLABS_API_KEY.
   * Omit it to keep Claire text-only (the speaker controls never render).
   */
  elevenLabsApiKey?: string;
  /** Optional ElevenLabs voice id (defaults to the "Sarah" preset voice). */
  elevenLabsVoiceId?: string;
  /** Optional ElevenLabs model override (defaults to eleven_turbo_v2_5). */
  elevenLabsModel?: string;
  /**
   * Enable Claire's full voice-call mode (Gemini Live via the project_RES
   * WebSocket bridge at wss://res.zeroo.ch/res_api/claire/voice/ws). When
   * true, a phone button in the header opens a live spoken conversation;
   * with this flag false (default) the button never renders. The host app
   * needs no proxies — the browser opens the WS directly.
   */
  voiceCallEnabled?: boolean;
  /**
   * @deprecated Accepted for backward compatibility but ignored. Claire now
   * renders one fixed look suite-wide (valoo's dark theme) so the widget is
   * visually consistent across every app, regardless of the host's theme.
   */
  darkMode?: boolean;
  properties: Record<string, unknown>;
  enrichment?: Record<string, unknown> | null;
  lngLat: { lng: number; lat: number };
  lv95?: { E: number; N: number } | null;
  headerAddress?: string;
}

interface ChatMessage extends ChatTurn {
  id: string;
  pending?: boolean;
  error?: boolean;
}

interface QuickPrompt {
  label: string;
  prompt: string;
}

const QUICK_PROMPTS: QuickPrompt[] = [
  {
    label: 'Investment potential',
    prompt: 'What is the estimated investment potential of this parcel?',
  },
  {
    label: 'Zoning restrictions',
    prompt: 'Summarize zoning restrictions for this property.',
  },
  {
    label: 'What can be built?',
    prompt: 'What can legally be built here?',
  },
  {
    label: 'Compare nearby',
    prompt: 'Compare this parcel with nearby properties.',
  },
  {
    label: 'Risks to know',
    prompt: 'What risks should I know about?',
  },
  {
    label: 'Redevelopment',
    prompt: 'Estimate redevelopment opportunities.',
  },
  {
    label: 'Market insights',
    prompt: 'Show market insights for this area.',
  },
];

function newId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// Picks a stable parcel identifier from the tile properties, falling back
// through the id keys different layers use.
function resolveParcelId(props: Record<string, unknown>): string | null {
  for (const key of ['parcel_id', 'egrid', 'id_parcel', 'id']) {
    const v = props[key];
    if (v !== undefined && v !== null && v !== '') return String(v);
  }
  return null;
}

// Minimal inline formatter: paragraphs, line breaks, and **bold**. Keeps
// rendering safe (no dangerouslySetInnerHTML) and lightweight.
function renderAssistantText(text: string): ReactNode {
  const paragraphs = text.split(/\n{2,}/);
  return paragraphs.map((para, pi) => (
    <p key={pi} className={pi === 0 ? '' : 'mt-2'}>
      {para.split(/\n/).map((line, li, arr) => (
        <span key={li}>
          {renderInlineBold(line)}
          {li < arr.length - 1 ? <br /> : null}
        </span>
      ))}
    </p>
  ));
}

function renderInlineBold(line: string): ReactNode {
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (/^\*\*[^*]+\*\*$/.test(p)) {
      return (
        <strong key={i} className="font-semibold">
          {p.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{p}</span>;
  });
}

/**
 * Claire — the SwissNovo AI parcel assistant. A floating launcher bubble that
 * expands into a chat card scoped to the selected parcel. Conversations are
 * persisted per signed-in user per parcel on the RES API.
 *
 * Each consuming app must:
 *  - expose an `/api/signal-collect` proxy,
 *  - pass its `VITE_GEMINI_API_KEY` as `geminiApiKey`,
 *  - be wrapped in this package's <AuthProvider>.
 * Optionally, passing `elevenLabsApiKey` unlocks Claire's voice: a speaker
 * toggle in the header (auto-speak replies) plus a per-message play button,
 * driven by ElevenLabs text-to-speech. Omit the key to keep her text-only.
 * The avatar is inlined — no per-app public/ asset is needed.
 */
const ClaireAssistant = ({
  appName,
  geminiApiKey,
  geminiModel,
  elevenLabsApiKey,
  elevenLabsVoiceId,
  elevenLabsModel,
  voiceCallEnabled = false,
  properties,
  enrichment,
  lngLat,
  lv95,
  headerAddress,
}: ClaireAssistantProps) => {
  // Claire renders one fixed look suite-wide — valoo's dark theme — so the
  // widget is identical across every app regardless of the host's light/dark
  // mode. The `darkMode` prop is accepted (back-compat) but intentionally
  // ignored; every `darkMode ? … : …` below resolves to the dark branch.
  const darkMode: boolean = true;

  // Floating widget: a launcher bubble that is always visible while a parcel
  // is selected, expanding into a free-floating chat card.
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Claire's voice (ElevenLabs TTS) — only wired when the host app supplies
  // an ElevenLabs key. `voiceEnabled` is the auto-speak toggle; `speakingId`
  // is the assistant message being synthesized or played; `speechReady`
  // flips true once its audio actually starts (spinner → stop icon).
  const voiceAvailable = useMemo(
    () => Boolean(elevenLabsApiKey),
    [elevenLabsApiKey],
  );
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [speechReady, setSpeechReady] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const speechAbortRef = useRef<AbortController | null>(null);
  const speakingIdRef = useRef<string | null>(null);
  const voiceEnabledRef = useRef(voiceEnabled);
  useEffect(() => {
    speakingIdRef.current = speakingId;
  }, [speakingId]);
  useEffect(() => {
    voiceEnabledRef.current = voiceEnabled;
  }, [voiceEnabled]);

  // Claire's voice-call mode (Gemini Live via the project_RES WS bridge).
  // The chat-card overlays a live-call UI while a call is active; mic,
  // playback and transport are owned by the shared `startVoiceCall`.
  type CallStatus = 'idle' | 'connecting' | 'connected' | 'ending';
  type CallMode = 'listening' | 'speaking' | null;
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [callMode, setCallMode] = useState<CallMode>(null);
  const [callError, setCallError] = useState<string | null>(null);
  // Voice transcripts (user STT + agent answer) surfaced in the call overlay
  // so the loop is visible even if audio playback fails (browser autoplay,
  // headphones unplugged, etc.). Cleared on call end and parcel change.
  const [voiceTurns, setVoiceTurns] = useState<
    { id: string; role: 'user' | 'agent'; text: string }[]
  >([]);
  const voiceTranscriptRef = useRef<HTMLDivElement>(null);
  const conversationRef = useRef<VoiceCallSession | null>(null);

  const { isAuthenticated, getAccessToken } = useAuth();

  const configured = useMemo(() => Boolean(geminiApiKey), [geminiApiKey]);

  const parcelId = useMemo(() => resolveParcelId(properties), [properties]);

  const parcelContext = useMemo(
    () =>
      buildParcelContextSummary({
        properties,
        enrichment: enrichment ?? null,
        lngLat,
        lv95: lv95 ?? null,
      }),
    [properties, enrichment, lngLat, lv95],
  );

  // Authoritative federal records (GWR building register, ARE zoning,
  // swisstopo locality) fetched live from geo.admin.ch and appended to the
  // parcel context — best-effort, so it never blocks or breaks the chat.
  // Also yields the GWR street address, used as a fallback when the host
  // app's tile data carries no address field.
  const [official, setOfficial] = useState<{ text: string; address?: string }>({
    text: '',
  });
  useEffect(() => {
    const controller = new AbortController();
    setOfficial({ text: '' });
    void fetchClaireContext(lngLat.lng, lngLat.lat, controller.signal)
      .then((res) => setOfficial(res))
      .catch(() => {});
    return () => controller.abort();
  }, [lngLat.lng, lngLat.lat]);

  // Surrounding OSM POIs (schools, transit, shops, etc.) fetched from the
  // host app's `/api/claire-pois` proxy → RES `/score/poi-osm` (local
  // PostGIS, refreshed monthly). Same best-effort policy: a missing proxy
  // or network error just yields no POI context, never an error.
  const [pois, setPois] = useState<string>('');
  useEffect(() => {
    const controller = new AbortController();
    setPois('');
    void fetchClairePOIs(lngLat.lng, lngLat.lat, controller.signal)
      .then((res) => setPois(res.text))
      .catch(() => {});
    return () => controller.abort();
  }, [lngLat.lng, lngLat.lat]);

  const fullContext = useMemo(
    () =>
      [parcelContext, official.text, pois].filter(Boolean).join('\n\n'),
    [parcelContext, official.text, pois],
  );

  // End any in-flight voice call cleanly.
  const endCall = useCallback(async () => {
    const conv = conversationRef.current;
    conversationRef.current = null;
    if (!conv) {
      setCallStatus('idle');
      setCallMode(null);
      return;
    }
    setCallStatus('ending');
    try {
      await conv.endSession();
    } catch {
      /* already gone */
    }
    setCallStatus('idle');
    setCallMode(null);
    setVoiceTurns([]);
  }, []);

  // Stop and fully tear down any in-flight or playing speech.
  const stopSpeech = useCallback(() => {
    speechAbortRef.current?.abort();
    speechAbortRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    setSpeakingId(null);
    setSpeechReady(false);
  }, []);

  // Reset conversation whenever the targeted parcel changes — the chat must
  // refresh its context to match the freshly selected parcel. Any live voice
  // call is hung up too: it was anchored to the previous parcel's context.
  useEffect(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    stopSpeech();
    void endCall();
    setMessages([]);
    setInput('');
    setError(null);
    setSpeechError(null);
    setCallError(null);
    setLoading(false);
  }, [lngLat.lng, lngLat.lat, stopSpeech, endCall]);

  // Restore this parcel's stored conversation for the signed-in user. Runs
  // after the reset effect above, so a saved thread re-populates the chat;
  // signed-out visitors or parcels with no history simply start fresh.
  useEffect(() => {
    if (!parcelId || !isAuthenticated) return;
    const token = getAccessToken();
    if (!token) return;
    let cancelled = false;
    setHistoryLoading(true);
    void loadClaireConversation(parcelId, token)
      .then((turns) => {
        if (cancelled || turns.length === 0) return;
        setMessages(
          turns.map((t) => ({ id: newId(), role: t.role, content: t.content })),
        );
      })
      .finally(() => {
        if (!cancelled) setHistoryLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [parcelId, isAuthenticated, getAccessToken]);

  useEffect(() => {
    if (!open || !scrollRef.current) return;
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, loading, open]);

  // Keep the voice-call transcript pinned to the most recent turn.
  useEffect(() => {
    if (voiceTranscriptRef.current) {
      voiceTranscriptRef.current.scrollTop =
        voiceTranscriptRef.current.scrollHeight;
    }
  }, [voiceTurns]);

  useEffect(
    () => () => {
      abortRef.current?.abort();
      stopSpeech();
      void endCall();
    },
    [stopSpeech, endCall],
  );

  // Speak one assistant message aloud via ElevenLabs. Clicking the speaker
  // on a message that is already active stops it (toggle). Failures surface
  // as a small non-blocking note — a broken voice never breaks the chat.
  const speakMessage = useCallback(
    async (id: string, text: string) => {
      if (!elevenLabsApiKey) return;
      if (speakingIdRef.current === id) {
        stopSpeech();
        return;
      }
      stopSpeech();
      const controller = new AbortController();
      speechAbortRef.current = controller;
      setSpeakingId(id);
      setSpeechReady(false);
      setSpeechError(null);
      try {
        const blob = await synthesizeSpeech({
          apiKey: elevenLabsApiKey,
          voiceId: elevenLabsVoiceId,
          model: elevenLabsModel,
          text,
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;
        const url = URL.createObjectURL(blob);
        audioUrlRef.current = url;
        const audio = new Audio(url);
        audioRef.current = audio;
        const clear = () => {
          if (speakingIdRef.current === id) stopSpeech();
        };
        audio.onended = clear;
        audio.onerror = clear;
        await audio.play();
        if (speakingIdRef.current === id) setSpeechReady(true);
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') return;
        setSpeechError(
          err instanceof Error ? err.message : 'Claire could not speak.',
        );
        setSpeakingId(null);
        setSpeechReady(false);
      }
    },
    [elevenLabsApiKey, elevenLabsVoiceId, elevenLabsModel, stopSpeech],
  );

  // Which Gemini Live model the currently-active (or last-started) call is
  // using. `null` when no call is active. The header re-renders the right
  // PhoneOff button on the matching control so the user knows which line
  // is open.
  const [activeCallKind, setActiveCallKind] = useState<
    'native-25' | 'live-31' | null
  >(null);

  // Open a live spoken conversation with Claire. The mic / playback /
  // transport are owned by `startVoiceCall`; this just orchestrates the
  // status machine and surfaces transcripts in the overlay. `kind` selects
  // which Gemini Live model to use (currently the default native-audio 2.5
  // pipeline or the newer 3.1 Live preview).
  const startCall = useCallback(
    async (kind: 'native-25' | 'live-31' = 'native-25') => {
      if (callStatus !== 'idle') return;
      setCallError(null);
      setCallStatus('connecting');
      setActiveCallKind(kind);
      const model =
        kind === 'live-31'
          ? 'gemini-3.1-flash-live-preview'
          : 'gemini-2.5-flash-native-audio-latest';
      try {
        // Read the page-level UI language so Gemini Live speaks back in the
        // same one. Defaults to German (suite default); the server clamps
        // anything unknown to de-DE so an unexpected tag never breaks the call.
        const language =
          (typeof document !== 'undefined' && document.documentElement.lang) ||
          'de';
        const conv = await startVoiceCall({
          appName,
          parcelContext: fullContext,
          address: headerAddress || official.address,
          language,
          model,
          onConnect: () => {
            setCallStatus('connected');
          },
          onDisconnect: () => {
            conversationRef.current = null;
            setCallStatus('idle');
            setCallMode(null);
            setActiveCallKind(null);
          },
          onModeChange: ({ mode }) => {
            if (mode === 'listening' || mode === 'speaking') {
              setCallMode(mode);
            }
          },
          onMessage: ({ message, role }) => {
            if (!message) return;
            setVoiceTurns((prev) => [
              ...prev,
              { id: newId(), role, text: message },
            ]);
          },
          onDebug: (info: unknown) => {
            // eslint-disable-next-line no-console
            console.log('[claire-voice]', info);
          },
          onError: (message) => {
            setCallError(message || 'Voice call failed.');
            conversationRef.current = null;
            setCallStatus('idle');
            setCallMode(null);
            setActiveCallKind(null);
          },
        });
        conversationRef.current = conv;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Could not start the call.';
        setCallError(msg);
        setCallStatus('idle');
        setCallMode(null);
        setActiveCallKind(null);
      }
    },
    [callStatus, fullContext, appName, headerAddress, official.address],
  );

  // Esc closes the floating card; focus the input when it opens.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 220);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(focusTimer);
    };
  }, [open]);

  const sendMessage = useCallback(
    async (text: string, source: 'composer' | 'quick_prompt' = 'composer') => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;
      if (!configured) {
        setError(
          'Gemini API key missing. Set VITE_GEMINI_API_KEY in the app’s .env file.',
        );
        return;
      }

      const userMsg: ChatMessage = {
        id: newId(),
        role: 'user',
        content: trimmed,
      };
      const nextHistory: ChatTurn[] = [
        ...messages.map(({ role, content }) => ({ role, content })),
        { role: 'user', content: trimmed },
      ];

      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setError(null);
      setLoading(true);

      // Address: prefer the host app's header address, fall back to the GWR
      // street address from the federal records fetch.
      const address = headerAddress || official.address;

      // Telemetry: one signal per Claire message, scoped to this parcel, so
      // the RES admin dashboard can count interactions per parcel. The RES
      // API resolves the canonical parcel (EGRID) from the coordinates.
      void sendClaireMessageSignal({
        appName,
        lat: lngLat.lat,
        lng: lngLat.lng,
        address,
        source,
      });

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const reply = await generateParcelChatReply({
          apiKey: geminiApiKey ?? '',
          model: geminiModel,
          appName,
          parcelContext: fullContext,
          history: nextHistory,
          signal: controller.signal,
        });
        const assistantId = newId();
        setMessages((prev) => [
          ...prev,
          { id: assistantId, role: 'assistant', content: reply },
        ]);

        // Auto-speak the reply when Claire's voice toggle is on.
        if (voiceEnabledRef.current) {
          void speakMessage(assistantId, reply);
        }

        // Persist the completed turn so revisiting this parcel restores the
        // conversation. Scoped per signed-in user; no-ops when signed out.
        if (parcelId) {
          void saveClaireConversation({
            parcelId,
            messages: [...nextHistory, { role: 'assistant', content: reply }],
            accessToken: getAccessToken(),
            appName,
            address,
            lat: lngLat.lat,
            lng: lngLat.lng,
          });
        }
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') return;
        const message =
          err instanceof GeminiConfigError
            ? err.message
            : err instanceof Error
              ? err.message
              : 'Something went wrong.';
        setError(message);
      } finally {
        setLoading(false);
        abortRef.current = null;
      }
    },
    [
      configured,
      loading,
      messages,
      fullContext,
      lngLat.lat,
      lngLat.lng,
      parcelId,
      headerAddress,
      official.address,
      getAccessToken,
      appName,
      geminiApiKey,
      geminiModel,
      speakMessage,
    ],
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  };

  const onQuickPrompt = (prompt: string) => {
    void sendMessage(prompt, 'quick_prompt');
    inputRef.current?.focus();
  };

  const sendDisabled = !input.trim() || loading;
  const showQuickPrompts =
    messages.length === 0 && !loading && !historyLoading;

  const subtitle = headerAddress ? `About ${headerAddress}` : 'Powered by Gemini';

  // A compact circular launcher anchored to the bottom-right corner. It may
  // overlap the parcel info panel — accepted for now per product direction.
  const launcherPos = 'right-6 bottom-6';
  const cardPos =
    'inset-x-3 top-20 bottom-3 ' +
    'md:inset-x-auto md:top-auto md:bottom-6 md:right-6 md:left-auto ' +
    'md:w-[23rem] md:h-auto md:max-h-[min(78vh,560px)]';

  const launcher = (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label="Open Claire, the AI parcel assistant"
      title="Ask Claire about this parcel"
      className={`fixed z-[60] ${launcherPos} group flex items-center justify-center w-14 h-14 rounded-full transition-all duration-200 active:scale-95 ${
        darkMode
          ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-[#1a0f00] shadow-[0_10px_30px_-8px_rgba(251,191,36,0.55)] hover:brightness-110'
          : 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-[0_10px_30px_-8px_rgba(251,146,60,0.6)] hover:brightness-105'
      }`}
    >
      <span className="absolute inset-0 rounded-full bg-amber-400/50 chat-launch-ping" />
      <img
        src={CLAIRE_AVATAR}
        alt=""
        className="relative w-full h-full rounded-full object-cover"
      />
    </button>
  );

  const card = (
    <div
      role="dialog"
      aria-label="Claire — AI Parcel Assistant"
      className={`fixed z-[60] ${cardPos} chat-card-pop flex flex-col overflow-hidden rounded-2xl ${
        darkMode
          ? 'bg-[#0b0f15] ring-1 ring-white/[0.08] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.85)]'
          : 'bg-white ring-1 ring-gray-200/90 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.4)]'
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center gap-3 px-3.5 py-3 shrink-0 ${
          darkMode
            ? 'bg-gradient-to-b from-white/[0.04] to-transparent border-b border-white/[0.06]'
            : 'bg-gradient-to-b from-gray-50/80 to-transparent border-b border-gray-200/70'
        }`}
      >
        <div
          className={`relative w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            darkMode
              ? 'bg-gradient-to-br from-amber-400/20 via-orange-500/15 to-rose-500/10 ring-1 ring-amber-300/20'
              : 'bg-gradient-to-br from-amber-100 via-orange-100 to-rose-100 ring-1 ring-amber-200/70'
          }`}
        >
          <img
            src={CLAIRE_AVATAR}
            alt="Claire"
            className="w-full h-full rounded-xl object-cover"
          />
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ring-2 ${
              darkMode
                ? 'bg-emerald-400 ring-[#0b0f15]'
                : 'bg-emerald-500 ring-white'
            }`}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div
            className={`text-[13px] font-semibold leading-tight ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            Claire
          </div>
          <div
            className={`text-[10.5px] font-medium uppercase tracking-[0.1em] mt-0.5 truncate ${
              darkMode ? 'text-amber-200/70' : 'text-amber-700/80'
            }`}
          >
            {subtitle}
          </div>
        </div>
        {voiceCallEnabled && (
          <>
            {/* Native Audio 2.5 — the original call button. */}
            <button
              type="button"
              onClick={() =>
                callStatus === 'idle'
                  ? void startCall('native-25')
                  : activeCallKind === 'native-25'
                    ? void endCall()
                    : undefined
              }
              disabled={
                callStatus === 'connecting' ||
                callStatus === 'ending' ||
                (callStatus !== 'idle' && activeCallKind !== 'native-25')
              }
              aria-label={
                callStatus === 'idle' || activeCallKind !== 'native-25'
                  ? 'Call Claire (Native Audio 2.5)'
                  : 'End call'
              }
              title={
                callStatus === 'idle'
                  ? 'Call Claire — Native Audio 2.5 (Aoede voice)'
                  : activeCallKind === 'native-25'
                    ? 'End the call'
                    : 'Another call is active'
              }
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                callStatus !== 'idle' && activeCallKind === 'native-25'
                  ? 'text-rose-200 bg-rose-500/15 ring-1 ring-rose-400/30 hover:bg-rose-500/25 disabled:opacity-60'
                  : 'text-gray-400 hover:text-emerald-300 hover:bg-emerald-400/10 disabled:opacity-40'
              }`}
            >
              {callStatus !== 'idle' && activeCallKind === 'native-25' ? (
                <PhoneOff size={15} />
              ) : (
                <Phone size={15} />
              )}
            </button>

            {/* Gemini 3.1 Flash Live preview — newer, latency-optimised. */}
            <button
              type="button"
              onClick={() =>
                callStatus === 'idle'
                  ? void startCall('live-31')
                  : activeCallKind === 'live-31'
                    ? void endCall()
                    : undefined
              }
              disabled={
                callStatus === 'connecting' ||
                callStatus === 'ending' ||
                (callStatus !== 'idle' && activeCallKind !== 'live-31')
              }
              aria-label={
                callStatus === 'idle' || activeCallKind !== 'live-31'
                  ? 'Call Claire (Gemini 3.1 Live)'
                  : 'End call'
              }
              title={
                callStatus === 'idle'
                  ? 'Call Claire — Gemini 3.1 Flash Live preview (lower latency)'
                  : activeCallKind === 'live-31'
                    ? 'End the call'
                    : 'Another call is active'
              }
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                callStatus !== 'idle' && activeCallKind === 'live-31'
                  ? 'text-rose-200 bg-rose-500/15 ring-1 ring-rose-400/30 hover:bg-rose-500/25 disabled:opacity-60'
                  : 'text-gray-400 hover:text-sky-300 hover:bg-sky-400/10 disabled:opacity-40'
              }`}
            >
              {callStatus !== 'idle' && activeCallKind === 'live-31' ? (
                <PhoneOff size={15} />
              ) : (
                <Zap size={15} />
              )}
            </button>
          </>
        )}
        {voiceAvailable && (
          <button
            type="button"
            onClick={() =>
              setVoiceEnabled((v) => {
                if (v) stopSpeech();
                return !v;
              })
            }
            aria-pressed={voiceEnabled}
            aria-label={voiceEnabled ? 'Mute Claire' : 'Let Claire speak'}
            title={
              voiceEnabled
                ? 'Claire speaks her replies aloud — click to mute'
                : 'Hear Claire speak her replies'
            }
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
              voiceEnabled
                ? 'text-amber-300 bg-amber-400/15 ring-1 ring-amber-300/25'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            {voiceEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>
        )}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close Claire"
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
            darkMode
              ? 'text-gray-400 hover:text-white hover:bg-white/[0.08]'
              : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          <X size={16} />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="chat-scroll flex-1 md:flex-none md:max-h-[340px] overflow-y-auto px-3.5 py-3 space-y-2"
        aria-live="polite"
      >
        {messages.length === 0 && historyLoading && (
          <div
            className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-[12px] ${
              darkMode
                ? 'bg-white/[0.025] text-gray-400 ring-1 ring-white/[0.04]'
                : 'bg-gray-50 text-gray-500 ring-1 ring-gray-200/70'
            }`}
          >
            <Loader2 size={13} className="animate-spin shrink-0" />
            Restoring your conversation about this parcel…
          </div>
        )}

        {messages.length === 0 && !historyLoading && (
          <div
            className={`rounded-xl px-3 py-2.5 text-[12px] leading-relaxed ${
              darkMode
                ? 'bg-white/[0.025] text-gray-300 ring-1 ring-white/[0.04]'
                : 'bg-gray-50 text-gray-600 ring-1 ring-gray-200/70'
            }`}
          >
            Hi, I’m Claire. Ask me anything about this parcel — zoning, value,
            what can be built, comparable properties, or hidden risks. My
            answers are scoped to the selection on the map.
          </div>
        )}

        {messages.map((msg) =>
          msg.role === 'user' ? (
            <div key={msg.id} className="flex justify-end">
              <div
                className={`max-w-[88%] rounded-2xl rounded-tr-md px-3 py-2 text-[12.5px] leading-relaxed whitespace-pre-wrap ${
                  darkMode
                    ? 'bg-amber-400/15 text-amber-50 ring-1 ring-amber-300/20'
                    : 'bg-amber-50 text-amber-900 ring-1 ring-amber-200/80'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ) : (
            <div key={msg.id} className="flex items-start gap-2">
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  darkMode
                    ? 'bg-gradient-to-br from-amber-400/25 to-rose-500/15 ring-1 ring-amber-300/20'
                    : 'bg-gradient-to-br from-amber-100 to-rose-100 ring-1 ring-amber-200/70'
                }`}
              >
                <img
                  src={CLAIRE_AVATAR}
                  alt=""
                  className="w-full h-full rounded-lg object-cover"
                />
              </div>
              <div className="flex flex-col items-start gap-1 max-w-[88%]">
                <div
                  className={`rounded-2xl rounded-tl-md px-3 py-2 text-[12.5px] leading-relaxed ${
                    darkMode
                      ? 'bg-white/[0.04] text-gray-100 ring-1 ring-white/[0.05]'
                      : 'bg-gray-50 text-gray-800 ring-1 ring-gray-200/70'
                  }`}
                >
                  {renderAssistantText(msg.content)}
                </div>
                {voiceAvailable && (
                  <button
                    type="button"
                    onClick={() => void speakMessage(msg.id, msg.content)}
                    aria-label={
                      speakingId === msg.id
                        ? 'Stop Claire speaking'
                        : 'Play this reply aloud'
                    }
                    title={
                      speakingId === msg.id ? 'Stop' : 'Hear this reply'
                    }
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium text-gray-500 hover:text-amber-200 hover:bg-white/[0.05] transition-colors"
                  >
                    {speakingId === msg.id ? (
                      speechReady ? (
                        <>
                          <VolumeX size={11} />
                          Stop
                        </>
                      ) : (
                        <>
                          <Loader2 size={11} className="animate-spin" />
                          Loading…
                        </>
                      )
                    ) : (
                      <>
                        <Volume2 size={11} />
                        Play
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ),
        )}

        {loading && (
          <div className="flex items-start gap-2">
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                darkMode
                  ? 'bg-gradient-to-br from-amber-400/25 to-rose-500/15 ring-1 ring-amber-300/20'
                  : 'bg-gradient-to-br from-amber-100 to-rose-100 ring-1 ring-amber-200/70'
              }`}
            >
              <img
                src={CLAIRE_AVATAR}
                alt=""
                className="w-full h-full rounded-lg object-cover animate-pulse"
              />
            </div>
            <div
              className={`rounded-2xl rounded-tl-md px-3 py-2.5 flex items-center gap-1.5 ${
                darkMode
                  ? 'bg-white/[0.04] ring-1 ring-white/[0.05]'
                  : 'bg-gray-50 ring-1 ring-gray-200/70'
              }`}
              aria-label="Claire is typing"
            >
              <span className="chat-dot" />
              <span className="chat-dot" style={{ animationDelay: '0.15s' }} />
              <span className="chat-dot" style={{ animationDelay: '0.3s' }} />
            </div>
          </div>
        )}

        {error && (
          <div
            className={`flex items-start gap-2 rounded-xl px-3 py-2 text-[12px] ${
              darkMode
                ? 'bg-rose-500/10 text-rose-200 ring-1 ring-rose-400/20'
                : 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
            }`}
          >
            <AlertCircle size={13} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {speechError && (
          <div className="flex items-start gap-2 rounded-xl px-3 py-2 text-[11.5px] bg-amber-500/10 text-amber-200/90 ring-1 ring-amber-400/20">
            <VolumeX size={12} className="shrink-0 mt-0.5" />
            <span>Claire’s voice is unavailable: {speechError}</span>
          </div>
        )}

        {callError && callStatus === 'idle' && (
          <div className="flex items-start gap-2 rounded-xl px-3 py-2 text-[11.5px] bg-rose-500/10 text-rose-200/90 ring-1 ring-rose-400/20">
            <PhoneOff size={12} className="shrink-0 mt-0.5" />
            <span>Voice call ended: {callError}</span>
          </div>
        )}
      </div>

      {/* Composer */}
      <div
        className={`shrink-0 px-3.5 pt-2.5 pb-3 ${
          darkMode
            ? 'border-t border-white/[0.06] bg-gradient-to-t from-white/[0.025] to-transparent'
            : 'border-t border-gray-200/70 bg-gradient-to-t from-gray-50/70 to-transparent'
        }`}
      >
        {showQuickPrompts && (
          <div className="mb-2.5 flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((q) => (
              <button
                key={q.label}
                type="button"
                onClick={() => onQuickPrompt(q.prompt)}
                title={q.prompt}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-full transition-all duration-150 ${
                  darkMode
                    ? 'bg-white/[0.04] text-gray-200 ring-1 ring-white/[0.06] hover:bg-amber-400/10 hover:text-amber-200 hover:ring-amber-300/30'
                    : 'bg-white text-gray-700 ring-1 ring-gray-200/80 hover:bg-amber-50 hover:text-amber-700 hover:ring-amber-200'
                }`}
              >
                {q.label}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div
            className={`flex items-end gap-1.5 rounded-xl px-2.5 py-1.5 transition-all duration-150 focus-within:ring-2 ${
              darkMode
                ? 'bg-white/[0.04] ring-1 ring-white/[0.06] focus-within:ring-amber-400/40'
                : 'bg-white ring-1 ring-gray-200/80 focus-within:ring-amber-300'
            }`}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask Claire about this parcel..."
              rows={1}
              className={`flex-1 resize-none bg-transparent outline-none text-[12.5px] leading-snug py-1.5 max-h-24 ${
                darkMode
                  ? 'text-gray-100 placeholder:text-gray-500'
                  : 'text-gray-900 placeholder:text-gray-400'
              }`}
            />
            <button
              type="submit"
              disabled={sendDisabled}
              aria-label="Send message"
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-150 ${
                sendDisabled
                  ? darkMode
                    ? 'bg-white/[0.04] text-gray-600 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-br from-amber-400 to-orange-500 text-white hover:brightness-105 shadow-[0_4px_12px_-4px_rgba(251,191,36,0.5)]'
              }`}
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Send size={13} />
              )}
            </button>
          </div>
          <div
            className={`mt-1.5 text-[10px] tracking-wide ${
              darkMode ? 'text-gray-500' : 'text-gray-400'
            }`}
          >
            Enter to send · Shift+Enter for newline
          </div>
        </form>
      </div>

      {/* Live voice-call overlay — covers the messages + composer while a
          spoken conversation is active, leaving the header (with the End
          Call button) reachable. */}
      {callStatus !== 'idle' && (
        <div className="absolute inset-x-0 bottom-0 top-[58px] flex flex-col items-center justify-center px-4 bg-[#0b0f15]/95 backdrop-blur-sm">
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-br from-amber-400/25 to-rose-500/15 ring-1 ring-amber-300/30 transition-transform ${
              callMode === 'speaking' ? 'scale-105 animate-pulse' : ''
            }`}
          >
            <img
              src={CLAIRE_AVATAR}
              alt=""
              className="w-full h-full rounded-2xl object-cover"
            />
          </div>
          <div className="mt-4 text-sm font-semibold text-white">
            {callStatus === 'connecting'
              ? 'Calling Claire…'
              : callStatus === 'ending'
                ? 'Ending call…'
                : callMode === 'speaking'
                  ? 'Claire is speaking'
                  : 'Listening…'}
          </div>
          <div className="mt-1 text-[11px] text-amber-200/70 min-h-[14px]">
            {callStatus === 'connected'
              ? 'Speak naturally — this is a live voice call.'
              : ' '}
          </div>
          {/* Live transcript — STT + agent reply. Always shown so the loop
              is visible even if audio playback fails (autoplay block etc.). */}
          {voiceTurns.length > 0 && (
            <div
              ref={voiceTranscriptRef}
              className="mt-4 w-full max-w-[22rem] max-h-[12rem] overflow-y-auto px-3 py-2 rounded-lg bg-white/[0.04] ring-1 ring-white/[0.06] text-[12px] leading-snug text-left space-y-1.5"
            >
              {voiceTurns.map((t) => (
                <div
                  key={t.id}
                  className={
                    t.role === 'user' ? 'text-amber-200/90' : 'text-gray-100'
                  }
                >
                  <span className="font-semibold mr-1">
                    {t.role === 'user' ? 'You:' : 'Claire:'}
                  </span>
                  {t.text}
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => void endCall()}
            disabled={callStatus === 'connecting' || callStatus === 'ending'}
            className="mt-5 inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[12px] font-semibold text-white bg-rose-500 hover:bg-rose-400 disabled:opacity-60 transition-colors shadow-[0_4px_12px_-4px_rgba(244,63,94,0.6)]"
          >
            <PhoneOff size={13} /> End call
          </button>
          {callError && (
            <div className="mt-3 text-[11px] text-rose-300 text-center max-w-[18rem]">
              {callError}
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Portaled to <body> so the fixed positioning escapes the parcel panel's
  // transformed (translate-*) container, which would otherwise clip it.
  return createPortal(
    <>
      {open ? card : launcher}
      <style>{`
        .chat-scroll::-webkit-scrollbar { width: 3px; }
        .chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .chat-scroll::-webkit-scrollbar-thumb {
          background: ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'};
          border-radius: 4px;
        }
        .chat-dot {
          width: 5px;
          height: 5px;
          border-radius: 9999px;
          background: ${darkMode ? 'rgba(251,191,36,0.85)' : 'rgba(217,119,6,0.7)'};
          display: inline-block;
          animation: chatDot 1.1s infinite ease-in-out;
        }
        @keyframes chatDot {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-3px); opacity: 1; }
        }
        .chat-launch-ping {
          animation: chatLaunchPing 2.4s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes chatLaunchPing {
          0% { transform: scale(1); opacity: 0.6; }
          70%, 100% { transform: scale(2); opacity: 0; }
        }
        .chat-card-pop {
          animation: chatCardPop 0.22s cubic-bezier(0.16, 1, 0.3, 1) both;
          transform-origin: bottom right;
        }
        @keyframes chatCardPop {
          from { opacity: 0; transform: translateY(12px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>,
    document.body,
  );
};

export default ClaireAssistant;
