// Brand — the canonical Aireon wordmark (inline SVG, themeable via
// currentColor) and the back-to-hub badge apps drop into their navbars.
export { AireonLogo, default as AireonLogoDefault } from './brand/AireonLogo';
export type { AireonLogoProps } from './brand/AireonLogo';
export { AireonHubLink, default as AireonHubLinkDefault } from './brand/AireonHubLink';
export type { AireonHubLinkProps } from './brand/AireonHubLink';
export {
  AIREON_LOGO_PATH,
  AIREON_LOGO_VIEWBOX,
  AIREON_LOGO_ASPECT,
} from './brand/aireonLogoPath';

export { default as ReleaseNotesPanel } from './releaseNotes/ReleaseNotesPanel';
export { default as ReleaseNotesButton } from './releaseNotes/ReleaseNotesButton';
export { useReleaseNotes } from './releaseNotes/useReleaseNotes';
export type {
  UseReleaseNotesOptions,
  ReleaseNotesController,
} from './releaseNotes/useReleaseNotes';
export { KIND_META } from './releaseNotes/types';
export type { ChangeKind, ChangeItem, Release } from './releaseNotes/types';
export type { ReleaseNotesPanelProps } from './releaseNotes/ReleaseNotesPanel';
export type { ReleaseNotesButtonProps } from './releaseNotes/ReleaseNotesButton';
export { RELEASE_NOTES_STRINGS, getReleaseNotesStrings } from './releaseNotes/i18n';
export type { Locale, ReleaseNotesStrings } from './releaseNotes/i18n';

export { LocaleSelector, default as LocaleSelectorDefault } from './i18n/LocaleSelector';
export type { LocaleSelectorProps } from './i18n/LocaleSelector';

export { SavedParcelsModal } from './prm/SavedParcelsModal';
export type { SavedParcelsModalProps } from './prm/SavedParcelsModal';
export {
  fetchPrmRecords,
  fetchPrmByParcel,
  createPrmRecord,
  updatePrmState,
  updatePrmPriority,
  updatePrmTags,
  deletePrmRecord,
  AuthRequiredError as PrmAuthRequiredError,
  PRM_STATES,
  PRM_PRIORITIES,
  PROOM_APP_URL,
  TOOLBOX_APP_URL,
  GEOPOOL_APP_URL,
  LEGACY_PROOM_APP_URL,
  LEGACY_TOOLBOX_APP_URL,
  LEGACY_GEOPOOL_APP_URL,
} from './prm/api';
export type {
  PrmRecord,
  PrmState,
  PrmPriority,
  CreatePrmInput,
} from './prm/api';
export {
  SAVED_PARCELS_STRINGS,
  getSavedParcelsStrings,
} from './prm/i18n';
export type {
  Locale as PrmLocale,
  SavedParcelsStrings,
} from './prm/i18n';

export { AuthProvider, useAuth } from './auth/AuthProvider';
export type {
  AuthContextValue,
  AuthStatus,
  AuthProviderProps,
} from './auth/AuthProvider';
export { default as LoginModal } from './auth/LoginModal';
export type { LoginModalProps, LoginModalFeature } from './auth/LoginModal';
export {
  userManager,
  getExistingUser,
  getAuthToken,
  urlHasAuthParams,
  stripAuthParams,
  SSO_ATTEMPTED_KEY,
} from './auth/userManager';

