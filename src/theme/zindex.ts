/**
 * SwissNovo semantic z-index scale.
 * Helps prevent ad-hoc z-index layering conflicts across the suite.
 */
export const Z_INDEX = {
  /** Bottom base level (e.g. underlying custom canvas) */
  base: 0,
  /** Deep layout/background layers */
  bg: 10,
  /** Content cards or relative layout elements */
  content: 20,
  /** Main navigation header and action bars */
  header: 50,
  /** Sidebar panels and drawer filters */
  drawer: 1000,
  /** Modals, dialog backdrops, and overlay panels */
  modal: 2000,
  /** Dropdown menu popovers and select lists */
  dropdown: 3000,
  /** Tooltips, toast notifications, and popovers */
  tooltip: 4000,
  /** Stacking level for full-screen screenshots / tour overlays */
  overlay: 5000,
  /** Absolute top layer (e.g. error boundary crash panel or global loader) */
  top: 2147483647,
} as const;

export type ZIndexKey = keyof typeof Z_INDEX;
