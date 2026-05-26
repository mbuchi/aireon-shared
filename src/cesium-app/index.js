/**
 * Barrel for @swissnovo/shared/cesium-app — re-exports the most common
 * setup entry points so app `main.js` files can import a handful of named
 * exports from a single path. Deeper modules are still importable via
 * `@swissnovo/shared/cesium-app/<area>/<file>.js`.
 */

export { setupApp, getAppName, getAppLabel } from './app.js';
export {
    registerI18n,
    t,
    onLocaleChange,
    applyTranslations,
    setLocale,
    getLocale,
    getSupportedLocales,
    bindLocaleSelect,
} from './i18n/engine.js';

export { setupAuth, isAuthenticated, getCurrentUser, onAuthChange, login, logout, getAccessToken } from './auth/index.js';

export { registerReleases } from './releaseNotes/releaseNotesPanel.js';
