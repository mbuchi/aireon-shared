export {
  getFlagByBfs,
  getFlagsByCanton,
  getAllFlags,
  fetchFlagSvgMarkup,
  isSvgFlagUrl,
  getFlagApiBase,
  setFlagApiBase,
  clearFlagCache,
  FlagApiError,
} from './client';
export type { FlagRecord, FlagImageMode, FlagFetchOptions } from './client';

export { useMunicipalityFlag } from './useMunicipalityFlag';
export type { UseMunicipalityFlagResult } from './useMunicipalityFlag';

export { MunicipalityFlag, default as MunicipalityFlagDefault } from './MunicipalityFlag';
export type { MunicipalityFlagProps } from './MunicipalityFlag';
