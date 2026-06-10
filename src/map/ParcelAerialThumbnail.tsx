import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Map as MapIcon, Maximize2, X } from 'lucide-react';
import { Z_INDEX } from '../theme/zindex';

/**
 * Shared swisstopo aerial thumbnail for parcel info panels across the suite.
 *
 * Renders a small SWISSIMAGE orthophoto of a parcel that expands to a
 * full-screen lightbox showing the parcel in its neighbourhood context. The
 * imagery comes from the geo.admin WMS GetMap — Swiss federal aerial imagery,
 * no API key, CORS-enabled (© swisstopo).
 *
 * The component is engine- and i18n-agnostic: it never imports mapbox-gl /
 * maplibre-gl (the thumbnail is a plain <img>, not an engine render) and never
 * resolves its own translations — the four strings come in via `labels`, the
 * suite-standard label-injection pattern (see MapUserMenu / ScooreMiniMap).
 */

// Picks a Web-Mercator zoom so the parcel covers ~half the image width, leaving
// a comfortable border around it. Falls back to a sane default for parcels
// without an area attribute. The zoom is turned into a ground span (and thus a
// bbox) by buildSwisstopoAerialUrl below.
export function aerialThumbnailZoom(
  areaM2: number | null,
  lat: number,
  imgWidthPx: number,
): number {
  const widthM = areaM2 && areaM2 > 0 ? Math.sqrt(areaM2) : 28;
  const cosLat = Math.cos((lat * Math.PI) / 180);
  // Web Mercator ground resolution: 156543.03 * cos(lat) / 2^z meters/pixel.
  // Solve for z so that widthM occupies `targetFraction` of the image width.
  const targetFraction = 0.5;
  const z = Math.log2((156543.03 * cosLat * targetFraction * imgWidthPx) / widthM);
  const clamped = Math.max(15, Math.min(19.5, z));
  return Math.round(clamped * 10) / 10;
}

// swisstopo SWISSIMAGE orthophoto via the geo.admin WMS GetMap — Swiss federal
// aerial imagery, no API key, CORS-enabled (© swisstopo). Turns a Web-Mercator
// zoom into the ground span the image covers, then a lat/lng bbox centred on the
// point. Engine-agnostic: produces a static <img> URL, never a tile request.
export function buildSwisstopoAerialUrl(
  lng: number,
  lat: number,
  zoom: number,
  sizePx: number,
): string {
  const cosLat = Math.cos((lat * Math.PI) / 180);
  // Ground width (m) = logical px × Web-Mercator resolution
  // (156543.03·cos(lat) / 2^zoom m per px).
  const groundM = (sizePx * 156543.03 * cosLat) / 2 ** zoom;
  const dLat = groundM / 111320;
  const dLng = groundM / (111320 * cosLat);
  // WMS 1.1.1 + EPSG:4326 uses lon,lat (x,y) bbox order. Render at 2× for retina.
  const bbox = `${lng - dLng / 2},${lat - dLat / 2},${lng + dLng / 2},${lat + dLat / 2}`;
  const params = new URLSearchParams({
    SERVICE: 'WMS',
    VERSION: '1.1.1',
    REQUEST: 'GetMap',
    LAYERS: 'ch.swisstopo.swissimage',
    STYLES: '',
    SRS: 'EPSG:4326',
    BBOX: bbox,
    WIDTH: String(Math.round(sizePx * 2)),
    HEIGHT: String(Math.round(sizePx * 2)),
    FORMAT: 'image/jpeg',
  });
  return `https://wms.geo.admin.ch/?${params.toString()}`;
}

/** The four translatable strings the component needs, injected by the host app. */
export interface ParcelAerialThumbnailLabels {
  /** alt text on both the thumbnail <img> and the lightbox <img>. */
  imageAlt: string;
  /** aria-label on the trigger button (e.g. "Enlarge aerial image"). */
  expand: string;
  /** aria-label on the lightbox dialog (e.g. "Parcel aerial preview"). */
  dialogAria: string;
  /** aria-label / title on the lightbox close (✕) button. */
  close: string;
}

export interface ParcelAerialThumbnailProps {
  lng: number;
  lat: number;
  /** Parcel area for area-based framing; pass null/omit to use the 28 m default. */
  areaM2?: number | null;
  /**
   * Optional fixed Web-Mercator zoom override. If provided, the thumbnail uses
   * it directly and the lightbox zooms out 1.2 levels from it — lets callers
   * with no parcel area pass a flat zoom. If omitted, both zooms derive from
   * `areaM2` via aerialThumbnailZoom.
   */
  zoom?: number;
  /** Thumbnail edge length in logical px. Default 88. */
  sizePx?: number;
  /** Lightbox source edge length in logical px (≈2× ground span). Default 480. */
  expandedPx?: number;
  /** Dark-mode styling toggle. */
  dark?: boolean;
  /** i18n strings — injected, never resolved inside the shared component. */
  labels: ParcelAerialThumbnailLabels;
  /** Optional wrapper class override for layout placement. */
  className?: string;
  /** Attribution overlay text. Always rendered. Defaults to "© swisstopo". */
  attribution?: string;
}

