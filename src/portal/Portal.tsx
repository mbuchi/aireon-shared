import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface PortalProps {
  children: ReactNode;
  /** Optional target container. Defaults to document.body. */
  container?: HTMLElement;
}

/**
 * Standardised Portal component to render children outside the parent DOM hierarchy
 * (defaults to document.body), preventing clipping inside overflow-hidden parent containers.
 */
export function Portal({ children, container }: PortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const target = container || document.body;
  return createPortal(children, target);
}
