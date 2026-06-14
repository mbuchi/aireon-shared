import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Check, ChevronUp, Copy, ExternalLink, MapPin, X } from 'lucide-react';
import { Z_INDEX } from '../theme/zindex';
import {
  ParcelAerialThumbnail,
  type ParcelAerialThumbnailLabels,
} from './ParcelAerialThumbnail';
import { LAUNCH_APPS, openInApp, type LaunchApp } from '../nav/launchApps';

/**
 * `ParcelPanelShell` — the suite-standard chrome for a map-first app's
 * parcel-click side panel.
 *
 * It owns the three regions every parcel panel shares, so individual apps stop
 * re-implementing them (and drifting):
 *
 *   ┌───────────────────────────────┐
 *   │ FIXED HEADER (shrink-0)        │  badges · actions · close
 *   │  [aerial]  title              │  aerial thumbnail + address
 *   │            subtitle           │  zip · city · canton
 *   │  EGRID 1234…            ⧉     │  parcel-id chip (+ copy)
 *   │  …headerExtras…               │  app-specific extra rows
 *   ├───────────────────────────────┤
 *   │ SCROLLABLE BODY (flex-1)      │  children — each app's focus content
 *   │  …                            │
 *   ├───────────────────────────────┤
 *   │ FIXED FOOTER (shrink-0)        │  primary action — "Open in" drop-up
 *   └───────────────────────────────┘
 *
 * The top (aerial · address · parcel id · status badges) and the bottom
 * (primary action) are standardized; the middle is a free `children` slot so
 * each app keeps its own focus content (valuation hero, zoning, scoring …).
 *
 * Lifted from valoo's reference panel: the mobile drag-to-close bottom-sheet,
 * focus management (focus close on mount, restore on unmount), and the desktop
 * right-edge side-sheet are all built in, so every adopting app gets the same
 * polish for free. Engine- and i18n-agnostic: the four aerial strings + the
 * chrome strings arrive via `labels`, the suite label-injection pattern.
 */

export interface ParcelPanelShellLabels {
  /** aria-label / title for the close (✕) button. */
  close: string;
  /** Eyebrow above the footer action. Default "Primary actions" upstream. */
  primaryActions?: string;
  /** Copy-button tooltip (idle). */
  copy?: string;
  /** Copy-button tooltip (after copy). */
  copied?: string;
  /** Aerial thumbnail strings, forwarded to <ParcelAerialThumbnail>. */
  aerial?: ParcelAerialThumbnailLabels;
}

export interface ParcelPanelShellProps {
  darkMode: boolean;
  onClose: () => void;

  /**
   * Aerial thumbnail shown top-left of the header, framed on the parcel
   * centroid. Omit (or pass null) to hide it — but every map-first parcel panel
   * should show it. Requires `labels.aerial`.
   */
  aerial?: { lng: number; lat: number; areaM2?: number | null } | null;

  /**
   * Status badges row, rendered above the title (e.g. a "Parcel" pill and a
   * "For sale" pill). Use <ParcelStatusBadge> for the suite look, or pass any
   * node. Omit to hide the row.
   */
  badges?: ReactNode;

  /** Header title — usually the parcel address, or a fallback like "Selected parcel". */
  title: ReactNode;
  /** Header subtitle — e.g. "8001 · Zürich · ZH". Omit to hide. */
  subtitle?: ReactNode;

  /**
   * Parcel id / EGRID — rendered as a monospace chip with a copy button under
   * the title block. Omit/null to hide the chip.
   */
  parcelId?: string | null;
  /** Eyebrow on the parcel-id chip. Default "EGRID". */
  parcelIdLabel?: string;

  /**
   * Top-right action buttons (save / export / compare / track …). The close
   * button is appended automatically after these — do not include your own.
   */
  headerActions?: ReactNode;

