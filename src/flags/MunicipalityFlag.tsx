import { type CSSProperties, type ImgHTMLAttributes, useState } from 'react';
import { type FlagImageMode } from './client';
import { useMunicipalityFlag } from './useMunicipalityFlag';

type ImgProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'width' | 'height'>;

export interface MunicipalityFlagProps extends ImgProps {
  /** BFS municipality code to resolve and render. */
  bfsCode: number | null | undefined;
  /** `'original'` (SVG, default) or `'png'`. SVG blobs render fine in `<img>`. */
  imageMode?: FlagImageMode;
  /** Square edge length in px. Defaults to 24. */
  size?: number;
  /** Override the roolez_api base URL (see `setFlagApiBase`). */
  apiBase?: string;
  /** Custom alt text. Defaults to "<municipality> flag". */
  alt?: string;
  /** Rendered while loading or when no flag exists. Defaults to a neutral box. */
  fallback?: React.ReactNode;
}

/**
 * Drop-in municipality-flag image. Resolves the flag for `bfsCode` via the
 * shared roolez_api client and renders it as a square `<img>`. Shows the
 * `fallback` (a neutral rounded box by default) while loading, when no flag
 * exists, or if the asset fails to load. No token or per-app proxy required —
 * the flag blob is public.
 *
 * @example
 * <MunicipalityFlag bfsCode={261} size={32} />
 */
export function MunicipalityFlag({
  bfsCode,
  imageMode,
  size = 24,
  apiBase,
  alt,
  fallback,
  style,
  ...imgProps
}: MunicipalityFlagProps) {
  const { flag } = useMunicipalityFlag(bfsCode, { imageMode, apiBase });
  const [broken, setBroken] = useState(false);

  const boxStyle: CSSProperties = {
    width: size,
    height: size,
    display: 'inline-block',
    flexShrink: 0,
    ...style,
  };

  if (!flag?.flag_url || broken) {
    if (fallback !== undefined) return <>{fallback}</>;
    return (
      <span
        aria-hidden="true"
        style={{
          ...boxStyle,
          borderRadius: 4,
          background: 'rgba(100,116,139,0.18)',
        }}
      />
    );
  }

  return (
    <img
      src={flag.flag_url}
      alt={alt ?? `${flag.municipality_name} flag`}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      onError={() => setBroken(true)}
      style={{ ...boxStyle, objectFit: 'contain' }}
      {...imgProps}
    />
  );
}

export default MunicipalityFlag;
