import type { CSSProperties, MouseEventHandler } from 'react';
import { TOOLBOX_APP_URL } from '../prm/api';

export const AIREON_HUB_URL = `${TOOLBOX_APP_URL}/`;
export const AIREON_HUB_ICON_URL = `${TOOLBOX_APP_URL}/favicon.svg`;

export interface AireonHubLinkProps {
  /** Destination. Defaults to the Aireon hub (hub.aireon.ch). */
  href?: string;
  /** Accessible name + tooltip. */
  label?: string;
  /** Classes on the wrapper — set the foreground colour here (e.g.
   *  `text-gray-900 dark:text-white`). Both the wordmark (`currentColor`) and
   *  the divider (`bg-current`) inherit it, so the badge stays one colour. */
  className?: string;
  /** Extra classes on the <a> itself (rarely needed). */
  linkClassName?: string;
  /** Classes controlling the icon size. */
  iconClassName?: string;
  /** @deprecated Use iconClassName. Retained so existing consumers compile. */
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
 * Back-to-hub badge: the canonical Aireon favicon mark as a link to the suite
 * hub.
 *
 * Dropped into an app's navbar (typically to the left of the app's own
 * wordmark) it establishes "this is an Aireon tool" and gives a one-click
 * route home to hub.aireon.ch. The image source is centralized on the hub so
 * every app renders the same artwork as the browser favicon.
 */
export function AireonHubLink({
  href = AIREON_HUB_URL,
  label = 'Aireon hub',
  className = 'text-gray-900 dark:text-white',
  linkClassName = '',
  iconClassName = 'h-6 w-6 object-contain',
  withDivider = false,
  dividerClassName = 'h-5 w-px bg-current opacity-20',
  style,
  target,
  rel,
  onClick,
}: AireonHubLinkProps) {
  return (
    <span className={'inline-flex items-center gap-2 sm:gap-2.5 ' + className} style={style}>
      <a
        href={href}
        target={target}
        rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
        onClick={onClick}
        aria-label={label}
        title={label}
        className={
          'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-current/10 bg-transparent opacity-75 transition-colors duration-150 hover:border-current/20 hover:bg-current/10 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ' +
          linkClassName
        }
      >
        <img
          src={AIREON_HUB_ICON_URL}
          alt=""
          aria-hidden="true"
          className={iconClassName}
          decoding="async"
        />
      </a>
      {withDivider && <span aria-hidden="true" className={dividerClassName} />}
    </span>
  );
}

export default AireonHubLink;
