import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom', 'lucide-react', 'oidc-client-ts', 'openapi-fetch'],
});