  /**
   * Extra header rows rendered under the parcel-id chip, still inside the fixed
   * header (a summary/advanced toggle, an extra coordinate chip, …).
   */
  headerExtras?: ReactNode;

  /** The flexible scrollable middle — each app's focus content. */
  children: ReactNode;

  /**
   * Fixed footer node. When provided it is rendered as-is inside the footer
   * bar (under the `primaryActions` eyebrow). Takes precedence over `openIn`.
   */
  footer?: ReactNode;

  /**
   * Convenience: render the built-in "Open in" drop-up footer for these
   * coordinates instead of a custom `footer`. Pass the current app id so the
   * menu never offers to open the parcel in the app you're already in.
   */
  openIn?: {
    lat: number | null;
    lng: number | null;
    /** Trigger label, e.g. "Open in". */
    label: string;
    currentAppId?: string;
    /** Restrict / override the app list. Defaults to the suite's map-first apps. */
    apps?: LaunchApp[];
  } | null;

  /** Panel width in px on desktop. Default 400. */
  width?: 380 | 400 | 420;
  /** Navbar offset from the top. Default '3.5rem' (matches a `top-14` navbar). */
  topOffset?: string;
  /** Stacking level. Default Z_INDEX.drawer (1000). */
  zIndex?: number;

  labels: ParcelPanelShellLabels;

  /** Extra class names on the inner panel surface. */
  className?: string;
  /** aria-labelledby target id is generated; pass to override the dialog title id. */
  titleId?: string;
}

// Static class maps — built dynamically the JIT scanner could not see these,
// so each literal must appear verbatim in the compiled dist.
const WIDTH_CLASS: Record<number, string> = {
  380: 'md:w-[380px]',
  400: 'md:w-[400px]',
  420: 'md:w-[420px]',
};

// Desktop top offset → matching `top` + height pair. Most suite apps use a
// 56px (top-14) navbar; groove uses 64px (top-16). Add entries here as needed.
const TOP_CLASS: Record<string, string> = {
  '3.5rem': 'md:top-14 md:h-[calc(100dvh-3.5rem)]',
  '4rem': 'md:top-16 md:h-[calc(100dvh-4rem)]',
};

/* ------------------------------------------------------------------ */
/* Internal: copy button (matches valoo/geopool header copy affordance) */
/* ------------------------------------------------------------------ */

function CopyButton({
  text,
  darkMode,
  copyLabel,
  copiedLabel,
}: {
  text: string;
  darkMode: boolean;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const onCopy = () => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    }).catch(() => {});
  };
  return (
    <>
      <button
        type="button"
        onClick={onCopy}
        title={copied ? copiedLabel : copyLabel}
        aria-label={copied ? copiedLabel : copyLabel}
        className={`inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md transition-all duration-150 ${
          copied
            ? darkMode ? 'text-emerald-300' : 'text-emerald-600'
            : darkMode
              ? 'text-slate-500 hover:bg-white/[0.06] hover:text-slate-200'
              : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
        }`}
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
      </button>
      {/* SR-only live region — a focused button's accessible-name swap isn't
          re-announced, so confirm the copy explicitly (WCAG 4.1.3). */}
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? copiedLabel : ''}
      </span>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Exported: status badge (the suite "Parcel" / "For sale" header pill) */
/* ------------------------------------------------------------------ */

export type ParcelBadgeTone = 'emerald' | 'amber' | 'sky' | 'slate' | 'indigo' | 'rose';

export interface ParcelStatusBadgeProps {
  label: ReactNode;
  darkMode: boolean;
  tone?: ParcelBadgeTone;
  /** Show a leading dot (status indicator). Default true. */
  dot?: boolean;
  /** Optional leading icon (overrides the dot). */
  icon?: ReactNode;
}

