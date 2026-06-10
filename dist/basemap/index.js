import { useRef, useState, useEffect, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { Layers, ChevronDown, Check } from 'lucide-react';

// src/basemap/restyle.ts
function cloneStyle(style) {
  return JSON.parse(JSON.stringify(style));
}
var roadColorByClass = (major, minor) => [
  "match",
  ["get", "class"],
  ["motorway", "trunk", "primary"],
  major,
  minor
];
var labelPaint = (color, halo, haloWidth, haloBlur = 0.5) => ({
  "text-color": color,
  "text-halo-color": halo,
  "text-halo-width": haloWidth,
  "text-halo-blur": haloBlur
});
function applyRestyle(style, spec) {
  const next = cloneStyle(style);
  for (const layer of next.layers ?? []) {
    const l = layer;
    if (spec.hide.has(l.id)) {
      l.layout = { ...l.layout, visibility: "none" };
      continue;
    }
    if (l.type === "symbol") {
      const label = spec.labels[l.id];
      if (label) {
        l.paint = { ...l.paint, ...label };
      } else if (spec.symbolDefault === "hide") {
        l.layout = { ...l.layout, visibility: "none" };
      } else {
        l.paint = { ...l.paint, ...spec.symbolDefault };
      }
      continue;
    }
    const recolor = spec.recolor[l.id];
    if (recolor) l.paint = { ...l.paint, ...recolor };
  }
  return next;
}

// src/basemap/specs.ts
var MINIMAL_HIDE = /* @__PURE__ */ new Set([
  "hillshade_grey",
  "hillshade_yellow",
  "scree_z17",
  "scree_z15",
  "scree_z13",
  "scree_z11",
  "contour_line",
  "contour_line_blue",
  "hachure",
  "landcover_casing",
  "pattern_landcover",
  "landuse",
  "landuse_outline",
  "landuse_parking",
  "landuse_parking_outline",
  "park",
  "boundary",
  "boundary_disputed",
  "tunnel_public_transport",
  "tunnel_road",
  "tunnel_pedestrian",
  "construct",
  "construct_line",
  "aeroway_polygon_casing",
  "aeroway_polygon_fill",
  "road_via_ferrata_trail",
  "road_path_footway_ferry",
  "building_ln",
  "building_casing",
  "public_transport",
  "l1_public_transport",
  "l1_2_pedestrian",
  "l2_public_transport_aerialway",
  "l1_road_casing",
  "l2_road_casing",
  "road_casing",
  "water_line_intermittent",
  "hazard"
]);
var LIGHT = {
  land: "#f4f4f1",
  water: "#dce6ec",
  waterEdge: "#c4d4dd",
  building: "#e8e8e3",
  green: "#ebeee7",
  roadMajor: "#cfcfc7",
  roadMinor: "#deded6",
  labelStreet: "#6f7682",
  labelCity: "#39404d",
  labelTown: "#545c69",
  labelOther: "#838b98",
  halo: "#f4f4f1"
};
var LIGHT_MINIMAL_SPEC = {
  recolor: {
    background: { "background-color": LIGHT.land },
    landcover: { "fill-color": LIGHT.green },
    water: { "fill-color": LIGHT.water },
    water_outline: { "line-color": LIGHT.waterEdge },
    water_line: { "line-color": LIGHT.waterEdge },
    building: { "fill-color": LIGHT.building },
    road_fill: { "line-color": roadColorByClass(LIGHT.roadMajor, LIGHT.roadMinor) },
    l1_fill: { "line-color": roadColorByClass(LIGHT.roadMajor, LIGHT.roadMinor) },
    l2_fill: { "line-color": roadColorByClass(LIGHT.roadMajor, LIGHT.roadMinor) }
  },
  hide: MINIMAL_HIDE,
  labels: {
    transportation_label: labelPaint(LIGHT.labelStreet, LIGHT.halo, 1.3, 0.4),
    place_city: labelPaint(LIGHT.labelCity, LIGHT.halo, 1.4, 0.6),
    place_town_village: labelPaint(LIGHT.labelTown, LIGHT.halo, 1.2, 0.5),
    place_other: labelPaint(LIGHT.labelOther, LIGHT.halo, 1.1, 0.4)
  },
  symbolDefault: "hide"
};
var DARK = {
  land: "#181b20",
  water: "#0f141b",
  waterEdge: "#21303f",
  buildingDetailed: "#46505c",
  buildingDetailedLine: "#5c6674",
  building: "#20242c",
  green: "#19211c",
  tint: "#1c1f25",
  roadMajor: "#4a5161",
  roadMinor: "#353b44",
  roadCasing: "#13151a",
  faintLine: "#2b3038",
  rail: "#343a43",
  boundary: "#3a4049",
  park: "#233028",
  labelStreet: "#9aa3b2",
  labelCity: "#eef1f5",
  labelTown: "#c8ced8",
  labelOther: "#8e96a3",
  labelGeneric: "#aeb6c2",
  halo: "#13151a"
};
var DARK_MINIMAL_SPEC = {
  recolor: {
    background: { "background-color": DARK.land },
    landcover: { "fill-color": DARK.green },
    water: { "fill-color": DARK.water },
    water_outline: { "line-color": DARK.waterEdge },
    water_line: { "line-color": DARK.waterEdge },
    building: { "fill-color": DARK.building },
    road_fill: { "line-color": roadColorByClass(DARK.roadMajor, DARK.roadMinor) },
    l1_fill: { "line-color": roadColorByClass(DARK.roadMajor, DARK.roadMinor) },
    l2_fill: { "line-color": roadColorByClass(DARK.roadMajor, DARK.roadMinor) }
  },
  hide: MINIMAL_HIDE,
  labels: {
    transportation_label: labelPaint(DARK.labelStreet, DARK.halo, 1.3, 0.4),
    place_city: labelPaint(DARK.labelCity, DARK.halo, 1.5, 0.8),
    place_town_village: labelPaint(DARK.labelTown, DARK.halo, 1.3, 0.6),
    place_other: labelPaint(DARK.labelOther, DARK.halo, 1.1, 0.5)
  },
  symbolDefault: "hide"
};
var darkRoad = { "line-color": roadColorByClass(DARK.roadMajor, DARK.roadMinor) };
var darkCasing = { "line-color": DARK.roadCasing };
var darkFaint = { "line-color": DARK.faintLine };
var darkRail = { "line-color": DARK.rail };
var darkDetailedBuildingLine = { "line-color": DARK.buildingDetailedLine };
var DARK_DETAILED_SPEC = {
  recolor: {
    background: { "background-color": DARK.land },
    landcover: { "fill-color": DARK.green },
    landuse: { "fill-color": DARK.tint },
    landuse_parking: { "fill-color": DARK.tint },
    construct: { "fill-color": DARK.tint },
    aeroway_polygon_fill: { "fill-color": DARK.tint },
    water: { "fill-color": DARK.water },
    building: {
      "fill-color": DARK.buildingDetailed,
      "fill-outline-color": DARK.buildingDetailedLine
    },
    water_outline: { "line-color": DARK.waterEdge },
    water_line: { "line-color": DARK.waterEdge },
    water_line_intermittent: { "line-color": DARK.waterEdge },
    park: { "line-color": DARK.park },
    boundary: { "line-color": DARK.boundary },
    boundary_disputed: { "line-color": DARK.boundary },
    building_casing: darkDetailedBuildingLine,
    building_ln: darkDetailedBuildingLine,
    road_casing: darkCasing,
    road_fill: darkRoad,
    l1_road_casing: darkCasing,
    l1_fill: darkRoad,
    l1_2_pedestrian: darkFaint,
    l2_road_casing: darkCasing,
    l2_fill: darkRoad,
    tunnel_road: darkFaint,
    tunnel_pedestrian: darkFaint,
    tunnel_public_transport: darkRail,
    public_transport: darkRail,
    l1_public_transport: darkRail,
    l2_public_transport_aerialway: darkRail,
    road_path_footway_ferry: darkFaint,
    road_via_ferrata_trail: darkFaint
  },
  hide: /* @__PURE__ */ new Set([
    "hillshade_grey",
    "hillshade_yellow",
    "scree_z17",
    "scree_z15",
    "scree_z13",
    "scree_z11",
    "hachure",
    "pattern_landcover",
    "landcover_casing",
    "landuse_outline",
    "landuse_parking_outline",
    "contour_line",
    "contour_line_blue",
    "contour_line_pt",
    "spot_elevation",
    "construct_line",
    "aeroway_polygon_casing",
    "hazard"
  ]),
  labels: {
    place_city: labelPaint(DARK.labelCity, DARK.halo, 1.6, 0.8),
    place_town_village: labelPaint(DARK.labelTown, DARK.halo, 1.3, 0.6),
    place_other: labelPaint(DARK.labelOther, DARK.halo, 1.1, 0.5),
    transportation_label: labelPaint(DARK.labelStreet, DARK.halo, 1.3, 0.4),
    road_number: labelPaint(DARK.labelGeneric, DARK.halo, 1, 0.3)
  },
  symbolDefault: labelPaint(DARK.labelGeneric, DARK.halo, 1.1, 0.5)
};
var toLightMinimalStyle = (s) => applyRestyle(s, LIGHT_MINIMAL_SPEC);
var toDarkMinimalStyle = (s) => applyRestyle(s, DARK_MINIMAL_SPEC);
var toDarkDetailedStyle = (s) => applyRestyle(s, DARK_DETAILED_SPEC);

// src/basemap/options.ts
var SWISSTOPO_VT = "https://vectortiles.geo.admin.ch/styles";
var SWISSTOPO_BASE_ID = "swisstopo-base";
var SWISSTOPO_LIGHT_BASEMAP_ID = "swisstopo-light";
var SWISSTOPO_DARK_BASEMAP_ID = "swisstopo-dark";
var SWISSTOPO_IMAGERY_ID = "swisstopo-imagery";
var LIGHT_MINIMAL_ID = "light-minimal";
var DARK_MINIMAL_ID = "dark-minimal";
var BASEMAP_OPTIONS = [
  { id: SWISSTOPO_BASE_ID, styleUrl: `${SWISSTOPO_VT}/ch.swisstopo.basemap.vt/style.json` },
  { id: SWISSTOPO_LIGHT_BASEMAP_ID, styleUrl: `${SWISSTOPO_VT}/ch.swisstopo.lightbasemap.vt/style.json` },
  { id: LIGHT_MINIMAL_ID, styleUrl: `${SWISSTOPO_VT}/ch.swisstopo.lightbasemap.vt/style.json`, styleTransform: toLightMinimalStyle },
  { id: SWISSTOPO_DARK_BASEMAP_ID, styleUrl: `${SWISSTOPO_VT}/ch.swisstopo.lightbasemap.vt/style.json`, styleTransform: toDarkDetailedStyle },
  { id: DARK_MINIMAL_ID, styleUrl: `${SWISSTOPO_VT}/ch.swisstopo.lightbasemap.vt/style.json`, styleTransform: toDarkMinimalStyle },
  { id: SWISSTOPO_IMAGERY_ID, styleUrl: `${SWISSTOPO_VT}/ch.swisstopo.imagerybasemap.vt/style.json` }
];
var themeBasemapId = (isDarkMode) => isDarkMode ? SWISSTOPO_DARK_BASEMAP_ID : SWISSTOPO_LIGHT_BASEMAP_ID;
var getBasemapOption = (basemapId) => BASEMAP_OPTIONS.find((b) => b.id === basemapId) ?? BASEMAP_OPTIONS[0];
var rawStyleCache = new globalThis.Map();
async function fetchStyleJson(url) {
  if (!rawStyleCache.has(url)) {
    rawStyleCache.set(url, fetch(url).then(async (response) => {
      if (!response.ok) throw new Error(`Style ${url} failed with ${response.status}`);
      return await response.json();
    }));
  }
  return cloneStyle(await rawStyleCache.get(url));
}
async function resolveBasemapStyle(basemap) {
  return basemap.styleTransform ? basemap.styleTransform(await fetchStyleJson(basemap.styleUrl)) : basemap.styleUrl;
}

// src/basemap/i18n.ts
var BASEMAP_STRINGS = {
  en: { control: "Basemap", options: {
    "swisstopo-base": "Standard",
    "swisstopo-light": "Light",
    "light-minimal": "Light Minimal",
    "swisstopo-dark": "Dark",
    "dark-minimal": "Dark Minimal",
    "swisstopo-imagery": "Aerial"
  } },
  fr: { control: "Fond de carte", options: {
    "swisstopo-base": "Standard",
    "swisstopo-light": "Clair",
    "light-minimal": "Clair \xE9pur\xE9",
    "swisstopo-dark": "Sombre",
    "dark-minimal": "Sombre \xE9pur\xE9",
    "swisstopo-imagery": "A\xE9rien"
  } },
  de: { control: "Grundkarte", options: {
    "swisstopo-base": "Standard",
    "swisstopo-light": "Hell",
    "light-minimal": "Hell minimal",
    "swisstopo-dark": "Dunkel",
    "dark-minimal": "Dunkel minimal",
    "swisstopo-imagery": "Luftbild"
  } },
  it: { control: "Mappa di base", options: {
    "swisstopo-base": "Standard",
    "swisstopo-light": "Chiaro",
    "light-minimal": "Chiaro minimale",
    "swisstopo-dark": "Scuro",
    "dark-minimal": "Scuro minimale",
    "swisstopo-imagery": "Aerea"
  } }
};
function getBasemapStrings(locale) {
  return BASEMAP_STRINGS[locale] ?? BASEMAP_STRINGS.en;
}
var BASEMAP_THUMB_CENTER = [8.5417, 47.3769];
var BASEMAP_THUMB_ZOOM = 12.2;
var BasemapThumbMap = ({ basemap }) => {
  const containerRef = useRef(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!containerRef.current) return;
    let map = null;
    let cancelled = false;
    setReady(false);
    void resolveBasemapStyle(basemap).then((style) => {
      if (cancelled || !containerRef.current) return;
      map = new maplibregl.Map({
        container: containerRef.current,
        style,
        center: BASEMAP_THUMB_CENTER,
        zoom: BASEMAP_THUMB_ZOOM,
        interactive: false,
        attributionControl: false,
        fadeDuration: 0
      });
      map.on("load", () => {
        if (!cancelled) setReady(true);
      });
    }).catch(() => {
    });
    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [basemap]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { ref: containerRef, className: "aireon-bm__thumbcanvas" }),
    !ready && /* @__PURE__ */ jsx("div", { className: "aireon-bm__thumbskel" })
  ] });
};
function nextThemeBasemap({ dark, pinned, current }) {
  if (pinned) return null;
  const target = themeBasemapId(dark);
  return target === current ? null : target;
}
var BasemapPicker = ({
  map,
  labels,
  onBasemapApplied,
  value,
  defaultValue,
  onChange,
  dark = false,
  pairWithTheme = true,
  options = BASEMAP_OPTIONS,
  className
}) => {
  const controlled = value != null;
  const [internal, setInternal] = useState(
    () => value ?? defaultValue ?? themeBasemapId(dark)
  );
  const selectedId = controlled ? value : internal;
  const [open, setOpen] = useState(false);
  const pinnedRef = useRef(value != null || defaultValue != null);
  const styleReqRef = useRef(0);
  const onAppliedRef = useRef(onBasemapApplied);
  onAppliedRef.current = onBasemapApplied;
  const applyBasemap = useCallback((id) => {
    if (!map) return;
    const basemap = getBasemapOption(id);
    const reqId = ++styleReqRef.current;
    void resolveBasemapStyle(basemap).then((style) => {
      if (!map || styleReqRef.current !== reqId) return;
      map.once("style.load", () => {
        if (styleReqRef.current !== reqId) return;
        onAppliedRef.current(map, basemap);
      });
      map.setStyle(style);
    }).catch((e) => console.error(`basemap "${id}" failed`, e));
  }, [map]);
  const select = (id) => {
    pinnedRef.current = true;
    setOpen(false);
    if (!controlled) setInternal(id);
    onChange?.(id);
    applyBasemap(id);
  };
  useEffect(() => {
    if (!pairWithTheme || !map) return;
    const next = nextThemeBasemap({ dark, pinned: pinnedRef.current, current: selectedId });
    if (!next) return;
    if (!controlled) setInternal(next);
    onChange?.(next);
    applyBasemap(next);
  }, [dark]);
  const labelFor = (id) => labels.options[id] ?? labels.control;
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `aireon-bm${dark ? " aireon-bm--dark" : ""}${className ? ` ${className}` : ""}`,
      "data-tour": "basemap-selector",
      children: /* @__PURE__ */ jsxs("div", { className: "aireon-bm__card", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            "aria-label": labels.control,
            "aria-expanded": open,
            "aria-haspopup": "menu",
            onClick: () => setOpen((o) => !o),
            className: "aireon-bm__trigger",
            children: [
              /* @__PURE__ */ jsx(Layers, { size: 18, "aria-hidden": "true" }),
              /* @__PURE__ */ jsx("span", { className: "aireon-bm__label", children: labelFor(selectedId) }),
              /* @__PURE__ */ jsx(ChevronDown, { className: `aireon-bm__chev${open ? " is-open" : ""}`, "aria-hidden": "true" })
            ]
          }
        ),
        open && /* @__PURE__ */ jsxs("div", { role: "menu", "aria-label": labels.control, className: "aireon-bm__menu", children: [
          /* @__PURE__ */ jsx("div", { className: "aireon-bm__grid", children: options.map((opt) => {
            const selected = opt.id === selectedId;
            return /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                role: "menuitemradio",
                "aria-checked": selected,
                onClick: () => select(opt.id),
                className: `aireon-bm__opt${selected ? " is-selected" : ""}`,
                children: [
                  /* @__PURE__ */ jsxs("span", { className: "aireon-bm__thumb", children: [
                    /* @__PURE__ */ jsx(BasemapThumbMap, { basemap: opt }),
                    selected && /* @__PURE__ */ jsx("span", { className: "aireon-bm__check", children: /* @__PURE__ */ jsx(Check, { size: 10, strokeWidth: 3, "aria-hidden": "true" }) })
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "aireon-bm__optlabel", children: labelFor(opt.id) })
                ]
              },
              opt.id
            );
          }) }),
          /* @__PURE__ */ jsx("p", { className: "aireon-bm__attr", children: "\xA9 swisstopo" })
        ] })
      ] })
    }
  );
};
var BasemapPicker_default = BasemapPicker;

export { BASEMAP_OPTIONS, BASEMAP_STRINGS, BasemapPicker, BasemapPicker_default as BasemapPickerDefault, BasemapThumbMap, DARK, DARK_DETAILED_SPEC, DARK_MINIMAL_ID, DARK_MINIMAL_SPEC, LIGHT, LIGHT_MINIMAL_ID, LIGHT_MINIMAL_SPEC, MINIMAL_HIDE, SWISSTOPO_BASE_ID, SWISSTOPO_DARK_BASEMAP_ID, SWISSTOPO_IMAGERY_ID, SWISSTOPO_LIGHT_BASEMAP_ID, SWISSTOPO_VT, applyRestyle, cloneStyle, getBasemapOption, getBasemapStrings, labelPaint, nextThemeBasemap, resolveBasemapStyle, roadColorByClass, themeBasemapId, toDarkDetailedStyle, toDarkMinimalStyle, toLightMinimalStyle };
