import { type ReactNode, useCallback, useRef } from 'react';
import { CheckCircle } from 'lucide-react';
import ReleaseNotesPanel from './ReleaseNotesPanel';
import { useReleaseNotes } from './useReleaseNotes';
import type { Release } from './types';
import { getReleaseNotesStrings, type Locale } from './i18n';

export interface ReleaseNotesButtonProps {
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

export default function ReleaseNotesButton({
  releases,
  locale = 'en',
  storageKey,
  repoUrl,
  brandPrefix,
  brandSuffix = '',
  brandNode,
  zIndex,
  className,
}: ReleaseNotesButtonProps) {
  const t = getReleaseNotesStrings(locale);
  const currentVersion = releases[0].version;
  const { hasUnread, isOpen: open, openPanel, closePanel } = useReleaseNotes({
    currentVersion,
    storageKey,
  });
  const closeRef = useRef<(() => void) | null>(null);

  // Clicking the version pill toggles the panel: open it, or dismiss it if
  // already open (animated close via the panel's own handler).
  const handleToggle = useCallback(() => {
    if (open) {
      if (closeRef.current) closeRef.current();
      else closePanel();
    } else {
      openPanel();
    }
  }, [open, openPanel, closePanel]);

  return (
    <>
      <button
        onClick={handleToggle}
        aria-expanded={open}
        title={`${t.whatsNew} — v${currentVersion}`}
        aria-label={`${t.whatsNew} — v${currentVersion}`}
        className={`relative hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-lg transition-colors text-gray-600 hover:text-red-700 hover:bg-red-50 dark:text-gray-300 dark:hover:text-red-300 dark:hover:bg-red-500/10 ${className ?? ''}`}
      >
        <CheckCircle size={18} />
        {hasUnread && (
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        )}
      </button>
      {open && (
        <ReleaseNotesPanel
          onClose={closePanel}
          closeRef={closeRef}
          locale={locale}
          releases={releases}
          repoUrl={repoUrl}
          brandPrefix={brandPrefix}
          brandSuffix={brandSuffix}
          brandNode={brandNode}
          zIndex={zIndex}
        />
      )}
    </>
  );
}
