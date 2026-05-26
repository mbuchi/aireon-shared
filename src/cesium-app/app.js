/**
 * App context for SwissNovo Cesium-3D apps.
 *
 * Identifies which app (hood, similoo, …) the shared modules are running
 * under, so things like the screenshot filename prefix, the signal payload's
 * `app_name` field, and the image-upload `APP_SOURCE` constant can stay
 * shared while still tagging events with the right app. The app's `main.js`
 * calls `setupApp({ appName: 'hood' })` near startup, before any shared
 * module that consumes the app name runs.
 */

let _appName = 'cesium-app';
let _appLabel = null;

export function setupApp({ appName, appLabel } = {}) {
    if (typeof appName === 'string' && appName) _appName = appName;
    if (typeof appLabel === 'string' && appLabel) _appLabel = appLabel;
}

export function getAppName() {
    return _appName;
}

export function getAppLabel() {
    return _appLabel || _appName;
}
