export { default as ReleaseNotesPanel } from './releaseNotes/ReleaseNotesPanel';
export { default as ReleaseNotesButton } from './releaseNotes/ReleaseNotesButton';
export { KIND_META } from './releaseNotes/types';
export type { ChangeKind, ChangeItem, Release } from './releaseNotes/types';
export type { ReleaseNotesPanelProps } from './releaseNotes/ReleaseNotesPanel';
export type { ReleaseNotesButtonProps } from './releaseNotes/ReleaseNotesButton';
export { RELEASE_NOTES_STRINGS, getReleaseNotesStrings } from './releaseNotes/i18n';
export type { Locale, ReleaseNotesStrings } from './releaseNotes/i18n';

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
