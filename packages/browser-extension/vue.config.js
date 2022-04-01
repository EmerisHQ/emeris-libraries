const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  lintOnSave: true,
  pages: {
    popup: {
      template: 'public/browser-extension.html',
      entry: './src/popup/main.ts',
      title: 'Popup',
    },
  },
  configureWebpack: {
    devtool: 'source-map',
    output: {
      filename: '[name].js',
    },
    resolve: {
      alias: {
        'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js'
      }
    },
    plugins: [
      new CopyPlugin([
        { from: 'src/manifest.json', to: 'manifest.json', force: true },
      ])
    ]
  },
  pluginOptions: {
    // browserExtension: {
    //   components: {
    //     background: false,
    //     contentScripts: true,
    //   },
    //   componentOptions: {
    //     background: {
    //       entry: 'src/background.ts',
    //     },
    //     contentScripts: {
    //       entries: {
    //         'content-script': ['src/content-scripts/content-script.ts'],
    //       },
    //     },
    //   },
    // },
  },
  chainWebpack: (config) => {
    // No need for splitting
    config.optimization.delete('splitChunks');
    config.module.rules.delete('eslint');
    config
      .entry('content-script')
      .add('./src/content-scripts/content-script.ts');
    config
      .entry('background')
      .add('./src/background.ts');
    config
      .entry('inject-emeris')
      .add('./src/content-scripts/inject-emeris.ts').end();
    config.resolve.alias
      .set('@', path.resolve(__dirname, 'demeris/src'))
      .set('@@', path.resolve(__dirname, 'src'));

    config.resolve.symlinks(false)
    config.resolve.alias.set('vue', path.resolve('./node_modules/vue'))

    // config.module
    //   .rule('vue')
    //   .use('vue-loader')
    //   .loader('vue-loader')
    //   .tap(options => {
    //     options.prettify = false
    //     return options
    //   })
  },
  transpileDependencies: [
    '@starport/tendermint-liquidity-js',
    '@clockwork-projects/tendermint-liquidity-js',
    '@clockwork-projects/cosmos-gaia-js',
    '@clockwork-projects/osmosis-labs-osmosis-js',
    '@emeris/signer',
    '@emeris/mapper',
  ],
};
