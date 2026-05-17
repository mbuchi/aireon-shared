// Official-source context enrichment for Claire.
//
// Claire's per-parcel context is fed from two places:
//  1. The `properties` the host app passes (its RES API map-tile data).
//  2. This module — authoritative federal records pulled live from
//     geo.admin.ch (swisstopo/BFS), keyless and CORS-enabled:
//       - GWR  — Federal Register of Buildings and Dwellings
//       - ARE  — harmonised building zones (zoning)
//       - swisstopo locality register (postal town)
//
// One `identify` request covers all three layers. Best-effort: any failure
// just yields less context, never an error.

const IDENTIFY_API =
  'https://api3.geo.admin.ch/rest/services/api/MapServer/identify';

const GWR_LAYER = 'ch.bfs.gebaeude_wohnungs_register';
const BAUZONEN_LAYER = 'ch.are.bauzonen';
const PLZ_LAYER = 'ch.swisstopo-vd.ortschaftenverzeichnis_plz';

// GWR code catalogues (BFS Merkmalskatalog) — only the fields a property
// assistant actually needs, decoded to English.
const GKAT: Record<string, string> = {
  '1010': 'Provisional accommodation',
  '1020': 'Residential building (residential use only)',
  '1030': 'Residential building with secondary use',
  '1040': 'Building with partial residential use',
  '1060': 'Building without residential use',
  '1080': 'Special structure',
};
const GKLAS: Record<string, string> = {
  '1110': 'One-dwelling building',
  '1121': 'Two-dwelling building',
  '1122': 'Building with three or more dwellings',
  '1130': 'Residential building for communities',
  '1211': 'Hotel building',
  '1212': 'Other short-stay accommodation building',
  '1220': 'Office building',
  '1230': 'Wholesale / retail building',
  '1231': 'Restaurant / bar building',
  '1241': 'Transport / communications building',
  '1242': 'Garage building',
  '1251': 'Industrial building',
  '1252': 'Tank / silo / warehouse building',
  '1261': 'Culture / leisure building',
  '1262': 'Museum / library building',
  '1263': 'School / university building',
  '1264': 'Hospital building',
  '1265': 'Sports hall',
  '1271': 'Agricultural building',
  '1272': 'Church / religious building',
  '1273': 'Historic monument',
  '1274': 'Other non-residential building',
  '1275': 'Other building',
  '1276': 'Protective structure',
};
const GSTAT: Record<string, string> = {
  '1001': 'Planned',
  '1002': 'Authorised',
  '1003': 'Under construction',
  '1004': 'Existing',
  '1005': 'Not usable',
  '1007': 'Demolished',
  '1008': 'Not built',
};
const GBAUP: Record<string, string> = {
  '8011': 'before 1919',
  '8012': '1919–1945',
  '8013': '1946–1960',
  '8014': '1961–1970',
  '8015': '1971–1980',
  '8016': '1981–1985',
  '8017': '1986–1990',
  '8018': '1991–1995',
  '8019': '1996–2000',
  '8020': '2001–2005',
  '8021': '2006–2010',
  '8022': '2011–2015',
  '8023': '2016–2020',
  '8024': '2021–2025',
  '8025': '2026–2030',
};

interface IdentifyResult {
  layerBodId?: string;
  properties?: Record<string, unknown>;
  attributes?: Record<string, unknown>;
}

function str(v: unknown): string | undefined {
  if (v === undefined || v === null || v === '') return undefined;
  return String(v);
}

