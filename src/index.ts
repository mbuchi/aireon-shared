export { default as ReleaseNotesPanel } from './releaseNotes/ReleaseNotesPanel';
export { default as ReleaseNotesButton } from './releaseNotes/ReleaseNotesButton';
export { KIND_META } from './releaseNotes/types';
export type { ChangeKind, ChangeItem, Release } from './releaseNotes/types';
export type { ReleaseNotesPanelProps } from './releaseNotes/ReleaseNotesPanel';
export type { ReleaseNotesButtonProps } from './releaseNotes/ReleaseNotesButton';
export { RELEASE_NOTES_STRINGS, getReleaseNotesStrings } from './releaseNotes/i18n';
export type { Locale, ReleaseNotesStrings } from './releaseNotes/i18n';

export { AuthProvider, useAuth } from './auth/AuthProvider';
export type { AuthContextValue, AuthStatus } from './auth/AuthProvider';
export {
  userManager,
  getExistingUser,
  getAuthToken,
  urlHasAuthParams,
  stripAuthParams,
  SSO_ATTEMPTED_KEY,
} from './auth/userManager';
