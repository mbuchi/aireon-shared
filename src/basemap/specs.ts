import type { StyleSpecification } from 'maplibre-gl';
import { applyRestyle, labelPaint, roadColorByClass, type RestyleSpec } from './restyle';

// Non-symbol clutter the two *minimal* styles drop entirely (terrain, land-use,
// casings, transit) so the parcel choropleth reads as the primary layer with
// only a few orienting labels (streets + place names) kept.
export const MINIMAL_HIDE = new Set<string>([
  'hillshade_grey', 'hillshade_yellow',
  'scree_z17', 'scree_z15', 'scree_z13', 'scree_z11',
  'contour_line', 'contour_line_blue', 'hachure',
  'landcover_casing', 'pattern_landcover',
  'landuse', 'landuse_outline', 'landuse_parking', 'landuse_parking_outline',
  'park', 'boundary', 'boundary_disputed',
  'tunnel_public_transport', 'tunnel_road', 'tunnel_pedestrian',
  'construct', 'construct_line',
  'aeroway_polygon_casing', 'aeroway_polygon_fill',
  'road_via_ferrata_trail', 'road_path_footway_ferry',
  'building_ln', 'building_casing',
  'public_transport', 'l1_public_transport', 'l1_2_pedestrian',
  'l2_public_transport_aerialway',
  'l1_road_casing', 'l2_road_casing', 'road_casing',
  'water_line_intermittent', 'hazard',
]);

// --- Light Minimal — near-white canvas, almost everything stripped ----------
export const LIGHT = {
  land: '#f4f4f1', water: '#dce6ec', waterEdge: '#c4d4dd', building: '#e8e8e3',
  green: '#ebeee7', roadMajor: '#cfcfc7', roadMinor: '#deded6',
  labelStreet: '#6f7682', labelCity: '#39404d', labelTown: '#545c69',
  labelOther: '#838b98', halo: '#f4f4f1',
} as const;

export const LIGHT_MINIMAL_SPEC: RestyleSpec = {
  recolor: {
    background: { 'background-color': LIGHT.land },
    landcover: { 'fill-color': LIGHT.green },
    water: { 'fill-color': LIGHT.water },
    water_outline: { 'line-color': LIGHT.waterEdge },
    water_line: { 'line-color': LIGHT.waterEdge },
    building: { 'fill-color': LIGHT.building },
    road_fill: { 'line-color': roadColorByClass(LIGHT.roadMajor, LIGHT.roadMinor) },
    l1_fill: { 'line-color': roadColorByClass(LIGHT.roadMajor, LIGHT.roadMinor) },
    l2_fill: { 'line-color': roadColorByClass(LIGHT.roadMajor, LIGHT.roadMinor) },
  },
  hide: MINIMAL_HIDE,
  labels: {
    transportation_label: labelPaint(LIGHT.labelStreet, LIGHT.halo, 1.3, 0.4),
    place_city: labelPaint(LIGHT.labelCity, LIGHT.halo, 1.4, 0.6),
    place_town_village: labelPaint(LIGHT.labelTown, LIGHT.halo, 1.2, 0.5),
    place_other: labelPaint(LIGHT.labelOther, LIGHT.halo, 1.1, 0.4),
  },
  symbolDefault: 'hide',
};

// --- Dark (full detail) -----------------------------------------------------
export const DARK = {
  land: '#181b20', water: '#0f141b', waterEdge: '#21303f',
  buildingDetailed: '#46505c', buildingDetailedLine: '#5c6674', building: '#20242c',
  green: '#19211c', tint: '#1c1f25', roadMajor: '#4a5161', roadMinor: '#353b44',
  roadCasing: '#13151a', faintLine: '#2b3038', rail: '#343a43', boundary: '#3a4049',
  park: '#233028', labelStreet: '#9aa3b2', labelCity: '#eef1f5', labelTown: '#c8ced8',
  labelOther: '#8e96a3', labelGeneric: '#aeb6c2', halo: '#13151a',
} as const;

