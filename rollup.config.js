import typescript from 'rollup-plugin-typescript2';
import { terser } from "rollup-plugin-terser";

export default {
  input: './src/WreckedRadio.ts',
  output: {
    file: './dist/WreckedRadio.js',
    format: 'esm',
    sourcemap: true
  },
  plugins: [
    typescript(),
    terser({
        sourcemap: true
    })
  ]
}
