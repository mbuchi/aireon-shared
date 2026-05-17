import * as react from 'react';
import { ReactNode, MutableRefObject } from 'react';
import { LucideIcon } from 'lucide-react';
import * as react_jsx_runtime from 'react/jsx-runtime';
import { User, UserManager } from 'oidc-client-ts';

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
type Locale = 'de' | 'en' | 'fr' | 'it';
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
declare const RELEASE_NOTES_STRINGS: Record<Locale, ReleaseNotesStrings>;
declare const getReleaseNotesStrings: (locale?: Locale) => ReleaseNotesStrings;

interface ReleaseNotesPanelProps {
    /** Called when the panel finishes its close animation. */
    onClose: () => void;
    /** UI language for the panel chrome. Defaults to English. */
    locale?: Locale;
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
    locale?: Locale;
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
}
/**
 * Wraps the app, runs the suite-standard hidden-iframe silent SSO on mount,
 * and exposes auth state via {@link useAuth}. Apps must also ship a
 * `public/silent-callback.html` (served at `/silent-callback.html`).
 */
declare function AuthProvider({ children }: {
    children: ReactNode;
}): react_jsx_runtime.JSX.Element;
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
    darkMode: boolean;
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
 *  - serve `public/claire.png`,
 *  - expose an `/api/signal-collect` proxy,
 *  - pass its `VITE_GEMINI_API_KEY` as `geminiApiKey`,
 *  - be wrapped in this package's <AuthProvider>.
 */
declare const ClaireAssistant: ({ appName, geminiApiKey, geminiModel, darkMode, properties, enrichment, lngLat, lv95, headerAddress, }: ClaireAssistantProps) => react.ReactPortal;

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
    /** Stable parcel identifier, when the map tile provides one. */
    parcelId?: string | null;
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
declare function sendClaireMessageSignal({ appName, lat, lng, parcelId, address, source, }: ClaireMessageSignal): Promise<void>;

export { type AuthContextValue, AuthProvider, type AuthStatus, type ChangeItem, type ChangeKind, type ChatTurn, ClaireAssistant, type ClaireAssistantProps, type ClaireTurn, type GeminiCallOptions, GeminiConfigError, KIND_META, type Locale, type ParcelContextInput, RELEASE_NOTES_STRINGS, type Release, ReleaseNotesButton, type ReleaseNotesButtonProps, ReleaseNotesPanel, type ReleaseNotesPanelProps, type ReleaseNotesStrings, SSO_ATTEMPTED_KEY, buildParcelContextSummary, generateParcelChatReply, getAuthToken, getExistingUser, getReleaseNotesStrings, loadClaireConversation, saveClaireConversation, sendClaireMessageSignal, stripAuthParams, urlHasAuthParams, useAuth, userManager };
