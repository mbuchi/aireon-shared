// Typed RES API client — public surface.

export {
  createResApiClient,
  RES_API_BASE_URL,
} from './client';
export type {
  ResApiClient,
  ResApiClientOptions,
} from './client';

// Full generated contract types, for callers that need to name request or
// response shapes directly.
export type { paths, components, operations } from './schema';

import type { components } from './schema';

/** Convenience aliases for the most-used RES API data shapes. */
export type JsonError = components['schemas']['JsonError'];
export type ParcelTree = components['schemas']['ParcelTree'];
export type GeoJSONFeatureCollection = components['schemas']['GeoJSONFeatureCollection'];
export type PoiDetail = components['schemas']['PoiDetail'];
export type SignalRecord = components['schemas']['SignalRecord'];
export type SwissnovoImage = components['schemas']['SwissnovoImage'];
export type Coordinates = components['schemas']['Coordinates'];
