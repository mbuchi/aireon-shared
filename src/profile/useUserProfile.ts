// React binding for the unified profile store.
//
// Every consumer of `useUserProfile` shares one profile: change the avatar in
// the ProfileModal and the header avatar updates instantly, in the same tab
// and (via the store's broadcast) every other mounted component.

import { useCallback, useEffect, useState } from 'react';
import type { User } from 'oidc-client-ts';
import { avatarUrlById } from './avatars';
import {
  getProfile,
  hydrateFromRemote,
  subscribe,
  updateProfile as storeUpdateProfile,
  type SwissnovoProfile,
} from './profileStore';

export interface UseUserProfileResult {
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
export function useUserProfile(user: User | null | undefined): UseUserProfileResult {
  const [profile, setProfileState] = useState<SwissnovoProfile>(() => getProfile());
  const accessToken = user && !user.expired ? user.access_token : undefined;

  // Keep this component in step with every other profile consumer.
  useEffect(() => subscribe(setProfileState), []);

  // Once signed in, adopt a profile that may have been set on another device.
  useEffect(() => {
    if (!accessToken) return;
    void hydrateFromRemote(accessToken);
  }, [accessToken]);

  const updateProfile = useCallback(
    (patch: Partial<SwissnovoProfile>) => {
      storeUpdateProfile(patch, accessToken);
    },
    [accessToken],
  );

  const setAvatarId = useCallback(
    (id: string) => {
      storeUpdateProfile({ avatar_id: id }, accessToken);
    },
    [accessToken],
  );

  return {
    profile,
    avatarId: profile.avatar_id,
    avatarUrl: avatarUrlById(profile.avatar_id),
    setAvatarId,
    updateProfile,
  };
}
