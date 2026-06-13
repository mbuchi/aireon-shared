import './chunk-6YKTLPIC.js';
export { RES_API_BASE_URL, createResApiClient } from './chunk-J3SBZ4RV.js';
import { Skeleton } from './chunk-756PMNQV.js';
export { ComparablesPanel, Skeleton, SkeletonGroup, SkeletonText, getComparablesStrings, rankComparables } from './chunk-756PMNQV.js';
import { fetchGeminiWithFallback } from './chunk-JGEYZH5N.js';
export { GEMINI_FALLBACK_CHAIN, buildGeminiModelChain, fetchGeminiWithFallback, isRetriableGeminiStatus } from './chunk-JGEYZH5N.js';
import { LocalStorageCache, searchGeoAdminAddresses } from './chunk-SCW3XOJJ.js';
export { GEOADMIN_ADDRESS_SEARCH_CACHE_MAX_BYTES, GEOADMIN_ADDRESS_SEARCH_CACHE_TTL_MINUTES, GEOADMIN_ADDRESS_SEARCH_ENDPOINT, IndexedDBCache, LocalStorageCache, normalizeAddressSearchQuery, searchGeoAdminAddresses } from './chunk-SCW3XOJJ.js';
import { loadMapboxStyleForMapLibre } from './chunk-JIP6DLQI.js';
export { loadMapboxStyleForMapLibre, normalizeMapboxResourceUrl, normalizeMapboxStyle } from './chunk-JIP6DLQI.js';
export { PARCEL_INTERACTION_MIN_ZOOM, isParcelInteractive, wireZoomGatedParcelClick } from './chunk-UNAJ7SZK.js';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { createContext, useRef, useEffect, useState, useMemo, useCallback, useContext, Component, useId } from 'react';
import { createPortal } from 'react-dom';
import { X, Tag, GitPullRequest, ExternalLink, Search, ChevronUp, ChevronDown, CheckCircle, Lock, MapPin, RefreshCw, Download, LayoutGrid, ArrowUpDown, Compass, Layers, Trash2, Plus, Loader2, SquareCode, AudioLines, PhoneOff, AlertCircle, Send, ShieldAlert, CheckCircle2, MessageSquareText, Check, CircleUser, Table2, LogOut, Map as Map$1, Maximize2, MoreHorizontal, Settings, Camera, Sun, Moon, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';
import { WebStorageStateStore, UserManager } from 'oidc-client-ts';
import { useReactTable, getPaginationRowModel, getFilteredRowModel, getSortedRowModel, getCoreRowModel, flexRender } from '@tanstack/react-table';
export { createColumnHelper, flexRender } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';

// src/brand/aireonLogoPath.ts
var AIREON_LOGO_VIEWBOX = "0 0 968 240";
var AIREON_LOGO_ASPECT = 968 / 240;
var AIREON_LOGO_PATH = "m 250.25,72.25 c -14.04446,5.883586 -6.24529,26.166237 -8.25,39.22607 0.66196,34.55937 -1.32716,70.04868 1,104.02393 4.36792,9.10502 20.06523,7.97241 21.75,-2.75 1.75007,-42.8345 0.24995,-86.56926 0.75,-129.75 -1.34014,-7.0935 -7.41815,-12.344094 -15.25,-10.75 z m 148,-1 c -18.22636,-3.77766 -36.45374,3.798374 -47,17.75 -7.72796,13.30918 -1.81467,-8.032303 -7,-12.75 -6.8951,-9.062382 -23.39579,-1.904666 -20.75,10.340759 0.55443,43.380151 0.72035,86.813961 1.75,130.159241 4.07127,6.0824 16.43219,7.12273 19.25,-0.5 5.12324,-8.36764 0.84703,-22.96617 2.25,-33.72607 0.94813,-21.6756 -2.74815,-45.63571 3.75,-65.27393 5.09228,-8.6227 13.1482,-19.306903 24.25,-21.25 9.59118,-4.592351 28.14741,2.363944 30,-11.670379 1.30278,-6.275643 -2.02974,-10.220619 -6.5,-13.079621 z m 529.75,9 c -14.93021,-9.352635 -36.87069,-13.714816 -55.75,-8 -11.23441,3.938278 -20.1455,11.442494 -27.25,20.25 1.52053,-10.707378 -2.98,-23.496913 -16,-20 -13.48557,6.735119 -5.6774,26.756918 -7.75,39.97607 0.55293,33.90281 -1.07248,69.23137 0.75,102.27393 4.10939,9.27212 19.28089,9.33786 21.75,-1 2.97768,-29.76627 -0.9706,-61.32188 2,-91.5 3.23722,-10.35872 9.04326,-20.17976 19.5,-25.25 10.11012,-5.98715 26.77895,-8.125689 38.75,-3 9.96107,2.07729 17.81525,11.34786 22.25,19.25 6.92927,22.19861 2.50703,50.19649 3.75,75.03176 0.91753,12.23865 -4.63492,31.45332 10.5,33.71824 12.1983,0.38101 13.69265,-12.13426 12.2944,-22.86297 C 952.14352,171.06604 954.50329,141.6487 951.75,114.5 947.88994,101.09082 940.83129,89.946019 929.5,81.5 l -0.75,-0.25 z M 687,69.5 c -22.428,2.575086 -41.37101,12.752099 -53.5,28.75 -6.70886,8.39434 -10.61654,15.78023 -13.5,27 -4.98875,15.8782 -3.95413,37.58565 3,51.75 4.602,15.38772 19.47896,29.87689 32.75,37.75 13.47842,6.62438 29.32766,10.58572 46.25,9 13.2442,-1.77152 26.31363,-5.51997 35.75,-12.75 14.32498,-9.1834 24.98761,-23.65344 29.94108,-40.41085 C 775.08428,148.15521 771.1177,120.69621 757.75,102.75 749.75892,90.430446 737.58751,81.358069 725,75.25 713.36836,70.94516 700.1393,68.537073 687,69.5 Z M 684.75,92 c 17.37515,-1.406429 32.2077,2.016508 43.5,12 13.87899,11.04814 21.39865,29.49481 19.75,50.25 -3.26366,14.81475 -7.62252,25.34522 -20,36 -13.80907,11.42671 -38.09422,16.22834 -55.75,7 -13.74996,-5.25643 -24.57326,-17.79924 -28.5,-31.5 -6.02021,-16.04821 -3.51248,-37.50848 5.75,-49.25 7.0849,-12.2366 19.9398,-21.668082 34.25,-23.5 l 0.5,-0.25 z M 500.5,69.5 c -20.53688,2.557023 -37.8523,10.735288 -50.25,26.5 -11.38388,12.60157 -17.13557,29.27801 -18.25,47.84076 -0.9786,22.45897 7.37794,42.59884 21.25,57.90924 11.74144,10.65263 23.12992,18.19579 39.25,20.25 14.77165,4.35188 32.15619,1.39939 45.75,-3 10.56138,-4.73914 20.51067,-10.41879 28.5,-20.25 4.48549,-11.14907 -10.9306,-21.03729 -19,-12.25 -12.88938,14.47329 -35.458,19.08067 -55.25,13.75 -15.20498,-5.17647 -28.42098,-16.37617 -32.75,-31.5 -2.9386,-6.70962 -7.4831,-18.03474 5.8519,-13.75 35.61269,-0.1681 71.38388,0.33525 106.8981,-0.25 10.61321,-4.58529 6.70367,-18.79584 5.25,-27.92038 C 575.71749,114.58298 569.69656,103.57861 562.5,94.5 549.66282,80.09254 533.24569,71.176727 512.07962,69.5 508.24504,69.289002 504.45101,69.314591 500.5,69.5 Z m -44,65 c 2.49751,-12.92203 9.34028,-25.87454 20.75,-33.5 11.36577,-9.330976 31.26506,-11.295449 46.75,-7 9.29798,3.479636 18.83959,11.06678 24.5,20 3.40283,5.47634 6.50415,13.05205 7.5,21.25 -32.97673,-0.49787 -67.42814,0.99674 -99.5,-0.75 z M 31.25,99.5 c -6.915012,11.15301 -13.418189,22.48189 -14.25,36.75 -3.048073,15.15862 -0.04782,30.53859 5,43.5 2.117508,5.84815 7.697934,11.09884 7.75,15.75 4.184785,0.32723 8.552448,10.37892 14.25,12.5 9.251118,8.01205 19.819047,12.13779 32.420379,15 18.003721,4.06213 38.630501,1.86247 53.329621,-6 8.24296,-3.69933 21.11058,-10.28739 15.75,-22.25 -4.75992,-7.85432 -15.35683,-5.96065 -20.5,0.5 -16.69141,10.42489 -43.29751,10.77439 -59.75,0 C 52.361746,189.04526 43.842278,175.80274 40.75,162.57962 36.045825,146.96144 39.749363,128.0917 46.5,116.25 53.449676,105.89224 64.030088,95.82424 77,92.75 c 14.640951,-5.229057 35.62451,-3.882694 47.5,4.25 10.45348,4.40329 17.71285,14.76068 22.75,23.25 6.9658,15.28525 4.6613,38.55485 5.51111,57.74149 -1.46638,18.23929 5.96707,35.6398 20.98889,43.00851 8.28398,7.68659 23.74352,0.4219 20,-12.25 -3.03766,-7.67817 -15.36291,-7.68124 -16,-17 -4.5252,-13.853 -1.40158,-32.80772 -2.82931,-48.66094 C 175.0645,127.15934 170.02453,113.18112 162.5,102.5 151.10566,86.645432 135.09459,75.11581 114.82962,71.25 91.146619,65.071969 63.446958,71.622482 46.75,84.75 41.135736,88.752319 36.083337,94.62688 31.25,99.5 Z M 249.5,15.25 c -10.49025,3.048117 -13.29009,20.456684 -4.25,27 8.78379,7.791206 25.2901,-0.465587 23.5,-13.090759 C 267.77509,19.775963 259.7444,13.143377 249.5,15.25 Z";
function AireonLogo({ className, style, title = "aireon" }) {
  const decorative = title === "";
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      viewBox: AIREON_LOGO_VIEWBOX,
      className,
      style,
      role: decorative ? "presentation" : "img",
      "aria-hidden": decorative ? true : void 0,
      "aria-label": decorative ? void 0 : title,
      focusable: "false",
      fill: "currentColor",
      xmlns: "http://www.w3.org/2000/svg",
      children: [
        !decorative && /* @__PURE__ */ jsx("title", { children: title }),
        /* @__PURE__ */ jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: AIREON_LOGO_PATH })
      ]
    }
  );
}
var AireonLogo_default = AireonLogo;

