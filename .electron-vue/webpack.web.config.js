'use strict'

const path = require('path')
const webpack = require('webpack')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const { getSwcLoaderOptions } = require('./swc-env')

const isProd = process.env.NODE_ENV === 'production'

const styleLoader = isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader'

let webConfig = {
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? false : 'eval-cheap-module-source-map',
  entry: {
    web: path.join(__dirname, '../src/renderer/main.js')
  },
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
        include: [path.resolve(__dirname, '../src/renderer')],
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
          options: getSwcLoaderOptions('web')
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
    new webpack.DefinePlugin({
      'process.env.IS_WEB': 'true'
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '../dist/web')
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, '../src/renderer'),
      'vue$': 'vue/dist/vue.runtime.esm-bundler.js'
    },
    extensions: ['.js', '.vue', '.json', '.css']
  },
  target: 'web'
}

if (process.env.NODE_ENV === 'production') {
  webConfig.plugins.push(
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, '../static'),
          to: path.join(__dirname, '../dist/web/static'),
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

module.exports = webConfig
