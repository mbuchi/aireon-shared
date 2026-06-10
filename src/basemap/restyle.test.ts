import { describe, it, expect } from 'vitest';
import { applyRestyle, type RestyleSpec } from './restyle';

const baseStyle = () => ({
  version: 8 as const,
  sources: {},
  layers: [
    { id: 'background', type: 'background', paint: { 'background-color': '#fff' } },
    { id: 'water', type: 'fill', paint: { 'fill-color': '#abc' } },
    { id: 'contour_line', type: 'line', paint: { 'line-color': '#999' } },
    { id: 'place_city', type: 'symbol', paint: {} },
    { id: 'poi_other', type: 'symbol', paint: {} },
  ],
}) as any;

const spec: RestyleSpec = {
  recolor: { background: { 'background-color': '#000' }, water: { 'fill-color': '#012' } },
  hide: new Set(['contour_line']),
  labels: { place_city: { 'text-color': '#eee' } },
  symbolDefault: 'hide',
};

describe('applyRestyle', () => {
  it('recolors non-symbol layers, hides listed layers, tunes named labels, and hides other symbols', () => {
    const out = applyRestyle(baseStyle(), spec);
    const byId = Object.fromEntries(out.layers.map((l: any) => [l.id, l]));
    expect(byId.background.paint['background-color']).toBe('#000');
    expect(byId.water.paint['fill-color']).toBe('#012');
    expect(byId.contour_line.layout.visibility).toBe('none');
    expect(byId.place_city.paint['text-color']).toBe('#eee');
    expect(byId.poi_other.layout.visibility).toBe('none'); // symbolDefault 'hide'
  });

  it('relights unlisted symbols when symbolDefault is a paint object', () => {
    const out = applyRestyle(baseStyle(), { ...spec, symbolDefault: { 'text-color': '#aaa' } });
    const poi = out.layers.find((l: any) => l.id === 'poi_other') as any;
    expect(poi.paint['text-color']).toBe('#aaa');
    expect(poi.layout?.visibility).toBeUndefined();
  });

  it('does not mutate the input style (clones)', () => {
    const input = baseStyle();
    applyRestyle(input, spec);
    expect((input.layers[0] as any).paint['background-color']).toBe('#fff');
  });
});