export { default as ClaireAssistant } from './claire/ClaireAssistant';
export type { ClaireAssistantProps } from './claire/ClaireAssistant';
export {
  buildParcelContextSummary,
  generateParcelChatReply,
  streamParcelChatReply,
  GeminiConfigError,
} from './claire/geminiClient';
export type {
  ChatTurn,
  ParcelContextInput,
  GeminiCallOptions,
  StreamParcelChatReplyOptions,
} from './claire/geminiClient';
export { startVoiceCall } from './claire/voiceCall';
export type {
  CallMode,
  CallRole,
  StartVoiceCallOptions,
  VoiceCallCallbacks,
  VoiceCallSession,
} from './claire/voiceCall';
export {
  listClaireConversations,
  loadClaireConversation,
  saveClaireConversation,
} from './claire/claireConversation';
export type {
  ClaireConversationSummary,
  ClaireTurn,
} from './claire/claireConversation';
export { sendClaireMessageSignal } from './claire/signal';
export { fetchClaireContext } from './claire/claireContext';
export type { ClaireContext } from './claire/claireContext';
export { fetchClairePOIs } from './claire/clairePOIs';
export type { ClairePOIs, ClairePoiMapPoint } from './claire/clairePOIs';
export { computeLocationScore } from './claire/claireScore';
export type { LocationScore } from './claire/claireScore';
export {
  SWISSNOVO_SUITE_BLURB,
  SWISSNOVO_APP_CATALOG,
} from './claire/claireAppCatalog';

export { createSignalClient } from './signal/client';
export type {
  SignalClient,
  SignalClientOptions,
  SignalTarget,
} from './signal/client';

export {
  createErrorLogger,
  installErrorLogging,
  ErrorLogBoundary,
  BugReportButton,
  BUG_REPORT_STRINGS,
  getBugReportStrings,
} from './errorlog';
export type {
  ErrorLogger,
  ErrorLoggerOptions,
  ErrorLogContext,
  ErrorSeverity,
  ErrorKind,
  ErrorLogBoundaryProps,
  BugReportButtonProps,
  BugReportStrings,
} from './errorlog';

export {
  initOpenReplay,
  identifyOpenReplayUser,
  stopOpenReplay,
} from './openreplay';
export type { OpenReplay, OpenReplayOptions } from './openreplay';

export { LocalStorageCache, IndexedDBCache } from './cache';
export type { IndexedDBCacheOptions } from './cache';

export {
  getFlagByBfs,
  getFlagsByCanton,
  getAllFlags,
  fetchFlagSvgMarkup,
  isSvgFlagUrl,
  getFlagApiBase,
  setFlagApiBase,
  clearFlagCache,
  FlagApiError,
  useMunicipalityFlag,
  MunicipalityFlag,
} from './flags';
export type {
  FlagRecord,
  FlagImageMode,
  FlagFetchOptions,
  UseMunicipalityFlagResult,
  MunicipalityFlagProps,
} from './flags';

export { Skeleton, SkeletonText, SkeletonGroup } from './skeleton/Skeleton';
export type {
  SkeletonProps,
  SkeletonTextProps,
  SkeletonProviderProps,
} from './skeleton/Skeleton';

export { ProfileModal, Avatar, useUserProfile } from './profile';
export type {
  ProfileModalProps,
  AvatarProps,
  UseUserProfileResult,
  AvatarOption,
  SwissnovoProfile,
  Gender,
} from './profile';
export {
  avatarOptions,
  avatarUrl,
  avatarUrlById,
  avatarUrlFromSeed,
  emailOf,
  fullNameOf,
  firstNameOf,
  initialsOf,
  pictureOf,
  getProfile,
  subscribeProfile,
  updateProfile,
  fetchRemoteProfile,
  hydrateFromRemote,
  defaultProfile,
} from './profile';

export { createResApiClient, RES_API_BASE_URL } from './api';
export type {
  ResApiClient,
  ResApiClientOptions,
  paths,
  components,
  operations,
  JsonError,
  ParcelTree,
  GeoJSONFeatureCollection,
  PoiDetail,
  SignalRecord,
  SwissnovoImage,
  Coordinates,
} from './api';

export {
  GEMINI_FALLBACK_CHAIN,
  isRetriableGeminiStatus,
  buildGeminiModelChain,
  fetchGeminiWithFallback,
} from './gemini';
export type {
  GeminiFallbackOptions,
  GeminiFallbackAttempt,
  GeminiFallbackResult,
} from './gemini';

export { useFocusTrap } from './hooks/useFocusTrap';
export type { UseFocusTrapOptions } from './hooks/useFocusTrap';

