import { useRef, useState, type ReactNode } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type RowData,
  type SortingState,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  ChevronDown,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react';
import { Skeleton } from '../skeleton/Skeleton';

// Suite-default table primitive for the SwissNovo apps. A thin, self-contained
// wrapper over TanStack Table — sorting, optional global filter, optional client
// pagination, optional row virtualization (for large datasets), skeleton loading,
// empty state and accessible markup. No Redux / i18n coupling: labels come in via
// `strings`, state is internal. Styling mirrors the suite table look and is fully
// overridable through `className` and per-column `meta`.

// Per-column presentation hints, available on every ColumnDef.meta across the suite.
declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    /** Horizontal alignment of the cell + header. */
    align?: 'left' | 'right' | 'center';
    /** Extra classes for body cells in this column. */
    className?: string;
    /** Extra classes for the header cell in this column. */
    headerClassName?: string;
  }
}

export interface DataTableStrings {
  searchPlaceholder: string;
  /** Sort-button aria-label; `{column}` is replaced with the header text. */
  sortBy: string;
  empty: string;
  firstPage: string;
  previousPage: string;
  nextPage: string;
  lastPage: string;
  page: string;
  of: string;
}

export const DATA_TABLE_STRINGS_EN: DataTableStrings = {
  searchPlaceholder: 'Search…',
  sortBy: 'Sort by {column}',
  empty: 'No data',
  firstPage: 'First page',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  lastPage: 'Last page',
  page: 'Page',
  of: 'of',
};

export interface DataTableProps<T> {
  columns: ColumnDef<T, any>[];
  data: T[];
  /** Show skeleton rows instead of data. */
  loading?: boolean;
  /** Skeleton row count while `loading`. Default 8. */
  skeletonRows?: number;
  /** Enable click-to-sort headers. Default true. */
  enableSorting?: boolean;
  /** Render a global search box above the table. Default false. */
  enableGlobalFilter?: boolean;
  /** When set, client-paginates with controls. Disables virtualization. */
  pageSize?: number;
  /**
   * Row virtualization for large datasets. `true` forces it on; a number sets
   * the row-count threshold above which it auto-enables. Default: auto > 100.
   * Requires `maxHeight` (a bounded scroll container). Ignored when `pageSize`
   * is set.
   */
  virtualize?: boolean | number;
  /** Estimated row height (px) used when virtualizing. Default 44. */
  estimateRowHeight?: number;
  /** Overscan rows when virtualizing. Default 10. */
  overscan?: number;
  /** Scroll-container height. Required to virtualize; also enables sticky header. */
  maxHeight?: number | string;
  /** Sticky header (within the scroll container). Default true. */
  stickyHeader?: boolean;
  density?: 'comfortable' | 'compact';
  onRowClick?: (row: T) => void;
  getRowId?: (row: T, index: number) => string;
  className?: string;
  /** Override the empty-state node entirely. */
  emptyMessage?: ReactNode;
  /** Localized labels. Defaults to English. */
  strings?: Partial<DataTableStrings>;
  /** Accessible table caption (visually hidden). */
  ariaLabel?: string;
}

function toDim(v?: number | string): string | undefined {
  return typeof v === 'number' ? `${v}px` : v;
}

const alignClass = (a?: 'left' | 'right' | 'center') =>
  a === 'right' ? 'text-right' : a === 'center' ? 'text-center' : 'text-left';

