// src/map/parcelInteraction.ts
var PARCEL_INTERACTION_MIN_ZOOM = 15;
function isParcelInteractive(zoom) {
  return zoom >= PARCEL_INTERACTION_MIN_ZOOM;
}
function wireZoomGatedParcelClick(map, layerId, onSelect) {
  const handler = (ev) => {
    if (!isParcelInteractive(map.getZoom())) return;
    onSelect(ev);
  };
  map.on("click", layerId, handler);
  return () => map.off("click", layerId, handler);
}

export { PARCEL_INTERACTION_MIN_ZOOM, isParcelInteractive, wireZoomGatedParcelClick };
