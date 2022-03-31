import { dirname, relative } from 'path'
import { defineConfig, UserConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
// import { esbuildCommonjs, viteCommonjs } from '@originjs/vite-plugin-commonjs'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
// import eslintPlugin from 'vite-plugin-eslint'
import WindiCSS from 'vite-plugin-windicss'
import windiConfig from './windi.config'
import { r, port, isDev } from './scripts/utils'
import { resolve } from 'path'
// import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
// import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
// import GlobalsPolyfills from "@esbuild-plugins/node-globals-polyfill";
// You don't need to add this to deps, it's included by @esbuild-plugins/node-modules-polyfill
// import rollupNodePolyFill from 'rollup-plugin-node-polyfills'
// import notifier from "vite-plugin-notifier";
import { Buffer as Buffer } from 'buffer'
// import path from 'path'

// import { Buffer } from 'buffer'
// globalThis.Buffer = Buffer

// import vueJsx from '@vitejs/plugin-vue-jsx';
// import envCompatible from 'vite-plugin-env-compatible';

export const sharedConfig: UserConfig = {
  root: r('src'),
  resolve: {
    alias: {
      stream: `${r('node_modules/rollup-plugin-node-polyfills/polyfills/stream.js')}`,
      buffer:`${r('node_modules/rollup-plugin-node-polyfills/polyfills/buffer-es6.js')}`,
      'safe-buffer':`${r('node_modules/rollup-plugin-node-polyfills/polyfills/buffer-es6.js')}`,
      string_decoder: `${r('node_modules/rollup-plugin-node-polyfills/polyfills/string-decoder')}`,
      '~/': `${r('src')}/`,
      '@@/': `${r('src')}/`,
      '@/': `${r('demeris/src')}/`,
      // 'stream': "stream-browserify",
      // This Rollup aliases are extracted from @esbuild-plugins/node-modules-polyfill,
      // see https://github.com/remorses/esbuild-plugins/blob/master/node-modules-polyfill/src/polyfills.ts
      // process and buffer are excluded because already managed
      // by node-globals-polyfill
      util: `${r('node_modules/rollup-plugin-node-polyfills/polyfills/util.js')}`,
      process: `${r('node_modules/rollup-plugin-node-polyfills/polyfills/process-es6.js')}`,
      // sys: 'util',
      // events: 'rollup-plugin-node-polyfills/polyfills/events',
     
      // string_decoder: `${r('node_modules/rollup-plugin-node-polyfills/polyfills/string-decoder.js')}`,
      // string_decoder:  path.resolve('./node_modules/rollup-plugin-node-polyfills/polyfills/string-decoder.js?')
      // path: 'rollup-plugin-node-polyfills/polyfills/path',
      // querystring: 'rollup-plugin-node-polyfills/polyfills/qs',
      // punycode: 'rollup-plugin-node-polyfills/polyfills/punycode',
      // url: 'rollup-plugin-node-polyfills/polyfills/url',
      // http: 'rollup-plugin-node-polyfills/polyfills/http',
      // https: 'rollup-plugin-node-polyfills/polyfills/http',
      // os: 'rollup-plugin-node-polyfills/polyfills/os',
      // assert: 'rollup-plugin-node-polyfills/polyfills/assert',
      // constants: 'rollup-plugin-node-polyfills/polyfills/constants',
      // _stream_duplex: `${r('rollup-plugin-node-polyfills/polyfills/readable-stream/duplex.js')}`,
      // './_stream_readable': `${r('rollup-plugin-node-polyfills/polyfills/readable-stream/readable.js')}`,
      // _stream_passthrough:
      //     'rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough',
      // _stream_readable:
      //     'rollup-plugin-node-polyfills/polyfills/readable-stream/readable',
      // _stream_writable:
      //     'rollup-plugin-node-polyfills/polyfills/readable-stream/writable',
      // _stream_transform:
      //     'rollup-plugin-node-polyfills/polyfills/readable-stream/transform',
      // timers: 'rollup-plugin-node-polyfills/polyfills/timers',
      // console: 'rollup-plugin-node-polyfills/polyfills/console',
      // vm: 'rollup-plugin-node-polyfills/polyfills/vm',
      // zlib: 'rollup-plugin-node-polyfills/polyfills/zlib',
      // tty: 'rollup-plugin-node-polyfills/polyfills/tty',
      // domain: 'rollup-plugin-node-polyfills/polyfills/domain'
    },
  },
  define: {
    __DEV__: isDev,
    global: "globalThis",
    exports:{},
    Buffer2: Buffer,
    'process.env': process.env,
    ...(process.env.NODE_ENV !== 'test' && { 'process.platform': {} }),
  },
  plugins: [
    Vue(),

    // notifier(),
    viteCommonjs(),
    // fix for Vite to work with packages that have node functionality
    // NodeGlobalsPolyfillPlugin({
    //   process: true,
    //   buffer: true,
    // }),
    // NodeModulesPolyfillPlugin(),

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
    esbuildOptions: {
      
        // Node.js global to browser globalThis
        define: {
            global: 'globalThis'
            
        },
        // Enable esbuild polyfill plugins
        // plugins: [
            // NodeGlobalsPolyfillPlugin({
            //     process: true,
            //     buffer: true
            // }),
            // NodeModulesPolyfillPlugin()
            // GlobalsPolyfills({
            //   process: true,
            //   buffer: true,
            // }),
        // ]
    },
    include: [
      'vue',
      'webextension-polyfill',
    ],
    exclude: [
      'vue-demi',
      // 'safe-buffer',
      'pbkdf2',
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
      // plugins: [
      //   // Enable rollup polyfills plugin
      //   // used during production bundling
      //   rollupNodePolyFill()
      // ],
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
