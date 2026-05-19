import {
  type CSSProperties,
  type ElementType,
  type ReactNode,
  useInsertionEffect,
} from 'react';

// Self-contained skeleton-loader primitive for the SwissNovo suite.
// Replaces spinners on content/data areas with a slow, smooth opacity pulse.
// Injects its own keyframes once — no Tailwind / CSS-file wiring required.

const STYLE_ID = 'swn-skeleton-styles';

// 1.8s ease-in-out blink, opacity 1 -> 0.4 -> 1: a calm, "pro" pulse rather
// than a fast flicker. Base colour adapts to a `.dark` / [data-theme="dark"]
// ancestor; the `dark` prop can force it for apps that theme via a boolean.
const STYLE_CONTENT =
  '.swn-skeleton{' +
  '--swn-skeleton-color:rgba(15,23,42,0.09);' +
  'border-radius:8px;' +
  'background-color:var(--swn-skeleton-color);' +
  'animation:swn-skeleton-blink 1.8s ease-in-out infinite}' +
  '.swn-skeleton-group{display:flex;flex-direction:column}' +
  '.dark .swn-skeleton,[data-theme="dark"] .swn-skeleton{' +
  '--swn-skeleton-color:rgba(255,255,255,0.11)}' +
  '@keyframes swn-skeleton-blink{0%,100%{opacity:1}50%{opacity:0.4}}' +
  '@media (prefers-reduced-motion:reduce){' +
  '.swn-skeleton{animation-duration:3s}}';

function useSkeletonStyles(): void {
  useInsertionEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement('style');
    el.id = STYLE_ID;
    el.textContent = STYLE_CONTENT;
    document.head.appendChild(el);
  }, []);
}

const DARK_COLOR = 'rgba(255,255,255,0.11)';
const LIGHT_COLOR = 'rgba(15,23,42,0.09)';

function toDim(v?: number | string): string | undefined {
  return typeof v === 'number' ? `${v}px` : v;
}

export interface SkeletonProps {
  /** Width — number is treated as px. */
  width?: number | string;
  /** Height — number is treated as px. */
  height?: number | string;
  /** Corner radius — number is px. Defaults to 8px. */
  radius?: number | string;
  /** Render a circle (avatar/icon placeholder). Uses `width` for both axes if `height` is omitted. */
  circle?: boolean;
  /** Force the dark base colour, for apps that theme via a boolean rather than a `.dark` class. */
  dark?: boolean;
  /** Stagger delay for cascading groups, e.g. "120ms". */
  delay?: string;
  /** Extra classes (Tailwind sizing/layout etc.). */
  className?: string;
  style?: CSSProperties;
  /** Element tag. Defaults to 'div'. */
  as?: ElementType;
}

/** A single skeleton block. Shape it with `width`/`height` or `className`. */
export function Skeleton({
  width,
  height,
  radius,
  circle,
  dark,
  delay,
  className,
  style,
  as,
}: SkeletonProps): JSX.Element {
  useSkeletonStyles();
  const Tag = (as ?? 'div') as ElementType;
  const css: CSSProperties = {
    width: toDim(width),
    height: toDim(height) ?? (circle ? toDim(width) : undefined),
    borderRadius: circle ? '9999px' : toDim(radius),
    animationDelay: delay,
    ...(dark != null
      ? ({ '--swn-skeleton-color': dark ? DARK_COLOR : LIGHT_COLOR } as CSSProperties)
      : {}),
    ...style,
  };
  return (
    <Tag
      className={`swn-skeleton${className ? ` ${className}` : ''}`}
      style={css}
      aria-hidden="true"
    />
  );
}

export interface SkeletonTextProps {
  /** Number of text lines. Defaults to 3. */
  lines?: number;
  /** Gap between lines — number is px. Defaults to 8px. */
  gap?: number | string;
  /** Height of each line — number is px. Defaults to 12px. */
  lineHeight?: number | string;
  /** Width of the final line (shorter, for a natural paragraph end). Defaults to "60%". */
  lastLineWidth?: number | string;
  /** Force the dark base colour. */
  dark?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** A stack of skeleton lines for paragraph-shaped content, with a cascading pulse. */
export function SkeletonText({
  lines = 3,
  gap = 8,
  lineHeight = 12,
  lastLineWidth = '60%',
  dark,
  className,
  style,
}: SkeletonTextProps): JSX.Element {
  useSkeletonStyles();
  return (
    <div
      className={`swn-skeleton-group${className ? ` ${className}` : ''}`}
      style={{ gap: toDim(gap), ...style }}
      aria-hidden="true"
    >
      {Array.from({ length: Math.max(1, lines) }).map((_, i) => (
        <Skeleton
          key={i}
          height={lineHeight}
          dark={dark}
          delay={`${i * 90}ms`}
          width={i === lines - 1 && lines > 1 ? lastLineWidth : '100%'}
        />
      ))}
    </div>
  );
}

export interface SkeletonProviderProps {
  children: ReactNode;
}

/** Optional wrapper carrying an accessible "loading" label for a skeleton region. */
export function SkeletonGroup({ children }: SkeletonProviderProps): JSX.Element {
  return (
    <div role="status" aria-busy="true" aria-live="polite">
      {children}
    </div>
  );
}
