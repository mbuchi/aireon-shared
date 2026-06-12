import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  ChevronDown,
  CircleUser,
  Download,
  ExternalLink,
  Layers,
  LogOut,
  RefreshCw,
  Table2,
} from 'lucide-react';
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
import {
  fetchPrmRecords,
  PRM_STATES,
  PROOM_APP_URL,
  type PrmRecord,
  type PrmState,
} from '../prm/api';
import { getSavedParcelsStrings, type Locale as PrmLocale } from '../prm/i18n';
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

function downloadSavedParcelsCsv(records: PrmRecord[]) {
  const headers = [
    'Parcel ID',
    'Address',
    'Municipality',
    'Area (m2)',
    'State',
    'Priority',
    'Tags',
    'Lat',
    'Lng',
    'Updated',
  ];
  const rows = records.map((r) => [
    r.parcel_id,
    r.parcel_label,
    r.parcel_municipality,
    r.parcel_area,
    r.state,
    r.priority,
    (r.tags || []).join('; '),
    r.parcel_lat,
    r.parcel_lng,
    new Date(r.updated_at).toLocaleDateString(),
  ]);
  const csv = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','),
    )
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `saved_parcels_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

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
  const { user, isLoading, login, logout, getAccessToken } = useAuth();
  const { avatarUrl } = useUserProfile(user);
  const [open, setOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showParcels, setShowParcels] = useState(false);
  const [parcelRecords, setParcelRecords] = useState<PrmRecord[]>([]);
  const [parcelStatus, setParcelStatus] =
    useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [parcelError, setParcelError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const accessToken = getAccessToken() ?? null;
  const parcelStrings = getSavedParcelsStrings(locale);
  const hasCustomDropdownSummary = dropdownSummary != null;
  const shouldLoadSavedSummary = showSavedParcels && !hasCustomDropdownSummary;

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const refreshSavedParcels = useCallback(() => {
    if (!shouldLoadSavedSummary || !user || !accessToken) {
      setParcelRecords([]);
      setParcelStatus('idle');
      setParcelError(null);
      return;
    }
    setParcelStatus('loading');
    setParcelError(null);
    fetchPrmRecords(accessToken)
      .then((records) => {
        setParcelRecords(records);
        setParcelStatus('ready');
      })
      .catch((err) => {
        setParcelError(String(err?.message ?? err));
        setParcelStatus('error');
      });
  }, [accessToken, shouldLoadSavedSummary, user]);

  useEffect(() => {
    refreshSavedParcels();
  }, [refreshSavedParcels]);

  const savedParcelStats = useMemo(() => {
    const byState = PRM_STATES.reduce<Record<PrmState, number>>((acc, state) => {
      acc[state.value] = 0;
      return acc;
    }, {} as Record<PrmState, number>);
    for (const record of parcelRecords) {
      byState[record.state] = (byState[record.state] ?? 0) + 1;
    }
    return { total: parcelRecords.length, byState };
  }, [parcelRecords]);

  const openSavedParcels = () => {
    setOpen(false);
    setShowParcels(true);
  };

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
  const hasBuiltInSavedSummary = shouldLoadSavedSummary;
  const isWideDropdown = dropdownWidth === 'wide' || hasBuiltInSavedSummary;
  const dropdownClassName = `map-shell-user-dropdown ${
    isWideDropdown ? 'map-shell-user-dropdown--wide' : ''
  }`;

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
            className={dropdownClassName}
            role="menu"
          >
            <div className="map-shell-user-card">
              <Avatar url={avatarUrl} initials={initials} size={40} />
              <div className="min-w-0 flex-1">
                <p className="map-shell-user-display-name">
                  {displayName || firstName || labels.fallbackUser}
                </p>
                {email && <p className="map-shell-user-email">{email}</p>}
                {/* Status + edit share one line so the name/email above get the
                    full card width (no squeeze from a side button). */}
                <div className="map-shell-user-active-row">
                  <div className="map-shell-user-active">
                    <span className="map-shell-user-active-dot">
                      <span />
                      <span />
                    </span>
                    <span>{labels.active}</span>
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
                    {parcelStrings.editProfile}
                  </button>
                </div>
              </div>
            </div>

            {dropdownSummary && (
              <div className="map-shell-user-summary">
                {dropdownSummary}
              </div>
            )}

            {hasBuiltInSavedSummary && (
              <div className="map-shell-user-summary">
                <div className="map-shell-user-saved-head">
                  <div className="map-shell-user-saved-title">
                    <Layers size={14} aria-hidden="true" />
                    <span>{labels.savedParcels}</span>
                  </div>
                  <button
                    type="button"
                    onClick={refreshSavedParcels}
                    className="map-shell-user-saved-refresh"
                    aria-label={parcelStrings.refresh}
                    title={parcelStrings.refresh}
                  >
                    <RefreshCw
                      size={12}
                      aria-hidden="true"
                      className={parcelStatus === 'loading' ? 'map-shell-spin' : undefined}
                    />
                  </button>
                </div>

                <div className="map-shell-user-saved-main">
                  <div className="map-shell-user-saved-total">
                    <span className="map-shell-user-saved-count">
                      {savedParcelStats.total}
                    </span>
                    <span className="map-shell-user-saved-total-label">
                      {parcelStrings.totalParcels}
                    </span>
                  </div>
                  <div className="map-shell-user-saved-actions">
                    <button
                      type="button"
                      onClick={openSavedParcels}
                      className="map-shell-user-saved-action"
                      aria-label={parcelStrings.title}
                      title={parcelStrings.title}
                    >
                      <Table2 size={16} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadSavedParcelsCsv(parcelRecords)}
                      disabled={parcelRecords.length === 0}
                      className="map-shell-user-saved-action"
                      aria-label={parcelStrings.exportCsv}
                      title={parcelStrings.exportCsv}
                    >
                      <Download size={16} aria-hidden="true" />
                    </button>
                    {/* Manage the full pipeline in proom — opens the Kanban in a
                        new tab so the user keeps their place in this app. */}
                    <a
                      href={`${PROOM_APP_URL}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="map-shell-user-saved-action"
                      aria-label={parcelStrings.openInProom}
                      title={parcelStrings.openInProom}
                    >
                      <ExternalLink size={16} aria-hidden="true" />
                    </a>
                  </div>
                </div>

                {parcelStatus === 'error' && (
                  <p className="map-shell-user-saved-error">
                    {parcelStrings.loadFailed}
                    {parcelError ? `: ${parcelError}` : ''}
                  </p>
                )}

                <div className="map-shell-user-saved-grid">
                  {PRM_STATES.map((state) => (
                    <div
                      key={state.value}
                      className="map-shell-user-saved-state"
                      title={parcelStrings.state[state.value]}
                    >
                      <div className="map-shell-user-saved-state-count">
                        {savedParcelStats.byState[state.value] ?? 0}
                      </div>
                      <div className="map-shell-user-saved-state-label">
                        {parcelStrings.state[state.value]}
                      </div>
                    </div>
                  ))}
                </div>
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
              {showSavedParcels && hasCustomDropdownSummary && (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    openSavedParcels();
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
          dark={dark}
          onClose={() => {
            setShowParcels(false);
            refreshSavedParcels();
          }}
          openHereLabel={savedParcelsOpenHereLabel}
          onOpenHere={(record) => {
            setShowParcels(false);
            refreshSavedParcels();
            onOpenSavedParcel(record);
          }}
        />
      )}
    </>
  );
}

export default MapUserMenu;
