import type { CSSProperties, MouseEventHandler } from 'react';
import { AireonLogo } from './AireonLogo';
import { TOOLBOX_APP_URL } from '../prm/api';

export interface AireonHubLinkProps {
  /** Destination. Defaults to the Aireon hub (hub.aireon.ch). */
  href?: string;
  /** Accessible name + tooltip. */
  label?: string;
  /** Classes on the <a>. */
  className?: string;
  /** Classes controlling the wordmark size/colour. Height-based recommended. */
  logoClassName?: string;
  /** Render a thin vertical rule after the badge — used when the badge sits to
   *  the left of an app's own product wordmark (`aireon │ groove`). */
  withDivider?: boolean;
  /** Classes for the divider rule (colour adapts via `bg-current`). */
  dividerClassName?: string;
  style?: CSSProperties;
  target?: string;
  rel?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

/**
 * Back-to-hub badge: the Aireon wordmark as a link to the suite hub.
 *
 * Dropped into an app's navbar (typically to the left of the app's own
 * wordmark) it establishes "this is an Aireon tool" and gives a one-click
 * route home to hub.aireon.ch. The mark inherits `currentColor` and is muted
 * by default so it reads as secondary to the app's own brand; it brightens on
 * hover/focus.
 */
export function AireonHubLink({
  href = TOOLBOX_APP_URL,
  label = 'Aireon hub',
  className = '',
  logoClassName = 'h-[17px] w-auto',
  withDivider = false,
  dividerClassName = 'h-5 w-px bg-current opacity-20',
  style,
  target,
  rel,
  onClick,
}: AireonHubLinkProps) {
  return (
    <span className="inline-flex items-center gap-2 sm:gap-2.5" style={style}>
      <a
        href={href}
        target={target}
        rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
        onClick={onClick}
        aria-label={label}
        title={label}
        className={
          'inline-flex items-center rounded-md opacity-60 transition-opacity duration-150 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ' +
          className
        }
      >
        <AireonLogo className={logoClassName} title="" />
      </a>
      {withDivider && <span aria-hidden="true" className={dividerClassName} />}
    </span>
  );
}

export default AireonHubLink;
