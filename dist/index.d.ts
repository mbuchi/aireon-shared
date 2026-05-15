import * as react from 'react';
import { LucideIcon } from 'lucide-react';
import * as react_jsx_runtime from 'react/jsx-runtime';

type ChangeKind = 'new' | 'improved' | 'fixed' | 'docs';
interface ChangeItem {
    kind: ChangeKind;
    icon: LucideIcon;
    text: string;
    prs: number[];
}
interface Release {
    version: string;
    date: string;
    codename: string;
    summary: string;
    highlight?: boolean;
    items: ChangeItem[];
}
declare const KIND_META: Record<ChangeKind, {
    label: string;
    classes: string;
    dot: string;
}>;

interface ReleaseNotesPanelProps {
    /** Called when the panel finishes its close animation. */
    onClose: () => void;
    /** The app's release history, newest first. */
    releases: Release[];
    /** GitHub repo URL, used to link PRs (e.g. https://github.com/mbuchi/boom). */
    repoUrl: string;
    /** Brand name letters before the red "oo" (e.g. "b" for boom). */
    brandPrefix: string;
    /** Brand name letters after the red "oo" (e.g. "m" for boom). */
    brandSuffix?: string;
    /** Stacking context for the overlay. Defaults to 60; raise it for apps with high-z headers. */
    zIndex?: number;
}
declare function ReleaseNotesPanel({ onClose, releases, repoUrl, brandPrefix, brandSuffix, zIndex, }: ReleaseNotesPanelProps): react.ReactPortal;

interface ReleaseNotesButtonProps {
    /** The app's release history, newest first. */
    releases: Release[];
    /** localStorage key for unread tracking — namespace per app, e.g. "boom:lastSeenReleaseVersion". */
    storageKey: string;
    /** GitHub repo URL, used to link PRs. */
    repoUrl: string;
    /** Brand name letters before the red "oo". */
    brandPrefix: string;
    /** Brand name letters after the red "oo". */
    brandSuffix?: string;
    /** Stacking context for the panel overlay. Defaults to 60. */
    zIndex?: number;
    /** Extra classes for the pill button. */
    className?: string;
}
declare function ReleaseNotesButton({ releases, storageKey, repoUrl, brandPrefix, brandSuffix, zIndex, className, }: ReleaseNotesButtonProps): react_jsx_runtime.JSX.Element;

export { type ChangeItem, type ChangeKind, KIND_META, type Release, ReleaseNotesButton, type ReleaseNotesButtonProps, ReleaseNotesPanel, type ReleaseNotesPanelProps };