// src/prm/api.ts
var PROOM_API_BASE = "https://proom.aireon.ch/api";
var PRM_STATES = [
  { value: "new", color: "text-sky-400", bg: "bg-sky-500" },
  { value: "contacted", color: "text-amber-400", bg: "bg-amber-500" },
  { value: "negotiation", color: "text-orange-400", bg: "bg-orange-500" },
  { value: "due_diligence", color: "text-teal-400", bg: "bg-teal-500" }
];
var PRM_PRIORITIES = [
  { value: "low", color: "text-slate-400" },
  { value: "medium", color: "text-sky-400" },
  { value: "high", color: "text-orange-400" },
  { value: "urgent", color: "text-red-400" }
];
var AuthRequiredError = class extends Error {
  constructor() {
    super("Sign in required to track parcels");
    this.name = "AuthRequiredError";
  }
};
async function prmFetch(path, init, token) {
  if (!token) throw new AuthRequiredError();
  const res = await fetch(`${PROOM_API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...init.headers
    }
  });
  if (!res.ok) {
    let detail = "";
    try {
      detail = (await res.json())?.error ?? "";
    } catch {
    }
    throw new Error(
      `${res.status} ${res.statusText}${detail ? `: ${detail}` : ""}`
    );
  }
  if (res.status === 204) return void 0;
  return await res.json();
}
function fetchPrmByParcel(token, parcelId) {
  return prmFetch(
    `/prm-records?parcel_id=${encodeURIComponent(parcelId)}`,
    { method: "GET" },
    token
  );
}
function createPrmRecord(token, input) {
  return prmFetch(
    "/prm-records",
    { method: "POST", body: JSON.stringify(input) },
    token
  );
}
function fetchPrmRecords(token) {
  return prmFetch("/prm-records", { method: "GET" }, token);
}
function updatePrmState(token, id, state) {
  return prmFetch(
    `/prm-records/${encodeURIComponent(id)}`,
    { method: "PATCH", body: JSON.stringify({ state }) },
    token
  );
}
function updatePrmPriority(token, id, priority) {
  return prmFetch(
    `/prm-records/${encodeURIComponent(id)}`,
    { method: "PATCH", body: JSON.stringify({ priority }) },
    token
  );
}
function updatePrmTags(token, id, tags) {
  return prmFetch(
    `/prm-records/${encodeURIComponent(id)}`,
    { method: "PATCH", body: JSON.stringify({ tags }) },
    token
  );
}
async function deletePrmRecord(token, id) {
  await prmFetch(
    `/prm-records/${encodeURIComponent(id)}`,
    { method: "DELETE" },
    token
  );
}
var PROOM_APP_URL = "https://proom.aireon.ch";
var TOOLBOX_APP_URL = "https://hub.aireon.ch";
var GEOPOOL_APP_URL = "https://geopool.aireon.ch";
var LEGACY_PROOM_APP_URL = "https://swissnovo-proom.vercel.app";
var LEGACY_TOOLBOX_APP_URL = "https://swissnovo-toolbox.vercel.app";
var LEGACY_GEOPOOL_APP_URL = "https://swissnovo-geopool.vercel.app";
var AIREON_HUB_URL = `${TOOLBOX_APP_URL}/`;
var AIREON_HUB_ICON_URL = `${TOOLBOX_APP_URL}/favicon.svg`;
var AIREON_HUB_MARK_URL = `${TOOLBOX_APP_URL}/brand/aireon-mark.svg`;
function AireonHubLink({
  href = AIREON_HUB_URL,
  label = "Aireon hub",
  className = "text-gray-900 dark:text-white",
  linkClassName = "",
  iconClassName = "h-6 w-6 bg-current",
  withDivider = false,
  dividerClassName = "h-5 w-px bg-current opacity-20",
  style,
  target,
  rel,
  onClick
}) {
  return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 sm:gap-2.5 " + className, style, children: [
    /* @__PURE__ */ jsx(
      "a",
      {
        href,
        target,
        rel: rel ?? (target === "_blank" ? "noopener noreferrer" : void 0),
        onClick,
        "aria-label": label,
        title: label,
        className: "inline-flex h-9 w-9 items-center justify-center rounded-lg bg-transparent opacity-100 transition-opacity duration-150 hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent " + linkClassName,
        children: /* @__PURE__ */ jsx(
          "span",
          {
            "aria-hidden": "true",
            className: iconClassName,
            style: {
              WebkitMask: `url(${AIREON_HUB_MARK_URL}) center / contain no-repeat`,
              mask: `url(${AIREON_HUB_MARK_URL}) center / contain no-repeat`
            }
          }
        )
      }
    ),
    withDivider && /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: dividerClassName })
  ] });
}
var AireonHubLink_default = AireonHubLink;
var WORDMARK_STYLE = {
  fontFamily: 'var(--hood-display, "Varela Round", system-ui, sans-serif)',
  fontWeight: 400,
  lineHeight: 1,
  letterSpacing: 0
};
var SIZE_CLASS = {
  nav: "text-xl sm:text-2xl",
  compact: "text-xl",
  large: "text-2xl sm:text-3xl"
};
function renderWordmarkParts(name, baseClassName, accentClassName) {
  const parts = [];
  const re = /oo/gi;
  let lastIndex = 0;
  let match;
  while ((match = re.exec(name)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        /* @__PURE__ */ jsx("span", { className: baseClassName, children: name.slice(lastIndex, match.index) }, `base-${lastIndex}`)
      );
    }
    parts.push(
      /* @__PURE__ */ jsx("span", { className: accentClassName, children: name.slice(match.index, match.index + 2) }, `accent-${match.index}`)
    );
    lastIndex = match.index + 2;
  }
  if (lastIndex < name.length) {
    parts.push(
      /* @__PURE__ */ jsx("span", { className: baseClassName, children: name.slice(lastIndex) }, `base-${lastIndex}`)
    );
  }
  return parts.length ? parts : [name];
}
function AireonAppWordmark({
  name,
  size = "nav",
  className = "",
  baseClassName = "text-gray-900 dark:text-gray-100",
  accentClassName = "text-red-500 dark:text-red-400",
  style,
  "aria-label": ariaLabel,
  ...rest
}) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      ...rest,
      "aria-label": ariaLabel ?? name,
      className: `inline-flex items-baseline whitespace-nowrap font-normal leading-none select-none ${SIZE_CLASS[size]} ${className}`.trim(),
      style: { ...WORDMARK_STYLE, ...style },
      children: renderWordmarkParts(name, baseClassName, accentClassName)
    }
  );
}
var AireonAppWordmark_default = AireonAppWordmark;
function useFocusTrap(options = {}) {
  const { active = true, onEscape, restoreFocus = true } = options;
  const ref = useRef(null);
  const previousFocus = useRef(null);
  useEffect(() => {
    if (!active) return;
    if (typeof document !== "undefined") {
      previousFocus.current = document.activeElement;
    }
    return () => {
      if (restoreFocus && previousFocus.current && typeof previousFocus.current.focus === "function") {
        previousFocus.current.focus();
      }
    };
  }, [active, restoreFocus]);
  useEffect(() => {
    if (!active) return;
    const element = ref.current;
    if (!element) return;
    const FOCUSABLE_SELECTOR = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && onEscape) {
        onEscape();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables2 = element.querySelectorAll(FOCUSABLE_SELECTOR);
      if (focusables2.length === 0) return;
      const first = focusables2[0];
      const last = focusables2[focusables2.length - 1];
      const activeElement = document.activeElement;
      if (e.shiftKey) {
        if (activeElement === first || !element.contains(activeElement)) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (activeElement === last || !element.contains(activeElement)) {
          first.focus();
          e.preventDefault();
        }
      }
    };
    const focusables = element.querySelectorAll(FOCUSABLE_SELECTOR);
    if (focusables.length > 0) {
      const timer = setTimeout(() => {
        focusables[0].focus();
      }, 50);
      element.addEventListener("keydown", handleKeyDown);
      return () => {
        clearTimeout(timer);
        element.removeEventListener("keydown", handleKeyDown);
      };
    }
    element.addEventListener("keydown", handleKeyDown);
    return () => {
      element.removeEventListener("keydown", handleKeyDown);
    };
  }, [active, onEscape]);
  return ref;
}

// src/theme/zindex.ts
var Z_INDEX = {
  /** Bottom base level (e.g. underlying custom canvas) */
  base: 0,
  /** Deep layout/background layers */
  bg: 10,
  /** Content cards or relative layout elements */
  content: 20,
  /** Main navigation header and action bars */
  header: 50,
  /** Sidebar panels and drawer filters */
  drawer: 1e3,
  /** Modals, dialog backdrops, and overlay panels */
  modal: 2e3,
  /** Dropdown menu popovers and select lists */
  dropdown: 3e3,
  /** Tooltips, toast notifications, and popovers */
  tooltip: 4e3,
  /** Stacking level for full-screen screenshots / tour overlays */
  overlay: 5e3,
  /** Absolute top layer (e.g. error boundary crash panel or global loader) */
  top: 2147483647
};

// src/releaseNotes/types.ts
var KIND_META = {
  new: {
    label: "New",
    classes: "text-red-700 bg-red-50 border-red-200 dark:text-red-300 dark:bg-red-500/10 dark:border-red-500/30",
    dot: "bg-red-500"
  },
  improved: {
    label: "Improved",
    classes: "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-500/10 dark:border-amber-500/30",
    dot: "bg-amber-500"
  },
  fixed: {
    label: "Fixed",
    classes: "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-500/30",
    dot: "bg-emerald-500"
  },
  breaking: {
    label: "Breaking",
    classes: "text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/30",
    dot: "bg-rose-500"
  },
  docs: {
    label: "Docs",
    classes: "text-sky-700 bg-sky-50 border-sky-200 dark:text-sky-300 dark:bg-sky-500/10 dark:border-sky-500/30",
    dot: "bg-sky-500"
  }
};
var KIND_ALIASES = {
  added: "new",
  add: "new",
  feature: "new",
  changed: "improved",
  change: "improved",
  improvement: "improved",
  fix: "fixed",
  bugfix: "fixed",
  removed: "breaking",
  doc: "docs",
  documentation: "docs"
};
var FALLBACK_KIND_META = {
  label: "Update",
  classes: "text-gray-700 bg-gray-100 border-gray-200 dark:text-gray-300 dark:bg-white/[0.06] dark:border-white/[0.12]",
  dot: "bg-gray-400"
};
function canonicalKind(kind) {
  if (kind in KIND_META) return kind;
  if (kind in KIND_ALIASES) return KIND_ALIASES[kind];
  return null;
}
function resolveKindMeta(kind) {
  const canonical = canonicalKind(kind);
  return canonical ? KIND_META[canonical] : FALLBACK_KIND_META;
}

// src/releaseNotes/i18n.ts
var RELEASE_NOTES_STRINGS = {
  en: {
    whatsNewIn: "What's new in",
    subtitleLead: "Every shipped change, grouped by version. Latest release",
    live: "live",
    releases: "releases",
    changes: "changes",
    viewAllPRs: "View all PRs",
    searchPlaceholder: "Search changes, versions, or PR numbers\u2026 ( / to focus)",
    filterAll: "All",
    noMatch: "No changes match that filter.",
    latest: "Latest",
    change: "change",
    changesPlural: "changes",
    footerPre: "Versions follow",
    footerPost: ". History is reconstructed from merged pull requests.",
    close: "Close",
    dialogLabel: "Release notes",
    whatsNew: "What's new",
    kind: { new: "New", improved: "Improved", fixed: "Fixed", breaking: "Breaking", docs: "Docs" }
  },
  de: {
    whatsNewIn: "Neuigkeiten in",
    subtitleLead: "Jede ausgelieferte \xC4nderung, nach Version gruppiert. Neueste Version",
    live: "live",
    releases: "Versionen",
    changes: "\xC4nderungen",
    viewAllPRs: "Alle PRs ansehen",
    searchPlaceholder: "\xC4nderungen, Versionen oder PR-Nummern suchen\u2026 ( / zum Fokussieren)",
    filterAll: "Alle",
    noMatch: "Keine \xC4nderungen passen zu diesem Filter.",
    latest: "Neueste",
    change: "\xC4nderung",
    changesPlural: "\xC4nderungen",
    footerPre: "Versionen folgen",
    footerPost: ". Der Verlauf wird aus zusammengef\xFChrten Pull Requests rekonstruiert.",
    close: "Schlie\xDFen",
    dialogLabel: "Versionshinweise",
    whatsNew: "Neuigkeiten",
    kind: { new: "Neu", improved: "Verbessert", fixed: "Behoben", breaking: "Breaking", docs: "Docs" }
  },
  fr: {
    whatsNewIn: "Nouveaut\xE9s dans",
    subtitleLead: "Chaque changement livr\xE9, regroup\xE9 par version. Derni\xE8re version",
    live: "en ligne",
    releases: "versions",
    changes: "changements",
    viewAllPRs: "Voir toutes les PR",
    searchPlaceholder: "Rechercher changements, versions ou num\xE9ros de PR\u2026 ( / pour cibler)",
    filterAll: "Tous",
    noMatch: "Aucun changement ne correspond \xE0 ce filtre.",
    latest: "Derni\xE8re",
    change: "changement",
    changesPlural: "changements",
    footerPre: "Les versions suivent",
    footerPost: ". L\u2019historique est reconstruit \xE0 partir des pull requests fusionn\xE9es.",
    close: "Fermer",
    dialogLabel: "Notes de version",
    whatsNew: "Nouveaut\xE9s",
    kind: { new: "Nouveau", improved: "Am\xE9lior\xE9", fixed: "Corrig\xE9", breaking: "Breaking", docs: "Docs" }
  },
  it: {
    whatsNewIn: "Novit\xE0 in",
    subtitleLead: "Ogni modifica rilasciata, raggruppata per versione. Ultima versione",
    live: "attiva",
    releases: "versioni",
    changes: "modifiche",
    viewAllPRs: "Vedi tutte le PR",
    searchPlaceholder: "Cerca modifiche, versioni o numeri di PR\u2026 ( / per mettere a fuoco)",
    filterAll: "Tutti",
    noMatch: "Nessuna modifica corrisponde a questo filtro.",
    latest: "Ultima",
    change: "modifica",
    changesPlural: "modifiche",
    footerPre: "Le versioni seguono",
    footerPost: ". La cronologia \xE8 ricostruita dalle pull request unite.",
    close: "Chiudi",
    dialogLabel: "Note di rilascio",
    whatsNew: "Novit\xE0",
    kind: { new: "Nuovo", improved: "Migliorato", fixed: "Corretto", breaking: "Breaking", docs: "Docs" }
  }
};
var getReleaseNotesStrings = (locale = "en") => RELEASE_NOTES_STRINGS[locale] ?? RELEASE_NOTES_STRINGS.en;
var TOP_Z_INDEX = Z_INDEX.top;
var FILTER_ORDER = ["new", "improved", "fixed", "breaking", "docs"];
function ReleaseNotesPanel({
  onClose,
  locale = "en",
  releases,
  repoUrl,
  brandPrefix = "",
  brandSuffix = "",
  brandNode,
  zIndex = TOP_Z_INDEX,
  closeRef
}) {
  const modalRef = useFocusTrap({ onEscape: handleClose });
  const t = getReleaseNotesStrings(locale);
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [openVersions, setOpenVersions] = useState(() => ({
    [releases[0].version]: true
  }));
  const searchRef = useRef(null);
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    if (closeRef) closeRef.current = handleClose;
    const onKey = (e) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (closeRef) closeRef.current = null;
    };
  }, []);
  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 200);
  }
  const toggle = (v) => setOpenVersions((prev) => ({ ...prev, [v]: !prev[v] }));
  const filteredReleases = useMemo(() => {
    const q = query.trim().toLowerCase();
    return releases.map((release) => {
      const items = release.items.filter((item) => {
        const kindOk = activeFilter === "all" || canonicalKind(item.kind) === activeFilter;
        const queryOk = !q || item.text.toLowerCase().includes(q) || release.codename.toLowerCase().includes(q) || release.version.includes(q) || (item.prs ?? []).some((n) => `#${n}`.includes(q) || String(n) === q);
        return kindOk && queryOk;
      });
      return { ...release, items };
    }).filter((r) => r.items.length > 0);
  }, [query, activeFilter, releases]);
  const totals = useMemo(() => {
    const all = releases.flatMap((r) => r.items);
    return {
      releases: releases.length,
      changes: all.length,
      latest: releases[0]
    };
  }, [releases]);
  const latest = totals.latest;
  const filters = useMemo(() => {
    const present = new Set(releases.flatMap((r) => r.items.map((i) => i.kind)));
    return [
      { kind: "all", label: t.filterAll },
      ...FILTER_ORDER.filter((k) => present.has(k)).map((k) => ({ kind: k, label: t.kind[k] }))
    ];
  }, [releases, t]);
  return createPortal(
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `fixed inset-0 flex items-stretch justify-end transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"}`,
        style: { zIndex },
        role: "dialog",
        "aria-modal": "true",
        "aria-label": t.dialogLabel,
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm",
              onClick: handleClose
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              ref: modalRef,
              className: `relative w-full max-w-3xl h-full overflow-hidden flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-l border-gray-200 dark:border-white/[0.06] shadow-2xl transition-transform duration-200 ${visible ? "translate-x-0" : "translate-x-6"}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "relative shrink-0 px-6 pt-6 pb-5 border-b border-gray-200 dark:border-white/[0.06]", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: handleClose,
                      className: "absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors",
                      "aria-label": t.close,
                      children: /* @__PURE__ */ jsx(X, { size: 18 })
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "flex items-start gap-4", children: /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxs("h1", { className: "text-xl font-semibold text-gray-900 dark:text-white", children: [
                      t.whatsNewIn,
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "font-normal", style: { fontFamily: "'Varela Round', sans-serif" }, children: brandNode ?? /* @__PURE__ */ jsxs(Fragment, { children: [
                        brandPrefix,
                        /* @__PURE__ */ jsx("span", { className: "text-red-600", children: "oo" }),
                        brandSuffix
                      ] }) })
                    ] }),
                    /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm leading-relaxed text-gray-500 dark:text-slate-400", children: [
                      t.subtitleLead,
                      " ",
                      /* @__PURE__ */ jsxs("span", { className: "font-mono font-semibold text-red-600 dark:text-red-400", children: [
                        "v",
                        latest.version
                      ] }),
                      " ",
                      "\xB7 ",
                      /* @__PURE__ */ jsx("span", { className: "font-medium", children: latest.codename }),
                      " \xB7 ",
                      latest.date,
                      "."
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-2 text-xs", children: [
                      /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30", children: [
                        /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" }),
                        "v",
                        latest.version,
                        " ",
                        t.live
                      ] }),
                      /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-white/[0.05] dark:text-slate-300", children: [
                        /* @__PURE__ */ jsx(Tag, { size: 12 }),
                        " ",
                        totals.releases,
                        " ",
                        t.releases
                      ] }),
                      /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-white/[0.05] dark:text-slate-300", children: [
                        /* @__PURE__ */ jsx(GitPullRequest, { size: 12 }),
                        " ",
                        totals.changes,
                        " ",
                        t.changes
                      ] }),
                      /* @__PURE__ */ jsxs(
                        "a",
                        {
                          href: `${repoUrl}/pulls?q=is%3Apr+is%3Aclosed`,
                          target: "_blank",
                          rel: "noopener noreferrer",
                          className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/[0.05] dark:text-slate-300 dark:hover:bg-white/[0.08] transition-colors",
                          children: [
                            /* @__PURE__ */ jsx(ExternalLink, { size: 12 }),
                            " ",
                            t.viewAllPRs
                          ]
                        }
                      )
                    ] })
                  ] }) }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-5 flex flex-col sm:flex-row sm:items-center gap-3", children: [
                    /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
                      /* @__PURE__ */ jsx(
                        Search,
                        {
                          size: 15,
                          className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          ref: searchRef,
                          value: query,
                          onChange: (e) => setQuery(e.target.value),
                          placeholder: t.searchPlaceholder,
                          className: "w-full h-9 pl-9 pr-3 text-sm rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 dark:bg-white/[0.04] dark:border-white/[0.08] dark:text-gray-100 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 transition-colors"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1.5 flex-wrap", children: filters.map((f) => {
                      const active = activeFilter === f.kind;
                      return /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => setActiveFilter(f.kind),
                          className: `px-2.5 h-7 rounded-full text-xs font-medium transition-colors border ${active ? "bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/40 dark:text-red-300" : "bg-transparent border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300 dark:border-white/[0.08] dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-white/[0.16]"}`,
                          children: f.label
                        },
                        f.kind
                      );
                    }) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto px-6 py-6", children: [
                  filteredReleases.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-center py-16 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 dark:border-white/[0.08] dark:text-slate-500", children: /* @__PURE__ */ jsx("p", { className: "text-sm", children: t.noMatch }) }),
                  /* @__PURE__ */ jsx("ol", { className: "relative space-y-5", children: filteredReleases.map((release, idx) => {
                    const isOpen = openVersions[release.version] ?? false;
                    const isLatest = idx === 0 && release.version === releases[0].version;
                    return /* @__PURE__ */ jsxs("li", { className: "relative", children: [
                      idx < filteredReleases.length - 1 && /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: "absolute left-[18px] top-12 bottom-[-20px] w-px bg-gray-200 dark:bg-white/[0.08]",
                          "aria-hidden": true
                        }
                      ),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-stretch gap-4", children: [
                        /* @__PURE__ */ jsx("div", { className: "shrink-0 pt-3", children: /* @__PURE__ */ jsxs(
                          "div",
                          {
                            className: `relative w-9 h-9 rounded-full flex items-center justify-center ${isLatest ? "bg-red-50 border border-red-200 dark:bg-red-500/10 dark:border-red-500/40" : "bg-gray-100 border border-gray-200 dark:bg-white/[0.04] dark:border-white/[0.08]"}`,
                            children: [
                              /* @__PURE__ */ jsx(
                                Tag,
                                {
                                  size: 14,
                                  className: isLatest ? "text-red-600 dark:text-red-400" : "text-gray-400 dark:text-slate-500"
                                }
                              ),
                              isLatest && /* @__PURE__ */ jsx("span", { className: "absolute inset-0 rounded-full bg-red-500/30 animate-ping opacity-50" })
                            ]
                          }
                        ) }),
                        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                          /* @__PURE__ */ jsxs(
                            "button",
                            {
                              onClick: () => toggle(release.version),
                              className: "w-full text-left rounded-2xl overflow-hidden border bg-white border-gray-200 hover:border-gray-300 dark:bg-white/[0.03] dark:border-white/[0.06] dark:hover:border-white/[0.12] transition-colors",
                              children: [
                                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-5 py-4", children: [
                                  /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                                      /* @__PURE__ */ jsxs("span", { className: "text-base font-bold font-mono text-gray-900 dark:text-white", children: [
                                        "v",
                                        release.version
                                      ] }),
                                      /* @__PURE__ */ jsx("span", { className: "text-gray-300 dark:text-slate-600", children: "\xB7" }),
                                      /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-slate-200", children: release.codename }),
                                      isLatest && /* @__PURE__ */ jsx("span", { className: "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-red-600 text-white", children: t.latest })
                                    ] }),
                                    /* @__PURE__ */ jsxs("p", { className: "text-xs mt-0.5 text-gray-400 dark:text-slate-500", children: [
                                      release.date,
                                      " \xB7 ",
                                      release.items.length,
                                      " ",
                                      release.items.length === 1 ? t.change : t.changesPlural
                                    ] })
                                  ] }),
                                  isOpen ? /* @__PURE__ */ jsx(ChevronUp, { size: 16, className: "text-gray-400 dark:text-slate-500" }) : /* @__PURE__ */ jsx(ChevronDown, { size: 16, className: "text-gray-400 dark:text-slate-500" })
                                ] }),
                                isOpen && /* @__PURE__ */ jsx("div", { className: "border-t border-gray-100 px-5 py-4 dark:border-white/[0.06]", children: /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed text-gray-600 dark:text-slate-400", children: release.summary }) })
                              ]
                            }
                          ),
                          isOpen && /* @__PURE__ */ jsx("ul", { className: "mt-3 space-y-2", children: release.items.map((item, i) => {
                            const meta = resolveKindMeta(item.kind);
                            const ck = canonicalKind(item.kind);
                            const Icon = item.icon;
                            return /* @__PURE__ */ jsxs(
                              "li",
                              {
                                className: "flex items-start gap-3 rounded-xl px-4 py-3 border bg-gray-50 border-gray-100 hover:border-gray-200 dark:bg-white/[0.02] dark:border-white/[0.06] dark:hover:border-white/[0.12] transition-colors",
                                children: [
                                  /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white border border-gray-200 dark:bg-white/[0.04] dark:border-white/[0.06]", children: /* @__PURE__ */ jsx(Icon, { size: 15, className: "text-gray-600 dark:text-slate-300" }) }),
                                  /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap mb-1", children: [
                                      /* @__PURE__ */ jsxs(
                                        "span",
                                        {
                                          className: `inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide border ${meta.classes}`,
                                          children: [
                                            /* @__PURE__ */ jsx("span", { className: `w-1 h-1 rounded-full ${meta.dot}` }),
                                            ck ? t.kind[ck] : meta.label
                                          ]
                                        }
                                      ),
                                      (item.prs ?? []).map((n) => /* @__PURE__ */ jsxs(
                                        "a",
                                        {
                                          href: `${repoUrl}/pull/${n}`,
                                          target: "_blank",
                                          rel: "noopener noreferrer",
                                          className: "inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-500 hover:text-red-600 hover:bg-gray-200 dark:bg-white/[0.05] dark:text-slate-400 dark:hover:text-red-300 dark:hover:bg-white/[0.08] transition-colors",
                                          title: `Pull request #${n}`,
                                          children: [
                                            /* @__PURE__ */ jsx(GitPullRequest, { size: 10 }),
                                            "#",
                                            n
                                          ]
                                        },
                                        n
                                      ))
                                    ] }),
                                    /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed text-gray-700 dark:text-slate-300", children: item.text })
                                  ] })
                                ]
                              },
                              i
                            );
                          }) })
                        ] })
                      ] })
                    ] }, release.version);
                  }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "shrink-0 px-6 py-4 border-t border-gray-200 dark:border-white/[0.06] text-gray-400 dark:text-slate-500 flex items-center justify-between text-xs", children: [
                  /* @__PURE__ */ jsxs("span", { children: [
                    t.footerPre,
                    " ",
                    /* @__PURE__ */ jsx(
                      "a",
                      {
                        href: "https://semver.org",
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "text-gray-600 hover:text-red-600 underline dark:text-slate-300 dark:hover:text-red-300",
                        children: "SemVer"
                      }
                    ),
                    t.footerPost
                  ] }),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: handleClose,
                      className: "hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 text-gray-500 hover:text-gray-900 dark:bg-white/[0.05] dark:text-slate-400 dark:hover:text-slate-100",
                      children: [
                        t.close,
                        " ",
                        /* @__PURE__ */ jsx("kbd", { className: "font-mono text-[10px]", children: "Esc" })
                      ]
                    }
                  )
                ] })
              ]
            }
          )
        ]
      }
    ),
    document.body
  );
}
var HASH = "#release-notes";
function useReleaseNotes({
  currentVersion,
  storageKey
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  useEffect(() => {
    try {
      const lastSeen = localStorage.getItem(storageKey);
      if (lastSeen !== currentVersion) setHasUnread(true);
    } catch {
    }
    if (window.location.hash === HASH) setIsOpen(true);
    const onHash = () => {
      if (window.location.hash === HASH) setIsOpen(true);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [storageKey, currentVersion]);
  const openPanel = useCallback(() => {
    setIsOpen(true);
    if (window.location.hash !== HASH) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}${HASH}`
      );
    }
  }, []);
  const closePanel = useCallback(() => {
    setIsOpen(false);
    setHasUnread(false);
    try {
      localStorage.setItem(storageKey, currentVersion);
    } catch {
    }
    if (window.location.hash === HASH) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`
      );
    }
  }, [storageKey, currentVersion]);
  return { hasUnread, isOpen, openPanel, closePanel };
}
function ReleaseNotesButton({
  releases,
  locale = "en",
  storageKey,
  repoUrl,
  brandPrefix,
  brandSuffix = "",
  brandNode,
  zIndex,
  className
}) {
  const t = getReleaseNotesStrings(locale);
  const currentVersion = releases[0].version;
  const { hasUnread, isOpen: open, openPanel, closePanel } = useReleaseNotes({
    currentVersion,
    storageKey
  });
  const closeRef = useRef(null);
  const handleToggle = useCallback(() => {
    if (open) {
      if (closeRef.current) closeRef.current();
      else closePanel();
    } else {
      openPanel();
    }
  }, [open, openPanel, closePanel]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: handleToggle,
        "aria-expanded": open,
        title: `${t.whatsNew} \u2014 v${currentVersion}`,
        "aria-label": `${t.whatsNew} \u2014 v${currentVersion}`,
        className: `relative hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-lg transition-colors text-gray-600 hover:text-red-700 hover:bg-red-50 dark:text-gray-300 dark:hover:text-red-300 dark:hover:bg-red-500/10 ${className ?? ""}`,
        children: [
          /* @__PURE__ */ jsx(CheckCircle, { size: 18 }),
          hasUnread && /* @__PURE__ */ jsx("span", { className: "absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" })
        ]
      }
    ),
    open && /* @__PURE__ */ jsx(
      ReleaseNotesPanel,
      {
        onClose: closePanel,
        closeRef,
        locale,
        releases,
        repoUrl,
        brandPrefix,
        brandSuffix,
        brandNode,
        zIndex
      }
    )
  ] });
}
var LOCALE_LABELS = {
  en: "EN",
  fr: "FR",
  de: "DE",
  it: "IT"
};
var LOCALE_OPTIONS = ["en", "fr", "de", "it"];
function LocaleSelector({
  locale,
  onChange,
  ariaLabel,
  className
}) {
  return /* @__PURE__ */ jsx(
    "select",
    {
      value: locale,
      onChange: (e) => onChange(e.target.value),
      "aria-label": ariaLabel ?? "Select language",
      style: { fontFamily: "'Varela Round', sans-serif" },
      className: [
        "h-9 text-xs font-semibold text-gray-500 dark:text-gray-400",
        "bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg px-1.5",
        "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer",
        "focus:outline-none focus:ring-2 focus:ring-red-500/40",
        className ?? ""
      ].filter(Boolean).join(" "),
      children: LOCALE_OPTIONS.map((l) => /* @__PURE__ */ jsx(
        "option",
        {
          value: l,
          style: { fontFamily: "'Varela Round', sans-serif" },
          className: "bg-white dark:bg-gray-900",
          children: LOCALE_LABELS[l]
        },
        l
      ))
    }
  );
}
var LocaleSelector_default = LocaleSelector;
var ZITADEL_AUTHORITY = "https://swissnovo-ekqvxs.ch1.zitadel.cloud/";
var ZITADEL_CLIENT_ID = "366334583324661156";
var origin = typeof window !== "undefined" ? window.location.origin : "";
var settings = {
  authority: ZITADEL_AUTHORITY,
  client_id: ZITADEL_CLIENT_ID,
  redirect_uri: `${origin}/`,
  post_logout_redirect_uri: `${origin}/`,
  response_type: "code",
  scope: "openid profile email",
  loadUserInfo: true,
  // Hidden-iframe flows (silent renew, signinSilent) are permanently dead: every
  // Zitadel authorize page is served with `Content-Security-Policy:
  // frame-ancestors 'none'`, so the browser blocks the renew iframe. Cross-app
  // SSO and token refresh are instead handled by a top-level `prompt=none`
  // redirect to Zitadel (see AuthProvider) — first-party to the IdP, so the
  // shared Zitadel session cookie is sent and no iframe is involved. Leaving
  // automaticSilentRenew on would only arm a CSP-blocked iframe that logs noise.
  automaticSilentRenew: false,
  monitorSession: false,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  stateStore: new WebStorageStateStore({ store: window.localStorage })
};
var userManager = new UserManager(settings);
var SSO_ATTEMPTED_KEY = "aireon:silent_sso_attempted";
function ssoAttempted() {
  try {
    return sessionStorage.getItem(SSO_ATTEMPTED_KEY) === "1";
  } catch {
    return true;
  }
}
function markSsoAttempted() {
  try {
    sessionStorage.setItem(SSO_ATTEMPTED_KEY, "1");
    return true;
  } catch {
    return false;
  }
}
async function getExistingUser() {
  try {
    const user = await userManager.getUser();
    return user && !user.expired ? user : null;
  } catch {
    return null;
  }
}
async function getAuthToken() {
  const user = await getExistingUser();
  return user ? user.id_token ?? user.access_token ?? null : null;
}
function urlHasAuthParams(url = new URL(window.location.href)) {
  const p = url.searchParams;
  return (p.has("code") || p.has("error")) && p.has("state");
}
function stripAuthParams() {
  const url = new URL(window.location.href);
  ["code", "state", "session_state", "iss", "error", "error_description"].forEach(
    (k) => url.searchParams.delete(k)
  );
  window.history.replaceState({}, document.title, `${url.pathname}${url.search}${url.hash}`);
}
function StyledAppName({ name }) {
  return /* @__PURE__ */ jsx(Fragment, { children: name.split(/(oo)/gi).map(
    (part, i) => part.toLowerCase() === "oo" ? /* @__PURE__ */ jsx("span", { className: "text-red-600", children: part }, i) : /* @__PURE__ */ jsx("span", { children: part }, i)
  ) });
}
function LoginModal({
  open,
  onClose,
  appName,
  description,
  features,
  blocking = false,
  login,
  register
}) {
  const modalRef = useFocusTrap({
    active: open,
    onEscape: blocking ? void 0 : onClose
  });
  if (!open) return null;
  return createPortal(
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "fixed inset-0 z-[200] flex items-center justify-center p-4",
        role: "dialog",
        "aria-modal": "true",
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute inset-0 bg-black/50 backdrop-blur-sm",
              onClick: blocking ? void 0 : onClose
            }
          ),
          /* @__PURE__ */ jsxs("div", { ref: modalRef, className: "relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden", children: [
            /* @__PURE__ */ jsx("div", { className: "h-1.5 bg-gradient-to-r from-red-500 via-red-600 to-rose-700" }),
            /* @__PURE__ */ jsxs("div", { className: "px-8 pt-7 pb-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center", children: [
                /* @__PURE__ */ jsxs(
                  "p",
                  {
                    className: "text-2xl sm:text-3xl font-normal leading-none select-none",
                    style: { fontFamily: "'Varela Round', sans-serif" },
                    "aria-label": "SWISSNOVO",
                    children: [
                      /* @__PURE__ */ jsx("span", { className: "text-gray-900 dark:text-white", children: "SWISSN" }),
                      /* @__PURE__ */ jsx("span", { className: "text-red-600", children: "O" }),
                      /* @__PURE__ */ jsx("span", { className: "text-gray-900 dark:text-white", children: "V" }),
                      /* @__PURE__ */ jsx("span", { className: "text-red-600", children: "O" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  "h2",
                  {
                    className: "mt-1 text-xl sm:text-2xl font-normal leading-none text-gray-900 dark:text-gray-100",
                    style: { fontFamily: "'Varela Round', sans-serif" },
                    children: /* @__PURE__ */ jsx(StyledAppName, { name: appName })
                  }
                ),
                description && /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed", children: description })
              ] }),
              features && features.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-6 space-y-2", children: features.map((f, i) => /* @__PURE__ */ jsx(FeatureRow, { feature: f }, i)) }),
              /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-col gap-3", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: register,
                    className: "w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
                    children: "Create free account"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: login,
                    className: "w-full py-2.5 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
                    children: "Sign in"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-5 flex items-center justify-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500", children: [
                /* @__PURE__ */ jsx(Lock, { size: 11 }),
                /* @__PURE__ */ jsx("span", { children: "Secured with single sign-on via Zitadel" })
              ] }),
              !blocking && /* @__PURE__ */ jsx("div", { className: "mt-3 text-center", children: /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: onClose,
                  className: "text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors underline-offset-2 hover:underline",
                  children: "Continue without signing in"
                }
              ) })
            ] })
          ] })
        ]
      }
    ),
    document.body
  );
}
function FeatureRow({ feature }) {
  const { icon: Icon, label, locked } = feature;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${locked ? "text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50" : "text-gray-700 dark:text-gray-300 bg-red-50/60 dark:bg-red-900/10"}`,
      children: [
        Icon && /* @__PURE__ */ jsx(
          "span",
          {
            className: locked ? "text-gray-400 dark:text-gray-500" : "text-red-500 dark:text-red-400",
            children: /* @__PURE__ */ jsx(Icon, { size: 15 })
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "flex-1", children: label }),
        locked && /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold uppercase tracking-wide text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded", children: "Pro" })
      ]
    }
  );
}
var LOGIN_DISMISSED_KEY = "swissnovo:login-prompt-dismissed";
var AuthContext = createContext(void 0);
function computeInitials(name, email) {
  const source = name.trim() || email.trim();
  if (!source) return "?";
  if (source.includes("@")) return source[0].toUpperCase();
  const parts = source.split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0].toUpperCase()).join("") || source[0].toUpperCase();
}
function captureReturnUrl() {
  if (typeof window === "undefined") return void 0;
  const here = window.location.pathname + window.location.search + window.location.hash;
  return here && here !== "/" ? here : void 0;
}
function restoreReturnUrl(urlState) {
  if (typeof window === "undefined") return;
  if (!urlState || !urlState.startsWith("/") || urlState.startsWith("//")) return;
  const current2 = window.location.pathname + window.location.search + window.location.hash;
  if (current2 === urlState) return;
  const prevHash = window.location.hash;
  window.history.replaceState(null, document.title, urlState);
  window.dispatchEvent(new PopStateEvent("popstate"));
  if (window.location.hash !== prevHash) {
    window.dispatchEvent(new Event("hashchange"));
  }
}
function AuthProvider({
  children,
  appName,
  loginDescription,
  loginFeatures,
  loginBlocking = false,
  loginPromptOnFirstVisit = false,
  silentSso = true
}) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const initStarted = useRef(false);
  const [loginRequested, setLoginRequested] = useState(false);
  const firstVisitDecided = useRef(false);
  useEffect(() => {
    const t = setTimeout(() => {
      setIsLoading((prev) => {
        if (prev) console.warn("[auth] init death-switch fired \u2014 falling to anonymous");
        return false;
      });
    }, 8e3);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    const onLoaded = (u) => setUser(u);
    const onUnloaded = () => setUser(null);
    const onExpired = () => {
      userManager.removeUser().finally(() => setUser(null));
    };
    userManager.events.addUserLoaded(onLoaded);
    userManager.events.addUserUnloaded(onUnloaded);
    userManager.events.addAccessTokenExpired(onExpired);
    return () => {
      userManager.events.removeUserLoaded(onLoaded);
      userManager.events.removeUserUnloaded(onUnloaded);
      userManager.events.removeAccessTokenExpired(onExpired);
    };
  }, []);
  useEffect(() => {
    if (initStarted.current) return;
    initStarted.current = true;
    const finish = (loaded) => {
      setUser(loaded);
      setIsLoading(false);
    };
    (async () => {
      try {
        if (urlHasAuthParams()) {
          try {
            const completed = await userManager.signinRedirectCallback();
            markSsoAttempted();
            stripAuthParams();
            restoreReturnUrl(completed?.url_state);
            finish(completed ?? null);
            return;
          } catch (err) {
            markSsoAttempted();
            stripAuthParams();
            finish(null);
            return;
          }
        }
        const existing = await userManager.getUser();
        if (existing && !existing.expired) {
          finish(existing);
          return;
        }
        if (existing?.expired) await userManager.removeUser().catch(() => {
        });
        if (silentSso && !ssoAttempted() && markSsoAttempted()) {
          try {
            await userManager.signinRedirect({
              extraQueryParams: { prompt: "none" },
              url_state: captureReturnUrl()
            });
            return;
          } catch (err) {
            console.warn("[auth] cross-app SSO redirect failed to start", err);
          }
        }
        finish(null);
      } catch (err) {
        console.warn("[auth] init error", err);
        finish(null);
      }
    })();
  }, [silentSso]);
  const isAuthenticatedNow = !!user && !user.expired;
  useEffect(() => {
    if (!loginPromptOnFirstVisit || isLoading || firstVisitDecided.current) return;
    firstVisitDecided.current = true;
    if (isAuthenticatedNow) return;
    if (sessionStorage.getItem(LOGIN_DISMISSED_KEY)) return;
    const params = new URLSearchParams(window.location.search);
    if (params.has("lat") && params.has("lng")) return;
    setLoginRequested(true);
  }, [loginPromptOnFirstVisit, isLoading, isAuthenticatedNow]);
  const login = useCallback(async () => {
    sessionStorage.removeItem(SSO_ATTEMPTED_KEY);
    await userManager.signinRedirect({ url_state: captureReturnUrl() });
  }, []);
  const register = useCallback(async () => {
    sessionStorage.removeItem(SSO_ATTEMPTED_KEY);
    await userManager.signinRedirect({
      extraQueryParams: { prompt: "create" },
      url_state: captureReturnUrl()
    });
  }, []);
  const logout = useCallback(async () => {
    sessionStorage.setItem(SSO_ATTEMPTED_KEY, "1");
    try {
      await userManager.signoutRedirect();
    } catch {
      await userManager.removeUser().catch(() => {
      });
      setUser(null);
    }
  }, []);
  const getAccessToken = useCallback(() => user?.access_token, [user]);
  const promptLogin = useCallback(() => setLoginRequested(true), []);
  const closeLogin = useCallback(() => {
    sessionStorage.setItem(LOGIN_DISMISSED_KEY, "1");
    setLoginRequested(false);
  }, []);
  const value = useMemo(() => {
    const profile = user?.profile;
    const displayName = profile?.name || [profile?.given_name, profile?.family_name].filter(Boolean).join(" ") || "";
    const email = profile?.email ?? "";
    const picture = profile?.picture ?? null;
    const isAuthenticated = !!user && !user.expired;
    return {
      user,
      status: isLoading ? "loading" : isAuthenticated ? "authenticated" : "anonymous",
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
      getAccessToken,
      displayName: displayName || email || "User",
      email,
      initials: computeInitials(displayName, email),
      picture,
      promptLogin,
      requireAuth: () => {
        if (!isAuthenticated) setLoginRequested(true);
        return isAuthenticated;
      },
      closeLogin,
      isLoginModalOpen: !isAuthenticated && (loginRequested || loginBlocking && !isLoading)
    };
  }, [
    user,
    isLoading,
    login,
    register,
    logout,
    getAccessToken,
    promptLogin,
    closeLogin,
    loginRequested,
    loginBlocking
  ]);
  return /* @__PURE__ */ jsxs(AuthContext.Provider, { value, children: [
    children,
    appName && /* @__PURE__ */ jsx(
      LoginModal,
      {
        open: value.isLoginModalOpen,
        onClose: closeLogin,
        appName,
        description: loginDescription,
        features: loginFeatures,
        blocking: loginBlocking,
        login,
        register
      }
    )
  ] });
}
function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

// src/prm/i18n.ts
var en = {
  title: "My saved parcels",
  editProfile: "edit",
  totalParcels: "total parcels",
  refresh: "Refresh",
  exportCsv: "Export CSV",
  openInProom: "Open in proom",
  searchPlaceholder: "Search address, tag, parcel ID\u2026",
  filterAllStates: "All states",
  showingAll: (n) => `${n} parcels`,
  showingFiltered: (n, total) => `${n} of ${total}`,
  empty: "No saved parcels yet",
  emptyHint: "Save a parcel from any SwissNovo app and it will land here \u2014 and in proom.",
  noMatch: "No parcels match your filter.",
  loadFailed: "Could not load saved parcels",
  signinRequired: "Sign in to view your saved parcels",
  colAddress: "Address",
  colMunicipality: "Municipality",
  colState: "State",
  colPriority: "Priority",
  colTags: "Tags",
  colUpdated: "Updated",
  colActions: "Actions",
  openHere: "Open here",
  openInToolbox: "Open in toolbox",
  openInGeopool: "Open in geopool",
  delete: "Remove",
  tagPlaceholder: "Tag\u2026",
  addTag: "Add",
  removeTag: (tag) => `Remove tag ${tag}`,
  confirmDeleteTitle: "Stop tracking this parcel?",
  confirmDeleteBody: "It will be removed from proom too. This cannot be undone.",
  close: "Close",
  cancel: "Cancel",
  state: {
    new: "New",
    contacted: "Contacted",
    negotiation: "Negotiation",
    due_diligence: "Due Diligence",
    closed: "Closed",
    rejected: "Rejected"
  },
  priority: { low: "Low", medium: "Medium", high: "High", urgent: "Urgent" }
};
var fr = {
  title: "Mes parcelles enregistr\xE9es",
  editProfile: "modifier",
  totalParcels: "parcelles au total",
  refresh: "Actualiser",
  exportCsv: "Exporter en CSV",
  openInProom: "Ouvrir dans proom",
  searchPlaceholder: "Rechercher adresse, tag, ID\u2026",
  filterAllStates: "Tous les statuts",
  showingAll: (n) => `${n} parcelles`,
  showingFiltered: (n, total) => `${n} sur ${total}`,
  empty: "Aucune parcelle enregistr\xE9e",
  emptyHint: "Enregistrez une parcelle depuis n'importe quelle app SwissNovo \u2014 elle appara\xEEtra ici et dans proom.",
  noMatch: "Aucune parcelle ne correspond.",
  loadFailed: "Impossible de charger les parcelles",
  signinRequired: "Connectez-vous pour voir vos parcelles",
  colAddress: "Adresse",
  colMunicipality: "Commune",
  colState: "Statut",
  colPriority: "Priorit\xE9",
  colTags: "Tags",
  colUpdated: "Mis \xE0 jour",
  colActions: "Actions",
  openHere: "Ouvrir ici",
  openInToolbox: "Ouvrir dans toolbox",
  openInGeopool: "Ouvrir dans geopool",
  delete: "Supprimer",
  tagPlaceholder: "Tag\u2026",
  addTag: "Ajouter",
  removeTag: (tag) => `Retirer le tag ${tag}`,
  confirmDeleteTitle: "Ne plus suivre cette parcelle ?",
  confirmDeleteBody: "Elle sera aussi retir\xE9e de proom. Action irr\xE9versible.",
  close: "Fermer",
  cancel: "Annuler",
  state: {
    new: "Nouveau",
    contacted: "Contact\xE9",
    negotiation: "N\xE9gociation",
    due_diligence: "Due diligence",
    closed: "Cl\xF4tur\xE9",
    rejected: "Rejet\xE9"
  },
  priority: { low: "Basse", medium: "Moyenne", high: "Haute", urgent: "Urgent" }
};
var de = {
  title: "Meine gespeicherten Parzellen",
  editProfile: "bearbeiten",
  totalParcels: "Parzellen total",
  refresh: "Aktualisieren",
  exportCsv: "CSV exportieren",
  openInProom: "In proom \xF6ffnen",
  searchPlaceholder: "Adresse, Tag, Parzellen-ID\u2026",
  filterAllStates: "Alle Status",
  showingAll: (n) => `${n} Parzellen`,
  showingFiltered: (n, total) => `${n} von ${total}`,
  empty: "Noch keine Parzellen gespeichert",
  emptyHint: "Speichere eine Parzelle aus einer beliebigen SwissNovo-App \u2014 sie erscheint hier und in proom.",
  noMatch: "Keine Parzelle entspricht dem Filter.",
  loadFailed: "Parzellen konnten nicht geladen werden",
  signinRequired: "Melde dich an, um deine Parzellen zu sehen",
  colAddress: "Adresse",
  colMunicipality: "Gemeinde",
  colState: "Status",
  colPriority: "Priorit\xE4t",
  colTags: "Tags",
  colUpdated: "Aktualisiert",
  colActions: "Aktionen",
  openHere: "Hier \xF6ffnen",
  openInToolbox: "In toolbox \xF6ffnen",
  openInGeopool: "In geopool \xF6ffnen",
  delete: "Entfernen",
  tagPlaceholder: "Tag\u2026",
  addTag: "Hinzuf\xFCgen",
  removeTag: (tag) => `Tag ${tag} entfernen`,
  confirmDeleteTitle: "Parzelle nicht mehr verfolgen?",
  confirmDeleteBody: "Sie wird auch aus proom entfernt. Diese Aktion ist endg\xFCltig.",
  close: "Schliessen",
  cancel: "Abbrechen",
  state: {
    new: "Neu",
    contacted: "Kontaktiert",
    negotiation: "Verhandlung",
    due_diligence: "Due Diligence",
    closed: "Abgeschlossen",
    rejected: "Abgelehnt"
  },
  priority: { low: "Niedrig", medium: "Mittel", high: "Hoch", urgent: "Dringend" }
};
var it = {
  title: "Le mie particelle salvate",
  editProfile: "modifica",
  totalParcels: "particelle totali",
  refresh: "Aggiorna",
  exportCsv: "Esporta CSV",
  openInProom: "Apri in proom",
  searchPlaceholder: "Cerca indirizzo, tag, ID particella\u2026",
  filterAllStates: "Tutti gli stati",
  showingAll: (n) => `${n} particelle`,
  showingFiltered: (n, total) => `${n} di ${total}`,
  empty: "Nessuna particella salvata",
  emptyHint: "Salva una particella da una qualsiasi app SwissNovo \u2014 comparir\xE0 qui e in proom.",
  noMatch: "Nessuna particella corrisponde.",
  loadFailed: "Impossibile caricare le particelle",
  signinRequired: "Accedi per vedere le tue particelle",
  colAddress: "Indirizzo",
  colMunicipality: "Comune",
  colState: "Stato",
  colPriority: "Priorit\xE0",
  colTags: "Tag",
  colUpdated: "Aggiornata",
  colActions: "Azioni",
  openHere: "Apri qui",
  openInToolbox: "Apri in toolbox",
  openInGeopool: "Apri in geopool",
  delete: "Rimuovi",
  tagPlaceholder: "Tag\u2026",
  addTag: "Aggiungi",
  removeTag: (tag) => `Rimuovi tag ${tag}`,
  confirmDeleteTitle: "Smettere di seguire questa particella?",
  confirmDeleteBody: "Sar\xE0 rimossa anche da proom. Azione irreversibile.",
  close: "Chiudi",
  cancel: "Annulla",
  state: {
    new: "Nuova",
    contacted: "Contattata",
    negotiation: "Negoziazione",
    due_diligence: "Due diligence",
    closed: "Chiusa",
    rejected: "Rifiutata"
  },
  priority: { low: "Bassa", medium: "Media", high: "Alta", urgent: "Urgente" }
};
var SAVED_PARCELS_STRINGS = {
  en,
  fr,
  de,
  it
};
var getSavedParcelsStrings = (locale = "en") => SAVED_PARCELS_STRINGS[locale] ?? SAVED_PARCELS_STRINGS.en;
function SavedParcelsModal({
  locale = "en",
  onClose,
  onOpenHere,
  openHereLabel,
  dark = false
}) {
  const t = getSavedParcelsStrings(locale);
  const auth = useAuth();
  const accessToken = auth.getAccessToken();
  const isAuthenticated = auth.isAuthenticated;
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortKey, setSortKey] = useState("updated_at");
  const [sortAsc, setSortAsc] = useState(false);
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const modalRef = useFocusTrap({ onEscape: onClose });
  const refresh = () => {
    if (!isAuthenticated || !accessToken) return;
    setLoading(true);
    setError(null);
    fetchPrmRecords(accessToken).then(setRecords).catch((err) => setError(String(err?.message ?? err))).finally(() => setLoading(false));
  };
  useEffect(refresh, [accessToken, isAuthenticated]);
  const handleSort = (key) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records.filter((r) => stateFilter === "all" || r.state === stateFilter).filter((r) => {
      if (!q) return true;
      const blob = [
        r.parcel_label,
        r.parcel_municipality,
        r.parcel_id,
        (r.tags || []).join(" ")
      ].join(" ").toLowerCase();
      return blob.includes(q);
    });
  }, [records, search, stateFilter]);
  const sorted = useMemo(() => {
    const dir = sortAsc ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const va = a[sortKey] ?? "";
      const vb = b[sortKey] ?? "";
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });
  }, [filtered, sortKey, sortAsc]);
  const exportCsv = () => {
    const headers = [
      "Parcel ID",
      "Address",
      "Municipality",
      "Area (m2)",
      "State",
      "Priority",
      "Tags",
      "Lat",
      "Lng",
      "Updated"
    ];
    const rows = sorted.map((r) => [
      r.parcel_id,
      r.parcel_label,
      r.parcel_municipality,
      r.parcel_area,
      r.state,
      r.priority,
      (r.tags || []).join("; "),
      r.parcel_lat,
      r.parcel_lng,
      new Date(r.updated_at).toLocaleDateString()
    ]);
    const csv = [headers, ...rows].map(
      (row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    ).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `saved_parcels_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const patchLocal = (id, patch) => {
    setRecords(
      (rs) => rs.map((r) => r.id === id ? { ...r, ...patch, updated_at: (/* @__PURE__ */ new Date()).toISOString() } : r)
    );
  };
  const onChangeState = async (rec, next) => {
    if (rec.state === next || !accessToken) return;
    patchLocal(rec.id, { state: next });
    try {
      const updated = await updatePrmState(accessToken, rec.id, next);
      patchLocal(rec.id, updated);
    } catch {
      patchLocal(rec.id, { state: rec.state });
    }
  };
  const onChangePriority = async (rec, next) => {
    if (rec.priority === next || !accessToken) return;
    patchLocal(rec.id, { priority: next });
    try {
      const updated = await updatePrmPriority(accessToken, rec.id, next);
      patchLocal(rec.id, updated);
    } catch {
      patchLocal(rec.id, { priority: rec.priority });
    }
  };
  const onChangeTags = async (rec, next) => {
    if (!accessToken) return;
    patchLocal(rec.id, { tags: next });
    try {
      const updated = await updatePrmTags(accessToken, rec.id, next);
      patchLocal(rec.id, updated);
    } catch {
      patchLocal(rec.id, { tags: rec.tags });
    }
  };
  const onDelete = async (id) => {
    if (!accessToken) return;
    const prev = records;
    setRecords((rs) => rs.filter((r) => r.id !== id));
    setConfirmDeleteId(null);
    try {
      await deletePrmRecord(accessToken, id);
    } catch {
      setRecords(prev);
    }
  };
  return createPortal(
    /* @__PURE__ */ jsxs("div", { className: `${dark ? "dark " : ""}fixed inset-0 z-[200] flex items-center justify-center p-4`, children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/55 backdrop-blur-sm", onClick: onClose }),
      /* @__PURE__ */ jsxs(
        "div",
        {
          ref: modalRef,
          className: "relative w-full max-w-5xl max-h-[85vh] rounded-2xl shadow-2xl border overflow-hidden flex flex-col bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700",
          style: { animation: "savedParcelsIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both" },
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 py-3.5 border-b border-gray-200 dark:border-gray-700 flex-shrink-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
                /* @__PURE__ */ jsx(MapPin, { size: 18, className: "text-emerald-600 dark:text-emerald-400 shrink-0" }),
                /* @__PURE__ */ jsx("h2", { className: "text-base font-semibold text-gray-900 dark:text-white", children: t.title }),
                /* @__PURE__ */ jsx("span", { className: "text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400", children: records.length })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: refresh,
                    title: t.refresh,
                    "aria-label": t.refresh,
                    className: "p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                    children: /* @__PURE__ */ jsx(RefreshCw, { size: 15, className: loading ? "animate-spin" : "" })
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: exportCsv,
                    disabled: records.length === 0,
                    className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-100 dark:hover:bg-emerald-500/25 transition-colors disabled:opacity-40",
                    children: [
                      /* @__PURE__ */ jsx(Download, { size: 13 }),
                      t.exportCsv
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: `${PROOM_APP_URL}/`,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors",
                    children: [
                      /* @__PURE__ */ jsx(LayoutGrid, { size: 13 }),
                      t.openInProom
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: onClose,
                    "aria-label": t.close,
                    className: "p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                    children: /* @__PURE__ */ jsx(X, { size: 17 })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 px-5 py-2.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30", children: [
              /* @__PURE__ */ jsxs("div", { className: "relative flex-1 min-w-[160px] max-w-sm", children: [
                /* @__PURE__ */ jsx(Search, { size: 14, className: "absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: search,
                    onChange: (e) => setSearch(e.target.value),
                    placeholder: t.searchPlaceholder,
                    className: "w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: stateFilter,
                  onChange: (e) => setStateFilter(e.target.value),
                  className: "px-2.5 py-1.5 rounded-lg text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "all", children: t.filterAllStates }),
                    PRM_STATES.map((s) => /* @__PURE__ */ jsx("option", { value: s.value, children: t.state[s.value] }, s.value))
                  ]
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "ml-auto text-[11px] text-gray-500 dark:text-gray-400", children: sorted.length === records.length ? t.showingAll(records.length) : t.showingFiltered(sorted.length, records.length) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-auto", children: !isAuthenticated ? /* @__PURE__ */ jsx(EmptyState, { icon: /* @__PURE__ */ jsx(MapPin, { size: 32, className: "text-gray-400" }), title: t.signinRequired }) : loading ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-16", children: /* @__PURE__ */ jsx(RefreshCw, { size: 20, className: "animate-spin text-gray-400" }) }) : error ? /* @__PURE__ */ jsx(EmptyState, { icon: /* @__PURE__ */ jsx(X, { size: 32, className: "text-red-400" }), title: t.loadFailed, hint: error }) : records.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { icon: /* @__PURE__ */ jsx(MapPin, { size: 32, className: "text-gray-400" }), title: t.empty, hint: t.emptyHint }) : sorted.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { icon: /* @__PURE__ */ jsx(Search, { size: 32, className: "text-gray-400" }), title: t.noMatch }) : /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
              /* @__PURE__ */ jsx("thead", { className: "sticky top-0 z-10 bg-gray-50 dark:bg-gray-800/80 backdrop-blur", children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-gray-200 dark:border-gray-700", children: [
                /* @__PURE__ */ jsx(Th, { children: /* @__PURE__ */ jsx(SortBtn, { label: t.colAddress, field: "parcel_label", sortKey, sortAsc, onClick: handleSort }) }),
                /* @__PURE__ */ jsx(Th, { children: /* @__PURE__ */ jsx(SortBtn, { label: t.colMunicipality, field: "parcel_municipality", sortKey, sortAsc, onClick: handleSort }) }),
                /* @__PURE__ */ jsx(Th, { children: /* @__PURE__ */ jsx(SortBtn, { label: t.colState, field: "state", sortKey, sortAsc, onClick: handleSort }) }),
                /* @__PURE__ */ jsx(Th, { children: /* @__PURE__ */ jsx(SortBtn, { label: t.colPriority, field: "priority", sortKey, sortAsc, onClick: handleSort }) }),
                /* @__PURE__ */ jsx(Th, { className: "hidden md:table-cell", children: t.colTags }),
                /* @__PURE__ */ jsx(Th, { children: /* @__PURE__ */ jsx(SortBtn, { label: t.colUpdated, field: "updated_at", sortKey, sortAsc, onClick: handleSort }) }),
                /* @__PURE__ */ jsx(Th, { align: "right", children: t.colActions })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { children: sorted.map((r) => /* @__PURE__ */ jsx(
                Row,
                {
                  record: r,
                  t,
                  openHereLabel: openHereLabel ?? t.openHere,
                  onChangeState,
                  onChangePriority,
                  onChangeTags,
                  onDelete: () => setConfirmDeleteId(r.id),
                  onOpenHere
                },
                r.id
              )) })
            ] }) }),
            confirmDeleteId && /* @__PURE__ */ jsx(
              ConfirmDelete,
              {
                t,
                onCancel: () => setConfirmDeleteId(null),
                onConfirm: () => onDelete(confirmDeleteId)
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsx("style", { children: `
        @keyframes savedParcelsIn {
          from { opacity: 0; transform: scale(0.92) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      ` })
    ] }),
    document.body
  );
}
function Th({ children, align = "left", className = "" }) {
  return /* @__PURE__ */ jsx("th", { className: `px-3 py-2.5 text-[10px] uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 ${align === "right" ? "text-right" : "text-left"} ${className}`, children });
}
function SortBtn({ label, field, sortKey, sortAsc, onClick }) {
  const active = sortKey === field;
  return /* @__PURE__ */ jsxs(
    "button",
    {
      onClick: () => onClick(field),
      className: "inline-flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200 transition-colors",
      children: [
        label,
        /* @__PURE__ */ jsx(
          ArrowUpDown,
          {
            size: 10,
            className: active ? "text-emerald-500" : "opacity-30",
            style: active ? { transform: sortAsc ? void 0 : "scaleY(-1)" } : void 0
          }
        )
      ]
    }
  );
}
function EmptyState({ icon, title, hint }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-16 gap-2 px-4 text-center", children: [
    icon,
    /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-700 dark:text-gray-300", children: title }),
    hint && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 max-w-md", children: hint })
  ] });
}
function Row({ record, t, openHereLabel, onChangeState, onChangePriority, onChangeTags, onDelete, onOpenHere }) {
  const stateInfo = PRM_STATES.find((s) => s.value === record.state);
  const priorityInfo = PRM_PRIORITIES.find((p) => p.value === record.priority);
  const params = `?lat=${record.parcel_lat}&lng=${record.parcel_lng}${record.parcel_label ? `&address=${encodeURIComponent(record.parcel_label)}` : ""}`;
  return /* @__PURE__ */ jsxs("tr", { className: "border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors align-top", children: [
    /* @__PURE__ */ jsxs("td", { className: "px-3 py-3", children: [
      /* @__PURE__ */ jsx("div", { className: "font-medium text-gray-900 dark:text-gray-100 text-sm max-w-[220px] truncate", children: record.parcel_label || record.parcel_id }),
      /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-500 dark:text-gray-400 font-mono mt-0.5 truncate", children: record.parcel_id })
    ] }),
    /* @__PURE__ */ jsxs("td", { className: "px-3 py-3 text-xs text-gray-600 dark:text-gray-300", children: [
      record.parcel_municipality || "\u2014",
      record.parcel_area > 0 && /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-gray-400 mt-0.5", children: [
        Math.round(record.parcel_area).toLocaleString("de-CH"),
        " m\xB2"
      ] })
    ] }),
    /* @__PURE__ */ jsx("td", { className: "px-3 py-3", children: /* @__PURE__ */ jsx(
      PillSelect,
      {
        value: record.state,
        onChange: (v) => onChangeState(record, v),
        options: PRM_STATES.map((s) => ({ value: s.value, label: t.state[s.value] })),
        dotClass: stateInfo?.bg ?? "bg-slate-500",
        colorClass: stateInfo?.color ?? "text-gray-500"
      }
    ) }),
    /* @__PURE__ */ jsx("td", { className: "px-3 py-3", children: /* @__PURE__ */ jsx(
      PillSelect,
      {
        value: record.priority,
        onChange: (v) => onChangePriority(record, v),
        options: PRM_PRIORITIES.map((p) => ({ value: p.value, label: t.priority[p.value] })),
        colorClass: priorityInfo?.color ?? "text-gray-500"
      }
    ) }),
    /* @__PURE__ */ jsx("td", { className: "px-3 py-3 hidden md:table-cell max-w-[220px]", children: /* @__PURE__ */ jsx(TagEditor, { tags: record.tags || [], onChange: (next) => onChangeTags(record, next), t }) }),
    /* @__PURE__ */ jsx("td", { className: "px-3 py-3 text-[11px] text-gray-500 dark:text-gray-400 whitespace-nowrap", children: new Date(record.updated_at).toLocaleDateString() }),
    /* @__PURE__ */ jsx("td", { className: "px-3 py-3 text-right", children: /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-0.5", children: [
      onOpenHere && /* @__PURE__ */ jsx(ActionBtn, { onClick: () => onOpenHere(record), title: openHereLabel, icon: /* @__PURE__ */ jsx(MapPin, { size: 13 }) }),
      /* @__PURE__ */ jsx(ActionBtn, { href: `${TOOLBOX_APP_URL}/${params}`, title: t.openInToolbox, icon: /* @__PURE__ */ jsx(Compass, { size: 13 }) }),
      /* @__PURE__ */ jsx(ActionBtn, { href: `${GEOPOOL_APP_URL}/${params}`, title: t.openInGeopool, icon: /* @__PURE__ */ jsx(Layers, { size: 13 }) }),
      /* @__PURE__ */ jsx(ActionBtn, { href: `${PROOM_APP_URL}/?prm=${encodeURIComponent(record.id)}`, title: t.openInProom, icon: /* @__PURE__ */ jsx(ExternalLink, { size: 13 }) }),
      /* @__PURE__ */ jsx(ActionBtn, { onClick: onDelete, title: t.delete, icon: /* @__PURE__ */ jsx(Trash2, { size: 13 }), danger: true })
    ] }) })
  ] });
}
function ActionBtn({ onClick, href, title, icon, danger }) {
  const base = "p-1.5 rounded-md transition-colors text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/60";
  const hover = danger ? "hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10" : "hover:text-emerald-600 dark:hover:text-emerald-400";
  const className = `${base} ${hover}`;
  if (href) {
    return /* @__PURE__ */ jsx("a", { href, target: "_blank", rel: "noopener noreferrer", title, className, children: icon });
  }
  return /* @__PURE__ */ jsx("button", { type: "button", onClick, title, className, children: icon });
}
function PillSelect({ value, onChange, options, dotClass, colorClass }) {
  return /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center gap-1.5 cursor-pointer group", children: [
    dotClass && /* @__PURE__ */ jsx("span", { className: `w-1.5 h-1.5 rounded-full ${dotClass} shrink-0` }),
    /* @__PURE__ */ jsx("span", { className: "relative", children: /* @__PURE__ */ jsx(
      "select",
      {
        value,
        onChange: (e) => onChange(e.target.value),
        className: `appearance-none bg-transparent border-0 pr-3 text-xs font-medium cursor-pointer focus:outline-none focus:ring-0 ${colorClass} group-hover:underline`,
        children: options.map((o) => /* @__PURE__ */ jsx("option", { value: o.value, className: "text-gray-900", children: o.label }, o.value))
      }
    ) })
  ] });
}
function TagEditor({ tags, onChange, t }) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef(null);
  useEffect(() => {
    if (adding) inputRef.current?.focus();
  }, [adding]);
  const commit = () => {
    const v = draft.trim();
    setDraft("");
    setAdding(false);
    if (!v) return;
    if (tags.includes(v)) return;
    onChange([...tags, v]);
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-1", children: [
    tags.map((tag) => /* @__PURE__ */ jsxs(
      "span",
      {
        className: "inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700",
        children: [
          tag,
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => onChange(tags.filter((x) => x !== tag)),
              className: "text-gray-400 hover:text-red-500",
              "aria-label": t.removeTag(tag),
              children: /* @__PURE__ */ jsx(X, { size: 10 })
            }
          )
        ]
      },
      tag
    )),
    adding ? /* @__PURE__ */ jsx(
      "input",
      {
        ref: inputRef,
        type: "text",
        value: draft,
        onChange: (e) => setDraft(e.target.value),
        onBlur: commit,
        onKeyDown: (e) => {
          if (e.key === "Enter") commit();
          else if (e.key === "Escape") {
            setDraft("");
            setAdding(false);
          }
        },
        placeholder: t.tagPlaceholder,
        className: "text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 w-20 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
      }
    ) : /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: () => setAdding(true),
        className: "inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 border border-dashed border-gray-300 dark:border-gray-700",
        "aria-label": t.addTag,
        children: [
          /* @__PURE__ */ jsx(Plus, { size: 10 }),
          t.addTag
        ]
      }
    )
  ] });
}
function ConfirmDelete({ t, onCancel, onConfirm }) {
  return /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-20 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm", children: /* @__PURE__ */ jsxs(
    "div",
    {
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "swn-confirm-del-title",
      "aria-describedby": "swn-confirm-del-body",
      className: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-5 max-w-sm w-full",
      children: [
        /* @__PURE__ */ jsx("h3", { id: "swn-confirm-del-title", className: "text-sm font-semibold text-gray-900 dark:text-white", children: t.confirmDeleteTitle }),
        /* @__PURE__ */ jsx("p", { id: "swn-confirm-del-body", className: "mt-1.5 text-xs text-gray-500 dark:text-gray-400", children: t.confirmDeleteBody }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 flex justify-end gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: onCancel,
              autoFocus: true,
              className: "px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
              children: t.cancel
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: onConfirm,
              className: "px-3 py-1.5 rounded-lg text-xs font-medium bg-red-600 hover:bg-red-500 text-white",
              children: t.delete
            }
          )
        ] })
      ]
    }
  ) });
}

