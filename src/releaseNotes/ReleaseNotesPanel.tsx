import {
  type MutableRefObject,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import {
  X, Search, ChevronDown, ChevronUp, ExternalLink, GitPullRequest, Tag,
} from 'lucide-react';
import { KIND_META, type ChangeKind, type Release } from './types';
import { getReleaseNotesStrings, type Locale } from './i18n';

export interface ReleaseNotesPanelProps {
  /** Called when the panel finishes its close animation. */
  onClose: () => void;
  /** UI language for the panel chrome. Defaults to English. */
  locale?: Locale;
  /** The app's release history, newest first. */
  releases: Release[];
  /** GitHub repo URL, used to link PRs (e.g. https://github.com/mbuchi/boom). */
  repoUrl: string;
  /** Brand name letters before the red "oo" (e.g. "b" for boom). Ignored if brandNode is set. */
  brandPrefix?: string;
  /** Brand name letters after the red "oo" (e.g. "m" for boom). Ignored if brandNode is set. */
  brandSuffix?: string;
  /** Full custom wordmark, for brands the prefix/oo/suffix split can't express (e.g. toolbox's two red "oo"s). Overrides brandPrefix/brandSuffix. */
  brandNode?: ReactNode;
  /** Stacking context for the overlay. Defaults to the top of the stack so the panel always sits above app chrome (navbars, dropdowns). */
  zIndex?: number;
  /** Optional ref the panel populates with its animated-close handler, so the trigger can dismiss the panel. */
  closeRef?: MutableRefObject<(() => void) | null>;
}

/** Max 32-bit signed int — keeps the modal above any app navbar/dropdown stacking context. */
const TOP_Z_INDEX = 2147483647;

const FILTER_ORDER: ChangeKind[] = ['new', 'improved', 'fixed', 'breaking', 'docs'];

export default function ReleaseNotesPanel({
  onClose,
  locale = 'en',
  releases,
  repoUrl,
  brandPrefix = '',
  brandSuffix = '',
  brandNode,
  zIndex = TOP_Z_INDEX,
  closeRef,
}: ReleaseNotesPanelProps) {
  const t = getReleaseNotesStrings(locale);
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<ChangeKind | 'all'>('all');
  const [openVersions, setOpenVersions] = useState<Record<string, boolean>>(() => ({
    [releases[0].version]: true,
  }));
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    if (closeRef) closeRef.current = handleClose;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (closeRef) closeRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  const toggle = (v: string) =>
    setOpenVersions((prev) => ({ ...prev, [v]: !prev[v] }));

  const filteredReleases = useMemo(() => {
    const q = query.trim().toLowerCase();
    return releases.map((release) => {
      const items = release.items.filter((item) => {
        const kindOk = activeFilter === 'all' || item.kind === activeFilter;
        const queryOk =
          !q ||
          item.text.toLowerCase().includes(q) ||
          release.codename.toLowerCase().includes(q) ||
          release.version.includes(q) ||
          (item.prs ?? []).some((n) => `#${n}`.includes(q) || String(n) === q);
        return kindOk && queryOk;
      });
      return { ...release, items };
    }).filter((r) => r.items.length > 0);
  }, [query, activeFilter, releases]);

  const totals = useMemo(() => {
    const all = releases.flatMap((r) => r.items);
    return {
      releases: releases.length,
      changes: all.length,
      latest: releases[0],
    };
  }, [releases]);

  const latest = totals.latest;

  // Only show filter chips for change kinds this app actually uses.
  const filters = useMemo(() => {
    const present = new Set(releases.flatMap((r) => r.items.map((i) => i.kind)));
    return [
      { kind: 'all' as const, label: t.filterAll },
      ...FILTER_ORDER.filter((k) => present.has(k)).map((k) => ({ kind: k, label: t.kind[k] })),
    ];
  }, [releases, t]);

  return createPortal(
    <div
      className={`fixed inset-0 flex items-stretch justify-end transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ zIndex }}
      role="dialog"
      aria-modal="true"
      aria-label={t.dialogLabel}
    >
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div
        className={`relative w-full max-w-3xl h-full overflow-hidden flex flex-col bg-white dark:bg-[#0B0F1A] text-gray-900 dark:text-gray-100 border-l border-gray-200 dark:border-white/[0.06] shadow-2xl transition-transform duration-200 ${
          visible ? 'translate-x-0' : 'translate-x-6'
        }`}
      >
        {/* Header */}
        <div className="relative shrink-0 px-6 pt-6 pb-5 border-b border-gray-200 dark:border-white/[0.06]">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
            aria-label={t.close}
          >
            <X size={18} />
          </button>

          <div className="flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t.whatsNewIn}{' '}
                <span className="font-normal" style={{ fontFamily: "'Varela Round', sans-serif" }}>
                  {brandNode ?? (
                    <>{brandPrefix}<span className="text-red-600">oo</span>{brandSuffix}</>
                  )}
                </span>
              </h1>
              <p className="mt-1 text-sm leading-relaxed text-gray-500 dark:text-slate-400">
                {t.subtitleLead}{' '}
                <span className="font-mono font-semibold text-red-600 dark:text-red-400">
                  v{latest.version}
                </span>{' '}
                · <span className="font-medium">{latest.codename}</span> · {latest.date}.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  v{latest.version} {t.live}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-white/[0.05] dark:text-slate-300">
                  <Tag size={12} /> {totals.releases} {t.releases}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-white/[0.05] dark:text-slate-300">
                  <GitPullRequest size={12} /> {totals.changes} {t.changes}
                </span>
                <a
                  href={`${repoUrl}/pulls?q=is%3Apr+is%3Aclosed`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/[0.05] dark:text-slate-300 dark:hover:bg-white/[0.08] transition-colors"
                >
                  <ExternalLink size={12} /> {t.viewAllPRs}
                </a>
              </div>
            </div>
          </div>

          {/* Search + filter row */}
          <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
              />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full h-9 pl-9 pr-3 text-sm rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 dark:bg-white/[0.04] dark:border-white/[0.08] dark:text-gray-100 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 transition-colors"
              />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {filters.map((f) => {
                const active = activeFilter === f.kind;
                return (
                  <button
                    key={f.kind}
                    onClick={() => setActiveFilter(f.kind)}
                    className={`px-2.5 h-7 rounded-full text-xs font-medium transition-colors border ${
                      active
                        ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/40 dark:text-red-300'
                        : 'bg-transparent border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300 dark:border-white/[0.08] dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-white/[0.16]'
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {filteredReleases.length === 0 && (
            <div className="text-center py-16 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 dark:border-white/[0.08] dark:text-slate-500">
              <p className="text-sm">{t.noMatch}</p>
            </div>
          )}

          <ol className="relative space-y-5">
            {filteredReleases.map((release, idx) => {
              const isOpen = openVersions[release.version] ?? false;
              const isLatest = idx === 0 && release.version === releases[0].version;
              return (
                <li key={release.version} className="relative">
                  {idx < filteredReleases.length - 1 && (
                    <span
                      className="absolute left-[18px] top-12 bottom-[-20px] w-px bg-gray-200 dark:bg-white/[0.08]"
                      aria-hidden
                    />
                  )}

                  <div className="flex items-stretch gap-4">
                    <div className="shrink-0 pt-3">
                      <div
                        className={`relative w-9 h-9 rounded-full flex items-center justify-center ${
                          isLatest
                            ? 'bg-red-50 border border-red-200 dark:bg-red-500/10 dark:border-red-500/40'
                            : 'bg-gray-100 border border-gray-200 dark:bg-white/[0.04] dark:border-white/[0.08]'
                        }`}
                      >
                        <Tag
                          size={14}
                          className={
                            isLatest
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-gray-400 dark:text-slate-500'
                          }
                        />
                        {isLatest && (
                          <span className="absolute inset-0 rounded-full bg-red-500/30 animate-ping opacity-50" />
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() => toggle(release.version)}
                        className="w-full text-left rounded-2xl overflow-hidden border bg-white border-gray-200 hover:border-gray-300 dark:bg-white/[0.03] dark:border-white/[0.06] dark:hover:border-white/[0.12] transition-colors"
                      >
                        <div className="flex items-center gap-3 px-5 py-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-base font-bold font-mono text-gray-900 dark:text-white">
                                v{release.version}
                              </span>
                              <span className="text-gray-300 dark:text-slate-600">·</span>
                              <span className="text-sm font-medium text-gray-700 dark:text-slate-200">
                                {release.codename}
                              </span>
                              {isLatest && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-red-600 text-white">
                                  {t.latest}
                                </span>
                              )}
                            </div>
                            <p className="text-xs mt-0.5 text-gray-400 dark:text-slate-500">
                              {release.date} · {release.items.length}{' '}
                              {release.items.length === 1 ? t.change : t.changesPlural}
                            </p>
                          </div>
                          {isOpen ? (
                            <ChevronUp size={16} className="text-gray-400 dark:text-slate-500" />
                          ) : (
                            <ChevronDown size={16} className="text-gray-400 dark:text-slate-500" />
                          )}
                        </div>

                        {isOpen && (
                          <div className="border-t border-gray-100 px-5 py-4 dark:border-white/[0.06]">
                            <p className="text-sm leading-relaxed text-gray-600 dark:text-slate-400">
                              {release.summary}
                            </p>
                          </div>
                        )}
                      </button>

                      {isOpen && (
                        <ul className="mt-3 space-y-2">
                          {release.items.map((item, i) => {
                            const meta = KIND_META[item.kind];
                            const Icon = item.icon;
                            return (
                              <li
                                key={i}
                                className="flex items-start gap-3 rounded-xl px-4 py-3 border bg-gray-50 border-gray-100 hover:border-gray-200 dark:bg-white/[0.02] dark:border-white/[0.06] dark:hover:border-white/[0.12] transition-colors"
                              >
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white border border-gray-200 dark:bg-white/[0.04] dark:border-white/[0.06]">
                                  <Icon size={15} className="text-gray-600 dark:text-slate-300" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <span
                                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide border ${meta.classes}`}
                                    >
                                      <span className={`w-1 h-1 rounded-full ${meta.dot}`} />
                                      {t.kind[item.kind]}
                                    </span>
                                    {(item.prs ?? []).map((n) => (
                                      <a
                                        key={n}
                                        href={`${repoUrl}/pull/${n}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-500 hover:text-red-600 hover:bg-gray-200 dark:bg-white/[0.05] dark:text-slate-400 dark:hover:text-red-300 dark:hover:bg-white/[0.08] transition-colors"
                                        title={`Pull request #${n}`}
                                      >
                                        <GitPullRequest size={10} />#{n}
                                      </a>
                                    ))}
                                  </div>
                                  <p className="text-sm leading-relaxed text-gray-700 dark:text-slate-300">
                                    {item.text}
                                  </p>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-gray-200 dark:border-white/[0.06] text-gray-400 dark:text-slate-500 flex items-center justify-between text-xs">
          <span>
            {t.footerPre}{' '}
            <a
              href="https://semver.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-red-600 underline dark:text-slate-300 dark:hover:text-red-300"
            >
              SemVer
            </a>
            {t.footerPost}
          </span>
          <button
            onClick={handleClose}
            className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 text-gray-500 hover:text-gray-900 dark:bg-white/[0.05] dark:text-slate-400 dark:hover:text-slate-100"
          >
            {t.close} <kbd className="font-mono text-[10px]">Esc</kbd>
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
