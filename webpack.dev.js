'use strict';

const glob = require('glob');
const path = require('path');
const webpack = require('webpack');
// clean-webpack-plugin
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 支持多页面打包通用方案
const setMPA = () => {
  const entry = {}
  const htmlWebpackPlugins = [];
  // 获取src下所有文件
  const entryFiles = glob.sync(path.resolve(__dirname, './src/*/index.{js,ts}'));
  entryFiles.forEach(file => {
    const match = file.match(/src\/(.*)\/index.(js|ts)/);
    const pageName = match && match[1];
    entry[pageName] = file;
    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, `./src/${pageName}/index.html`),
        filename: `${pageName}.html`,
        chunks: [pageName],
        inject: true, // 是否将打包出来的js/css文件插入到html中，默认为true
        minify: true, // 生产环境默认为true
      }))
  })
  return {
    entry,
    htmlWebpackPlugins,
  }
}
const { entry, htmlWebpackPlugins } = setMPA();

module.exports = {
  entry: entry,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 102400
          }
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: 'file-loader'
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ].concat(htmlWebpackPlugins),
  devServer: {
    contentBase: './dist/',
    hot: true
  },
  devtool: 'cheap-source-map'
}
