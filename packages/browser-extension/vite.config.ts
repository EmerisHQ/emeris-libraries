import { dirname, relative } from 'path'
import { defineConfig, UserConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
// import Icons from 'unplugin-icons/vite'
// import IconsResolver from 'unplugin-icons/resolver'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
// import { nodeResolve } from '@rollup/plugin-node-resolve';
// import { dynamicImport } from 'vite-plugin-dynamic-import';
// import envCompatible from 'vite-plugin-env-compatible';
import eslintPlugin from 'vite-plugin-eslint';
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import WindiCSS from 'vite-plugin-windicss'
import windiConfig from './windi.config'
import { r, port, isDev } from './scripts/utils'  

export const sharedConfig: UserConfig = {
  root: r('src'),
  resolve: {
    alias: {
      '~/': `${r('src')}/`,
      '@@/': `${r('src')}/`,
      '@/': `${r('demeris/src')}/`,
    },
  },
  define: {
    __DEV__: isDev,
    exports:{},
    "global": {},
    'process.env': process.env,
    ...(process.env.NODE_ENV !== 'test' && { 'process.platform': {} }),
  },
  plugins: [
    Vue(),
    
    // nodeResolve(), 
    // dynamicImport(), 
    // envCompatible(), 
    eslintPlugin({ fix: true }),

    // AutoImport({
    //   imports: [
    //     'vue',
    //     {
    //       'webextension-polyfill': [
    //         ['*', 'browser'],
    //       ],
    //     },
    //   ],
    //   dts: r('src/auto-imports.d.ts'),
    // }),

    // https://github.com/antfu/unplugin-vue-components
    // Components({
    //   dirs: [r('src/components')],
    //   // generate `components.d.ts` for ts support with Volar
    //   dts: true,
    //   // resolvers: [
    //   //   // auto import icons
    //   //   IconsResolver({
    //   //     componentPrefix: '',
    //   //   }),
    //   // ],
    // }),

    // https://github.com/antfu/unplugin-icons
    // Icons(),

    // rewrite assets to use relative path
    {
      name: 'assets-rewrite',
      enforce: 'post',
      apply: 'build',
      transformIndexHtml(html, { path }) {
        return html.replace(/"\/assets\//g, `"${relative(dirname(path), '/assets')}/`)
      },
    },
  ],
  optimizeDeps: {
    include: [
      'vue',
      // '@vueuse/core',
      'webextension-polyfill',
    ],
    exclude: [
      'vue-demi',
    ],
  },
}

export default defineConfig(({ command }) => ({
  ...sharedConfig,
  base: command === 'serve' ? `http://localhost:${port}/` : '/dist/',
  server: {
    port,
    hmr: {
      host: 'localhost',
    },
  },
  build: {
    outDir: r('extension/dist'),
    emptyOutDir: false,
    sourcemap: isDev ? 'inline' : false,
    // https://developer.chrome.com/docs/webstore/program_policies/#:~:text=Code%20Readability%20Requirements
    terserOptions: {
      mangle: false,
    },
    rollupOptions: {
      input: {
        background: r('src/background/index.html'),
        // options: r('src/options/index.html'),
        popup: r('src/popup/index.html'),
      },
    },
  },
  // optimizeDeps: {
  //   include: [
  //     '@starport/tendermint-liquidity-js',
  //     '@clockwork-projects/tendermint-liquidity-js',
  //     '@clockwork-projects/cosmos-gaia-js',
  //     '@clockwork-projects/osmosis-labs-osmosis-js',
  //     '@emeris/signer'
  //   ]
  // },
  plugins: [
    ...sharedConfig.plugins!,

    // https://github.com/antfu/vite-plugin-windicss
    WindiCSS({
      config: windiConfig,
    }),
  ],
}))
