import type { LucideIcon } from 'lucide-react';

export type ChangeKind = 'new' | 'improved' | 'fixed' | 'breaking' | 'docs';

export interface ChangeItem {
  kind: ChangeKind;
  icon: LucideIcon;
  text: string;
  /** Related PR numbers. Optional — not every change maps to a PR. */
  prs?: number[];
}

export interface Release {
  version: string;
  date: string;
  codename: string;
  summary: string;
  highlight?: boolean;
  items: ChangeItem[];
}

export const KIND_META: Record<ChangeKind, { label: string; classes: string; dot: string }> = {
  new: {
    label: 'New',
    classes:
      'text-red-700 bg-red-50 border-red-200 dark:text-red-300 dark:bg-red-500/10 dark:border-red-500/30',
    dot: 'bg-red-500',
  },
  improved: {
    label: 'Improved',
    classes:
      'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-500/10 dark:border-amber-500/30',
    dot: 'bg-amber-500',
  },
  fixed: {
    label: 'Fixed',
    classes:
      'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-500/30',
    dot: 'bg-emerald-500',
  },
  breaking: {
    label: 'Breaking',
    classes:
      'text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/30',
    dot: 'bg-rose-500',
  },
  docs: {
    label: 'Docs',
    classes:
      'text-sky-700 bg-sky-50 border-sky-200 dark:text-sky-300 dark:bg-sky-500/10 dark:border-sky-500/30',
    dot: 'bg-sky-500',
  },
};

// Release-notes data files across the suite carry historical / non-canonical
// kinds (e.g. 'added', 'changed', 'fix') cast through `as ChangeKind`. Those
// must never crash the panel: alias the common ones to a canonical kind and
// fall back to a neutral style for anything genuinely unknown.
const KIND_ALIASES: Record<string, ChangeKind> = {
  added: 'new',
  add: 'new',
  feature: 'new',
  changed: 'improved',
  change: 'improved',
  improvement: 'improved',
  fix: 'fixed',
  bugfix: 'fixed',
  removed: 'breaking',
  doc: 'docs',
  documentation: 'docs',
};

const FALLBACK_KIND_META = {
  label: 'Update',
  classes:
    'text-gray-700 bg-gray-100 border-gray-200 dark:text-gray-300 dark:bg-white/[0.06] dark:border-white/[0.12]',
  dot: 'bg-gray-400',
};

/** Canonical ChangeKind for a (possibly aliased) kind string, or null if unknown. */
export function canonicalKind(kind: string): ChangeKind | null {
  if (kind in KIND_META) return kind as ChangeKind;
  if (kind in KIND_ALIASES) return KIND_ALIASES[kind];
  return null;
}

/** Visual meta for any kind string — tolerant: aliases map to a canonical
 *  style, unknown kinds get a neutral fallback. Never throws. */
export function resolveKindMeta(
  kind: string,
): { label: string; classes: string; dot: string } {
  const canonical = canonicalKind(kind);
  return canonical ? KIND_META[canonical] : FALLBACK_KIND_META;
}
