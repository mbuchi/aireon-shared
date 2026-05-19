// Standard SwissNovo avatar — an <img> with a graceful initials fallback
// used whenever the image is missing or fails to load.

import { useState } from 'react';

export interface AvatarProps {
  /** Avatar image URL, or `null` to show the initials fallback. */
  url: string | null;
  /** Initials shown when there is no image. */
  initials: string;
  /** Rendered width/height in pixels. */
  size?: number;
  className?: string;
}

export function Avatar({ url, initials, size = 28, className = '' }: AvatarProps) {
  const [errored, setErrored] = useState(false);
  const show = url && !errored;

  if (!show) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-full bg-red-600 font-semibold text-white ${className}`}
        style={{ width: size, height: size, fontSize: Math.round(size * 0.42) }}
      >
        {initials}
      </span>
    );
  }

  return (
    <img
      src={url}
      alt=""
      width={size}
      height={size}
      onError={() => setErrored(true)}
      className={`rounded-full bg-gray-100 object-contain p-0.5 dark:bg-gray-700 ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
