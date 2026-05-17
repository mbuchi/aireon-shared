import { defineConfig } from 'tsup';

export default defineConfig({
  // Two entries: the main barrel, and a server-safe `/api` subpath that omits
  // the browser-only modules (auth touches `window` at module load).
  entry: ['src/index.ts', 'src/api/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom', 'lucide-react', 'oidc-client-ts', 'openapi-fetch'],
});
