import type { CSSProperties, MouseEventHandler } from 'react';
import { TOOLBOX_APP_URL } from '../prm/api';

export const AIREON_HUB_URL = `${TOOLBOX_APP_URL}/`;
export const AIREON_HUB_ICON_URL = `${TOOLBOX_APP_URL}/favicon.svg`;
const AIREON_HUB_MARK_PATH =
  'M 31.25,99.5 c -6.915012,11.15301 -13.418189,22.48189 -14.25,36.75 -3.048073,15.15862 -0.04782,30.53859 5,43.5 2.117508,5.84815 7.697934,11.09884 7.75,15.75 4.184785,0.32723 8.552448,10.37892 14.25,12.5 9.251118,8.01205 19.819047,12.13779 32.420379,15 18.003721,4.06213 38.630501,1.86247 53.329621,-6 8.24296,-3.69933 21.11058,-10.28739 15.75,-22.25 -4.75992,-7.85432 -15.35683,-5.96065 -20.5,0.5 -16.69141,10.42489 -43.29751,10.77439 -59.75,0 C 52.361746,189.04526 43.842278,175.80274 40.75,162.57962 36.045825,146.96144 39.749363,128.0917 46.5,116.25 53.449676,105.89224 64.030088,95.82424 77,92.75 c 14.640951,-5.229057 35.62451,-3.882694 47.5,4.25 10.45348,4.40329 17.71285,14.76068 22.75,23.25 6.9658,15.28525 4.6613,38.55485 5.51111,57.74149 -1.46638,18.23929 5.96707,35.6398 20.98889,43.00851 8.28398,7.68659 23.74352,0.4219 20,-12.25 -3.03766,-7.67817 -15.36291,-7.68124 -16,-17 -4.5252,-13.853 -1.40158,-32.80772 -2.82931,-48.66094 C 175.0645,127.15934 170.02453,113.18112 162.5,102.5 151.10566,86.645432 135.09459,75.11581 114.82962,71.25 91.146619,65.071969 63.446958,71.622482 46.75,84.75 41.135736,88.752319 36.083337,94.62688 31.25,99.5 Z';

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
 * Back-to-hub badge: a monochrome Aireon mark as a link to the suite hub.
 *
 * Dropped into an app's navbar (typically to the left of the app's own
 * wordmark) it establishes "this is an Aireon tool" and gives a one-click
 * route home to hub.aireon.ch. The browser favicon remains the canonical
 * red-on-white asset on the hub; this navbar mark is transparent and inherits
 * currentColor so it can switch between light and dark themes.
 */
export function AireonHubLink({
  href = AIREON_HUB_URL,
  label = 'Aireon hub',
  className = 'text-gray-900 dark:text-white',
  linkClassName = '',
  iconClassName = 'h-6 w-6',
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
          'inline-flex h-9 w-9 items-center justify-center rounded-lg bg-transparent opacity-100 transition-opacity duration-150 hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ' +
          linkClassName
        }
      >
        <svg
          viewBox="15 65 185 165"
          aria-hidden="true"
          focusable="false"
          className={iconClassName}
        >
          <path
            fill="currentColor"
            fillRule="evenodd"
            d={AIREON_HUB_MARK_PATH}
          />
        </svg>
      </a>
      {withDivider && <span aria-hidden="true" className={dividerClassName} />}
    </span>
  );
}

export default AireonHubLink;
