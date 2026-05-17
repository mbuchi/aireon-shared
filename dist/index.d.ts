import * as react from 'react';
import { ReactNode, MutableRefObject } from 'react';
import { LucideIcon } from 'lucide-react';
import * as react_jsx_runtime from 'react/jsx-runtime';
import { User, UserManager } from 'oidc-client-ts';
import { Client } from 'openapi-fetch';

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
 *  - expose an `/api/signal-collect` proxy,
 *  - pass its `VITE_GEMINI_API_KEY` as `geminiApiKey`,
 *  - be wrapped in this package's <AuthProvider>.
 * The avatar is inlined — no per-app public/ asset is needed.
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

/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */
interface paths {
    "/res_api": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Health check
         * @description Returns a static greeting confirming the RES API router is reachable.
         */
        get: operations["getResApiHealth"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/res_api/parcel_data": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Get parcel data by coordinate or EGRID
         * @description Returns full parcel data for a Swiss parcel, located either by WGS84 coordinate (`lat`/`lng`) or by parcel `egrid`.
         *
         *     With `structure: "default"` the response is the raw GeoServer GeoJSON `FeatureCollection`, enriched with `owner`, `isSignal`, `image_urls` and `OEREB_url` on the first feature's properties. With `structure: "tree"` the response is a grouped, human-readable object.
         */
        post: operations["getParcelData"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/res_api/parcel_boundary_data": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Get parcel boundary geometry as DXF
         * @description Returns the parcel boundary as an AutoCAD DXF document, located by `lat`/`lng` or `egrid`.
         */
        post: operations["getParcelBoundaryData"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/res_api/parcel_data_neighbor": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Get a parcel and its neighbouring parcels
         * @description Returns the raw GeoServer GeoJSON `FeatureCollection` for a parcel located by `lat`/`lng` or `egrid` (currently the same query as `/res_api/parcel_data`; a bounding-box neighbour filter is planned).
         */
        post: operations["getParcelDataNeighbor"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/res_api/parcel_image": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Render a parcel image (PNG) — query-string variant
         * @description Same as the POST variant but driven entirely by query parameters. Used for `<img src>` URLs. The auth token is passed as the `token` query parameter, not a header.
         */
        get: operations["getParcelImageGet"];
        put?: never;
        /**
         * Render a parcel image (PNG) — JSON body variant
         * @description Renders a styled PNG of the parcel from the GeoServer WMS. Location is given by `lat`/`lng` or by `x_3857`/`y_3857` (Web Mercator).
         */
        post: operations["getParcelImagePost"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/res_api/buildingModel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Request a 3D building model (async, delivered by email)
         * @description Queues generation of a 3D building model. The model link is emailed to `target_email` asynchronously; the HTTP response only confirms the request was received.
         */
        post: operations["requestBuildingModel"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/res_api/contour_data": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Request contour (Contoor) data (async, delivered by email)
         * @description Queues generation of contour data for a parcel. The result is emailed to `target_email` asynchronously; the HTTP response only confirms the request was received.
         */
        post: operations["requestContourData"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/res_api/building_data": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Get building height and volume at a location
         * @description Returns building height and volume statistics for buildings at or near a coordinate, anywhere in Switzerland.
         */
        post: operations["getBuildingData"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/res_api/bldg_vol_bbox": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Building volume statistics within a bounding box
         * @description Aggregates building footprint count, volume and density within a circular bounding box around a coordinate.
         */
        post: operations["getBuildingVolumeBbox"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/res_api/airquality": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Current air quality at a location
         * @description Returns current air-quality conditions for a coordinate, proxied from the Google Air Quality API.
         */
        get: operations["getAirQuality"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/res_api/fso-docs/{fsoNum}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get OEREBlex documents for a municipality (FSO number)
         * @description Returns OEREBlex legal documents associated with a Swiss municipality, identified by its Federal Statistical Office (FSO) number.
         */
        get: operations["getFsoDocs"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/res_api/signal_data": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List parcels that have signals (with coordinates)
         * @description Returns parcels that have associated activity signals, including aggregated counts.
         */
        get: operations["getSignalData"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/res_api/signal_data_all": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Full signal dataset
         * @description Returns the complete cached signal dataset. Also reachable at `/res_api/signal_data_full`.
         */
        get: operations["getSignalDataAll"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/res_api/fb_water": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Water-scenario data for a parcel
         * @description Returns water-balance scenario values (runoff, infiltration, evaporation, costs) for a given scenario number and parcel column.
         */
        post: operations["getWaterScenarioData"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/score/poi-num": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Count of points of interest around a location
         * @description Returns POI counts within `search_area` metres of a coordinate. With `res_group=true` the counts are grouped into SwissNovo amenity clusters.
         */
        get: operations["getPoiCounts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/score/poi-details": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Detailed points of interest around a location
         * @description Returns individual POIs within `search_area` metres of a coordinate, grouped into SwissNovo amenity clusters, each with name, distance, category and position.
         */
        get: operations["getPoiDetails"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/score/poi-details-driving-distance": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Detailed points of interest within a travel-time isochrone
         * @description Returns individual POIs reachable within `range` (seconds of travel time) of a coordinate for the given travel `profile`, grouped into SwissNovo amenity clusters.
         */
        get: operations["getPoiDetailsDrivingDistance"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/oereb_url": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Get the OEREB extract PDF URL for a parcel
         * @description Resolves a parcel (by `lat`/`lng` or `egrid`) and returns the cantonal OEREB extract PDF download URL as a plain-text body.
         */
        post: operations["getOerebExtractUrl"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/image/upload": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Upload an image (legacy, token-authenticated)
         * @description Uploads an image file and records it in the `images` table. Authenticated with the RES API token.
         */
        post: operations["uploadImage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/image/{imageId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve a legacy image file by ID
         * @description Streams the image file for a record in the `images` table. Authentication is currently disabled on this endpoint.
         */
        get: operations["getImageById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/image/user/{userId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List legacy images for a user
         * @description Lists image records belonging to a user, newest first.
         */
        get: operations["listUserImages"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/image/swissnovo/upload": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Save a user image from a SwissNovo app
         * @description Saves a result image on behalf of the signed-in SwissNovo user. Authenticated with a Zitadel JWT bearer token; the user is taken from the `sub` claim.
         */
        post: operations["uploadSwissnovoImage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/image/swissnovo/list": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List the current user's SwissNovo images
         * @description Lists images saved by the signed-in user, newest first, optionally filtered by app or linked parcel.
         */
        get: operations["listSwissnovoImages"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/image/swissnovo/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get one of the current user's SwissNovo images
         * @description Returns a single saved image record. Only the owning user may read it.
         */
        get: operations["getSwissnovoImage"];
        put?: never;
        post?: never;
        /**
         * Delete one of the current user's SwissNovo images
         * @description Deletes a saved image record and best-effort removes the file from disk. Only the owning user may delete it.
         */
        delete: operations["deleteSwissnovoImage"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/res_api/signal/collect": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Record a user-activity signal
         * @description Records a user-activity signal from a SwissNovo app. If `parcel_id` is omitted but `target_lat`/`target_lng` are present, the parcel ID is resolved via SwissTopo. Authenticated with the API bearer token or an active session.
         */
        post: operations["collectSignal"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/res_api/signal/list": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List collected signals
         * @description Returns collected signals with pagination, filterable by app, country and date range.
         */
        get: operations["listSignals"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/res_api/signal/parcel/{parcel_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List signals for a specific parcel
         * @description Returns collected signals targeting a given parcel, with pagination and the same filters as `/res_api/signal/list`.
         */
        get: operations["listSignalsByParcel"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/res_api/signal/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Aggregated signal statistics
         * @description Returns signal counts aggregated by app, by country, and by day, optionally limited to a date range.
         */
        get: operations["getSignalStats"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/res_api/signal/delete/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Delete a collected signal
         * @description Deletes a single signal record by its numeric ID.
         */
        delete: operations["deleteSignal"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
interface components {
    schemas: {
        /** @description Standard JSON error body used by the newer endpoints. */
        JsonError: {
            /** @description Human-readable error description. */
            error: string;
            /** @description Optional underlying error message. */
            message?: string;
        };
        /** @description Locates a parcel by WGS84 coordinate (`lat`+`lng`) or by `egrid`. Provide one of the two. */
        ParcelLocationRequest: {
            /** @description WGS84 latitude. */
            lat?: number;
            /** @description WGS84 longitude. */
            lng?: number;
            /** @description Parcel EGRID identifier. */
            egrid?: string;
            /**
             * @description `default` returns the raw GeoJSON FeatureCollection; `tree` returns a grouped, human-readable object.
             * @default default
             * @enum {string}
             */
            structure: "default" | "tree";
        };
        /** @description Locates a parcel by WGS84 coordinate (`lat`+`lng`) or by `egrid`. Provide one of the two. */
        ParcelLocationRequestNoStructure: {
            /** @description WGS84 latitude. */
            lat?: number;
            /** @description WGS84 longitude. */
            lng?: number;
            /** @description Parcel EGRID identifier. */
            egrid?: string;
        };
        /** @description Locates the parcel by `lat`+`lng` or by `x_3857`+`y_3857` (Web Mercator). Provide one pair. */
        ParcelImageRequest: {
            /** @description WGS84 latitude. */
            lat?: number;
            /** @description WGS84 longitude. */
            lng?: number;
            /** @description Web Mercator X coordinate. */
            x_3857?: number;
            /** @description Web Mercator Y coordinate. */
            y_3857?: number;
            /**
             * @description Output image width/height, in pixels.
             * @default 512
             */
            img_size: number;
            /**
             * @description Half-extent of the rendered bounding box, in metres.
             * @default 200
             */
            bounding_dist: number;
            /**
             * @description Render style.
             * @default ratio_v_free
             * @enum {string}
             */
            style: "ratio_v_free" | "score" | "red" | "green";
        };
        Coordinates: {
            /** @description Web Mercator (EPSG:3857) X. */
            x?: number;
            /** @description Web Mercator (EPSG:3857) Y. */
            y?: number;
            /** @description LV95 (EPSG:2056) X. */
            x_2056?: number;
            /** @description LV95 (EPSG:2056) Y. */
            y_2056?: number;
            /** @description WGS84 latitude. */
            lat?: number;
            /** @description WGS84 longitude. */
            lng?: number;
        };
        /** @description GeoJSON FeatureCollection from GeoServer. With `/res_api/parcel_data`, the first feature's `properties` is enriched with `owner`, `isSignal`, `image_urls` and `OEREB_url`. */
        GeoJSONFeatureCollection: {
            /** @constant */
            type?: "FeatureCollection";
            features?: {
                /** @constant */
                type?: "Feature";
                id?: string;
                geometry?: {
                    [key: string]: unknown;
                };
                properties?: {
                    [key: string]: unknown;
                };
            }[];
        };
        /** @description Grouped, human-readable parcel representation returned when `structure: "tree"`. */
        ParcelTree: {
            name?: string;
            description?: string;
            owner?: {
                [key: string]: unknown;
            }[];
            site_score?: number | null;
            res_id?: string | number | null;
            /** @description UUIDv5 derived from the parcel EGRID. */
            uuid?: string;
            score?: {
                score_drive?: number | null;
                score_walk?: number | null;
                score_bike?: number | null;
            };
            address?: {
                street?: string | null;
                city?: string | null;
                canton?: string | null;
                zip?: string | number | null;
                parcel_id?: string;
                coordinates?: components["schemas"]["Coordinates"];
            };
            /** @description Building attributes (construction year, flats, floors, size, volume, heights). */
            building?: {
                [key: string]: unknown;
            };
            /** @description Plot attributes (area, ratios, GFA, max footprint/volume). */
            plot?: {
                [key: string]: unknown;
            };
            /** @description Construction-zone attributes. */
            construction_zone?: {
                [key: string]: unknown;
            };
            /** @description Rail and street noise levels (day/night, min/mean/max). */
            noise?: {
                [key: string]: unknown;
            };
            /** @description Travel times to the nearest agglomeration. */
            travel?: {
                [key: string]: unknown;
            };
            /** @description District vacancy figures. */
            vacancies?: {
                [key: string]: unknown;
            };
            /** @description Tax attributes. */
            tax?: {
                [key: string]: unknown;
            };
            image_urls?: {
                /** Format: uri */
                parcel_image?: string;
                /** Format: uri */
                satellite_image?: string;
                /** Format: uri */
                world_topo_image?: string;
            };
            /** @description OEREB extract URL, or `not available`. */
            OEREB_url?: string;
        };
        /** @description A single point of interest within a scoring cluster. */
        PoiDetail: {
            name?: string;
            /** @description Distance from the query location, in metres. */
            distance?: number;
            category_name?: string;
            category_group?: string;
            /** @description Sequential index across all clusters in the response. */
            location_index?: number;
            position?: {
                lat?: number;
                lng?: number;
            };
        };
        /** @description A stored user-activity signal row. */
        SignalRecord: {
            id?: number;
            app_name?: string;
            user_ip?: string | null;
            user_country?: string | null;
            user_lat?: number | null;
            user_lng?: number | null;
            target_address?: string | null;
            target_parcel_id?: string | null;
            target_lat?: number | null;
            target_lng?: number | null;
            metadata?: {
                [key: string]: unknown;
            };
            /** Format: date-time */
            created_at?: string;
        };
        Pagination: {
            /** @description Total matching rows. */
            total?: number;
            /** @description Page size. */
            limit?: number;
            /** @description Page offset. */
            offset?: number;
        };
        /** @description A user-saved SwissNovo image record (`images_zitadel` table). */
        SwissnovoImage: {
            id?: string;
            user_id?: string;
            /** @description Linked parcel ID, if any. */
            prm_id?: string | null;
            app_source?: string;
            original_filename?: string;
            file_path?: string;
            /** Format: uri */
            public_url?: string;
            mime_type?: string;
            file_size?: number;
            width?: number | null;
            height?: number | null;
            custom_metadata?: {
                [key: string]: unknown;
            };
            /** Format: date-time */
            created_at?: string;
        };
    };
    responses: {
        /** @description Authentication token missing (plain-text body). */
        MissingTokenText: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "text/plain": string;
            };
        };
        /** @description Authentication token invalid (plain-text body). */
        WrongTokenText: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "text/plain": string;
            };
        };
        /** @description Invalid request. */
        JsonBadRequest: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["JsonError"];
            };
        };
        /** @description Authentication missing or invalid. */
        JsonUnauthorized: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["JsonError"];
            };
        };
        /** @description Authenticated but not permitted. */
        JsonForbidden: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["JsonError"];
            };
        };
        /** @description Resource not found. */
        JsonNotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["JsonError"];
            };
        };
        /** @description Server error. */
        JsonServerError: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["JsonError"];
            };
        };
    };
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
interface operations {
    getResApiHealth: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Service is up. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/html": string;
                };
            };
        };
    };
    getParcelData: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ParcelLocationRequest"];
            };
        };
        responses: {
            /** @description Parcel data. Shape depends on the `structure` field. Note: a missing/invalid token or missing location produces a plain-text 200 body (see `description`). */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GeoJSONFeatureCollection"] | components["schemas"]["ParcelTree"];
                    "text/html": string;
                };
            };
        };
    };
    getParcelBoundaryData: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ParcelLocationRequestNoStructure"];
            };
        };
        responses: {
            /** @description DXF document, or a plain-text error body on missing token/location. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/dxf": string;
                    "text/html": string;
                };
            };
        };
    };
    getParcelDataNeighbor: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ParcelLocationRequestNoStructure"];
            };
        };
        responses: {
            /** @description GeoJSON FeatureCollection, or a plain-text error body. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GeoJSONFeatureCollection"];
                    "text/html": string;
                };
            };
        };
    };
    getParcelImageGet: {
        parameters: {
            query: {
                /** @description RES API token. */
                token: string;
                /** @description WGS84 latitude. Provide lat+lng or x_3857+y_3857. */
                lat?: number;
                /** @description WGS84 longitude. */
                lng?: number;
                /** @description Web Mercator X. Provide lat+lng or x_3857+y_3857. */
                x_3857?: number;
                /** @description Web Mercator Y. */
                y_3857?: number;
                /** @description Output image width/height in pixels. */
                img_size?: number;
                /** @description Half-extent of the rendered bounding box, in metres. */
                bounding_dist?: number;
                /** @description Render style. */
                style?: "ratio_v_free" | "score" | "red" | "green";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description PNG image, or a plain-text error body. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "image/png": string;
                    "text/html": string;
                };
            };
        };
    };
    getParcelImagePost: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ParcelImageRequest"];
            };
        };
        responses: {
            /** @description PNG image, or a plain-text error body. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "image/png": string;
                    "text/html": string;
                };
            };
        };
    };
    requestBuildingModel: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * Format: email
                     * @description Address the 3D model link is sent to.
                     */
                    target_email: string;
                    /** @description LV95 (EPSG:2056) X coordinate. */
                    x_2056: number;
                    /** @description LV95 (EPSG:2056) Y coordinate. */
                    y_2056: number;
                    /** @description Parcel EGRID. */
                    parcel_id: string;
                };
            };
        };
        responses: {
            /** @description Request acknowledged, or a plain-text error body. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/html": string;
                };
            };
        };
    };
    requestContourData: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * Format: email
                     * @description Address the contour result is sent to.
                     */
                    target_email: string;
                    /** @description Parcel EGRID. */
                    parcel_id: string;
                };
            };
        };
        responses: {
            /** @description Request acknowledged, or a plain-text error body. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/html": string;
                };
            };
        };
    };
    getBuildingData: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @description WGS84 latitude. */
                    lat: number;
                    /** @description WGS84 longitude. */
                    lng: number;
                    /**
                     * @description Search radius for the target building, in metres.
                     * @default 3
                     */
                    radiusMeters?: number;
                    /**
                     * @description Geometry buffer, in metres.
                     * @default 10
                     */
                    buffer_m?: number;
                    /**
                     * @description Selection strategy for the upstream building service.
                     * @default auto
                     */
                    strategy?: string;
                };
            };
        };
        responses: {
            /** @description Building height/volume data passed through from the upstream building service. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
            /** @description Failed to fetch building data. */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonError"];
                };
            };
        };
    };
    getBuildingVolumeBbox: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @description WGS84 latitude. */
                    lat: number;
                    /** @description WGS84 longitude. */
                    lng: number;
                    /**
                     * @description Bounding-box radius, in metres. Must be positive.
                     * @default 100
                     */
                    bbox_radius?: number;
                };
            };
        };
        responses: {
            /** @description Building volume statistics. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        success?: boolean;
                        input?: {
                            lat?: number;
                            lng?: number;
                            bbox_radius_m?: number;
                        };
                        statistics?: {
                            total_building_count?: number;
                            buildings_with_volume?: number;
                            buildings_without_volume?: number;
                            total_volume_m3?: number;
                            avg_volume_m3?: number | null;
                            min_volume_m3?: number | null;
                            max_volume_m3?: number | null;
                            total_footprint_area_m2?: number;
                        };
                        density?: {
                            bbox_area_m2?: number;
                            volume_density_bbox_m3_per_m2?: number;
                            volume_density_footprint_m3_per_m2?: number;
                        };
                    };
                };
            };
            /** @description Missing or invalid token / parameters. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonError"];
                };
            };
            /** @description Wrong token. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonError"];
                };
            };
            /** @description Server error. */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JsonError"];
                };
            };
        };
    };
    getAirQuality: {
        parameters: {
            query: {
                /** @description WGS84 latitude. */
                lat: number;
                /** @description WGS84 longitude. */
                lng: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Air-quality data passed through from Google Air Quality, or a plain-text error body. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: unknown;
                    };
                    "text/html": string;
                };
            };
        };
    };
    getFsoDocs: {
        parameters: {
            query?: {
                /** @description Maximum number of documents to return. */
                limit?: number;
            };
            header?: never;
            path: {
                /** @description Municipality FSO number. */
                fsoNum: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OEREBlex documents. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
            /** @description Upstream OEREBlex request failed. */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": string;
                };
            };
        };
    };
    getSignalData: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Array of parcels with signal counts, or a plain-text error body. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: unknown;
                    }[];
                    "text/html": string;
                };
            };
        };
    };
    getSignalDataAll: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Full signal dataset, or a plain-text error body. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: unknown;
                    }[];
                    "text/html": string;
                };
            };
        };
    };
    getWaterScenarioData: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @description Scenario identifier (used to build `S<n>_*` keys). */
                    scenario_num: string;
                    /** @description Parcel column name to read values from. */
                    parcel_num: string;
                };
            };
        };
        responses: {
            /** @description Water-scenario rows, or a plain-text error body. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: unknown;
                    }[];
                    "text/html": string;
                };
            };
        };
    };
    getPoiCounts: {
        parameters: {
            query: {
                /** @description Search radius, in metres. */
                search_area: number;
                /** @description WGS84 latitude. */
                lat: number;
                /** @description WGS84 longitude. */
                lng: number;
                /** @description When `true`, group counts into amenity clusters. */
                res_group?: "true" | "false";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description POI counts (raw ORS stats, or per-cluster counts when grouped). */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
            400: components["responses"]["JsonBadRequest"];
            401: components["responses"]["MissingTokenText"];
            403: components["responses"]["WrongTokenText"];
            500: components["responses"]["JsonServerError"];
        };
    };
    getPoiDetails: {
        parameters: {
            query: {
                /** @description Search radius, in metres. */
                search_area: number;
                /** @description WGS84 latitude. */
                lat: number;
                /** @description WGS84 longitude. */
                lng: number;
                /** @description Reserved; details are always grouped by cluster. */
                res_group?: "true" | "false";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description POIs grouped by amenity cluster. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: components["schemas"]["PoiDetail"][];
                    };
                };
            };
            400: components["responses"]["JsonBadRequest"];
            401: components["responses"]["MissingTokenText"];
            403: components["responses"]["WrongTokenText"];
            500: components["responses"]["JsonServerError"];
        };
    };
    getPoiDetailsDrivingDistance: {
        parameters: {
            query: {
                /** @description WGS84 latitude. */
                lat: number;
                /** @description WGS84 longitude. */
                lng: number;
                /** @description Isochrone range, in seconds of travel time. */
                range: number;
                /** @description OpenRouteService travel profile (e.g. `driving-car`, `cycling-regular`, `foot-walking`). */
                profile?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description POIs grouped by amenity cluster. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: components["schemas"]["PoiDetail"][];
                    };
                };
            };
            400: components["responses"]["JsonBadRequest"];
            401: components["responses"]["MissingTokenText"];
            403: components["responses"]["WrongTokenText"];
            500: components["responses"]["JsonServerError"];
        };
    };
    getOerebExtractUrl: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ParcelLocationRequestNoStructure"];
            };
        };
        responses: {
            /** @description OEREB extract URL, `no result...`, or a plain-text error body. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/html": string;
                };
            };
        };
    };
    uploadImage: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": {
                    /**
                     * Format: binary
                     * @description Image file (.png/.jpg/.jpeg, max 10 MB).
                     */
                    image: string;
                    /** @description Display name for the image. */
                    image_name: string;
                    /** @description Identifier of the owning user. */
                    user_id: string;
                };
            };
        };
        responses: {
            /** @description Image uploaded. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        message?: string;
                        image_id?: number;
                        file_name?: string;
                        /** Format: uri */
                        access_url?: string;
                    };
                };
            };
            400: components["responses"]["JsonBadRequest"];
            401: components["responses"]["MissingTokenText"];
            403: components["responses"]["WrongTokenText"];
            500: components["responses"]["JsonServerError"];
        };
    };
    getImageById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Image record ID. */
                imageId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The image file. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "image/*": string;
                };
            };
            404: components["responses"]["JsonNotFound"];
            500: components["responses"]["JsonServerError"];
        };
    };
    listUserImages: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Owning user identifier. */
                userId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Image records for the user. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
            401: components["responses"]["MissingTokenText"];
            403: components["responses"]["WrongTokenText"];
            500: components["responses"]["JsonServerError"];
        };
    };
    uploadSwissnovoImage: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": {
                    /**
                     * Format: binary
                     * @description Image file (.png/.jpg/.jpeg/.webp, max 10 MB).
                     */
                    file: string;
                    /** @description Slug of the SwissNovo app saving the image (e.g. `scoore`). */
                    app_source: string;
                    /** @description Optional linked parcel ID; must belong to the same user. */
                    prm_id?: string;
                    /** @description Optional JSON object of extra metadata, sent as a string. */
                    custom_metadata?: string;
                };
            };
        };
        responses: {
            /** @description Image saved. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SwissnovoImage"];
                };
            };
            400: components["responses"]["JsonBadRequest"];
            401: components["responses"]["JsonUnauthorized"];
            403: components["responses"]["JsonForbidden"];
            500: components["responses"]["JsonServerError"];
        };
    };
    listSwissnovoImages: {
        parameters: {
            query?: {
                /** @description Filter by app slug. */
                app_source?: string;
                /** @description Filter by linked parcel ID. */
                prm_id?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The user's saved images. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SwissnovoImage"][];
                };
            };
            401: components["responses"]["JsonUnauthorized"];
            500: components["responses"]["JsonServerError"];
        };
    };
    getSwissnovoImage: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Image record ID. */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The image record. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SwissnovoImage"];
                };
            };
            401: components["responses"]["JsonUnauthorized"];
            404: components["responses"]["JsonNotFound"];
            500: components["responses"]["JsonServerError"];
        };
    };
    deleteSwissnovoImage: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Image record ID. */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Image deleted. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        message?: string;
                        id?: string;
                    };
                };
            };
            401: components["responses"]["JsonUnauthorized"];
            404: components["responses"]["JsonNotFound"];
            500: components["responses"]["JsonServerError"];
        };
    };
    collectSignal: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @description Slug of the originating SwissNovo app. */
                    app_name: string;
                    /** @description Action being recorded (e.g. `address_search`). */
                    user_action: string;
                    /** @description Parcel EGRID, if already known. */
                    parcel_id?: string;
                    /** @description User's WGS84 latitude. */
                    lat?: number;
                    /** @description User's WGS84 longitude. */
                    lng?: number;
                    /** @description Address the action targeted. */
                    target_address?: string;
                    /** @description Target WGS84 latitude (used for parcel lookup). */
                    target_lat?: number;
                    /** @description Target WGS84 longitude (used for parcel lookup). */
                    target_lng?: number;
                    /** @description Free-form additional metadata. */
                    meta_data?: {
                        [key: string]: unknown;
                    };
                };
            };
        };
        responses: {
            /** @description Signal recorded. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        success?: boolean;
                        message?: string;
                    };
                };
            };
            400: components["responses"]["JsonBadRequest"];
            500: components["responses"]["JsonServerError"];
        };
    };
    listSignals: {
        parameters: {
            query?: {
                /** @description Page size. */
                limit?: number;
                /** @description Page offset. */
                offset?: number;
                /** @description Filter by app slug. */
                app_name?: string;
                /** @description Filter by user country code. */
                country?: string;
                /** @description Inclusive lower bound on `created_at`. */
                start_date?: string;
                /** @description Inclusive upper bound on `created_at`. */
                end_date?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Paginated signals. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data?: components["schemas"]["SignalRecord"][];
                        pagination?: components["schemas"]["Pagination"];
                    };
                };
            };
            500: components["responses"]["JsonServerError"];
        };
    };
    listSignalsByParcel: {
        parameters: {
            query?: {
                /** @description Page size. */
                limit?: number;
                /** @description Page offset. */
                offset?: number;
                /** @description Filter by app slug. */
                app_name?: string;
                /** @description Filter by user country code. */
                country?: string;
                /** @description Inclusive lower bound on `created_at`. */
                start_date?: string;
                /** @description Inclusive upper bound on `created_at`. */
                end_date?: string;
            };
            header?: never;
            path: {
                /** @description Target parcel EGRID. */
                parcel_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Paginated signals for the parcel. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data?: components["schemas"]["SignalRecord"][];
                        pagination?: components["schemas"]["Pagination"];
                        parcel_id?: string;
                    };
                };
            };
            500: components["responses"]["JsonServerError"];
        };
    };
    getSignalStats: {
        parameters: {
            query?: {
                /** @description Inclusive lower bound (used together with `end_date`). */
                start_date?: string;
                /** @description Inclusive upper bound (used together with `start_date`). */
                end_date?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Aggregated statistics. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        by_app?: {
                            app_name?: string;
                            /** @description Count as returned by PostgreSQL (string). */
                            count?: string;
                        }[];
                        by_country?: {
                            user_country?: string | null;
                            count?: string;
                        }[];
                        daily_activity?: {
                            /** Format: date-time */
                            date?: string;
                            count?: string;
                        }[];
                    };
                };
            };
            500: components["responses"]["JsonServerError"];
        };
    };
    deleteSignal: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Signal record ID. */
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Signal deleted. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        success?: boolean;
                        message?: string;
                    };
                };
            };
            404: components["responses"]["JsonNotFound"];
            500: components["responses"]["JsonServerError"];
        };
    };
}

