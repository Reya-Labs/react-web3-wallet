import commonjs from '@rollup/plugin-commonjs'; // Consider if you still need this for dependencies
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import bundleSize from 'rollup-plugin-bundle-size';
import dts from 'rollup-plugin-dts';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';

const packageJson = require('./package.json');

export default [
  {
    external: ['react', 'react-dom', 'wagmi', 'viewem'],
    input: 'src/index.ts',
    output: {
      file: packageJson.module, // ESM output
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(), // Check if this is necessary
      typescript({ tsconfig: './tsconfig.build.json' }),
      terser(),
      bundleSize(),
    ],
  },
  {
    input: 'dist/esm/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts.default()],
  },
];