const BADGE_TONES: Record<ParcelBadgeTone, { dark: string; light: string; dot: string }> = {
  emerald: { dark: 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/20', light: 'bg-emerald-50 text-emerald-700 ring-emerald-200', dot: 'bg-emerald-400' },
  amber: { dark: 'bg-amber-500/15 text-amber-300 ring-amber-400/20', light: 'bg-amber-50 text-amber-700 ring-amber-200', dot: 'bg-amber-400' },
  sky: { dark: 'bg-sky-500/15 text-sky-300 ring-sky-400/20', light: 'bg-sky-50 text-sky-700 ring-sky-200', dot: 'bg-sky-400' },
  slate: { dark: 'bg-white/[0.06] text-slate-300 ring-white/10', light: 'bg-slate-100 text-slate-600 ring-slate-200', dot: 'bg-slate-400' },
  indigo: { dark: 'bg-indigo-500/15 text-indigo-300 ring-indigo-400/20', light: 'bg-indigo-50 text-indigo-700 ring-indigo-200', dot: 'bg-indigo-400' },
  rose: { dark: 'bg-rose-500/15 text-rose-300 ring-rose-400/20', light: 'bg-rose-50 text-rose-700 ring-rose-200', dot: 'bg-rose-400' },
};

/** Suite-standard status pill for the panel header badges row. */
export function ParcelStatusBadge({ label, darkMode, tone = 'emerald', dot = true, icon }: ParcelStatusBadgeProps) {
  const t = BADGE_TONES[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] ring-1 ${
        darkMode ? t.dark : t.light
      }`}
    >
      {icon ?? (dot && <span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />)}
      {label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Exported: "Open in" footer drop-up (panel-styled, not the navbar one)*/
/* ------------------------------------------------------------------ */

export interface ParcelOpenInMenuProps {
  lat: number | null;
  lng: number | null;
  label: string;
  darkMode: boolean;
  /** Exclude the current app from the list (so it never opens itself). */
  currentAppId?: string;
  /** Override the offered apps. Defaults to the suite's map-first apps. */
  apps?: LaunchApp[];
  /** Deep-link zoom. Defaults to the launch spec. */
  zoom?: string | number;
  fullWidth?: boolean;
}

// Cross-app deep links open the target map past block level so its parcel
// auto-select hit-test lands on the exact parcel (suite deep-link standard).
const OPEN_IN_ZOOM = 17;

/**
 * The panel footer "Open in" affordance — a drop-UP menu (opens above the
 * trigger, since it sits at the bottom of the panel) that hands the selected
 * parcel off to another map-first suite app at the same spot. Panel-styled to
 * match the shell; distinct from the navbar `OpenWithMenu`.
 */
export function ParcelOpenInMenu({
  lat,
  lng,
  label,
  darkMode,
  currentAppId,
  apps = LAUNCH_APPS,
  zoom = OPEN_IN_ZOOM,
  fullWidth,
}: ParcelOpenInMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const list = apps.filter((a) => a.id !== currentAppId);
  const disabled = lat == null || lng == null || list.length === 0;

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    // Capture-phase + stopPropagation so an Escape that dismisses this drop-up
    // does not also bubble to the panel shell's window Escape handler and tear
    // down the whole panel. Capture fires before the shell's bubble listener.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setOpen(false);
      }
    };
    window.addEventListener('mousedown', onClick);
    window.addEventListener('keydown', onKey, true);
    return () => {
      window.removeEventListener('mousedown', onClick);
      window.removeEventListener('keydown', onKey, true);
    };
  }, [open]);

  const choose = (app: LaunchApp) => {
    if (lat == null || lng == null) return;
    openInApp(app.id, lat, lng, zoom);
    setOpen(false);
  };

  return (
    <div ref={ref} className={`relative ${fullWidth ? 'w-full' : ''}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={disabled}
        aria-haspopup="true"
        aria-expanded={open}
        title={label}
        className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-45 ${
          fullWidth ? 'w-full' : ''
        } ${
          darkMode
            ? 'bg-white/[0.05] text-slate-200 ring-1 ring-white/[0.07] hover:bg-white/[0.08]'
            : 'bg-slate-100 text-slate-800 ring-1 ring-slate-200 hover:bg-slate-200/70'
        }`}
      >
        <ExternalLink size={14} />
        <span className="truncate">{label}</span>
        <ChevronUp size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && !disabled && (
        <div
          // A disclosure list of plain buttons (Tab-navigable, Escape/outside
          // closes) — not an ARIA `menu`, which would promise arrow-key roving
          // navigation this doesn't implement.
          className={`absolute bottom-full right-0 z-30 mb-2 max-h-64 w-44 overflow-y-auto rounded-xl border p-1 shadow-xl ${
            darkMode ? 'border-white/10 bg-slate-900/95 backdrop-blur' : 'border-slate-200 bg-white/95 backdrop-blur'
          }`}
        >
          {list.map((app) => (
            <button
              key={app.id}
              type="button"
              onClick={() => choose(app)}
              className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium transition-colors ${
                darkMode ? 'text-slate-200 hover:bg-white/[0.06]' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <MapPin size={13} className="flex-shrink-0 text-slate-400" />
              <span className="truncate">{app.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The shell                                                           */
/* ------------------------------------------------------------------ */

export function ParcelPanelShell({
  darkMode,
  onClose,
  aerial,
  badges,
  title,
  subtitle,
  parcelId,
  parcelIdLabel = 'EGRID',
  headerActions,
  headerExtras,
  children,
  footer,
  openIn,
  width = 400,
  topOffset = '3.5rem',
  zIndex = Z_INDEX.drawer,
  labels,
  className,
  titleId: titleIdProp,
}: ParcelPanelShellProps) {
  const [visible, setVisible] = useState(false);
  // Mobile = bottom-sheet, true modal (backdrop, drag-to-close, focus trap).
  // Desktop = right side-sheet, non-modal (sits beside an interactive map).
  // Gates the JS behaviours that must differ between the two layouts; the
  // visual layout itself is CSS/`md:`-driven and correct regardless.
  const [isMobile, setIsMobile] = useState(false);

  // Mobile drag-to-close: track the active touch's start Y and live delta so we
  // can translate the sheet and decide whether to close on release (>80px down).
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartYRef = useRef<number | null>(null);

  // Focus management: focus close on mount, restore previous focus on unmount.
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<Element | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Latest onClose via a ref + a tracked close timer, so the close path is
  // idempotent (re-entry guarded), never fires a stale onClose, and never fires
  // onClose after unmount.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const generatedId = useId();
  const titleId = titleIdProp ?? `parcel-panel-title-${generatedId}`;

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    previousFocusRef.current = document.activeElement;
    const id = requestAnimationFrame(() => closeBtnRef.current?.focus());
    return () => {
      cancelAnimationFrame(id);
      const prev = previousFocusRef.current as HTMLElement | null;
      if (prev && typeof prev.focus === 'function' && document.contains(prev)) prev.focus();
      else (document.body as HTMLElement | null)?.focus?.();
    };
  }, []);

  // handleClose reads only refs + the stable setVisible, so the one-time Esc
  // listener below can capture it without going stale.
  const handleClose = () => {
    if (closeTimerRef.current) return; // re-entry guard — close once
    setVisible(false);
    closeTimerRef.current = setTimeout(() => onCloseRef.current(), 300);
  };

  // Clear the pending close timer on unmount so onClose never fires late.
  useEffect(() => () => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current); }, []);

  // Esc closes the panel. A child popover (Open-in drop-up, aerial lightbox)
  // that is open swallows Escape in the capture phase / on `document`, so this
  // bubble-phase window listener only sees Escapes meant for the panel itself.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mobile-only focus trap — the bottom-sheet presents as a true modal, so Tab
  // must wrap within the panel instead of escaping to the obscured map behind
  // the backdrop. The desktop side-sheet is non-modal and intentionally lets
  // Tab leave.
  useEffect(() => {
    if (!isMobile) return;
    const el = panelRef.current;
    if (!el) return;
    const SEL =
      'a[href],area[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),button:not([disabled]),iframe,[tabindex]:not([tabindex="-1"])';
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const items = Array.from(el.querySelectorAll<HTMLElement>(SEL)).filter(
        (n) => n.offsetParent !== null || n === document.activeElement,
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey) {
        if (active === first || !el.contains(active)) { last.focus(); e.preventDefault(); }
      } else {
        if (active === last || !el.contains(active)) { first.focus(); e.preventDefault(); }
      }
    };
    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  }, [isMobile]);

  const onDragTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return; // drag-to-close is a mobile bottom-sheet gesture only
    const t = e.touches[0];
    if (!t) return;
    dragStartYRef.current = t.clientY;
    setDragOffset(0);
  };
  const onDragTouchMove = (e: React.TouchEvent) => {
    if (!isMobile) return;
    const start = dragStartYRef.current;
    if (start == null) return;
    const t = e.touches[0];
    if (!t) return;
    const delta = t.clientY - start;
    setDragOffset(delta > 0 ? delta : 0); // only follow downward drags
  };
  const onDragTouchEnd = () => {
    if (!isMobile) return;
    const offset = dragOffset;
    dragStartYRef.current = null;
    if (offset > 80) handleClose();
    setDragOffset(0);
  };

  const widthClass = WIDTH_CLASS[width] ?? WIDTH_CLASS[400];
  const topClass = TOP_CLASS[topOffset] ?? TOP_CLASS['3.5rem'];
  const footerNode = footer ?? (openIn ? (
    <ParcelOpenInMenu
      lat={openIn.lat}
      lng={openIn.lng}
      label={openIn.label}
      darkMode={darkMode}
      currentAppId={openIn.currentAppId}
      apps={openIn.apps}
      fullWidth
    />
  ) : null);

  return (
    <>
      {/* Mobile backdrop. Desktop panel sits beside the map, no backdrop. */}
      <div
        className={`fixed inset-0 transition-opacity duration-300 md:hidden ${
          visible ? 'opacity-100 bg-black/40 backdrop-blur-sm' : 'opacity-0 pointer-events-none'
        }`}
        style={{ zIndex: zIndex - 1 }}
        onClick={handleClose}
        aria-hidden
      />

      {/* Single positioned dialog div carries position + enter/exit transform +
          the live mobile drag transform (valoo's proven structure). Desktop:
          right side-sheet below the navbar. Mobile: bottom sheet. */}
      <div
        role="dialog"
        aria-modal={isMobile || undefined}
        aria-labelledby={titleId}
        className={`fixed transition-all duration-300
          bottom-0 left-0 right-0 md:bottom-auto md:left-auto md:right-0 ${widthClass} ${topClass}
          ${visible
            ? 'translate-y-0 md:translate-x-0 opacity-100'
            : 'translate-y-full md:translate-y-0 md:translate-x-full opacity-0'}`}
        style={{
          zIndex,
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          // Live drag transform is a mobile-only gesture; never override the
          // desktop side-sheet's translate-x slide animation.
          transform: isMobile && dragOffset > 0 && visible ? `translateY(${dragOffset}px)` : undefined,
          transition: isMobile && dragOffset > 0 ? 'none' : undefined,
        }}
      >
        <div
          ref={panelRef}
          className={`h-full flex flex-col max-h-[88vh] md:max-h-full shadow-2xl pb-[env(safe-area-inset-bottom)] md:pb-0 ${
            darkMode
              ? 'bg-[#0b0f15] md:border-l border-white/[0.06] text-slate-200'
              : 'bg-white md:border-l border-gray-200/80 text-slate-900'
          } ${className ?? ''}`}
        >
          {/* Mobile grab handle (drag target) */}
          <div
            className="md:hidden flex justify-center pt-2.5 pb-1 touch-none cursor-grab active:cursor-grabbing"
            onTouchStart={onDragTouchStart}
            onTouchMove={onDragTouchMove}
            onTouchEnd={onDragTouchEnd}
            onTouchCancel={onDragTouchEnd}
            aria-hidden
          >
            <div className={`w-10 h-1 rounded-full ${darkMode ? 'bg-white/15' : 'bg-gray-300'}`} />
          </div>

          {/* HEADER (fixed) */}
          <div
            className={`relative px-5 pt-3.5 pb-4 shrink-0 ${
              darkMode
                ? 'bg-gradient-to-b from-white/[0.02] to-transparent'
                : 'bg-gradient-to-b from-gray-50/80 to-transparent'
            }`}
            onTouchStart={onDragTouchStart}
            onTouchMove={onDragTouchMove}
            onTouchEnd={onDragTouchEnd}
            onTouchCancel={onDragTouchEnd}
          >
            {/* badges + actions row */}
            <div className="flex items-start justify-between gap-3 mb-2.5">
              <div className="flex items-center gap-1.5 flex-wrap min-h-[1.25rem]">{badges}</div>
              <div className="flex items-center gap-2 shrink-0">
                {headerActions}
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={handleClose}
                  aria-label={labels.close}
                  title={labels.close}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 ${
                    darkMode
                      ? 'text-gray-400 hover:text-white hover:bg-white/[0.08]'
                      : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* aerial + title */}
            <div className="flex items-start gap-3">
              {aerial && labels.aerial && (
                <ParcelAerialThumbnail
                  lng={aerial.lng}
                  lat={aerial.lat}
                  areaM2={aerial.areaM2 ?? null}
                  dark={darkMode}
                  labels={labels.aerial}
                />
              )}
              <div className="min-w-0 flex-1">
                <h2
                  id={titleId}
                  className={`text-[18px] font-bold tracking-tight leading-snug ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {title}
                </h2>
                {subtitle && (
                  <p className={`text-[12.5px] mt-0.5 flex items-center gap-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <MapPin size={11} className="shrink-0" />
                    <span className="truncate">{subtitle}</span>
                  </p>
                )}
              </div>
            </div>

            {/* parcel-id chip */}
            {parcelId && (
              <div className={`mt-2.5 flex items-center gap-2 rounded-md px-2.5 py-1.5 ${
                darkMode ? 'bg-black/25 text-slate-300' : 'bg-white text-slate-700 ring-1 ring-slate-200'
              }`}>
                <span className={`flex-shrink-0 text-[10px] font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  {parcelIdLabel}
                </span>
                <span className="min-w-0 flex-1 break-all font-mono text-[11px] font-semibold leading-tight">{parcelId}</span>
                <CopyButton
                  text={parcelId}
                  darkMode={darkMode}
                  copyLabel={labels.copy ?? 'Copy'}
                  copiedLabel={labels.copied ?? 'Copied'}
                />
              </div>
            )}

            {headerExtras && <div className="mt-2.5 space-y-2.5">{headerExtras}</div>}
          </div>

          {/* BODY (scrollable, flexible middle) */}
          <div className={`flex-1 overflow-y-auto px-5 pb-5 panel-scroll ${darkMode ? 'panel-scroll-dark' : ''}`}>
            {children}
          </div>

          {/* FOOTER (fixed) */}
          {footerNode && (
            <div className={`shrink-0 border-t px-5 py-3 ${
              darkMode ? 'border-white/[0.06] bg-white/[0.02]' : 'border-gray-200 bg-gray-50/70'
            }`}>
              {labels.primaryActions && (
                <p className={`mb-2 text-[10px] font-semibold uppercase tracking-wide ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {labels.primaryActions}
                </p>
              )}
              {footerNode}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ParcelPanelShell;
