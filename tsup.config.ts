import { defineConfig } from 'tsup';

export default defineConfig({
  // Four entries: the main barrel; a server-safe `/api` subpath that omits
  // the browser-only modules (auth touches `window` at module load); the
  // `/signal-collect` Vercel edge handler (also server-safe); and the
  // `/gemini` model-fallback helper (server-safe, no React).
  entry: [
    'src/index.ts',
    'src/api/index.ts',
    'src/signal/handler.ts',
    'src/errorlog/handler.ts',
    'src/gemini/index.ts',
  ],
  format: ['esm'],
  dts: true,
  clean: true,
  treeshake: true,
  external: [
    'react',
    'react-dom',
    'lucide-react',
    'oidc-client-ts',
    'openapi-fetch',
    // Optional peer dep, loaded via dynamic import only when an app opts in to
    // OpenReplay session replay. Keep it external so it's never bundled here.
    '@openreplay/tracker',
  ],
});