// src/claire/claireAppCatalog.ts
var SWISSNOVO_SUITE_BLURB = "Aireon, formerly SwissNovo, is a suite of focused web apps for Swiss real estate, built for owners, architects and brokers. Each app does one job well \u2014 valuation, zoning, GIS, monitoring, CRM, and more \u2014 and the hub links them all. Most accept a parcel or coordinates so the user can carry context from one tool to the next. Prefer the *.aireon.ch URLs; legacy Swissnovo/Vercel URLs continue to work for existing links and integrations.";
var SWISSNOVO_APP_CATALOG = `Valuation & pricing:
- valoo \u2014 map of parcel values; spots pricing hotspots and underpriced pockets. https://valoo.aireon.ch/ (legacy: https://swissnovo-valoo.vercel.app/)
- proove \u2014 instant property valuation with transparent, factor-based pricing and upside estimates. https://proove.aireon.ch/ (legacy: https://proove.vercel.app/)
- scoore \u2014 auto-scores parcels on location, infrastructure and development potential. https://scoore.aireon.ch/ (legacy: https://swissnovo-scoore.vercel.app/)

Maps & GIS data:
- geopool \u2014 visual GIS data browser for real estate, like Google Maps for parcels. https://geopool.aireon.ch/ (legacy: https://geopool.vercel.app/)
- contoor \u2014 extracts CAD geodata, parcel boundaries and topographic information. https://contoor.aireon.ch/ (legacy: https://contoor.vercel.app/)
- woom \u2014 detects every available WMS map layer for a parcel. https://woom.aireon.ch/ (legacy: https://swissnovo-woom.vercel.app/)
- voogle \u2014 exports high-resolution Street View images for brochures. https://voogle.aireon.ch/ (legacy: https://swissnovo-voogle.vercel.app/)

Building, terrain & environment:
- roofs \u2014 analyzes building heights and roof structures. https://roofs.aireon.ch/ (legacy: https://swissnovo-roofs.vercel.app/)
- roots \u2014 researches building age and history for renovation/investment decisions. https://roots.aireon.ch/ (legacy: https://swissnovo-roots.vercel.app/)
- hood \u2014 simulates 3D sunlight and shadow patterns for any parcel. https://hood.aireon.ch/ (legacy: https://swissnovo-hood.vercel.app/)
- footprint \u2014 analyzes building footprints, coverage ratios and sealed surface. https://footprint.aireon.ch/ (legacy: https://swissnovo-footprint.vercel.app/)
- soolar \u2014 building-level solar/PV potential from the BFE Sonnendach dataset. https://soolar.aireon.ch/ (legacy: https://swissnovo-soolar.vercel.app/)
- boom \u2014 Swiss environmental noise map (road & rail) checked against legal limits. https://boom.aireon.ch/ (legacy: https://swissnovo-boom.vercel.app/)

Regulations & legal:
- xploore \u2014 finds building regulations, zoning plans and rules for a parcel. https://xploore.aireon.ch/ (legacy: https://xploore.vercel.app/)
- handbook \u2014 planning-document dataroom with AI summaries and regulation Q&A. https://handbook.aireon.ch/ (legacy: https://swissnovo-handbook.vercel.app/)
- roolez \u2014 AI-powered analysis and interpretation of building regulations. https://roolez-collector.aireon.ch/ (legacy: https://roolez-collector.vercel.app/)
- lookup \u2014 OEREB control center for public-law restriction queries. https://lookup.aireon.ch/ (legacy: https://swissnovo-lookup.vercel.app/)

Monitoring & market signals:
- scoops \u2014 real-time dashboard of property signals and market indicators. https://scoops.aireon.ch/ (legacy: https://swissnovo-scoops.vercel.app/)
- watchoo \u2014 tracks building permits Switzerland-wide to qualify leads early. https://watchoo.aireon.ch/ (legacy: https://swissnovo-watchoo.vercel.app/)
- vacoo \u2014 monitors Swiss vacancy rates and market availability. https://vacoo.aireon.ch/ (legacy: https://vacoo.vercel.app/)
- groove \u2014 monitors official GWR building data and detects registry changes. https://groove.aireon.ch/ (legacy: https://swissnovo-groove.vercel.app/)
- goody \u2014 map of every new building project in Switzerland from the GWR register. https://goody.aireon.ch/ (legacy: https://swissnovo-goody.vercel.app/)
- taxoo \u2014 compares Swiss tax rates across municipalities. https://taxoo.aireon.ch/ (legacy: https://taxoo.vercel.app/)

Search & parcel data:
- choose \u2014 SQL-backed parcel filter and export by size, price, city, year. https://choose.aireon.ch/ (legacy: https://swissnovo-choose.vercel.app/)
- showroom \u2014 full parcel data overview from an address search. https://showroom.aireon.ch/ (legacy: https://swissnovo-showroom.vercel.app/)

Pipeline & AI assistants:
- proom \u2014 parcel-first CRM with a Kanban pipeline, saved parcels and activity log. https://proom.aireon.ch/ (legacy: https://swissnovo-proom.vercel.app/)
- doorway \u2014 natural-language parcel chat about ownership, zoning and potential. https://doorway.aireon.ch/ (legacy: https://swissnovo-doorway.vercel.app/)
- booklet \u2014 builds professional property portfolios and company presentations. https://booklet.aireon.ch/ (legacy: https://swissnovo-booklet.vercel.app/)

Transactions & brokers:
- boost \u2014 compares brokers by performance, commission and specialization. https://boost.aireon.ch/ (legacy: https://swissnovo-boost.vercel.app/)
- zeroo \u2014 zero-commission marketplace to buy and sell property directly. https://zeroo.aireon.ch/ (legacy: https://swissnovo-zeroo.vercel.app/)
- realioo \u2014 fractional, tokenized Swiss real-estate investment. https://realioo.brokereum.xyz

Hub:
- hub \u2014 the suite dashboard: search and launch every Aireon tool. https://hub.aireon.ch/ (legacy: https://swissnovo-toolbox.vercel.app/)`;

// src/claire/geminiClient.ts
var GEMINI_ENDPOINT = (model, key) => `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
  key
)}`;
var GEMINI_STREAM_ENDPOINT = (model, key) => `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${encodeURIComponent(
  key
)}`;
var FIELD_LABELS = {
  estimated_price_m2: "Estimated price per m\xB2 (CHF)",
  estimated_price: "Estimated total value (CHF)",
  price_m2: "Market price per m\xB2 (CHF)",
  price: "Market price (CHF)",
  area_m2: "Plot area (m\xB2)",
  parcel_area: "Plot area (m\xB2)",
  flaeche: "Plot area (m\xB2)",
  grundflaeche: "Ground area (m\xB2)",
  bldg_count: "Building count",
  building_count: "Building count",
  bldg_size: "Building footprint (m\xB2)",
  bldg_floors: "Building floors",
  bldg_height_mean: "Mean building height (m)",
  bldg_constr_year: "Construction year",
  construction_year: "Construction year",
  baujahr: "Construction year",
  rooms: "Rooms",
  zimmer: "Rooms",
  floors: "Floors",
  geschosse: "Floors",
  cz_local: "Local construction zone",
  cz_harmonized: "Harmonized zone type",
  construction_zone: "Construction zone",
  bauzone: "Construction zone",
  nutzungszone: "Usage zone",
  address: "Address",
  street: "Street",
  strasse: "Street",
  streetname: "Street",
  cityname: "City",
  city: "City",
  ort: "City",
  gemeinde: "Municipality",
  municipality: "Municipality",
  fso_name_2021: "Municipality (FSO)",
  districtname: "District",
  plz: "Postal code",
  zip: "Postal code",
  canton: "Canton",
  kanton: "Canton",
  cz_canton_name: "Canton",
  parcel_id: "Parcel ID",
  parcel_local_id: "Parcel local ID",
  gwr_egid: "GWR EGID",
  grundstueck_nr: "Plot number",
  parzelle: "Parcel number",
  nummer: "Number",
  owner: "Owner",
  is_sell: "Listed for sale",
  // Noise-specific keys for boom app
  noise_source: "Noise source type",
  noise_period: "Noise evaluation period",
  noise_layer: "Environmental noise model layer",
  noise_band: "Sampled noise exposure level (dB(A))",
  noise_sensitivity: "Zoning noise sensitivity level (ES)",
  noise_limits: "Legal noise limit values (Planning/Immission/Alarm)",
  noise_verdict: "Noise limit compliance verdict",
  // Solar-specific keys for soolar app
  dominantklasse: "Roof solar suitability level (1-5)",
  totalaream2: "Suitable roof area for solar (m\xB2)",
  totalyieldkwhyr: "Estimated annual PV solar yield (kWh/yr)",
  meanirradiationkwhm2yr: "Mean annual solar irradiation (kWh/m\xB2/yr)",
  totalrevenuechfyr: "Estimated annual solar revenue (CHF/yr)",
  roof_count: "Total roof surfaces on building",
  // Building footprint / 3D height keys for footprint app
  rf_volume_lod22: "Building 3D volume (m\xB3)",
  rf_area: "Building footprint area (m\xB2)",
  rf_nr_floors: "Building floor count",
  rf_h_roof_ridge: "Roof ridge elevation (m)",
  rf_h_roof_max: "Max roof elevation (m)",
  rf_h_roof_70p: "70th-percentile roof height (m)",
  rf_h_roof_50p: "50th-percentile roof height (m)",
  rf_h_roof_min: "Min roof elevation (m)",
  rf_h_roof_eaves: "Eaves elevation (m)",
  rf_h_ground: "Ground elevation (m)",
  derived_height: "Derived building height (m)",
  // Geopool-specific keys (Zoning, taxes, vacancy, accessibility)
  tax_sum: "Total local municipal tax rate (\u2030)",
  tax_canton: "Canton tax factor",
  tax_fso_name: "Tax municipality name",
  cz_util_now: "Current zoning utilization ratio",
  cz_util_est_score: "Zoning utilization score",
  gfa_now: "Current Gross Floor Area (GFA) (m\xB2)",
  gfa_max: "Maximum allowed Gross Floor Area (GFA) (m\xB2)",
  vol_max: "Maximum allowed building volume (m\xB3)",
  ratio_s: "Built parcel ratio (%)",
  ratio_s_free: "Free/available built parcel ratio (%)",
  ratio_v: "Volume parcel ratio (%)",
  ratio_v_free: "Free/available volume parcel ratio (%)",
  acc_ewap_pubt: "Public transit accessibility travel time (min)",
  acc_ewap_road: "Private vehicle accessibility travel time (min)",
  tt_agglo_pubt_score: "Transit accessibility quality score",
  tt_agglo_road_score: "Road accessibility quality score",
  vac_all: "Local overall vacancy rate (%)",
  vac_new: "Local vacancy rate for new construction (%)",
  vac_old: "Local vacancy rate for existing buildings (%)"
};
function formatValue(key, raw) {
  if (raw === null || raw === void 0 || raw === "") return null;
  if (typeof raw === "boolean") return raw ? "yes" : "no";
  if (typeof raw === "number") {
    if (!Number.isFinite(raw)) return null;
    if (key.includes("price") || key.endsWith("_chf")) {
      return Math.round(raw).toLocaleString("en-US");
    }
    if (Number.isInteger(raw)) return raw.toString();
    return raw.toFixed(2);
  }
  return String(raw);
}
function buildParcelContextSummary(input) {
  const lines = [];
  const seen = /* @__PURE__ */ new Set();
  const props = { ...input.properties ?? {} };
  if (input.enrichment) {
    for (const [k, v] of Object.entries(input.enrichment)) {
      const lower = k.toLowerCase();
      if (props[lower] === void 0) props[lower] = v;
    }
  }
  for (const [rawKey, value] of Object.entries(props)) {
    const key = rawKey.toLowerCase();
    const label = FIELD_LABELS[key];
    if (!label) continue;
    if (seen.has(label)) continue;
    const formatted = formatValue(key, value);
    if (formatted === null) continue;
    seen.add(label);
    lines.push(`- ${label}: ${formatted}`);
  }
  const { lng, lat } = input.lngLat;
  lines.push(`- WGS84 coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
  if (input.lv95) {
    lines.push(`- Swiss LV95 coordinates: E ${input.lv95.E}, N ${input.lv95.N}`);
  }
  return lines.join("\n");
}
function systemInstruction(appName) {
  const where = appName ? `${appName}, an Aireon real-estate analytics app` : "an Aireon real-estate analytics app";
  const currentApp = appName ?? "the current app";
  return `You are "Claire", the AI parcel assistant embedded inside ${where}. You help investors, developers and property owners understand a single selected parcel.

Tone and format:
- Concise, expert, and grounded in the parcel context provided. Avoid filler.
- Use short paragraphs and tight bullet lists when listing items.
- Prices are in CHF. Areas in m\xB2. Use Swiss thousand separators when natural.
- Answer in the same language as the user's question (default English).

Rules:
- Always stay focused on the currently selected parcel below. If the user asks for nearby comparisons, market trends, or legal advice, give helpful general guidance grounded in the parcel context and clearly mark estimates as such.
- Never invent specific cadastral, legal, or pricing figures that aren't supplied. If data is missing, say so briefly and suggest what would be needed.
- When the user asks about the neighbourhood (schools, transit, shops, restaurants, parks, services), draw from the "Surrounding location & amenities" block if present \u2014 quote names and distances faithfully and do not invent POIs not listed.
- If a "Location-accessibility score" is present, treat it as the parcel's scoore walkability score: it runs 0\u20136, where 6 means key amenities are at the doorstep. Cite it as "<n>/6" and explain weak categories using the per-category breakdown.
- Mention regulatory caveats for Switzerland where relevant (e.g. zoning law, Lex Koller, planning permissions) at a high level.
- When another Aireon app would clearly serve the user's need better than this one, recommend it by name with its primary Aireon URL \u2014 usually a single suggestion. Never recommend ${currentApp} itself (it is the app they are already using). Point users to the hub when they want to browse the whole suite.
- Do not output disclaimers longer than one short sentence.

About the Aireon suite:
${SWISSNOVO_SUITE_BLURB}

${SWISSNOVO_APP_CATALOG}`;
}
var GeminiConfigError = class extends Error {
  constructor() {
    super(
      "Gemini API key missing. Set VITE_GEMINI_API_KEY in the app\u2019s .env file."
    );
    this.name = "GeminiConfigError";
  }
};
function buildClaireRequestBody(appName, parcelContext, history) {
  const systemText = `${systemInstruction(appName)}

Selected parcel context:
${parcelContext}`;
  const contents = history.map((turn) => ({
    role: turn.role === "assistant" ? "model" : "user",
    parts: [{ text: turn.content }]
  }));
  return JSON.stringify({
    systemInstruction: { role: "system", parts: [{ text: systemText }] },
    contents,
    generationConfig: {
      temperature: 0.55,
      topP: 0.9,
      // The Gemini 3.x flash models in the fallback chain emit hidden
      // "thinking" tokens that count against maxOutputTokens. At 800 the
      // reasoning pass alone could exhaust the budget, so the visible answer
      // was cut off mid-sentence (finishReason MAX_TOKENS) — both the unary
      // apps and streaming Studio share this body, so both were affected.
      // 2048 leaves ample room for the answer after thinking. Billing is on
      // tokens actually generated, so the higher ceiling is free for the
      // concise replies the system prompt asks for.
      maxOutputTokens: 2048
    },
    safetySettings: []
  });
}
async function generateParcelChatReply({
  apiKey,
  model,
  appName,
  parcelContext,
  history,
  signal
}) {
  if (!apiKey) throw new GeminiConfigError();
  if (history.length === 0)
    throw new Error("history must contain at least one user message");
  const body = buildClaireRequestBody(appName, parcelContext, history);
  const { response: res } = await fetchGeminiWithFallback({
    apiKey,
    model,
    buildUrl: (m, k) => GEMINI_ENDPOINT(m, k),
    requestInit: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body
    },
    signal
  });
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Gemini request failed (${res.status})`);
  }
  if (data.promptFeedback?.blockReason) {
    throw new Error(`Response blocked: ${data.promptFeedback.blockReason}`);
  }
  const text = data.candidates?.flatMap((c) => c.content?.parts ?? []).map((p) => p.text ?? "").join("").trim();
  if (!text) throw new Error("Empty response from Gemini.");
  return text;
}
async function streamParcelChatReply({
  apiKey,
  model,
  appName,
  parcelContext,
  history,
  signal,
  onDelta
}) {
  if (!apiKey) throw new GeminiConfigError();
  if (history.length === 0)
    throw new Error("history must contain at least one user message");
  const body = buildClaireRequestBody(appName, parcelContext, history);
  const { response: res } = await fetchGeminiWithFallback({
    apiKey,
    model,
    buildUrl: (m, k) => GEMINI_STREAM_ENDPOINT(m, k),
    requestInit: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream"
      },
      body
    },
    signal,
    // The whole stream can legitimately take >15 s for long answers; the
    // per-attempt timeout in the fallback layer would abort us mid-reply.
    // The caller's `signal` is the only abort mechanism for streaming.
    timeoutMs: 0
  });
  if (!res.body) {
    throw new Error("Gemini streaming response has no body.");
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  let fullText = "";
  const consumeEvent = (raw) => {
    const lines = raw.split("\n");
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      let frame;
      try {
        frame = JSON.parse(payload);
      } catch {
        continue;
      }
      if (frame.promptFeedback?.blockReason) {
        throw new Error(`Response blocked: ${frame.promptFeedback.blockReason}`);
      }
      const delta = frame.candidates?.flatMap((c) => c.content?.parts ?? []).map((p) => p.text ?? "").join("");
      if (delta) {
        fullText += delta;
        onDelta(delta);
      }
    }
  };
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let sep;
      while ((sep = buffer.indexOf("\n\n")) !== -1) {
        const eventChunk = buffer.slice(0, sep);
        buffer = buffer.slice(sep + 2);
        if (eventChunk.trim()) consumeEvent(eventChunk);
      }
    }
    if (buffer.trim()) consumeEvent(buffer);
  } finally {
    try {
      reader.releaseLock();
    } catch {
    }
  }
  const trimmed = fullText.trim();
  if (!trimmed) throw new Error("Empty response from Gemini.");
  return trimmed;
}

// assets/brand/claire-mark-white.webp
var claire_mark_white_default = "data:image/webp;base64,UklGRsIVAABXRUJQVlA4TLYVAAAvjUM4ELcnFkzmLx1C7/zPv5AghVhN6NEzPG7/v35p/383QkTCwtY3YtBgoogSKjYqQ0TBYYIYC3u9GbPW3d2bL2u6NtY9Y7705ey5tF242z+wwfN6vz9ut/vz+X567DCi/xNAl/x/yf+X/H/J/8GRcTkVC1fcNG1Qh4uCRr3FtR+d1eBin7xj7OO0i3tWs+/vhgV7NGzZPDJg8ykjTwd1ZCw/wMy8dWLjgMynjD0WvBH7PNdxTgBmKaMfDNZozXX/KuDShfHtgjMi2df/BVreN3AhOOM3n3hFYKU7m0wIxhjEwHYBlYVGngvGOIFYFFDZboSDMRh5MJASyUEmmRCOC6DEG2offDEBEx9ASTQ0LPhiMqZ9ACXJUEXwxRRMu4BRdZBImwBKvKGSIJF2AZQGhjoFX0wL9NAWMxR8WRnwqTHyYxBGRcCng5HRQRhlAR/6jwkKwizBJARU2huID8a4DNMxoEJVsNkUjFmM6RRYoWdBL1JQ5uhAEG2C3EnBmcWYjoEWmgnoSRfzUPQeHxZR0GYJJiHwQkSzj9eyroCCOANIQaKXYdpfZBT/b0ElmI4XGXX6t6BSTOK/GnW+eKcMk3jxTum/GpVhOl28U3oxVMeLjDr/W1AZppM71E8ZVn397Q89/eJLzz9535IrSns1C04J6zx8ysLlDz79wnMPr5g/oW8L5+jsAllLPmL42fWzOgeNxBS/dpKxx1+taqfSOCcZso5t/KQ86GPwy2x+x8w4J+ik2vwLbPHanIBH66yCwsIBOZ0DD21vZ3s/G6PKeMcYcZatfy87UFFv0mau+2tttWmaPfnmh15+94t9+7/9ZPOTy2cMau0QcU+z7acm6lGO6ahU43Xs0fVtnCEqPj7KEYZsYOTnanRY9CWjz7xc2sgBZrA3f8hXYhwmUaVB7OnRLtDvGP/jL5WC9XiRmfndXFN99zBcg06r2PzOyZGatd3GHp7nT01kz1+pXSOuczehhnAdqw2EPMwmf5Su5za29upwpbqcZ48/psBYN5jAIs5XbSj7OE+kZ7nOB1Ct97PhqZI1f57t/qNCoQ4s4dPilWCSlRnCYtbo1Z19HifQBvbxFOYLNi/XFezFFyJ0ifmRhbxduGJMqiqxZ1nSbKVCGCjPLezz84BFbGOcUPeyV//XRpHXWNAi0UZjUjS5h4XdrVMl4m1pmjAw0ZdGbOdwkZ5lL/+aoMQglvVIpGAjlYtlgWdotBPB0tyCWOtDJVt6jUCL2ev7IjX4nMWdpEyyGnNY5N/rqdOEofHCHEZw3d5kW1eIM4AlvE+8RJb4gFhFqh1jqSu16YoZI0sTNsX2LpfmSxYyU7ZrWOgsoUZgEnWIZ8GfUyYPUylLlqEGbPF8WQaxnA9JdpjFXipTkV5TWPQz/kZ/M+Fs83BRXmdRI6WKYcm/9SseZekba5KLmSRLgZH6bHWMIAksba5M3Vn4+v7DF2zxrx+vfeqeFbfe+dz7P1rFXRXpq8AAI2w3yTmD5Z0t0SgWv5M8IzBJ8u1hO9+o6RJNPka1yhz32HlLuFi5KbIUmthkV6kcL7HE98lTzVb/dfjztze//eGuE3ZxHx2SxdvOFq4Z2pDwUYk1H9rANWrkYqbJMsjANLabxNzLMq+R5gq29KNb8tpHhVGdo5LKnv/NFh4kzXCVPmPjD3Yl82FdHzLHC7TIx0yVpRDXie2OkyKUxX5TlkVs41OF0QSP6rrklBWcJcwwjb5hw/uH1iNbu282xVdpNk2W/rAQtvpAHAkZwtb+snPjo6uWLV31wKtf2MJbJFnA5pcmkfGW009awPVlGaLQBja7NpGsbrTKEBfrUICZKksubJVNO4aQmGzj1zf1bhsVRnVvnnPLXgt4mxxXs+m9o+qTnR1Wm1sryyB97mWjmxLI+oh5ZjhdrypZ+qB6sPnti4tzM5MTk+Ibkpxs/EBNHMGjBrxgjDdJMY4Nv5tJFte7whS3FGWgOpVs8kAqeTLydiPcVIN8TLUsWagdZl4amxpFEp83NbstGY4c/p4hfkyGNDa7K5EsD7vK0FJR+muTwSaHkmdbfmWCNchVoAdoGBu8MY2k3sVG9/YhK5tfb4bnSBDNZgvJg5EPGflalAJt2OAjoeTlKhPHFOiHma7BSdgnhWEk9rNs8mhfsjZmvhHOF+ArI7eQRxN+N3BCvlS5/jLQnzze2QAvkq8vpkaBGxm8phMJPodNFpHVkfeZ4DaeW8gmu5B3F+kwQJc7Gf5dLHl/M447+AFZGPDO7iT5EDa4IoRsT7tg4IDXMtjgunDychJsj7P1ZPjTJOIiHPtTw0n0eMafTyIvzsPxjd4KZ4OTyePhR0EPORvD55KQJbh3/KYHI0j2fbhbyaMZOE731IMGBpP3X8VkilKoyduwiSRmTxj312imRv1I+OsYPpg8G4s75qWBjM8hCW9BnCBH68rocSRoBxgLl42ZoVAbEj6N4cnk5YMoXuidKMZnk4xlgH6uxugxJGoC7GHZcjAzZeltRSOS/nNYG/L25yhu7Zk7cNkkZYFPy8nRbkBNJmHTUNxUtD4KZNvQgKQvYXQL8vp/Uc97pQvDc0nOHj7cTcIOwCSLxOA5JG4+6rRoOQrkWFCfxGd0PHkfxeke+QJ2OUkat7UuY8jV1oIeIoGngLi/ZH0VyDPXiMS/AdWbBAxFbfXGKEavImEzbzv3t7fG1CNxC7WIZezXJPIdIJasH6ZGllxjKSR+CwaXkogtQJzliV9QH5PAzRPaRZHEauwEhcpEn4N6C5arXxnJ/zzoRhJyOOg9L4xhNDm0FnGMzSSpQRcEy1cgz9BTJH8yYz8lMR/AcJoHjqBSnC9Jni2Y60js7hiOlysXM1OWXEOk4OsgEhT0uH0FDH6VAg71GXqKBH8K86HfkqlAPGMvk6QNhuOsewNF7pcszkpMvGSE4TCx8hTIM7KNFHwY8z2J+hzmWtsSGTw2AMHQxST6YMwcsXIV6GckVAPGxstCmF9tuwv0J/kBKdIUYEj4PyDscDkm7iAFqzGbSdj5EO5rVwiD2wcgDkAGSJeOaSdVX0y1LNkmSMNDmFBpCPOoXUNA75FjD8KkChPByAsk/jHI3VLlYKZp8bAGiQx9mMS9GcJ2vQAi1x6CSRPmGkg3+XpAWJWpWoRrcBeGBMaMsimSsW851zANGEoK/gGJ1WSKLH1w+0jDPyAbJHoF8phNY0HhzjVCgUaQ8RoMhCwQqg9mshLDNOjG0BYStYcct+kZzAHyD1JlmQ8hFSG/aDJJlmwcabgccoBEhnA7i/7C9HSvkQr8gXhMhxsRLFSOAr1gL6rwP8hEmZ6EVNjTjbHkJ6SLEsrIeB1aQToqMlGWLFiCBk0YSjKnQu61Zx7mnkDEcAgpeQGxSKZcBXrCSMNqyBahCPKZPRswTf2FVFE2ImZrMR2xx9W6oR5QYQ2kQqpvEOfsYSw5eJF8jGyhRSMEy5SvQBdUBxWOQyKkuhbBjWzpitnkYiPEqw8hNSGhjpaJIg0jGPkbSZ0GGWDL5ZhhgYh0xBt6PIlIFylXgS6gbSoMgKwXiyAzbLkFQ4GIyYgiPbIRVXpM0WCBCnMh0+X6FbHUltf8mxRJnkJE6hGKeEGPabJ0A6Wo8CQkRq6nEM/acgiyOSBxBEGKIo6LlK8WqbgHcuCjb7/ZuXvX7t279+zZu3ff/gMHDh89duz48R9++umnn44fP3r40IEDBw4ePHjo6OHDR44ePXL48OFDhw4dqPXggQP7/37wyPGffj15+vTp02fOnDl75vz5v/Yz8iNLQhi6KCDBwAOaHAOwP3FWB1b/F0taYHL8h1TZ7tDkYb+hO2aLCg31Y0tSMeQ/pMvWX5NRShRgqhW4TYUkB2hiR17ApBWiuSYJiAiJ+ivQFXO5Cv0cIN6OIv9hiHQ9EfU0iUDESzQQM12WLph0FS5zgBQ7KgMmIxGkKqK7GjNlycBEq1DtAJl2zIMcDUhMdY+BEvXHzFaAVLzeAbrYsRyy04/IFGSee5RLNECBLnqtdoBMOx6EfORmw6S7yT2qJBqoQHe97nKAVDuehbzjR2QIssQ9ZqhxpSxZet3vAO3sWAN5y81GYNIFuSlAlO3PkZ0bIe+42UjpFrrHdIkGKdBPr3v1W2fJOsh2Nxsl3Sz3qFJjtp9wh37DLXkKstPNijGZglS4x9QAyzL19pOlt0N+CUgUIkKUmyjRQAVy9FqkXoItN0A4IJGEaKTcBIkGKNBHr2rtEsnWWf5DiXQxiJ7KTZSoP2amLL30Gq3bMrK3xH8oxaQLQohr/Y8CBXrq1Rsz/voZs6ZPqSwfXzZmdFFR0Yhhw0aMGFE0auSokjFl48vLK8rLy8rGFI8qGjFixIiRxSWlpWXjy8snTKioKK8YP75sbGlJSUlxcXHxqL+PLi4pKR07fnx5RUVFxeUTJ06qrKycMGHChNJh8WRzD0xegORL5SZLlI+p8RPaQ34lB22BWeZkZQqxctUBlvoQrucghPnCf0iT5EdE5P+nEKabi7wPYScrxaRK8hyil27TJcrza3ZD5rjIYr9hDCZFkhLE3brNkChXgV6KPQPZ4CJjMFUuVoJJliQOwbrVuFmWYgsgv7tIF8wnLjYGkygJQSJVmylRHuYKf6EQwvUchDDsYpepVKbaLDWu8heiMTUu8iImx8GK5XsUsVe1GjWulqWHYnQM8oWLVGG+crBR8mUjOESzaonyMXNl6anZcxB2kQwMO9hI+UIgk/yMXMw8WbI0q8FMcBD6FTPLvUZgkkUhCGtWpcZ8WXpp1hazy0VWYti9himwFJLgX/TFLPAb6BCEQxykP6irf5Aqy/9BtvgXOZh5svRW7U7MXQ4SATrtXEMw6bIQhKP1qlZjrv9QiGEHoUcxnOxagzVYClnnV/TBzPEfCDTLQfqDzrhWoQYNIdxcrSqJsjGzZcnSbT2GHYTOYDjbH8gUhr6HHFJrmkS9MDP9iOGgaQ5yE4gDEH0gPFqrqWrU+BEEYgfpjKr2A7pKQxiOVGqiRH0U6KHcPaB57kEvg9gP6CbOtZitSlVK1BdTLUs35eJB7CDZqINONUQHwvA4ncolylWgq3L0EWite9BWEM9wqSIlHsJwvL+Qh6mSpZt2hSBOcY8+KG7uUKOVIBCHaDROogL/h3aD2D3oBRTLk3nju7s+fyBXojGYTIFuB232EwZipsnSXb0i1GaBGrTu2K6Rl5JgF4S5nGtfKM84TKpABOKFCpVLNAhT5V/QlyCuEiak/CD//ejlUZ6hO1G8T5KwY1znNtKUY5IlWgjiibJExMSEm5sQoMlFcQ9RSrmukz0TB+PNcjRmX1tpkCoRoXioIAP+y8y8LcfURDWqZemhH61FcXNBXuS6v+oVqoTxK1K0ZN+FKcVkiVSA4j5SxOzjWk90NjNVoiGYKn+jNYyjxXiHfb3VK7QbxhtlSGPgK7IUYQaLRGdRXCRDU65zoZHpEg3yi2gOjKOF2Mm+p3klGcdHJBjA0OaiFGDGyRQL43kSRLKPLU3MVmOa30FHYNxeBEau8Qpdg2OO8Nxkxq4WpQtmrkw0H8ZrvFf/L19O1XYBsFCNKll6OUE2jnt6rw1jo71CxwxwP489wOAdorTA3C8U4fjXBh5rxb63ruVnwHKJChXIcgK6DceTvDaJwXmeiTfBL3kp7ASjT4lCmP1SheCYB3lqMAPvrmUH4D8SDcBU+yH0E443e+s7Rpd4hsaaYO7smasYf04+bicUZRvg1z10ByO/qeVVwPcS5SvQwxEyDTAne+dWxo/1Dt1vhJ/zRns2+b0CJVLRSgPMZR5pfZah39eyHMAS5WJq/BGaa4If8kgpmxzhIfraCPNsD7zGRtfLcgTzhVi0wwRzhhduZvCOWsbq0FeB7q5A600wj/VANpvt7KUoQ8wzLFvChi+T5XkMDxaLzPC3SbYVMHxZLZmIrk7WwxnoRyPMeZal/clmd5KnW5livjvOmpDFbPp3krUSxK3EIjPM+zJs6s0G29USgdgoUA5mpp/SyBDzVeH2TGPjY71FCcaYfyiyImcHm88SJhrF6WKRIWaeHmHJKDZ5mmpHcJQSs2XJcgfqZIp5S1cr+u9m81vI6x3MMfPGroayt7ONc0haGD/bUCoyxvxh/3rG4u5gs8lmPlDiSn+F0owx8wvZZpotPsdWRniO2tvAzD/cnIlpWbqJLV1N4m6BMfOa8oYikTlm3jehiYHMx9n0k1THJxB8uzjZmDmy9HYJyrTg70+ObAwI63bla3+yrS1IwJZ2/OORtUsr+3Zs1rBx88455Ute2cMWP0bylphg5hMdJSIb/n549YBGPjUcs4YtPEJ1zYDwoVbC9MLMkyXbKSjJjn888fGL961ctmzVfU+/sZctjyURI+3x8M0ksSHmeRKRJbXv3brupRfXbDnA1lLdMcx7UkTpjlkgS45bUCt7vLubxDwhXRmJvM0UV0tEv1tl+1/k43sg5vcl6apAtmNQuHT3kaCbZEshmTsa47YS0XtiHSdf+8CYpZsrS5ZrEO0SbSiJOk+wPxuQ1OYeFIluEOot8t3AIeFmy9LVPeh+uX6uT8JmiPUIyT3c2B8yUReRriPglTjOkK1alnQHoQFSzSWBj8rUiyQ3xhkyEQnUk6AGHhSjJ2ayLJ1chMJPSHQqhkSuEWgtyd7eWIVUtEKY3wk8D8di9MJUyBLvJETXyzORpI48I00uSf+yqVliURtR7iK4gQai9ZOlhaNQtDCvk+TlotxOCpq6Ui6ixXKkEb4vLk6KBEyYLOQqRFME+a09CX+XGO9FkYqGpkpGEZ/IcDcZfQ7WXAraByFhtyDecgOip4W40JPkj/lKhI+bkJJNzQwTjajTL9472oYMw+LEGId4QpqrEcNdgVrsE+B4d9Kx427PrWtEesYaaS4cUcZ3Hssh46GoCDHoLCBEGkKQQ2Yc89jWeNKz6QueWk3KGniXFGz8sHcOdiUbwzF7SM4U34pI3ArfurkEUfstHroukpQtP+ORc6Wk7wOwLA2IaLo3nmtOtkL6CELpvowngWf7MoBcM/Rqb7yUShpHLfbArXGkcsfzmMWkZuIDtp0dTzav8W07iRq+tU7JJHJW3VqRi7a+x7bXupHebW+36aNpLUnvIecA95GqSastWhhHluf5FC4LUdtN//TFcBL75tqmkbO2XHLempUppH348LU2fHd9PGmf9rQvhaRuZNE6C94bHU5erKnTp+EkcFTL1vVI9uTKObMGR5Pj9lj+vanjN3cNIUeM6nb1+j9gO+4cGkuO2Pryx/77D3tWJ5PSDXNueB/23e09Q8i7ra/+5G/Hl7WjwHbLgtnPfuvb2R3r7izrFEnuGdE4rWDs9AWLV9959+3LF1SPHZDZMpICkaExSYMnL7rzmbVvvL3l3c2vPHRjZe84+v/V0Iio2CZNGsVGhdIl/1/y/yX/X/K/rA==";

