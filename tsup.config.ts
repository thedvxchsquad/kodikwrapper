import {defineConfig} from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  dts: true,
  clean: true,
  minify: true,
  target: 'es6',
  format: ['cjs', 'esm']
});
