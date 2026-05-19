// The suite-standard "View profile" modal.
//
// One surface for the whole SwissNovo suite: it shows the user's identity and
// the avatar they actually chose, lets them change that avatar from the
// catalogue, and edit a few profile details. Backed by `useUserProfile`, so
// the avatar shown here and in every app header is always the same one.

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, X } from 'lucide-react';
import type { User } from 'oidc-client-ts';
import { Avatar } from './Avatar';
import { avatarOptions, avatarUrl } from './avatars';
import { emailOf, fullNameOf, initialsOf } from './identity';
import { useUserProfile } from './useUserProfile';
import type { Gender, SwissnovoProfile } from './profileStore';

export interface ProfileModalProps {
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

const GENDER_OPTIONS: Array<{ value: Gender; label: string }> = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'unspecified', label: 'Prefer not to say' },
];

/** The standard SwissNovo profile modal. Render it only while open. */
export function ProfileModal({ user, onClose, dark = false }: ProfileModalProps) {
  const { profile, avatarId, avatarUrl: chosenUrl, setAvatarId, updateProfile } =
    useUserProfile(user);

  // Avatar changes apply instantly; the text/select details use a draft so a
  // RES sync only fires when the user explicitly saves.
  const [draft, setDraft] = useState<Pick<SwissnovoProfile, 'gender' | 'age' | 'about'>>({
    gender: profile.gender,
    age: profile.age,
    about: profile.about,
  });

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const name = fullNameOf(user) || initialsOf(user);
  const email = emailOf(user);
  const initials = initialsOf(user);

  const dirty = useMemo(
    () =>
      draft.gender !== profile.gender ||
      draft.age !== profile.age ||
      draft.about !== profile.about,
    [draft, profile],
  );

  function handleSave() {
    updateProfile(draft);
    onClose();
  }

  return createPortal(
    <div
      className={`${dark ? 'dark ' : ''}fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Profile"
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-sm flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'swn-profile-in 0.22s cubic-bezier(0.34,1.56,0.64,1) both' }}
      >
        {/* Header */}
        <div className="relative h-24 shrink-0 bg-gradient-to-br from-blue-500 to-cyan-500">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="-mt-12 flex-1 overflow-y-auto px-5 pb-5">
          {/* Identity */}
          <div className="flex flex-col items-center">
            <span className="rounded-full border-4 border-white bg-white dark:border-gray-800">
              <Avatar url={chosenUrl} initials={initials} size={88} />
            </span>
            <div className="mt-3 text-center">
              <div className="max-w-[16rem] truncate text-base font-semibold text-gray-900 dark:text-gray-100">
                {name}
              </div>
              {email && (
                <div className="max-w-[16rem] truncate text-xs text-gray-500 dark:text-gray-400">
                  {email}
                </div>
              )}
              <div className="mt-1.5 flex items-center justify-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                <span className="text-[11px] font-medium text-green-600 dark:text-green-400">
                  Active session
                </span>
              </div>
            </div>
          </div>

          {/* Avatar picker */}
          <div className="mt-5">
            <div className="mb-2 text-xs font-medium text-gray-700 dark:text-gray-300">
              Choose your avatar
            </div>
            <p className="mb-3 text-[11px] text-gray-500 dark:text-gray-400">
              Your pick follows you across every Swissnovo app.
            </p>
            <div className="grid grid-cols-4 gap-2.5">
              {avatarOptions.map((opt) => {
                const selected = opt.id === avatarId;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAvatarId(opt.id)}
                    title={opt.label}
                    aria-label={opt.label}
                    aria-pressed={selected}
                    className={`relative aspect-square rounded-xl border-2 transition-all ${
                      selected
                        ? 'border-blue-500 ring-2 ring-blue-500/30'
                        : 'border-gray-200 bg-gray-50 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-900/40 dark:hover:border-gray-500'
                    }`}
                  >
                    <img src={avatarUrl(opt)} alt={opt.label} className="h-full w-full rounded-lg" />
                    {selected && (
                      <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white shadow">
                        <Check size={12} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details */}
          <div className="mt-5 space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Gender
              </label>
              <select
                value={draft.gender}
                onChange={(e) => setDraft((d) => ({ ...d, gender: e.target.value as Gender }))}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
              >
                {GENDER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Age
              </label>
              <input
                type="number"
                min={0}
                max={120}
                value={draft.age ?? ''}
                onChange={(e) => {
                  const v = e.target.value;
                  setDraft((d) => ({
                    ...d,
                    age: v === '' ? null : Math.max(0, Math.min(120, Number(v))),
                  }));
                }}
                placeholder="—"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                About
              </label>
              <textarea
                rows={3}
                value={draft.about}
                onChange={(e) => setDraft((d) => ({ ...d, about: e.target.value }))}
                placeholder="A short bio (optional)"
                className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!dirty}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes swn-profile-in{from{opacity:0;transform:scale(0.9) translateY(12px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </div>,
    document.body,
  );
}
