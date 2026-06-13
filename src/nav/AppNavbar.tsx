import { useState } from 'react';
import type { ReactNode } from 'react';
import { AireonHubLink } from '../brand/AireonHubLink';
import { AireonAppWordmark } from '../brand/AireonAppWordmark';
import { OpenWithMenu } from './OpenWithMenu';
import { MapToolbar, type MapToolbarProps } from './MapToolbar';
import { AddressSearch, type AddressSearchProps, type AddressSearchResult } from './AddressSearch';

export interface AppNavbarProps {
  /** App name for the wordmark (e.g. "valoo"). */
  appName: string;
  dark?: boolean;
  /** Hide the back-to-hub badge (default: shown). */
  hideHubLink?: boolean;

  /**
   * Address search. Omit to hide the search box entirely (apps with no map /
   * no address lookup). `onSelect` fires with the picked result; the navbar also
   * remembers it to drive the "Open with" cross-app menu (see `openWith`).
   */
  search?: Pick<AddressSearchProps, 'onSelect' | 'labels' | 'search' | 'locale' | 'onError' | 'minChars'>;

  /**
   * Custom center content (replaces the address search) for apps whose center
   * control isn't a plain address lookup — e.g. a multi-mode district search or
   * a selector bar. Ignored when `search` is provided.
   */
  centerSlot?: ReactNode;

  /**
   * Cross-app "Open with" menu — appears once a search result is picked, so the
   * user can open the same spot in another suite app.
   */
  openWith?: {
    currentAppId: string;
    label: string;
    onOpen?: (appId: string) => void;
  };

  /** Map action cluster (Save · My images · Theme · Locate · Settings · Language). Omit to hide. */
  toolbar?: Omit<MapToolbarProps, 'dark'>;

  /**
   * App-specific controls rendered in the right cluster, just before the map
   * toolbar / account menu — for buttons the shared toolbar doesn't cover
   * (e.g. a Share button, or a non-map app's own navbar controls).
   */
  actionsExtra?: ReactNode;

  /** The app's account menu node (typically a wrapped <MapUserMenu>). */
  userMenu?: ReactNode;

  /**
   * Positioning classes for the outer <header>. Default overlays the top of the
   * map (the valoo pattern). Pass e.g. "sticky top-0 z-40" for an in-flow bar.
   */
  position?: string;

  /** data-tour anchor for the brand/wordmark (tours often target "app-title"). */
  brandTourId?: string;
  /** data-tour anchor for the search box (tours target it). */
  searchTourId?: string;
  /** data-tour anchor for the account menu. */
  userMenuTourId?: string;

  className?: string;
}

/**
 * `AppNavbar` — the suite-canonical top bar (the valoo pattern), hosted in
 * `@aireon/shared` so every non-hub app shares one navbar:
 *
 *   [ Aireon hub badge │ app wordmark ]   [ address search ]   [ Open-with · MapToolbar · account menu ]
 *
 * Brand badge + wordmark on the left, a debounced geo.admin address search in the
 * middle, and the shared map toolbar + cross-app "Open with" + the app's account
 * menu on the right. Every section is optional, so non-map apps can drop the
 * search/toolbar and keep the same shell. Styling is self-contained
 * (`@aireon/shared/map-ui.css`); the app supplies positioning via `position`.
 */
export function AppNavbar({
  appName,
  dark = false,
  hideHubLink = false,
  search,
  centerSlot,
  openWith,
  toolbar,
  actionsExtra,
  userMenu,
  position = 'absolute top-0 left-0 right-0 z-40',
  brandTourId,
  searchTourId,
  userMenuTourId,
  className,
}: AppNavbarProps) {
  const [picked, setPicked] = useState<{ lat: number; lng: number } | null>(null);

  const handlePick = (result: AddressSearchResult) => {
    setPicked({ lat: result.lat, lng: result.lng });
    search?.onSelect(result);
  };

  return (
    <header className={position + (className ? ` ${className}` : '')}>
      <div className={'aireon-appnav-bar' + (dark ? ' aireon-appnav-bar--dark' : '')}>
        <div className="aireon-appnav-inner">
          <div className="aireon-appnav-brand" data-tour={brandTourId}>
            {!hideHubLink && (
              <AireonHubLink withDivider className="" style={{ color: dark ? 'rgb(248 250 252)' : 'rgb(17 24 39)' }} />
            )}
            <AireonAppWordmark name={appName} />
          </div>

          {search ? (
            <div className="aireon-appnav-search" data-tour={searchTourId}>
              <AddressSearch dark={dark} {...search} onSelect={handlePick} />
            </div>
          ) : centerSlot ? (
            <div className="aireon-appnav-center" data-tour={searchTourId}>{centerSlot}</div>
          ) : null}

          <div className="aireon-appnav-actions">
            {openWith && picked && (
              <OpenWithMenu
                location={picked}
                currentAppId={openWith.currentAppId}
                dark={dark}
                label={openWith.label}
                onOpen={openWith.onOpen}
              />
            )}
            {actionsExtra}
            {toolbar && <MapToolbar dark={dark} {...toolbar} />}
            {userMenu && <div data-tour={userMenuTourId}>{userMenu}</div>}
          </div>
        </div>
      </div>
    </header>
  );
}

export default AppNavbar;
