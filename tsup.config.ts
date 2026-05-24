import { defineConfig } from 'tsup';

export default defineConfig({
  // Three entries: the main barrel; a server-safe `/api` subpath that omits
  // the browser-only modules (auth touches `window` at module load); and the
  // `/signal-collect` Vercel edge handler (also server-safe).
  entry: ['src/index.ts', 'src/api/index.ts', 'src/signal/handler.ts'],
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
  ],
});
