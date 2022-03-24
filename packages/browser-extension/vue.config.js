const path = require('path')

module.exports = {
  lintOnSave: true,
  pages: {
    popup: {
      template: 'public/browser-extension.html',
      entry: './src/popup/main.ts',
      title: 'Popup',
    },
    options: {
      template: 'public/browser-extension.html',
      entry: './src/options/main.ts',
      title: 'Options',
    },
  },
  configureWebpack: {
    devtool: 'inline-source-map',
    output: {
      filename: '[name].js',
    },
  },
  pluginOptions: {
    browserExtension: {
      components: {
        background: true,
        contentScripts: true,
      },
      componentOptions: {
        background: {
          entry: 'src/background.ts',
        },
        contentScripts: {
          entries: {
            'content-script': ['src/content-scripts/content-script.ts'],
          },
        },
      },
    },
  },
  chainWebpack: (config) => {
    config.optimization.splitChunks({
      cacheGroups: {
        demeris: {
          test: path.resolve('./demeris'),
          name: 'demeris',
          // chunks: 'all'
        },
      },
    });
    config.module.rules.delete('eslint');
    config.entry('inject-emeris').add('./src/content-scripts/inject-emeris.ts').end();
    config.resolve.alias.set('@', path.resolve(__dirname, 'demeris/src')).set('@@', path.resolve(__dirname, 'src'));

    config.resolve.symlinks(false)
    config.resolve.alias.set('vue', path.resolve('./node_modules/vue'))
  },
  transpileDependencies: [
    '@starport/tendermint-liquidity-js',
    '@clockwork-projects/tendermint-liquidity-js',
    '@clockwork-projects/cosmos-gaia-js',
    '@clockwork-projects/osmosis-labs-osmosis-js',
    '@emeris/signer',
  ],
};
