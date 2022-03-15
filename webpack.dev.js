'use strict';


// const glob = require('glob');
const path = require('path');
const webpack = require('webpack');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

const setMPA = () => {
  const entry = {}
  const htmlWebpackPlugins = []
  const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'))

  Object.keys(entryFiles).map(index => { // Object.keys([])返回数组中的每一项的index组成的数组
    const entryFile = entryFiles[index];
    // 获取每一个模块的名称
    const match = entryFile.match(/src\/(.*)\/index\.js/);
    const pageName = match && match[1];
    // 入口文件
    entry[pageName] = entryFile;
    // plugin
    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: path.join(__dirname, `src/${pageName}/index.html`), // html模板所在的文件路径，可以根据自己指定模板来生成特定的html文件
        filename: `${pageName}.html`, // 打包出来的文件名称
        chunks: [pageName], // chunks主要用于多入口文件，有多个入口文件，就会有多个输出文件，chunks选择去使用哪些js文件    
        inject: true,
        minify: {
          html5: true,
          collapseWhitespace: true, // 去除空格
          minifyCss: true, // 压缩html中的css
          minifyJs: true, // 压缩html代码中的js

        }
      })
    )
  })
  return {
    entry,
    htmlWebpackPlugins
  }
}
// const { entry, htmlWebpackPlugins } = setMPA();

module.exports = {
  watch: true,
  entry: './src/search/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]].js'
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
    new webpack.HotModuleReplacementPlugin()
  ],
  // plugins: [
  //   new webpack.HotModuleReplacementPlugin(),
  //   new CleanWebpackPlugin(),
  // ].concat(htmlWebpackPlugins),
  devServer: {
    contentBase: './dist/',
    hot: true
  }
  // devtool: 'source-map',
}
