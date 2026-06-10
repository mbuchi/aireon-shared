// Unified user-profile module — one avatar, one "View profile", suite-wide.

export { ProfileModal } from './ProfileModal';
export type { ProfileModalProps } from './ProfileModal';

export { Avatar } from './Avatar';
export type { AvatarProps } from './Avatar';

export { useUserProfile } from './useUserProfile';
export type { UseUserProfileResult } from './useUserProfile';

export {
  avatarOptions,
  avatarUrl,
  avatarUrlById,
  avatarUrlFromSeed,
} from './avatars';
export type { AvatarOption, AvatarGroup } from './avatars';

export {
  emailOf,
  fullNameOf,
  firstNameOf,
  initialsOf,
  pictureOf,
} from './identity';

export {
  getProfile,
  subscribe as subscribeProfile,
  updateProfile,
  fetchRemoteProfile,
  hydrateFromRemote,
  defaultProfile,
} from './profileStore';
export type { SwissnovoProfile, Gender } from './profileStore';