// src/claire/voiceWorklets.ts
var MIC_WORKLET_SOURCE = `
class ClaireMicProcessor extends AudioWorkletProcessor {
    constructor(options) {
        super();
        const opts = (options && options.processorOptions) || {};
        // 1600 samples at 16 kHz = 100 ms. Smaller buffers raise mic-to-cloud
        // latency; larger buffers raise WebSocket framing overhead.
        this.bufferSize = opts.bufferSize || 1600;
        this.buffer = new Int16Array(this.bufferSize);
        this.index = 0;
    }
    process(inputs) {
        const input = inputs[0];
        if (!input || input.length === 0) return true;
        const channel = input[0];
        if (!channel) return true;
        for (let i = 0; i < channel.length; i++) {
            let s = channel[i];
            if (s > 1) s = 1; else if (s < -1) s = -1;
            this.buffer[this.index++] = s < 0 ? s * 0x8000 : s * 0x7fff;
            if (this.index >= this.bufferSize) {
                this.port.postMessage(this.buffer.slice(0, this.index));
                this.index = 0;
            }
        }
        return true;
    }
}
registerProcessor('claire-mic-processor', ClaireMicProcessor);
`;
var SPEAKER_WORKLET_SOURCE = `
class ClaireSpeakerProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.queue = [];
        this.current = null;
        this.idx = 0;
        this.port.onmessage = (event) => {
            const d = event.data;
            if (!d) return;
            if (d.type === 'audio' && d.samples) {
                this.queue.push(d.samples);
            } else if (d.type === 'clear') {
                this.queue = [];
                this.current = null;
                this.idx = 0;
            }
        };
    }
    process(_inputs, outputs) {
        const output = outputs[0];
        if (!output || output.length === 0) return true;
        const channel = output[0];
        for (let i = 0; i < channel.length; i++) {
            while (!this.current || this.idx >= this.current.length) {
                if (this.queue.length === 0) {
                    this.current = null;
                    break;
                }
                this.current = this.queue.shift();
                this.idx = 0;
            }
            channel[i] = this.current ? this.current[this.idx++] / 0x8000 : 0;
        }
        return true;
    }
}
registerProcessor('claire-speaker-processor', ClaireSpeakerProcessor);
`;

// src/claire/voiceCall.ts
var DEFAULT_WS_URL = "wss://res.zeroo.ch/res_api/claire/voice/ws";
var MIC_BUFFER_SIZE = 1600;
var MIC_SAMPLE_RATE = 16e3;
var SPEAKER_SAMPLE_RATE = 24e3;
function generateConversationId() {
  const c = typeof globalThis !== "undefined" ? globalThis.crypto : void 0;
  if (c && typeof c.randomUUID === "function") {
    return c.randomUUID();
  }
  return `cv_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}
async function registerWorklet(ctx, source) {
  const blob = new Blob([source], { type: "application/javascript" });
  const url = URL.createObjectURL(blob);
  try {
    await ctx.audioWorklet.addModule(url);
  } finally {
    URL.revokeObjectURL(url);
  }
}
async function startVoiceCall(options) {
  const conversationId = generateConversationId();
  const wsUrl = options.wsUrl || DEFAULT_WS_URL;
  if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
    throw new Error("Voice calls require a browser with mic support.");
  }
  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        sampleRate: MIC_SAMPLE_RATE,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });
  } catch {
    throw new Error("Microphone permission was denied or unavailable.");
  }
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) {
    stream.getTracks().forEach((t) => t.stop());
    throw new Error("Voice calls require AudioContext support.");
  }
  const micCtx = new AudioCtor({ sampleRate: MIC_SAMPLE_RATE });
  const playCtx = new AudioCtor({ sampleRate: SPEAKER_SAMPLE_RATE });
  try {
    await Promise.all([
      registerWorklet(micCtx, MIC_WORKLET_SOURCE),
      registerWorklet(playCtx, SPEAKER_WORKLET_SOURCE)
    ]);
  } catch (err) {
    stream.getTracks().forEach((t) => t.stop());
    await micCtx.close().catch(() => {
    });
    await playCtx.close().catch(() => {
    });
    throw new Error(
      err instanceof Error ? `Could not initialise audio worklets: ${err.message}` : "Could not initialise audio worklets."
    );
  }
  await Promise.all([
    micCtx.state === "suspended" ? micCtx.resume() : Promise.resolve(),
    playCtx.state === "suspended" ? playCtx.resume() : Promise.resolve()
  ]);
  const speakerNode = new AudioWorkletNode(playCtx, "claire-speaker-processor");
  speakerNode.connect(playCtx.destination);
  const micSource = micCtx.createMediaStreamSource(stream);
  const micNode = new AudioWorkletNode(micCtx, "claire-mic-processor", {
    processorOptions: { bufferSize: MIC_BUFFER_SIZE }
  });
  micSource.connect(micNode);
  const micSilentSink = micCtx.createGain();
  micSilentSink.gain.value = 0;
  micNode.connect(micSilentSink);
  micSilentSink.connect(micCtx.destination);
  let closed = false;
  let teardownPromise = null;
  const ws = new WebSocket(wsUrl);
  ws.binaryType = "arraybuffer";
  micNode.port.onmessage = (event) => {
    if (closed || ws.readyState !== WebSocket.OPEN) return;
    const samples = event.data;
    if (!samples || samples.length === 0) return;
    try {
      ws.send(samples.buffer);
    } catch {
    }
  };
  function teardown() {
    if (teardownPromise) return teardownPromise;
    teardownPromise = (async () => {
      closed = true;
      try {
        micNode.port.onmessage = null;
      } catch {
      }
      try {
        micNode.disconnect();
      } catch {
      }
      try {
        micSource.disconnect();
      } catch {
      }
      try {
        speakerNode.port.postMessage({ type: "clear" });
      } catch {
      }
      try {
        speakerNode.disconnect();
      } catch {
      }
      try {
        stream.getTracks().forEach((t) => t.stop());
      } catch {
      }
      try {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "end" }));
        }
      } catch {
      }
      try {
        ws.close();
      } catch {
      }
      await micCtx.close().catch(() => {
      });
      await playCtx.close().catch(() => {
      });
      options.onDisconnect?.();
    })();
    return teardownPromise;
  }
  ws.addEventListener("open", () => {
    try {
      ws.send(
        JSON.stringify({
          type: "setup",
          conversationId,
          appName: options.appName,
          language: (options.language || "de").toLowerCase(),
          address: options.address || "",
          parcelContext: options.parcelContext || "",
          ...options.model ? { model: options.model } : {}
        })
      );
      options.onDebug?.({ type: "setup_sent", conversationId });
    } catch {
      options.onError?.("Failed to send setup frame.");
      void teardown();
    }
  });
  ws.addEventListener("message", (event) => {
    if (closed) return;
    if (typeof event.data === "string") {
      let msg;
      try {
        msg = JSON.parse(event.data);
      } catch {
        return;
      }
      const type = msg.type;
      if (type === "connected") {
        options.onConnect?.({ conversationId });
      } else if (type === "mode") {
        const mode = msg.mode;
        if (mode === "listening" || mode === "speaking") {
          options.onModeChange?.({ mode });
        }
      } else if (type === "transcript") {
        const role = msg.role;
        const text = msg.text;
        if ((role === "user" || role === "agent") && typeof text === "string") {
          options.onMessage?.({ role, message: text });
        }
      } else if (type === "interrupted") {
        try {
          speakerNode.port.postMessage({ type: "clear" });
        } catch {
        }
        options.onInterrupted?.();
      } else if (type === "error") {
        options.onError?.(
          typeof msg.message === "string" ? msg.message : "Voice call error."
        );
        void teardown();
      } else if (type === "closed") {
        options.onDebug?.({ type: "closed", reason: msg.reason });
        void teardown();
      }
    } else if (event.data instanceof ArrayBuffer) {
      const samples = new Int16Array(event.data);
      try {
        speakerNode.port.postMessage({ type: "audio", samples });
      } catch {
      }
    }
  });
  ws.addEventListener("close", () => {
    if (!closed) void teardown();
  });
  ws.addEventListener("error", () => {
    if (!closed) {
      options.onError?.("Voice connection failed.");
      void teardown();
    }
  });
  return {
    conversationId,
    async endSession() {
      await teardown();
    }
  };
}

// src/signal/client.ts
var DEFAULT_ENDPOINT = "/api/signal-collect";
function createSignalClient(options) {
  const appName = options.appName.toLowerCase();
  const endpoint = options.endpoint ?? DEFAULT_ENDPOINT;
  return {
    async send(userAction, target) {
      try {
        await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            app_name: appName,
            user_action: userAction,
            // The suite convention sends the target coordinates as both the
            // user `lat`/`lng` and the `target_*` fields; the RES API
            // resolves the canonical parcel from `target_lat`/`target_lng`.
            lat: target?.lat,
            lng: target?.lng,
            target_address: target?.address,
            target_lat: target?.lat,
            target_lng: target?.lng,
            meta_data: target?.metaData
          })
        });
      } catch (err) {
        console.error("Signal collection error:", err);
      }
    }
  };
}

// src/claire/signal.ts
async function sendClaireMessageSignal({
  appName,
  lat,
  lng,
  address,
  source
}) {
  await createSignalClient({ appName }).send("Claire Assistant Message", {
    address,
    lat,
    lng,
    metaData: source ? { source } : void 0
  });
}

// src/claire/claireContext.ts
var IDENTIFY_API = "https://api3.geo.admin.ch/rest/services/api/MapServer/identify";
var GWR_LAYER = "ch.bfs.gebaeude_wohnungs_register";
var BAUZONEN_LAYER = "ch.are.bauzonen";
var PLZ_LAYER = "ch.swisstopo-vd.ortschaftenverzeichnis_plz";
var CADASTRE_LAYER = "ch.kantone.cadastralwebmap-farbe";
var GKAT = {
  "1010": "Provisional accommodation",
  "1020": "Residential building (residential use only)",
  "1030": "Residential building with secondary use",
  "1040": "Building with partial residential use",
  "1060": "Building without residential use",
  "1080": "Special structure"
};
var GKLAS = {
  "1110": "One-dwelling building",
  "1121": "Two-dwelling building",
  "1122": "Building with three or more dwellings",
  "1130": "Residential building for communities",
  "1211": "Hotel building",
  "1212": "Other short-stay accommodation building",
  "1220": "Office building",
  "1230": "Wholesale / retail building",
  "1231": "Restaurant / bar building",
  "1241": "Transport / communications building",
  "1242": "Garage building",
  "1251": "Industrial building",
  "1252": "Tank / silo / warehouse building",
  "1261": "Culture / leisure building",
  "1262": "Museum / library building",
  "1263": "School / university building",
  "1264": "Hospital building",
  "1265": "Sports hall",
  "1271": "Agricultural building",
  "1272": "Church / religious building",
  "1273": "Historic monument",
  "1274": "Other non-residential building",
  "1275": "Other building",
  "1276": "Protective structure"
};
var GSTAT = {
  "1001": "Planned",
  "1002": "Authorised",
  "1003": "Under construction",
  "1004": "Existing",
  "1005": "Not usable",
  "1007": "Demolished",
  "1008": "Not built"
};
var GBAUP = {
  "8011": "before 1919",
  "8012": "1919\u20131945",
  "8013": "1946\u20131960",
  "8014": "1961\u20131970",
  "8015": "1971\u20131980",
  "8016": "1981\u20131985",
  "8017": "1986\u20131990",
  "8018": "1991\u20131995",
  "8019": "1996\u20132000",
  "8020": "2001\u20132005",
  "8021": "2006\u20132010",
  "8022": "2011\u20132015",
  "8023": "2016\u20132020",
  "8024": "2021\u20132025",
  "8025": "2026\u20132030"
};
function str(v) {
  if (v === void 0 || v === null || v === "") return void 0;
  return String(v);
}
function num(v) {
  if (v === void 0 || v === null || v === "") return void 0;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : void 0;
}
function firstString(attrs, keys) {
  for (const k of keys) {
    const s = str(attrs[k]);
    if (s !== void 0) return s;
  }
  return void 0;
}
function gwrLines(p) {
  const lines = [];
  const add = (label, value) => {
    if (value !== void 0 && value !== "") lines.push(`- ${label}: ${value}`);
  };
  add("GWR building ID (EGID)", str(p.egid));
  add("Building address (GWR)", str(p.strname_deinr));
  const place = [str(p.dplz4) ?? str(p.plz_plz6), str(p.ggdename ?? p.dplzname)].filter(Boolean).join(" ");
  add("Municipality", [place, str(p.gdekt)].filter(Boolean).join(", ") || void 0);
  add("Official parcel ID (EGRID)", str(p.egrid));
  const year = num(p.gbauj);
  add("Construction year", year ?? (str(p.gbaup) && GBAUP[String(p.gbaup)]));
  add("Floors above ground", num(p.gastw));
  add("Dwellings", num(p.ganzwhg));
  add("Building footprint", num(p.garea) !== void 0 ? `${num(p.garea)} m\xB2` : void 0);
  add("Building volume", num(p.gvol) !== void 0 ? `${num(p.gvol)} m\xB3` : void 0);
  add(
    "Energy reference area",
    num(p.gebf) !== void 0 ? `${num(p.gebf)} m\xB2` : void 0
  );
  add("Building category", str(p.gkat) && GKAT[String(p.gkat)]);
  add("Building class", str(p.gklas) && GKLAS[String(p.gklas)]);
  add("Building status", str(p.gstat) && GSTAT[String(p.gstat)]);
  const rooms = Array.isArray(p.wazim) ? p.wazim.map(num).filter((n) => n !== void 0) : [];
  if (rooms.length > 0) {
    const min = Math.min(...rooms);
    const max = Math.max(...rooms);
    add("Dwelling sizes", min === max ? `${min} rooms` : `${min}\u2013${max} rooms`);
  }
  return lines;
}
async function fetchClaireContext(lng, lat, signal) {
  const delta = 12e-4;
  const params = new URLSearchParams({
    geometry: `${lng},${lat}`,
    geometryType: "esriGeometryPoint",
    geometryFormat: "geojson",
    imageDisplay: "1024,768,96",
    mapExtent: `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`,
    tolerance: "6",
    layers: `all:${GWR_LAYER},${BAUZONEN_LAYER},${PLZ_LAYER},${CADASTRE_LAYER}`,
    sr: "4326",
    returnGeometry: "false",
    lang: "en"
  });
  let results;
  try {
    const res = await fetch(`${IDENTIFY_API}?${params}`, { signal });
    if (!res.ok) return { text: "" };
    const data = await res.json();
    results = data.results ?? [];
  } catch {
    return { text: "" };
  }
  const sections = [];
  let address;
  let parcelId;
  let parcelNumber;
  const gwr = results.find((r) => r.layerBodId === GWR_LAYER);
  if (gwr) {
    const p = gwr.properties ?? gwr.attributes ?? {};
    const lines = gwrLines(p);
    if (lines.length > 0) {
      sections.push(`Federal Register of Buildings and Dwellings (GWR):
${lines.join("\n")}`);
    }
    const street = str(p.strname_deinr);
    if (street) {
      const city = str(p.ggdename) ?? str(p.dplzname);
      const zip = str(p.dplz4) ?? str(p.plz_plz6);
      const place = [zip, city].filter(Boolean).join(" ");
      address = place ? `${street}, ${place}` : street;
    }
  }
  const zone = results.find((r) => r.layerBodId === BAUZONEN_LAYER);
  const zoneName = zone ? firstString(zone.properties ?? zone.attributes ?? {}, [
    "ch_bez_d",
    "ch_bez_f"
  ]) : void 0;
  const plz = results.find((r) => r.layerBodId === PLZ_LAYER);
  const plzAttrs = plz ? plz.properties ?? plz.attributes ?? {} : {};
  const town = firstString(plzAttrs, ["ortbez27", "ortbez18", "ortschaftsname"]);
  const code = firstString(plzAttrs, ["plz", "postleitzahl"]);
  const misc = [];
  if (zoneName) misc.push(`- Harmonised building zone (ARE): ${zoneName}`);
  if (town || code) {
    misc.push(`- Locality: ${[code, town].filter(Boolean).join(" ")}`);
  }
  if (misc.length > 0) {
    sections.push(`Official zoning & locality (swisstopo / ARE):
${misc.join("\n")}`);
  }
  const cad = results.find((r) => r.layerBodId === CADASTRE_LAYER);
  if (cad) {
    const p = cad.properties ?? cad.attributes ?? {};
    parcelId = str(p.egris_egrid) ?? str(p.identnd) ?? void 0;
    parcelNumber = str(p.number) ?? void 0;
  }
  const text = sections.length === 0 ? "" : `Authoritative Swiss federal records for this location:

${sections.join("\n\n")}`;
  return { text, address, parcelId, parcelNumber };
}

// src/claire/claireScore.ts
var SCORE_CATEGORIES = [
  { name: "Transport", minPOIs: 2, perfectDistance: 100, radius: 1e3, penaltyFactor: 1, weight: 1 },
  { name: "Utilities", minPOIs: 2, perfectDistance: 100, radius: 1e3, penaltyFactor: 1, weight: 1 },
  { name: "Education", minPOIs: 1, perfectDistance: 200, radius: 5e3, penaltyFactor: 1, weight: 1 },
  { name: "Health", minPOIs: 2, perfectDistance: 200, radius: 1e3, penaltyFactor: 1, weight: 1 },
  { name: "Groceries", minPOIs: 3, perfectDistance: 50, radius: 1e3, penaltyFactor: 1, weight: 1 },
  { name: "Food_Dining", minPOIs: 3, perfectDistance: 50, radius: 1e3, penaltyFactor: 1, weight: 1 },
  { name: "Recreation", minPOIs: 2, perfectDistance: 200, radius: 2e3, penaltyFactor: 1, weight: 1 },
  { name: "Public_Services", minPOIs: 2, perfectDistance: 200, radius: 2e3, penaltyFactor: 1, weight: 1 },
  { name: "Community", minPOIs: 2, perfectDistance: 200, radius: 1e3, penaltyFactor: 1, weight: 1 },
  { name: "Outdoor", minPOIs: 2, perfectDistance: 300, radius: 5e3, penaltyFactor: 1, weight: 1 }
];
function poiScore(distance, perfectDistance, penaltyFactor) {
  if (distance <= 0) return 6;
  const score = 6 - penaltyFactor * Math.log2(distance / perfectDistance);
  return Math.max(0, Math.min(6, score));
}
function categoryScore(cat, distances) {
  const nearest = distances.filter((d) => d <= cat.radius).sort((a, b) => a - b).slice(0, cat.minPOIs).map((d) => poiScore(d, cat.perfectDistance, cat.penaltyFactor));
  while (nearest.length < cat.minPOIs) nearest.push(0);
  return nearest.reduce((acc, s) => acc + s, 0) / cat.minPOIs;
}
function computeLocationScore(categoryDistances) {
  const byCategory = {};
  let weightedSum = 0;
  let totalWeight = 0;
  for (const cat of SCORE_CATEGORIES) {
    const distances = categoryDistances[cat.name] ?? [];
    const score = distances.length > 0 ? categoryScore(cat, distances) : 0;
    byCategory[cat.name] = Math.round(score * 100) / 100;
    weightedSum += score * cat.weight;
    totalWeight += cat.weight;
  }
  const total = totalWeight > 0 ? Math.round(weightedSum / totalWeight * 100) / 100 : 0;
  return { total, byCategory };
}

// src/claire/clairePOIs.ts
var POI_ENDPOINT = "/api/claire-pois";
var TAG_CATEGORY = {
  "amenity=restaurant": "Food_Dining",
  "amenity=cafe": "Food_Dining",
  "amenity=bar": "Food_Dining",
  "amenity=pub": "Food_Dining",
  "amenity=biergarten": "Food_Dining",
  "amenity=fast_food": "Food_Dining",
  "amenity=ice_cream": "Food_Dining",
  "amenity=food_court": "Food_Dining",
  "shop=supermarket": "Groceries",
  "shop=convenience": "Groceries",
  "shop=bakery": "Groceries",
  "shop=butcher": "Groceries",
  "shop=greengrocer": "Groceries",
  "shop=deli": "Groceries",
  "shop=organic": "Groceries",
  "shop=beverages": "Groceries",
  "shop=cheese": "Groceries",
  "amenity=hospital": "Health",
  "amenity=clinic": "Health",
  "amenity=pharmacy": "Health",
  "amenity=doctors": "Health",
  "healthcare=doctor": "Health",
  "healthcare=dentist": "Health",
  "healthcare=clinic": "Health",
  "healthcare=hospital": "Health",
  "healthcare=pharmacy": "Health",
  "amenity=school": "Education",
  "amenity=kindergarten": "Education",
  "amenity=library": "Education",
  "amenity=university": "Education",
  "amenity=college": "Education",
  "amenity=childcare": "Education",
  "amenity=bus_station": "Transport",
  "highway=bus_stop": "Transport",
  "railway=station": "Transport",
  "railway=halt": "Transport",
  "railway=tram_stop": "Transport",
  "amenity=post_office": "Public_Services",
  "amenity=police": "Public_Services",
  "amenity=townhall": "Public_Services",
  "amenity=marketplace": "Public_Services",
  "amenity=bank": "Utilities",
  "amenity=atm": "Utilities",
  "amenity=money_exchange": "Utilities",
  "amenity=fuel": "Utilities",
  "amenity=charging_station": "Utilities",
  "amenity=cinema": "Recreation",
  "amenity=theatre": "Recreation",
  "amenity=arts_centre": "Recreation",
  "amenity=museum": "Recreation",
  "amenity=gallery": "Recreation",
  "leisure=sports_centre": "Recreation",
  "leisure=fitness_centre": "Recreation",
  "leisure=stadium": "Recreation",
  "leisure=park": "Outdoor",
  "leisure=playground": "Outdoor",
  "amenity=community_centre": "Community",
  "amenity=place_of_worship": "Community",
  "amenity=social_facility": "Community"
};
var CATEGORY_LABEL = {
  Transport: "Transport",
  Education: "Education",
  Groceries: "Groceries",
  Food_Dining: "Food & dining",
  Health: "Health",
  Public_Services: "Public services",
  Recreation: "Recreation",
  Outdoor: "Outdoors",
  Utilities: "Money & fuel",
  Community: "Community"
};
var CATEGORY_ORDER = [
  "Transport",
  "Education",
  "Groceries",
  "Food_Dining",
  "Health",
  "Public_Services",
  "Recreation",
  "Outdoor",
  "Utilities",
  "Community"
];
var CAP_PER_CATEGORY = 5;
function haversineMetres(lat1, lng1, lat2, lng2) {
  const R = 6371e3;
  const toRad = (x) => x * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
function coordsOf(el) {
  if (typeof el.lat === "number" && typeof el.lon === "number")
    return { lat: el.lat, lng: el.lon };
  if (el.center) return { lat: el.center.lat, lng: el.center.lon };
  return null;
}
function categoryOf(tags) {
  for (const [k, v] of Object.entries(tags)) {
    const cat = TAG_CATEGORY[`${k}=${v}`];
    if (cat) return cat;
  }
  return null;
}
function nameOf(tags) {
  if (tags.name) return tags.name;
  const primary = tags.amenity ?? tags.shop ?? tags.leisure ?? tags.railway ?? tags.highway ?? tags.healthcare;
  if (primary) {
    return primary.charAt(0).toUpperCase() + primary.slice(1).replace(/_/g, " ");
  }
  return "Unnamed";
}
function formatDistance(metres) {
  if (metres < 1e3) return `${Math.round(metres)} m`;
  if (metres < 1e4) return `${(metres / 1e3).toFixed(1)} km`;
  return `${Math.round(metres / 1e3)} km`;
}
async function fetchClairePOIs(lng, lat, signal) {
  let data;
  try {
    const res = await fetch(POI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat, lng }),
      signal
    });
    if (!res.ok) return { text: "", count: 0, score: null, points: [] };
    data = await res.json();
  } catch {
    return { text: "", count: 0, score: null, points: [] };
  }
  const elements = data.elements ?? [];
  if (elements.length === 0) return { text: "", count: 0, score: null, points: [] };
  const buckets = {};
  let total = 0;
  for (const el of elements) {
    if (!el.tags) continue;
    const c = coordsOf(el);
    if (!c) continue;
    const cat = categoryOf(el.tags);
    if (!cat) continue;
    const distance = haversineMetres(lat, lng, c.lat, c.lng);
    (buckets[cat] ?? (buckets[cat] = [])).push({
      id: `${el.type}:${el.id}`,
      name: nameOf(el.tags),
      lat: c.lat,
      lng: c.lng,
      distance,
      category: cat,
      categoryLabel: CATEGORY_LABEL[cat] ?? cat,
      tags: el.tags
    });
    total += 1;
  }
  if (total === 0) return { text: "", count: 0, score: null, points: [] };
  const distancesByCategory = {};
  for (const [cat, items] of Object.entries(buckets)) {
    distancesByCategory[cat] = items.map((i) => i.distance);
  }
  const score = computeLocationScore(distancesByCategory);
  const points = [];
  const perCategory = CATEGORY_ORDER.map(
    (cat) => `${CATEGORY_LABEL[cat]} ${score.byCategory[cat].toFixed(1)}`
  ).join(", ");
  const poiLines = [];
  for (const cat of CATEGORY_ORDER) {
    const items = buckets[cat];
    if (!items || items.length === 0) continue;
    items.sort((a, b) => a.distance - b.distance);
    const top = items.slice(0, CAP_PER_CATEGORY);
    points.push(...top);
    const list = top.map((p) => `${p.name} (${formatDistance(p.distance)})`).join(", ");
    const suffix = items.length > top.length ? `, +${items.length - top.length} more` : "";
    poiLines.push(
      `- ${CATEGORY_LABEL[cat]} (${items.length} within radius): ${list}${suffix}`
    );
  }
  const text = `Surrounding location & amenities (OpenStreetMap):
Location-accessibility score (scoore walkability model, 0\u20136 where 6 means key amenities are at the doorstep): ${score.total.toFixed(1)} / 6.
Per category (0\u20136): ${perCategory}.
Nearest points of interest:
${poiLines.join("\n")}`;
  return { text, count: total, score, points };
}

// src/claire/claireConversation.ts
var CLAIRE_API_BASE = "https://res.zeroo.ch/res_api/claire";
async function loadClaireConversation(parcelId, accessToken) {
  if (!accessToken || !parcelId) return [];
  try {
    const url = `${CLAIRE_API_BASE}/conversation?parcel_id=${encodeURIComponent(
      parcelId
    )}`;
    const res = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return sanitizeTurns(data?.messages);
  } catch {
    return [];
  }
}
async function saveClaireConversation({
  parcelId,
  messages,
  accessToken,
  appName,
  address,
  lat,
  lng
}) {
  if (!accessToken || !parcelId) return;
  try {
    await fetch(`${CLAIRE_API_BASE}/conversation`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        parcel_id: parcelId,
        app_name: appName,
        messages: messages.map(({ role, content }) => ({ role, content })),
        target_address: address,
        target_lat: lat,
        target_lng: lng
      })
    });
  } catch {
  }
}
async function listClaireConversations(accessToken) {
  if (!accessToken) return [];
  try {
    const res = await fetch(`${CLAIRE_API_BASE}/conversations`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return sanitizeSummaries(data);
  } catch {
    return [];
  }
}
function sanitizeSummaries(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const r = row;
    if (typeof r.parcel_id !== "string" || !r.parcel_id) continue;
    out.push({
      parcel_id: r.parcel_id,
      app_name: typeof r.app_name === "string" ? r.app_name : null,
      target_address: typeof r.target_address === "string" ? r.target_address : null,
      target_lat: typeof r.target_lat === "number" ? r.target_lat : r.target_lat != null && !Number.isNaN(Number(r.target_lat)) ? Number(r.target_lat) : null,
      target_lng: typeof r.target_lng === "number" ? r.target_lng : r.target_lng != null && !Number.isNaN(Number(r.target_lng)) ? Number(r.target_lng) : null,
      message_count: Number(r.message_count) || 0,
      created_at: typeof r.created_at === "string" ? r.created_at : "",
      updated_at: typeof r.updated_at === "string" ? r.updated_at : ""
    });
  }
  return out;
}
function sanitizeTurns(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (t) => !!t && typeof t === "object" && (t.role === "user" || t.role === "assistant") && typeof t.content === "string"
  ).map(({ role, content }) => ({ role, content }));
}
var CLAIRE_SVG = `<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <style>
    .open-eyes { animation: openBlink 2.2s infinite; transform-origin: center; }
    .closed-eyes { animation: closedBlink 2.2s infinite; opacity: 0; }
    @keyframes openBlink { 0%, 78%, 100% { opacity: 1; } 82%, 88% { opacity: 0; } }
    @keyframes closedBlink { 0%, 78%, 100% { opacity: 0; } 82%, 88% { opacity: 1; } }
  </style>
  <path d="M91 98 C84 105 74 109 63 109 C38 109 18 89 18 64 C18 39 38 19 63 19 C88 19 108 39 108 64 L108 93 C108 102 112 107 118 108" fill="none" stroke="#141414" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"></path>
  <g class="open-eyes" fill="#141414">
    <circle cx="51" cy="58" r="4"></circle>
    <circle cx="77" cy="58" r="4"></circle>
  </g>
  <g class="closed-eyes" fill="none" stroke="#141414" stroke-width="4" stroke-linecap="round">
    <path d="M46 58 Q51 62 56 58"></path>
    <path d="M72 58 Q77 62 82 58"></path>
  </g>
  <path d="M56 75 Q64 82 72 75" fill="none" stroke="#141414" stroke-width="4" stroke-linecap="round"></path>
</svg>`;
var CLAIRE_AVATAR = `data:image/svg+xml,${encodeURIComponent(CLAIRE_SVG)}`;
var QUICK_PROMPTS = [
  {
    label: "Investment potential",
    prompt: "What is the estimated investment potential of this parcel?"
  },
  {
    label: "Zoning restrictions",
    prompt: "Summarize zoning restrictions for this property."
  },
  {
    label: "What can be built?",
    prompt: "What can legally be built here?"
  },
  {
    label: "Compare nearby",
    prompt: "Compare this parcel with nearby properties."
  },
  {
    label: "Risks to know",
    prompt: "What risks should I know about?"
  },
  {
    label: "Redevelopment",
    prompt: "Estimate redevelopment opportunities."
  },
  {
    label: "Market insights",
    prompt: "Show market insights for this area."
  }
];
function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
function resolveParcelId(props) {
  for (const key of ["parcel_id", "egrid", "id_parcel", "id"]) {
    const v = props[key];
    if (v !== void 0 && v !== null && v !== "") return String(v);
  }
  return null;
}
var HEADING_RE = /^(#{1,6})\s+(.+?)\s*#*\s*$/;
function headingClass(level, first) {
  const size = level <= 1 ? "text-[14.5px]" : level === 2 ? "text-[13.5px]" : "text-[13px]";
  return `${first ? "" : "mt-3"} mb-0.5 font-semibold tracking-tight ${size}`;
}
function renderAssistantText(text) {
  const blocks = [];
  let para = [];
  const flushPara = () => {
    if (para.length === 0) return;
    const lines = para;
    para = [];
    blocks.push(
      /* @__PURE__ */ jsx("p", { className: blocks.length === 0 ? "" : "mt-2", children: lines.map((line, li) => /* @__PURE__ */ jsxs("span", { children: [
        renderInlineBold(line),
        li < lines.length - 1 ? /* @__PURE__ */ jsx("br", {}) : null
      ] }, li)) }, `p-${blocks.length}`)
    );
  };
  for (const raw of text.split(/\n/)) {
    const line = raw.replace(/\s+$/, "");
    const heading = HEADING_RE.exec(line);
    if (heading) {
      flushPara();
      blocks.push(
        /* @__PURE__ */ jsx(
          "p",
          {
            className: headingClass(heading[1].length, blocks.length === 0),
            children: renderInlineBold(heading[2])
          },
          `h-${blocks.length}`
        )
      );
    } else if (line.trim() === "") {
      flushPara();
    } else {
      para.push(line);
    }
  }
  flushPara();
  return blocks;
}
function renderInlineBold(line) {
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (/^\*\*[^*]+\*\*$/.test(p)) {
      return /* @__PURE__ */ jsx("strong", { className: "font-semibold", children: p.slice(2, -2) }, i);
    }
    return /* @__PURE__ */ jsx("span", { children: p }, i);
  });
}
function ClaireMsgAvatar({ darkMode, pulse = false }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${darkMode ? "bg-gradient-to-br from-amber-400/25 to-rose-500/15 ring-1 ring-amber-300/20" : "bg-gradient-to-br from-amber-100 to-rose-100 ring-1 ring-amber-200/70"}`,
      children: /* @__PURE__ */ jsx(
        "img",
        {
          src: CLAIRE_AVATAR,
          alt: "",
          className: `w-full h-full rounded-lg object-cover${pulse ? " animate-pulse" : ""}`
        }
      )
    }
  );
}
var ClaireAssistant = ({
  appName,
  geminiApiKey,
  geminiModel,
  voiceCallEnabled = false,
  properties,
  enrichment,
  lngLat,
  lv95,
  headerAddress
}) => {
  const darkMode = true;
  const claireMark = claire_mark_white_default ;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [contextLoading, setContextLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);
  const [callStatus, setCallStatus] = useState("idle");
  const [callMode, setCallMode] = useState(null);
  const [callError, setCallError] = useState(null);
  const [voiceTurns, setVoiceTurns] = useState([]);
  const voiceTranscriptRef = useRef(null);
  const conversationRef = useRef(null);
  const { isAuthenticated, getAccessToken } = useAuth();
  const configured = useMemo(() => Boolean(geminiApiKey), [geminiApiKey]);
  const propsParcelId = useMemo(() => resolveParcelId(properties), [properties]);
  const parcelContext = useMemo(
    () => buildParcelContextSummary({
      properties,
      enrichment: enrichment ?? null,
      lngLat,
      lv95: lv95 ?? null
    }),
    [properties, enrichment, lngLat, lv95]
  );
  const [official, setOfficial] = useState({
    text: ""
  });
  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    setOfficial({ text: "" });
    setContextLoading(true);
    void fetchClaireContext(lngLat.lng, lngLat.lat, controller.signal).then((res) => {
      if (!cancelled) setOfficial(res);
    }).catch(() => {
    }).finally(() => {
      if (!cancelled) setContextLoading(false);
    });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [lngLat.lng, lngLat.lat]);
  const parcelId = propsParcelId ?? official.parcelId ?? null;
  const [pois, setPois] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    setPois("");
    void fetchClairePOIs(lngLat.lng, lngLat.lat, controller.signal).then((res) => setPois(res.text)).catch(() => {
    });
    return () => controller.abort();
  }, [lngLat.lng, lngLat.lat]);
  const fullContext = useMemo(
    () => [parcelContext, official.text, pois].filter(Boolean).join("\n\n"),
    [parcelContext, official.text, pois]
  );
  const endCall = useCallback(async () => {
    const conv = conversationRef.current;
    conversationRef.current = null;
    if (!conv) {
      setCallStatus("idle");
      setCallMode(null);
      return;
    }
    setCallStatus("ending");
    try {
      await conv.endSession();
    } catch {
    }
    setCallStatus("idle");
    setCallMode(null);
    setVoiceTurns([]);
  }, []);
  useEffect(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    void endCall();
    setMessages([]);
    setInput("");
    setError(null);
    setCallError(null);
    setLoading(false);
  }, [lngLat.lng, lngLat.lat, endCall]);
  useEffect(() => {
    if (!parcelId || !isAuthenticated) return;
    const token = getAccessToken();
    if (!token) return;
    let cancelled = false;
    setHistoryLoading(true);
    void loadClaireConversation(parcelId, token).then((turns) => {
      if (cancelled || turns.length === 0) return;
      setMessages(
        turns.map((t) => ({ id: newId(), role: t.role, content: t.content }))
      );
    }).finally(() => {
      if (!cancelled) setHistoryLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [parcelId, isAuthenticated, getAccessToken]);
  useEffect(() => {
    if (!open || !scrollRef.current) return;
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages, loading, open]);
  useEffect(() => {
    if (voiceTranscriptRef.current) {
      voiceTranscriptRef.current.scrollTop = voiceTranscriptRef.current.scrollHeight;
    }
  }, [voiceTurns]);
  useEffect(
    () => () => {
      abortRef.current?.abort();
      void endCall();
    },
    [endCall]
  );
  const startCall = useCallback(async () => {
    if (callStatus !== "idle") return;
    setCallError(null);
    setCallStatus("connecting");
    try {
      const language = typeof document !== "undefined" && document.documentElement.lang || "de";
      const conv = await startVoiceCall({
        appName,
        parcelContext: fullContext,
        address: headerAddress || official.address,
        language,
        model: "gemini-3.1-flash-live-preview",
        onConnect: () => {
          setCallStatus("connected");
        },
        onDisconnect: () => {
          conversationRef.current = null;
          setCallStatus("idle");
          setCallMode(null);
        },
        onModeChange: ({ mode }) => {
          if (mode === "listening" || mode === "speaking") {
            setCallMode(mode);
          }
        },
        onMessage: ({ message, role }) => {
          if (!message) return;
          setVoiceTurns((prev) => {
            const last = prev[prev.length - 1];
            if (last && last.role === role) {
              const joinNeedsSpace = !/\s$/.test(last.text) && !/^[\s.,;:!?)\]}»"']/.test(message);
              return [
                ...prev.slice(0, -1),
                {
                  ...last,
                  text: last.text + (joinNeedsSpace ? " " : "") + message
                }
              ];
            }
            return [...prev, { id: newId(), role, text: message }];
          });
        },
        onDebug: (info) => {
          console.log("[claire-voice]", info);
        },
        onError: (message) => {
          setCallError(message || "Voice call failed.");
          conversationRef.current = null;
          setCallStatus("idle");
          setCallMode(null);
        }
      });
      conversationRef.current = conv;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not start the call.";
      setCallError(msg);
      setCallStatus("idle");
      setCallMode(null);
    }
  }, [callStatus, fullContext, appName, headerAddress, official.address]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 220);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(focusTimer);
    };
  }, [open]);
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
  }, [input, open]);
  const sendMessage = useCallback(
    async (text, source = "composer") => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;
      if (!configured) {
        setError(
          "Gemini API key missing. Set VITE_GEMINI_API_KEY in the app\u2019s .env file."
        );
        return;
      }
      const userMsg = {
        id: newId(),
        role: "user",
        content: trimmed
      };
      const nextHistory = [
        ...messages.map(({ role, content }) => ({ role, content })),
        { role: "user", content: trimmed }
      ];
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setError(null);
      setLoading(true);
      const address = headerAddress || official.address;
      void sendClaireMessageSignal({
        appName,
        lat: lngLat.lat,
        lng: lngLat.lng,
        address,
        source
      });
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const reply = await generateParcelChatReply({
          apiKey: geminiApiKey ?? "",
          model: geminiModel,
          appName,
          parcelContext: fullContext,
          history: nextHistory,
          signal: controller.signal
        });
        const assistantId = newId();
        setMessages((prev) => [
          ...prev,
          { id: assistantId, role: "assistant", content: reply }
        ]);
        if (parcelId) {
          void saveClaireConversation({
            parcelId,
            messages: [...nextHistory, { role: "assistant", content: reply }],
            accessToken: getAccessToken(),
            appName,
            address,
            lat: lngLat.lat,
            lng: lngLat.lng
          });
        }
      } catch (err) {
        if (err?.name === "AbortError") return;
        const message = err instanceof GeminiConfigError ? err.message : err instanceof Error ? err.message : "Something went wrong.";
        setError(message);
      } finally {
        setLoading(false);
        abortRef.current = null;
      }
    },
    [
      configured,
      loading,
      messages,
      fullContext,
      lngLat.lat,
      lngLat.lng,
      parcelId,
      headerAddress,
      official.address,
      getAccessToken,
      appName,
      geminiApiKey,
      geminiModel
    ]
  );
  const onSubmit = (e) => {
    e.preventDefault();
    void sendMessage(input);
  };
  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  };
  const onQuickPrompt = (prompt) => {
    void sendMessage(prompt, "quick_prompt");
    inputRef.current?.focus();
  };
  const sendDisabled = !input.trim() || loading;
  const showQuickPrompts = messages.length === 0 && !loading && !historyLoading;
  const displayAddress = headerAddress || official.address;
  const subtitle = contextLoading ? "Syncing parcel\u2026" : null;
  const launcherPos = "right-6 bottom-6";
  const cardPos = "inset-x-3 top-20 bottom-3 md:inset-x-auto md:top-auto md:bottom-6 md:right-6 md:left-auto md:w-[23rem] md:h-auto md:max-h-[min(78vh,560px)]";
  const launcher = /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      onClick: () => setOpen(true),
      "aria-label": "Open Claire, the AI parcel assistant",
      title: "Ask Claire about this parcel",
      className: `fixed z-[60] ${launcherPos} group flex items-center justify-center w-14 h-14 rounded-full transition-all duration-200 active:scale-95 ${"bg-gradient-to-br from-amber-400 to-orange-500 text-[#1a0f00] shadow-[0_10px_30px_-8px_rgba(251,191,36,0.55)] hover:brightness-110" }`,
      children: [
        /* @__PURE__ */ jsx("span", { className: "absolute inset-0 rounded-full bg-amber-400/50 chat-launch-ping" }),
        /* @__PURE__ */ jsx(
          "img",
          {
            src: CLAIRE_AVATAR,
            alt: "",
            className: "relative w-full h-full rounded-full object-cover"
          }
        )
      ]
    }
  );
  const card = /* @__PURE__ */ jsxs(
    "div",
    {
      role: "dialog",
      "aria-label": "Claire \u2014 AI Parcel Assistant",
      className: `fixed z-[60] ${cardPos} chat-card-pop flex flex-col overflow-hidden rounded-2xl ${"bg-[#0b0f15] ring-1 ring-white/[0.08] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.85)]" }`,
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `relative flex items-center justify-end gap-2 px-3.5 py-3 min-h-[3.75rem] shrink-0 ${"bg-gradient-to-b from-white/[0.04] to-transparent border-b border-white/[0.06]" }`,
            children: [
              /* @__PURE__ */ jsxs("div", { className: "pointer-events-none absolute left-3.5 top-2.5 flex flex-col items-start", children: [
                /* @__PURE__ */ jsxs("div", { className: "relative inline-flex items-center", children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: claireMark,
                      alt: "Claire",
                      className: "h-auto w-[clamp(5rem,28vw,7rem)] object-contain"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: `absolute -bottom-0.5 -right-1 w-2 h-2 rounded-full ring-2 ${contextLoading ? "bg-amber-400 ring-[#0b0f15] animate-pulse"  : "bg-emerald-400 ring-[#0b0f15]" }`
                    }
                  )
                ] }),
                subtitle && /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: `mt-0.5 flex w-[clamp(6rem,36vw,8.5rem)] items-center justify-start gap-1 text-[10.5px] font-medium uppercase tracking-[0.1em] ${"text-amber-200/70" }`,
                    children: [
                      /* @__PURE__ */ jsx(Loader2, { size: 9, className: "animate-spin shrink-0" }),
                      /* @__PURE__ */ jsx("span", { className: "truncate", children: subtitle })
                    ]
                  }
                )
              ] }),
              appName !== "doorway" && /* @__PURE__ */ jsx(
                "a",
                {
                  href: `https://doorway.aireon.ch/?lat=${lngLat.lat}&lng=${lngLat.lng}`,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  "aria-label": "Open this address in doorway studio",
                  title: "Open in doorway studio \u2014 chat with Claire using picked data sources",
                  className: "inline-flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-colors text-amber-200/80 ring-1 ring-amber-300/25 hover:text-amber-100 hover:bg-amber-400/10 hover:ring-amber-300/40",
                  children: /* @__PURE__ */ jsx(SquareCode, { size: 15 })
                }
              ),
              voiceCallEnabled && /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => callStatus === "idle" ? void startCall() : void endCall(),
                  disabled: callStatus === "connecting" || callStatus === "ending",
                  "aria-label": callStatus === "idle" ? "Call Claire" : "End call",
                  title: callStatus === "idle" ? "Have a spoken conversation with Claire" : "End the call",
                  className: `w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${callStatus === "idle" ? "text-gray-400 hover:text-emerald-300 hover:bg-emerald-400/10" : "text-rose-200 bg-rose-500/15 ring-1 ring-rose-400/30 hover:bg-rose-500/25 disabled:opacity-60"}`,
                  children: callStatus === "idle" ? /* @__PURE__ */ jsx(AudioLines, { size: 15 }) : /* @__PURE__ */ jsx(PhoneOff, { size: 15 })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setOpen(false),
                  "aria-label": "Close Claire",
                  className: `w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${"text-gray-400 hover:text-white hover:bg-white/[0.08]" }`,
                  children: /* @__PURE__ */ jsx(X, { size: 16 })
                }
              )
            ]
          }
        ),
        (displayAddress || parcelId || contextLoading) && /* @__PURE__ */ jsx(
          "div",
          {
            className: `shrink-0 px-3.5 py-2 ${"border-b border-white/[0.06] bg-white/[0.015]" }`,
            children: contextLoading && !displayAddress && !parcelId ? /* @__PURE__ */ jsx("div", { className: `text-[11px] animate-pulse ${"text-gray-600" }`, children: "Loading location\u2026" }) : /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-1.5", children: [
              /* @__PURE__ */ jsx(
                MapPin,
                {
                  size: 11,
                  className: `shrink-0 mt-0.5 ${"text-amber-400/70" }`
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                displayAddress && /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `text-[11.5px] leading-snug font-medium break-words ${"text-gray-200" }`,
                    children: displayAddress
                  }
                ),
                parcelId && /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `text-[10px] font-mono mt-0.5 ${"text-gray-500" }`,
                    children: parcelId
                  }
                )
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            ref: scrollRef,
            className: "chat-scroll flex-1 md:flex-none md:max-h-[340px] overflow-y-auto px-3.5 py-3 space-y-2",
            "aria-live": "polite",
            children: [
              messages.length === 0 && historyLoading && /* @__PURE__ */ jsxs(
                "div",
                {
                  className: `flex items-center gap-2 rounded-xl px-3 py-2.5 text-[12px] ${"bg-white/[0.025] text-gray-400 ring-1 ring-white/[0.04]" }`,
                  children: [
                    /* @__PURE__ */ jsx(Loader2, { size: 13, className: "animate-spin shrink-0" }),
                    "Restoring your conversation about this parcel\u2026"
                  ]
                }
              ),
              messages.length === 0 && !historyLoading && /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsx(ClaireMsgAvatar, { darkMode }),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `max-w-[88%] rounded-2xl rounded-tl-md px-3 py-2 text-[12.5px] leading-relaxed ${"bg-white/[0.04] text-gray-100 ring-1 ring-white/[0.05]" }`,
                    children: "Hi, I'm Claire. Ask me anything about this parcel."
                  }
                )
              ] }),
              messages.map(
                (msg) => msg.role === "user" ? /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `max-w-[88%] rounded-2xl rounded-tr-md px-3 py-2 text-[12.5px] leading-relaxed whitespace-pre-wrap ${"bg-amber-400/15 text-amber-50 ring-1 ring-amber-300/20" }`,
                    children: msg.content
                  }
                ) }, msg.id) : /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsx(ClaireMsgAvatar, { darkMode }),
                  /* @__PURE__ */ jsx("div", { className: "flex flex-col items-start gap-1 max-w-[88%]", children: /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: `rounded-2xl rounded-tl-md px-3 py-2 text-[12.5px] leading-relaxed ${"bg-white/[0.04] text-gray-100 ring-1 ring-white/[0.05]" }`,
                      children: renderAssistantText(msg.content)
                    }
                  ) })
                ] }, msg.id)
              ),
              loading && /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsx(ClaireMsgAvatar, { darkMode, pulse: true }),
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: `rounded-2xl rounded-tl-md px-3 py-2.5 flex items-center gap-1.5 ${"bg-white/[0.04] ring-1 ring-white/[0.05]" }`,
                    "aria-label": "Claire is typing",
                    children: [
                      /* @__PURE__ */ jsx("span", { className: "chat-dot" }),
                      /* @__PURE__ */ jsx("span", { className: "chat-dot", style: { animationDelay: "0.15s" } }),
                      /* @__PURE__ */ jsx("span", { className: "chat-dot", style: { animationDelay: "0.3s" } })
                    ]
                  }
                )
              ] }),
              error && /* @__PURE__ */ jsxs(
                "div",
                {
                  className: `flex items-start gap-2 rounded-xl px-3 py-2 text-[12px] ${"bg-rose-500/10 text-rose-200 ring-1 ring-rose-400/20" }`,
                  children: [
                    /* @__PURE__ */ jsx(AlertCircle, { size: 13, className: "shrink-0 mt-0.5" }),
                    /* @__PURE__ */ jsx("span", { children: error })
                  ]
                }
              ),
              callError && callStatus === "idle" && /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 rounded-xl px-3 py-2 text-[11.5px] bg-rose-500/10 text-rose-200/90 ring-1 ring-rose-400/20", children: [
                /* @__PURE__ */ jsx(PhoneOff, { size: 12, className: "shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "Voice call ended: ",
                  callError
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `shrink-0 px-3.5 pt-2.5 pb-3 ${"border-t border-white/[0.06] bg-gradient-to-t from-white/[0.025] to-transparent" }`,
            children: [
              showQuickPrompts && /* @__PURE__ */ jsx("div", { className: "mb-2.5 flex flex-wrap gap-1.5", children: QUICK_PROMPTS.map((q) => /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => onQuickPrompt(q.prompt),
                  title: q.prompt,
                  className: `text-[11px] font-medium px-2.5 py-1 rounded-full transition-all duration-150 ${"bg-white/[0.04] text-gray-200 ring-1 ring-white/[0.06] hover:bg-amber-400/10 hover:text-amber-200 hover:ring-amber-300/30" }`,
                  children: q.label
                },
                q.label
              )) }),
              /* @__PURE__ */ jsxs("form", { onSubmit, children: [
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: `flex items-end gap-1.5 rounded-xl px-2.5 py-1.5 transition-all duration-150 focus-within:ring-2 ${"bg-white/[0.04] ring-1 ring-white/[0.06] focus-within:ring-amber-400/40" }`,
                    children: [
                      /* @__PURE__ */ jsx(
                        "textarea",
                        {
                          ref: inputRef,
                          value: input,
                          onChange: (e) => setInput(e.target.value),
                          onKeyDown,
                          placeholder: "Ask Claire about this parcel...",
                          rows: 1,
                          className: `flex-1 resize-none bg-transparent outline-none text-[12.5px] leading-snug min-h-8 py-2 max-h-24 overflow-y-auto ${"text-gray-100 placeholder:text-gray-500" }`
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "submit",
                          disabled: sendDisabled,
                          "aria-label": "Send message",
                          className: `w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-150 ${sendDisabled ? "bg-white/[0.04] text-gray-600 cursor-not-allowed"  : "bg-gradient-to-br from-amber-400 to-orange-500 text-white hover:brightness-105 shadow-[0_4px_12px_-4px_rgba(251,191,36,0.5)]"}`,
                          children: loading ? /* @__PURE__ */ jsx(Loader2, { size: 14, className: "animate-spin" }) : /* @__PURE__ */ jsx(Send, { size: 13 })
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `mt-1.5 text-[10px] tracking-wide ${"text-gray-500" }`,
                    children: "Enter to send \xB7 Shift+Enter for newline"
                  }
                )
              ] })
            ]
          }
        ),
        callStatus !== "idle" && (() => {
          const visualMode = callStatus === "connected" && callMode === "listening" ? "listening" : "speaking";
          const statusLabel = callStatus === "connecting" ? "Calling Claire\u2026" : callStatus === "ending" ? "Ending call\u2026" : visualMode === "speaking" ? "Claire is speaking" : "Listening to you";
          const subtitle2 = callStatus === "connecting" ? "Connecting\u2026" : callStatus === "ending" ? " " : visualMode === "speaking" ? "Live voice call" : "Speak naturally \u2014 Claire is listening";
          return /* @__PURE__ */ jsxs("div", { className: "absolute inset-x-0 bottom-0 top-[58px] flex flex-col items-center justify-start px-4 pt-5 pb-4 bg-gradient-to-b from-[#0b0f15]/95 via-[#0b0f15]/95 to-[#0b0f15]/95 backdrop-blur-md", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative w-44 h-44 flex items-center justify-center shrink-0", children: [
              visualMode === "speaking" && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("span", { className: "claire-ripple claire-ripple-1" }),
                /* @__PURE__ */ jsx("span", { className: "claire-ripple claire-ripple-2" }),
                /* @__PURE__ */ jsx("span", { className: "claire-ripple claire-ripple-3" })
              ] }),
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: visualMode === "speaking" ? "claire-halo claire-halo-speaking" : "claire-halo claire-halo-listening"
                }
              ),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "relative w-24 h-24 rounded-full flex items-center justify-center ring-1 transition-shadow duration-500 " + (visualMode === "speaking" ? "bg-gradient-to-br from-amber-300/35 via-orange-400/25 to-rose-500/20 ring-amber-200/50 shadow-[0_0_48px_-4px_rgba(251,191,36,0.55)] claire-core-speaking" : "bg-gradient-to-br from-amber-300/15 via-amber-400/10 to-rose-500/10 ring-amber-300/25 shadow-[0_0_24px_-6px_rgba(251,191,36,0.3)] claire-core-listening"),
                  children: [
                    /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: CLAIRE_AVATAR,
                        alt: "",
                        className: "w-[88%] h-[88%] rounded-full object-cover"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: "absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-[#0b0f15] " + (visualMode === "speaking" ? "bg-amber-300 claire-dot-speaking" : "bg-emerald-400")
                      }
                    )
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-3 text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "text-[15px] font-semibold text-white tracking-tight transition-opacity duration-300", children: statusLabel }),
              /* @__PURE__ */ jsx("div", { className: "mt-1 text-[10.5px] font-medium uppercase tracking-[0.14em] text-amber-200/70 min-h-[14px]", children: subtitle2 })
            ] }),
            voiceTurns.length > 0 && /* @__PURE__ */ jsx(
              "div",
              {
                ref: voiceTranscriptRef,
                className: "chat-scroll mt-3 w-full max-w-[22rem] max-h-[9rem] overflow-y-auto px-3 py-2 rounded-xl bg-white/[0.035] ring-1 ring-white/[0.06] text-[12px] leading-snug text-left space-y-1.5",
                children: voiceTurns.map((t) => /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: t.role === "user" ? "text-amber-200/90" : "text-gray-100",
                    children: [
                      /* @__PURE__ */ jsx("span", { className: "font-semibold mr-1", children: t.role === "user" ? "You:" : "Claire:" }),
                      t.text
                    ]
                  },
                  t.id
                ))
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => void endCall(),
                disabled: callStatus === "connecting" || callStatus === "ending",
                className: "mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold text-white bg-gradient-to-br from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 disabled:opacity-60 transition-all shadow-[0_8px_24px_-8px_rgba(244,63,94,0.7)] active:scale-95",
                children: [
                  /* @__PURE__ */ jsx(PhoneOff, { size: 13 }),
                  " End call"
                ]
              }
            ),
            callError && /* @__PURE__ */ jsx("div", { className: "mt-3 text-[11px] text-rose-300 text-center max-w-[18rem]", children: callError })
          ] });
        })()
      ]
    }
  );
  return createPortal(
    /* @__PURE__ */ jsxs(Fragment, { children: [
      open ? card : launcher,
      /* @__PURE__ */ jsx("style", { children: `
        .chat-scroll::-webkit-scrollbar { width: 3px; }
        .chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .chat-scroll::-webkit-scrollbar-thumb {
          background: ${"rgba(255,255,255,0.08)" };
          border-radius: 4px;
        }
        .chat-dot {
          width: 5px;
          height: 5px;
          border-radius: 9999px;
          background: ${"rgba(251,191,36,0.85)" };
          display: inline-block;
          animation: chatDot 1.1s infinite ease-in-out;
        }
        @keyframes chatDot {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-3px); opacity: 1; }
        }
        .chat-launch-ping {
          animation: chatLaunchPing 2.4s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes chatLaunchPing {
          0% { transform: scale(1); opacity: 0.6; }
          70%, 100% { transform: scale(2); opacity: 0; }
        }
        .chat-card-pop {
          animation: chatCardPop 0.22s cubic-bezier(0.16, 1, 0.3, 1) both;
          transform-origin: bottom right;
        }
        @keyframes chatCardPop {
          from { opacity: 0; transform: translateY(12px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Voice-call orb \u2014 two distinct visual states:
           \u2022 listening: a single calm breathing halo (slow, low-amplitude).
           \u2022 speaking: multiple concentric ripples expanding outward, plus a
             tighter brighter breathing halo and an intensified core glow. */
        .claire-halo {
          position: absolute;
          inset: 0;
          margin: auto;
          border-radius: 9999px;
          pointer-events: none;
          will-change: transform, opacity;
        }
        .claire-halo-listening {
          width: 8.5rem;
          height: 8.5rem;
          background: radial-gradient(
            circle,
            rgba(251, 191, 36, 0.18) 0%,
            rgba(251, 191, 36, 0.08) 55%,
            rgba(251, 191, 36, 0) 75%
          );
          animation: claireBreathSlow 3.6s ease-in-out infinite;
        }
        .claire-halo-speaking {
          width: 9.5rem;
          height: 9.5rem;
          background: radial-gradient(
            circle,
            rgba(251, 191, 36, 0.32) 0%,
            rgba(244, 114, 22, 0.18) 50%,
            rgba(244, 63, 94, 0.05) 80%,
            rgba(244, 63, 94, 0) 100%
          );
          animation: claireBreathFast 1.4s ease-in-out infinite;
        }
        @keyframes claireBreathSlow {
          0%, 100% { transform: scale(1); opacity: 0.55; }
          50% { transform: scale(1.06); opacity: 0.85; }
        }
        @keyframes claireBreathFast {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 1; }
        }

        .claire-ripple {
          position: absolute;
          inset: 0;
          margin: auto;
          width: 6rem;
          height: 6rem;
          border-radius: 9999px;
          border: 1.5px solid rgba(251, 191, 36, 0.55);
          background: radial-gradient(
            circle,
            rgba(251, 191, 36, 0.08) 0%,
            rgba(251, 191, 36, 0) 70%
          );
          pointer-events: none;
          opacity: 0;
          animation: claireRipple 1.8s cubic-bezier(0, 0.2, 0.4, 1) infinite;
          will-change: transform, opacity, border-color;
        }
        .claire-ripple-1 { animation-delay: 0s; }
        .claire-ripple-2 { animation-delay: 0.55s; }
        .claire-ripple-3 { animation-delay: 1.1s; }
        @keyframes claireRipple {
          0% {
            transform: scale(0.85);
            opacity: 0.9;
            border-color: rgba(251, 191, 36, 0.65);
          }
          70% {
            opacity: 0.18;
            border-color: rgba(244, 114, 22, 0.35);
          }
          100% {
            transform: scale(2.6);
            opacity: 0;
            border-color: rgba(244, 63, 94, 0);
          }
        }

        .claire-core-listening {
          animation: claireCoreListening 3.6s ease-in-out infinite;
        }
        @keyframes claireCoreListening {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.015); }
        }
        .claire-core-speaking {
          animation: claireCoreSpeaking 1.4s ease-in-out infinite;
        }
        @keyframes claireCoreSpeaking {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 36px -6px rgba(251, 191, 36, 0.45);
          }
          50% {
            transform: scale(1.06);
            box-shadow: 0 0 64px -2px rgba(251, 191, 36, 0.75);
          }
        }

        .claire-dot-speaking {
          animation: claireDotPulse 1s ease-in-out infinite;
        }
        @keyframes claireDotPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.35); opacity: 0.7; }
        }

        @media (prefers-reduced-motion: reduce) {
          .claire-halo, .claire-ripple,
          .claire-core-listening, .claire-core-speaking,
          .claire-dot-speaking {
            animation: none;
          }
        }
      ` })
    ] }),
    document.body
  );
};
var ClaireAssistant_default = ClaireAssistant;