// --- Dark Minimal — the minimal idea inverted (shares the DARK palette) ------
export const DARK_MINIMAL_SPEC: RestyleSpec = {
  recolor: {
    background: { 'background-color': DARK.land },
    landcover: { 'fill-color': DARK.green },
    water: { 'fill-color': DARK.water },
    water_outline: { 'line-color': DARK.waterEdge },
    water_line: { 'line-color': DARK.waterEdge },
    building: { 'fill-color': DARK.building },
    road_fill: { 'line-color': roadColorByClass(DARK.roadMajor, DARK.roadMinor) },
    l1_fill: { 'line-color': roadColorByClass(DARK.roadMajor, DARK.roadMinor) },
    l2_fill: { 'line-color': roadColorByClass(DARK.roadMajor, DARK.roadMinor) },
  },
  hide: MINIMAL_HIDE,
  labels: {
    transportation_label: labelPaint(DARK.labelStreet, DARK.halo, 1.3, 0.4),
    place_city: labelPaint(DARK.labelCity, DARK.halo, 1.5, 0.8),
    place_town_village: labelPaint(DARK.labelTown, DARK.halo, 1.3, 0.6),
    place_other: labelPaint(DARK.labelOther, DARK.halo, 1.1, 0.5),
  },
  symbolDefault: 'hide',
};

// Keeps the structure/detail of swisstopo light but dark-themed. Only terrain
// texture (hillshade, scree, hachure, contours) and the casing/outline noise are
// dropped; every other layer — including POIs and place/water/park names — is
// kept and recoloured for a dark canvas. `symbolDefault` relights any label not
// explicitly tuned below to readable light text.
const darkRoad = { 'line-color': roadColorByClass(DARK.roadMajor, DARK.roadMinor) };
const darkCasing = { 'line-color': DARK.roadCasing };
const darkFaint = { 'line-color': DARK.faintLine };
const darkRail = { 'line-color': DARK.rail };
const darkDetailedBuildingLine = { 'line-color': DARK.buildingDetailedLine };

export const DARK_DETAILED_SPEC: RestyleSpec = {
  recolor: {
    background: { 'background-color': DARK.land },
    landcover: { 'fill-color': DARK.green },
    landuse: { 'fill-color': DARK.tint },
    landuse_parking: { 'fill-color': DARK.tint },
    construct: { 'fill-color': DARK.tint },
    aeroway_polygon_fill: { 'fill-color': DARK.tint },
    water: { 'fill-color': DARK.water },
    building: {
      'fill-color': DARK.buildingDetailed,
      'fill-outline-color': DARK.buildingDetailedLine,
    },
    water_outline: { 'line-color': DARK.waterEdge },
    water_line: { 'line-color': DARK.waterEdge },
    water_line_intermittent: { 'line-color': DARK.waterEdge },
    park: { 'line-color': DARK.park },
    boundary: { 'line-color': DARK.boundary },
    boundary_disputed: { 'line-color': DARK.boundary },
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
    road_via_ferrata_trail: darkFaint,
  },
  hide: new Set<string>([
    'hillshade_grey', 'hillshade_yellow',
    'scree_z17', 'scree_z15', 'scree_z13', 'scree_z11',
    'hachure', 'pattern_landcover', 'landcover_casing',
    'landuse_outline', 'landuse_parking_outline',
    'contour_line', 'contour_line_blue', 'contour_line_pt', 'spot_elevation',
    'construct_line', 'aeroway_polygon_casing', 'hazard',
  ]),
  labels: {
    place_city: labelPaint(DARK.labelCity, DARK.halo, 1.6, 0.8),
    place_town_village: labelPaint(DARK.labelTown, DARK.halo, 1.3, 0.6),
    place_other: labelPaint(DARK.labelOther, DARK.halo, 1.1, 0.5),
    transportation_label: labelPaint(DARK.labelStreet, DARK.halo, 1.3, 0.4),
    road_number: labelPaint(DARK.labelGeneric, DARK.halo, 1.0, 0.3),
  },
  symbolDefault: labelPaint(DARK.labelGeneric, DARK.halo, 1.1, 0.5),
};

export const toLightMinimalStyle = (s: StyleSpecification) => applyRestyle(s, LIGHT_MINIMAL_SPEC);
export const toDarkMinimalStyle = (s: StyleSpecification) => applyRestyle(s, DARK_MINIMAL_SPEC);
export const toDarkDetailedStyle = (s: StyleSpecification) => applyRestyle(s, DARK_DETAILED_SPEC);
