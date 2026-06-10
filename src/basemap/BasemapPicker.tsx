import { useCallback, useEffect, useRef, useState } from 'react';
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

  // An explicit initial value (controlled or defaultValue) counts as pinned.
  const pinnedRef = useRef<boolean>(value != null || defaultValue != null);
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

  // Theme pairing: when dark flips, auto-swap unless pinned / already matching.
  useEffect(() => {
    if (!pairWithTheme || !map) return;
    const next = nextThemeBasemap({ dark, pinned: pinnedRef.current, current: selectedId });
    if (!next) return;
    if (!controlled) setInternal(next);
    onChange?.(next);
    applyBasemap(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dark]);

  return (
    <div className={className}>
      <button
        type="button"
        aria-label={labels.control}
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium shadow ring-1 transition-colors ${
          dark ? 'bg-gray-900/90 text-gray-100 ring-white/10 hover:bg-gray-800'
               : 'bg-white/95 text-gray-800 ring-black/10 hover:bg-gray-50'
        }`}
      >
        {labels.options[selectedId] ?? labels.control}
      </button>
      {open && (
        <div
          className={`mt-2 grid grid-cols-2 gap-2 rounded-xl p-2 shadow-xl ring-1 ${
            dark ? 'bg-gray-900/95 ring-white/10' : 'bg-white/95 ring-black/10'
          }`}
        >
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => select(opt.id)}
              className={`group relative h-20 w-28 overflow-hidden rounded-lg ring-2 transition ${
                opt.id === selectedId ? 'ring-emerald-500' : 'ring-transparent hover:ring-emerald-300'
              }`}
            >
              <BasemapThumbMap basemap={opt} />
              <span className="absolute bottom-0 inset-x-0 bg-black/45 px-1 py-0.5 text-[10px] font-medium text-white text-center">
                {labels.options[opt.id] ?? opt.id}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BasemapPicker;
