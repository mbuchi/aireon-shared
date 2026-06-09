// Cross-app "open this location elsewhere" support for the suite navbar.
//
// The map-first apps each open to a map and accept ?lat/?lng deep links, so any
// one of them can hand a coordinate off to another. This is the data + URL
// helper behind <OpenWithMenu> (and the hub's address launcher): pick a place in
// one app, open it in another at the same spot.

export interface LaunchApp {
  /** App id == subdomain: `https://<id>.aireon.ch/`. */
  id: string;
  /** Display label (suite wordmarks are lowercase). */
  name: string;
}

// Map-first apps that accept ?lat/?lng (tools.json: mapFirst && latLng === 'yes').
// Keep in sync with the hub registry; new map apps should be added here.
export const LAUNCH_APPS: LaunchApp[] = [
  { id: 'valoo', name: 'valoo' },
  { id: 'scoore', name: 'scoore' },
  { id: 'voogle', name: 'voogle' },
  { id: 'roofs', name: 'roofs' },
  { id: 'roots', name: 'roots' },
  { id: 'geopool', name: 'geopool' },
  { id: 'groove', name: 'groove' },
  { id: 'woom', name: 'woom' },
  { id: 'footprint', name: 'footprint' },
  { id: 'proom', name: 'proom' },
  { id: 'soolar', name: 'soolar' },
  { id: 'boom', name: 'boom' },
  { id: 'room', name: 'room' },
  { id: 'snoop', name: 'snoop' },
];

/** Default zoom for cross-app deep links (launchpad spec). */
export const LAUNCH_DEFAULT_ZOOM = '15.00';

/** Build the deep link that opens `appId` at the given coordinates. */
export function buildDeepLink(
  appId: string,
  lat: number,
  lng: number,
  zoom: string | number = LAUNCH_DEFAULT_ZOOM,
): string {
  return `https://${appId}.aireon.ch/?lat=${lat}&lng=${lng}&zoom=${zoom}`;
}

/** Open `appId` at the given coordinates in a new tab. */
export function openInApp(
  appId: string,
  lat: number,
  lng: number,
  zoom: string | number = LAUNCH_DEFAULT_ZOOM,
): void {
  if (typeof window === 'undefined') return;
  window.open(buildDeepLink(appId, lat, lng, zoom), '_blank', 'noopener,noreferrer');
}
