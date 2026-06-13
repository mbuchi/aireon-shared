import { Tag, MapPin, Navigation, TrendingUp } from 'lucide-react';
import { Skeleton } from '../skeleton/Skeleton';
import type { Comparable } from './comparables';
import {
  getComparablesStrings,
  type ComparablesLabels,
  type Locale,
} from './i18n';

export interface ComparablesPanelProps {
  refPriceM2: number | null;
  comparables: Comparable[];
  loading: boolean;
  darkMode: boolean;
  onJumpTo: (lng: number, lat: number) => void;
  /**
   * Localized strings. When omitted, the built-in defaults for `locale` are
   * used — so a host app can adopt the panel with only `locale`, or pass
   * `labels` to wire it to its own i18n.
   */
  labels?: ComparablesLabels;
  /** Locale for the built-in default labels when `labels` is not given. */
  locale?: Locale;
}

const chf = new Intl.NumberFormat('de-CH', { maximumFractionDigits: 0 });

function formatDistance(m: number): string {
  if (m < 1000) return `${Math.round(m)} m`;
  return `${(m / 1000).toFixed(m < 10_000 ? 2 : 1)} km`;
}

function ComparableCardSkeleton({
  darkMode,
  delay,
}: {
  darkMode: boolean;
  delay?: string;
}) {
  return (
    <div
      className={`w-full rounded-lg p-3 ${
        darkMode
          ? 'bg-white/[0.03] ring-1 ring-white/[0.05]'
          : 'bg-gray-50 ring-1 ring-gray-200'
      }`}
      aria-hidden
    >
      <div className="flex items-center justify-between gap-2">
        <Skeleton dark={darkMode} width={140} height={11} radius={4} delay={delay} />
        <Skeleton dark={darkMode} width={42} height={10} radius={4} delay={delay} />
      </div>
      <div className="mt-2 flex items-center gap-2.5">
        <Skeleton dark={darkMode} width={56} height={9} radius={3} delay={delay} />
        <Skeleton dark={darkMode} width={62} height={9} radius={3} delay={delay} />
        <Skeleton dark={darkMode} width={70} height={9} radius={3} delay={delay} />
      </div>
      <div className="mt-2">
        <Skeleton dark={darkMode} width={110} height={9} radius={3} delay={delay} />
      </div>
    </div>
  );
}

export function ComparablesPanel({
  refPriceM2,
  comparables,
  loading,
  darkMode,
  onJumpTo,
  labels,
  locale = 'en',
}: ComparablesPanelProps) {
  const strings = labels ?? getComparablesStrings(locale);

  if (loading) {
    // 3-card skeleton mirroring ComparableCard layout. Cascading delay gives
    // the eye a horizontal sweep instead of three blocks all pulsing in sync.
    return (
      <div
        className="space-y-2"
        role="status"
        aria-live="polite"
        aria-label={strings.loading}
      >
        <ComparableCardSkeleton darkMode={darkMode} />
        <ComparableCardSkeleton darkMode={darkMode} delay="80ms" />
        <ComparableCardSkeleton darkMode={darkMode} delay="160ms" />
      </div>
    );
  }
  if (comparables.length === 0) {
    return (
      <div
        className={`flex items-start gap-2 rounded-lg p-3 text-[11.5px] ${
          darkMode
            ? 'bg-white/[0.04] text-gray-400'
            : 'bg-gray-50 text-gray-500'
        }`}
      >
        <Tag size={12} className="mt-0.5 shrink-0" aria-hidden />
        <span>{strings.empty}</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {comparables.map((c) => {
        const delta =
          refPriceM2 && refPriceM2 > 0
            ? ((c.priceM2 - refPriceM2) / refPriceM2) * 100
            : null;
        const deltaSign = delta == null ? '' : delta > 0 ? '+' : '';
        const ariaLabel = strings.cardAria({
          price: chf.format(Math.round(c.priceM2)),
          distance: Math.round(c.distanceM),
          area: c.area != null ? chf.format(Math.round(c.area)) : '—',
        });
        return (
          <button
            type="button"
            key={c.parcelId}
            onClick={() => onJumpTo(c.lng, c.lat)}
            aria-label={ariaLabel}
            className={`w-full text-left rounded-lg p-3 transition-colors ${
              darkMode
                ? 'bg-white/[0.03] hover:bg-white/[0.06] ring-1 ring-white/[0.05]'
                : 'bg-gray-50 hover:bg-gray-100 ring-1 ring-gray-200'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Tag
                  size={12}
                  className={darkMode ? 'text-amber-400' : 'text-amber-600'}
                  aria-hidden
                />
                <span
                  className={`text-[11.5px] font-semibold truncate ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                  title={c.parcelId}
                >
                  CHF {chf.format(Math.round(c.priceM2))} / m²
                </span>
              </div>
              {delta != null && (
                <span
                  className={`text-[10.5px] font-semibold tabular-nums ${
                    delta > 5
                      ? darkMode
                        ? 'text-red-300'
                        : 'text-red-600'
                      : delta < -5
                        ? darkMode
                          ? 'text-emerald-300'
                          : 'text-emerald-700'
                        : darkMode
                          ? 'text-gray-300'
                          : 'text-gray-500'
                  }`}
                >
                  {deltaSign}
                  {delta.toFixed(1)}%
                </span>
              )}
            </div>
            <div
              className={`mt-1 flex items-center gap-2.5 text-[10.5px] ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              <span className="inline-flex items-center gap-1">
                <Navigation size={9} aria-hidden />
                {formatDistance(c.distanceM)}
              </span>
              {c.area != null && (
                <span className="inline-flex items-center gap-1 tabular-nums">
                  <TrendingUp size={9} aria-hidden />
                  {chf.format(Math.round(c.area))} m²
                </span>
              )}
              {c.city && (
                <span className="inline-flex items-center gap-1 truncate">
                  <MapPin size={9} aria-hidden />
                  <span className="truncate">{c.city}</span>
                </span>
              )}
            </div>
            {c.zone && (
              <div
                className={`mt-1 text-[10px] truncate ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`}
                title={c.zone}
              >
                {c.zone}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default ComparablesPanel;
