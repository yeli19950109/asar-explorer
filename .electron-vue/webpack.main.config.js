'use strict'

const path = require('path')
const { dependencies } = require('../package.json')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { getSwcLoaderOptions } = require('./swc-env')

const isProd = process.env.NODE_ENV === 'production'

let mainConfig = {
  mode: isProd ? 'production' : 'development',
  entry: {
    main: path.join(__dirname, '../src/main/index.js')
  },
  externals: [
    ...Object.keys(dependencies || {})
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
          options: getSwcLoaderOptions('main')
        }
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      }
    ]
  },
  node: {
    __dirname: false,
    __filename: false
  },
  optimization: {
    minimize: isProd,
    emitOnErrors: false
  },
  output: {
    filename: '[name].js',
    library: {
      type: 'commonjs2'
    },
    path: path.join(__dirname, '../dist/electron')
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, '../src/main/preload.js'),
          to: path.join(__dirname, '../dist/electron/preload.js')
        }
      ]
    })
  ],
  resolve: {
    extensions: ['.js', '.json', '.node']
  },
  target: 'electron-main'
}

/**
 * Adjust mainConfig for development settings
 */
if (process.env.NODE_ENV !== 'production') {
  mainConfig.plugins.push(
    new webpack.DefinePlugin({
      '__static': `"${path.join(__dirname, '../static')}"`
    })
  )
}

/**
 * Adjust mainConfig for production settings
 */
if (process.env.NODE_ENV === 'production') {
  mainConfig.plugins.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })
  )
}

module.exports = mainConfig
