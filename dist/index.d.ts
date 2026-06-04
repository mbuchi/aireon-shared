import * as react from 'react';
import { ReactNode, MutableRefObject, Component, ErrorInfo, ImgHTMLAttributes, CSSProperties, ElementType } from 'react';
import { LucideIcon } from 'lucide-react';
import * as react_jsx_runtime from 'react/jsx-runtime';
import { User, UserManager } from 'oidc-client-ts';
export { Coordinates, GeoJSONFeatureCollection, JsonError, ParcelTree, PoiDetail, RES_API_BASE_URL, ResApiClient, ResApiClientOptions, SignalRecord, SwissnovoImage, components, createResApiClient, operations, paths } from './api/index.js';
export { GEMINI_FALLBACK_CHAIN, GeminiFallbackAttempt, GeminiFallbackOptions, GeminiFallbackResult, buildGeminiModelChain, fetchGeminiWithFallback, isRetriableGeminiStatus } from './gemini/index.js';
import { RowData, ColumnDef } from '@tanstack/react-table';
export { CellContext, ColumnDef, Row, createColumnHelper, flexRender } from '@tanstack/react-table';
import 'openapi-fetch';

type ChangeKind = 'new' | 'improved' | 'fixed' | 'breaking' | 'docs';
interface ChangeItem {
    kind: ChangeKind;
    icon: LucideIcon;
    text: string;
    /** Related PR numbers. Optional — not every change maps to a PR. */
    prs?: number[];
}
interface Release {
    version: string;
    date: string;
    codename: string;
    summary: string;
    highlight?: boolean;
    items: ChangeItem[];
}
declare const KIND_META: Record<ChangeKind, {
    label: string;
    classes: string;
    dot: string;
}>;

/** Languages supported across the SwissNovo suite. */
type Locale$2 = 'de' | 'en' | 'fr' | 'it';
interface ReleaseNotesStrings {
    /** Panel <h1>, followed by the brand wordmark. */
    whatsNewIn: string;
    /** Subtitle lead-in, followed by "vX · codename · date". */
    subtitleLead: string;
    /** Suffix on the pulsing "vX <live>" badge. */
    live: string;
    /** "{n} releases" badge. */
    releases: string;
    /** "{n} changes" badge. */
    changes: string;
    /** Link to the repo's pull-request list. */
    viewAllPRs: string;
    /** Search input placeholder. */
    searchPlaceholder: string;
    /** "All" filter chip. */
    filterAll: string;
    /** Empty-state when a filter/search matches nothing. */
    noMatch: string;
    /** "Latest" badge on the newest release. */
    latest: string;
    /** Singular / plural noun for the per-release change count. */
    change: string;
    changesPlural: string;
    /** Footer sentence, split around the linked "SemVer" word. */
    footerPre: string;
    footerPost: string;
    /** Footer dismiss button + close-icon aria-label. */
    close: string;
    /** Dialog aria-label. */
    dialogLabel: string;
    /** Button tooltip / aria-label lead-in, followed by " — vX". */
    whatsNew: string;
    /** Change-kind labels (badges + filter chips). */
    kind: Record<ChangeKind, string>;
}
declare const RELEASE_NOTES_STRINGS: Record<Locale$2, ReleaseNotesStrings>;
declare const getReleaseNotesStrings: (locale?: Locale$2) => ReleaseNotesStrings;

interface ReleaseNotesPanelProps {
    /** Called when the panel finishes its close animation. */
    onClose: () => void;
    /** UI language for the panel chrome. Defaults to English. */
    locale?: Locale$2;
    /** The app's release history, newest first. */
    releases: Release[];
    /** GitHub repo URL, used to link PRs (e.g. https://github.com/mbuchi/boom). */
    repoUrl: string;
    /** Brand name letters before the red "oo" (e.g. "b" for boom). Ignored if brandNode is set. */
    brandPrefix?: string;
    /** Brand name letters after the red "oo" (e.g. "m" for boom). Ignored if brandNode is set. */
    brandSuffix?: string;
    /** Full custom wordmark, for brands the prefix/oo/suffix split can't express (e.g. toolbox's two red "oo"s). Overrides brandPrefix/brandSuffix. */
    brandNode?: ReactNode;
    /** Stacking context for the overlay. Defaults to the top of the stack so the panel always sits above app chrome (navbars, dropdowns). */
    zIndex?: number;
    /** Optional ref the panel populates with its animated-close handler, so the trigger can dismiss the panel. */
    closeRef?: MutableRefObject<(() => void) | null>;
}
declare function ReleaseNotesPanel({ onClose, locale, releases, repoUrl, brandPrefix, brandSuffix, brandNode, zIndex, closeRef, }: ReleaseNotesPanelProps): react.ReactPortal;

interface ReleaseNotesButtonProps {
    /** The app's release history, newest first. */
    releases: Release[];
    /** UI language for the button + panel chrome. Defaults to English. */
    locale?: Locale$2;
    /** localStorage key for unread tracking — namespace per app, e.g. "boom:lastSeenReleaseVersion". */
    storageKey: string;
    /** GitHub repo URL, used to link PRs. */
    repoUrl: string;
    /** Brand name letters before the red "oo". Ignored if brandNode is set. */
    brandPrefix?: string;
    /** Brand name letters after the red "oo". Ignored if brandNode is set. */
    brandSuffix?: string;
    /** Full custom wordmark, overriding brandPrefix/brandSuffix (e.g. toolbox's two red "oo"s). */
    brandNode?: ReactNode;
    /** Stacking context for the panel overlay. Defaults to the top of the stack. */
    zIndex?: number;
    /** Extra classes for the pill button. */
    className?: string;
}
declare function ReleaseNotesButton({ releases, locale, storageKey, repoUrl, brandPrefix, brandSuffix, brandNode, zIndex, className, }: ReleaseNotesButtonProps): react_jsx_runtime.JSX.Element;

interface LocaleSelectorProps {
    /** Currently active locale. */
    locale: Locale$2;
    /** Called with the newly chosen locale when the user changes selection. */
    onChange: (locale: Locale$2) => void;
    /** Accessible label for screen readers. Defaults to "Select language". */
    ariaLabel?: string;
    /** Extra class names appended to the default styling. */
    className?: string;
}
/**
 * Compact suite-wide language selector. A 4-letter dropdown that switches the
 * active UI locale among the four SwissNovo languages (EN / FR / DE / IT).
 *
 * State is owned by the host app — pass the current `locale` and an
 * `onChange` handler. Styling matches the scoore navbar; consumers can extend
 * with `className`.
 */
declare function LocaleSelector({ locale, onChange, ariaLabel, className, }: LocaleSelectorProps): JSX.Element;

type PrmState = 'new' | 'contacted' | 'negotiation' | 'due_diligence' | 'closed' | 'rejected';
type PrmPriority = 'low' | 'medium' | 'high' | 'urgent';
declare const PRM_STATES: {
    value: PrmState;
    color: string;
    bg: string;
}[];
declare const PRM_PRIORITIES: {
    value: PrmPriority;
    color: string;
}[];
interface CreatePrmInput {
    parcel_id: string;
    parcel_label: string;
    parcel_municipality: string;
    parcel_area: number;
    parcel_lng: number;
    parcel_lat: number;
}
interface PrmRecord {
    id: string;
    parcel_id: string;
    user_id: string;
    state: PrmState;
    priority: PrmPriority;
    tags: string[];
    parcel_label: string;
    parcel_municipality: string;
    parcel_area: number;
    parcel_lng: number;
    parcel_lat: number;
    created_at: string;
    updated_at: string;
}
declare class AuthRequiredError extends Error {
    constructor();
}
declare function fetchPrmByParcel(token: string | null, parcelId: string): Promise<PrmRecord | null>;
declare function createPrmRecord(token: string | null, input: CreatePrmInput): Promise<PrmRecord>;
declare function fetchPrmRecords(token: string | null): Promise<PrmRecord[]>;
declare function updatePrmState(token: string | null, id: string, state: PrmState): Promise<PrmRecord>;
declare function updatePrmPriority(token: string | null, id: string, priority: PrmPriority): Promise<PrmRecord>;
declare function updatePrmTags(token: string | null, id: string, tags: string[]): Promise<PrmRecord>;
declare function deletePrmRecord(token: string | null, id: string): Promise<void>;
declare const PROOM_APP_URL = "https://swissnovo-proom.vercel.app";
declare const TOOLBOX_APP_URL = "https://swissnovo-toolbox.vercel.app";
declare const GEOPOOL_APP_URL = "https://swissnovo-geopool.vercel.app";

