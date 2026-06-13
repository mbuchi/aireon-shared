import { Tag, Navigation, TrendingUp, MapPin } from 'lucide-react';
import { useInsertionEffect } from 'react';
import { jsx, jsxs } from 'react/jsx-runtime';

// src/comparables/comparables.ts
function num(props, keys) {
  for (const key of keys) {
    const v = props[key];
    if (v === null || v === void 0 || v === "") continue;
    const n = typeof v === "number" ? v : Number(v);
    if (Number.isFinite(n)) return n;
  }
  return null;
}
function str(props, keys) {
  for (const key of keys) {
    const v = props[key];
    if (v === null || v === void 0 || v === "") continue;
    return String(v);
  }
  return null;
}
function isForSale(props) {
  const v = props.is_sell;
  return v === true || v === 1 || v === "true" || v === "yes" || v === "1";
}
function distanceMeters(a, b) {
  const R = 6371e3;
  const toRad = (d) => d * Math.PI / 180;
  const dLat = toRad(b[1] - a[1]);
  const dLng = toRad(b[0] - a[0]);
  const sa = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[1])) * Math.cos(toRad(b[1])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(sa));
}
function rankComparables(input) {
  const { ref, pool, limit = 5, onlyForSale = true } = input;
  const refId = String(ref.properties.parcel_id ?? ref.properties.egrid ?? "");
  const refArea = num(ref.properties, [
    "area_m2",
    "parcel_area",
    "flaeche",
    "grundflaeche",
    "area"
  ]);
  const refZone = str(ref.properties, [
    "cz_local",
    "construction_zone",
    "bauzone",
    "nutzungszone"
  ]);
  const candidates = [];
  for (const c of pool) {
    const id = String(c.properties.parcel_id ?? c.properties.egrid ?? "");
    if (!id || id === refId) continue;
    if (onlyForSale && !isForSale(c.properties)) continue;
    const priceM2 = num(c.properties, ["estimated_price_m2", "price_m2"]);
    if (priceM2 == null) continue;
    const distance = distanceMeters([ref.lng, ref.lat], [c.lng, c.lat]);
    const area = num(c.properties, [
      "area_m2",
      "parcel_area",
      "flaeche",
      "grundflaeche",
      "area"
    ]);
    const zone = str(c.properties, [
      "cz_local",
      "construction_zone",
      "bauzone",
      "nutzungszone"
    ]);
    const distScore = 1 / (1 + distance / 200);
    const areaScore = refArea && area ? 1 - Math.min(1, Math.abs(Math.log(area / refArea))) : 0.5;
    const zoneScore = refZone && zone ? refZone === zone ? 1 : 0.4 : 0.5;
    const similarity = distScore * 0.5 + areaScore * 0.3 + zoneScore * 0.2;
    candidates.push({
      parcelId: id,
      lng: c.lng,
      lat: c.lat,
      distanceM: distance,
      priceM2,
      area,
      zone,
      city: str(c.properties, ["city", "ort", "cityname", "municipality", "fso_name_2021"]),
      similarity,
      properties: c.properties
    });
  }
  candidates.sort((a, b) => b.similarity - a.similarity);
  return candidates.slice(0, limit);
}
var STYLE_ID = "swn-skeleton-styles";
var STYLE_CONTENT = '.swn-skeleton{--swn-skeleton-color:rgba(15,23,42,0.09);border-radius:8px;background-color:var(--swn-skeleton-color);animation:swn-skeleton-blink 1.8s ease-in-out infinite}.swn-skeleton-group{display:flex;flex-direction:column}.dark .swn-skeleton,[data-theme="dark"] .swn-skeleton{--swn-skeleton-color:rgba(255,255,255,0.11)}@keyframes swn-skeleton-blink{0%,100%{opacity:1}50%{opacity:0.4}}@media (prefers-reduced-motion:reduce){.swn-skeleton{animation-duration:3s}}';
function useSkeletonStyles() {
  useInsertionEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = STYLE_CONTENT;
    document.head.appendChild(el);
  }, []);
}
var DARK_COLOR = "rgba(255,255,255,0.11)";
var LIGHT_COLOR = "rgba(15,23,42,0.09)";
function toDim(v) {
  return typeof v === "number" ? `${v}px` : v;
}
function Skeleton({
  width,
  height,
  radius,
  circle,
  dark,
  delay,
  className,
  style,
  as
}) {
  useSkeletonStyles();
  const Tag2 = as ?? "div";
  const css = {
    width: toDim(width),
    height: toDim(height) ?? (circle ? toDim(width) : void 0),
    borderRadius: circle ? "9999px" : toDim(radius),
    animationDelay: delay,
    ...dark != null ? { "--swn-skeleton-color": dark ? DARK_COLOR : LIGHT_COLOR } : {},
    ...style
  };
  return /* @__PURE__ */ jsx(
    Tag2,
    {
      className: `swn-skeleton${className ? ` ${className}` : ""}`,
      style: css,
      "aria-hidden": "true"
    }
  );
}
function SkeletonText({
  lines = 3,
  gap = 8,
  lineHeight = 12,
  lastLineWidth = "60%",
  dark,
  className,
  style
}) {
  useSkeletonStyles();
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `swn-skeleton-group${className ? ` ${className}` : ""}`,
      style: { gap: toDim(gap), ...style },
      "aria-hidden": "true",
      children: Array.from({ length: Math.max(1, lines) }).map((_, i) => /* @__PURE__ */ jsx(
        Skeleton,
        {
          height: lineHeight,
          dark,
          delay: `${i * 90}ms`,
          width: i === lines - 1 && lines > 1 ? lastLineWidth : "100%"
        },
        i
      ))
    }
  );
}
function SkeletonGroup({ children }) {
  return /* @__PURE__ */ jsx("div", { role: "status", "aria-busy": "true", "aria-live": "polite", children });
}

