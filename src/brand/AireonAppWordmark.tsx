import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

const WORDMARK_STYLE: CSSProperties = {
  fontFamily: 'var(--hood-display, "Varela Round", system-ui, sans-serif)',
  fontWeight: 400,
  lineHeight: 1,
  letterSpacing: 0,
};

const SIZE_CLASS = {
  nav: 'text-xl sm:text-2xl',
  compact: 'text-xl',
  large: 'text-2xl sm:text-3xl',
} as const;

export type AireonAppWordmarkSize = keyof typeof SIZE_CLASS;

export interface AireonAppWordmarkProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Lowercase app name, e.g. `valoo`, `scoore`, `contoor`. */
  name: string;
  /** Standard size token. `nav` matches the valoo navbar baseline. */
  size?: AireonAppWordmarkSize;
  /** Classes for non-`oo` letters. */
  baseClassName?: string;
  /** Classes for every `oo` pair in the app name. */
  accentClassName?: string;
}

function renderWordmarkParts(
  name: string,
  baseClassName: string,
  accentClassName: string,
): ReactNode[] {
  const parts: ReactNode[] = [];
  const re = /oo/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(name)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <span key={`base-${lastIndex}`} className={baseClassName}>
          {name.slice(lastIndex, match.index)}
        </span>,
      );
    }
    parts.push(
      <span key={`accent-${match.index}`} className={accentClassName}>
        {name.slice(match.index, match.index + 2)}
      </span>,
    );
    lastIndex = match.index + 2;
  }

  if (lastIndex < name.length) {
    parts.push(
      <span key={`base-${lastIndex}`} className={baseClassName}>
        {name.slice(lastIndex)}
      </span>,
    );
  }

  return parts.length ? parts : [name];
}

/**
 * Suite-standard app wordmark: Varela Round, normal weight, no negative
 * tracking, and the canonical red treatment for every double `oo`.
 */
export function AireonAppWordmark({
  name,
  size = 'nav',
  className = '',
  baseClassName = 'text-gray-900 dark:text-gray-100',
  accentClassName = 'text-red-500 dark:text-red-400',
  style,
  'aria-label': ariaLabel,
  ...rest
}: AireonAppWordmarkProps) {
  return (
    <span
      {...rest}
      aria-label={ariaLabel ?? name}
      className={`inline-flex items-baseline whitespace-nowrap font-normal leading-none select-none ${SIZE_CLASS[size]} ${className}`.trim()}
      style={{ ...WORDMARK_STYLE, ...style }}
    >
      {renderWordmarkParts(name, baseClassName, accentClassName)}
    </span>
  );
}

export default AireonAppWordmark;