function num(v: unknown): number | undefined {
  if (v === undefined || v === null || v === '') return undefined;
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function firstString(
  attrs: Record<string, unknown>,
  keys: string[],
): string | undefined {
  for (const k of keys) {
    const s = str(attrs[k]);
    if (s !== undefined) return s;
  }
  return undefined;
}

function gwrLines(p: Record<string, unknown>): string[] {
  const lines: string[] = [];
  const add = (label: string, value: string | number | undefined) => {
    if (value !== undefined && value !== '') lines.push(`- ${label}: ${value}`);
  };

  add('GWR building ID (EGID)', str(p.egid));
  add('Building address (GWR)', str(p.strname_deinr));
  const place = [str(p.dplz4) ?? str(p.plz_plz6), str(p.ggdename ?? p.dplzname)]
    .filter(Boolean)
    .join(' ');
  add('Municipality', [place, str(p.gdekt)].filter(Boolean).join(', ') || undefined);
  add('Official parcel ID (EGRID)', str(p.egrid));

  const year = num(p.gbauj);
  add('Construction year', year ?? (str(p.gbaup) && GBAUP[String(p.gbaup)]));
  add('Floors above ground', num(p.gastw));
  add('Dwellings', num(p.ganzwhg));
  add('Building footprint', num(p.garea) !== undefined ? `${num(p.garea)} m²` : undefined);
  add('Building volume', num(p.gvol) !== undefined ? `${num(p.gvol)} m³` : undefined);
  add(
    'Energy reference area',
    num(p.gebf) !== undefined ? `${num(p.gebf)} m²` : undefined,
  );
  add('Building category', str(p.gkat) && GKAT[String(p.gkat)]);
  add('Building class', str(p.gklas) && GKLAS[String(p.gklas)]);
  add('Building status', str(p.gstat) && GSTAT[String(p.gstat)]);

  // Dwelling sizes — compact range from the per-dwelling room-count array.
  const rooms = Array.isArray(p.wazim)
    ? (p.wazim as unknown[]).map(num).filter((n): n is number => n !== undefined)
    : [];
  if (rooms.length > 0) {
    const min = Math.min(...rooms);
    const max = Math.max(...rooms);
    add('Dwelling sizes', min === max ? `${min} rooms` : `${min}–${max} rooms`);
  }

  return lines;
}

export interface ClaireContext {
  /** Ready-to-prepend context block ('' when nothing is found / on error). */
  text: string;
  /** GWR street address ("Fliegaufstrasse 7, 8280 Kreuzlingen"), when found. */
  address?: string;
}

/**
 * Fetches authoritative federal records for a coordinate. Returns the context
 * block plus the GWR street address. Never throws — best-effort enrichment.
 */
export async function fetchClaireContext(
  lng: number,
  lat: number,
  signal?: AbortSignal,
): Promise<ClaireContext> {
  const delta = 0.0012;
  const params = new URLSearchParams({
    geometry: `${lng},${lat}`,
    geometryType: 'esriGeometryPoint',
    geometryFormat: 'geojson',
    imageDisplay: '1024,768,96',
    mapExtent: `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`,
    tolerance: '6',
    layers: `all:${GWR_LAYER},${BAUZONEN_LAYER},${PLZ_LAYER}`,
    sr: '4326',
    returnGeometry: 'false',
    lang: 'en',
  });

  let results: IdentifyResult[];
  try {
    const res = await fetch(`${IDENTIFY_API}?${params}`, { signal });
    if (!res.ok) return { text: '' };
    const data = (await res.json()) as { results?: IdentifyResult[] };
    results = data.results ?? [];
  } catch {
    return { text: '' };
  }

  const sections: string[] = [];
  let address: string | undefined;

  // GWR — closest building (first result).
  const gwr = results.find((r) => r.layerBodId === GWR_LAYER);
  if (gwr) {
    const p = gwr.properties ?? gwr.attributes ?? {};
    const lines = gwrLines(p);
    if (lines.length > 0) {
      sections.push(`Federal Register of Buildings and Dwellings (GWR):\n${lines.join('\n')}`);
    }
    // GWR street address — used as the signal/conversation address fallback
    // when the host app's tile data carries no address field.
    const street = str(p.strname_deinr);
    if (street) {
      const city = str(p.ggdename) ?? str(p.dplzname);
      const zip = str(p.dplz4) ?? str(p.plz_plz6);
      const place = [zip, city].filter(Boolean).join(' ');
      address = place ? `${street}, ${place}` : street;
    }
  }

  // Harmonised building zone (ARE).
  const zone = results.find((r) => r.layerBodId === BAUZONEN_LAYER);
  const zoneName = zone
    ? firstString(zone.properties ?? zone.attributes ?? {}, [
        'ch_bez_d',
        'ch_bez_f',
      ])
    : undefined;

  // Locality register (postal town) — fallback when GWR has no building.
  const plz = results.find((r) => r.layerBodId === PLZ_LAYER);
  const plzAttrs = plz ? plz.properties ?? plz.attributes ?? {} : {};
  const town = firstString(plzAttrs, ['ortbez27', 'ortbez18', 'ortschaftsname']);
  const code = firstString(plzAttrs, ['plz', 'postleitzahl']);

  const misc: string[] = [];
  if (zoneName) misc.push(`- Harmonised building zone (ARE): ${zoneName}`);
  if (town || code) {
    misc.push(`- Locality: ${[code, town].filter(Boolean).join(' ')}`);
  }
  if (misc.length > 0) {
    sections.push(`Official zoning & locality (swisstopo / ARE):\n${misc.join('\n')}`);
  }

  const text =
    sections.length === 0
      ? ''
      : `Authoritative Swiss federal records for this location:\n\n${sections.join('\n\n')}`;
  return { text, address };
}
