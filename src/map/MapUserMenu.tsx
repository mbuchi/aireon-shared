import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Table2, ChevronDown, CircleUser, LogOut, UserCog } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { Avatar, useUserProfile } from '../profile';
import {
  emailOf,
  firstNameOf,
  fullNameOf,
  initialsOf,
} from '../profile/identity';
import { ProfileModal } from '../profile/ProfileModal';
import { SavedParcelsModal } from '../prm/SavedParcelsModal';
import type { PrmRecord } from '../prm/api';
import type { Locale as PrmLocale } from '../prm/i18n';
import { Skeleton } from '../skeleton/Skeleton';

export interface MapUserMenuLabels {
  signIn: string;
  userMenu: string;
  viewProfile: string;
  /**
   * Label for the compact profile button shown beside the user name in the
   * account card. Optional — falls back to `viewProfile` so existing consumers
   * need no change. Pass a short verb like "Manage" for the tightest fit.
   */
  manageProfile?: string;
  savedParcels: string;
  signOut: string;
  active: string;
  fallbackUser: string;
}

export interface MapUserMenuAction {
  key: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  badge?: ReactNode;
  /** Renders a small red dot at the row's trailing edge (e.g. unseen release notes). */
  dot?: boolean;
  /**
   * Also surface this action when the user is signed out — the menu then opens a
   * compact dropdown with these public tools plus a "Sign in" row, instead of a
   * bare sign-in button. Use for tools anonymous visitors should reach (tour,
   * what's-new); omit for account-gated tools (export, saved items).
   */
  signedOut?: boolean;
  disabled?: boolean;
  danger?: boolean;
}

export interface MapUserMenuProps {
  dark?: boolean;
  labels: MapUserMenuLabels;
  locale?: PrmLocale;
  showSavedParcels?: boolean;
  savedParcelsOpenHereLabel?: string;
  extraItems?: MapUserMenuAction[];
  toolbarItems?: MapUserMenuAction[];
  toolbarLabel?: string;
  dropdownSummary?: ReactNode;
  dropdownWidth?: 'default' | 'wide';
  onOpenSavedParcel?: (record: PrmRecord) => void;
}

const defaultOpenSavedParcel = (record: PrmRecord) => {
  const params = new URLSearchParams({
    lat: String(record.parcel_lat),
    lng: String(record.parcel_lng),
  });
  window.location.href = `${window.location.pathname}?${params.toString()}`;
};

