import type { StyleSpecification } from 'maplibre-gl';

export function cloneStyle(style: StyleSpecification): StyleSpecification {
  return JSON.parse(JSON.stringify(style)) as StyleSpecification;
}

// --- Custom swisstopo restyle -----------------------------------------------
// Runtime restyle of the swisstopo "Leichte Basiskarte" vector tiles, tuned as a
// full-detail dark counterpart under the colour-coded parcel-value polygons.
// Labels render above the parcel fills (see addParcelLayers), so street/place
// names over saturated parcels stay readable.
//
// Each is a runtime transform of the upstream style.json rather than a
// hand-authored copy: swisstopo keep owning the sources, glyphs, sprite and
// geometry; we only override paint + visibility. Unknown future symbol layers
// degrade safely by being recoloured to light text.

// A `match` on road `class` so motorways/trunks read a touch stronger than the
// rest — a faint hierarchy without leaning on casings.
export const roadColorByClass = (major: string, minor: string): unknown => [
  'match', ['get', 'class'],
  ['motorway', 'trunk', 'primary'], major,
  minor,
];

// text-color + halo in one go; layout (font/size/placement/language) untouched.
export const labelPaint = (
  color: string, halo: string, haloWidth: number, haloBlur = 0.5,
): Record<string, unknown> => ({
  'text-color': color,
  'text-halo-color': halo,
  'text-halo-width': haloWidth,
  'text-halo-blur': haloBlur,
});

export interface RestyleSpec {
  // Non-symbol layer id → paint overrides (background/fill/line). Includes the
  // `background` layer keyed by id.
  recolor: Record<string, Record<string, unknown>>;
  // Layer ids (any type, incl. symbols) to drop via visibility:none.
  hide: Set<string>;
  // Symbol layer id → text paint overrides for labels we keep + fine-tune.
  labels: Record<string, Record<string, unknown>>;
  // Fate of symbol layers that are neither in `labels` nor `hide`.
  symbolDefault: 'hide' | Record<string, unknown>;
}

export function applyRestyle(style: StyleSpecification, spec: RestyleSpec): StyleSpecification {
  const next = cloneStyle(style);
  for (const layer of next.layers ?? []) {
    const l = layer as unknown as {
      id: string;
      type: string;
      paint?: Record<string, unknown>;
      layout?: Record<string, unknown>;
    };
    if (spec.hide.has(l.id)) {
      l.layout = { ...l.layout, visibility: 'none' };
      continue;
    }
    if (l.type === 'symbol') {
      const label = spec.labels[l.id];
      if (label) {
        l.paint = { ...l.paint, ...label };
      } else if (spec.symbolDefault === 'hide') {
        l.layout = { ...l.layout, visibility: 'none' };
      } else {
        l.paint = { ...l.paint, ...spec.symbolDefault };
      }
      continue;
    }
    const recolor = spec.recolor[l.id]; // background / fill / line
    if (recolor) l.paint = { ...l.paint, ...recolor };
  }
  return next;
}