// Full-screen lightbox shown when the thumbnail is clicked. Portals to
// document.body so it escapes the panel's stacking/containing context. Closes on
// backdrop click, ✕, or Esc.
const AerialLightbox = ({
  url,
  dark,
  labels,
  attribution,
  onClose,
}: {
  url: string;
  dark: boolean;
  labels: ParcelAerialThumbnailLabels;
  attribution: string;
  onClose: () => void;
}) => {
  const [loaded, setLoaded] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  // Latest onClose via a ref so the mount effect runs exactly once (no
  // re-subscribe / focus-steal when the parent re-renders while open).
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCloseRef.current(); };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; // lock background scroll
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={labels.dialogAria}
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: Z_INDEX.overlay }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative rounded-xl overflow-hidden shadow-2xl ring-1 ${
          dark ? 'ring-white/10 bg-gray-800' : 'ring-black/10 bg-gray-100'
        }`}
        style={{ width: 'min(90vw, 85vh, 560px)', aspectRatio: '1 / 1' }}
      >
        <img
          src={url}
          alt={labels.imageAlt}
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {!loaded && (
          <div className={`absolute inset-0 flex items-center justify-center ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            <MapIcon size={28} className="animate-pulse" />
          </div>
        )}
        {/* Crosshair marker over the parcel centre. */}
        {loaded && (
          <div aria-hidden className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-2.5 h-2.5 rounded-full bg-white ring-2 ring-black/50 shadow" />
          </div>
        )}
        <span className="absolute bottom-1 right-1.5 px-1 text-[10px] leading-tight text-white/90 bg-black/40 rounded pointer-events-none select-none">
          {attribution}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={labels.close}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/45 text-white hover:bg-black/65 flex items-center justify-center transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/80"
        >
          <X size={18} />
        </button>
      </div>
    </div>,
    document.body,
  );
};

export const ParcelAerialThumbnail = ({
  lng,
  lat,
  areaM2 = null,
  zoom,
  sizePx = 88,
  expandedPx = 480,
  dark = false,
  labels,
  className,
  attribution = '© swisstopo',
}: ParcelAerialThumbnailProps) => {
  const url = useMemo(() => {
    const z = zoom ?? aerialThumbnailZoom(areaM2, lat, sizePx);
    return buildSwisstopoAerialUrl(lng, lat, z, sizePx);
  }, [lng, lat, areaM2, zoom, sizePx]);

  // Larger, slightly zoomed-out view for the lightbox so the parcel's
  // surroundings are visible (≈2× the ground span of the thumbnail).
  const expandedUrl = useMemo(() => {
    const z = zoom != null
      ? Math.max(14, zoom - 1.2)
      : Math.max(14, aerialThumbnailZoom(areaM2, lat, expandedPx) - 1.2);
    return buildSwisstopoAerialUrl(lng, lat, z, expandedPx);
  }, [lng, lat, areaM2, zoom, expandedPx]);

  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setLoaded(false);
    setErrored(false);
  }, [url]);

  const closeLightbox = () => {
    setExpanded(false);
    triggerRef.current?.focus(); // restore focus to the trigger
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setExpanded(true)}
        disabled={errored}
        aria-label={labels.expand}
        className={`group relative shrink-0 rounded-lg overflow-hidden ring-1 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
          errored ? 'cursor-default' : 'cursor-pointer'
        } ${
          dark
            ? 'ring-white/[0.08] bg-white/[0.04]'
            : 'ring-gray-200 bg-gray-100'
        }${className ? ` ${className}` : ''}`}
        style={{ width: sizePx, height: sizePx }}
      >
        {!errored && (
          <img
            src={url}
            alt={labels.imageAlt}
            width={sizePx}
            height={sizePx}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
        {(!loaded || errored) && (
          <div
            className={`absolute inset-0 flex items-center justify-center ${
              dark ? 'text-gray-500' : 'text-gray-400'
            }`}
          >
            <MapIcon size={18} className={errored ? '' : 'animate-pulse'} />
          </div>
        )}
        {/* Crosshair marker so the parcel's location reads at a glance */}
        {loaded && !errored && (
          <div
            aria-hidden
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-2 h-2 rounded-full bg-white ring-2 ring-black/40 shadow-sm" />
          </div>
        )}
        {/* Hover/focus affordance — signals the thumbnail expands on click. */}
        {loaded && !errored && (
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 group-focus-visible:bg-black/30 transition-colors"
          >
            <Maximize2
              size={16}
              className="text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity drop-shadow"
            />
          </span>
        )}
        {/* Attribution required for the SWISSIMAGE orthophoto (© swisstopo). */}
        {loaded && !errored && (
          <span className="absolute bottom-0 right-0 px-0.5 text-[7px] leading-tight text-white/85 bg-black/35 rounded-tl pointer-events-none select-none">
            {attribution}
          </span>
        )}
      </button>
      {expanded && (
        <AerialLightbox
          url={expandedUrl}
          dark={dark}
          labels={labels}
          attribution={attribution}
          onClose={closeLightbox}
        />
      )}
    </>
  );
};

export default ParcelAerialThumbnail;