// src/errorlog/client.ts
var DEFAULT_ENDPOINT2 = "/api/errorlog-collect";
var DEFAULT_MAX_EVENTS = 25;
var DEDUPE_WINDOW_MS = 6e4;
var NOISE = [
  "ResizeObserver loop",
  "Script error.",
  // opaque cross-origin error, no actionable info
  "Non-Error promise rejection captured",
  "Load failed"
  // generic Safari fetch abort on navigation
];
function isNoise(message, source) {
  if (source && /(^|\/\/)(chrome|moz|safari-web)-extension:\/\//.test(source)) {
    return true;
  }
  return NOISE.some((n) => message.includes(n));
}
function normaliseError(error) {
  if (error instanceof Error) {
    return { message: error.message || error.name || "Error", stack: error.stack };
  }
  if (typeof error === "string") return { message: error };
  if (error && typeof error === "object") {
    const maybe = error;
    if (typeof maybe.message === "string") {
      return {
        message: maybe.message,
        stack: typeof maybe.stack === "string" ? maybe.stack : void 0
      };
    }
    try {
      return { message: JSON.stringify(error).slice(0, 500) };
    } catch {
      return { message: "Unserialisable error" };
    }
  }
  return { message: String(error) };
}
function createErrorLogger(options) {
  const appName = options.appName.toLowerCase();
  const endpoint = options.endpoint ?? DEFAULT_ENDPOINT2;
  const maxEvents = options.maxEventsPerSession ?? DEFAULT_MAX_EVENTS;
  let sent = 0;
  const recent = /* @__PURE__ */ new Map();
  function buildBody(message, severity, kind, stack, source, metaData, emailOverride) {
    const ctx = (() => {
      try {
        return options.getContext?.();
      } catch {
        return void 0;
      }
    })();
    const meta = { ...ctx?.metaData ?? {}, ...metaData ?? {} };
    return {
      app_name: appName,
      message,
      severity,
      kind,
      stack,
      source,
      page_url: typeof location !== "undefined" ? location.href : void 0,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : void 0,
      user_email: emailOverride ?? ctx?.email,
      target_address: ctx?.address,
      parcel_id: ctx?.parcelId,
      target_lat: ctx?.lat,
      target_lng: ctx?.lng,
      meta_data: Object.keys(meta).length ? meta : void 0
    };
  }
  function post(body) {
    try {
      return fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        // Survive page unload — errors often fire as the user navigates away.
        keepalive: true
      }).catch((err) => {
        console.error("Error log dispatch failed:", err);
        return null;
      });
    } catch (err) {
      console.error("Error log dispatch failed:", err);
      return Promise.resolve(null);
    }
  }
  const capture = (error, extra) => {
    try {
      const { message, stack } = normaliseError(error);
      const source = extra?.source;
      if (!message || isNoise(message, source)) return;
      if (sent >= maxEvents) return;
      const fp = `${message}|${source ?? ""}|${extra?.kind ?? "runtime"}`;
      const now = Date.now();
      const last = recent.get(fp);
      if (last && now - last < DEDUPE_WINDOW_MS) return;
      recent.set(fp, now);
      sent += 1;
      void post(
        buildBody(
          message,
          extra?.severity ?? "error",
          extra?.kind ?? "runtime",
          stack,
          source,
          extra?.metaData
        )
      );
    } catch {
    }
  };
  const report = async (input) => {
    try {
      const message = (input.message ?? "").trim();
      if (!message) return false;
      const res = await post(
        buildBody(message, "info", "user_report", void 0, void 0, input.metaData, input.email)
      );
      return Boolean(res && res.ok);
    } catch {
      return false;
    }
  };
  const install = () => {
    if (typeof window === "undefined") return () => {
    };
    const w = window;
    if (w.__swissnovoErrorLogInstalled) return () => {
    };
    w.__swissnovoErrorLogInstalled = true;
    const onError = (event) => {
      const where = event.filename ? `${event.filename}:${event.lineno ?? 0}:${event.colno ?? 0}` : void 0;
      capture(event.error ?? event.message, { kind: "runtime", source: where });
    };
    const onRejection = (event) => {
      capture(event.reason ?? "Unhandled promise rejection", { kind: "promise" });
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
      w.__swissnovoErrorLogInstalled = false;
    };
  };
  return { capture, report, install };
}
function installErrorLogging(options) {
  const logger = createErrorLogger(options);
  logger.install();
  return logger;
}
var ErrorLogBoundary = class extends Component {
  constructor() {
    super(...arguments);
    this.state = { error: null };
    this.reset = () => this.setState({ error: null });
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    try {
      this.props.logger?.capture(error, {
        kind: "react",
        severity: "error",
        source: info.componentStack ?? void 0
      });
      this.props.onError?.(error, info);
    } catch {
    }
  }
  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    const { fallback } = this.props;
    if (typeof fallback === "function") return fallback(error, this.reset);
    if (fallback !== void 0) return fallback;
    const dark = this.props.darkMode ?? (typeof document !== "undefined" && document.documentElement.classList.contains("dark"));
    return /* @__PURE__ */ jsx(
      "div",
      {
        role: "alert",
        style: {
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          fontFamily: "var(--hood-font, Inter, system-ui, sans-serif)",
          color: dark ? "#e2e8f0" : "#0f172a"
        },
        children: /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              maxWidth: "24rem",
              textAlign: "center",
              borderRadius: "1rem",
              padding: "2rem",
              background: dark ? "#1e293b" : "#ffffff",
              boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
              border: `1px solid ${dark ? "#334155" : "#e2e8f0"}`
            },
            children: [
              /* @__PURE__ */ jsx("h1", { style: { fontSize: "1.125rem", fontWeight: 600, margin: "0 0 0.5rem" }, children: "Etwas ist schiefgelaufen" }),
              /* @__PURE__ */ jsx(
                "p",
                {
                  style: {
                    fontSize: "0.875rem",
                    color: dark ? "#94a3b8" : "#64748b",
                    margin: "0 0 1.25rem"
                  },
                  children: "Ein unerwarteter Fehler ist aufgetreten. Wir wurden benachrichtigt."
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => window.location.reload(),
                  style: {
                    minHeight: "44px",
                    padding: "0 1.25rem",
                    borderRadius: "0.5rem",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#ffffff",
                    background: "#e11d48"
                  },
                  children: "Seite neu laden"
                }
              )
            ]
          }
        )
      }
    );
  }
};

