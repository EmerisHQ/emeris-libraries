import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import inject from '@rollup/plugin-inject';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';
import { dynamicImport } from 'vite-plugin-dynamic-import';
import envCompatible from 'vite-plugin-env-compatible';
import { defineConfig } from 'vitest/config';

import * as pkg from './package.json';

// https://vitejs.dev/config/
export default () => {
  // Do Node stuff here:
  process.env.VITE_GIT_VERSION = pkg.version;
  process.env.VITE_VERSION = pkg.version;
  return defineConfig({
    build: {
      chunkSizeWarningLimit: 1000,
      sourcemap: true,
      rollupOptions: {
        input: {
          popup: path.resolve(__dirname, './popup.html'),
        },
        plugins: [
          inject({
            Buffer: ['buffer', 'Buffer'],
          }),
        ],
      },
    },
    plugins: [vue(), nodeResolve(), dynamicImport(), envCompatible()],
    resolve: {
      alias: {
        '@starport/vuex': path.resolve(__dirname, './demeris/src/utils/EmerisError.ts'),
        'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js',
        stream: 'rollup-plugin-node-polyfills/polyfills/stream',
        '@': path.resolve(__dirname, './demeris/src'),
        '@@': path.resolve(__dirname, './src'),
      },
      extensions: ['.ts', '.vue', '.js', '.json', '.tsx'],
    },
    define: {
      'process.env': process.env,
      ...(process.env.NODE_ENV !== 'test' && { 'process.platform': {} }),
    },
    server: {
      port: 8080,
    },
    optimizeDeps: {
      include: ['bip39'],
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
            buffer: true,
          }),
        ],
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      transformMode: {
        web: [/\.[jt]sx$/],
      },
      exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
    },
  });
};
