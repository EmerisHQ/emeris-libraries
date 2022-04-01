const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: {
    'content-script': ['./src/content-scripts/content-script.ts'],
    background: ['./src/background.ts'],
    'inject-emeris': ['./src/content-scripts/inject-emeris.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './demeris/src'),
      '@@': path.resolve(__dirname, './src'),
    },
    extensions: ['.ts', '.tsx', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'testdist'),
    filename: '[name].js',
    publicPath: '/',
    chunkFilename: 'js/[name].[contenthash:8].js',
  },
  module: {
    rules: [{ test: /\.txt$/, use: 'raw-loader' }],
    rules: [
      {
        test: /\.m?jsx?$/,
        include: [
          path.resolve(__dirname, 'node_modules/@clockwork-projects/osmosis-labs-osmosis-js/osmosis-labs/osmosis/osmosis.gamm.v1beta1/index.js@starport/tendermint-liquidity-js'),
          path.resolve(__dirname, 'node_modules/@clockwork-projects/osmosis-labs-osmosis-js/osmosis-labs/osmosis/osmosis.gamm.v1beta1/index.js@clockwork-projects/tendermint-liquidity-js'),
          path.resolve(__dirname, 'node_modules/@clockwork-projects/osmosis-labs-osmosis-js/osmosis-labs/osmosis/osmosis.gamm.v1beta1/index.js@clockwork-projects/cosmos-gaia-js'),
          path.resolve(__dirname, 'node_modules/@clockwork-projects/osmosis-labs-osmosis-js/osmosis-labs/osmosis/osmosis.gamm.v1beta1/index.js@clockwork-projects/osmosis-labs-osmosis-js'),
          path.resolve(__dirname, 'node_modules/@clockwork-projects/osmosis-labs-osmosis-js/osmosis-labs/osmosis/osmosis.gamm.v1beta1/index.js@emeris/signer'),
          path.resolve(__dirname, 'node_modules/@clockwork-projects/osmosis-labs-osmosis-js/osmosis-labs/osmosis/osmosis.gamm.v1beta1/index.js@emeris/mapper'),
        ],
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
    ],
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              happyPackMode: true,
            },
          },
        ],
      },
    ],
  },
};
