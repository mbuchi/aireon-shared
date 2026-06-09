import type { ReactNode } from 'react';

export interface NavIconButtonProps {
  /** Icon node (e.g. a lucide-react icon, ~18px). */
  icon: ReactNode;
  /** Label — shown as the instant hover tooltip and used for aria-label/title. */
  label: string;
  /** Click handler. */
  onClick?: () => void;
  /** Active/selected state — subtle neutral background, full-ink icon. */
  active?: boolean;
  /** Force dark styling. Otherwise adapts to an ancestor `.dark`. */
  dark?: boolean;
  /** Extra class names on the wrapper. */
  className?: string;
}

/**
 * `NavIconButton` — the suite "Toolbar Lab" variant-1 navbar button: a
 * monochrome icon (muted grey at rest — near-white in dark, dark-grey in light —
 * brightening on hover) with an **instant** tooltip below. The active page gets
 * a subtle neutral background; no per-icon colour. Self-contained styling
 * (`@aireon/shared/map-ui.css`), so it matches in any host regardless of
 * Tailwind config.
 */
export function NavIconButton({
  icon,
  label,
  onClick,
  active = false,
  dark = false,
  className,
}: NavIconButtonProps) {
  return (
    <span className={'aireon-navbtn-wrap' + (dark ? ' aireon-navbtn-wrap--dark' : '') + (className ? ` ${className}` : '')}>
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        aria-current={active ? 'page' : undefined}
        className={'aireon-navbtn' + (active ? ' aireon-navbtn--active' : '')}
      >
        {icon}
      </button>
      <span role="tooltip" className="aireon-navbtn-tip">
        {label}
      </span>
    </span>
  );
}

export default NavIconButton;