export function DataTable<T>({
  columns,
  data,
  loading = false,
  skeletonRows = 8,
  enableSorting = true,
  enableGlobalFilter = false,
  pageSize,
  virtualize,
  estimateRowHeight = 44,
  overscan = 10,
  maxHeight,
  stickyHeader = true,
  density = 'comfortable',
  onRowClick,
  getRowId,
  className,
  emptyMessage,
  strings,
  ariaLabel,
}: DataTableProps<T>): JSX.Element {
  const s = { ...DATA_TABLE_STRINGS_EN, ...strings };
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const paginated = typeof pageSize === 'number' && pageSize > 0;

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    enableSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableGlobalFilter ? getFilteredRowModel() : undefined,
    getPaginationRowModel: paginated ? getPaginationRowModel() : undefined,
    getRowId,
    initialState: paginated ? { pagination: { pageIndex: 0, pageSize } } : undefined,
  });

  const rows = table.getRowModel().rows;

  // Decide whether to virtualize: never with pagination; otherwise honor an
  // explicit boolean, a numeric threshold, or the default >100 auto-trigger.
  const threshold = typeof virtualize === 'number' ? virtualize : 100;
  const doVirtualize =
    !paginated &&
    maxHeight != null &&
    (virtualize === true || (virtualize !== false && rows.length > threshold));

  const scrollRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => estimateRowHeight,
    overscan,
    enabled: doVirtualize,
  });

  const cellPad = density === 'compact' ? 'px-3 py-1.5' : 'px-4 py-2.5';
  const headPad = density === 'compact' ? 'px-3 py-2' : 'px-4 py-3';
  const colCount = table.getAllLeafColumns().length;

  const virtualItems = doVirtualize ? rowVirtualizer.getVirtualItems() : [];
  const paddingTop = doVirtualize && virtualItems.length ? virtualItems[0].start : 0;
  const paddingBottom =
    doVirtualize && virtualItems.length
      ? rowVirtualizer.getTotalSize() - virtualItems[virtualItems.length - 1].end
      : 0;

  const renderRow = (row: (typeof rows)[number]) => (
    <tr
      key={row.id}
      onClick={onRowClick ? () => onRowClick(row.original) : undefined}
      className={`transition-colors ${
        onRowClick ? 'cursor-pointer' : ''
      } hover:bg-gray-50 dark:hover:bg-gray-800/60`}
    >
      {row.getVisibleCells().map((cell) => {
        const meta = cell.column.columnDef.meta;
        return (
          <td
            key={cell.id}
            className={`${cellPad} whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 ${alignClass(
              meta?.align
            )} ${meta?.className ?? ''}`}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        );
      })}
    </tr>
  );

  return (
    <div className={`flex flex-col gap-3 ${className ?? ''}`}>
      {enableGlobalFilter && (
        <div className="relative flex-shrink-0">
          <Search
            size={15}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={s.searchPlaceholder}
            aria-label={s.searchPlaceholder}
            className="w-full max-w-xs rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
          />
        </div>
      )}

      <div
        ref={scrollRef}
        className="overflow-auto rounded-lg border border-gray-200 dark:border-gray-700"
        style={{ maxHeight: toDim(maxHeight) }}
      >
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          {ariaLabel && <caption className="sr-only">{ariaLabel}</caption>}
          <thead
            className={`bg-gray-100 dark:bg-gray-800 ${
              stickyHeader && maxHeight != null ? 'sticky top-0 z-10' : ''
            }`}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta;
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      aria-sort={
                        canSort
                          ? sorted === 'asc'
                            ? 'ascending'
                            : sorted === 'desc'
                            ? 'descending'
                            : 'none'
                          : undefined
                      }
                      className={`${headPad} text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 whitespace-nowrap ${alignClass(
                        meta?.align
                      )} ${meta?.headerClassName ?? ''}`}
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          aria-label={s.sortBy.replace(
                            '{column}',
                            typeof header.column.columnDef.header === 'string'
                              ? header.column.columnDef.header
                              : header.column.id
                          )}
                          className={`group inline-flex items-center gap-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                            meta?.align === 'right' ? 'flex-row-reverse' : ''
                          }`}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {sorted === 'desc' ? (
                            <ChevronDown size={14} aria-hidden="true" className="text-blue-500" />
                          ) : sorted === 'asc' ? (
                            <ChevronUp size={14} aria-hidden="true" className="text-blue-500" />
                          ) : (
                            <ChevronDown
                              size={14}
                              aria-hidden="true"
                              className="text-gray-300 opacity-0 transition-opacity group-hover:opacity-100 dark:text-gray-600"
                            />
                          )}
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-900">
            {loading ? (
              Array.from({ length: skeletonRows }).map((_, r) => (
                <tr key={`sk-${r}`}>
                  {Array.from({ length: colCount }).map((__, c) => (
                    <td key={c} className={cellPad}>
                      <Skeleton height={14} delay={`${(r + c) * 40}ms`} />
                    </td>
                  ))}
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={colCount}
                  className="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  {emptyMessage ?? s.empty}
                </td>
              </tr>
            ) : doVirtualize ? (
              <>
                {paddingTop > 0 && <tr style={{ height: paddingTop }} aria-hidden="true" />}
                {virtualItems.map((vi) => renderRow(rows[vi.index]))}
                {paddingBottom > 0 && (
                  <tr style={{ height: paddingBottom }} aria-hidden="true" />
                )}
              </>
            ) : (
              rows.map(renderRow)
            )}
          </tbody>
        </table>
      </div>

      {paginated && rows.length > 0 && (
        <div className="flex flex-shrink-0 items-center justify-between gap-3 py-1">
          <div className="flex items-center gap-1">
            <PagerButton
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              label={s.firstPage}
            >
              <ChevronsLeft size={16} aria-hidden="true" />
            </PagerButton>
            <PagerButton
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              label={s.previousPage}
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </PagerButton>
            <PagerButton
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              label={s.nextPage}
            >
              <ChevronRight size={16} aria-hidden="true" />
            </PagerButton>
            <PagerButton
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              label={s.lastPage}
            >
              <ChevronsRight size={16} aria-hidden="true" />
            </PagerButton>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {s.page}{' '}
            <strong className="text-gray-900 dark:text-gray-100">
              {table.getState().pagination.pageIndex + 1}
            </strong>{' '}
            {s.of}{' '}
            <strong className="text-gray-900 dark:text-gray-100">
              {table.getPageCount()}
            </strong>
          </span>
        </div>
      )}
    </div>
  );
}

function PagerButton({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="rounded border border-gray-200 p-1.5 text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
    >
      {children}
    </button>
  );
}

export default DataTable;
