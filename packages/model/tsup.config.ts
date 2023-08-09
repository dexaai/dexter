import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/openai/index.ts', 'src/custom/index.ts'],
  format: ['esm', 'cjs'],
  clean: true,
  dts: true,
  target: 'es2022',
});
