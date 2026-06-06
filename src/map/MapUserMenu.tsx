import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Bookmark, ChevronDown, CircleUser, LogOut } from 'lucide-react';
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

  if (isLoading) {
    return <Skeleton circle width={36} dark={dark} />;
  }

  if (!user) {
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
            </div>

            {dropdownSummary && (
              <div className="map-shell-user-summary">
                {dropdownSummary}
              </div>
            )}

            {toolbarItems.length > 0 && (
              <div className="map-shell-user-tools">
                <p className="map-shell-user-section-label">{toolbarLabel}</p>
                {toolbarItems.map((item) => (
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
                  </button>
                ))}
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
                </button>
              ))}
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  setShowProfile(true);
                }}
                className="map-shell-user-menu-item"
              >
                <CircleUser size={16} aria-hidden="true" />
                {labels.viewProfile}
              </button>
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
                  <Bookmark size={16} aria-hidden="true" />
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
