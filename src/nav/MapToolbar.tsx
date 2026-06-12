import { useEffect, useState } from 'react';
import { Camera, Layers, Sun, Moon, MapPin } from 'lucide-react';
import { NavIconButton } from './NavIconButton';
import { OverflowNav, type OverflowNavItem } from './OverflowNav';
import { SettingsMenu, type SettingsMenuItem } from './SettingsMenu';
import { LocaleSelector } from '../i18n/LocaleSelector';
import type { Locale } from '../releaseNotes/i18n';

export interface MapToolbarLabels {
  saveImage: string;
  myImages: string;
  toggleLight: string;
  toggleDark: string;
  locateMe: string;
  settings: string;
  settingsComingSoon: string;
  selectLanguage: string;
  more: string;
}

export interface MapToolbarProps {
  /** Dark styling. Also adapts to an ancestor `.dark` / `[data-theme="dark"]`. */
  dark?: boolean;
  /** Localized strings — the app owns its i18n and passes them in. */
  labels: MapToolbarLabels;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  /** Save image (Camera). Rendered only when provided. */
  onCapture?: () => void;
  isCapturing?: boolean;
  /** My images (Layers). Rendered only when provided. */
  onShowImages?: () => void;
  /** Theme toggle (Sun ⇄ Moon). Rendered only when provided. */
  onToggleTheme?: () => void;
  /** Locate me / GPS (MapPin). Rendered only when provided. */
  onLocate?: () => void;
  isLocating?: boolean;
  /** Settings rows. When omitted the gear is a placeholder ("coming soon"). */
  settingsItems?: SettingsMenuItem[];
  /** Hide the Settings gear entirely (default: show it as a placeholder). */
  hideSettings?: boolean;
  /** Collapse the cluster into a ⋯ menu at/below this width (px). Default 768. */
  collapseBelow?: number;
  className?: string;
}

/**
 * `useMediaQuery` — SSR-safe `(max-width: …)` match. `false` on the server /
 * first paint, then syncs on mount so wide desktop never flickers a collapsed
 * bar. (Mirrors the hook inside OverflowNav.)
 */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    if (mql.addEventListener) mql.addEventListener('change', onChange);
    else mql.addListener(onChange);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', onChange);
      else mql.removeListener(onChange);
    };
  }, [query]);
  return matches;
}

/**
 * `MapToolbar` — the canonical aireon map-app action cluster. Renders, in order,
 * **Save image · My images · Theme · Locate · Settings · Language**, with each
 * button appearing only when its handler is supplied. On desktop the controls sit
 * inline as neutral icon buttons (matching the suite navbar look); at/below
 * `collapseBelow` they fold into a single ⋯ menu via {@link OverflowNav}.
 *
 * The account / user menu is intentionally NOT part of this — apps render
 * `<MapUserMenu>` immediately after the toolbar so the order ends
 * `… · Settings · Language · account menu`.
 */
export function MapToolbar({
  dark = false,
  labels,
  locale,
  onLocaleChange,
  onCapture,
  isCapturing = false,
  onShowImages,
  onToggleTheme,
  onLocate,
  isLocating = false,
  settingsItems,
  hideSettings = false,
  collapseBelow = 768,
  className,
}: MapToolbarProps) {
  const isMobile = useMediaQuery(`(max-width: ${collapseBelow - 1}px)`);

  // Mobile: every control folds into a single ⋯ menu, same order as desktop.
  if (isMobile) {
    const items: OverflowNavItem[] = [];
    if (onCapture)
      items.push({ key: 'save', label: labels.saveImage, icon: <Camera size={16} aria-hidden="true" />, onSelect: onCapture, disabled: isCapturing });
    if (onShowImages)
      items.push({ key: 'images', label: labels.myImages, icon: <Layers size={16} aria-hidden="true" />, onSelect: onShowImages });
    if (onToggleTheme)
      items.push({ key: 'theme', label: dark ? labels.toggleLight : labels.toggleDark, icon: dark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />, onSelect: onToggleTheme });
    if (onLocate)
      items.push({ key: 'locate', label: labels.locateMe, icon: <MapPin size={16} aria-hidden="true" />, onSelect: onLocate, disabled: isLocating });
    if (!hideSettings)
      items.push({ key: 'settings', label: labels.settings, render: () => <SettingsMenu dark={dark} label={labels.settings} emptyLabel={labels.settingsComingSoon} items={settingsItems} /> });
    items.push({ key: 'language', label: labels.selectLanguage, render: (mode) => <LocaleSelector locale={locale} onChange={onLocaleChange} ariaLabel={labels.selectLanguage} className={mode === 'menu' ? 'w-full' : undefined} /> });

    return <OverflowNav dark={dark} items={items} collapseBelow={collapseBelow} moreLabel={labels.more} menuLabel={labels.more} className={className} />;
  }

  // Desktop: inline neutral icon buttons in the canonical order.
  return (
    <div className={'aireon-maptoolbar' + (className ? ` ${className}` : '')}>
      {onCapture && (
        <NavIconButton dark={dark} icon={<Camera size={18} aria-hidden="true" />} label={labels.saveImage} onClick={isCapturing ? undefined : onCapture} />
      )}
      {onShowImages && (
        <NavIconButton dark={dark} icon={<Layers size={18} aria-hidden="true" />} label={labels.myImages} onClick={onShowImages} />
      )}
      {onToggleTheme && (
        <NavIconButton dark={dark} icon={dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />} label={dark ? labels.toggleLight : labels.toggleDark} onClick={onToggleTheme} />
      )}
      {onLocate && (
        <NavIconButton dark={dark} icon={<MapPin size={18} aria-hidden="true" />} label={labels.locateMe} onClick={isLocating ? undefined : onLocate} />
      )}
      {!hideSettings && (
        <SettingsMenu dark={dark} label={labels.settings} emptyLabel={labels.settingsComingSoon} items={settingsItems} />
      )}
      <LocaleSelector locale={locale} onChange={onLocaleChange} ariaLabel={labels.selectLanguage} />
    </div>
  );
}

export default MapToolbar;
