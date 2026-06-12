import { useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Settings } from 'lucide-react';

export interface SettingsMenuItem {
  key: string;
  label?: string;
  icon?: ReactNode;
  onSelect?: () => void;
  /** Custom row renderer (a toggle, a select…). When set, label/icon/onSelect are ignored. */
  render?: () => ReactNode;
}

export interface SettingsMenuProps {
  dark?: boolean;
  /** Tooltip / aria-label for the gear trigger. */
  label: string;
  /** Muted line shown when there are no settings yet (placeholder state). */
  emptyLabel: string;
  /** Optional small heading above the rows. */
  menuLabel?: string;
  /** Settings rows. Empty/omitted → placeholder empty state. */
  items?: SettingsMenuItem[];
  /** Icon size (px). Default 18 to match the suite navbar icons. */
  iconSize?: number;
  /**
   * Class for the gear trigger button. Defaults to the suite navbar icon-button
   * look (`aireon-navbtn`). Pass `aireon-onav-btn` to match an overflow row.
   */
  buttonClassName?: string;
  className?: string;
}

/**
 * `SettingsMenu` — the navbar settings gear. A placeholder by default: the suite
 * apps carry no user-facing settings yet, so the popover shows a muted
 * "coming soon" line. Pass `items` once an app has real settings and each renders
 * as a menu row. Styling reuses the shared `aireon-*` button/menu classes from
 * `@aireon/shared/map-ui.css`, so the gear matches the other navbar icons and the
 * dropdown matches the overflow menu.
 */
export function SettingsMenu({
  dark = false,
  label,
  emptyLabel,
  menuLabel,
  items,
  iconSize = 18,
  buttonClassName = 'aireon-navbtn',
  className,
}: SettingsMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const hasItems = !!items && items.length > 0;

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

  const rootClass =
    'aireon-navbtn-wrap' +
    (dark ? ' aireon-navbtn-wrap--dark aireon-onav--dark' : '') +
    (className ? ` ${className}` : '');

  return (
    <div ref={rootRef} className={rootClass}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={label}
        title={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        className={buttonClassName + (open ? ` ${buttonClassName}--active` : '')}
      >
        <Settings size={iconSize} aria-hidden="true" />
      </button>
      {/* Hover tooltip — suppressed while the popover is open so the two never stack. */}
      {!open && (
        <span role="tooltip" className="aireon-navbtn-tip">
          {label}
        </span>
      )}
      {open && (
        <div id={menuId} role="menu" className="aireon-onav-menu">
          {menuLabel && <p className="aireon-onav-menu-label">{menuLabel}</p>}
          {hasItems ? (
            items!.map((item) =>
              item.render ? (
                <div key={item.key} className="aireon-onav-menu-custom" role="none">
                  {item.render()}
                </div>
              ) : (
                <button
                  key={item.key}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setOpen(false);
                    item.onSelect?.();
                  }}
                  className="aireon-onav-menu-item"
                >
                  {item.icon}
                  <span className="aireon-onav-menu-item-label">{item.label}</span>
                </button>
              ),
            )
          ) : (
            <p className="aireon-settings-empty">{emptyLabel}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default SettingsMenu;
