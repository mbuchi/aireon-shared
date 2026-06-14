import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Clock, MapPin, Trash2, X, Search } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useSearchHistory } from './useSearchHistory';
import { getSearchHistoryStrings, type Locale } from './i18n';
import type { SearchHistoryEntry } from './types';

export interface SearchHistoryModalProps {
  /** Locale for the modal's UI text. Defaults to 'en'. */
  locale?: Locale;
  /** Close the modal. */
  onClose: () => void;
  /**
   * "Open" a past search — the host decides what that means. Map apps typically
   * recenter on the entry's lat/lng (and close). Receives the full entry.
   * When omitted, entries with coordinates fall back to a `?lat=&lng=&address=`
   * reload of the current page.
   */
  onOpen?: (entry: SearchHistoryEntry) => void;
  /** Auth-token hint so the list refreshes immediately after sign-in. */
  authToken?: string | null;
  /**
   * Force dark styling — needed because the modal portals to `document.body`
   * and so escapes any nested `.dark` wrapper the app applies.
   */
  dark?: boolean;
}

function defaultOpen(entry: SearchHistoryEntry) {
  if (entry.lat == null || entry.lng == null) return;
  const params = new URLSearchParams({
    lat: String(entry.lat),
    lng: String(entry.lng),
    address: entry.label,
  });
  window.location.href = `${window.location.pathname}?${params.toString()}`;
}

export function SearchHistoryModal({
  locale = 'en',
  onClose,
  onOpen,
  authToken,
  dark = false,
}: SearchHistoryModalProps) {
  const t = getSearchHistoryStrings(locale);
  const { entries, authed, clear, remove } = useSearchHistory({ authToken });
  const modalRef = useFocusTrap<HTMLDivElement>({ onEscape: onClose });
  // "Clear all" is destructive and (per focus-trap) can be the first auto-focused
  // control, so require a confirming second click rather than wiping on one tap.
  const [confirmClear, setConfirmClear] = useState(false);

  const open = onOpen ?? defaultOpen;

  return createPortal(
    <div className={`${dark ? 'dark ' : ''}fixed inset-0 z-[200] flex items-center justify-center p-4`}>
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={modalRef}
        className="relative w-full max-w-md max-h-[80vh] rounded-2xl shadow-2xl border overflow-hidden flex flex-col bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
        style={{ animation: 'searchHistoryIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both' }}
        role="dialog"
        aria-modal="true"
        aria-label={t.title}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <Clock size={18} className="text-sky-600 dark:text-sky-400 shrink-0" />
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">{t.title}</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              {entries.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {entries.length > 0 && (
              <button
                onClick={() => {
                  if (confirmClear) {
                    clear();
                    setConfirmClear(false);
                  } else {
                    setConfirmClear(true);
                  }
                }}
                onBlur={() => setConfirmClear(false)}
                className={
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ' +
                  (confirmClear
                    ? 'bg-red-600 hover:bg-red-500 text-white border-red-600'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700')
                }
              >
                <Trash2 size={13} />
                {confirmClear ? t.clearAllConfirm : t.clearAll}
              </button>
            )}
            <button
              onClick={onClose}
              aria-label={t.close}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2 px-4 text-center">
              <Search size={32} className="text-gray-400" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {authed ? t.empty : t.signinRequired}
              </p>
              {authed && <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs">{t.emptyHint}</p>}
            </div>
          ) : (
            <ul className="py-1.5">
              {entries.map((entry) => (
                <li
                  key={entry.id}
                  className="group flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => {
                      open(entry);
                      onClose();
                    }}
                    title={t.open}
                    className="flex items-center gap-2.5 min-w-0 flex-1 text-left"
                  >
                    <MapPin size={15} className="shrink-0 text-gray-400 group-hover:text-sky-500" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm text-gray-800 dark:text-gray-100">
                        {entry.label}
                      </span>
                      <span className="block text-[11px] text-gray-400 dark:text-gray-500">
                        {new Date(entry.lastSearchedAt).toLocaleDateString(locale)}
                        {entry.searchCount > 1 ? ` · ${t.searchedTimes(entry.searchCount)}` : ''}
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(entry.id)}
                    aria-label={t.remove}
                    title={t.remove}
                    className="p-1.5 rounded-md text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 opacity-0 group-hover:opacity-100 focus:opacity-100 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <style>{`
        @keyframes searchHistoryIn {
          from { opacity: 0; transform: scale(0.92) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>,
    document.body,
  );
}

export default SearchHistoryModal;
