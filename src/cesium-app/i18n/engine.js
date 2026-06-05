/**
 * Vanilla-JS i18n engine for SwissNovo Cesium-3D apps (hood, similoo, …).
 *
 * The apps are vanilla JS (no React), so they cannot consume the React
 * `<LocaleSelector>` / `I18nContext` pattern used by the rest of the suite.
 * This module is the vanilla equivalent — same key-prefix convention, same
 * fallback chain (locale → en → key), same `{placeholder}` interpolation.
 *
 * App bootstrap:
 *
 *   import { registerI18n } from '@aireon/shared/cesium-app/i18n/engine.js';
 *   registerI18n({
 *     catalog: { en: {...}, fr: {...}, de: {...}, it: {...} },
 *     storageKey: 'hood:locale',
 *     supportedLocales: ['en', 'fr', 'de', 'it'],
 *   });
 *
 * The app's `i18n.js` does this at module top-level; every other module then
 * imports `{ t, onLocaleChange }` from the engine and gets a populated runtime.
 *
 * DOM contract:
 *   [data-i18n="key"]                 — textContent (or innerHTML if
 *                                       [data-i18n-html] is present)
 *   [data-i18n-attr="attr:key,..."]   — setAttribute for each pair
 *
 * Persistence: localStorage[storageKey]. First-load fallback chain:
 *   stored locale → navigator.language[0:2] (if supported) → 'en'.
 */

let _catalog = { en: {} };
let _storageKey = 'app:locale';
let _supportedLocales = ['en'];
let _currentLocale = 'en';
const _subscribers = new Set();

function detectInitialLocale() {
    try {
        const stored = localStorage.getItem(_storageKey);
        if (stored && _supportedLocales.includes(stored)) return stored;
    } catch {
        /* localStorage may be disabled — fall through */
    }
    try {
        const nav = (navigator.language || '').slice(0, 2).toLowerCase();
        if (_supportedLocales.includes(nav)) return nav;
    } catch {
        /* SSR / non-browser — fall through */
    }
    return _supportedLocales[0] || 'en';
}

/**
 * Register the active app's translation catalog with the engine. Must be
 * called before any consumer calls t() or applyTranslations(). Apps typically
 * do this as a module side effect from their local `i18n.js` wrapper.
 */
export function registerI18n({ catalog, storageKey, supportedLocales }) {
    if (catalog && typeof catalog === 'object') _catalog = catalog;
    if (typeof storageKey === 'string' && storageKey) _storageKey = storageKey;
    if (Array.isArray(supportedLocales) && supportedLocales.length) {
        _supportedLocales = supportedLocales.slice();
    }
    _currentLocale = detectInitialLocale();
    if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.lang = _currentLocale;
    }
}

export function getLocale() {
    return _currentLocale;
}

export function getSupportedLocales() {
    return _supportedLocales.slice();
}

function interpolate(str, params) {
    if (!params || typeof str !== 'string') return str;
    return str.replace(/\{(\w+)\}/g, (m, key) =>
        Object.prototype.hasOwnProperty.call(params, key) ? String(params[key]) : m
    );
}

/**
 * Look up a key in the active locale, falling back to en, then to the key
 * itself. Optional `{placeholder}` interpolation via the second argument.
 */
export function t(key, params) {
    const table = _catalog[_currentLocale] || _catalog.en || {};
    const raw =
        table[key] != null
            ? table[key]
            : _catalog.en && _catalog.en[key] != null
                ? _catalog.en[key]
                : key;
    return interpolate(raw, params);
}

/**
 * Sweep the DOM under `root` and rewrite every element bearing
 *   [data-i18n="key"]                 — sets textContent (or innerHTML
 *                                       if [data-i18n-html] is present).
 *   [data-i18n-attr="attr:key,..."]   — sets each named attribute.
 *
 * Also keeps <html lang> aligned with the active locale.
 */
export function applyTranslations(root = document) {
    const els = root.querySelectorAll('[data-i18n]');
    els.forEach((el) => {
        const key = el.getAttribute('data-i18n');
        if (!key) return;
        const value = t(key);
        if (el.hasAttribute('data-i18n-html')) {
            el.innerHTML = value;
        } else {
            el.textContent = value;
        }
    });

    const attrEls = root.querySelectorAll('[data-i18n-attr]');
    attrEls.forEach((el) => {
        const spec = el.getAttribute('data-i18n-attr');
        if (!spec) return;
        spec.split(',').forEach((pair) => {
            const [attr, key] = pair.split(':').map((s) => s && s.trim());
            if (!attr || !key) return;
            el.setAttribute(attr, t(key));
        });
    });

    if (root === document || root === document.documentElement) {
        document.documentElement.lang = _currentLocale;
    }
}

/**
 * Set the active locale. Persists to localStorage, sweeps the DOM, and
 * notifies subscribers. No-op if the locale is unsupported or unchanged.
 */
export function setLocale(locale) {
    if (!_supportedLocales.includes(locale)) return;
    if (locale === _currentLocale) return;
    _currentLocale = locale;
    try {
        localStorage.setItem(_storageKey, locale);
    } catch {
        /* private mode — choice is just session-scoped */
    }
    if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.lang = locale;
        applyTranslations(document);
    }
    _subscribers.forEach((cb) => {
        try {
            cb(locale);
        } catch (err) {
            console.error('Locale subscriber error:', err);
        }
    });
}

/**
 * Subscribe to locale changes — used by JS-rendered fragments that need to
 * re-render their own DOM when the language switches (the static DOM sweep
 * cannot reach into innerHTML written after the sweep happened).
 *
 * Returns an unsubscribe function.
 */
export function onLocaleChange(callback) {
    _subscribers.add(callback);
    return () => _subscribers.delete(callback);
}

/**
 * Wire up a <select> element to act as the locale switcher.
 * Sets its initial value, adds the change listener. Idempotent-safe.
 */
export function bindLocaleSelect(elementOrId) {
    const sel =
        typeof elementOrId === 'string'
            ? document.getElementById(elementOrId)
            : elementOrId;
    if (!sel) return;
    sel.value = _currentLocale;
    sel.addEventListener('change', (e) => setLocale(e.target.value));
    onLocaleChange((locale) => {
        if (sel.value !== locale) sel.value = locale;
    });
}