export function MapUserMenu({
  dark = false,
  labels,
  locale = 'en',
  showSavedParcels = true,
  savedParcelsOpenHereLabel,
  extraItems = [],
  toolbarItems = [],
  toolbarLabel = 'More tools',
  dropdownSummary,
  dropdownWidth = 'default',
  onOpenSavedParcel = defaultOpenSavedParcel,
}: MapUserMenuProps) {
  const { user, isLoading, login, logout } = useAuth();
  const { avatarUrl } = useUserProfile(user);
  const [open, setOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showParcels, setShowParcels] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  // Shared renderer for a "More tools" row, used by both the signed-in and the
  // signed-out dropdowns.
  const renderToolItem = (item: MapUserMenuAction) => (
    <button
      key={item.key}
      type="button"
      role="menuitem"
      disabled={item.disabled}
      onClick={() => {
        if (item.disabled) return;
        setOpen(false);
        item.onClick();
      }}
      className={`map-shell-user-tool-item ${item.danger ? 'map-shell-user-tool-item--danger' : ''}`}
    >
      {item.icon}
      <span>{item.label}</span>
      {item.badge && <span className="map-shell-user-menu-badge">{item.badge}</span>}
      {item.dot && <span className="map-shell-user-menu-dot" aria-hidden="true" />}
    </button>
  );

  if (isLoading) {
    return <Skeleton circle width={36} dark={dark} />;
  }

  if (!user) {
    // Tools flagged `signedOut` stay reachable for anonymous visitors (tour,
    // what's-new) via a compact dropdown; otherwise fall back to a bare sign-in
    // button (backward-compatible with apps that pass no public tools).
    const publicItems = toolbarItems.filter((item) => item.signedOut);
    if (publicItems.length === 0) {
      return (
        <button
          type="button"
          onClick={() => login()}
          className="map-shell-user-button map-shell-user-button--signed-out"
          aria-label={labels.signIn}
          title={labels.signIn}
        >
          <CircleUser size={20} aria-hidden="true" />
        </button>
      );
    }
    return (
      <div ref={menuRef} className="relative flex-shrink-0">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="map-shell-user-button map-shell-user-button--signed-out"
          aria-label={labels.userMenu}
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <CircleUser size={20} aria-hidden="true" />
        </button>
        {open && (
          <div
            className={`map-shell-user-dropdown ${dropdownWidth === 'wide' ? 'map-shell-user-dropdown--wide' : ''}`}
            role="menu"
          >
            <div className="map-shell-user-tools">
              <p className="map-shell-user-section-label">{toolbarLabel}</p>
              {publicItems.map(renderToolItem)}
            </div>
            <div className="py-1">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  login();
                }}
                className="map-shell-user-menu-item"
              >
                <CircleUser size={16} aria-hidden="true" />
                {labels.signIn}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const firstName = firstNameOf(user);
  const displayName = fullNameOf(user);
  const email = emailOf(user);
  const initials = initialsOf(user);

  return (
    <>
      <div ref={menuRef} className="relative flex-shrink-0">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="map-shell-user-button"
          aria-label={labels.userMenu}
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <span className="map-shell-user-avatar">
            <Avatar url={avatarUrl} initials={initials} size={28} />
          </span>
          <span className="map-shell-user-name">
            {firstName || displayName || labels.fallbackUser}
          </span>
          <ChevronDown
            size={14}
            aria-hidden="true"
            className={`map-shell-user-chevron ${open ? 'map-shell-user-chevron--open' : ''}`}
          />
        </button>

        {open && (
          <div
            className={`map-shell-user-dropdown ${dropdownWidth === 'wide' ? 'map-shell-user-dropdown--wide' : ''}`}
            role="menu"
          >
            <div className="map-shell-user-card">
              <Avatar url={avatarUrl} initials={initials} size={40} />
              <div className="min-w-0 flex-1">
                <p className="map-shell-user-display-name">
                  {displayName || firstName || labels.fallbackUser}
                </p>
                {email && <p className="map-shell-user-email">{email}</p>}
                <div className="map-shell-user-active">
                  <span className="map-shell-user-active-dot">
                    <span />
                    <span />
                  </span>
                  <span>{labels.active}</span>
                </div>
              </div>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  setShowProfile(true);
                }}
                className="map-shell-user-manage"
                aria-label={labels.manageProfile ?? labels.viewProfile}
                title={labels.manageProfile ?? labels.viewProfile}
              >
                <UserCog size={13} aria-hidden="true" />
                <span>{labels.manageProfile ?? labels.viewProfile}</span>
              </button>
            </div>

            {dropdownSummary && (
              <div className="map-shell-user-summary">
                {dropdownSummary}
              </div>
            )}

            {toolbarItems.length > 0 && (
              <div className="map-shell-user-tools">
                <p className="map-shell-user-section-label">{toolbarLabel}</p>
                {toolbarItems.map(renderToolItem)}
              </div>
            )}

            <div className="py-1">
              {extraItems.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  role="menuitem"
                  disabled={item.disabled}
                  onClick={() => {
                    if (item.disabled) return;
                    setOpen(false);
                    item.onClick();
                  }}
                  className={`map-shell-user-menu-item ${item.danger ? 'map-shell-user-menu-item--danger' : ''}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && <span className="map-shell-user-menu-badge">{item.badge}</span>}
                  {item.dot && <span className="map-shell-user-menu-dot" aria-hidden="true" />}
                </button>
              ))}
              {showSavedParcels && (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setOpen(false);
                    setShowParcels(true);
                  }}
                  className="map-shell-user-menu-item"
                >
                  <Table2 size={16} aria-hidden="true" />
                  {labels.savedParcels}
                </button>
              )}
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="map-shell-user-menu-item map-shell-user-menu-item--danger"
              >
                <LogOut size={16} aria-hidden="true" />
                {labels.signOut}
              </button>
            </div>
          </div>
        )}
      </div>

      {showProfile && (
        <ProfileModal user={user} onClose={() => setShowProfile(false)} dark={dark} />
      )}
      {showParcels && (
        <SavedParcelsModal
          locale={locale}
          onClose={() => setShowParcels(false)}
          openHereLabel={savedParcelsOpenHereLabel}
          onOpenHere={(record) => {
            setShowParcels(false);
            onOpenSavedParcel(record);
          }}
        />
      )}
    </>
  );
}

export default MapUserMenu;
