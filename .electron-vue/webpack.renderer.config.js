'use strict'

const path = require('path')
const { dependencies } = require('../package.json')
const webpack = require('webpack')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const { getSwcLoaderOptions } = require('./swc-env')

const isProd = process.env.NODE_ENV === 'production'

/**
 * List of node_modules to include in webpack bundle
 *
 * Required for specific packages like Vue UI libraries
 * that provide pure *.vue files that need compiling
 */
const whiteListedModules = ['vue', 'pinia']

const styleLoader = isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader'

let rendererConfig = {
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? false : 'eval-cheap-module-source-map',
  entry: {
    renderer: path.join(__dirname, '../src/renderer/main.js')
  },
  externals: [
    ...Object.keys(dependencies || {}).filter(d => !whiteListedModules.includes(d))
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [styleLoader, 'css-loader']
      },
      {
        test: /\.html$/,
        use: 'vue-html-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
          options: getSwcLoaderOptions('renderer')
        }
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10000
          }
        },
        generator: {
          filename: 'imgs/[name][ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10000
          }
        },
        generator: {
          filename: 'fonts/[name][ext]'
        }
      }
    ]
  },
  optimization: {
    minimize: isProd,
    emitOnErrors: false
  },
  plugins: [
    new VueLoaderPlugin(),
    ...(isProd ? [new MiniCssExtractPlugin({ filename: 'styles.css' })] : []),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../src/index.ejs'),
      nodeModules: process.env.NODE_ENV !== 'production'
        ? path.resolve(__dirname, '../node_modules')
        : false
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  output: {
    filename: '[name].js',
    library: {
      type: 'commonjs2'
    },
    path: path.join(__dirname, '../dist/electron')
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, '../src/renderer'),
      'vue$': 'vue/dist/vue.runtime.esm-bundler.js'
    },
    extensions: ['.js', '.vue', '.json', '.css', '.node']
  },
  target: 'electron-renderer'
}

if (process.env.NODE_ENV !== 'production') {
  rendererConfig.plugins.push(
    new webpack.DefinePlugin({
      '__static': `"${path.join(__dirname, '../static')}"`
    })
  )
}

if (process.env.NODE_ENV === 'production') {
  rendererConfig.plugins.push(
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, '../static'),
          to: path.join(__dirname, '../dist/electron/static'),
          globOptions: {
            ignore: ['**/.*']
          }
        }
      ]
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })
  )
}

module.exports = rendererConfig
