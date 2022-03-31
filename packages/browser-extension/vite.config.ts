import { dirname, relative } from 'path'
import { defineConfig, UserConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import { esbuildCommonjs, viteCommonjs } from '@originjs/vite-plugin-commonjs'
import eslintPlugin from 'vite-plugin-eslint'
import WindiCSS from 'vite-plugin-windicss'
import windiConfig from './windi.config'
import { r, port, isDev } from './scripts/utils'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'

export const sharedConfig: UserConfig = {
  root: r('src'),
  resolve: {
    alias: {
      '~/': `${r('src')}/`,
      '@@/': `${r('src')}/`,
      '@/': `${r('demeris/src')}/`,
      '../../tsconfig.json':`${r('tsconfig.json')}`,
    },
  },
  define: {
    __DEV__: isDev,
    global: "globalThis",
    exports:{},
    'process.env': process.env,
    ...(process.env.NODE_ENV !== 'test' && { 'process.platform': {} }),
  },
  plugins: [
    Vue(),
    eslintPlugin({ fix: true }),
    
    // fix for Vite to work with packages that have node functionality
    // viteCommonjs(),
    NodeGlobalsPolyfillPlugin({
      process: true,
      buffer: true,
    }),
    NodeModulesPolyfillPlugin(),

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
    esbuildOptions:{
      // define:{
      //   global:'globalThis',
      // },
      plugins:[
        // viteCommonjs(),
        // NodeGlobalsPolyfillPlugin({
        //   process: true,
        //   buffer: true,
        // }),
        // NodeModulesPolyfillPlugin(),
        // esbuildCommonjs(['events','@ledgerhq/hw-transport-webusb']) ,
      ]
    },
    include: [
      'vue',
      // '@vueuse/core',
      'webextension-polyfill',
    ],
    exclude: [
      'vue-demi',
      // 'buffer'
      '@ledgerhq/hw-transport-webusb'
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
  plugins: [
    ...sharedConfig.plugins!,

    // https://github.com/antfu/vite-plugin-windicss
    WindiCSS({
      config: windiConfig,
    }),
  ],
}))