/** Production RES API host. */
declare const RES_API_BASE_URL = "https://res.zeroo.ch";
interface ResApiClientOptions {
    /** Base URL of the RES API (or of an app's proxy). Defaults to production. */
    baseUrl?: string;
    /**
     * RES API token, sent as the `token` header. Provide for server-side use
     * only — never ship it to the browser.
     */
    token?: string;
    /** Optional `fetch` implementation, e.g. for tests or non-browser runtimes. */
    fetch?: typeof globalThis.fetch;
}
/** A fully typed RES API client, as returned by {@link createResApiClient}. */
type ResApiClient = Client<paths>;
/**
 * Create a typed RES API client.
 *
 * @example
 * // Server-side (Vercel function / Node):
 * const res = createResApiClient({ token: process.env.RES_TOKEN });
 * const { data, error } = await res.POST('/res_api/parcel_data', {
 *   body: { lat: 47.3769, lng: 8.5417, structure: 'tree' },
 * });
 */
declare function createResApiClient(options?: ResApiClientOptions): ResApiClient;

/** Convenience aliases for the most-used RES API data shapes. */
type JsonError = components['schemas']['JsonError'];
type ParcelTree = components['schemas']['ParcelTree'];
type GeoJSONFeatureCollection = components['schemas']['GeoJSONFeatureCollection'];
type PoiDetail = components['schemas']['PoiDetail'];
type SignalRecord = components['schemas']['SignalRecord'];
type SwissnovoImage = components['schemas']['SwissnovoImage'];
type Coordinates = components['schemas']['Coordinates'];

export { type AuthContextValue, AuthProvider, type AuthStatus, type ChangeItem, type ChangeKind, type ChatTurn, ClaireAssistant, type ClaireAssistantProps, type ClaireContext, type ClaireTurn, type Coordinates, type GeminiCallOptions, GeminiConfigError, type GeoJSONFeatureCollection, type JsonError, KIND_META, type Locale, type ParcelContextInput, type ParcelTree, type PoiDetail, RELEASE_NOTES_STRINGS, RES_API_BASE_URL, type Release, ReleaseNotesButton, type ReleaseNotesButtonProps, ReleaseNotesPanel, type ReleaseNotesPanelProps, type ReleaseNotesStrings, type ResApiClient, type ResApiClientOptions, SSO_ATTEMPTED_KEY, type SignalRecord, type SwissnovoImage, buildParcelContextSummary, type components, createResApiClient, fetchClaireContext, generateParcelChatReply, getAuthToken, getExistingUser, getReleaseNotesStrings, loadClaireConversation, type operations, type paths, saveClaireConversation, sendClaireMessageSignal, stripAuthParams, urlHasAuthParams, useAuth, userManager };