// src/errorlog/i18n.ts
var BUG_REPORT_STRINGS = {
  de: {
    button: "Problem melden",
    bug: "Fehler",
    feedback: "Feedback",
    categoryPrompt: "Worum geht es? (optional)",
    bugCategories: [
      { id: "data_error", label: "Datenfehler" },
      { id: "ui_bug", label: "Oberfl\xE4chenfehler" },
      { id: "map_location", label: "Karte oder Adresse" },
      { id: "login_access", label: "Login oder Zugriff" },
      { id: "performance_crash", label: "Absturz oder langsam" }
    ],
    feedbackCategories: [
      { id: "feature_request", label: "Funktionswunsch" },
      { id: "data_improvement", label: "Daten verbessern" },
      { id: "usability", label: "Bedienung" },
      { id: "design_content", label: "Design oder Inhalte" },
      { id: "general_feedback", label: "Allgemeines Feedback" }
    ],
    title: "Ein Problem melden",
    subtitle: "Etwas funktioniert nicht? Beschreiben Sie es kurz \u2014 wir k\xFCmmern uns darum.",
    messagePlaceholder: "Was ist passiert? Was haben Sie erwartet?",
    emailLabel: "E-Mail (optional)",
    emailPlaceholder: "sie@beispiel.ch",
    send: "Senden",
    sending: "Wird gesendet \u2026",
    successTitle: "Danke!",
    successBody: "Ihre Meldung ist bei uns eingegangen.",
    error: "Senden fehlgeschlagen. Bitte sp\xE4ter erneut versuchen.",
    close: "Schliessen",
    dialogLabel: "Problem melden"
  },
  en: {
    button: "Report a problem",
    bug: "Bug",
    feedback: "Feedback",
    categoryPrompt: "What is it about? (optional)",
    bugCategories: [
      { id: "data_error", label: "Data error" },
      { id: "ui_bug", label: "Application UI bug" },
      { id: "map_location", label: "Map or address issue" },
      { id: "login_access", label: "Login or access issue" },
      { id: "performance_crash", label: "Crash or performance" }
    ],
    feedbackCategories: [
      { id: "feature_request", label: "Feature request" },
      { id: "data_improvement", label: "Data improvement" },
      { id: "usability", label: "Usability" },
      { id: "design_content", label: "Design or content" },
      { id: "general_feedback", label: "General feedback" }
    ],
    title: "Report a problem",
    subtitle: "Something not working? Tell us briefly \u2014 we\u2019ll look into it.",
    messagePlaceholder: "What happened? What did you expect?",
    emailLabel: "Email (optional)",
    emailPlaceholder: "you@example.ch",
    send: "Send",
    sending: "Sending \u2026",
    successTitle: "Thank you!",
    successBody: "Your report has reached us.",
    error: "Could not send. Please try again later.",
    close: "Close",
    dialogLabel: "Report a problem"
  },
  fr: {
    button: "Signaler un probl\xE8me",
    bug: "Bug",
    feedback: "Avis",
    categoryPrompt: "De quoi s\u2019agit-il ? (facultatif)",
    bugCategories: [
      { id: "data_error", label: "Erreur de donn\xE9es" },
      { id: "ui_bug", label: "Bug d\u2019interface" },
      { id: "map_location", label: "Carte ou adresse" },
      { id: "login_access", label: "Connexion ou acc\xE8s" },
      { id: "performance_crash", label: "Blocage ou lenteur" }
    ],
    feedbackCategories: [
      { id: "feature_request", label: "Demande de fonction" },
      { id: "data_improvement", label: "Am\xE9lioration des donn\xE9es" },
      { id: "usability", label: "Utilisation" },
      { id: "design_content", label: "Design ou contenu" },
      { id: "general_feedback", label: "Avis g\xE9n\xE9ral" }
    ],
    title: "Signaler un probl\xE8me",
    subtitle: "Quelque chose ne fonctionne pas ? D\xE9crivez-le bri\xE8vement \u2014 nous nous en occupons.",
    messagePlaceholder: "Que s\u2019est-il pass\xE9 ? \xC0 quoi vous attendiez-vous ?",
    emailLabel: "E-mail (facultatif)",
    emailPlaceholder: "vous@exemple.ch",
    send: "Envoyer",
    sending: "Envoi \u2026",
    successTitle: "Merci !",
    successBody: "Votre signalement nous est bien parvenu.",
    error: "\xC9chec de l\u2019envoi. Veuillez r\xE9essayer plus tard.",
    close: "Fermer",
    dialogLabel: "Signaler un probl\xE8me"
  },
  it: {
    button: "Segnala un problema",
    bug: "Bug",
    feedback: "Feedback",
    categoryPrompt: "Di cosa si tratta? (facoltativo)",
    bugCategories: [
      { id: "data_error", label: "Errore nei dati" },
      { id: "ui_bug", label: "Bug interfaccia app" },
      { id: "map_location", label: "Mappa o indirizzo" },
      { id: "login_access", label: "Login o accesso" },
      { id: "performance_crash", label: "Crash o lentezza" }
    ],
    feedbackCategories: [
      { id: "feature_request", label: "Richiesta funzione" },
      { id: "data_improvement", label: "Miglioramento dati" },
      { id: "usability", label: "Usabilit\xE0" },
      { id: "design_content", label: "Design o contenuti" },
      { id: "general_feedback", label: "Feedback generale" }
    ],
    title: "Segnala un problema",
    subtitle: "Qualcosa non funziona? Descrivilo brevemente \u2014 ce ne occupiamo noi.",
    messagePlaceholder: "Cosa \xE8 successo? Cosa ti aspettavi?",
    emailLabel: "E-mail (facoltativo)",
    emailPlaceholder: "tu@esempio.ch",
    send: "Invia",
    sending: "Invio \u2026",
    successTitle: "Grazie!",
    successBody: "La tua segnalazione ci \xE8 arrivata.",
    error: "Invio non riuscito. Riprova pi\xF9 tardi.",
    close: "Chiudi",
    dialogLabel: "Segnala un problema"
  }
};
function getBugReportStrings(locale) {
  if (locale && locale in BUG_REPORT_STRINGS) {
    return BUG_REPORT_STRINGS[locale];
  }
  return BUG_REPORT_STRINGS.de;
}
var emptySelectedCategories = () => ({ bug: [], feedback: [] });
function useDarkMode(forced) {
  const [dark, setDark] = useState(() => {
    if (typeof forced === "boolean") return forced;
    if (typeof document === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  });
  useEffect(() => {
    if (typeof forced === "boolean") {
      setDark(forced);
      return;
    }
    if (typeof document === "undefined") return;
    const el = document.documentElement;
    const update = () => setDark(el.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [forced]);
  return dark;
}
function BugReportButton({
  logger,
  locale = "de",
  email = "",
  position = "bottom-left",
  darkMode,
  container,
  metaData,
  showLabel = false
}) {
  const t = getBugReportStrings(locale);
  const dark = useDarkMode(darkMode);
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState("idle");
  const [reportType, setReportType] = useState("bug");
  const [selectedCategories, setSelectedCategories] = useState(
    emptySelectedCategories
  );
  const [message, setMessage] = useState("");
  const [emailValue, setEmailValue] = useState(email);
  const dialogRef = useRef(null);
  const textareaRef = useRef(null);
  const titleId = useId();
  const subtitleId = useId();
  useEffect(() => setEmailValue(email), [email]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = dialogRef.current?.querySelectorAll(
        'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    const id = window.setTimeout(() => textareaRef.current?.focus(), 60);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(id);
    };
  }, [open]);
  const close = useCallback(() => {
    setOpen(false);
    window.setTimeout(() => {
      setPhase("idle");
      setReportType("bug");
      setSelectedCategories(emptySelectedCategories());
      setMessage("");
    }, 200);
  }, []);
  const toggleCategory = useCallback((categoryId) => {
    setSelectedCategories((current2) => {
      const values = current2[reportType] ?? [];
      const nextValues = values.includes(categoryId) ? values.filter((value) => value !== categoryId) : [...values, categoryId];
      return { ...current2, [reportType]: nextValues };
    });
  }, [reportType]);
  const categoryOptions = reportType === "bug" ? t.bugCategories : t.feedbackCategories;
  const selectedCategoryIds = selectedCategories[reportType] ?? [];
  const selectedCategoryLabels = categoryOptions.filter((category) => selectedCategoryIds.includes(category.id)).map((category) => category.label);
  const submit = useCallback(async () => {
    const text = message.trim();
    if (!text || phase === "sending") return;
    setPhase("sending");
    const ok = await logger.report({
      message: text,
      email: emailValue.trim() || void 0,
      metaData: {
        ...metaData ?? {},
        report_type: reportType,
        source: "bug_report_widget",
        ...selectedCategoryIds.length > 0 ? {
          report_categories: selectedCategoryIds,
          report_category_labels: selectedCategoryLabels
        } : {}
      }
    });
    setPhase(ok ? "success" : "error");
    if (ok) window.setTimeout(close, 1800);
  }, [
    message,
    emailValue,
    phase,
    logger,
    metaData,
    reportType,
    selectedCategoryIds,
    selectedCategoryLabels,
    close
  ]);
  if (typeof document === "undefined") return null;
  const target = container ?? document.body;
  const corner = position === "bottom-right" ? "right-4 sm:right-5" : "left-4 sm:left-5";
  const panelBg = dark ? "bg-slate-900 text-slate-100 ring-1 ring-white/10" : "bg-white text-slate-900 ring-1 ring-slate-200";
  const inputCls = dark ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500" : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400";
  const launcher = /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      onClick: () => setOpen(true),
      "aria-label": t.button,
      "aria-haspopup": "dialog",
      title: t.button,
      className: `fixed bottom-4 sm:bottom-5 ${corner} z-[2147483000] inline-flex h-11 items-center justify-center gap-2 ${showLabel ? "w-auto px-3.5" : "w-11 px-0"} rounded-full text-sm font-semibold shadow-lg ring-1 ring-inset transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 ` + (dark ? "bg-slate-800 text-rose-300 ring-white/10 hover:bg-slate-700 focus-visible:ring-offset-slate-900" : "bg-white text-rose-600 ring-rose-200 hover:bg-rose-50 focus-visible:ring-offset-white"),
      children: [
        /* @__PURE__ */ jsx(ShieldAlert, { className: "h-4 w-4", "aria-hidden": "true" }),
        /* @__PURE__ */ jsx("span", { className: showLabel ? "hidden sm:inline" : "sr-only", children: t.button })
      ]
    }
  );
  const dialog = /* @__PURE__ */ jsxs(
    "div",
    {
      className: "fixed inset-0 z-[2147483600] flex items-end justify-center p-4 sm:items-center",
      role: "presentation",
      onMouseDown: (e) => {
        if (e.target === e.currentTarget) close();
      },
      children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/45", "aria-hidden": "true" }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            ref: dialogRef,
            role: "dialog",
            "aria-modal": "true",
            "aria-labelledby": titleId,
            "aria-describedby": phase === "success" ? void 0 : subtitleId,
            className: `relative w-full max-w-md rounded-lg p-5 shadow-2xl ${panelBg}`,
            children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: close,
                  "aria-label": t.close,
                  className: "absolute right-3 top-3 rounded-lg p-1.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 " + (dark ? "text-slate-400 hover:bg-white/10" : "text-slate-400 hover:bg-slate-100"),
                  children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4", "aria-hidden": "true" })
                }
              ),
              phase === "success" ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3 py-6 text-center", children: [
                /* @__PURE__ */ jsx("span", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-6 w-6", "aria-hidden": "true" }) }),
                /* @__PURE__ */ jsx("h2", { id: titleId, className: "text-base font-semibold", children: t.successTitle }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400", children: t.successBody })
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center gap-2 pr-6", children: [
                  /* @__PURE__ */ jsx("span", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300", children: /* @__PURE__ */ jsx(ShieldAlert, { className: "h-4 w-4", "aria-hidden": "true" }) }),
                  /* @__PURE__ */ jsx("h2", { id: titleId, className: "text-base font-semibold", children: t.title })
                ] }),
                /* @__PURE__ */ jsx("p", { id: subtitleId, className: "mb-4 text-sm text-slate-500 dark:text-slate-400", children: t.subtitle }),
                /* @__PURE__ */ jsx("div", { className: "mb-3 grid grid-cols-2 gap-2", role: "group", "aria-label": t.dialogLabel, children: ["bug", "feedback"].map((type) => {
                  const active = reportType === type;
                  const Icon = type === "bug" ? ShieldAlert : MessageSquareText;
                  return /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => setReportType(type),
                      className: "inline-flex min-h-[40px] items-center justify-center gap-2 rounded-lg border px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 " + (active ? "border-rose-500 bg-rose-50 text-rose-700 dark:border-rose-400 dark:bg-rose-500/15 dark:text-rose-200" : dark ? "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"),
                      "aria-pressed": active,
                      children: [
                        /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4", "aria-hidden": "true" }),
                        type === "bug" ? t.bug : t.feedback
                      ]
                    },
                    type
                  );
                }) }),
                /* @__PURE__ */ jsxs("fieldset", { className: "mb-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700", children: [
                  /* @__PURE__ */ jsx("legend", { className: "px-1 text-xs font-semibold text-slate-500 dark:text-slate-400", children: t.categoryPrompt }),
                  /* @__PURE__ */ jsx("div", { className: "mt-1 grid gap-1.5 sm:grid-cols-2", children: categoryOptions.map((category) => {
                    const checked = selectedCategoryIds.includes(category.id);
                    return /* @__PURE__ */ jsxs(
                      "label",
                      {
                        className: "flex min-h-[34px] cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium transition " + (dark ? "text-slate-300 hover:bg-white/10" : "text-slate-600 hover:bg-slate-50"),
                        children: [
                          /* @__PURE__ */ jsx(
                            "input",
                            {
                              type: "checkbox",
                              checked,
                              onChange: () => toggleCategory(category.id),
                              className: "h-4 w-4 rounded border-slate-300 accent-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 dark:border-slate-600"
                            }
                          ),
                          /* @__PURE__ */ jsx("span", { children: category.label })
                        ]
                      },
                      category.id
                    );
                  }) })
                ] }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    ref: textareaRef,
                    value: message,
                    onChange: (e) => setMessage(e.target.value),
                    rows: 5,
                    maxLength: 2e3,
                    placeholder: t.messagePlaceholder,
                    className: `w-full resize-none rounded-lg border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${inputCls}`
                  }
                ),
                /* @__PURE__ */ jsx("label", { className: "mt-3 block text-xs font-medium text-slate-500 dark:text-slate-400", children: t.emailLabel }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "email",
                    value: emailValue,
                    onChange: (e) => setEmailValue(e.target.value),
                    placeholder: t.emailPlaceholder,
                    className: `mt-1 w-full rounded-lg border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${inputCls}`
                  }
                ),
                phase === "error" && /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-rose-600 dark:text-rose-400", children: t.error }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => void submit(),
                    disabled: !message.trim() || phase === "sending",
                    className: "mt-4 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-white transition bg-rose-600 hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 " + (dark ? "focus-visible:ring-offset-slate-900" : "focus-visible:ring-offset-white"),
                    children: phase === "sending" ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin", "aria-hidden": "true" }),
                      t.sending
                    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(Send, { className: "h-4 w-4", "aria-hidden": "true" }),
                      t.send
                    ] })
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  );
  return createPortal(
    /* @__PURE__ */ jsxs(Fragment, { children: [
      launcher,
      open && dialog
    ] }),
    target
  );
}

// src/openreplay/client.ts
var DEFAULT_INGEST = "https://openreplay.zeroo.ch/ingest";
var tracker = null;
var started = false;
var noopHandle = {
  get started() {
    return started;
  },
  identify(userId, metadata) {
    identifyOpenReplayUser(userId, metadata);
  },
  stop() {
    stopOpenReplay();
  }
};
function initOpenReplay(options = {}) {
  if (started || tracker) return noopHandle;
  if (typeof window === "undefined") return noopHandle;
  const projectKey = options.projectKey;
  if (!projectKey) return noopHandle;
  const ingestPoint = options.ingestPoint || DEFAULT_INGEST;
  void (async () => {
    try {
      const mod = await import('@openreplay/tracker');
      const Tracker = mod.default;
      const instance = new Tracker({
        projectKey,
        ingestPoint,
        obscureTextEmails: options.obscureTextEmails ?? true,
        obscureTextNumbers: options.obscureTextNumbers ?? true,
        obscureInputEmails: options.obscureInputEmails ?? true,
        obscureInputNumbers: options.obscureInputNumbers ?? true,
        obscureInputDates: options.obscureInputDates ?? true,
        respectDoNotTrack: options.respectDoNotTrack ?? false,
        ...options.trackerOptions ?? {}
      });
      tracker = instance;
      await Promise.resolve(instance.start()).catch((err) => {
        console.warn("[openreplay] start failed", err);
      });
      started = true;
    } catch (err) {
      console.warn("[openreplay] init skipped", err);
      tracker = null;
    }
  })();
  return noopHandle;
}
function identifyOpenReplayUser(userId, metadata) {
  if (!tracker || !userId) return;
  try {
    tracker.setUserID(userId);
    if (metadata) {
      for (const [key, value] of Object.entries(metadata)) {
        tracker.setMetadata(key, value);
      }
    }
  } catch {
  }
}
function stopOpenReplay() {
  try {
    tracker?.stop?.();
  } catch {
  }
}

