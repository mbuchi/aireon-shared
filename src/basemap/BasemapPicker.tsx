import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Layers } from 'lucide-react';
import type { Map as MaplibreMap } from 'maplibre-gl';
import { BasemapThumbMap } from './BasemapThumbMap';
import {
  BASEMAP_OPTIONS, getBasemapOption, resolveBasemapStyle, themeBasemapId,
  type BasemapOption,
} from './options';
import type { BasemapLabels } from './i18n';

/** Pure decision for theme auto-pairing. Exported for unit testing. */
export function nextThemeBasemap(
  { dark, pinned, current }: { dark: boolean; pinned: boolean; current: string },
): string | null {
  if (pinned) return null;
  const target = themeBasemapId(dark);
  return target === current ? null : target;
}

export interface BasemapPickerProps {
  map: MaplibreMap | null;
  labels: BasemapLabels;
  /** Required: re-add the app's own data layers after the style swap + load. */
  onBasemapApplied: (map: MaplibreMap, basemap: BasemapOption) => void;
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  dark?: boolean;
  /** Suite standard: ON. Manual pick pins and suppresses further auto-pairing. */
  pairWithTheme?: boolean;
  options?: BasemapOption[];
  className?: string;
}

export const BasemapPicker = ({
  map, labels, onBasemapApplied, value, defaultValue,
  onChange, dark = false, pairWithTheme = true, options = BASEMAP_OPTIONS, className,
}: BasemapPickerProps) => {
  const controlled = value != null;
  const [internal, setInternal] = useState(
    () => value ?? defaultValue ?? themeBasemapId(dark),
  );
  const selectedId = controlled ? (value as string) : internal;
  const [open, setOpen] = useState(false);

  // Pinned ONLY by an explicit user pick (see `select`). A controlled `value`
  // from the host must NOT count as pinned — otherwise theme pairing (the
  // suite-standard default) would never fire for apps that drive the picker
  // with a controlled value. Initial / deep-linked basemaps are protected by
  // skipping the theme effect's mount run below, not by pinning.
  const pinnedRef = useRef<boolean>(false);
  const styleReqRef = useRef(0);
  const onAppliedRef = useRef(onBasemapApplied);
  onAppliedRef.current = onBasemapApplied;

  const applyBasemap = useCallback((id: string) => {
    if (!map) return;
    const basemap = getBasemapOption(id);
    const reqId = ++styleReqRef.current;
    void resolveBasemapStyle(basemap).then((style) => {
      if (!map || styleReqRef.current !== reqId) return;
      map.once('style.load', () => {
        if (styleReqRef.current !== reqId) return;
        onAppliedRef.current(map, basemap);
      });
      map.setStyle(style as any);
    }).catch((e) => console.error(`basemap "${id}" failed`, e));
  }, [map]);

  const select = (id: string) => {
    pinnedRef.current = true;            // manual pick pins
    setOpen(false);
    if (!controlled) setInternal(id);
    onChange?.(id);
    applyBasemap(id);
  };

  // Theme pairing: when `dark` flips (NOT on mount), auto-swap to the matching
  // basemap — unless the user has pinned a manual pick or we're already on the
  // matching basemap. Skipping the mount run preserves an explicit initial /
  // deep-linked basemap (the host's first render shouldn't be overridden).
  const themeMountRef = useRef(true);
  useEffect(() => {
    if (themeMountRef.current) { themeMountRef.current = false; return; }
    if (!pairWithTheme || !map) return;
    const next = nextThemeBasemap({ dark, pinned: pinnedRef.current, current: selectedId });
    if (!next) return;
    if (!controlled) setInternal(next);
    onChange?.(next);
    applyBasemap(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dark]);

  // Markup mirrors valoo's gallery exactly; styling ships in
  // '@aireon/shared/basemap.css' (host-agnostic, no Tailwind dependency) so the
  // picker is identical across Tailwind apps and non-Tailwind hosts (goody).
  const labelFor = (id: string) => labels.options[id] ?? labels.control;

  return (
    <div
      className={`aireon-bm${dark ? ' aireon-bm--dark' : ''}${className ? ` ${className}` : ''}`}
      data-tour="basemap-selector"
    >
      <div className="aireon-bm__card">
        <button
          type="button"
          aria-label={labels.control}
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={() => setOpen((o) => !o)}
          className="aireon-bm__trigger"
        >
          <Layers size={18} aria-hidden="true" />
          <span className="aireon-bm__label">{labelFor(selectedId)}</span>
          <ChevronDown className={`aireon-bm__chev${open ? ' is-open' : ''}`} aria-hidden="true" />
        </button>

        {open && (
          <div role="menu" aria-label={labels.control} className="aireon-bm__menu">
            <div className="aireon-bm__grid">
              {options.map((opt) => {
                const selected = opt.id === selectedId;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="menuitemradio"
                    aria-checked={selected}
                    onClick={() => select(opt.id)}
                    className={`aireon-bm__opt${selected ? ' is-selected' : ''}`}
                  >
                    <span className="aireon-bm__thumb">
                      <BasemapThumbMap basemap={opt} />
                      {selected && (
                        <span className="aireon-bm__check">
                          <Check size={10} strokeWidth={3} aria-hidden="true" />
                        </span>
                      )}
                    </span>
                    <span className="aireon-bm__optlabel">{labelFor(opt.id)}</span>
                  </button>
                );
              })}
            </div>
            <p className="aireon-bm__attr">© swisstopo</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasemapPicker;
