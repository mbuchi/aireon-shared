import { useCallback, useEffect, useState } from 'react';

/**
 * Headless controller for the release-notes ("What's new" / "Changes") panel.
 *
 * Splits the unread-tracking + open/close logic out of {@link ReleaseNotesButton}
 * so the panel can be driven from anywhere — most importantly a menu item inside
 * the user-avatar dropdown (the suite-standard "More tools" overflow) rather than
 * a dedicated toolbar button.
 *
 * Usage with the dropdown pattern:
 * ```tsx
 * const rn = useReleaseNotes({ currentVersion: RELEASES[0].version, storageKey: 'app:lastSeenReleaseVersion' });
 * // toolbar item:  { key: 'changes', label, icon, dot: rn.hasUnread, onClick: rn.openPanel }
 * // mounted panel: {rn.isOpen && <ReleaseNotesPanel onClose={rn.closePanel} releases={RELEASES} .../>}
 * ```
 */
const HASH = '#release-notes';

export interface UseReleaseNotesOptions {
  /** The current (newest) release version, e.g. `RELEASES[0].version`. */
  currentVersion: string;
  /** localStorage key for unread tracking — namespace per app, e.g. "app:lastSeenReleaseVersion". */
  storageKey: string;
}

export interface ReleaseNotesController {
  /** True until the user has opened the panel on the current version. */
  hasUnread: boolean;
  /** Whether the panel is currently open. */
  isOpen: boolean;
  /** Open the panel (and reflect it in the URL hash for deep-linking). */
  openPanel: () => void;
  /**
   * Mark the current version seen, clear the unread flag, and close the panel.
   * Pass this straight to `ReleaseNotesPanel.onClose`.
   */
  closePanel: () => void;
}

export function useReleaseNotes({
  currentVersion,
  storageKey,
}: UseReleaseNotesOptions): ReleaseNotesController {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    try {
      const lastSeen = localStorage.getItem(storageKey);
      if (lastSeen !== currentVersion) setHasUnread(true);
    } catch {
      /* private mode etc. */
    }

    if (window.location.hash === HASH) setIsOpen(true);

    const onHash = () => {
      if (window.location.hash === HASH) setIsOpen(true);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [storageKey, currentVersion]);

  const openPanel = useCallback(() => {
    setIsOpen(true);
    if (window.location.hash !== HASH) {
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${window.location.search}${HASH}`,
      );
    }
  }, []);

  const closePanel = useCallback(() => {
    setIsOpen(false);
    setHasUnread(false);
    try {
      localStorage.setItem(storageKey, currentVersion);
    } catch {
      /* ignore */
    }
    if (window.location.hash === HASH) {
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${window.location.search}`,
      );
    }
  }, [storageKey, currentVersion]);

  return { hasUnread, isOpen, openPanel, closePanel };
}

export default useReleaseNotes;
