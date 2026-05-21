import { useEffect, useMemo, useRef, useState } from 'react';
import {
  X, Download, MapPin, ArrowUpDown, Search, ExternalLink,
  Trash2, RefreshCw, Plus, Layers, LayoutGrid, Compass,
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import {
  fetchPrmRecords,
  updatePrmState,
  updatePrmPriority,
  updatePrmTags,
  deletePrmRecord,
  PRM_STATES,
  PRM_PRIORITIES,
  PROOM_APP_URL,
  TOOLBOX_APP_URL,
  GEOPOOL_APP_URL,
  type PrmRecord,
  type PrmState,
  type PrmPriority,
} from './api';
import { getSavedParcelsStrings, type Locale, type SavedParcelsStrings } from './i18n';

type SortKey = 'parcel_label' | 'parcel_municipality' | 'state' | 'priority' | 'updated_at';

export interface SavedParcelsModalProps {
  /** Locale for the modal's UI text. Defaults to 'en'. */
  locale?: Locale;
  /** Close the modal. */
  onClose: () => void;
  /**
   * "Open here" action — host app handles what "here" means. Typical pattern
   * is to reload the current page with `?lat=&lng=&address=` for the chosen
   * parcel. Receives the full record so the app can do whatever it needs.
   */
  onOpenHere?: (record: PrmRecord) => void;
  /** Override the "Open here" button label. Defaults to "Open here". */
  openHereLabel?: string;
}

export function SavedParcelsModal({
  locale = 'en',
  onClose,
  onOpenHere,
  openHereLabel,
}: SavedParcelsModalProps) {
  const t = getSavedParcelsStrings(locale);
  const auth = useAuth();
  const accessToken = auth.getAccessToken();
  const isAuthenticated = auth.isAuthenticated;

  const [records, setRecords] = useState<PrmRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('updated_at');
  const [sortAsc, setSortAsc] = useState(false);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState<PrmState | 'all'>('all');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const refresh = () => {
    if (!isAuthenticated || !accessToken) return;
    setLoading(true);
    setError(null);
    fetchPrmRecords(accessToken)
      .then(setRecords)
      .catch((err) => setError(String(err?.message ?? err)))
      .finally(() => setLoading(false));
  };

  useEffect(refresh, [accessToken, isAuthenticated]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records
      .filter((r) => stateFilter === 'all' || r.state === stateFilter)
      .filter((r) => {
        if (!q) return true;
        const blob = [
          r.parcel_label,
          r.parcel_municipality,
          r.parcel_id,
          (r.tags || []).join(' '),
        ].join(' ').toLowerCase();
        return blob.includes(q);
      });
  }, [records, search, stateFilter]);

  const sorted = useMemo(() => {
    const dir = sortAsc ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const va = (a[sortKey] ?? '') as string | number;
      const vb = (b[sortKey] ?? '') as string | number;
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });
  }, [filtered, sortKey, sortAsc]);

  const exportCsv = () => {
    const headers = [
      'Parcel ID', 'Address', 'Municipality', 'Area (m2)',
      'State', 'Priority', 'Tags', 'Lat', 'Lng', 'Updated',
    ];
    const rows = sorted.map((r) => [
      r.parcel_id, r.parcel_label, r.parcel_municipality, r.parcel_area,
      r.state, r.priority, (r.tags || []).join('; '),
      r.parcel_lat, r.parcel_lng, new Date(r.updated_at).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','),
      )
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saved_parcels_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const patchLocal = (id: string, patch: Partial<PrmRecord>) => {
    setRecords((rs) =>
      rs.map((r) => (r.id === id ? { ...r, ...patch, updated_at: new Date().toISOString() } : r)),
    );
  };

  const onChangeState = async (rec: PrmRecord, next: PrmState) => {
    if (rec.state === next || !accessToken) return;
    patchLocal(rec.id, { state: next });
    try {
      const updated = await updatePrmState(accessToken, rec.id, next);
      patchLocal(rec.id, updated);
    } catch {
      patchLocal(rec.id, { state: rec.state });
    }
  };

  const onChangePriority = async (rec: PrmRecord, next: PrmPriority) => {
    if (rec.priority === next || !accessToken) return;
    patchLocal(rec.id, { priority: next });
    try {
      const updated = await updatePrmPriority(accessToken, rec.id, next);
      patchLocal(rec.id, updated);
    } catch {
      patchLocal(rec.id, { priority: rec.priority });
    }
  };

  const onChangeTags = async (rec: PrmRecord, next: string[]) => {
    if (!accessToken) return;
    patchLocal(rec.id, { tags: next });
    try {
      const updated = await updatePrmTags(accessToken, rec.id, next);
      patchLocal(rec.id, updated);
    } catch {
      patchLocal(rec.id, { tags: rec.tags });
    }
  };

  const onDelete = async (id: string) => {
    if (!accessToken) return;
    const prev = records;
    setRecords((rs) => rs.filter((r) => r.id !== id));
    setConfirmDeleteId(null);
    try {
      await deletePrmRecord(accessToken, id);
    } catch {
      setRecords(prev);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-5xl max-h-[85vh] rounded-2xl shadow-2xl border overflow-hidden flex flex-col bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
        style={{ animation: 'savedParcelsIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both' }}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <MapPin size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">{t.title}</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              {records.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={refresh} title={t.refresh} aria-label={t.refresh}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
            <button onClick={exportCsv} disabled={records.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-100 dark:hover:bg-emerald-500/25 transition-colors disabled:opacity-40">
              <Download size={13} />
              {t.exportCsv}
            </button>
            <a href={`${PROOM_APP_URL}/`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <LayoutGrid size={13} />
              {t.openInProom}
            </a>
            <button onClick={onClose} aria-label={t.close}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <X size={17} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 px-5 py-2.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30">
          <div className="relative flex-1 min-w-[160px] max-w-sm">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          </div>
          <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value as PrmState | 'all')}
            className="px-2.5 py-1.5 rounded-lg text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
            <option value="all">{t.filterAllStates}</option>
            {PRM_STATES.map((s) => (
              <option key={s.value} value={s.value}>{t.state[s.value]}</option>
            ))}
          </select>
          <span className="ml-auto text-[11px] text-gray-500 dark:text-gray-400">
            {sorted.length === records.length
              ? t.showingAll(records.length)
              : t.showingFiltered(sorted.length, records.length)}
          </span>
        </div>

        <div className="flex-1 overflow-auto">
          {!isAuthenticated ? (
            <EmptyState icon={<MapPin size={32} className="text-gray-400" />} title={t.signinRequired} />
          ) : loading ? (
            <div className="flex items-center justify-center py-16">
              <RefreshCw size={20} className="animate-spin text-gray-400" />
            </div>
          ) : error ? (
            <EmptyState icon={<X size={32} className="text-red-400" />} title={t.loadFailed} hint={error} />
          ) : records.length === 0 ? (
            <EmptyState icon={<MapPin size={32} className="text-gray-400" />} title={t.empty} hint={t.emptyHint} />
          ) : sorted.length === 0 ? (
            <EmptyState icon={<Search size={32} className="text-gray-400" />} title={t.noMatch} />
          ) : (
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-800/80 backdrop-blur">
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <Th><SortBtn label={t.colAddress} field="parcel_label" sortKey={sortKey} sortAsc={sortAsc} onClick={handleSort} /></Th>
                  <Th><SortBtn label={t.colMunicipality} field="parcel_municipality" sortKey={sortKey} sortAsc={sortAsc} onClick={handleSort} /></Th>
                  <Th><SortBtn label={t.colState} field="state" sortKey={sortKey} sortAsc={sortAsc} onClick={handleSort} /></Th>
                  <Th><SortBtn label={t.colPriority} field="priority" sortKey={sortKey} sortAsc={sortAsc} onClick={handleSort} /></Th>
                  <Th className="hidden md:table-cell">{t.colTags}</Th>
                  <Th><SortBtn label={t.colUpdated} field="updated_at" sortKey={sortKey} sortAsc={sortAsc} onClick={handleSort} /></Th>
                  <Th align="right">{t.colActions}</Th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((r) => (
                  <Row key={r.id} record={r} t={t}
                    openHereLabel={openHereLabel ?? t.openHere}
                    onChangeState={onChangeState}
                    onChangePriority={onChangePriority}
                    onChangeTags={onChangeTags}
                    onDelete={() => setConfirmDeleteId(r.id)}
                    onOpenHere={onOpenHere} />
                ))}
              </tbody>
            </table>
          )}
        </div>

        {confirmDeleteId && (
          <ConfirmDelete t={t}
            onCancel={() => setConfirmDeleteId(null)}
            onConfirm={() => onDelete(confirmDeleteId)} />
        )}
      </div>

      <style>{`
        @keyframes savedParcelsIn {
          from { opacity: 0; transform: scale(0.92) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

function Th({ children, align = 'left', className = '' }: {
  children: React.ReactNode; align?: 'left' | 'right'; className?: string;
}) {
  return (
    <th className={`px-3 py-2.5 text-[10px] uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 ${align === 'right' ? 'text-right' : 'text-left'} ${className}`}>
      {children}
    </th>
  );
}

function SortBtn({ label, field, sortKey, sortAsc, onClick }: {
  label: string; field: SortKey; sortKey: SortKey; sortAsc: boolean;
  onClick: (key: SortKey) => void;
}) {
  const active = sortKey === field;
  return (
    <button onClick={() => onClick(field)}
      className="inline-flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
      {label}
      <ArrowUpDown size={10}
        className={active ? 'text-emerald-500' : 'opacity-30'}
        style={active ? { transform: sortAsc ? undefined : 'scaleY(-1)' } : undefined} />
    </button>
  );
}

function EmptyState({ icon, title, hint }: {
  icon: React.ReactNode; title: string; hint?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-2 px-4 text-center">
      {icon}
      <p className="text-sm text-gray-700 dark:text-gray-300">{title}</p>
      {hint && <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md">{hint}</p>}
    </div>
  );
}

function Row({ record, t, openHereLabel, onChangeState, onChangePriority, onChangeTags, onDelete, onOpenHere }: {
  record: PrmRecord; t: SavedParcelsStrings; openHereLabel: string;
  onChangeState: (r: PrmRecord, next: PrmState) => void;
  onChangePriority: (r: PrmRecord, next: PrmPriority) => void;
  onChangeTags: (r: PrmRecord, next: string[]) => void;
  onDelete: () => void;
  onOpenHere?: (r: PrmRecord) => void;
}) {
  const stateInfo = PRM_STATES.find((s) => s.value === record.state);
  const priorityInfo = PRM_PRIORITIES.find((p) => p.value === record.priority);
  const params = `?lat=${record.parcel_lat}&lng=${record.parcel_lng}${
    record.parcel_label ? `&address=${encodeURIComponent(record.parcel_label)}` : ''
  }`;

  return (
    <tr className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors align-top">
      <td className="px-3 py-3">
        <div className="font-medium text-gray-900 dark:text-gray-100 text-sm max-w-[220px] truncate">
          {record.parcel_label || record.parcel_id}
        </div>
        <div className="text-[10px] text-gray-500 dark:text-gray-400 font-mono mt-0.5 truncate">
          {record.parcel_id}
        </div>
      </td>
      <td className="px-3 py-3 text-xs text-gray-600 dark:text-gray-300">
        {record.parcel_municipality || '—'}
        {record.parcel_area > 0 && (
          <div className="text-[10px] text-gray-400 mt-0.5">
            {Math.round(record.parcel_area).toLocaleString('de-CH')} m²
          </div>
        )}
      </td>
      <td className="px-3 py-3">
        <PillSelect value={record.state} onChange={(v) => onChangeState(record, v as PrmState)}
          options={PRM_STATES.map((s) => ({ value: s.value, label: t.state[s.value] }))}
          dotClass={stateInfo?.bg ?? 'bg-slate-500'}
          colorClass={stateInfo?.color ?? 'text-gray-500'} />
      </td>
      <td className="px-3 py-3">
        <PillSelect value={record.priority} onChange={(v) => onChangePriority(record, v as PrmPriority)}
          options={PRM_PRIORITIES.map((p) => ({ value: p.value, label: t.priority[p.value] }))}
          colorClass={priorityInfo?.color ?? 'text-gray-500'} />
      </td>
      <td className="px-3 py-3 hidden md:table-cell max-w-[220px]">
        <TagEditor tags={record.tags || []} onChange={(next) => onChangeTags(record, next)} t={t} />
      </td>
      <td className="px-3 py-3 text-[11px] text-gray-500 dark:text-gray-400 whitespace-nowrap">
        {new Date(record.updated_at).toLocaleDateString()}
      </td>
      <td className="px-3 py-3 text-right">
        <div className="inline-flex items-center gap-0.5">
          {onOpenHere && (
            <ActionBtn onClick={() => onOpenHere(record)} title={openHereLabel} icon={<MapPin size={13} />} />
          )}
          <ActionBtn href={`${TOOLBOX_APP_URL}/${params}`} title={t.openInToolbox} icon={<Compass size={13} />} />
          <ActionBtn href={`${GEOPOOL_APP_URL}/${params}`} title={t.openInGeopool} icon={<Layers size={13} />} />
          <ActionBtn href={`${PROOM_APP_URL}/?prm=${encodeURIComponent(record.id)}`} title={t.openInProom} icon={<ExternalLink size={13} />} />
          <ActionBtn onClick={onDelete} title={t.delete} icon={<Trash2 size={13} />} danger />
        </div>
      </td>
    </tr>
  );
}

function ActionBtn({ onClick, href, title, icon, danger }: {
  onClick?: () => void; href?: string; title: string; icon: React.ReactNode; danger?: boolean;
}) {
  const base = 'p-1.5 rounded-md transition-colors text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/60';
  const hover = danger
    ? 'hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10'
    : 'hover:text-emerald-600 dark:hover:text-emerald-400';
  const className = `${base} ${hover}`;
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" title={title} className={className}>
        {icon}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} title={title} className={className}>
      {icon}
    </button>
  );
}

function PillSelect({ value, onChange, options, dotClass, colorClass }: {
  value: string; onChange: (next: string) => void;
  options: { value: string; label: string }[];
  dotClass?: string; colorClass: string;
}) {
  return (
    <label className="inline-flex items-center gap-1.5 cursor-pointer group">
      {dotClass && <span className={`w-1.5 h-1.5 rounded-full ${dotClass} shrink-0`} />}
      <span className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)}
          className={`appearance-none bg-transparent border-0 pr-3 text-xs font-medium cursor-pointer focus:outline-none focus:ring-0 ${colorClass} group-hover:underline`}>
          {options.map((o) => (
            <option key={o.value} value={o.value} className="text-gray-900">{o.label}</option>
          ))}
        </select>
      </span>
    </label>
  );
}

function TagEditor({ tags, onChange, t }: {
  tags: string[]; onChange: (next: string[]) => void; t: SavedParcelsStrings;
}) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (adding) inputRef.current?.focus(); }, [adding]);

  const commit = () => {
    const v = draft.trim();
    setDraft('');
    setAdding(false);
    if (!v) return;
    if (tags.includes(v)) return;
    onChange([...tags, v]);
  };

  return (
    <div className="flex flex-wrap items-center gap-1">
      {tags.map((tag) => (
        <span key={tag}
          className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
          {tag}
          <button type="button" onClick={() => onChange(tags.filter((x) => x !== tag))}
            className="text-gray-400 hover:text-red-500" aria-label={t.removeTag(tag)}>
            <X size={10} />
          </button>
        </span>
      ))}
      {adding ? (
        <input ref={inputRef} type="text" value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit();
            else if (e.key === 'Escape') { setDraft(''); setAdding(false); }
          }}
          placeholder={t.tagPlaceholder}
          className="text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 w-20 focus:outline-none focus:ring-1 focus:ring-emerald-500/40" />
      ) : (
        <button type="button" onClick={() => setAdding(true)}
          className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 border border-dashed border-gray-300 dark:border-gray-700"
          aria-label={t.addTag}>
          <Plus size={10} />
          {t.addTag}
        </button>
      )}
    </div>
  );
}

function ConfirmDelete({ t, onCancel, onConfirm }: {
  t: SavedParcelsStrings; onCancel: () => void; onConfirm: () => void;
}) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-5 max-w-sm w-full">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t.confirmDeleteTitle}</h3>
        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{t.confirmDeleteBody}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onCancel}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
            {t.cancel}
          </button>
          <button onClick={onConfirm}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-600 hover:bg-red-500 text-white">
            {t.delete}
          </button>
        </div>
      </div>
    </div>
  );
}
