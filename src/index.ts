export { default as ReleaseNotesPanel } from './releaseNotes/ReleaseNotesPanel';
export { default as ReleaseNotesButton } from './releaseNotes/ReleaseNotesButton';
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
export { CLAIRE_LOGO_DATA_URI, CLAIRE_LOGO_SVG } from './claire/claireLogo';
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

// Suite-default data primitives — TanStack Table / Virtual.
export { DataTable, DATA_TABLE_STRINGS_EN } from './table/DataTable';
export type { DataTableProps, DataTableStrings } from './table/DataTable';
export { VirtualList } from './list/VirtualList';
export type { VirtualListProps } from './list/VirtualList';
// Re-export the TanStack building blocks apps need to define columns, so they
// can import everything from '@aireon/shared' without a direct dependency.
export { createColumnHelper, flexRender } from '@tanstack/react-table';
export type { ColumnDef, Row, CellContext } from '@tanstack/react-table';
