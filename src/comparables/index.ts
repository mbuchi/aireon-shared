// Shared "Nearby comparables" feature: a parcel-info-panel section that ranks
// nearby for-sale parcels by similarity and renders them as clickable cards.
//
// Two halves, usable independently:
//   - rankComparables()  — pure ranking logic (no React); import from the
//     `@aireon/shared/comparables` subpath in tests/node without the barrel.
//   - <ComparablesPanel/> — the presentational card list.
//
// Both are also re-exported from the main `@aireon/shared` barrel.

export { rankComparables } from './comparables';
export type { ComparableInput, Comparable } from './comparables';

export { ComparablesPanel, default as ComparablesPanelDefault } from './ComparablesPanel';
export type { ComparablesPanelProps } from './ComparablesPanel';

export {
  getComparablesStrings,
  COMPARABLES_STRINGS,
  type ComparablesLabels,
  type Locale as ComparablesLocale,
} from './i18n';
