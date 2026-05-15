import type { LucideIcon } from 'lucide-react';

export type ChangeKind = 'new' | 'improved' | 'fixed' | 'breaking' | 'docs';

export interface ChangeItem {
  kind: ChangeKind;
  icon: LucideIcon;
  text: string;
  prs: number[];
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
