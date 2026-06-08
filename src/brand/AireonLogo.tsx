import type { CSSProperties } from 'react';
import { AIREON_LOGO_PATH, AIREON_LOGO_VIEWBOX } from './aireonLogoPath';

export interface AireonLogoProps {
  /** Sizing/colour utility classes. Height-based sizing is recommended
   *  (e.g. `h-5 w-auto`); the mark inherits text colour via `currentColor`. */
  className?: string;
  style?: CSSProperties;
  /** Accessible name. Pass `title=""` to render the mark as decorative
   *  (aria-hidden) when an adjacent text label already names it. */
  title?: string;
}

/**
 * The Aireon wordmark, rendered as inline SVG so it inherits `currentColor`
 * and stays crisp at any size. This is the single source of truth for the
 * suite's primary logo — apps render `<AireonLogo />` rather than embedding
 * the raw file, so a future redraw is one change here.
 *
 * Default colour follows the surrounding text colour. To pin a colour, set a
 * Tailwind text-* class (or `style={{ color }}`) on the element.
 */
export function AireonLogo({ className, style, title = 'aireon' }: AireonLogoProps) {
  const decorative = title === '';
  return (
    <svg
      viewBox={AIREON_LOGO_VIEWBOX}
      className={className}
      style={style}
      role={decorative ? 'presentation' : 'img'}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : title}
      focusable="false"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {!decorative && <title>{title}</title>}
      <path fillRule="evenodd" clipRule="evenodd" d={AIREON_LOGO_PATH} />
    </svg>
  );
}

export default AireonLogo;
