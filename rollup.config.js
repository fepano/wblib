import fs from 'fs'
import { defineConfig } from 'rollup'
import { terser } from 'rollup-plugin-terser'
import ts from 'rollup-plugin-typescript2'

fs.rmSync('./dist', { recursive: true, force: true })
fs.rmSync('./es', { recursive: true, force: true })

export default [
  defineConfig({
    input: './src/index.ts',
    output: {
      format: 'umd',
      file: 'dist/index.min.js',
      name: 'wblib',
      sourcemap: true
    },
    plugins: [
      ts({
        tsconfigOverride: {
          compilerOptions: {
            declaration: false,
            target: 'es5'
          }
        }
      }),
      terser()
    ]
  }),
  defineConfig({
    input: './src/index.ts',
    output: {
      format: 'es',
      dir: 'es',
      preserveModules: true
    },
    plugins: [
      ts({ useTsconfigDeclarationDir: true })
    ]
  })
]
