/* eslint-disable  */

// https://vitejs.dev/config/
import { defineConfig, loadEnv, UserConfig } from 'vite'
import pkg from './package.json'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'
import { createStyleImportPlugin } from 'vite-plugin-style-import'
import viteLegacyPlugin from '@vitejs/plugin-legacy'
import ssr from 'vite-plugin-ssr/plugin'
import macrosPlugin from 'vite-plugin-babel-macros'
// @ts-ignore
import vavite from 'vavite'
import { injectEnvConfig } from './build'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import { vitePlugins } from '@nbit/utils'
// import { visualizer } from 'rollup-plugin-visualizer'
import basicSsl from '@vitejs/plugin-basic-ssl'
const { dependencies } = pkg
// Packages we want in the vendor aka the deps needed in the entire app.
const optDeps = [
  '@nbit/vant',
  'ahooks',
  'react-use',
  'lodash',
  '@nbit/react',
  '@nbit/utils',
  '@dnd-kit/sortable',
  '@dnd-kit/core',
  '@dnd-kit/utilities',
  'decimal.js',
  'firebase/app',
  'firebase/auth',
  'intro.js-react',
  '@nivo/pie',
]

process.env.VITE_MARKCOIN_BUSINESS_ID = process.env.VITE_MARKCOIN_BUSINESS_ID || '1'
const id = process.env.VITE_MARKCOIN_BUSINESS_ID
export default async ({ mode }) => {
  const isCiBuild = mode === 'ci'
  const env = loadEnv(mode, process.cwd())
  const isDevelopment = mode === 'development'
  const { VITE_PORT, VITE_NEWBIT_ENV } = env
  await injectEnvConfig(env, mode, id)
  const enabledSentry = ['test', 'production'].includes(VITE_NEWBIT_ENV || '')
  const enabledSourceMap = ['dev', 'test'].includes(VITE_NEWBIT_ENV || '')
  return defineConfig({
    legacy: { buildSsrCjsExternalHeuristics: true },
    server: {
      port: Number(VITE_PORT),
      host: 'localhost',
      https: true,
    },
    ssr: {
      optimizeDeps: {
        include: optDeps,
        disabled: 'build',
      },
    },
    buildSteps: [
      {
        name: 'client',
        config: {
          build: {
            rollupOptions: {
              output: {
                manualChunks: {
                  lodash: ['lodash'],
                },
              },
            },
          },
        },
      },
      {
        name: 'server',
        config: {
          build: {
            ssr: true,
            rollupOptions: {
              output: {
                // We have to disable this for multiple entries
                inlineDynamicImports: false,
              },
            },
          },
        },
      },
    ],
    plugins: [
      basicSsl(),
      enabledSentry
        ? sentryVitePlugin({
            org: 'newbit',
            project: 'newbit-h5',
            include: './dist',
            authToken: 'd247ef4d9ba344fab67085856a6b5cdca83c24ff42f34a3eb2ab6b0cbd0eebde',
          })
        : {},
      vavite({
        serverEntry: '/server/index.ts',
        serveClientAssetsInDev: true,
      }),
      isDevelopment ? vitePlugins.cssModuleHMR() : {},
      tsconfigPaths(),
      macrosPlugin(),
      viteLegacyPlugin({
        renderLegacyChunks: !isCiBuild,
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      }),
      react({
        babel: {
          plugins: ['macros'],
          ...(process.env.DEV_DEBUG && {
            babelrc: true,
          }),
        },
      }),
      createStyleImportPlugin({
        libs: [
          {
            libraryName: '@nbit/vant',
            resolveStyle: name => {
              if (['area', 'config-provider', 'datetime-picker', 'hooks'].includes(name)) {
                return ''
              }
              return `@nbit/vant/es/${name}/style/index.css`
            },
          },
        ],
      }),
      ssr({ disableAutoFullBuild: true }),
      // visualizer()
    ],
    build: {
      target: 'es2018',
      outDir: './dist',
      sourcemap: enabledSourceMap,
      // rollupOptions: {
      //   output: {
      //     manualChunks: {
      //       vendor: globalVendorPackages,
      //       ...renderChunks(dependencies),
      //     },
      //   },
      // },
    },
    css: {
      modules: {
        generateScopedName: '[folder]-[name]__[local]--[hash:base64:3]',
        scopeBehaviour: 'global',
      },
    },
  } as UserConfig)
}
