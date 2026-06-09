import { useEffect, useRef, useState } from 'react';
import { ExternalLink, ChevronDown, MapPin } from 'lucide-react';
import { LAUNCH_APPS, openInApp, type LaunchApp } from './launchApps';

export interface OpenWithMenuProps {
  /**
   * The location to hand off, or null when nothing is selected yet (the trigger
   * is disabled in that case). Wire this to your geocoder's current result.
   */
  location: { lat: number; lng: number } | null;
  /** Apps to offer. Defaults to the suite's map-first apps. */
  apps?: LaunchApp[];
  /** Current app id — excluded from the list so it never offers to open itself. */
  currentAppId?: string;
  /** Deep-link zoom. Defaults to the launchpad spec (15.00). */
  zoom?: string | number;
  /** Trigger label / tooltip. Default "Open with". */
  label?: string;
  /** Show the label text beside the icon (otherwise icon-only + tooltip). */
  showLabel?: boolean;
  /** Force dark styling. Otherwise adapts to an ancestor `.dark`. */
  dark?: boolean;
  /** Extra class names on the wrapper. */
  className?: string;
  /** Called after a target app is opened (e.g. for telemetry). */
  onOpen?: (appId: string) => void;
}

/**
 * `OpenWithMenu` — the variant-1 navbar "Open with" affordance, bolted onto a
 * map app's existing geocoder: once the user has picked an address/location,
 * this opens that same spot in another suite app
 * (`https://<id>.aireon.ch/?lat=&lng=&zoom=`). Monochrome, self-contained styling
 * (`@aireon/shared/map-ui.css`).
 */
export function OpenWithMenu({
  location,
  apps = LAUNCH_APPS,
  currentAppId,
  zoom,
  label = 'Open with',
  showLabel = false,
  dark = false,
  className,
  onOpen,
}: OpenWithMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('mousedown', onClick);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const list = apps.filter((a) => a.id !== currentAppId);
  const disabled = !location || list.length === 0;

  const choose = (app: LaunchApp) => {
    if (!location) return;
    openInApp(app.id, location.lat, location.lng, zoom);
    onOpen?.(app.id);
    setOpen(false);
  };

  return (
    <div
      ref={ref}
      className={'aireon-openwith' + (dark ? ' aireon-openwith--dark' : '') + (className ? ` ${className}` : '')}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        className={'aireon-navbtn aireon-openwith-trigger' + (showLabel ? ' aireon-openwith-trigger--labelled' : '')}
      >
        <ExternalLink size={18} aria-hidden="true" />
        {showLabel && <span className="aireon-openwith-trigger-label">{label}</span>}
        <ChevronDown size={14} aria-hidden="true" className={'aireon-openwith-caret' + (open ? ' is-open' : '')} />
      </button>
      {!showLabel && (
        <span role="tooltip" className="aireon-navbtn-tip aireon-openwith-tip">
          {label}
        </span>
      )}

      {open && !disabled && (
        <div role="menu" className="aireon-openwith-menu">
          <p className="aireon-openwith-menu-label">{label}</p>
          {list.map((app) => (
            <button
              key={app.id}
              type="button"
              role="menuitem"
              onClick={() => choose(app)}
              className="aireon-openwith-item"
            >
              <MapPin size={14} aria-hidden="true" className="aireon-openwith-item-icon" />
              <span>{app.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default OpenWithMenu;
