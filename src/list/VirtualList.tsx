import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Skeleton } from '../skeleton/Skeleton';

// Suite-default primitive for long, non-tabular scrollable lists (search results,
// publication feeds, etc). Renders only the visible window via TanStack Virtual.
// The scroll container needs a bounded height — set it through `style`/`className`
// (e.g. `style={{ height: 480 }}` or a flex parent + `className="flex-1"`).

export interface VirtualListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  /** Estimated item height (px) or a per-index estimator. Default 56. */
  estimateSize?: number | ((index: number) => number);
  /** Extra rows rendered above/below the viewport. Default 8. */
  overscan?: number;
  getItemKey?: (item: T, index: number) => string | number;
  /** Called when the user scrolls near the bottom (infinite scroll). */
  onEndReached?: () => void;
  /** Distance from the bottom (px) that triggers `onEndReached`. Default 200. */
  endReachedThreshold?: number;
  /** Show skeleton rows instead of items. */
  loading?: boolean;
  /** Skeleton row count while `loading`. Default 8. */
  skeletonRows?: number;
  emptyMessage?: ReactNode;
  className?: string;
  /** Must establish a bounded height for virtualization to work. */
  style?: CSSProperties;
  ariaLabel?: string;
}

export function VirtualList<T>({
  items,
  renderItem,
  estimateSize = 56,
  overscan = 8,
  getItemKey,
  onEndReached,
  endReachedThreshold = 200,
  loading = false,
  skeletonRows = 8,
  emptyMessage,
  className,
  style,
  ariaLabel,
}: VirtualListProps<T>): JSX.Element {
  const scrollRef = useRef<HTMLDivElement>(null);
  const estimator =
    typeof estimateSize === 'function' ? estimateSize : () => estimateSize;

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: estimator,
    overscan,
    getItemKey: getItemKey
      ? (index) => getItemKey(items[index], index)
      : undefined,
  });

  // Fire onEndReached when the last item enters the rendered window.
  const virtualItems = virtualizer.getVirtualItems();
  const lastIndex = virtualItems.length ? virtualItems[virtualItems.length - 1].index : -1;
  useEffect(() => {
    if (!onEndReached || items.length === 0) return;
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight <= endReachedThreshold;
    if (lastIndex >= items.length - 1 && nearBottom) onEndReached();
  }, [lastIndex, items.length, onEndReached, endReachedThreshold]);

  if (loading) {
    return (
      <div
        className={`overflow-auto ${className ?? ''}`}
        style={style}
        role="status"
        aria-busy="true"
      >
        {Array.from({ length: skeletonRows }).map((_, i) => (
          <Skeleton
            key={i}
            height={typeof estimateSize === 'number' ? estimateSize - 12 : 44}
            delay={`${i * 80}ms`}
            className="mx-2 my-1.5"
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div
        className={`flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 ${
          className ?? ''
        }`}
        style={style}
      >
        {emptyMessage ?? 'No items'}
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className={`overflow-auto ${className ?? ''}`}
      style={style}
      role="list"
      aria-label={ariaLabel}
    >
      <div
        style={{ height: virtualizer.getTotalSize(), width: '100%', position: 'relative' }}
      >
        {virtualItems.map((vi) => (
          <div
            key={vi.key}
            role="listitem"
            data-index={vi.index}
            ref={virtualizer.measureElement}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${vi.start}px)`,
            }}
          >
            {renderItem(items[vi.index], vi.index)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default VirtualList;
