'use strict';

const glob = require('glob');
const path = require('path');
// 提取css文件插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 压缩css资源
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
// html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin');
// clean-webpack-plugin
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// eslint-webpack-plugins
const EslintWebpackPlugin = require('eslint-webpack-plugin');

// 支持多页面打包通用方案
const setMPA = () => {
  const entry = {};
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
      }));
  });
  return {
    entry,
    htmlWebpackPlugins,
  };
};

const { entry, htmlWebpackPlugins } = setMPA();

module.exports = {
  entry: entry,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]_[chunkhash:8].js'
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader', // postcss-loader,autoPrefixer,自动补全css前缀，比如-webkit, -ms
            options: {
              plugins: [
                require('autoprefixer')({})
              ]
            }
          },
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 100,
              // remPrecision: 0, // px转成rem时，小数点位数
            }
          },
          'less-loader',
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name]_[hash:8].[ext]' // ext表示资源后缀名，示例中图片和字体应用了后缀名
          }
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name]_[hash:8].[ext]'
          }
        }
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css'
    }),
    new OptimizeCssAssetsWebpackPlugin({
      assetNameRegExp: /\.css$/g, // 正则表达式，用于匹配需要压缩的文件名
      cssProcessor: require('cssnano') // 用于压缩和优化的css预处理器，默认是cssnano
    }),
    // new HtmlWebpackPlugin({
    //   template: path.resolve(__dirname, './src/index/index.html'),
    //   filename: 'index.html',
    //   chunks: ['index'],
    // }),
    // new HtmlWebpackPlugin({
    //   template: path.resolve(__dirname, './src/search/index.html'),
    //   filename: 'search.html',
    //   chunks: ['search'],
    //   inject: true, // 是否将打包出来的js/css文件插入到html中，默认为true
    //   minify: true, // 生产环境默认为true
    // })
    new EslintWebpackPlugin()
  ].concat(htmlWebpackPlugins),
  // devtool: 'source-map',

  optimization: {
    splitChunks: {
      minSize: 0, // 设置了minSize为0，表示不会限制公共文件大小
      cacheGroups: {
        vendors: {
          test: /(react|react-dom)/,
          name: 'vendors',
          chunks: 'initial',
          priority: -10
        },
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2,
          priority: -20
        }
      }
    },
  }
};