// src/flags/client.ts
var FlagApiError = class extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = "FlagApiError";
  }
};
var DEFAULT_FLAG_API_BASE = "https://res.zeroo.ch/roolez_api";
var flagApiBase = DEFAULT_FLAG_API_BASE;
function getFlagApiBase() {
  return flagApiBase;
}
function setFlagApiBase(base) {
  flagApiBase = base && base.trim() ? base.replace(/\/+$/, "") : DEFAULT_FLAG_API_BASE;
}
var metaCache = new LocalStorageCache("swissnovo-flags", 24 * 60);
var recordPromises = /* @__PURE__ */ new Map();
var listPromises = /* @__PURE__ */ new Map();
var svgMarkupCache = /* @__PURE__ */ new Map();
var svgMarkupPromises = /* @__PURE__ */ new Map();
function clearFlagCache() {
  metaCache.clear();
  recordPromises.clear();
  listPromises.clear();
  svgMarkupCache.clear();
  svgMarkupPromises.clear();
}
function normaliseMode(mode) {
  return mode === "png" ? "png" : "original";
}
async function getJson(url) {
  let response;
  try {
    response = await fetch(url);
  } catch (err) {
    throw new FlagApiError(
      `Flag request failed: ${err instanceof Error ? err.message : "network error"}`
    );
  }
  if (response.status === 404) return { __notFound: true };
  if (!response.ok) {
    throw new FlagApiError(`Flag request failed with ${response.status}`, response.status);
  }
  return response.json();
}
async function getFlagByBfs(bfsCode, options = {}) {
  const mode = normaliseMode(options.imageMode);
  const base = (options.apiBase ?? flagApiBase).replace(/\/+$/, "");
  const cacheKey = `bfs:${base}:${bfsCode}:${mode}`;
  if (!options.noCache) {
    const cached = metaCache.get(cacheKey);
    if (cached !== null) return cached;
    const inflight = recordPromises.get(cacheKey);
    if (inflight) return inflight;
  }
  const promise = (async () => {
    const url = `${base}/get-flags-by-bfs-code?bfs_code=${encodeURIComponent(bfsCode)}&imageMode=${mode}`;
    const body = await getJson(url);
    const record = body && !body.__notFound && body.data ? body.data : null;
    if (!options.noCache) metaCache.set(cacheKey, record);
    return record;
  })().finally(() => recordPromises.delete(cacheKey));
  if (!options.noCache) recordPromises.set(cacheKey, promise);
  return promise;
}
async function getFlagsByCanton(canton, options = {}) {
  const mode = normaliseMode(options.imageMode);
  const base = (options.apiBase ?? flagApiBase).replace(/\/+$/, "");
  const code = canton.trim().toUpperCase();
  const cacheKey = `canton:${base}:${code}:${mode}`;
  if (!options.noCache) {
    const inflight = listPromises.get(cacheKey);
    if (inflight) return inflight;
  }
  const promise = (async () => {
    const url = `${base}/get-flags-by-canton?canton=${encodeURIComponent(code)}&imageMode=${mode}`;
    const body = await getJson(url);
    return body && !body.__notFound && Array.isArray(body.data) ? body.data : [];
  })().finally(() => listPromises.delete(cacheKey));
  if (!options.noCache) listPromises.set(cacheKey, promise);
  return promise;
}
async function getAllFlags(options = {}) {
  const mode = normaliseMode(options.imageMode);
  const base = (options.apiBase ?? flagApiBase).replace(/\/+$/, "");
  const cacheKey = `all:${base}:${mode}`;
  if (!options.noCache) {
    const inflight = listPromises.get(cacheKey);
    if (inflight) return inflight;
  }
  const promise = (async () => {
    const url = `${base}/get-all-flags?imageMode=${mode}`;
    const body = await getJson(url);
    return body && !body.__notFound && Array.isArray(body.data) ? body.data : [];
  })().finally(() => listPromises.delete(cacheKey));
  if (!options.noCache) listPromises.set(cacheKey, promise);
  return promise;
}
function isSvgFlagUrl(url) {
  if (!url) return false;
  return url.split("?")[0].toLowerCase().endsWith(".svg");
}
async function fetchFlagSvgMarkup(url) {
  if (!isSvgFlagUrl(url)) return null;
  const key = url;
  if (svgMarkupCache.has(key)) return svgMarkupCache.get(key) ?? null;
  const inflight = svgMarkupPromises.get(key);
  if (inflight) return inflight;
  const promise = (async () => {
    try {
      const response = await fetch(key);
      if (!response.ok) return null;
      const text = await response.text();
      const markup = text.trim().startsWith("<") ? text : null;
      svgMarkupCache.set(key, markup);
      return markup;
    } catch {
      return null;
    } finally {
      svgMarkupPromises.delete(key);
    }
  })();
  svgMarkupPromises.set(key, promise);
  return promise;
}
function useMunicipalityFlag(bfsCode, options = {}) {
  const [flag, setFlag] = useState(null);
  const [loading, setLoading] = useState(bfsCode != null);
  const [error, setError] = useState(null);
  const { imageMode, apiBase, noCache } = options;
  const requestId = useRef(0);
  useEffect(() => {
    if (bfsCode == null) {
      setFlag(null);
      setLoading(false);
      setError(null);
      return;
    }
    const id = ++requestId.current;
    setLoading(true);
    setError(null);
    getFlagByBfs(bfsCode, { imageMode, apiBase, noCache }).then((record) => {
      if (id !== requestId.current) return;
      setFlag(record);
      setLoading(false);
    }).catch((err) => {
      if (id !== requestId.current) return;
      setFlag(null);
      setError(err instanceof Error ? err : new Error(String(err)));
      setLoading(false);
    });
    return () => {
      requestId.current++;
    };
  }, [bfsCode, imageMode, apiBase, noCache]);
  return { flag, loading, error };
}
function MunicipalityFlag({
  bfsCode,
  imageMode,
  size = 24,
  apiBase,
  alt,
  fallback,
  style,
  ...imgProps
}) {
  const { flag } = useMunicipalityFlag(bfsCode, { imageMode, apiBase });
  const [broken, setBroken] = useState(false);
  const boxStyle = {
    width: size,
    height: size,
    display: "inline-block",
    flexShrink: 0,
    ...style
  };
  if (!flag?.flag_url || broken) {
    if (fallback !== void 0) return /* @__PURE__ */ jsx(Fragment, { children: fallback });
    return /* @__PURE__ */ jsx(
      "span",
      {
        "aria-hidden": "true",
        style: {
          ...boxStyle,
          borderRadius: 4,
          background: "rgba(100,116,139,0.18)"
        }
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "img",
    {
      src: flag.flag_url,
      alt: alt ?? `${flag.municipality_name} flag`,
      width: size,
      height: size,
      loading: "lazy",
      decoding: "async",
      onError: () => setBroken(true),
      style: { ...boxStyle, objectFit: "contain" },
      ...imgProps
    }
  );
}
function Avatar({ url, initials, size = 28, className = "" }) {
  const [errored, setErrored] = useState(false);
  const show = url && !errored;
  if (!show) {
    return /* @__PURE__ */ jsx(
      "span",
      {
        className: `inline-flex items-center justify-center rounded-full bg-red-600 font-semibold text-white ${className}`,
        style: { width: size, height: size, fontSize: Math.round(size * 0.42) },
        children: initials
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "img",
    {
      src: url,
      alt: "",
      width: size,
      height: size,
      onError: () => setErrored(true),
      className: `rounded-full bg-gray-100 object-contain p-0.5 dark:bg-gray-700 ${className}`,
      style: { width: size, height: size }
    }
  );
}

// src/profile/avatars.ts
var TWEMOJI_TAG = "15.1.0";
var TWEMOJI_BASE = `https://cdn.jsdelivr.net/gh/jdecked/twemoji@${TWEMOJI_TAG}/assets/svg`;
var PEOPLE_ASSET_TAG = "v1.14.0";
var PEOPLE_BASE = `https://cdn.jsdelivr.net/gh/mbuchi/aireon-shared@${PEOPLE_ASSET_TAG}/assets/avatars`;
var avatarOptions = [
  // --- People (illustrated portraits) ---------------------------------------
  { id: "person-01", label: "Mia", group: "people", file: "person-01.webp", tint: "#d7e3c3" },
  { id: "person-02", label: "Leo", group: "people", file: "person-02.webp", tint: "#c7e2e0" },
  { id: "person-03", label: "Lena", group: "people", file: "person-03.webp", tint: "#ecccd2" },
  { id: "person-04", label: "Noah", group: "people", file: "person-04.webp", tint: "#d3e1bd" },
  { id: "person-05", label: "Luca", group: "people", file: "person-05.webp", tint: "#cfe3e1" },
  { id: "person-06", label: "Nina", group: "people", file: "person-06.webp", tint: "#bcd6d2" },
  { id: "person-07", label: "Felix", group: "people", file: "person-07.webp", tint: "#f1cfa0" },
  { id: "person-08", label: "Clara", group: "people", file: "person-08.webp", tint: "#d8cce0" },
  { id: "person-09", label: "Theo", group: "people", file: "person-09.webp", tint: "#c6dcea" },
  { id: "person-10", label: "Maya", group: "people", file: "person-10.webp", tint: "#ccdcae" },
  // --- People (illustrated headshots, female + male, interleaved) -----------
  { id: "female-01", label: "Emma", group: "people", file: "female-01.webp", tint: "#eef2f7" },
  { id: "male-01", label: "Liam", group: "people", file: "male-01.webp", tint: "#eef2f7" },
  { id: "female-02", label: "Sofia", group: "people", file: "female-02.webp", tint: "#eef2f7" },
  { id: "male-02", label: "Elias", group: "people", file: "male-02.webp", tint: "#eef2f7" },
  { id: "female-03", label: "Elena", group: "people", file: "female-03.webp", tint: "#eef2f7" },
  { id: "male-03", label: "Jonas", group: "people", file: "male-03.webp", tint: "#eef2f7" },
  { id: "female-04", label: "Sara", group: "people", file: "female-04.webp", tint: "#eef2f7" },
  { id: "male-04", label: "David", group: "people", file: "male-04.webp", tint: "#eef2f7" },
  { id: "female-05", label: "Lara", group: "people", file: "female-05.webp", tint: "#eef2f7" },
  { id: "male-05", label: "Samuel", group: "people", file: "male-05.webp", tint: "#eef2f7" },
  { id: "female-06", label: "Anna", group: "people", file: "female-06.webp", tint: "#eef2f7" },
  { id: "male-06", label: "Nico", group: "people", file: "male-06.webp", tint: "#eef2f7" },
  { id: "female-07", label: "Julia", group: "people", file: "female-07.webp", tint: "#eef2f7" },
  { id: "male-07", label: "Tim", group: "people", file: "male-07.webp", tint: "#eef2f7" },
  { id: "female-08", label: "Laura", group: "people", file: "female-08.webp", tint: "#eef2f7" },
  { id: "male-08", label: "Jan", group: "people", file: "male-08.webp", tint: "#eef2f7" },
  { id: "female-09", label: "Chiara", group: "people", file: "female-09.webp", tint: "#eef2f7" },
  { id: "male-09", label: "Levin", group: "people", file: "male-09.webp", tint: "#eef2f7" },
  { id: "female-10", label: "Alina", group: "people", file: "female-10.webp", tint: "#eef2f7" },
  { id: "male-10", label: "Gabriel", group: "people", file: "male-10.webp", tint: "#eef2f7" },
  { id: "female-11", label: "Emilia", group: "people", file: "female-11.webp", tint: "#eef2f7" },
  { id: "male-11", label: "Matteo", group: "people", file: "male-11.webp", tint: "#eef2f7" },
  { id: "female-12", label: "Nora", group: "people", file: "female-12.webp", tint: "#eef2f7" },
  { id: "male-12", label: "Lukas", group: "people", file: "male-12.webp", tint: "#eef2f7" },
  { id: "female-13", label: "Marie", group: "people", file: "female-13.webp", tint: "#eef2f7" },
  { id: "male-13", label: "Simon", group: "people", file: "male-13.webp", tint: "#eef2f7" },
  { id: "female-14", label: "Sophie", group: "people", file: "female-14.webp", tint: "#eef2f7" },
  { id: "male-14", label: "Fabio", group: "people", file: "male-14.webp", tint: "#eef2f7" },
  { id: "female-15", label: "Eva", group: "people", file: "female-15.webp", tint: "#eef2f7" },
  { id: "male-15", label: "Aaron", group: "people", file: "male-15.webp", tint: "#eef2f7" },
  { id: "female-16", label: "Alice", group: "people", file: "female-16.webp", tint: "#eef2f7" },
  { id: "male-16", label: "Julian", group: "people", file: "male-16.webp", tint: "#eef2f7" },
  { id: "female-17", label: "Ella", group: "people", file: "female-17.webp", tint: "#eef2f7" },
  { id: "male-17", label: "Marco", group: "people", file: "male-17.webp", tint: "#eef2f7" },
  { id: "female-18", label: "Zoe", group: "people", file: "female-18.webp", tint: "#eef2f7" },
  { id: "male-18", label: "Nael", group: "people", file: "male-18.webp", tint: "#eef2f7" },
  { id: "female-19", label: "Greta", group: "people", file: "female-19.webp", tint: "#eef2f7" },
  { id: "male-19", label: "Robin", group: "people", file: "male-19.webp", tint: "#eef2f7" },
  { id: "female-20", label: "Aurora", group: "people", file: "female-20.webp", tint: "#eef2f7" },
  // --- Emoji (cute animals, Twemoji SVGs) -----------------------------------
  { id: "fox", label: "Fox", group: "emoji", codepoint: "1f98a", tint: "#fde4d3" },
  { id: "panda", label: "Panda", group: "emoji", codepoint: "1f43c", tint: "#e8eef2" },
  { id: "tiger", label: "Tiger", group: "emoji", codepoint: "1f42f", tint: "#fdeecb" },
  { id: "koala", label: "Koala", group: "emoji", codepoint: "1f428", tint: "#e3e7ea" },
  { id: "owl", label: "Owl", group: "emoji", codepoint: "1f989", tint: "#ece1d2" },
  { id: "rabbit", label: "Rabbit", group: "emoji", codepoint: "1f430", tint: "#f6e7ee" },
  { id: "cat", label: "Cat", group: "emoji", codepoint: "1f431", tint: "#fbe6cf" },
  { id: "dog", label: "Dog", group: "emoji", codepoint: "1f436", tint: "#f0e4d4" },
  { id: "bear", label: "Bear", group: "emoji", codepoint: "1f43b", tint: "#e9ddcf" },
  { id: "monkey", label: "Monkey", group: "emoji", codepoint: "1f435", tint: "#ede0d1" },
  { id: "penguin", label: "Penguin", group: "emoji", codepoint: "1f427", tint: "#dde6ec" },
  { id: "lion", label: "Lion", group: "emoji", codepoint: "1f981", tint: "#fdeccb" },
  { id: "frog", label: "Frog", group: "emoji", codepoint: "1f438", tint: "#dff0d8" },
  { id: "chick", label: "Chick", group: "emoji", codepoint: "1f425", tint: "#fdf3cf" },
  { id: "unicorn", label: "Unicorn", group: "emoji", codepoint: "1f984", tint: "#f1e3f5" },
  { id: "octopus", label: "Octopus", group: "emoji", codepoint: "1f419", tint: "#f7dde0" }
];
function avatarUrl(opt) {
  if (opt.file) return `${PEOPLE_BASE}/${opt.file}`;
  return `${TWEMOJI_BASE}/${opt.codepoint}.svg`;
}
function avatarUrlById(id) {
  if (!id) return null;
  const opt = avatarOptions.find((a) => a.id === id);
  return opt ? avatarUrl(opt) : null;
}
function avatarUrlFromSeed(seed) {
  return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(seed)}&radius=50`;
}

// src/profile/identity.ts
function readClaim(p, key) {
  const v = p?.[key];
  return typeof v === "string" && v.trim() ? v.trim() : void 0;
}
function emailOf(user) {
  return readClaim(user?.profile, "email") ?? "";
}
function fullNameOf(user) {
  const p = user?.profile;
  const name = readClaim(p, "name");
  if (name) return name;
  const given = readClaim(p, "given_name");
  const family = readClaim(p, "family_name");
  const combined = [given, family].filter(Boolean).join(" ").trim();
  if (combined) return combined;
  return readClaim(p, "preferred_username") ?? "";
}
function firstNameOf(user) {
  const given = readClaim(user?.profile, "given_name");
  if (given) return given;
  const full = fullNameOf(user);
  if (full) {
    const head = full.split(/\s+/)[0];
    if (head) return head;
  }
  const email = emailOf(user);
  if (email.includes("@")) return email.split("@")[0];
  return email || "Account";
}
function initialsOf(user) {
  const source = fullNameOf(user) || emailOf(user);
  if (!source) return "?";
  if (source.includes("@")) return source[0].toUpperCase();
  const parts = source.split(/\s+/).filter(Boolean);
  const letters = parts.slice(0, 2).map((p) => p[0].toUpperCase()).join("");
  return letters || source[0].toUpperCase();
}
function pictureOf(user) {
  return readClaim(user?.profile, "picture") ?? null;
}

// src/profile/profileStore.ts
var LS_KEY = "swissnovo:profile";
var LEGACY_AVATAR_KEY = "swissnovo:avatar_id";
var DEFAULT_PROFILE_URL = "https://res.zeroo.ch/res_api/swissnovo_user/profile";
function profileApiUrl() {
  try {
    const env = import.meta.env;
    const override = env?.VITE_PROFILE_API_URL?.trim();
    if (override) return override;
  } catch {
  }
  return DEFAULT_PROFILE_URL;
}
function defaultProfile() {
  return { avatar_id: null, gender: "unspecified", age: null, about: "" };
}
function coerce(raw) {
  const base = defaultProfile();
  if (!raw || typeof raw !== "object") return base;
  return {
    avatar_id: typeof raw.avatar_id === "string" && raw.avatar_id ? raw.avatar_id : null,
    gender: ["male", "female", "other", "unspecified"].includes(raw.gender) ? raw.gender : "unspecified",
    age: typeof raw.age === "number" && Number.isFinite(raw.age) ? raw.age : null,
    about: typeof raw.about === "string" ? raw.about : ""
  };
}
function loadLocal() {
  if (typeof window === "undefined") return defaultProfile();
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (raw) return coerce(JSON.parse(raw));
    const legacy = window.localStorage.getItem(LEGACY_AVATAR_KEY);
    if (legacy) return coerce({ avatar_id: legacy });
  } catch {
  }
  return defaultProfile();
}
function writeLocal(p) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(p));
    if (p.avatar_id) window.localStorage.setItem(LEGACY_AVATAR_KEY, p.avatar_id);
    else window.localStorage.removeItem(LEGACY_AVATAR_KEY);
  } catch {
  }
}
var current = null;
var subscribers = /* @__PURE__ */ new Set();
function getProfile() {
  if (!current) current = loadLocal();
  return current;
}
function subscribe(cb) {
  subscribers.add(cb);
  return () => {
    subscribers.delete(cb);
  };
}
function broadcast(next) {
  current = next;
  writeLocal(next);
  subscribers.forEach((cb) => cb(next));
}
var warnedAboutRemote = false;
function isDev() {
  try {
    return Boolean(import.meta.env?.DEV);
  } catch {
    return false;
  }
}
async function fetchRemoteProfile(accessToken) {
  if (!accessToken) return null;
  try {
    const res = await fetch(profileApiUrl(), {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return coerce({
      avatar_id: typeof data?.avatar_icon === "string" ? data.avatar_icon : null,
      gender: data?.gender,
      age: typeof data?.age === "number" ? data.age : null,
      about: typeof data?.account_info?.about === "string" ? data.account_info.about : ""
    });
  } catch {
    return null;
  }
}
async function pushRemoteProfile(p, accessToken) {
  if (!accessToken) return;
  try {
    const res = await fetch(profileApiUrl(), {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        avatar_icon: p.avatar_id,
        gender: p.gender,
        age: p.age,
        account_info: { about: p.about }
      })
    });
    if (!res.ok && !warnedAboutRemote && isDev()) {
      warnedAboutRemote = true;
      console.info("[profile] RES API profile PUT returned", res.status, "\u2014 using localStorage only.");
    }
  } catch {
  }
}
function updateProfile(patch, accessToken) {
  const next = coerce({ ...getProfile(), ...patch });
  broadcast(next);
  void pushRemoteProfile(next, accessToken);
  return next;
}
async function hydrateFromRemote(accessToken) {
  const remote = await fetchRemoteProfile(accessToken);
  if (remote) broadcast(remote);
}

// src/profile/useUserProfile.ts
function useUserProfile(user) {
  const [profile, setProfileState] = useState(() => getProfile());
  const accessToken = user && !user.expired ? user.access_token : void 0;
  useEffect(() => subscribe(setProfileState), []);
  useEffect(() => {
    if (!accessToken) return;
    void hydrateFromRemote(accessToken);
  }, [accessToken]);
  const updateProfile2 = useCallback(
    (patch) => {
      updateProfile(patch, accessToken);
    },
    [accessToken]
  );
  const setAvatarId = useCallback(
    (id) => {
      updateProfile({ avatar_id: id }, accessToken);
    },
    [accessToken]
  );
  return {
    profile,
    avatarId: profile.avatar_id,
    avatarUrl: avatarUrlById(profile.avatar_id),
    setAvatarId,
    updateProfile: updateProfile2
  };
}
var GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "unspecified", label: "Prefer not to say" }
];
var FIELD_CLASS = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100";
function ProfileModal({ user, onClose, dark = false }) {
  const modalRef = useFocusTrap({ onEscape: onClose });
  const { profile, avatarId, avatarUrl: chosenUrl, setAvatarId, updateProfile: updateProfile2 } = useUserProfile(user);
  const [draft, setDraft] = useState({
    gender: profile.gender,
    age: profile.age,
    about: profile.about
  });
  const [avatarNotice, setAvatarNotice] = useState(false);
  const avatarNoticeTimer = useRef(null);
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  useEffect(
    () => () => {
      if (avatarNoticeTimer.current) clearTimeout(avatarNoticeTimer.current);
    },
    []
  );
  const name = fullNameOf(user) || initialsOf(user);
  const email = emailOf(user);
  const initials = initialsOf(user);
  const dirty = useMemo(
    () => draft.gender !== profile.gender || draft.age !== profile.age || draft.about !== profile.about,
    [draft, profile]
  );
  function handleAvatarSelect(id) {
    if (id === avatarId) return;
    setAvatarId(id);
    setAvatarNotice(true);
    if (avatarNoticeTimer.current) clearTimeout(avatarNoticeTimer.current);
    avatarNoticeTimer.current = setTimeout(() => setAvatarNotice(false), 2200);
  }
  function handleSave() {
    updateProfile2(draft);
    onClose();
  }
  return createPortal(
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `${dark ? "dark " : ""}fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm`,
        onClick: onClose,
        children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              ref: modalRef,
              className: "relative flex max-h-[90vh] w-full max-w-sm flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900",
              onClick: (e) => e.stopPropagation(),
              role: "dialog",
              "aria-modal": "true",
              "aria-label": "Profile",
              style: { animation: "swn-profile-in 0.22s cubic-bezier(0.34,1.56,0.64,1) both" },
              children: [
                /* @__PURE__ */ jsx("div", { className: "h-1.5 shrink-0 bg-gradient-to-r from-red-500 via-red-600 to-rose-700" }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: onClose,
                    className: "absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300",
                    "aria-label": "Close",
                    children: /* @__PURE__ */ jsx(X, { size: 16 })
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto px-5 pb-5 pt-6", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
                    /* @__PURE__ */ jsx("span", { className: "rounded-full ring-2 ring-gray-100 dark:ring-gray-800", children: /* @__PURE__ */ jsx(Avatar, { url: chosenUrl, initials, size: 80 }) }),
                    /* @__PURE__ */ jsxs("div", { className: "mt-3 text-center", children: [
                      /* @__PURE__ */ jsx("div", { className: "max-w-[16rem] truncate text-base font-semibold text-gray-900 dark:text-gray-100", children: name }),
                      email && /* @__PURE__ */ jsx("div", { className: "max-w-[16rem] truncate text-xs text-gray-500 dark:text-gray-400", children: email }),
                      /* @__PURE__ */ jsxs("div", { className: "mt-1.5 flex items-center justify-center gap-1.5", children: [
                        /* @__PURE__ */ jsxs("span", { className: "relative flex h-2 w-2", children: [
                          /* @__PURE__ */ jsx("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" }),
                          /* @__PURE__ */ jsx("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-green-500" })
                        ] }),
                        /* @__PURE__ */ jsx("span", { className: "text-[11px] font-medium text-green-600 dark:text-green-400", children: "Active session" })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-5", children: [
                    /* @__PURE__ */ jsxs("div", { className: "mb-2 flex min-h-[1.5rem] items-center justify-between gap-2", children: [
                      /* @__PURE__ */ jsx("div", { className: "text-xs font-medium text-gray-700 dark:text-gray-300", children: "Choose your avatar" }),
                      avatarNotice && /* @__PURE__ */ jsxs(
                        "span",
                        {
                          className: "inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/25",
                          "aria-live": "polite",
                          children: [
                            /* @__PURE__ */ jsx(Check, { size: 11 }),
                            "Avatar updated"
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "mb-3 text-[11px] text-gray-500 dark:text-gray-400", children: "Your pick follows you across every aireon app." }),
                    /* @__PURE__ */ jsx("div", { className: "overflow-x-auto overscroll-x-contain rounded-2xl border border-gray-200 bg-gray-50/70 p-2 pb-2.5 dark:border-gray-800 dark:bg-gray-950/30", children: /* @__PURE__ */ jsx("div", { className: "grid w-max auto-cols-[3rem] grid-flow-col grid-rows-3 gap-2.5", children: avatarOptions.map((opt) => {
                      const selected = opt.id === avatarId;
                      const isPhoto = opt.group === "people";
                      return /* @__PURE__ */ jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => handleAvatarSelect(opt.id),
                          title: opt.label,
                          "aria-label": opt.label,
                          "aria-pressed": selected,
                          className: `relative h-12 w-12 border-2 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${isPhoto ? "rounded-full" : "rounded-xl p-1.5"} ${selected ? "border-red-500 ring-2 ring-red-500/30" : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"}`,
                          style: { backgroundColor: opt.tint },
                          children: [
                            /* @__PURE__ */ jsx(
                              "img",
                              {
                                src: avatarUrl(opt),
                                alt: "",
                                className: `h-full w-full ${isPhoto ? "rounded-full object-cover" : "object-contain"}`
                              }
                            ),
                            selected && /* @__PURE__ */ jsx(
                              "span",
                              {
                                "aria-hidden": "true",
                                className: "absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow",
                                children: /* @__PURE__ */ jsx(Check, { size: 12 })
                              }
                            )
                          ]
                        },
                        opt.id
                      );
                    }) }) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-5 space-y-3", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx(
                        "label",
                        {
                          htmlFor: "swn-profile-gender",
                          className: "mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300",
                          children: "Gender"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "select",
                        {
                          id: "swn-profile-gender",
                          value: draft.gender,
                          onChange: (e) => setDraft((d) => ({ ...d, gender: e.target.value })),
                          className: FIELD_CLASS,
                          children: GENDER_OPTIONS.map((opt) => /* @__PURE__ */ jsx("option", { value: opt.value, children: opt.label }, opt.value))
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx(
                        "label",
                        {
                          htmlFor: "swn-profile-age",
                          className: "mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300",
                          children: "Age"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          id: "swn-profile-age",
                          type: "number",
                          min: 0,
                          max: 120,
                          value: draft.age ?? "",
                          onChange: (e) => {
                            const v = e.target.value;
                            setDraft((d) => ({
                              ...d,
                              age: v === "" ? null : Math.max(0, Math.min(120, Number(v)))
                            }));
                          },
                          placeholder: "\u2014",
                          className: FIELD_CLASS
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx(
                        "label",
                        {
                          htmlFor: "swn-profile-about",
                          className: "mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300",
                          children: "About"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "textarea",
                        {
                          id: "swn-profile-about",
                          rows: 3,
                          value: draft.about,
                          onChange: (e) => setDraft((d) => ({ ...d, about: e.target.value })),
                          placeholder: "A short bio (optional)",
                          className: `${FIELD_CLASS} resize-none`
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-5 flex items-center justify-end gap-2", children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: onClose,
                        className: "rounded-xl px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
                        children: "Close"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: handleSave,
                        disabled: !dirty,
                        className: "rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40",
                        children: "Save changes"
                      }
                    )
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsx("style", { children: `@keyframes swn-profile-in{from{opacity:0;transform:scale(0.9) translateY(12px)}to{opacity:1;transform:scale(1) translateY(0)}}` })
        ]
      }
    ),
    document.body
  );
}
function Portal({ children, container }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  const target = container || document.body;
  return createPortal(children, target);
}
var defaultOpenSavedParcel = (record) => {
  const params = new URLSearchParams({
    lat: String(record.parcel_lat),
    lng: String(record.parcel_lng)
  });
  window.location.href = `${window.location.pathname}?${params.toString()}`;
};
function downloadSavedParcelsCsv(records) {
  const headers = [
    "Parcel ID",
    "Address",
    "Municipality",
    "Area (m2)",
    "State",
    "Priority",
    "Tags",
    "Lat",
    "Lng",
    "Updated"
  ];
  const rows = records.map((r) => [
    r.parcel_id,
    r.parcel_label,
    r.parcel_municipality,
    r.parcel_area,
    r.state,
    r.priority,
    (r.tags || []).join("; "),
    r.parcel_lat,
    r.parcel_lng,
    new Date(r.updated_at).toLocaleDateString()
  ]);
  const csv = [headers, ...rows].map(
    (row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")
  ).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `saved_parcels_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
function MapUserMenu({
  dark = false,
  labels,
  locale = "en",
  showSavedParcels = true,
  savedParcelsOpenHereLabel,
  extraItems = [],
  toolbarItems = [],
  toolbarLabel = "More tools",
  dropdownSummary,
  dropdownWidth = "default",
  onOpenSavedParcel = defaultOpenSavedParcel
}) {
  const { user, isLoading, login, logout, getAccessToken } = useAuth();
  const { avatarUrl: avatarUrl2 } = useUserProfile(user);
  const [open, setOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showParcels, setShowParcels] = useState(false);
  const [parcelRecords, setParcelRecords] = useState([]);
  const [parcelStatus, setParcelStatus] = useState("idle");
  const [parcelError, setParcelError] = useState(null);
  const menuRef = useRef(null);
  const accessToken = getAccessToken() ?? null;
  const parcelStrings = getSavedParcelsStrings(locale);
  const hasCustomDropdownSummary = dropdownSummary != null;
  const shouldLoadSavedSummary = showSavedParcels && !hasCustomDropdownSummary;
  useEffect(() => {
    const close = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const refreshSavedParcels = useCallback(() => {
    if (!shouldLoadSavedSummary || !user || !accessToken) {
      setParcelRecords([]);
      setParcelStatus("idle");
      setParcelError(null);
      return;
    }
    setParcelStatus("loading");
    setParcelError(null);
    fetchPrmRecords(accessToken).then((records) => {
      setParcelRecords(records);
      setParcelStatus("ready");
    }).catch((err) => {
      setParcelError(String(err?.message ?? err));
      setParcelStatus("error");
    });
  }, [accessToken, shouldLoadSavedSummary, user]);
  useEffect(() => {
    refreshSavedParcels();
  }, [refreshSavedParcels]);
  const savedParcelStats = useMemo(() => {
    const byState = PRM_STATES.reduce((acc, state) => {
      acc[state.value] = 0;
      return acc;
    }, {});
    for (const record of parcelRecords) {
      byState[record.state] = (byState[record.state] ?? 0) + 1;
    }
    return { total: parcelRecords.length, byState };
  }, [parcelRecords]);
  const openSavedParcels = () => {
    setOpen(false);
    setShowParcels(true);
  };
  const renderToolItem = (item) => /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      role: "menuitem",
      disabled: item.disabled,
      onClick: () => {
        if (item.disabled) return;
        setOpen(false);
        item.onClick();
      },
      className: `map-shell-user-tool-item ${item.danger ? "map-shell-user-tool-item--danger" : ""}`,
      children: [
        item.icon,
        /* @__PURE__ */ jsx("span", { children: item.label }),
        item.badge && /* @__PURE__ */ jsx("span", { className: "map-shell-user-menu-badge", children: item.badge }),
        item.dot && /* @__PURE__ */ jsx("span", { className: "map-shell-user-menu-dot", "aria-hidden": "true" })
      ]
    },
    item.key
  );
  if (isLoading) {
    return /* @__PURE__ */ jsx(Skeleton, { circle: true, width: 36, dark });
  }
  if (!user) {
    const publicItems = toolbarItems.filter((item) => item.signedOut);
    if (publicItems.length === 0) {
      return /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => login(),
          className: "map-shell-user-button map-shell-user-button--signed-out",
          "aria-label": labels.signIn,
          title: labels.signIn,
          children: /* @__PURE__ */ jsx(CircleUser, { size: 20, "aria-hidden": "true" })
        }
      );
    }
    return /* @__PURE__ */ jsxs("div", { ref: menuRef, className: "relative flex-shrink-0", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setOpen((v) => !v),
          className: "map-shell-user-button map-shell-user-button--signed-out",
          "aria-label": labels.userMenu,
          "aria-haspopup": "menu",
          "aria-expanded": open,
          children: /* @__PURE__ */ jsx(CircleUser, { size: 20, "aria-hidden": "true" })
        }
      ),
      open && /* @__PURE__ */ jsxs(
        "div",
        {
          className: `map-shell-user-dropdown ${dropdownWidth === "wide" ? "map-shell-user-dropdown--wide" : ""}`,
          role: "menu",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "map-shell-user-tools", children: [
              /* @__PURE__ */ jsx("p", { className: "map-shell-user-section-label", children: toolbarLabel }),
              publicItems.map(renderToolItem)
            ] }),
            /* @__PURE__ */ jsx("div", { className: "py-1", children: /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                role: "menuitem",
                onClick: () => {
                  setOpen(false);
                  login();
                },
                className: "map-shell-user-menu-item",
                children: [
                  /* @__PURE__ */ jsx(CircleUser, { size: 16, "aria-hidden": "true" }),
                  labels.signIn
                ]
              }
            ) })
          ]
        }
      )
    ] });
  }
  const firstName = firstNameOf(user);
  const displayName = fullNameOf(user);
  const email = emailOf(user);
  const initials = initialsOf(user);
  const hasBuiltInSavedSummary = shouldLoadSavedSummary;
  const isWideDropdown = dropdownWidth === "wide" || hasBuiltInSavedSummary;
  const dropdownClassName = `map-shell-user-dropdown ${isWideDropdown ? "map-shell-user-dropdown--wide" : ""}`;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { ref: menuRef, className: "relative flex-shrink-0", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => setOpen((v) => !v),
          className: "map-shell-user-button",
          "aria-label": labels.userMenu,
          "aria-haspopup": "menu",
          "aria-expanded": open,
          children: [
            /* @__PURE__ */ jsx("span", { className: "map-shell-user-avatar", children: /* @__PURE__ */ jsx(Avatar, { url: avatarUrl2, initials, size: 28 }) }),
            /* @__PURE__ */ jsx("span", { className: "map-shell-user-name", children: firstName || displayName || labels.fallbackUser }),
            /* @__PURE__ */ jsx(
              ChevronDown,
              {
                size: 14,
                "aria-hidden": "true",
                className: `map-shell-user-chevron ${open ? "map-shell-user-chevron--open" : ""}`
              }
            )
          ]
        }
      ),
      open && /* @__PURE__ */ jsxs(
        "div",
        {
          className: dropdownClassName,
          role: "menu",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "map-shell-user-card", children: [
              /* @__PURE__ */ jsx(Avatar, { url: avatarUrl2, initials, size: 40 }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsx("p", { className: "map-shell-user-display-name", children: displayName || firstName || labels.fallbackUser }),
                email && /* @__PURE__ */ jsx("p", { className: "map-shell-user-email", children: email }),
                /* @__PURE__ */ jsxs("div", { className: "map-shell-user-active-row", children: [
                  /* @__PURE__ */ jsxs("div", { className: "map-shell-user-active", children: [
                    /* @__PURE__ */ jsxs("span", { className: "map-shell-user-active-dot", children: [
                      /* @__PURE__ */ jsx("span", {}),
                      /* @__PURE__ */ jsx("span", {})
                    ] }),
                    /* @__PURE__ */ jsx("span", { children: labels.active })
                  ] }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      role: "menuitem",
                      onClick: () => {
                        setOpen(false);
                        setShowProfile(true);
                      },
                      className: "map-shell-user-manage",
                      "aria-label": labels.manageProfile ?? labels.viewProfile,
                      title: labels.manageProfile ?? labels.viewProfile,
                      children: parcelStrings.editProfile
                    }
                  )
                ] })
              ] })
            ] }),
            dropdownSummary && /* @__PURE__ */ jsx("div", { className: "map-shell-user-summary", children: dropdownSummary }),
            hasBuiltInSavedSummary && /* @__PURE__ */ jsxs("div", { className: "map-shell-user-summary", children: [
              /* @__PURE__ */ jsxs("div", { className: "map-shell-user-saved-head", children: [
                /* @__PURE__ */ jsxs("div", { className: "map-shell-user-saved-title", children: [
                  /* @__PURE__ */ jsx(Layers, { size: 14, "aria-hidden": "true" }),
                  /* @__PURE__ */ jsx("span", { children: labels.savedParcels })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: refreshSavedParcels,
                    className: "map-shell-user-saved-refresh",
                    "aria-label": parcelStrings.refresh,
                    title: parcelStrings.refresh,
                    children: /* @__PURE__ */ jsx(
                      RefreshCw,
                      {
                        size: 12,
                        "aria-hidden": "true",
                        className: parcelStatus === "loading" ? "map-shell-spin" : void 0
                      }
                    )
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "map-shell-user-saved-main", children: [
                /* @__PURE__ */ jsxs("div", { className: "map-shell-user-saved-total", children: [
                  /* @__PURE__ */ jsx("span", { className: "map-shell-user-saved-count", children: savedParcelStats.total }),
                  /* @__PURE__ */ jsx("span", { className: "map-shell-user-saved-total-label", children: parcelStrings.totalParcels })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "map-shell-user-saved-actions", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: openSavedParcels,
                      className: "map-shell-user-saved-action",
                      "aria-label": parcelStrings.title,
                      title: parcelStrings.title,
                      children: /* @__PURE__ */ jsx(Table2, { size: 16, "aria-hidden": "true" })
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => downloadSavedParcelsCsv(parcelRecords),
                      disabled: parcelRecords.length === 0,
                      className: "map-shell-user-saved-action",
                      "aria-label": parcelStrings.exportCsv,
                      title: parcelStrings.exportCsv,
                      children: /* @__PURE__ */ jsx(Download, { size: 16, "aria-hidden": "true" })
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: `${PROOM_APP_URL}/`,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className: "map-shell-user-saved-action",
                      "aria-label": parcelStrings.openInProom,
                      title: parcelStrings.openInProom,
                      children: /* @__PURE__ */ jsx(ExternalLink, { size: 16, "aria-hidden": "true" })
                    }
                  )
                ] })
              ] }),
              parcelStatus === "error" && /* @__PURE__ */ jsxs("p", { className: "map-shell-user-saved-error", children: [
                parcelStrings.loadFailed,
                parcelError ? `: ${parcelError}` : ""
              ] }),
              /* @__PURE__ */ jsx("div", { className: "map-shell-user-saved-grid", children: PRM_STATES.map((state) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "map-shell-user-saved-state",
                  title: parcelStrings.state[state.value],
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "map-shell-user-saved-state-count", children: savedParcelStats.byState[state.value] ?? 0 }),
                    /* @__PURE__ */ jsx("div", { className: "map-shell-user-saved-state-label", children: parcelStrings.state[state.value] })
                  ]
                },
                state.value
              )) })
            ] }),
            toolbarItems.length > 0 && /* @__PURE__ */ jsxs("div", { className: "map-shell-user-tools", children: [
              /* @__PURE__ */ jsx("p", { className: "map-shell-user-section-label", children: toolbarLabel }),
              toolbarItems.map(renderToolItem)
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "py-1", children: [
              extraItems.map((item) => /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  role: "menuitem",
                  disabled: item.disabled,
                  onClick: () => {
                    if (item.disabled) return;
                    setOpen(false);
                    item.onClick();
                  },
                  className: `map-shell-user-menu-item ${item.danger ? "map-shell-user-menu-item--danger" : ""}`,
                  children: [
                    item.icon,
                    /* @__PURE__ */ jsx("span", { children: item.label }),
                    item.badge && /* @__PURE__ */ jsx("span", { className: "map-shell-user-menu-badge", children: item.badge }),
                    item.dot && /* @__PURE__ */ jsx("span", { className: "map-shell-user-menu-dot", "aria-hidden": "true" })
                  ]
                },
                item.key
              )),
              showSavedParcels && hasCustomDropdownSummary && /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  role: "menuitem",
                  onClick: () => {
                    openSavedParcels();
                  },
                  className: "map-shell-user-menu-item",
                  children: [
                    /* @__PURE__ */ jsx(Table2, { size: 16, "aria-hidden": "true" }),
                    labels.savedParcels
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  role: "menuitem",
                  onClick: () => {
                    setOpen(false);
                    logout();
                  },
                  className: "map-shell-user-menu-item map-shell-user-menu-item--danger",
                  children: [
                    /* @__PURE__ */ jsx(LogOut, { size: 16, "aria-hidden": "true" }),
                    labels.signOut
                  ]
                }
              )
            ] })
          ]
        }
      )
    ] }),
    showProfile && /* @__PURE__ */ jsx(ProfileModal, { user, onClose: () => setShowProfile(false), dark }),
    showParcels && /* @__PURE__ */ jsx(
      SavedParcelsModal,
      {
        locale,
        dark,
        onClose: () => {
          setShowParcels(false);
          refreshSavedParcels();
        },
        openHereLabel: savedParcelsOpenHereLabel,
        onOpenHere: (record) => {
          setShowParcels(false);
          refreshSavedParcels();
          onOpenSavedParcel(record);
        }
      }
    )
  ] });
}
var MapUserMenu_default = MapUserMenu;
var LIGHT_STYLE = "mapbox://styles/mapbox/light-v11";
var DARK_STYLE = "mapbox://styles/mapbox/dark-v11";
var STATIC_STYLE = "mapbox/light-v11";
var DEFAULT_ZOOM = 16.5;
var METERS_PER_DEGREE_AT_EQUATOR = 111319.9;
var PARCEL_TILES_URL = "https://res-mbtiles-x.gisjoe.com/parcel_2025_07_z12_16";
var PARCEL_SOURCE_LAYER = "parcel_2025_07";
var PARCEL_ID_PROP = "parcel_id";
var SCOORE_RADIUS_CIRCLES = [
  { radius: 100, label: "100 m" },
  { radius: 200, label: "200 m" },
  { radius: 500, label: "500 m" }
];
var SCOORE_CATEGORY_COLORS = {
  Groceries: "#EF4444",
  Food_Dining: "#F97316",
  Utilities: "#14B8A6",
  Public_Services: "#EC4899",
  Health: "#EAB308",
  Transport: "#3B82F6",
  Education: "#0EA5E9",
  Recreation: "#22C55E",
  Community: "#8B5CF6",
  Outdoor: "#10B981"
};
function createScooreCircleGeoJSON(centerLng, centerLat, radiusMeters, points = 64) {
  const coords = [];
  const latRad = centerLat * (Math.PI / 180);
  for (let i = 0; i <= points; i += 1) {
    const angle = i / points * 2 * Math.PI;
    const dLat = radiusMeters / METERS_PER_DEGREE_AT_EQUATOR * Math.cos(angle);
    const dLng = radiusMeters / (METERS_PER_DEGREE_AT_EQUATOR * Math.cos(latRad)) * Math.sin(angle);
    coords.push([centerLng + dLng, centerLat + dLat]);
  }
  return {
    type: "Feature",
    properties: {},
    geometry: { type: "Polygon", coordinates: [coords] }
  };
}
function formatDistance2(metres) {
  if (!Number.isFinite(metres)) return "";
  return metres >= 1e3 ? `${(metres / 1e3).toFixed(1)} km` : `${Math.round(metres)} m`;
}
function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function staticThumbUrl(lat, lng, token) {
  const pin = `pin-s+dc2626(${lng},${lat})`;
  return `https://api.mapbox.com/styles/v1/${STATIC_STYLE}/static/${pin}/${lng},${lat},16.5,0/640x360@2x?access_token=${token}`;
}
function addRadiusCircles(map, lng, lat) {
  SCOORE_RADIUS_CIRCLES.forEach(({ radius, label }) => {
    const sourceId = `scoore-mini-radius-${radius}`;
    const fillId = `${sourceId}-fill`;
    const lineId = `${sourceId}-line`;
    const labelId = `${sourceId}-label`;
    const labelSourceId = `${sourceId}-label-src`;
    const geojson = createScooreCircleGeoJSON(lng, lat, radius);
    const source = map.getSource(sourceId);
    if (source) {
      source.setData(geojson);
    } else {
      map.addSource(sourceId, { type: "geojson", data: geojson });
    }
    if (!map.getLayer(fillId)) {
      map.addLayer({
        id: fillId,
        type: "fill",
        source: sourceId,
        paint: { "fill-color": "#dc2626", "fill-opacity": 0.04 }
      });
    }
    if (!map.getLayer(lineId)) {
      map.addLayer({
        id: lineId,
        type: "line",
        source: sourceId,
        paint: {
          "line-color": "#dc2626",
          "line-width": 1.2,
          "line-opacity": 0.5,
          "line-dasharray": [4, 3]
        }
      });
    }
    const labelPoint = createScooreCircleGeoJSON(lng, lat, radius, 1);
    const topCoord = labelPoint.geometry.coordinates[0][0];
    const labelData = {
      type: "Feature",
      properties: { label },
      geometry: { type: "Point", coordinates: topCoord }
    };
    const labelSource = map.getSource(labelSourceId);
    if (labelSource) {
      labelSource.setData(labelData);
    } else {
      map.addSource(labelSourceId, { type: "geojson", data: labelData });
    }
    if (!map.getLayer(labelId)) {
      map.addLayer({
        id: labelId,
        type: "symbol",
        source: labelSourceId,
        layout: {
          "text-field": ["get", "label"],
          "text-size": 10,
          "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
          "text-offset": [0, -0.6],
          "text-anchor": "bottom"
        },
        paint: {
          "text-color": "#dc2626",
          "text-halo-color": "rgba(255,255,255,0.9)",
          "text-halo-width": 1.2,
          "text-opacity": 0.78
        }
      });
    }
  });
}
function addParcelLayers(map) {
  if (map.getSource("scoore-mini-parcel-tiles")) return;
  map.addSource("scoore-mini-parcel-tiles", {
    type: "vector",
    url: PARCEL_TILES_URL,
    promoteId: { [PARCEL_SOURCE_LAYER]: PARCEL_ID_PROP }
  });
  const firstSymbolId = map.getStyle().layers?.find((layer) => layer.type === "symbol")?.id;
  map.addLayer(
    {
      id: "scoore-mini-parcel-fill",
      type: "fill",
      source: "scoore-mini-parcel-tiles",
      "source-layer": PARCEL_SOURCE_LAYER,
      paint: { "fill-color": "#000", "fill-opacity": 1e-3 }
    },
    firstSymbolId
  );
  map.addLayer(
    {
      id: "scoore-mini-parcel-outline",
      type: "line",
      source: "scoore-mini-parcel-tiles",
      "source-layer": PARCEL_SOURCE_LAYER,
      paint: {
        "line-color": "#475569",
        "line-width": ["interpolate", ["linear"], ["zoom"], 12, 0.5, 16, 1.5],
        "line-opacity": 0.75
      }
    },
    firstSymbolId
  );
  map.addLayer(
    {
      id: "scoore-mini-parcel-selected-fill",
      type: "fill",
      source: "scoore-mini-parcel-tiles",
      "source-layer": PARCEL_SOURCE_LAYER,
      paint: {
        "fill-color": "#ffffff",
        "fill-opacity": ["case", ["boolean", ["feature-state", "selected"], false], 0.28, 0]
      }
    },
    firstSymbolId
  );
  map.addLayer(
    {
      id: "scoore-mini-parcel-selected-outline",
      type: "line",
      source: "scoore-mini-parcel-tiles",
      "source-layer": PARCEL_SOURCE_LAYER,
      paint: {
        "line-color": "#ffffff",
        "line-width": ["case", ["boolean", ["feature-state", "selected"], false], 2.5, 0],
        "line-opacity": ["case", ["boolean", ["feature-state", "selected"], false], 1, 0]
      }
    },
    firstSymbolId
  );
}
function buildPoiPopupHtml(point, color) {
  return [
    '<div style="font-family:system-ui,-apple-system,sans-serif;min-width:180px;max-width:260px;">',
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">',
    `<span style="width:22px;height:22px;border-radius:50%;background:${color};color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">${escapeHtml(point.categoryLabel.slice(0, 1))}</span>`,
    `<span style="font-weight:650;font-size:13px;color:inherit;">${escapeHtml(point.name)}</span>`,
    "</div>",
    '<div style="display:flex;gap:6px;flex-wrap:wrap;">',
    `<span style="font-size:10px;padding:2px 8px;border-radius:9999px;background:${color}20;color:${color};font-weight:600;">${escapeHtml(point.categoryLabel)}</span>`,
    `<span style="font-size:10px;padding:2px 8px;border-radius:9999px;background:rgba(120,120,120,.15);font-weight:600;">${escapeHtml(formatDistance2(point.distance))}</span>`,
    "</div>",
    "</div>"
  ].join("");
}
function clearMarkers(markers) {
  markers.forEach((marker) => marker.remove());
}
function ScooreMiniMap({
  lat,
  lng,
  mapboxToken,
  address,
  points = [],
  score,
  labels,
  isDarkMode = false,
  className = "",
  mapClassName = "h-52",
  maxInitialPoiDistance = 2e3,
  preserveDrawingBuffer = true
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const maplibreRef = useRef(null);
  const markersRef = useRef([]);
  const sourceMarkerRef = useRef(null);
  const popupRef = useRef(null);
  const selectedParcelIdRef = useRef(null);
  const [failed, setFailed] = useState(false);
  const validCoords = Number.isFinite(lat) && Number.isFinite(lng) && (lat !== 0 || lng !== 0);
  const sortedPoints = useMemo(
    () => points.filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng)).slice().sort((a, b) => a.distance - b.distance),
    [points]
  );
  useEffect(() => {
    if (!validCoords || !containerRef.current || !mapboxToken) return;
    let cancelled = false;
    let map = null;
    (async () => {
      try {
        const [loaded, style] = await Promise.all([
          import('maplibre-gl'),
          // MapLibre can't consume `mapbox://` styles directly — resolve the
          // Mapbox style doc (mapbox:// → https + token) via the shared loader.
          loadMapboxStyleForMapLibre(isDarkMode ? DARK_STYLE : LIGHT_STYLE, { token: mapboxToken })
        ]);
        const mod = loaded.default ?? loaded;
        if (cancelled || !containerRef.current) return;
        maplibreRef.current = mod;
        map = new mod.Map({
          container: containerRef.current,
          style,
          center: [lng, lat],
          zoom: DEFAULT_ZOOM,
          attributionControl: false,
          interactive: true,
          pitch: 0,
          bearing: 0,
          // MapLibre v5 moved the WebGL canvas attrs into canvasContextAttributes.
          canvasContextAttributes: { antialias: true, preserveDrawingBuffer }
        });
        map.addControl(new mod.AttributionControl({ compact: true }), "bottom-left");
        mapRef.current = map;
        map.on("style.load", () => {
          if (!map) return;
          addParcelLayers(map);
          addRadiusCircles(map, lng, lat);
        });
        map.on("idle", () => {
          if (!map || !map.getLayer("scoore-mini-parcel-fill")) return;
          const point = map.project([lng, lat]);
          const hit = map.queryRenderedFeatures(point, {
            layers: ["scoore-mini-parcel-fill"]
          })[0];
          const id = hit?.id;
          if (id == null || selectedParcelIdRef.current === id) return;
          if (selectedParcelIdRef.current != null) {
            map.setFeatureState(
              {
                source: "scoore-mini-parcel-tiles",
                sourceLayer: PARCEL_SOURCE_LAYER,
                id: selectedParcelIdRef.current
              },
              { selected: false }
            );
          }
          selectedParcelIdRef.current = id;
          map.setFeatureState(
            { source: "scoore-mini-parcel-tiles", sourceLayer: PARCEL_SOURCE_LAYER, id },
            { selected: true }
          );
        });
        map.on("error", () => {
        });
        requestAnimationFrame(() => {
          if (!cancelled) map?.resize();
        });
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
      popupRef.current?.remove();
      clearMarkers(markersRef.current);
      markersRef.current = [];
      sourceMarkerRef.current?.remove();
      map?.remove();
      mapRef.current = null;
      selectedParcelIdRef.current = null;
    };
  }, [validCoords, lat, lng, mapboxToken, isDarkMode, preserveDrawingBuffer]);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !validCoords) return;
    const apply = () => addRadiusCircles(map, lng, lat);
    if (map.isStyleLoaded()) apply();
    else map.once("style.load", apply);
  }, [validCoords, lat, lng]);
  useEffect(() => {
    const map = mapRef.current;
    const maplibre = maplibreRef.current;
    if (!map || !maplibre || !validCoords) return;
    sourceMarkerRef.current?.remove();
    const el = document.createElement("div");
    el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 24 30" fill="none"><path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 18 12 18s12-9 12-18C24 5.4 18.6 0 12 0z" fill="#dc2626"/><circle cx="12" cy="11" r="4.5" fill="white"/></svg>';
    sourceMarkerRef.current = new maplibre.Marker({ element: el, anchor: "bottom" }).setLngLat([lng, lat]).addTo(map);
    const bounds = new maplibre.LngLatBounds();
    bounds.extend([lng, lat]);
    sortedPoints.forEach((point) => {
      if (point.distance <= maxInitialPoiDistance) bounds.extend([point.lng, point.lat]);
    });
    map.fitBounds(bounds, { padding: 42, maxZoom: DEFAULT_ZOOM, duration: 500 });
  }, [validCoords, lat, lng, sortedPoints, maxInitialPoiDistance]);
  useEffect(() => {
    const map = mapRef.current;
    const maplibre = maplibreRef.current;
    if (!map || !maplibre) return;
    popupRef.current?.remove();
    clearMarkers(markersRef.current);
    markersRef.current = [];
    sortedPoints.forEach((point, index) => {
      const color = SCOORE_CATEGORY_COLORS[point.category] ?? "#64748b";
      const el = document.createElement("button");
      el.type = "button";
      el.setAttribute("aria-label", `${point.categoryLabel}: ${point.name}`);
      el.style.cssText = "width:24px;height:24px;border:0;padding:0;background:transparent;cursor:pointer;";
      const inner = document.createElement("span");
      inner.style.cssText = `width:24px;height:24px;border-radius:50%;background:${color};color:white;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;border:2px solid rgba(255,255,255,0.92);box-shadow:0 1px 4px rgba(0,0,0,0.35);transition:transform 0.15s ease;`;
      inner.textContent = String(index + 1);
      el.appendChild(inner);
      el.addEventListener("mouseenter", () => {
        inner.style.transform = "scale(1.2)";
      });
      el.addEventListener("mouseleave", () => {
        inner.style.transform = "scale(1)";
      });
      el.addEventListener("click", (event) => {
        event.stopPropagation();
        popupRef.current?.remove();
        popupRef.current = new maplibre.Popup({
          offset: 16,
          closeButton: true,
          closeOnClick: true,
          maxWidth: "280px",
          className: "scoore-popup"
        }).setLngLat([point.lng, point.lat]).setHTML(buildPoiPopupHtml(point, color)).addTo(map);
      });
      markersRef.current.push(new maplibre.Marker({ element: el }).setLngLat([point.lng, point.lat]).addTo(map));
    });
  }, [sortedPoints]);
  if (!validCoords) return null;
  const title = labels?.title ?? "Scoore mini-map";
  const scoreText = score && Number.isFinite(score.total) ? `${score.total.toFixed(1)} / 6` : null;
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-screenshot-ignore": "true",
      className: `overflow-hidden rounded-lg ring-1 ring-black/[0.08] dark:ring-white/[0.08] bg-white dark:bg-white/[0.03] shadow-sm ${className}`,
      children: /* @__PURE__ */ jsxs("div", { className: `relative w-full bg-gray-100 dark:bg-white/[0.04] ${mapClassName}`, children: [
        failed ? /* @__PURE__ */ jsx(
          "img",
          {
            src: staticThumbUrl(lat, lng, mapboxToken),
            alt: labels?.ariaLabel ?? (address ? `Map of ${address}` : title),
            className: "absolute inset-0 h-full w-full object-cover",
            loading: "lazy",
            decoding: "async"
          }
        ) : /* @__PURE__ */ jsx(
          "div",
          {
            ref: containerRef,
            className: "absolute inset-0",
            "aria-label": labels?.ariaLabel ?? (address ? `Map of ${address}` : title)
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "absolute left-2 top-2 z-10 flex flex-wrap items-center gap-1.5", children: [
          /* @__PURE__ */ jsx("span", { className: "inline-flex h-6 items-center rounded-md bg-black/60 px-2 text-[10px] font-semibold text-white backdrop-blur-sm", children: title }),
          scoreText && /* @__PURE__ */ jsxs("span", { className: "inline-flex h-6 items-center rounded-md bg-white/90 px-2 text-[10px] font-bold text-gray-900 ring-1 ring-black/10 backdrop-blur-sm dark:bg-gray-950/85 dark:text-white dark:ring-white/10", children: [
            labels?.scoreLabel ?? "Score",
            ": ",
            scoreText
          ] })
        ] }),
        sortedPoints.length === 0 && /* @__PURE__ */ jsx("span", { className: "absolute bottom-2 left-2 z-10 rounded-md bg-white/90 px-2 py-1 text-[10px] font-medium text-gray-700 ring-1 ring-black/10 backdrop-blur-sm dark:bg-gray-950/85 dark:text-slate-200 dark:ring-white/10", children: labels?.noPoiData ?? "No Scoore POIs loaded yet" })
      ] })
    }
  );
}
var ScooreMiniMap_default = ScooreMiniMap;
function aerialThumbnailZoom(areaM2, lat, imgWidthPx) {
  const widthM = areaM2 && areaM2 > 0 ? Math.sqrt(areaM2) : 28;
  const cosLat = Math.cos(lat * Math.PI / 180);
  const targetFraction = 0.5;
  const z = Math.log2(156543.03 * cosLat * targetFraction * imgWidthPx / widthM);
  const clamped = Math.max(15, Math.min(19.5, z));
  return Math.round(clamped * 10) / 10;
}
function buildSwisstopoAerialUrl(lng, lat, zoom, sizePx) {
  const cosLat = Math.cos(lat * Math.PI / 180);
  const groundM = sizePx * 156543.03 * cosLat / 2 ** zoom;
  const dLat = groundM / 111320;
  const dLng = groundM / (111320 * cosLat);
  const bbox = `${lng - dLng / 2},${lat - dLat / 2},${lng + dLng / 2},${lat + dLat / 2}`;
  const params = new URLSearchParams({
    SERVICE: "WMS",
    VERSION: "1.1.1",
    REQUEST: "GetMap",
    LAYERS: "ch.swisstopo.swissimage",
    STYLES: "",
    SRS: "EPSG:4326",
    BBOX: bbox,
    WIDTH: String(Math.round(sizePx * 2)),
    HEIGHT: String(Math.round(sizePx * 2)),
    FORMAT: "image/jpeg"
  });
  return `https://wms.geo.admin.ch/?${params.toString()}`;
}
var AerialLightbox = ({
  url,
  dark,
  labels,
  attribution,
  onClose
}) => {
  const [loaded, setLoaded] = useState(false);
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, []);
  return createPortal(
    /* @__PURE__ */ jsxs(
      "div",
      {
        role: "dialog",
        "aria-modal": "true",
        "aria-label": labels.dialogAria,
        className: "fixed inset-0 flex items-center justify-center p-4",
        style: { zIndex: Z_INDEX.overlay },
        children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/70 backdrop-blur-sm", onClick: onClose }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: `relative rounded-xl overflow-hidden shadow-2xl ring-1 ${dark ? "ring-white/10 bg-gray-800" : "ring-black/10 bg-gray-100"}`,
              style: { width: "min(90vw, 85vh, 560px)", aspectRatio: "1 / 1" },
              children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: url,
                    alt: labels.imageAlt,
                    onLoad: () => setLoaded(true),
                    className: `w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`
                  }
                ),
                !loaded && /* @__PURE__ */ jsx("div", { className: `absolute inset-0 flex items-center justify-center ${dark ? "text-gray-500" : "text-gray-400"}`, children: /* @__PURE__ */ jsx(Map$1, { size: 28, className: "animate-pulse" }) }),
                loaded && /* @__PURE__ */ jsx("div", { "aria-hidden": true, className: "absolute inset-0 flex items-center justify-center pointer-events-none", children: /* @__PURE__ */ jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-white ring-2 ring-black/50 shadow" }) }),
                /* @__PURE__ */ jsx("span", { className: "absolute bottom-1 right-1.5 px-1 text-[10px] leading-tight text-white/90 bg-black/40 rounded pointer-events-none select-none", children: attribution }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    ref: closeRef,
                    type: "button",
                    onClick: onClose,
                    "aria-label": labels.close,
                    className: "absolute top-2 right-2 w-8 h-8 rounded-full bg-black/45 text-white hover:bg-black/65 flex items-center justify-center transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/80",
                    children: /* @__PURE__ */ jsx(X, { size: 18 })
                  }
                )
              ]
            }
          )
        ]
      }
    ),
    document.body
  );
};
var ParcelAerialThumbnail = ({
  lng,
  lat,
  areaM2 = null,
  zoom,
  sizePx = 88,
  expandedPx = 480,
  dark = false,
  labels,
  className,
  attribution = "\xA9 swisstopo"
}) => {
  const url = useMemo(() => {
    const z = zoom ?? aerialThumbnailZoom(areaM2, lat, sizePx);
    return buildSwisstopoAerialUrl(lng, lat, z, sizePx);
  }, [lng, lat, areaM2, zoom, sizePx]);
  const expandedUrl = useMemo(() => {
    const z = zoom != null ? Math.max(14, zoom - 1.2) : Math.max(14, aerialThumbnailZoom(areaM2, lat, expandedPx) - 1.2);
    return buildSwisstopoAerialUrl(lng, lat, z, expandedPx);
  }, [lng, lat, areaM2, zoom, expandedPx]);
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const triggerRef = useRef(null);
  useEffect(() => {
    setLoaded(false);
    setErrored(false);
  }, [url]);
  const closeLightbox = () => {
    setExpanded(false);
    triggerRef.current?.focus();
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        ref: triggerRef,
        type: "button",
        onClick: () => setExpanded(true),
        disabled: errored,
        "aria-label": labels.expand,
        className: `group relative shrink-0 rounded-lg overflow-hidden ring-1 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${errored ? "cursor-default" : "cursor-pointer"} ${dark ? "ring-white/[0.08] bg-white/[0.04]" : "ring-gray-200 bg-gray-100"}${className ? ` ${className}` : ""}`,
        style: { width: sizePx, height: sizePx },
        children: [
          !errored && /* @__PURE__ */ jsx(
            "img",
            {
              src: url,
              alt: labels.imageAlt,
              width: sizePx,
              height: sizePx,
              loading: "lazy",
              decoding: "async",
              onLoad: () => setLoaded(true),
              onError: () => setErrored(true),
              className: `w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`
            }
          ),
          (!loaded || errored) && /* @__PURE__ */ jsx(
            "div",
            {
              className: `absolute inset-0 flex items-center justify-center ${dark ? "text-gray-500" : "text-gray-400"}`,
              children: /* @__PURE__ */ jsx(Map$1, { size: 18, className: errored ? "" : "animate-pulse" })
            }
          ),
          loaded && !errored && /* @__PURE__ */ jsx(
            "div",
            {
              "aria-hidden": true,
              className: "absolute inset-0 flex items-center justify-center pointer-events-none",
              children: /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-white ring-2 ring-black/40 shadow-sm" })
            }
          ),
          loaded && !errored && /* @__PURE__ */ jsx(
            "span",
            {
              "aria-hidden": true,
              className: "absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 group-focus-visible:bg-black/30 transition-colors",
              children: /* @__PURE__ */ jsx(
                Maximize2,
                {
                  size: 16,
                  className: "text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity drop-shadow"
                }
              )
            }
          ),
          loaded && !errored && /* @__PURE__ */ jsx("span", { className: "absolute bottom-0 right-0 px-0.5 text-[7px] leading-tight text-white/85 bg-black/35 rounded-tl pointer-events-none select-none", children: attribution })
        ]
      }
    ),
    expanded && /* @__PURE__ */ jsx(
      AerialLightbox,
      {
        url: expandedUrl,
        dark,
        labels,
        attribution,
        onClose: closeLightbox
      }
    )
  ] });
};
var ParcelAerialThumbnail_default = ParcelAerialThumbnail;
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    if (mql.addEventListener) mql.addEventListener("change", onChange);
    else mql.addListener(onChange);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", onChange);
      else mql.removeListener(onChange);
    };
  }, [query]);
  return matches;
}
function InlineButton({ item, onAfter }) {
  if (item.render) return /* @__PURE__ */ jsx(Fragment, { children: item.render("inline") });
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      onClick: () => {
        if (item.disabled) return;
        item.onSelect?.();
        onAfter?.();
      },
      disabled: item.disabled,
      "aria-label": item.label,
      title: item.label,
      "aria-current": item.active ? "true" : void 0,
      className: "aireon-onav-btn" + (item.active ? " aireon-onav-btn--active" : "") + (item.danger ? " aireon-onav-btn--danger" : ""),
      children: [
        item.icon,
        item.badge != null && /* @__PURE__ */ jsx("span", { className: "aireon-onav-btn-badge", children: item.badge })
      ]
    }
  );
}
function OverflowNav({
  items,
  dark = false,
  collapseBelow = 768,
  moreLabel = "More",
  menuLabel,
  className
}) {
  const isMobile = useMediaQuery(`(max-width: ${collapseBelow - 1}px)`);
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const menuId = useId();
  useEffect(() => {
    if (!open) return;
    const onPointer = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  useEffect(() => {
    if (!isMobile) setOpen(false);
  }, [isMobile]);
  const rootClass = "aireon-onav" + (dark ? " aireon-onav--dark" : "") + (className ? ` ${className}` : "");
  if (!isMobile) {
    return /* @__PURE__ */ jsx("div", { ref: rootRef, className: rootClass, children: items.map((item) => /* @__PURE__ */ jsx(InlineButton, { item }, item.key)) });
  }
  const visible = items.filter((it2) => it2.keepInline && !it2.desktopOnly);
  const collapsed = items.filter((it2) => !it2.keepInline && !it2.desktopOnly);
  const hasBadge = collapsed.some((it2) => it2.badge != null);
  return /* @__PURE__ */ jsxs("div", { ref: rootRef, className: rootClass, children: [
    visible.map((item) => /* @__PURE__ */ jsx(InlineButton, { item }, item.key)),
    collapsed.length > 0 && /* @__PURE__ */ jsxs("div", { className: "aireon-onav-more", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          ref: triggerRef,
          type: "button",
          onClick: () => setOpen((v) => !v),
          "aria-label": moreLabel,
          title: moreLabel,
          "aria-haspopup": "menu",
          "aria-expanded": open,
          "aria-controls": menuId,
          className: "aireon-onav-btn" + (open ? " aireon-onav-btn--active" : ""),
          children: [
            /* @__PURE__ */ jsx(MoreHorizontal, { size: 20, "aria-hidden": "true" }),
            hasBadge && /* @__PURE__ */ jsx("span", { className: "aireon-onav-btn-badge aireon-onav-btn-badge--dot" })
          ]
        }
      ),
      open && /* @__PURE__ */ jsxs("div", { id: menuId, role: "menu", className: "aireon-onav-menu", children: [
        menuLabel && /* @__PURE__ */ jsx("p", { className: "aireon-onav-menu-label", children: menuLabel }),
        collapsed.map(
          (item) => item.render ? /* @__PURE__ */ jsx("div", { className: "aireon-onav-menu-custom", role: "none", children: item.render("menu") }, item.key) : /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              role: "menuitem",
              disabled: item.disabled,
              "aria-current": item.active ? "true" : void 0,
              onClick: () => {
                if (item.disabled) return;
                setOpen(false);
                item.onSelect?.();
              },
              className: "aireon-onav-menu-item" + (item.active ? " aireon-onav-menu-item--active" : "") + (item.danger ? " aireon-onav-menu-item--danger" : ""),
              children: [
                item.icon,
                /* @__PURE__ */ jsx("span", { className: "aireon-onav-menu-item-label", children: item.label }),
                item.badge != null && /* @__PURE__ */ jsx("span", { className: "aireon-onav-menu-item-badge", children: item.badge })
              ]
            },
            item.key
          )
        )
      ] })
    ] })
  ] });
}
var OverflowNav_default = OverflowNav;
function NavIconButton({
  icon,
  label,
  onClick,
  active = false,
  dark = false,
  className
}) {
  return /* @__PURE__ */ jsxs("span", { className: "aireon-navbtn-wrap" + (dark ? " aireon-navbtn-wrap--dark" : "") + (className ? ` ${className}` : ""), children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick,
        "aria-label": label,
        "aria-current": active ? "page" : void 0,
        className: "aireon-navbtn" + (active ? " aireon-navbtn--active" : ""),
        children: icon
      }
    ),
    /* @__PURE__ */ jsx("span", { role: "tooltip", className: "aireon-navbtn-tip", children: label })
  ] });
}
var NavIconButton_default = NavIconButton;

