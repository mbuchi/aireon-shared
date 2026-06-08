import { useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { MoreHorizontal } from 'lucide-react';

export type OverflowNavMode = 'inline' | 'menu';

export interface OverflowNavItem {
  /** Stable identity for React keys. */
  key: string;
  /**
   * Text label. Shown as the row text in the collapsed overflow menu and used
   * as the `title` / `aria-label` of the default inline icon button.
   */
  label: string;
  /** Icon node (e.g. a lucide-react icon). Rendered both inline and in the menu. */
  icon?: ReactNode;
  /** Click handler for the default button rendering. */
  onSelect?: () => void;
  /** Active/selected state — highlights the inline button and the menu row. */
  active?: boolean;
  /** Small badge/dot (e.g. unread count). Surfaces on the ⋯ trigger when collapsed. */
  badge?: ReactNode;
  /** Render in the danger (destructive) tone. */
  danger?: boolean;
  /** Disable the control. */
  disabled?: boolean;
  /**
   * Keep this item visible inline even on mobile — use for the identity anchor
   * (avatar / user menu) or a primary CTA that must never hide.
   */
  keepInline?: boolean;
  /** Hide entirely on mobile (only meaningful on desktop). */
  desktopOnly?: boolean;
  /**
   * Escape hatch for complex controls (a language `<select>`, a user menu, …).
   * When provided, `icon` / `onSelect` / `active` are ignored and this renders
   * instead. `mode` is `'inline'` in the bar and `'menu'` inside the dropdown,
   * so a control can present a compact inline form and a full-width menu form.
   */
  render?: (mode: OverflowNavMode) => ReactNode;
}

export interface OverflowNavProps {
  /** Ordered list of actions, left → right. */
  items: OverflowNavItem[];
  /** Dark theme styling. Also picks up an ancestor `.dark` / `[data-theme="dark"]`. */
  dark?: boolean;
  /** Collapse to the overflow menu at or below this viewport width (px). Default 768. */
  collapseBelow?: number;
  /** Accessible label for the ⋯ trigger. Default "More". */
  moreLabel?: string;
  /** Optional small heading shown above the collapsed items in the menu. */
  menuLabel?: string;
  /** Extra class names on the root cluster. */
  className?: string;
}

/**
 * `useMediaQuery` — SSR-safe match for a `(max-width: …)` query. Returns `false`
 * on the server / first paint, then syncs on mount so desktop never flickers a
 * collapsed bar (the common case for the suite is wide desktop).
 */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    // Safari < 14 only supports the deprecated addListener signature.
    if (mql.addEventListener) mql.addEventListener('change', onChange);
    else mql.addListener(onChange);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', onChange);
      else mql.removeListener(onChange);
    };
  }, [query]);
  return matches;
}

/** Default inline icon button — mirrors the suite's neutral icon-button look. */
function InlineButton({ item, onAfter }: { item: OverflowNavItem; onAfter?: () => void }) {
  if (item.render) return <>{item.render('inline')}</>;
  return (
    <button
      type="button"
      onClick={() => {
        if (item.disabled) return;
        item.onSelect?.();
        onAfter?.();
      }}
      disabled={item.disabled}
      aria-label={item.label}
      title={item.label}
      aria-current={item.active ? 'true' : undefined}
      className={
        'aireon-onav-btn' +
        (item.active ? ' aireon-onav-btn--active' : '') +
        (item.danger ? ' aireon-onav-btn--danger' : '')
      }
    >
      {item.icon}
      {item.badge != null && <span className="aireon-onav-btn-badge">{item.badge}</span>}
    </button>
  );
}

/**
 * `OverflowNav` — a breakpoint-driven responsive action cluster (the
 * "priority+" / overflow-menu pattern used by Apple, Google, Tesla, …).
 *
 * On desktop (above `collapseBelow`) every item renders inline, identical to a
 * plain flex row — the desktop layout is unchanged. At or below the breakpoint,
 * items flagged `keepInline` stay visible while the rest collapse behind a
 * single ⋯ "More" button that opens a tidy dropdown. This keeps phones from
 * cramming a dozen overlapping icon buttons into the top bar.
 */
export function OverflowNav({
  items,
  dark = false,
  collapseBelow = 768,
  moreLabel = 'More',
  menuLabel,
  className,
}: OverflowNavProps) {
  const isMobile = useMediaQuery(`(max-width: ${collapseBelow - 1}px)`);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Close the menu the moment we cross back to the desktop layout.
  useEffect(() => {
    if (!isMobile) setOpen(false);
  }, [isMobile]);

  const rootClass =
    'aireon-onav' + (dark ? ' aireon-onav--dark' : '') + (className ? ` ${className}` : '');

  // Desktop: render everything inline, untouched.
  if (!isMobile) {
    return (
      <div ref={rootRef} className={rootClass}>
        {items.map((item) => (
          <InlineButton key={item.key} item={item} />
        ))}
      </div>
    );
  }

  // Mobile: split into always-inline items and the collapsible remainder.
  const visible = items.filter((it) => it.keepInline && !it.desktopOnly);
  const collapsed = items.filter((it) => !it.keepInline && !it.desktopOnly);
  const hasBadge = collapsed.some((it) => it.badge != null);

  return (
    <div ref={rootRef} className={rootClass}>
      {visible.map((item) => (
        <InlineButton key={item.key} item={item} />
      ))}

      {collapsed.length > 0 && (
        <div className="aireon-onav-more">
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={moreLabel}
            title={moreLabel}
            aria-haspopup="menu"
            aria-expanded={open}
            aria-controls={menuId}
            className={'aireon-onav-btn' + (open ? ' aireon-onav-btn--active' : '')}
          >
            <MoreHorizontal size={20} aria-hidden="true" />
            {hasBadge && <span className="aireon-onav-btn-badge aireon-onav-btn-badge--dot" />}
          </button>

          {open && (
            <div id={menuId} role="menu" className="aireon-onav-menu">
              {menuLabel && <p className="aireon-onav-menu-label">{menuLabel}</p>}
              {collapsed.map((item) =>
                item.render ? (
                  <div key={item.key} className="aireon-onav-menu-custom" role="none">
                    {item.render('menu')}
                  </div>
                ) : (
                  <button
                    key={item.key}
                    type="button"
                    role="menuitem"
                    disabled={item.disabled}
                    aria-current={item.active ? 'true' : undefined}
                    onClick={() => {
                      if (item.disabled) return;
                      setOpen(false);
                      item.onSelect?.();
                    }}
                    className={
                      'aireon-onav-menu-item' +
                      (item.active ? ' aireon-onav-menu-item--active' : '') +
                      (item.danger ? ' aireon-onav-menu-item--danger' : '')
                    }
                  >
                    {item.icon}
                    <span className="aireon-onav-menu-item-label">{item.label}</span>
                    {item.badge != null && (
                      <span className="aireon-onav-menu-item-badge">{item.badge}</span>
                    )}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default OverflowNav;
