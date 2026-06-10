import { StyleSpecification, Map } from 'maplibre-gl';
import * as react_jsx_runtime from 'react/jsx-runtime';

declare function cloneStyle(style: StyleSpecification): StyleSpecification;
declare const roadColorByClass: (major: string, minor: string) => unknown;
declare const labelPaint: (color: string, halo: string, haloWidth: number, haloBlur?: number) => Record<string, unknown>;
interface RestyleSpec {
    recolor: Record<string, Record<string, unknown>>;
    hide: Set<string>;
    labels: Record<string, Record<string, unknown>>;
    symbolDefault: 'hide' | Record<string, unknown>;
}
declare function applyRestyle(style: StyleSpecification, spec: RestyleSpec): StyleSpecification;

declare const MINIMAL_HIDE: Set<string>;
declare const LIGHT: {
    readonly land: "#f4f4f1";
    readonly water: "#dce6ec";
    readonly waterEdge: "#c4d4dd";
    readonly building: "#e8e8e3";
    readonly green: "#ebeee7";
    readonly roadMajor: "#cfcfc7";
    readonly roadMinor: "#deded6";
    readonly labelStreet: "#6f7682";
    readonly labelCity: "#39404d";
    readonly labelTown: "#545c69";
    readonly labelOther: "#838b98";
    readonly halo: "#f4f4f1";
};
declare const LIGHT_MINIMAL_SPEC: RestyleSpec;
declare const DARK: {
    readonly land: "#181b20";
    readonly water: "#0f141b";
    readonly waterEdge: "#21303f";
    readonly buildingDetailed: "#46505c";
    readonly buildingDetailedLine: "#5c6674";
    readonly building: "#20242c";
    readonly green: "#19211c";
    readonly tint: "#1c1f25";
    readonly roadMajor: "#4a5161";
    readonly roadMinor: "#353b44";
    readonly roadCasing: "#13151a";
    readonly faintLine: "#2b3038";
    readonly rail: "#343a43";
    readonly boundary: "#3a4049";
    readonly park: "#233028";
    readonly labelStreet: "#9aa3b2";
    readonly labelCity: "#eef1f5";
    readonly labelTown: "#c8ced8";
    readonly labelOther: "#8e96a3";
    readonly labelGeneric: "#aeb6c2";
    readonly halo: "#13151a";
};
declare const DARK_MINIMAL_SPEC: RestyleSpec;
declare const DARK_DETAILED_SPEC: RestyleSpec;
declare const toLightMinimalStyle: (s: StyleSpecification) => StyleSpecification;
declare const toDarkMinimalStyle: (s: StyleSpecification) => StyleSpecification;
declare const toDarkDetailedStyle: (s: StyleSpecification) => StyleSpecification;

declare const SWISSTOPO_VT = "https://vectortiles.geo.admin.ch/styles";
declare const SWISSTOPO_BASE_ID = "swisstopo-base";
declare const SWISSTOPO_LIGHT_BASEMAP_ID = "swisstopo-light";
declare const SWISSTOPO_DARK_BASEMAP_ID = "swisstopo-dark";
declare const SWISSTOPO_IMAGERY_ID = "swisstopo-imagery";
declare const LIGHT_MINIMAL_ID = "light-minimal";
declare const DARK_MINIMAL_ID = "dark-minimal";
interface BasemapOption {
    id: string;
    styleUrl: string;
    styleTransform?: (style: StyleSpecification) => StyleSpecification;
}
declare const BASEMAP_OPTIONS: BasemapOption[];
declare const themeBasemapId: (isDarkMode: boolean) => string;
declare const getBasemapOption: (basemapId: string) => BasemapOption;
declare function resolveBasemapStyle(basemap: BasemapOption): Promise<string | StyleSpecification>;

type BasemapLocale = 'en' | 'fr' | 'de' | 'it';
interface BasemapLabels {
    /** aria-label for the picker trigger / control. */
    control: string;
    /** basemap id → display name. */
    options: Record<string, string>;
}
declare const BASEMAP_STRINGS: Record<BasemapLocale, BasemapLabels>;
declare function getBasemapStrings(locale: string): BasemapLabels;

declare const BasemapThumbMap: ({ basemap }: {
    basemap: BasemapOption;
}) => react_jsx_runtime.JSX.Element;

/** Pure decision for theme auto-pairing. Exported for unit testing. */
declare function nextThemeBasemap({ dark, pinned, current }: {
    dark: boolean;
    pinned: boolean;
    current: string;
}): string | null;
interface BasemapPickerProps {
    map: Map | null;
    labels: BasemapLabels;
    /** Required: re-add the app's own data layers after the style swap + load. */
    onBasemapApplied: (map: Map, basemap: BasemapOption) => void;
    value?: string;
    defaultValue?: string;
    onChange?: (id: string) => void;
    dark?: boolean;
    /** Suite standard: ON. Manual pick pins and suppresses further auto-pairing. */
    pairWithTheme?: boolean;
    options?: BasemapOption[];
    className?: string;
}
declare const BasemapPicker: ({ map, labels, onBasemapApplied, value, defaultValue, onChange, dark, pairWithTheme, options, className, }: BasemapPickerProps) => react_jsx_runtime.JSX.Element;

export { BASEMAP_OPTIONS, BASEMAP_STRINGS, type BasemapLabels, type BasemapLocale, type BasemapOption, BasemapPicker, BasemapPicker as BasemapPickerDefault, type BasemapPickerProps, BasemapThumbMap, DARK, DARK_DETAILED_SPEC, DARK_MINIMAL_ID, DARK_MINIMAL_SPEC, LIGHT, LIGHT_MINIMAL_ID, LIGHT_MINIMAL_SPEC, MINIMAL_HIDE, type RestyleSpec, SWISSTOPO_BASE_ID, SWISSTOPO_DARK_BASEMAP_ID, SWISSTOPO_IMAGERY_ID, SWISSTOPO_LIGHT_BASEMAP_ID, SWISSTOPO_VT, applyRestyle, cloneStyle, getBasemapOption, getBasemapStrings, labelPaint, nextThemeBasemap, resolveBasemapStyle, roadColorByClass, themeBasemapId, toDarkDetailedStyle, toDarkMinimalStyle, toLightMinimalStyle };
