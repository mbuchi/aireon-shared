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
  GeminiConfigError,
} from './claire/geminiClient';
export type {
  ChatTurn,
  ParcelContextInput,
  GeminiCallOptions,
} from './claire/geminiClient';
export {
  loadClaireConversation,
  saveClaireConversation,
} from './claire/claireConversation';
export type { ClaireTurn } from './claire/claireConversation';
export { sendClaireMessageSignal } from './claire/signal';
export { fetchClaireContext } from './claire/claireContext';
export type { ClaireContext } from './claire/claireContext';
export { fetchClairePOIs } from './claire/clairePOIs';
export type { ClairePOIs } from './claire/clairePOIs';
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