export { Z_INDEX } from './theme/zindex';
export type { ZIndexKey } from './theme/zindex';

export { Portal } from './portal/Portal';
export type { PortalProps } from './portal/Portal';

export { MapUserMenu, default as MapUserMenuDefault } from './map/MapUserMenu';
export type { MapUserMenuAction, MapUserMenuLabels, MapUserMenuProps } from './map/MapUserMenu';
export {
  ScooreMiniMap,
  default as ScooreMiniMapDefault,
  SCOORE_CATEGORY_COLORS,
  SCOORE_RADIUS_CIRCLES,
  createScooreCircleGeoJSON,
} from './map/ScooreMiniMap';
export type { ScooreMiniMapLabels, ScooreMiniMapProps } from './map/ScooreMiniMap';

// Suite-standard swisstopo aerial thumbnail for parcel info panels — a small
// SWISSIMAGE orthophoto that expands to a full-screen lightbox. Engine- and
// i18n-agnostic (plain <img>, strings injected via `labels`), so every
// map-first parcel app renders the same one instead of forking a copy.
export {
  ParcelAerialThumbnail,
  default as ParcelAerialThumbnailDefault,
  buildSwisstopoAerialUrl,
  aerialThumbnailZoom,
} from './map/ParcelAerialThumbnail';
export type {
  ParcelAerialThumbnailLabels,
  ParcelAerialThumbnailProps,
} from './map/ParcelAerialThumbnail';

// Suite-wide parcel-interaction zoom gate — the single threshold + predicate
// every map-first app uses so hover-highlight and click-to-select only come
// alive once the map is zoomed past block level (and stay in lock-step).
export {
  PARCEL_INTERACTION_MIN_ZOOM,
  isParcelInteractive,
  wireZoomGatedParcelClick,
} from './map/parcelInteraction';
export type { ZoomGatedClickMap } from './map/parcelInteraction';

// Mapbox-hosted style → MapLibre loader for the suite's maplibre-gl renderer
// migration. Engine-agnostic (rewrites mapbox:// → https + token, fetches +
// caches), so mapbox-gl/maplibre-gl both stay optional peers.
export {
  loadMapboxStyleForMapLibre,
  normalizeMapboxStyle,
  normalizeMapboxResourceUrl,
} from './map/maplibreStyle';
export type { MapboxStyleLike, LoadMapboxStyleOptions } from './map/maplibreStyle';

// Responsive top-bar action cluster — collapses overflowing buttons into a ⋯
// "More" menu on mobile (priority+ pattern); desktop stays a plain inline row.
export { OverflowNav, default as OverflowNavDefault } from './nav/OverflowNav';
export type {
  OverflowNavItem,
  OverflowNavProps,
  OverflowNavMode,
} from './nav/OverflowNav';

// Variant-1 "Toolbar Lab" navbar primitives — monochrome icon button + the
// cross-app "Open with" menu (open a picked location in another suite app).
export { NavIconButton, default as NavIconButtonDefault } from './nav/NavIconButton';
export type { NavIconButtonProps } from './nav/NavIconButton';
export { OpenWithMenu, default as OpenWithMenuDefault } from './nav/OpenWithMenu';
export type { OpenWithMenuProps } from './nav/OpenWithMenu';
export {
  LAUNCH_APPS,
  LAUNCH_DEFAULT_ZOOM,
  buildDeepLink,
  openInApp,
} from './nav/launchApps';
export type { LaunchApp } from './nav/launchApps';

// Suite-default data primitives — TanStack Table / Virtual.
export { DataTable, DATA_TABLE_STRINGS_EN } from './table/DataTable';
export type { DataTableProps, DataTableStrings } from './table/DataTable';
export { VirtualList } from './list/VirtualList';
export type { VirtualListProps } from './list/VirtualList';
// Re-export the TanStack building blocks apps need to define columns, so they
// can import everything from '@aireon/shared' without a direct dependency.
export { createColumnHelper, flexRender } from '@tanstack/react-table';
export type { ColumnDef, Row, CellContext } from '@tanstack/react-table';