// src/comparables/i18n.ts
var en = {
  loading: "Looking for nearby for-sale parcels\u2026",
  empty: "No for-sale comparables found nearby. Zoom out for a wider catchment.",
  cardAria: ({ price, distance, area }) => `Comparable parcel at ${price} CHF per m\xB2, ${distance}m away, ${area} m\xB2`
};
var fr = {
  loading: "Recherche de parcelles \xE0 vendre \xE0 proximit\xE9\u2026",
  empty: "Aucune parcelle \xE0 vendre \xE0 proximit\xE9. D\xE9zoomez pour \xE9largir la zone.",
  cardAria: ({ price, distance, area }) => `Parcelle comparable \xE0 ${price} CHF par m\xB2, \xE0 ${distance} m, ${area} m\xB2`
};
var de = {
  loading: "Suche nach Verkaufsparzellen in der N\xE4he\u2026",
  empty: "Keine Verkaufsparzellen in der N\xE4he gefunden. Herauszoomen f\xFCr einen gr\xF6sseren Radius.",
  cardAria: ({ price, distance, area }) => `Vergleichsparzelle zu ${price} CHF pro m\xB2, ${distance} m entfernt, ${area} m\xB2`
};
var it = {
  loading: "Ricerca di parcelle in vendita nelle vicinanze\u2026",
  empty: "Nessuna parcella in vendita nelle vicinanze. Allontana lo zoom per ampliare il raggio.",
  cardAria: ({ price, distance, area }) => `Parcella comparabile a ${price} CHF al m\xB2, ${distance} m di distanza, ${area} m\xB2`
};
var COMPARABLES_STRINGS = {
  en,
  fr,
  de,
  it
};
var getComparablesStrings = (locale = "en") => COMPARABLES_STRINGS[locale] ?? COMPARABLES_STRINGS.en;
var chf = new Intl.NumberFormat("de-CH", { maximumFractionDigits: 0 });
function formatDistance(m) {
  if (m < 1e3) return `${Math.round(m)} m`;
  return `${(m / 1e3).toFixed(m < 1e4 ? 2 : 1)} km`;
}
function ComparableCardSkeleton({
  darkMode,
  delay
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `w-full rounded-lg p-3 ${darkMode ? "bg-white/[0.03] ring-1 ring-white/[0.05]" : "bg-gray-50 ring-1 ring-gray-200"}`,
      "aria-hidden": true,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsx(Skeleton, { dark: darkMode, width: 140, height: 11, radius: 4, delay }),
          /* @__PURE__ */ jsx(Skeleton, { dark: darkMode, width: 42, height: 10, radius: 4, delay })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsx(Skeleton, { dark: darkMode, width: 56, height: 9, radius: 3, delay }),
          /* @__PURE__ */ jsx(Skeleton, { dark: darkMode, width: 62, height: 9, radius: 3, delay }),
          /* @__PURE__ */ jsx(Skeleton, { dark: darkMode, width: 70, height: 9, radius: 3, delay })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsx(Skeleton, { dark: darkMode, width: 110, height: 9, radius: 3, delay }) })
      ]
    }
  );
}
function ComparablesPanel({
  refPriceM2,
  comparables,
  loading,
  darkMode,
  onJumpTo,
  labels,
  locale = "en"
}) {
  const strings = labels ?? getComparablesStrings(locale);
  if (loading) {
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: "space-y-2",
        role: "status",
        "aria-live": "polite",
        "aria-label": strings.loading,
        children: [
          /* @__PURE__ */ jsx(ComparableCardSkeleton, { darkMode }),
          /* @__PURE__ */ jsx(ComparableCardSkeleton, { darkMode, delay: "80ms" }),
          /* @__PURE__ */ jsx(ComparableCardSkeleton, { darkMode, delay: "160ms" })
        ]
      }
    );
  }
  if (comparables.length === 0) {
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: `flex items-start gap-2 rounded-lg p-3 text-[11.5px] ${darkMode ? "bg-white/[0.04] text-gray-400" : "bg-gray-50 text-gray-500"}`,
        children: [
          /* @__PURE__ */ jsx(Tag, { size: 12, className: "mt-0.5 shrink-0", "aria-hidden": true }),
          /* @__PURE__ */ jsx("span", { children: strings.empty })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsx("div", { className: "space-y-2", children: comparables.map((c) => {
    const delta = refPriceM2 && refPriceM2 > 0 ? (c.priceM2 - refPriceM2) / refPriceM2 * 100 : null;
    const deltaSign = delta == null ? "" : delta > 0 ? "+" : "";
    const ariaLabel = strings.cardAria({
      price: chf.format(Math.round(c.priceM2)),
      distance: Math.round(c.distanceM),
      area: c.area != null ? chf.format(Math.round(c.area)) : "\u2014"
    });
    return /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: () => onJumpTo(c.lng, c.lat),
        "aria-label": ariaLabel,
        className: `w-full text-left rounded-lg p-3 transition-colors ${darkMode ? "bg-white/[0.03] hover:bg-white/[0.06] ring-1 ring-white/[0.05]" : "bg-gray-50 hover:bg-gray-100 ring-1 ring-gray-200"}`,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
              /* @__PURE__ */ jsx(
                Tag,
                {
                  size: 12,
                  className: darkMode ? "text-amber-400" : "text-amber-600",
                  "aria-hidden": true
                }
              ),
              /* @__PURE__ */ jsxs(
                "span",
                {
                  className: `text-[11.5px] font-semibold truncate ${darkMode ? "text-white" : "text-gray-900"}`,
                  title: c.parcelId,
                  children: [
                    "CHF ",
                    chf.format(Math.round(c.priceM2)),
                    " / m\xB2"
                  ]
                }
              )
            ] }),
            delta != null && /* @__PURE__ */ jsxs(
              "span",
              {
                className: `text-[10.5px] font-semibold tabular-nums ${delta > 5 ? darkMode ? "text-red-300" : "text-red-600" : delta < -5 ? darkMode ? "text-emerald-300" : "text-emerald-700" : darkMode ? "text-gray-300" : "text-gray-500"}`,
                children: [
                  deltaSign,
                  delta.toFixed(1),
                  "%"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: `mt-1 flex items-center gap-2.5 text-[10.5px] ${darkMode ? "text-gray-400" : "text-gray-500"}`,
              children: [
                /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Navigation, { size: 9, "aria-hidden": true }),
                  formatDistance(c.distanceM)
                ] }),
                c.area != null && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 tabular-nums", children: [
                  /* @__PURE__ */ jsx(TrendingUp, { size: 9, "aria-hidden": true }),
                  chf.format(Math.round(c.area)),
                  " m\xB2"
                ] }),
                c.city && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 truncate", children: [
                  /* @__PURE__ */ jsx(MapPin, { size: 9, "aria-hidden": true }),
                  /* @__PURE__ */ jsx("span", { className: "truncate", children: c.city })
                ] })
              ]
            }
          ),
          c.zone && /* @__PURE__ */ jsx(
            "div",
            {
              className: `mt-1 text-[10px] truncate ${darkMode ? "text-gray-500" : "text-gray-400"}`,
              title: c.zone,
              children: c.zone
            }
          )
        ]
      },
      c.parcelId
    );
  }) });
}
var ComparablesPanel_default = ComparablesPanel;

export { COMPARABLES_STRINGS, ComparablesPanel, ComparablesPanel_default, Skeleton, SkeletonGroup, SkeletonText, getComparablesStrings, rankComparables };
