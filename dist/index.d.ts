import * as react from 'react';
import { ReactNode, MutableRefObject, CSSProperties, ElementType } from 'react';
import { LucideIcon } from 'lucide-react';
import * as react_jsx_runtime from 'react/jsx-runtime';
import { User, UserManager } from 'oidc-client-ts';
export { Coordinates, GeoJSONFeatureCollection, JsonError, ParcelTree, PoiDetail, RES_API_BASE_URL, ResApiClient, ResApiClientOptions, SignalRecord, SwissnovoImage, components, createResApiClient, operations, paths } from './api/index.js';
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
type Locale$1 = 'de' | 'en' | 'fr' | 'it';
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
declare const RELEASE_NOTES_STRINGS: Record<Locale$1, ReleaseNotesStrings>;
declare const getReleaseNotesStrings: (locale?: Locale$1) => ReleaseNotesStrings;

interface ReleaseNotesPanelProps {
    /** Called when the panel finishes its close animation. */
    onClose: () => void;
    /** UI language for the panel chrome. Defaults to English. */
    locale?: Locale$1;
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
    locale?: Locale$1;
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
    locale: Locale$1;
    /** Called with the newly chosen locale when the user changes selection. */
    onChange: (locale: Locale$1) => void;
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

type Locale = 'de' | 'en' | 'fr' | 'it';
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
declare const SAVED_PARCELS_STRINGS: Record<Locale, SavedParcelsStrings>;
declare const getSavedParcelsStrings: (locale?: Locale) => SavedParcelsStrings;

interface SavedParcelsModalProps {
    /** Locale for the modal's UI text. Defaults to 'en'. */
    locale?: Locale;
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
}
/**
 * Wraps the app, runs the suite-standard hidden-iframe silent SSO on mount,
 * and exposes auth state via {@link useAuth}. Apps must also ship a
 * `public/silent-callback.html` (served at `/silent-callback.html`).
 */
declare function AuthProvider({ children, appName, loginDescription, loginFeatures, loginBlocking, loginPromptOnFirstVisit, }: AuthProviderProps): react_jsx_runtime.JSX.Element;
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
declare const ClaireAssistant: ({ appName, geminiApiKey, geminiModel, properties, enrichment, lngLat, lv95, headerAddress, }: ClaireAssistantProps) => react.ReactPortal;

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
    /** Model id; defaults to gemini-3.1-flash-lite. */
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
}
/**
 * Fetches authoritative federal records for a coordinate. Returns the context
 * block plus the GWR street address. Never throws — best-effort enrichment.
 */
declare function fetchClaireContext(lng: number, lat: number, signal?: AbortSignal): Promise<ClaireContext>;

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

export { type AuthContextValue, AuthProvider, type AuthProviderProps, type AuthStatus, Avatar, type AvatarOption, type AvatarProps, type ChangeItem, type ChangeKind, type ChatTurn, ClaireAssistant, type ClaireAssistantProps, type ClaireContext, type ClaireTurn, type CreatePrmInput, GEOPOOL_APP_URL, type GeminiCallOptions, GeminiConfigError, type Gender, KIND_META, type Locale$1 as Locale, LocaleSelector, LocaleSelector as LocaleSelectorDefault, type LocaleSelectorProps, LoginModal, type LoginModalFeature, type LoginModalProps, PRM_PRIORITIES, PRM_STATES, PROOM_APP_URL, type ParcelContextInput, AuthRequiredError as PrmAuthRequiredError, type Locale as PrmLocale, type PrmPriority, type PrmRecord, type PrmState, ProfileModal, type ProfileModalProps, RELEASE_NOTES_STRINGS, type Release, ReleaseNotesButton, type ReleaseNotesButtonProps, ReleaseNotesPanel, type ReleaseNotesPanelProps, type ReleaseNotesStrings, SAVED_PARCELS_STRINGS, SSO_ATTEMPTED_KEY, SavedParcelsModal, type SavedParcelsModalProps, type SavedParcelsStrings, type SignalClient, type SignalClientOptions, type SignalTarget, Skeleton, SkeletonGroup, type SkeletonProps, type SkeletonProviderProps, SkeletonText, type SkeletonTextProps, type SwissnovoProfile, TOOLBOX_APP_URL, type UseUserProfileResult, avatarOptions, avatarUrl, avatarUrlById, avatarUrlFromSeed, buildParcelContextSummary, createPrmRecord, createSignalClient, defaultProfile, deletePrmRecord, emailOf, fetchClaireContext, fetchPrmByParcel, fetchPrmRecords, fetchRemoteProfile, firstNameOf, fullNameOf, generateParcelChatReply, getAuthToken, getExistingUser, getProfile, getReleaseNotesStrings, getSavedParcelsStrings, hydrateFromRemote, initialsOf, loadClaireConversation, pictureOf, saveClaireConversation, sendClaireMessageSignal, stripAuthParams, subscribe as subscribeProfile, updatePrmPriority, updatePrmState, updatePrmTags, updateProfile, urlHasAuthParams, useAuth, useUserProfile, userManager };
