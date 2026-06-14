import { useEffect, useRef } from 'react';

export interface UseFocusTrapOptions {
  active?: boolean;
  onEscape?: () => void;
  restoreFocus?: boolean;
}

export function useFocusTrap<T extends HTMLElement = HTMLElement>(
  options: UseFocusTrapOptions = {}
) {
  const { active = true, onEscape, restoreFocus = true } = options;
  const ref = useRef<T | null>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;

    // Capture the currently focused element to restore it later
    if (typeof document !== 'undefined') {
      previousFocus.current = document.activeElement as HTMLElement;
    }

    return () => {
      const prev = previousFocus.current;
      // Only restore focus if the trigger is still in the document. A common
      // pattern closes a menu (unmounting its trigger) before opening the modal,
      // so the captured element can be detached — refocusing it would silently
      // drop focus to <body>. In that case leave focus where the browser put it.
      if (
        restoreFocus &&
        prev &&
        typeof prev.focus === 'function' &&
        typeof document !== 'undefined' &&
        document.contains(prev)
      ) {
        prev.focus();
      }
    };
  }, [active, restoreFocus]);

  useEffect(() => {
    if (!active) return;

    const element = ref.current;
    if (!element) return;

    const FOCUSABLE_SELECTOR =
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onEscape) {
        onEscape();
        return;
      }

      if (e.key !== 'Tab') return;

      const focusables = element.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      const activeElement = document.activeElement;

      if (e.shiftKey) {
        // Shift + Tab (Backward)
        if (activeElement === first || !element.contains(activeElement)) {
          last.focus();
          e.preventDefault();
        }
      } else {
        // Tab (Forward)
        if (activeElement === last || !element.contains(activeElement)) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    // Auto-focus first focusable element inside the modal on mount
    const focusables = element.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    if (focusables.length > 0) {
      // Focus first element on next frame to let rendering finalize
      const timer = setTimeout(() => {
        focusables[0].focus();
      }, 50);
      
      element.addEventListener('keydown', handleKeyDown);
      return () => {
        clearTimeout(timer);
        element.removeEventListener('keydown', handleKeyDown);
      };
    }

    element.addEventListener('keydown', handleKeyDown);
    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [active, onEscape]);

  return ref;
}
