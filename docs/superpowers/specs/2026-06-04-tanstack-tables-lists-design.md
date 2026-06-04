# TanStack as the suite default for tables & lists

- **Date:** 2026-06-04
- **Status:** Approved (design), in implementation
- **Home repo:** `@swissnovo/shared` (canonical components live here)
- **Scope:** Make TanStack Table + TanStack Virtual the suite-standard primitives for
  tabular data and long lists, delivered as shared components and rolled out across the
  core SwissNovo apps.

## Problem

Across the suite, tables are hand-rolled `<table>` markup (≥17 apps) with no consistent
sorting, filtering, pagination, accessibility, or virtualization. Long lists render every
row to the DOM. Two apps (`taxoo`, `vacoo`) already adopted `@tanstack/react-table`
independently, so implementations are diverging. There is no shared primitive, so every
new table/list re-solves the same problems inconsistently.

## Decision

1. **TanStack is the default tool** for tables and lists suite-wide.
2. Deliver it as **two shared components in `@swissnovo/shared`** so the whole suite
   imports one implementation:
   - `<DataTable<T>>` — TanStack Table (sorting, optional global filter, optional
     pagination, optional row virtualization, skeleton loading, empty state, a11y).
   - `<VirtualList<T>>` — TanStack Virtual for long non-tabular lists.
3. **Convert** existing `<table>` markup → `<DataTable>`, and **virtualize** long lists
   (hundreds+ of rows) → `<VirtualList>`. Short lists (<~50 rows) are left alone (YAGNI).
4. Roll out to **all applicable core apps now** via the standard publish workflow
   (auto-merge). Exclude the blockchain repos and non-React/vanilla apps.

## Foundation — `@swissnovo/shared` (v0.47.0 → v0.48.0)

- New deps (added to `dependencies` so consuming apps get them transitively):
  `@tanstack/react-table`, `@tanstack/react-virtual`.
- New modules: `src/table/DataTable.tsx`, `src/list/VirtualList.tsx` (+ shared types),
  exported from `src/index.ts`.
- Reuse the existing `src/skeleton/Skeleton.tsx` for loading states.
- Build with `tsup`, `tsc --noEmit` clean, bump to **0.48.0**, tag **v0.48.0**.

### `<DataTable<T>>` API

```ts
interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  loading?: boolean;              // shows skeleton rows
  enableSorting?: boolean;        // default true
  enableGlobalFilter?: boolean;   // default false (renders a search box when true)
  globalFilterPlaceholder?: string;
  pageSize?: number;              // when set, client pagination + controls
  virtualize?: boolean | number;  // true, or a row-count threshold (default auto > 100)
  estimateRowHeight?: number;     // default 44; used when virtualizing
  maxHeight?: number | string;    // scroll container height (required to virtualize)
  stickyHeader?: boolean;         // default true
  density?: 'comfortable' | 'compact';
  onRowClick?: (row: T) => void;
  getRowId?: (row: T) => string;
  className?: string;
  emptyMessage?: React.ReactNode;
}
```

- Real `<table>`/`<thead>`/`<tbody>` semantics; `aria-sort` on sortable headers; click /
  Enter to toggle sort with lucide chevrons. Per-column cell rendering via TanStack
  `ColumnDef.cell`; per-column alignment/class via `ColumnDef.meta`.
- Row virtualization uses TanStack Virtual with top/bottom spacer rows inside a scroll
  container; enabled when `virtualize` is truthy or row count exceeds the threshold.
- Tailwind styling matching suite tables; fully overridable via `className` + column meta.

### `<VirtualList<T>>` API

```ts
interface VirtualListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  estimateSize?: number | ((index: number) => number); // default 56
  overscan?: number;                                    // default 8
  getItemKey?: (item: T, index: number) => React.Key;
  onEndReached?: () => void;                            // infinite-scroll hook
  endReachedThreshold?: number;                         // px from bottom, default 200
  loading?: boolean;
  emptyMessage?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;   // must establish a bounded height
}
```

## Rollout plan (phased; no user wait between phases)

- **Phase 1 — Foundation.** Build + ship shared **v0.48.0** (PR → squash-merge → tag).
  Done by hand with a real `tsup` build + typecheck.
- **Phase 2 — Prove it on `toolbox`** (10 table files — largest consumer). Validates the
  `<DataTable>` API end-to-end before fan-out.
- **Phase 3 — Fan out** to remaining applicable apps:
  `proom, choose, scoops, valoo, watchoo, xploore, booklet, geopool, roofs, scoore`,
  plus `taxoo`/`vacoo` (align their bespoke TanStack usage to the shared component **only
  where no features are lost**; otherwise leave + note). `roolez-api`/`roolez-collector`
  only if their remote is `mbuchi/*` (else PR-and-stop).

### Per-app procedure (standard publish workflow, auto-merge)

1. `git fetch` + fast-forward; set per-repo git identity if missing.
2. `npm install "github:mbuchi/swissnovo-shared#v0.48.0"`.
3. Convert each `<table>` → `<DataTable>` (map columns to `ColumnDef`, preserve existing
   behavior/formatting/links). Virtualize any long list → `<VirtualList>`.
4. **Verify: typecheck/lint/build green** — the hard gate. Never ship broken code.
5. Prepend a release-notes entry (`src/data/releaseNotes.ts`).
6. Commit only touched files (named `git add`), push feature branch, open PR, squash-merge.
7. Toolbox `tools.json` sync is N/A (internal rendering change doesn't alter surfaced
   purpose/flags), except for `toolbox` itself.

## Excluded

- Blockchain repos: `brokereum-admin`, `brokereum-ico-dashboard`, `realioo-supabase`,
  `brokereum_node` (separate ownership; PR-and-stop, not in this campaign).
- Non-React / vanilla / backend: `voogle2`, `gwr-scraper` (goody), `hood`, `similoo`,
  `project_RES`, `*-node`, `valooEngine`, infra-only repos.

## Risks & mitigations

- **Behavior drift during conversion** → preserve existing cell formatting, sorting
  semantics, and row links one-for-one; build must be green before merge.
- **Bundle size** → TanStack Table + Virtual are small + tree-shakeable; only imported
  where used.
- **Shared-tag resolution gotcha** → consuming apps must
  `npm install "github:mbuchi/swissnovo-shared#v0.48.0"` (plain `npm install` won't
  re-resolve a changed git tag).
- **Virtualization needs bounded height** → only virtualize inside a scroll container with
  a fixed `maxHeight`/`style.height`.

## Success criteria

- `<DataTable>` + `<VirtualList>` shipped in `@swissnovo/shared` v0.48.0, typecheck + build
  green, exported from the package root.
- Every applicable app's hand-rolled tables replaced by `<DataTable>`; long lists
  virtualized; each app builds green and is merged (= deployed).
- A memory records TanStack as the suite default for tables/lists.