type Locale$1 = 'de' | 'en' | 'fr' | 'it';
interface SavedParcelsStrings {
    title: string;
    refresh: string;
    exportCsv: string;
    openInProom: string;
    searchPlaceholder: string;
    filterAllStates: string;
    showingAll: (n: number) => string;
    showingFiltered: (n: number, total: number) => string;
    empty: string;
    emptyHint: string;
    noMatch: string;
    loadFailed: string;
    signinRequired: string;
    colAddress: string;
    colMunicipality: string;
    colState: string;
    colPriority: string;
    colTags: string;
    colUpdated: string;
    colActions: string;
    openHere: string;
    openInToolbox: string;
    openInGeopool: string;
    delete: string;
    tagPlaceholder: string;
    addTag: string;
    removeTag: (tag: string) => string;
    confirmDeleteTitle: string;
    confirmDeleteBody: string;
    close: string;
    cancel: string;
    state: Record<PrmState, string>;
    priority: Record<PrmPriority, string>;
}
declare const SAVED_PARCELS_STRINGS: Record<Locale$1, SavedParcelsStrings>;
declare const getSavedParcelsStrings: (locale?: Locale$1) => SavedParcelsStrings;

interface SavedParcelsModalProps {
    /** Locale for the modal's UI text. Defaults to 'en'. */
    locale?: Locale$1;
    /** Close the modal. */
    onClose: () => void;
    /**
     * "Open here" action — host app handles what "here" means. Typical pattern
     * is to reload the current page with `?lat=&lng=&address=` for the chosen
     * parcel. Receives the full record so the app can do whatever it needs.
     */
    onOpenHere?: (record: PrmRecord) => void;
    /** Override the "Open here" button label. Defaults to "Open here". */
    openHereLabel?: string;
}
declare function SavedParcelsModal({ locale, onClose, onOpenHere, openHereLabel, }: SavedParcelsModalProps): react_jsx_runtime.JSX.Element;

interface LoginModalFeature {
    /** Optional leading icon. */
    icon?: LucideIcon;
    label: string;
    /** Dim the row and show a "Pro" badge. */
    locked?: boolean;
}
interface LoginModalProps {
    open: boolean;
    /** Called by any dismiss path (backdrop / Esc / link). Ignored when blocking. */
    onClose: () => void;
    /** App name shown in the headline; any `oo` substring renders in brand red. */
    appName: string;
    description?: string;
    features?: LoginModalFeature[];
    /** When true, no dismiss path is rendered. */
    blocking?: boolean;
    login: () => void;
    register: () => void;
}
/**
 * Suite-standard login popup. Branded with the SWISSNOVO wordmark, it offers
 * "Create free account" and "Sign in". Presentational only — it reads no
 * context, so it can be driven by {@link AuthProvider} or used standalone.
 */
declare function LoginModal({ open, onClose, appName, description, features, blocking, login, register, }: LoginModalProps): react.ReactPortal | null;

type AuthStatus = 'loading' | 'authenticated' | 'anonymous';
interface AuthContextValue {
    /** The raw OIDC user, or null when anonymous. */
    user: User | null;
    /** Coarse auth state — handy for switch/ternary rendering. */
    status: AuthStatus;
    /** True once a non-expired user is loaded. */
    isAuthenticated: boolean;
    /** True until the initial silent-SSO attempt settles. */
    isLoading: boolean;
    /** Start an interactive (full-page redirect) sign-in. */
    login: () => Promise<void>;
    /** Start an interactive sign-up — sends the user to the Zitadel registration form (prompt=create). */
    register: () => Promise<void>;
    /** Sign out (redirect), falling back to a local session clear. */
    logout: () => Promise<void>;
    /** The current access token, if any. */
    getAccessToken: () => string | undefined;
    /** Best-effort display name (name → given+family → email → "User"). */
    displayName: string;
    email: string;
    /** 1–2 letter initials derived from the name or email. */
    initials: string;
    /** Profile picture URL, or null. */
    picture: string | null;
    /** Open the standard login modal. */
    promptLogin: () => void;
    /** Returns `isAuthenticated`; opens the login modal as a side effect when false. */
    requireAuth: () => boolean;
    /** Close the login modal (no-op while a blocking modal is shown). */
    closeLogin: () => void;
    /** True while the login modal is visible. */
    isLoginModalOpen: boolean;
}
interface AuthProviderProps {
    children: ReactNode;
    /** App name for the login modal. When omitted, no modal is rendered. */
    appName?: string;
    loginDescription?: string;
    loginFeatures?: LoginModalFeature[];
    /** Hard gate: modal is open and non-dismissible whenever the user is anonymous. */
    loginBlocking?: boolean;
    /** Auto-open the modal once for an anonymous first-time visitor. */
    loginPromptOnFirstVisit?: boolean;
    /**
     * Run the hidden-iframe silent SSO on mount and keep `automaticSilentRenew`
     * active. Defaults to `true` (the suite-standard behaviour).
     *
     * Zitadel serves every authorize page with `Content-Security-Policy:
     * frame-ancestors 'none'`, so the silent-SSO iframe is *always* blocked — it
     * can never reach `silent-callback.html`. The death-switch below keeps that
     * from stranding the app, but the blocked frame still logs a scary
     * `Framing '…zitadel.cloud' violates … frame-ancestors 'none'` console error
     * on every load and adds a multi-second settle delay before the app falls to
     * anonymous. For a public, anonymous-first app (where cross-origin SSO is the
     * only thing the iframe could ever buy, and it's CSP-dead anyway) pass
     * `false`: the app then settles instantly from the locally-persisted session
     * (or to anonymous) with no iframe, no console error, and no renew churn.
     * Interactive `login()`/`register()` (full-page redirects) are unaffected.
     */
    silentSso?: boolean;
}
/**
 * Wraps the app, runs the suite-standard hidden-iframe silent SSO on mount
 * (unless {@link AuthProviderProps.silentSso} is `false`), and exposes auth
 * state via {@link useAuth}. Apps that keep silent SSO on must also ship a
 * `public/silent-callback.html` (served at `/silent-callback.html`).
 */
declare function AuthProvider({ children, appName, loginDescription, loginFeatures, loginBlocking, loginPromptOnFirstVisit, silentSso, }: AuthProviderProps): react_jsx_runtime.JSX.Element;
/** Auth state + actions. Must be called inside an {@link AuthProvider}. */
declare function useAuth(): AuthContextValue;

/** The shared OIDC client for the whole suite. */
declare const userManager: UserManager;
/** sessionStorage flag so silent SSO is attempted at most once per browser tab. */
declare const SSO_ATTEMPTED_KEY = "swissnovo:silent_sso_attempted";
/**
 * The currently stored, non-expired OIDC user, or null. Use this to attach a
 * token to API requests (e.g. the screenshot/image service) outside React.
 */
declare function getExistingUser(): Promise<User | null>;
/**
 * The current user's bearer token for API calls made outside React — the
 * id_token (a JWT, so a backend can decode `sub`) when present, else the
 * access_token. Null when there is no signed-in, non-expired user.
 */
