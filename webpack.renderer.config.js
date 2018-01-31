'use strict'
process.env.BABEL_ENV = 'renderer'
const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

let rendererConfig = {
  devtool: '#eval-source-map',
  devServer: {hotOnly: true, port: 9003, historyApiFallback: true},
  entry: {
    app: path.join(__dirname, 'app/render/index.ts'),
    vendor: ['vue', 'vuex', 'Vue-router']
  },
  // externals: Object.keys(pkg.dependencies || {}),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader?minimize'
        })
      },
      {
        test: /\.html$/,
        use: 'html-loader'
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      // {
      //   test: /\.tsx?$/,
      //   loader: 'ts-loader',
      //   exclude: /node_modules/
      // },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            css: ExtractTextPlugin.extract({
              use: 'css-loader',
              fallback: 'Vue-style-loader' // <- this is a dep of Vue-loader, so no need to explicitly install if using npm3
            })
          }
        }
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'imgs/[name].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[ext]'
        }
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name].[hash:8].css'),
    new HtmlWebpackPlugin({
      favicon: './app/img/logo.ico',
      filename: 'index.html',
      template: './app/index.html'
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.js'
    }),
    // new CopyWebpackPlugin([
    //   {context: 'app', from: 'data/**/*'}
    // ]),
  ],
  output: {
    filename: '[name].[hash:8].js',
    // libraryTarget: 'commonjs2',
    path: path.join(__dirname, './dist/app'),
  },
  resolve: {
    // alias: {
    //   'app': path.join(__dirname, 'app/'),
    //   Vue: 'Vue/dist/Vue.js',
    // },
    extensions: ['.js', '.ts', '.vue', '.json', '.css', '.node'],
    modules: [
      path.join(__dirname, 'node_modules')
    ]
  },
  target: 'electron-renderer'
}

if (process.env.NODE_ENV !== 'production') {
  /**
   * Apply ESLint
   */
  // if (settings.eslint) {
  //   rendererConfig.module.rules.push(
  //     {
  //       test: /\.(js)$/,
  //       enforce: 'pre',
  //       exclude: /node_modules/,
  //       use: {
  //         loader: 'eslint-loader',
  //         options: {
  //           formatter: require('eslint-friendly-formatter')
  //         }
  //       }
  //     }
  //   )
  // }
  rendererConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
}

/**
 * Adjust rendererConfig for production settings
 */
if (process.env.NODE_ENV === 'production') {
  rendererConfig.devtool = ''
  rendererConfig.plugins.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new UglifyJsPlugin({
      beautify: false,
      comments: false, // 删除所有的注释
      compress: {
        warnings: false,
        drop_console: true,  // 删除所有的 `console` 语句
        collapse_vars: true,  // 内嵌定义了但是只用到一次的变量
        reduce_vars: true,     // 提取出出现多次但是没有定义成变量去引用的静态值
      },
      minimize: true,
      sourceMap: false
    })
  )
}

module.exports = rendererConfig
