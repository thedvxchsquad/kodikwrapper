import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/**/*.ts'],
  dts: true,
  clean: true,
  minify: true,
  target: 'es2022',
  format: ['cjs', 'esm'],
  bundle: false,
});