declare function getAuthToken(): Promise<string | null>;
/** True when the current URL carries an OIDC redirect-callback (code/error + state). */
declare function urlHasAuthParams(url?: URL): boolean;
/** Strips OIDC callback query params from the address bar. */
declare function stripAuthParams(): void;

interface ClaireAssistantProps {
    /** App mounting Claire — feeds telemetry, persistence, and the prompt. */
    appName: string;
    /** Gemini API key, read by the app from its own VITE_GEMINI_API_KEY. */
    geminiApiKey?: string;
    /** Optional Gemini model override (defaults to gemini-3.1-flash-lite). */
    geminiModel?: string;
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
    lngLat: {
        lng: number;
        lat: number;
    };
    lv95?: {
        E: number;
        N: number;
    } | null;
    headerAddress?: string;
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
 * The avatar is inlined — no per-app public/ asset is needed.
 */
declare const ClaireAssistant: ({ appName, geminiApiKey, geminiModel, voiceCallEnabled, properties, enrichment, lngLat, lv95, headerAddress, }: ClaireAssistantProps) => react.ReactPortal;

interface ChatTurn {
    role: 'user' | 'assistant';
    content: string;
}
interface ParcelContextInput {
    properties: Record<string, unknown>;
    enrichment?: Record<string, unknown> | null;
    lngLat: {
        lng: number;
        lat: number;
    };
    lv95?: {
        E: number;
        N: number;
    } | null;
}
declare function buildParcelContextSummary(input: ParcelContextInput): string;
interface GeminiCallOptions {
    /** Gemini API key — supplied by the consuming app from its Vite env. */
    apiKey: string;
    /**
     * Preferred model id. If supplied, it is tried first; on 429/5xx the call
     * falls through the default chain (gemini-3.5-flash → gemini-3.1-flash-lite
     * → gemini-3-flash-preview). Omit to use only the default chain.
     */
    model?: string;
    /** App name woven into the system prompt (e.g. "Valoo"). */
    appName?: string;
    parcelContext: string;
    history: ChatTurn[];
    signal?: AbortSignal;
}
declare class GeminiConfigError extends Error {
    constructor();
}
declare function generateParcelChatReply({ apiKey, model, appName, parcelContext, history, signal, }: GeminiCallOptions): Promise<string>;
interface StreamParcelChatReplyOptions extends GeminiCallOptions {
    /**
     * Called for each token (or token group) as Gemini emits it. Frame
     * boundaries are not stable — buffer the result yourself if you need
     * the complete reply once the stream ends.
     */
    onDelta: (delta: string) => void;
}
/**
 * Streaming variant of {@link generateParcelChatReply}. Invokes `onDelta`
 * for every incremental chunk Gemini emits over SSE and resolves with the
 * full concatenated reply once the stream closes.
 *
 * Same fallback chain semantics as the unary call: if the first model
 * returns a retriable failure before the body opens, the next model in the
 * chain takes over (fetchGeminiWithFallback handles this transparently).
 * Once the body is open and tokens have started flowing, mid-stream
 * failures surface as an error — we don't restart from the top.
 *
 * Note: Gemini does not stream prompt-feedback blocks, so a blocked
 * response shows up as an empty body + a non-200 status, which the
 * fallback layer surfaces as an error before any delta fires.
 */
declare function streamParcelChatReply({ apiKey, model, appName, parcelContext, history, signal, onDelta, }: StreamParcelChatReplyOptions): Promise<string>;

type CallMode = 'listening' | 'speaking';
type CallRole = 'user' | 'agent';
interface VoiceCallCallbacks {
    /** Fired once the upstream voice session is ready to accept audio. */
    onConnect?: (info: {
        conversationId: string;
    }) => void;
    /** Fired once the session has fully torn down (for any reason). */
    onDisconnect?: () => void;
    /** Fired when Claire transitions between listening / speaking states. */
    onModeChange?: (info: {
        mode: CallMode;
    }) => void;
    /** Fired with each transcript chunk (user STT or agent TTS). */
    onMessage?: (info: {
        role: CallRole;
        message: string;
    }) => void;
    /** Fired when the user interrupted Claire — buffered speech is dropped. */
    onInterrupted?: () => void;
    /** Fired with a human-readable failure message; call also tears down. */
    onError?: (message: string) => void;
    /** Free-form diagnostic events for the host app's console / telemetry. */
    onDebug?: (info: unknown) => void;
}
interface StartVoiceCallOptions extends VoiceCallCallbacks {
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
    /**
     * Gemini Live model to use for this call. RES whitelists which models are
     * allowed and silently falls back to its default for anything else; this
     * lets a host app render multiple buttons (e.g. one per pipeline) without
     * shipping the allow-list itself.
     */
    model?: string;
}
interface VoiceCallSession {
    /** Locally generated id, useful for telemetry / log correlation. */
    conversationId: string;
    /** Hang up the call and release mic + audio contexts. Idempotent. */
    endSession: () => Promise<void>;
}
declare function startVoiceCall(options: StartVoiceCallOptions): Promise<VoiceCallSession>;

interface ClaireTurn {
    role: 'user' | 'assistant';
    content: string;
}
/**
 * Loads the stored conversation for a parcel. Returns [] when the visitor is
 * signed out, the parcel has no history, or the request fails — Claire then
 * starts fresh. Never throws.
 */
declare function loadClaireConversation(parcelId: string, accessToken: string | undefined): Promise<ClaireTurn[]>;
interface SaveClaireConversationParams {
    parcelId: string;
    messages: ClaireTurn[];
    accessToken: string | undefined;
    /** App the conversation happened on — stored as app_name. */
    appName: string;
    /** Parcel address — stored so the future history view reads nicely. */
    address?: string;
    lat?: number;
    lng?: number;
}
/**
 * Fire-and-forget: upserts the full conversation for a parcel. No-ops for
 * signed-out visitors. Never throws — persistence must not break the chat.
 */
declare function saveClaireConversation({ parcelId, messages, accessToken, appName, address, lat, lng, }: SaveClaireConversationParams): Promise<void>;
/**
 * One row in the user's Claire history — every parcel they've ever chatted
 * Claire about, across every app in the suite. Backed by the shared
 * `claire_conversation` table (one row per user × parcel), so the same
 * parcel discussed in two apps surfaces here as one entry, attributed to
 * whichever app most recently wrote the row.
 */
interface ClaireConversationSummary {
    parcel_id: string;
    app_name: string | null;
    target_address: string | null;
    target_lat: number | null;
    target_lng: number | null;
    message_count: number;
    created_at: string;
    updated_at: string;
}
/**
 * Lists every conversation the signed-in user has had with Claire, newest
 * first. Powers the doorway "studio history" — a unified view of every
 * parcel chat across the suite. Returns [] for signed-out visitors or on
 * any network/server failure; never throws.
 */
declare function listClaireConversations(accessToken: string | undefined): Promise<ClaireConversationSummary[]>;

interface ClaireMessageSignal {
    /** App emitting the signal — recorded as app_name. */
    appName: string;
    /** WGS84 latitude of the parcel the conversation is scoped to. */
    lat: number;
    /** WGS84 longitude of the parcel the conversation is scoped to. */
    lng: number;
    /** Human-readable parcel address, when known. */
    address?: string;
    /** Where the message originated — typed vs. a quick-prompt chip. */
    source?: 'composer' | 'quick_prompt';
}
/**
 * Fire-and-forget: reports one message sent to Claire, scoped to the parcel
 * under discussion. Each call is one message, so the admin signal dashboard
 * can count Claire interactions per parcel. Never throws — telemetry must
 * not interfere with the chat.
 */
declare function sendClaireMessageSignal({ appName, lat, lng, address, source, }: ClaireMessageSignal): Promise<void>;

interface ClaireContext {
    /** Ready-to-prepend context block ('' when nothing is found / on error). */
    text: string;
    /** GWR street address ("Fliegaufstrasse 7, 8280 Kreuzlingen"), when found. */
    address?: string;
    /**
     * Cadastral EGRID for the parcel under the click point (e.g. `CH123456789012`).
     * Returned for any click on Swiss territory, so Claire's sub-header can show
     * a parcel ID even when the host app didn't pass `properties.parcel_id`.
     */
    parcelId?: string;
    /** Local cadastral parcel number ("1234"), when available. */
    parcelNumber?: string;
}
/**
 * Fetches authoritative federal records for a coordinate. Returns the context
 * block plus the GWR street address. Never throws — best-effort enrichment.
 */
declare function fetchClaireContext(lng: number, lat: number, signal?: AbortSignal): Promise<ClaireContext>;

interface LocationScore {
    /** Overall accessibility score, 0–6 (6 = key amenities at the doorstep). */
    total: number;
    /** Per-category sub-scores, 0–6, keyed by scoore category id. */
    byCategory: Record<string, number>;
}
/**
 * Computes scoore's location-accessibility score from per-category POI
 * distances (metres). Mirrors scoore's `calculateLocationScore` exactly:
 * an unweighted average of the ten category scores, each 0–6.
 */
declare function computeLocationScore(categoryDistances: Record<string, number[]>): LocationScore;

interface ClairePOIs {
    /** Ready-to-append context block; '' on error or when nothing found. */
    text: string;
    /** Total POIs surfaced after categorisation (for telemetry / debug). */
    count: number;
    /** scoore-equivalent location-accessibility score; null when no POIs. */
    score: LocationScore | null;
}
/**
 * Fetches surrounding OSM POIs for a parcel coordinate, computes scoore's
 * location-accessibility score from them, and returns a compact context
 * block: the score (overall + per category) followed by the nearest few
 * POIs per category with distances.
 *
 * Never throws — best-effort enrichment, like fetchClaireContext.
 */
declare function fetchClairePOIs(lng: number, lat: number, signal?: AbortSignal): Promise<ClairePOIs>;

/** One-paragraph description of what the SwissNovo suite is. */
declare const SWISSNOVO_SUITE_BLURB: string;
/**
 * Compact, grouped catalogue of every SwissNovo app — name, one-line purpose,
 * and launch URL. Woven into Claire's system prompt so she can point users to
 * the most relevant tool.
 */
declare const SWISSNOVO_APP_CATALOG = "Valuation & pricing:\n- valoo \u2014 map of parcel values; spots pricing hotspots and underpriced pockets. https://swissnovo-valoo.vercel.app\n- proove \u2014 instant property valuation with transparent, factor-based pricing and upside estimates. https://proove.vercel.app/\n- scoore \u2014 auto-scores parcels on location, infrastructure and development potential. https://swissnovo-scoore.vercel.app/\n\nMaps & GIS data:\n- geopool \u2014 visual GIS data browser for real estate, like Google Maps for parcels. https://geopool.vercel.app/\n- contoor \u2014 extracts CAD geodata, parcel boundaries and topographic information. https://contoor.vercel.app/\n- woom \u2014 detects every available WMS map layer for a parcel. https://swissnovo-woom.vercel.app/\n- voogle \u2014 exports high-resolution Street View images for brochures. https://swissnovo-voogle.vercel.app/\n\nBuilding, terrain & environment:\n- roofs \u2014 analyzes building heights and roof structures. https://swissnovo-roofs.vercel.app/\n- roots \u2014 researches building age and history for renovation/investment decisions. https://swissnovo-roots.vercel.app/\n- hood \u2014 simulates 3D sunlight and shadow patterns for any parcel. https://swissnovo-hood.vercel.app/\n- footprint \u2014 analyzes building footprints, coverage ratios and sealed surface. https://swissnovo-footprint.vercel.app/\n- soolar \u2014 building-level solar/PV potential from the BFE Sonnendach dataset. https://swissnovo-soolar.vercel.app/\n- boom \u2014 Swiss environmental noise map (road & rail) checked against legal limits. https://swissnovo-boom.vercel.app/\n\nRegulations & legal:\n- xploore \u2014 finds building regulations, zoning plans and rules for a parcel. https://xploore.vercel.app/\n- handbook \u2014 planning-document dataroom with AI summaries and regulation Q&A. https://swissnovo-handbook.vercel.app/\n- roolez \u2014 AI-powered analysis and interpretation of building regulations. https://roolez-collector.vercel.app/\n- lookup \u2014 OEREB control center for public-law restriction queries. https://swissnovo-lookup.vercel.app/\n\nMonitoring & market signals:\n- scoops \u2014 real-time dashboard of property signals and market indicators. https://swissnovo-scoops.vercel.app/\n- watchoo \u2014 tracks building permits Switzerland-wide to qualify leads early. https://swissnovo-watchoo.vercel.app/\n- vacoo \u2014 monitors Swiss vacancy rates and market availability. https://vacoo.vercel.app/\n- groove \u2014 monitors official GWR building data and detects registry changes. https://swissnovo-groove.vercel.app/\n- goody \u2014 map of every new building project in Switzerland from the GWR register. https://swissnovo-goody.vercel.app/\n- taxoo \u2014 compares Swiss tax rates across municipalities. https://taxoo.vercel.app/\n\nSearch & parcel data:\n- choose \u2014 SQL-backed parcel filter and export by size, price, city, year. https://swissnovo-choose.vercel.app/\n- showroom \u2014 full parcel data overview from an address search. https://swissnovo-showroom.vercel.app/\n\nPipeline & AI assistants:\n- proom \u2014 parcel-first CRM with a Kanban pipeline, saved parcels and activity log. https://swissnovo-proom.vercel.app/\n- doorway \u2014 natural-language parcel chat about ownership, zoning and potential. https://swissnovo-doorway.vercel.app/\n- booklet \u2014 builds professional property portfolios and company presentations. https://swissnovo-booklet.vercel.app/\n\nTransactions & brokers:\n- boost \u2014 compares brokers by performance, commission and specialization. https://swissnovo-boost.vercel.app/\n- zeroo \u2014 zero-commission marketplace to buy and sell property directly. https://swissnovo-zeroo.vercel.app/\n- realioo \u2014 fractional, tokenized Swiss real-estate investment. https://realioo.brokereum.xyz\n\nHub:\n- toolbox \u2014 the suite dashboard: search and launch every SwissNovo tool. https://swissnovo-toolbox.vercel.app/";

/** The thing a signal is about — typically the selected parcel / address. */
interface SignalTarget {
    /** Human-readable address. */
    address?: string;
    /** WGS84 latitude. */
    lat?: number;
    /** WGS84 longitude. */
    lng?: number;
    /** Free-form extra context, stored as the signal's `meta_data`. */
    metaData?: Record<string, unknown>;
}
interface SignalClientOptions {
    /** App name recorded as `app_name` on every signal (e.g. "valoo"). */
    appName: string;
    /**
     * Endpoint to POST to. Defaults to the app's own `/api/signal-collect`
     * proxy — override only for tests or a non-standard deployment.
     */
    endpoint?: string;
}
interface SignalClient {
    /**
     * Fire-and-forget: report one user action, optionally scoped to a target.
     * Never throws — telemetry must not interfere with the host app.
     */
    send(userAction: string, target?: SignalTarget): Promise<void>;
}
/**
 * Create a signal client bound to one app name.
 *
 * @example
 * const signal = createSignalClient({ appName: 'valoo' });
 * signal.send('Search for Address', { address, lat, lng });
 */
declare function createSignalClient(options: SignalClientOptions): SignalClient;

type ErrorSeverity = 'error' | 'warning' | 'info';
type ErrorKind = 'runtime' | 'promise' | 'react' | 'console' | 'network' | 'user_report';
/** Live context attached to every captured event (selected parcel, signed-in user). */
interface ErrorLogContext {
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
interface ErrorLoggerOptions {
    /** App name recorded as `app_name` on every log (e.g. "valoo"). */
    appName: string;
    /** Endpoint to POST to. Defaults to the app's `/api/errorlog-collect` proxy. */
    endpoint?: string;
    /** Pull live context (selected parcel, signed-in email) at capture time. */
    getContext?: () => ErrorLogContext | undefined;
    /** Max events sent per page session (flood guard). Default 25. */
    maxEventsPerSession?: number;
}
interface ErrorLogger {
    /**
     * Fire-and-forget: report one error. Accepts an Error, a string, or anything
     * thrown. Never throws. De-duplicated and rate-limited within the session.
     */
    capture(error: unknown, extra?: {
        severity?: ErrorSeverity;
        kind?: ErrorKind;
        source?: string;
        metaData?: Record<string, unknown>;
    }): void;
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
/**
 * Create an error logger bound to one app name.
 *
 * @example
 * const logger = createErrorLogger({ appName: 'valoo' });
 * logger.install();                 // capture global errors
 * logger.capture(err, { kind: 'network' });
 */
declare function createErrorLogger(options: ErrorLoggerOptions): ErrorLogger;
/**
 * One-liner setup: create a logger, attach global handlers, and return it.
 * Drop into an app entrypoint (e.g. `main.tsx`):
 *
 *   installErrorLogging({ appName: 'valoo' });
 */
declare function installErrorLogging(options: ErrorLoggerOptions): ErrorLogger;

interface ErrorLogBoundaryProps {
    children: ReactNode;
    /** Logger used to report caught errors (from `createErrorLogger`). */
    logger?: Pick<ErrorLogger, 'capture'>;
    /**
     * Custom fallback. Either a node, or a render function receiving the error
     * and a `reset` callback that clears the boundary and re-renders children.
     */
    fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
    /** Extra callback after an error is caught (e.g. local logging). */
    onError?: (error: Error, info: ErrorInfo) => void;
    /** Force dark styling on the default fallback. Default auto-detect. */
    darkMode?: boolean;
}
interface State {
    error: Error | null;
}
declare class ErrorLogBoundary extends Component<ErrorLogBoundaryProps, State> {
    state: State;
    static getDerivedStateFromError(error: Error): State;
    componentDidCatch(error: Error, info: ErrorInfo): void;
    reset: () => void;
    render(): ReactNode;
}

type Locale = 'de' | 'en' | 'fr' | 'it';
interface BugReportStrings {
    /** Floating button label + aria-label. */
    button: string;
    /** Dialog heading. */
    title: string;
    /** Short helper line under the heading. */
    subtitle: string;
    /** Description textarea placeholder. */
    messagePlaceholder: string;
    /** Email input label. */
    emailLabel: string;
    /** Email input placeholder. */
    emailPlaceholder: string;
    /** Submit button (idle). */
    send: string;
    /** Submit button (in-flight). */
    sending: string;
    /** Success confirmation. */
    successTitle: string;
    successBody: string;
    /** Failure message. */
    error: string;
    /** Close button / icon aria-label. */
    close: string;
    /** Dialog aria-label. */
    dialogLabel: string;
}
declare const BUG_REPORT_STRINGS: Record<Locale, BugReportStrings>;
declare function getBugReportStrings(locale: Locale | string | undefined): BugReportStrings;

interface BugReportButtonProps {
    /** The app's error logger (from `createErrorLogger` / `installErrorLogging`). */
    logger: Pick<ErrorLogger, 'report'>;
    /** UI language. Default `de`. */
    locale?: Locale | string;
    /** Pre-fill the email field (e.g. the signed-in user's address). */
    email?: string;
    /** Corner to dock the button. Default `bottom-left` (keeps clear of Claire). */
    position?: 'bottom-left' | 'bottom-right';
    /** Force dark styling. Defaults to auto-detect (`<html class="dark">`). */
    darkMode?: boolean;
    /** Render into a custom container instead of `document.body`. */
    container?: Element | null;
    /** Extra metadata attached to every report (e.g. app version). */
    metaData?: Record<string, unknown>;
}
declare function BugReportButton({ logger, locale, email, position, darkMode, container, metaData, }: BugReportButtonProps): react.ReactPortal | null;

interface OpenReplayOptions {
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
interface OpenReplay {
    /** True once the tracker has been constructed and start() invoked. */
    readonly started: boolean;
    /** Associate the current replay with a user id + optional string metadata. */
    identify(userId: string, metadata?: Record<string, string>): void;
    /** Stop recording (best-effort). */
    stop(): void;
}
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
declare function initOpenReplay(options?: OpenReplayOptions): OpenReplay;
/**
 * Associate the current replay with an authenticated user (e.g. Zitadel email)
 * plus optional string metadata. Safe to call before init / before the tracker
 * has finished starting — no-ops until it's running.
 */
declare function identifyOpenReplayUser(userId: string, metadata?: Record<string, string>): void;
/** Stop recording (best-effort). Safe to call when not started. */
declare function stopOpenReplay(): void;

/**
 * Suite-wide client-side cache primitives. Two flavours:
 *
 *   - `LocalStorageCache<T>` — small, synchronous, TTL-only. Right for tiny
 *     responses (≤ a few KB) you want to keep across reloads: geocoder hints,
 *     small JSON config, last-N selections.
 *
 *   - `IndexedDBCache<T>` — asynchronous, optional TTL, optional byte-budget
 *     with LRU eviction. Right for larger responses (tens to hundreds of KB)
 *     where you also want a hard size ceiling, e.g. parcel-data / zone-stats
 *     payloads from RES. Every failure path is silent so a broken IndexedDB
 *     never breaks a user-facing fetch.
 *
 * Originally ported from scoore → room → here. Suite convention: this is the
 * **front-of-cache layer**, sitting in front of RES (whose endpoints have their
 * own server-side Redis cache — see `feedback-redis-backend-cache`). Use both:
 * IDB makes the hot path zero-network for the same user; Redis makes the cold
 * path warm for every other user.
 *
 * IDB version-bump caveat: this implementation opens its database at version 1
 * with a single store created in `onupgradeneeded`. If you keep multiple
 * `IndexedDBCache` instances against the SAME `dbName` with different
 * `storeName`s, the *first* one to open wins; subsequent stores will be
 * missing because `onupgradeneeded` won't fire for them. Either give each
 * store its own `dbName`, or bump the constructor's `version` parameter and
 * create all stores in the upgrade handler.
 */
declare class LocalStorageCache<T> {
    private prefix;
    private ttlMs;
    constructor(prefix: string, ttlMinutes?: number);
    private getKey;
    get(key: string): T | null;
    set(key: string, data: T): void;
    delete(key: string): void;
    clear(): void;
}
interface IndexedDBCacheOptions {
    /** Time-to-live in minutes. `0` or omitted means entries never expire. */
    ttlMinutes?: number;
    /** Maximum total cache size in bytes. Once exceeded, the least-recently-used
     *  entries are evicted. Omitted means unbounded. */
    maxBytes?: number;
    /** IDB schema version. Bump this when adding a new store to an existing DB,
     *  otherwise the new store will not be created on already-installed clients.
     *  Defaults to 1. */
    version?: number;
}
declare class IndexedDBCache<T> {
    private dbName;
    private storeName;
    private ttlMs;
    private maxBytes;
    private version;
    private db;
    constructor(dbName: string, storeName: string, options?: IndexedDBCacheOptions);
    private byteLength;
    private openDB;
    get(key: string): Promise<T | null>;
    /** Update an entry's lastAccessed timestamp without rewriting its data. */
    private touch;
    set(key: string, data: T): Promise<void>;
    /** Evict least-recently-used entries until total size is within `maxBytes`. */
    private enforceSizeLimit;
    delete(key: string): Promise<void>;
    /** Remove every entry in this store. */
    clear(): Promise<void>;
}

/** Which stored asset to resolve: the original (usually SVG) or the PNG raster. */
type FlagImageMode = 'original' | 'png';
/** One municipality flag record, mirroring the roolez_api response envelope. */
interface FlagRecord {
    /** Federal BFS municipality number (e.g. 261 = Zürich). */
    bfs_code: number;
    /** Municipality name as held in the roolez dataset. */
    municipality_name: string;
    /** Two-letter canton abbreviation, uppercase (e.g. "ZH"). */
    canton: string;
    /** Public Vercel Blob URL of the original asset (`.svg` for most), or null. */
    storage_url: string | null;
    /** Public Vercel Blob URL of the rasterised PNG, or null when not generated. */
    png_storage_url: string | null;
    /** Edge length in px of the square PNG, or null. */
    png_size: number | null;
    /** The URL for the requested `imageMode` — the field most callers render. */
    flag_url: string | null;
    /** Echoes the resolved image mode. */
    imageMode: FlagImageMode;
}
interface FlagFetchOptions {
    /** `'original'` (default) returns the SVG blob; `'png'` returns the raster. */
    imageMode?: FlagImageMode;
    /** Override the roolez_api base URL (defaults to {@link getFlagApiBase}). */
    apiBase?: string;
    /** Skip the local front-of-cache for this call (always hit the network). */
    noCache?: boolean;
}
/** Raised when a flag fetch hits a transport/HTTP error (not a 404 "no flag"). */
declare class FlagApiError extends Error {
    readonly status?: number | undefined;
    constructor(message: string, status?: number | undefined);
}
/** Current roolez_api base URL used by this client. */
declare function getFlagApiBase(): string;
/**
 * Override the roolez_api base URL process-wide (e.g. to point at a preview or
 * a self-hosted RES). Trailing slashes are stripped. Pass nothing or an empty
 * string to reset to the default.
 */
declare function setFlagApiBase(base?: string | null): void;
/** Clear every in-memory and persisted flag cache (testing / cache-busting). */
declare function clearFlagCache(): void;
/**
 * Resolve the flag for a single municipality by its BFS code.
 *
 * Returns the {@link FlagRecord} (whose `flag_url` is the asset for the
 * requested `imageMode`), or `null` when no flag exists for that code (or no
 * PNG exists in `'png'` mode). Throws {@link FlagApiError} only on transport or
 * server errors — a missing flag is `null`, never a throw.
 */
declare function getFlagByBfs(bfsCode: number, options?: FlagFetchOptions): Promise<FlagRecord | null>;
/**
 * Resolve every flag in a canton, ordered by BFS code. In `'png'` mode only
 * municipalities with a generated PNG are returned. Returns `[]` on error or
 * for an unknown canton.
 */
declare function getFlagsByCanton(canton: string, options?: FlagFetchOptions): Promise<FlagRecord[]>;
/**
 * Resolve every flag in the dataset (~2,000 municipalities), ordered by BFS
 * code. This is a large response; prefer {@link getFlagByBfs} /
 * {@link getFlagsByCanton} for targeted lookups. Returns `[]` on error.
 */
declare function getAllFlags(options?: FlagFetchOptions): Promise<FlagRecord[]>;
/** True when a blob URL points at an SVG asset (its path ends in `.svg`). */
declare function isSvgFlagUrl(url: string | null | undefined): boolean;
/**
 * Fetch the raw SVG markup for a flag from its `.svg` blob URL, with in-memory
 * de-duplication and caching so concurrent callers (inline render, recolour,
 * ZIP export) share one network round-trip. Returns `null` when the URL is not
 * an SVG blob or the fetch fails.
 *
 * This is the generalised, app-agnostic form of roolez-api's internal
 * `svgUtils.fetchSvgMarkup` — the "SVG flag extraction helper / flag cache"
 * any suite app can now import instead of reimplementing.
 */
declare function fetchFlagSvgMarkup(url: string | null | undefined): Promise<string | null>;

interface UseMunicipalityFlagResult {
    /** The resolved flag, or `null` while loading / when none exists. */
    flag: FlagRecord | null;
    /** True while the lookup is in flight. */
    loading: boolean;
    /** Set when the lookup hit a transport/server error (not a missing flag). */
    error: Error | null;
}
/**
 * React hook resolving a single municipality flag by BFS code via
 * {@link getFlagByBfs}. Re-fetches when `bfsCode` or `imageMode` change, and
 * ignores stale responses if the inputs change mid-flight. A missing flag
 * resolves to `flag: null` with no error.
 *
 * Pass `bfsCode = null/undefined` to stand the hook down (e.g. before a
 * municipality is selected).
 */
declare function useMunicipalityFlag(bfsCode: number | null | undefined, options?: FlagFetchOptions): UseMunicipalityFlagResult;

type ImgProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'width' | 'height'>;
interface MunicipalityFlagProps extends ImgProps {
    /** BFS municipality code to resolve and render. */
    bfsCode: number | null | undefined;
    /** `'original'` (SVG, default) or `'png'`. SVG blobs render fine in `<img>`. */
    imageMode?: FlagImageMode;
    /** Square edge length in px. Defaults to 24. */
    size?: number;
    /** Override the roolez_api base URL (see `setFlagApiBase`). */
    apiBase?: string;
    /** Custom alt text. Defaults to "<municipality> flag". */
    alt?: string;
    /** Rendered while loading or when no flag exists. Defaults to a neutral box. */
    fallback?: React.ReactNode;
}
/**
 * Drop-in municipality-flag image. Resolves the flag for `bfsCode` via the
 * shared roolez_api client and renders it as a square `<img>`. Shows the
 * `fallback` (a neutral rounded box by default) while loading, when no flag
 * exists, or if the asset fails to load. No token or per-app proxy required —
 * the flag blob is public.
 *
 * @example
 * <MunicipalityFlag bfsCode={261} size={32} />
 */
declare function MunicipalityFlag({ bfsCode, imageMode, size, apiBase, alt, fallback, style, ...imgProps }: MunicipalityFlagProps): react_jsx_runtime.JSX.Element;

interface SkeletonProps {
    /** Width — number is treated as px. */
    width?: number | string;
    /** Height — number is treated as px. */
    height?: number | string;
    /** Corner radius — number is px. Defaults to 8px. */
    radius?: number | string;
    /** Render a circle (avatar/icon placeholder). Uses `width` for both axes if `height` is omitted. */
    circle?: boolean;
    /** Force the dark base colour, for apps that theme via a boolean rather than a `.dark` class. */
    dark?: boolean;
    /** Stagger delay for cascading groups, e.g. "120ms". */
    delay?: string;
    /** Extra classes (Tailwind sizing/layout etc.). */
    className?: string;
    style?: CSSProperties;
    /** Element tag. Defaults to 'div'. */
    as?: ElementType;
}
/** A single skeleton block. Shape it with `width`/`height` or `className`. */
declare function Skeleton({ width, height, radius, circle, dark, delay, className, style, as, }: SkeletonProps): JSX.Element;
interface SkeletonTextProps {
    /** Number of text lines. Defaults to 3. */
    lines?: number;
    /** Gap between lines — number is px. Defaults to 8px. */
    gap?: number | string;
    /** Height of each line — number is px. Defaults to 12px. */
    lineHeight?: number | string;
    /** Width of the final line (shorter, for a natural paragraph end). Defaults to "60%". */
    lastLineWidth?: number | string;
    /** Force the dark base colour. */
    dark?: boolean;
    className?: string;
    style?: CSSProperties;
}
/** A stack of skeleton lines for paragraph-shaped content, with a cascading pulse. */
declare function SkeletonText({ lines, gap, lineHeight, lastLineWidth, dark, className, style, }: SkeletonTextProps): JSX.Element;
interface SkeletonProviderProps {
    children: ReactNode;
}
/** Optional wrapper carrying an accessible "loading" label for a skeleton region. */
declare function SkeletonGroup({ children }: SkeletonProviderProps): JSX.Element;

interface ProfileModalProps {
    /** The signed-in OIDC user. */
    user: User;
    /** Called on any dismiss path (backdrop, Esc, close buttons). */
    onClose: () => void;
    /**
     * Force dark styling. Only needed for apps that theme via a boolean rather
     * than a `dark` class on an ancestor element.
     */
    dark?: boolean;
}
/** The standard SwissNovo profile modal. Render it only while open. */
declare function ProfileModal({ user, onClose, dark }: ProfileModalProps): react.ReactPortal;

interface AvatarProps {
    /** Avatar image URL, or `null` to show the initials fallback. */
    url: string | null;
    /** Initials shown when there is no image. */
    initials: string;
    /** Rendered width/height in pixels. */
    size?: number;
    className?: string;
}
declare function Avatar({ url, initials, size, className }: AvatarProps): react_jsx_runtime.JSX.Element;

type Gender = 'male' | 'female' | 'other' | 'unspecified';
/** The complete, unified SwissNovo user profile. */
interface SwissnovoProfile {
    /** Id of the chosen catalogue avatar (see `avatars.ts`), or `null`. */
    avatar_id: string | null;
    gender: Gender;
    age: number | null;
    /** Short free-text bio. */
    about: string;
}
declare function defaultProfile(): SwissnovoProfile;
/** The current profile, lazily initialised from localStorage. */
declare function getProfile(): SwissnovoProfile;
/** Subscribe to profile changes. Returns an unsubscribe function. */
declare function subscribe(cb: (p: SwissnovoProfile) => void): () => void;
/** Fetch the profile stored on the RES API, or `null` on any failure. */
declare function fetchRemoteProfile(accessToken: string | undefined): Promise<SwissnovoProfile | null>;
/**
 * Merge `patch` into the current profile, persist it, broadcast to every
 * subscriber, and mirror it to the RES API.
 */
declare function updateProfile(patch: Partial<SwissnovoProfile>, accessToken?: string): SwissnovoProfile;
/**
 * Pull the profile from the RES API and adopt it locally. Called once after
 * sign-in so a profile set on another device shows up here.
 */
declare function hydrateFromRemote(accessToken: string | undefined): Promise<void>;

interface UseUserProfileResult {
    /** The current unified profile. */
    profile: SwissnovoProfile;
    /** Id of the chosen catalogue avatar, or `null`. */
    avatarId: string | null;
    /** Render URL for the chosen avatar, or `null` when none is set. */
    avatarUrl: string | null;
    /** Select a catalogue avatar by id. */
    setAvatarId: (id: string) => void;
    /** Merge a partial change into the profile. */
    updateProfile: (patch: Partial<SwissnovoProfile>) => void;
}
/**
 * Read and update the signed-in user's SwissNovo profile.
 *
 * @param user The OIDC user (pass `null` when anonymous). Its access token is
 *   used to mirror changes to the RES API; everything still works offline.
 */
declare function useUserProfile(user: User | null | undefined): UseUserProfileResult;

interface AvatarOption {
    /** Stable identifier persisted in the user's profile. */
    id: string;
    /** Human-readable label, shown as a tooltip in the picker. */
    label: string;
    /** Lowercase Unicode codepoint of the emoji — builds the Twemoji URL. */
    codepoint: string;
    /** Soft pastel background for the picker tile (reads on light + dark). */
    tint: string;
}
/** The full set of avatars a user can pick from. Order is the picker order. */
declare const avatarOptions: AvatarOption[];
/** Render URL for a catalogue avatar. */
declare function avatarUrl(opt: AvatarOption): string;
/** Render URL for a catalogue avatar id, or `null` when the id is unknown. */
declare function avatarUrlById(id: string | null | undefined): string | null;
/**
 * Render URL for a free-form seed (legacy "generated" avatar). Retained as a
 * public package export for backward compatibility; it has no current
 * consumer. Falls back to a DiceBear pixel-art avatar.
 */
declare function avatarUrlFromSeed(seed: string): string;

/** The user's email, or `''` when unknown. */
declare function emailOf(user: User | null | undefined): string;
/** Best-effort full name (name → given+family → preferred_username). */
declare function fullNameOf(user: User | null | undefined): string;
/** Best-effort first name (given_name → first word of full name → email local part). */
declare function firstNameOf(user: User | null | undefined): string;
/** 1–2 letter initials derived from the name, falling back to the email. */
declare function initialsOf(user: User | null | undefined): string;
/** The provider-supplied profile picture URL, if any. */
declare function pictureOf(user: User | null | undefined): string | null;

interface UseFocusTrapOptions {
    active?: boolean;
    onEscape?: () => void;
    restoreFocus?: boolean;
}
declare function useFocusTrap<T extends HTMLElement = HTMLElement>(options?: UseFocusTrapOptions): react.MutableRefObject<T | null>;

/**
 * SwissNovo semantic z-index scale.
 * Helps prevent ad-hoc z-index layering conflicts across the suite.
 */
declare const Z_INDEX: {
    /** Bottom base level (e.g. underlying custom canvas) */
    readonly base: 0;
    /** Deep layout/background layers */
    readonly bg: 10;
    /** Content cards or relative layout elements */
    readonly content: 20;
    /** Main navigation header and action bars */
    readonly header: 50;
    /** Sidebar panels and drawer filters */
    readonly drawer: 1000;
    /** Modals, dialog backdrops, and overlay panels */
    readonly modal: 2000;
    /** Dropdown menu popovers and select lists */
    readonly dropdown: 3000;
    /** Tooltips, toast notifications, and popovers */
    readonly tooltip: 4000;
    /** Stacking level for full-screen screenshots / tour overlays */
    readonly overlay: 5000;
    /** Absolute top layer (e.g. error boundary crash panel or global loader) */
    readonly top: 2147483647;
};
type ZIndexKey = keyof typeof Z_INDEX;

interface PortalProps {
    children: ReactNode;
    /** Optional target container. Defaults to document.body. */
    container?: HTMLElement;
}
/**
 * Standardised Portal component to render children outside the parent DOM hierarchy
 * (defaults to document.body), preventing clipping inside overflow-hidden parent containers.
 */
declare function Portal({ children, container }: PortalProps): react.ReactPortal | null;

declare module '@tanstack/react-table' {
    interface ColumnMeta<TData extends RowData, TValue> {
        /** Horizontal alignment of the cell + header. */
        align?: 'left' | 'right' | 'center';
        /** Extra classes for body cells in this column. */
        className?: string;
        /** Extra classes for the header cell in this column. */
        headerClassName?: string;
    }
}
interface DataTableStrings {
    searchPlaceholder: string;
    /** Sort-button aria-label; `{column}` is replaced with the header text. */
    sortBy: string;
    empty: string;
    firstPage: string;
    previousPage: string;
    nextPage: string;
    lastPage: string;
    page: string;
    of: string;
}
declare const DATA_TABLE_STRINGS_EN: DataTableStrings;
interface DataTableProps<T> {
    columns: ColumnDef<T, any>[];
    data: T[];
    /** Show skeleton rows instead of data. */
    loading?: boolean;
    /** Skeleton row count while `loading`. Default 8. */
    skeletonRows?: number;
    /** Enable click-to-sort headers. Default true. */
    enableSorting?: boolean;
    /** Render a global search box above the table. Default false. */
    enableGlobalFilter?: boolean;
    /** When set, client-paginates with controls. Disables virtualization. */
    pageSize?: number;
    /**
     * Row virtualization for large datasets. `true` forces it on; a number sets
     * the row-count threshold above which it auto-enables. Default: auto > 100.
     * Requires `maxHeight` (a bounded scroll container). Ignored when `pageSize`
     * is set.
     */
    virtualize?: boolean | number;
    /** Estimated row height (px) used when virtualizing. Default 44. */
    estimateRowHeight?: number;
    /** Overscan rows when virtualizing. Default 10. */
    overscan?: number;
    /** Scroll-container height. Required to virtualize; also enables sticky header. */
    maxHeight?: number | string;
    /** Sticky header (within the scroll container). Default true. */
    stickyHeader?: boolean;
    density?: 'comfortable' | 'compact';
    onRowClick?: (row: T) => void;
    /** Per-row conditional classes (e.g. selected/status highlighting). */
    rowClassName?: (row: T, index: number) => string;
    getRowId?: (row: T, index: number) => string;
    className?: string;
    /** Override the empty-state node entirely. */
    emptyMessage?: ReactNode;
    /** Localized labels. Defaults to English. */
    strings?: Partial<DataTableStrings>;
    /** Accessible table caption (visually hidden). */
    ariaLabel?: string;
    /** Row hover passthrough (e.g. to highlight a linked map feature). */
    onRowMouseEnter?: (row: T) => void;
    onRowMouseLeave?: (row: T) => void;
    /**
     * Let table content overflow its container instead of scrolling — needed
     * when cells render absolutely-positioned popovers/menus that would be
     * clipped by a scroll container. Forced to scroll when `maxHeight` is set.
     * Default false.
     */
    overflowVisible?: boolean;
    /** Per-slot class overrides for theming (e.g. dark-slate apps). */
    classNames?: DataTableClassNames;
}
/**
 * Per-slot class overrides. Each REPLACES the default colour classes for that
 * element (structural classes — padding, dividers, sticky, font — are always
 * applied), so a bespoke-themed app can fully restyle the table.
 */
interface DataTableClassNames {
    /** Scroll/border wrapper. */
    container?: string;
    /** Header row background. */
    thead?: string;
    /** Header cell text colour. */
    headerCell?: string;
    /** Body background + row dividers. */
    body?: string;
    /** Row hover (and base) classes. */
    row?: string;
    /** Body cell text colour. */
    cell?: string;
}
declare function DataTable<T>({ columns, data, loading, skeletonRows, enableSorting, enableGlobalFilter, pageSize, virtualize, estimateRowHeight, overscan, maxHeight, stickyHeader, density, onRowClick, rowClassName, getRowId, className, emptyMessage, strings, ariaLabel, onRowMouseEnter, onRowMouseLeave, overflowVisible, classNames, }: DataTableProps<T>): JSX.Element;

interface VirtualListProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => ReactNode;
    /** Estimated item height (px) or a per-index estimator. Default 56. */
    estimateSize?: number | ((index: number) => number);
    /** Extra rows rendered above/below the viewport. Default 8. */
    overscan?: number;
    getItemKey?: (item: T, index: number) => string | number;
    /** Called when the user scrolls near the bottom (infinite scroll). */
    onEndReached?: () => void;
    /** Distance from the bottom (px) that triggers `onEndReached`. Default 200. */
    endReachedThreshold?: number;
    /** Show skeleton rows instead of items. */
    loading?: boolean;
    /** Skeleton row count while `loading`. Default 8. */
    skeletonRows?: number;
    emptyMessage?: ReactNode;
    className?: string;
    /** Must establish a bounded height for virtualization to work. */
    style?: CSSProperties;
    ariaLabel?: string;
}
declare function VirtualList<T>({ items, renderItem, estimateSize, overscan, getItemKey, onEndReached, endReachedThreshold, loading, skeletonRows, emptyMessage, className, style, ariaLabel, }: VirtualListProps<T>): JSX.Element;

export { type AuthContextValue, AuthProvider, type AuthProviderProps, type AuthStatus, Avatar, type AvatarOption, type AvatarProps, BUG_REPORT_STRINGS, BugReportButton, type BugReportButtonProps, type BugReportStrings, type CallMode, type CallRole, type ChangeItem, type ChangeKind, type ChatTurn, ClaireAssistant, type ClaireAssistantProps, type ClaireContext, type ClaireConversationSummary, type ClairePOIs, type ClaireTurn, type CreatePrmInput, DATA_TABLE_STRINGS_EN, DataTable, type DataTableProps, type DataTableStrings, type ErrorKind, ErrorLogBoundary, type ErrorLogBoundaryProps, type ErrorLogContext, type ErrorLogger, type ErrorLoggerOptions, type ErrorSeverity, FlagApiError, type FlagFetchOptions, type FlagImageMode, type FlagRecord, GEOPOOL_APP_URL, type GeminiCallOptions, GeminiConfigError, type Gender, IndexedDBCache, type IndexedDBCacheOptions, KIND_META, LocalStorageCache, type Locale$2 as Locale, LocaleSelector, LocaleSelector as LocaleSelectorDefault, type LocaleSelectorProps, type LocationScore, LoginModal, type LoginModalFeature, type LoginModalProps, MunicipalityFlag, type MunicipalityFlagProps, type OpenReplay, type OpenReplayOptions, PRM_PRIORITIES, PRM_STATES, PROOM_APP_URL, type ParcelContextInput, Portal, type PortalProps, AuthRequiredError as PrmAuthRequiredError, type Locale$1 as PrmLocale, type PrmPriority, type PrmRecord, type PrmState, ProfileModal, type ProfileModalProps, RELEASE_NOTES_STRINGS, type Release, ReleaseNotesButton, type ReleaseNotesButtonProps, ReleaseNotesPanel, type ReleaseNotesPanelProps, type ReleaseNotesStrings, SAVED_PARCELS_STRINGS, SSO_ATTEMPTED_KEY, SWISSNOVO_APP_CATALOG, SWISSNOVO_SUITE_BLURB, SavedParcelsModal, type SavedParcelsModalProps, type SavedParcelsStrings, type SignalClient, type SignalClientOptions, type SignalTarget, Skeleton, SkeletonGroup, type SkeletonProps, type SkeletonProviderProps, SkeletonText, type SkeletonTextProps, type StartVoiceCallOptions, type StreamParcelChatReplyOptions, type SwissnovoProfile, TOOLBOX_APP_URL, type UseFocusTrapOptions, type UseMunicipalityFlagResult, type UseUserProfileResult, VirtualList, type VirtualListProps, type VoiceCallCallbacks, type VoiceCallSession, type ZIndexKey, Z_INDEX, avatarOptions, avatarUrl, avatarUrlById, avatarUrlFromSeed, buildParcelContextSummary, clearFlagCache, computeLocationScore, createErrorLogger, createPrmRecord, createSignalClient, defaultProfile, deletePrmRecord, emailOf, fetchClaireContext, fetchClairePOIs, fetchFlagSvgMarkup, fetchPrmByParcel, fetchPrmRecords, fetchRemoteProfile, firstNameOf, fullNameOf, generateParcelChatReply, getAllFlags, getAuthToken, getBugReportStrings, getExistingUser, getFlagApiBase, getFlagByBfs, getFlagsByCanton, getProfile, getReleaseNotesStrings, getSavedParcelsStrings, hydrateFromRemote, identifyOpenReplayUser, initOpenReplay, initialsOf, installErrorLogging, isSvgFlagUrl, listClaireConversations, loadClaireConversation, pictureOf, saveClaireConversation, sendClaireMessageSignal, setFlagApiBase, startVoiceCall, stopOpenReplay, streamParcelChatReply, stripAuthParams, subscribe as subscribeProfile, updatePrmPriority, updatePrmState, updatePrmTags, updateProfile, urlHasAuthParams, useAuth, useFocusTrap, useMunicipalityFlag, useUserProfile, userManager };
