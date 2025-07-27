import { defineConfig } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default defineConfig({
  input: 'index.js',
  output: [
    {
      file: 'dist/index.mjs',
      format: 'esm',
      sourcemap: true
    },
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: true
    }
  ],
  plugins: [
    nodeResolve(),
    commonjs()
  ],
  external: ['fetch'] // Don't bundle fetch as it's available globally
}); 