// src/nav/launchApps.ts
var LAUNCH_APPS = [
  { id: "valoo", name: "valoo" },
  { id: "scoore", name: "scoore" },
  { id: "voogle", name: "voogle" },
  { id: "roofs", name: "roofs" },
  { id: "roots", name: "roots" },
  { id: "geopool", name: "geopool" },
  { id: "groove", name: "groove" },
  { id: "woom", name: "woom" },
  { id: "footprint", name: "footprint" },
  { id: "proom", name: "proom" },
  { id: "soolar", name: "soolar" },
  { id: "boom", name: "boom" },
  { id: "room", name: "room" },
  { id: "snoop", name: "snoop" }
];
var LAUNCH_DEFAULT_ZOOM = "15.00";
function buildDeepLink(appId, lat, lng, zoom = LAUNCH_DEFAULT_ZOOM) {
  return `https://${appId}.aireon.ch/?lat=${lat}&lng=${lng}&zoom=${zoom}`;
}
function openInApp(appId, lat, lng, zoom = LAUNCH_DEFAULT_ZOOM) {
  if (typeof window === "undefined") return;
  window.open(buildDeepLink(appId, lat, lng, zoom), "_blank", "noopener,noreferrer");
}
function OpenWithMenu({
  location: location2,
  apps = LAUNCH_APPS,
  currentAppId,
  zoom,
  label = "Open with",
  showLabel = false,
  dark = false,
  className,
  onOpen
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);
  const list = apps.filter((a) => a.id !== currentAppId);
  const disabled = !location2 || list.length === 0;
  const choose = (app) => {
    if (!location2) return;
    openInApp(app.id, location2.lat, location2.lng, zoom);
    onOpen?.(app.id);
    setOpen(false);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      className: "aireon-openwith" + (dark ? " aireon-openwith--dark" : "") + (className ? ` ${className}` : ""),
      children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => setOpen((v) => !v),
            disabled,
            "aria-haspopup": "menu",
            "aria-expanded": open,
            "aria-label": label,
            className: "aireon-navbtn aireon-openwith-trigger" + (showLabel ? " aireon-openwith-trigger--labelled" : ""),
            children: [
              /* @__PURE__ */ jsx(ExternalLink, { size: 18, "aria-hidden": "true" }),
              showLabel && /* @__PURE__ */ jsx("span", { className: "aireon-openwith-trigger-label", children: label }),
              /* @__PURE__ */ jsx(ChevronDown, { size: 14, "aria-hidden": "true", className: "aireon-openwith-caret" + (open ? " is-open" : "") })
            ]
          }
        ),
        !showLabel && /* @__PURE__ */ jsx("span", { role: "tooltip", className: "aireon-navbtn-tip aireon-openwith-tip", children: label }),
        open && !disabled && /* @__PURE__ */ jsxs("div", { role: "menu", className: "aireon-openwith-menu", children: [
          /* @__PURE__ */ jsx("p", { className: "aireon-openwith-menu-label", children: label }),
          list.map((app) => /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              role: "menuitem",
              onClick: () => choose(app),
              className: "aireon-openwith-item",
              children: [
                /* @__PURE__ */ jsx(MapPin, { size: 14, "aria-hidden": "true", className: "aireon-openwith-item-icon" }),
                /* @__PURE__ */ jsx("span", { children: app.name })
              ]
            },
            app.id
          ))
        ] })
      ]
    }
  );
}
var OpenWithMenu_default = OpenWithMenu;
function SettingsMenu({
  dark = false,
  label,
  emptyLabel,
  menuLabel,
  items,
  iconSize = 18,
  buttonClassName = "aireon-navbtn",
  className
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const menuId = useId();
  const hasItems = !!items && items.length > 0;
  useEffect(() => {
    if (!open) return;
    const onPointer = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  const rootClass = "aireon-navbtn-wrap" + (dark ? " aireon-navbtn-wrap--dark aireon-onav--dark" : "") + (className ? ` ${className}` : "");
  return /* @__PURE__ */ jsxs("div", { ref: rootRef, className: rootClass, children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        ref: triggerRef,
        type: "button",
        onClick: () => setOpen((v) => !v),
        "aria-label": label,
        title: label,
        "aria-haspopup": "menu",
        "aria-expanded": open,
        "aria-controls": menuId,
        className: buttonClassName + (open ? ` ${buttonClassName}--active` : ""),
        children: /* @__PURE__ */ jsx(Settings, { size: iconSize, "aria-hidden": "true" })
      }
    ),
    !open && /* @__PURE__ */ jsx("span", { role: "tooltip", className: "aireon-navbtn-tip", children: label }),
    open && /* @__PURE__ */ jsxs("div", { id: menuId, role: "menu", className: "aireon-onav-menu", children: [
      menuLabel && /* @__PURE__ */ jsx("p", { className: "aireon-onav-menu-label", children: menuLabel }),
      hasItems ? items.map(
        (item) => item.render ? /* @__PURE__ */ jsx("div", { className: "aireon-onav-menu-custom", role: "none", children: item.render() }, item.key) : /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            role: "menuitem",
            onClick: () => {
              setOpen(false);
              item.onSelect?.();
            },
            className: "aireon-onav-menu-item",
            children: [
              item.icon,
              /* @__PURE__ */ jsx("span", { className: "aireon-onav-menu-item-label", children: item.label })
            ]
          },
          item.key
        )
      ) : /* @__PURE__ */ jsx("p", { className: "aireon-settings-empty", children: emptyLabel })
    ] })
  ] });
}
var SettingsMenu_default = SettingsMenu;
function useMediaQuery2(query) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    if (mql.addEventListener) mql.addEventListener("change", onChange);
    else mql.addListener(onChange);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", onChange);
      else mql.removeListener(onChange);
    };
  }, [query]);
  return matches;
}
function MapToolbar({
  dark = false,
  labels,
  locale,
  onLocaleChange,
  onCapture,
  isCapturing = false,
  onShowImages,
  onToggleTheme,
  onLocate,
  isLocating = false,
  settingsItems,
  hideSettings = false,
  collapseBelow = 768,
  className
}) {
  const isMobile = useMediaQuery2(`(max-width: ${collapseBelow - 1}px)`);
  if (isMobile) {
    const items = [];
    if (onCapture)
      items.push({ key: "save", label: labels.saveImage, icon: /* @__PURE__ */ jsx(Camera, { size: 16, "aria-hidden": "true" }), onSelect: onCapture, disabled: isCapturing });
    if (onShowImages)
      items.push({ key: "images", label: labels.myImages, icon: /* @__PURE__ */ jsx(Layers, { size: 16, "aria-hidden": "true" }), onSelect: onShowImages });
    if (onToggleTheme)
      items.push({ key: "theme", label: dark ? labels.toggleLight : labels.toggleDark, icon: dark ? /* @__PURE__ */ jsx(Sun, { size: 16, "aria-hidden": "true" }) : /* @__PURE__ */ jsx(Moon, { size: 16, "aria-hidden": "true" }), onSelect: onToggleTheme });
    if (onLocate)
      items.push({ key: "locate", label: labels.locateMe, icon: /* @__PURE__ */ jsx(MapPin, { size: 16, "aria-hidden": "true" }), onSelect: onLocate, disabled: isLocating });
    if (!hideSettings)
      items.push({ key: "settings", label: labels.settings, render: () => /* @__PURE__ */ jsx(SettingsMenu, { dark, label: labels.settings, emptyLabel: labels.settingsComingSoon, items: settingsItems }) });
    items.push({ key: "language", label: labels.selectLanguage, render: (mode) => /* @__PURE__ */ jsx(LocaleSelector, { locale, onChange: onLocaleChange, ariaLabel: labels.selectLanguage, className: mode === "menu" ? "w-full" : void 0 }) });
    return /* @__PURE__ */ jsx(OverflowNav, { dark, items, collapseBelow, moreLabel: labels.more, menuLabel: labels.more, className });
  }
  return /* @__PURE__ */ jsxs("div", { className: "aireon-maptoolbar" + (className ? ` ${className}` : ""), children: [
    onCapture && /* @__PURE__ */ jsx(NavIconButton, { dark, icon: /* @__PURE__ */ jsx(Camera, { size: 18, "aria-hidden": "true" }), label: labels.saveImage, onClick: isCapturing ? void 0 : onCapture }),
    onShowImages && /* @__PURE__ */ jsx(NavIconButton, { dark, icon: /* @__PURE__ */ jsx(Layers, { size: 18, "aria-hidden": "true" }), label: labels.myImages, onClick: onShowImages }),
    onToggleTheme && /* @__PURE__ */ jsx(NavIconButton, { dark, icon: dark ? /* @__PURE__ */ jsx(Sun, { size: 18, "aria-hidden": "true" }) : /* @__PURE__ */ jsx(Moon, { size: 18, "aria-hidden": "true" }), label: dark ? labels.toggleLight : labels.toggleDark, onClick: onToggleTheme }),
    onLocate && /* @__PURE__ */ jsx(NavIconButton, { dark, icon: /* @__PURE__ */ jsx(MapPin, { size: 18, "aria-hidden": "true" }), label: labels.locateMe, onClick: isLocating ? void 0 : onLocate }),
    !hideSettings && /* @__PURE__ */ jsx(SettingsMenu, { dark, label: labels.settings, emptyLabel: labels.settingsComingSoon, items: settingsItems }),
    /* @__PURE__ */ jsx(LocaleSelector, { locale, onChange: onLocaleChange, ariaLabel: labels.selectLanguage })
  ] });
}
var MapToolbar_default = MapToolbar;
var defaultProvider = (text, opts) => searchGeoAdminAddresses(text, {
  signal: opts.signal,
  lang: opts.lang
});
function AddressSearch({
  dark = false,
  locale,
  labels,
  onSelect,
  search = defaultProvider,
  minChars = 3,
  debounceMs = 300,
  onError,
  className
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef(null);
  const debounceRef = useRef();
  const abortRef = useRef(null);
  const listboxId = useId();
  const runSearch = useCallback(
    async (text) => {
      if (text.trim().length < minChars) {
        setResults([]);
        setIsOpen(false);
        return;
      }
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setIsLoading(true);
      try {
        const matches = await search(text, { signal: controller.signal, lang: locale });
        if (controller.signal.aborted) return;
        setResults(matches);
        setIsOpen(true);
        setSelectedIndex(-1);
      } catch (err) {
        if (err?.name !== "AbortError") {
          setResults([]);
          setIsOpen(false);
          onError?.(err);
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    },
    [search, locale, minChars, onError]
  );
  const handleInputChange = (value) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(value), debounceMs);
  };
  const handleSelect = (result) => {
    setQuery(result.label);
    setIsOpen(false);
    setResults([]);
    onSelect(result);
  };
  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((p) => p < results.length - 1 ? p + 1 : 0);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((p) => p > 0 ? p - 1 : results.length - 1);
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };
  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };
  useEffect(() => {
    const onPointer = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, []);
  const showDropdown = isOpen && !isLoading && (results.length > 0 || query.trim().length >= minChars);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: containerRef,
      className: "aireon-search" + (dark ? " aireon-search--dark" : "") + (className ? ` ${className}` : ""),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "aireon-search-field", children: [
          /* @__PURE__ */ jsx(Search, { size: 16, className: "aireon-search-icon", "aria-hidden": "true" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: query,
              onChange: (e) => handleInputChange(e.target.value),
              onKeyDown: handleKeyDown,
              onFocus: () => {
                if (results.length > 0 || query.trim().length >= minChars && !isLoading) setIsOpen(true);
              },
              placeholder: labels.placeholder,
              role: "combobox",
              "aria-expanded": isOpen,
              "aria-controls": listboxId,
              "aria-activedescendant": selectedIndex >= 0 ? `${listboxId}-opt-${selectedIndex}` : void 0,
              "aria-autocomplete": "list",
              "aria-busy": isLoading,
              "aria-label": labels.placeholder,
              className: "aireon-search-input"
            }
          ),
          isLoading ? /* @__PURE__ */ jsx("span", { className: "aireon-search-spinner", "aria-hidden": "true" }) : query && /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: clearSearch,
              "aria-label": labels.clear,
              title: labels.clear,
              className: "aireon-search-clear",
              children: /* @__PURE__ */ jsx(X, { size: 14, "aria-hidden": "true" })
            }
          )
        ] }),
        showDropdown && /* @__PURE__ */ jsx("div", { id: listboxId, role: "listbox", "aria-label": labels.placeholder, className: "aireon-search-menu", children: results.length > 0 ? results.map((result, index) => /* @__PURE__ */ jsxs(
          "button",
          {
            id: `${listboxId}-opt-${index}`,
            role: "option",
            "aria-selected": index === selectedIndex,
            onClick: () => handleSelect(result),
            className: "aireon-search-option" + (index === selectedIndex ? " aireon-search-option--active" : ""),
            children: [
              /* @__PURE__ */ jsx(MapPin, { size: 16, className: "aireon-search-option-icon", "aria-hidden": "true" }),
              /* @__PURE__ */ jsx("span", { className: "aireon-search-option-label", children: result.label })
            ]
          },
          result.id
        )) : /* @__PURE__ */ jsxs("div", { role: "status", className: "aireon-search-empty", children: [
          /* @__PURE__ */ jsx(Search, { size: 16, "aria-hidden": "true" }),
          /* @__PURE__ */ jsx("span", { children: labels.noResults })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "sr-only", role: "status", "aria-live": "polite", children: isLoading ? labels.loading : isOpen && results.length > 0 ? labels.resultsCount?.(results.length) ?? "" : isOpen && query.trim().length >= minChars ? labels.noResults : "" })
      ]
    }
  );
}
var AddressSearch_default = AddressSearch;
function AppNavbar({
  appName,
  dark = false,
  hideHubLink = false,
  search,
  openWith,
  toolbar,
  actionsExtra,
  userMenu,
  position = "absolute top-0 left-0 right-0 z-40",
  brandTourId,
  searchTourId,
  userMenuTourId,
  className
}) {
  const [picked, setPicked] = useState(null);
  const handlePick = (result) => {
    setPicked({ lat: result.lat, lng: result.lng });
    search?.onSelect(result);
  };
  return /* @__PURE__ */ jsx("header", { className: position + (className ? ` ${className}` : ""), children: /* @__PURE__ */ jsx("div", { className: "aireon-appnav-bar" + (dark ? " aireon-appnav-bar--dark" : ""), children: /* @__PURE__ */ jsxs("div", { className: "aireon-appnav-inner", children: [
    /* @__PURE__ */ jsxs("div", { className: "aireon-appnav-brand", "data-tour": brandTourId, children: [
      !hideHubLink && /* @__PURE__ */ jsx(AireonHubLink, { withDivider: true, className: "", style: { color: dark ? "rgb(248 250 252)" : "rgb(17 24 39)" } }),
      /* @__PURE__ */ jsx(AireonAppWordmark, { name: appName })
    ] }),
    search && /* @__PURE__ */ jsx("div", { className: "aireon-appnav-search", "data-tour": searchTourId, children: /* @__PURE__ */ jsx(AddressSearch, { dark, ...search, onSelect: handlePick }) }),
    /* @__PURE__ */ jsxs("div", { className: "aireon-appnav-actions", children: [
      openWith && picked && /* @__PURE__ */ jsx(
        OpenWithMenu,
        {
          location: picked,
          currentAppId: openWith.currentAppId,
          dark,
          label: openWith.label,
          onOpen: openWith.onOpen
        }
      ),
      actionsExtra,
      toolbar && /* @__PURE__ */ jsx(MapToolbar, { dark, ...toolbar }),
      userMenu && /* @__PURE__ */ jsx("div", { "data-tour": userMenuTourId, children: userMenu })
    ] })
  ] }) }) });
}
var AppNavbar_default = AppNavbar;
var DATA_TABLE_STRINGS_EN = {
  searchPlaceholder: "Search\u2026",
  sortBy: "Sort by {column}",
  empty: "No data",
  firstPage: "First page",
  previousPage: "Previous page",
  nextPage: "Next page",
  lastPage: "Last page",
  page: "Page",
  of: "of"
};
function toDim(v) {
  return typeof v === "number" ? `${v}px` : v;
}
var alignClass = (a) => a === "right" ? "text-right" : a === "center" ? "text-center" : "text-left";
function DataTable({
  columns,
  data,
  loading = false,
  skeletonRows = 8,
  enableSorting = true,
  enableGlobalFilter = false,
  pageSize,
  virtualize,
  estimateRowHeight = 44,
  overscan = 10,
  maxHeight,
  stickyHeader = true,
  density = "comfortable",
  onRowClick,
  rowClassName,
  getRowId,
  className,
  emptyMessage,
  strings,
  ariaLabel,
  onRowMouseEnter,
  onRowMouseLeave,
  overflowVisible = false,
  classNames
}) {
  const s = { ...DATA_TABLE_STRINGS_EN, ...strings };
  const cx = {
    container: classNames?.container ?? "border border-gray-200 dark:border-gray-700",
    thead: classNames?.thead ?? "bg-gray-100 dark:bg-gray-800",
    headerCell: classNames?.headerCell ?? "text-gray-600 dark:text-gray-300",
    body: classNames?.body ?? "divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-900",
    row: classNames?.row ?? "hover:bg-gray-50 dark:hover:bg-gray-800/60",
    cell: classNames?.cell ?? "text-gray-800 dark:text-gray-200"
  };
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const paginated = typeof pageSize === "number" && pageSize > 0;
  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    enableSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : void 0,
    getFilteredRowModel: enableGlobalFilter ? getFilteredRowModel() : void 0,
    getPaginationRowModel: paginated ? getPaginationRowModel() : void 0,
    getRowId,
    initialState: paginated ? { pagination: { pageIndex: 0, pageSize } } : void 0
  });
  const rows = table.getRowModel().rows;
  const threshold = typeof virtualize === "number" ? virtualize : 100;
  const doVirtualize = !paginated && maxHeight != null && (virtualize === true || virtualize !== false && rows.length > threshold);
  const scrollRef = useRef(null);
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => estimateRowHeight,
    overscan,
    enabled: doVirtualize
  });
  const cellPad = density === "compact" ? "px-3 py-1.5" : "px-4 py-2.5";
  const headPad = density === "compact" ? "px-3 py-2" : "px-4 py-3";
  const colCount = table.getAllLeafColumns().length;
  const virtualItems = doVirtualize ? rowVirtualizer.getVirtualItems() : [];
  const paddingTop = doVirtualize && virtualItems.length ? virtualItems[0].start : 0;
  const paddingBottom = doVirtualize && virtualItems.length ? rowVirtualizer.getTotalSize() - virtualItems[virtualItems.length - 1].end : 0;
  const renderRow = (row) => /* @__PURE__ */ jsx(
    "tr",
    {
      onClick: onRowClick ? () => onRowClick(row.original) : void 0,
      onMouseEnter: onRowMouseEnter ? () => onRowMouseEnter(row.original) : void 0,
      onMouseLeave: onRowMouseLeave ? () => onRowMouseLeave(row.original) : void 0,
      className: `transition-colors ${onRowClick ? "cursor-pointer" : ""} ${cx.row} ${rowClassName ? rowClassName(row.original, row.index) : ""}`,
      children: row.getVisibleCells().map((cell) => {
        const meta = cell.column.columnDef.meta;
        return /* @__PURE__ */ jsx(
          "td",
          {
            className: `${cellPad} text-sm ${cx.cell} ${alignClass(
              meta?.align
            )} ${meta?.className ?? ""}`,
            children: flexRender(cell.column.columnDef.cell, cell.getContext())
          },
          cell.id
        );
      })
    },
    row.id
  );
  return /* @__PURE__ */ jsxs("div", { className: `flex flex-col gap-3 ${className ?? ""}`, children: [
    enableGlobalFilter && /* @__PURE__ */ jsxs("div", { className: "relative flex-shrink-0", children: [
      /* @__PURE__ */ jsx(
        Search,
        {
          size: 15,
          "aria-hidden": "true",
          className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: globalFilter,
          onChange: (e) => setGlobalFilter(e.target.value),
          placeholder: s.searchPlaceholder,
          "aria-label": s.searchPlaceholder,
          className: "w-full max-w-xs rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: scrollRef,
        className: `rounded-lg ${overflowVisible && maxHeight == null ? "overflow-visible" : "overflow-auto"} ${cx.container}`,
        style: { maxHeight: toDim(maxHeight) },
        children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [
          ariaLabel && /* @__PURE__ */ jsx("caption", { className: "sr-only", children: ariaLabel }),
          /* @__PURE__ */ jsx(
            "thead",
            {
              className: `${cx.thead} ${stickyHeader && maxHeight != null ? "sticky top-0 z-10" : ""}`,
              children: table.getHeaderGroups().map((headerGroup) => /* @__PURE__ */ jsx("tr", { children: headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta;
                const canSort = header.column.getCanSort();
                const sorted = header.column.getIsSorted();
                return /* @__PURE__ */ jsx(
                  "th",
                  {
                    "aria-sort": canSort ? sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : "none" : void 0,
                    className: `${headPad} text-xs font-semibold uppercase tracking-wider ${cx.headerCell} whitespace-nowrap ${alignClass(
                      meta?.align
                    )} ${meta?.headerClassName ?? ""}`,
                    children: header.isPlaceholder ? null : canSort ? /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: header.column.getToggleSortingHandler(),
                        "aria-label": s.sortBy.replace(
                          "{column}",
                          typeof header.column.columnDef.header === "string" ? header.column.columnDef.header : header.column.id
                        ),
                        className: `group inline-flex items-center gap-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${meta?.align === "right" ? "flex-row-reverse" : ""}`,
                        children: [
                          flexRender(header.column.columnDef.header, header.getContext()),
                          sorted === "desc" ? /* @__PURE__ */ jsx(ChevronDown, { size: 14, "aria-hidden": "true", className: "text-blue-500" }) : sorted === "asc" ? /* @__PURE__ */ jsx(ChevronUp, { size: 14, "aria-hidden": "true", className: "text-blue-500" }) : /* @__PURE__ */ jsx(
                            ChevronDown,
                            {
                              size: 14,
                              "aria-hidden": "true",
                              className: "text-gray-300 opacity-0 transition-opacity group-hover:opacity-100 dark:text-gray-600"
                            }
                          )
                        ]
                      }
                    ) : flexRender(header.column.columnDef.header, header.getContext())
                  },
                  header.id
                );
              }) }, headerGroup.id))
            }
          ),
          /* @__PURE__ */ jsx("tbody", { className: cx.body, children: loading ? Array.from({ length: skeletonRows }).map((_, r) => /* @__PURE__ */ jsx("tr", { children: Array.from({ length: colCount }).map((__, c) => /* @__PURE__ */ jsx("td", { className: cellPad, children: /* @__PURE__ */ jsx(Skeleton, { height: 14, delay: `${(r + c) * 40}ms` }) }, c)) }, `sk-${r}`)) : rows.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx(
            "td",
            {
              colSpan: colCount,
              className: "px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400",
              children: emptyMessage ?? s.empty
            }
          ) }) : doVirtualize ? /* @__PURE__ */ jsxs(Fragment, { children: [
            paddingTop > 0 && /* @__PURE__ */ jsx("tr", { style: { height: paddingTop }, "aria-hidden": "true" }),
            virtualItems.map((vi) => renderRow(rows[vi.index])),
            paddingBottom > 0 && /* @__PURE__ */ jsx("tr", { style: { height: paddingBottom }, "aria-hidden": "true" })
          ] }) : rows.map(renderRow) })
        ] })
      }
    ),
    paginated && rows.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-shrink-0 items-center justify-between gap-3 py-1", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsx(
          PagerButton,
          {
            onClick: () => table.setPageIndex(0),
            disabled: !table.getCanPreviousPage(),
            label: s.firstPage,
            children: /* @__PURE__ */ jsx(ChevronsLeft, { size: 16, "aria-hidden": "true" })
          }
        ),
        /* @__PURE__ */ jsx(
          PagerButton,
          {
            onClick: () => table.previousPage(),
            disabled: !table.getCanPreviousPage(),
            label: s.previousPage,
            children: /* @__PURE__ */ jsx(ChevronLeft, { size: 16, "aria-hidden": "true" })
          }
        ),
        /* @__PURE__ */ jsx(
          PagerButton,
          {
            onClick: () => table.nextPage(),
            disabled: !table.getCanNextPage(),
            label: s.nextPage,
            children: /* @__PURE__ */ jsx(ChevronRight, { size: 16, "aria-hidden": "true" })
          }
        ),
        /* @__PURE__ */ jsx(
          PagerButton,
          {
            onClick: () => table.setPageIndex(table.getPageCount() - 1),
            disabled: !table.getCanNextPage(),
            label: s.lastPage,
            children: /* @__PURE__ */ jsx(ChevronsRight, { size: 16, "aria-hidden": "true" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: [
        s.page,
        " ",
        /* @__PURE__ */ jsx("strong", { className: "text-gray-900 dark:text-gray-100", children: table.getState().pagination.pageIndex + 1 }),
        " ",
        s.of,
        " ",
        /* @__PURE__ */ jsx("strong", { className: "text-gray-900 dark:text-gray-100", children: table.getPageCount() })
      ] })
    ] })
  ] });
}
function PagerButton({
  onClick,
  disabled,
  label,
  children
}) {
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      onClick,
      disabled,
      "aria-label": label,
      title: label,
      className: "rounded border border-gray-200 p-1.5 text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700",
      children
    }
  );
}
function VirtualList({
  items,
  renderItem,
  estimateSize = 56,
  overscan = 8,
  getItemKey,
  onEndReached,
  endReachedThreshold = 200,
  loading = false,
  skeletonRows = 8,
  emptyMessage,
  className,
  style,
  ariaLabel
}) {
  const scrollRef = useRef(null);
  const estimator = typeof estimateSize === "function" ? estimateSize : () => estimateSize;
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: estimator,
    overscan,
    getItemKey: getItemKey ? (index) => getItemKey(items[index], index) : void 0
  });
  const virtualItems = virtualizer.getVirtualItems();
  const lastIndex = virtualItems.length ? virtualItems[virtualItems.length - 1].index : -1;
  useEffect(() => {
    if (!onEndReached || items.length === 0) return;
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= endReachedThreshold;
    if (lastIndex >= items.length - 1 && nearBottom) onEndReached();
  }, [lastIndex, items.length, onEndReached, endReachedThreshold]);
  if (loading) {
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: `overflow-auto ${className ?? ""}`,
        style,
        role: "status",
        "aria-busy": "true",
        children: Array.from({ length: skeletonRows }).map((_, i) => /* @__PURE__ */ jsx(
          Skeleton,
          {
            height: typeof estimateSize === "number" ? estimateSize - 12 : 44,
            delay: `${i * 80}ms`,
            className: "mx-2 my-1.5"
          },
          i
        ))
      }
    );
  }
  if (items.length === 0) {
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: `flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 ${className ?? ""}`,
        style,
        children: emptyMessage ?? "No items"
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: scrollRef,
      className: `overflow-auto ${className ?? ""}`,
      style,
      role: "list",
      "aria-label": ariaLabel,
      children: /* @__PURE__ */ jsx(
        "div",
        {
          style: { height: virtualizer.getTotalSize(), width: "100%", position: "relative" },
          children: virtualItems.map((vi) => /* @__PURE__ */ jsx(
            "div",
            {
              role: "listitem",
              "data-index": vi.index,
              ref: virtualizer.measureElement,
              style: {
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${vi.start}px)`
              },
              children: renderItem(items[vi.index], vi.index)
            },
            vi.key
          ))
        }
      )
    }
  );
}

export { AIREON_HUB_ICON_URL, AIREON_HUB_MARK_URL, AIREON_HUB_URL, AIREON_LOGO_ASPECT, AIREON_LOGO_PATH, AIREON_LOGO_VIEWBOX, AddressSearch, AddressSearch_default as AddressSearchDefault, AireonAppWordmark, AireonAppWordmark_default as AireonAppWordmarkDefault, AireonHubLink, AireonHubLink_default as AireonHubLinkDefault, AireonLogo, AireonLogo_default as AireonLogoDefault, AppNavbar, AppNavbar_default as AppNavbarDefault, AuthProvider, Avatar, BUG_REPORT_STRINGS, BugReportButton, ClaireAssistant_default as ClaireAssistant, DATA_TABLE_STRINGS_EN, DataTable, ErrorLogBoundary, FlagApiError, GEOPOOL_APP_URL, GeminiConfigError, KIND_META, LAUNCH_APPS, LAUNCH_DEFAULT_ZOOM, LEGACY_GEOPOOL_APP_URL, LEGACY_PROOM_APP_URL, LEGACY_TOOLBOX_APP_URL, LocaleSelector, LocaleSelector_default as LocaleSelectorDefault, LoginModal, MapToolbar, MapToolbar_default as MapToolbarDefault, MapUserMenu, MapUserMenu_default as MapUserMenuDefault, MunicipalityFlag, NavIconButton, NavIconButton_default as NavIconButtonDefault, OpenWithMenu, OpenWithMenu_default as OpenWithMenuDefault, OverflowNav, OverflowNav_default as OverflowNavDefault, PRM_PRIORITIES, PRM_STATES, PROOM_APP_URL, ParcelAerialThumbnail, ParcelAerialThumbnail_default as ParcelAerialThumbnailDefault, Portal, AuthRequiredError as PrmAuthRequiredError, ProfileModal, RELEASE_NOTES_STRINGS, ReleaseNotesButton, ReleaseNotesPanel, SAVED_PARCELS_STRINGS, SCOORE_CATEGORY_COLORS, SCOORE_RADIUS_CIRCLES, SSO_ATTEMPTED_KEY, SWISSNOVO_APP_CATALOG, SWISSNOVO_SUITE_BLURB, SavedParcelsModal, ScooreMiniMap, ScooreMiniMap_default as ScooreMiniMapDefault, SettingsMenu, SettingsMenu_default as SettingsMenuDefault, TOOLBOX_APP_URL, VirtualList, Z_INDEX, aerialThumbnailZoom, avatarOptions, avatarUrl, avatarUrlById, avatarUrlFromSeed, buildDeepLink, buildParcelContextSummary, buildSwisstopoAerialUrl, canonicalKind, clearFlagCache, computeLocationScore, createErrorLogger, createPrmRecord, createScooreCircleGeoJSON, createSignalClient, defaultProfile, deletePrmRecord, emailOf, fetchClaireContext, fetchClairePOIs, fetchFlagSvgMarkup, fetchPrmByParcel, fetchPrmRecords, fetchRemoteProfile, firstNameOf, fullNameOf, generateParcelChatReply, getAllFlags, getAuthToken, getBugReportStrings, getExistingUser, getFlagApiBase, getFlagByBfs, getFlagsByCanton, getProfile, getReleaseNotesStrings, getSavedParcelsStrings, hydrateFromRemote, identifyOpenReplayUser, initOpenReplay, initialsOf, installErrorLogging, isSvgFlagUrl, listClaireConversations, loadClaireConversation, openInApp, pictureOf, resolveKindMeta, saveClaireConversation, sendClaireMessageSignal, setFlagApiBase, startVoiceCall, stopOpenReplay, streamParcelChatReply, stripAuthParams, subscribe as subscribeProfile, updatePrmPriority, updatePrmState, updatePrmTags, updateProfile, urlHasAuthParams, useAuth, useFocusTrap, useMunicipalityFlag, useReleaseNotes, useUserProfile, userManager };
