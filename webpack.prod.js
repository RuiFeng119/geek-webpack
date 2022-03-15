'use strict';

const glob = require('glob');
const path = require('path');
// 提取css文件插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 压缩css资源
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
// html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');


module.exports = {
  entry: {
    search: './src/search/index.js'
  },
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
          'less-loader',
          {
            loader: 'postcss-loader', // postcss-loader,autoPrefixer,自动补全css前缀，比如-webkit, -ms
            options: {
              plugins: () => [
                require('autoprefixer')({
                  // browsers: ['last 2 version', '>1%', 'ios 7'] // 最近2个版本，使用人数大于1% ,ios 7以上
                  overrideBrowserslist: ['last 2 version', '>1%', 'ios 7']
                })
              ]
            }
          },
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75,
              remPrecision: 8, // px转成rem时，小数点位数
            }
          }
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
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css'
    }),
    new OptimizeCssAssetsWebpackPlugin({
      assetNameRegExp: /\.css$/g, // 正则表达式，用于匹配需要压缩的文件名
      cssProcessor: require('cssnano') // 用于压缩和优化的css预处理器，默认是cssnano
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/search/index.html'),
      filename: 'search.html',
      chunks: ['search'],
      inject: true, // 是否将打包出来的js/css文件插入到html中，默认为true
      minify: true, // 生产环境默认为true
    })
  ]
  // plugins: [
  //   new MiniCssExtractPlugin({
  //     filename: '[name]_[contenthash:8].css'
  //   }),
  //   new OptimizeCssAssetsWebpackPlugin({
  //     assetNameRegExp: /\.css$/g, // 正则表达式，用于匹配需要压缩的文件名
  //     cssProcessor: require('cssnano') // 用于压缩和优化的css预处理器，默认是cssnano
  //   }),
  //   new CleanWebpackPlugin(),
  //   new HtmlWebpackExternalsPlugin({
  //     externals: [
  //       {
  //         module: 'react',
  //         entry: 'https://11.url.cn/now/lib/16.2.0/react.min.js',
  //         global: 'React',
  //       },
  //       {
  //         module: 'react-dom',
  //         entry: 'https://11.url.cn/now/lib/16.2.0/react-dom.min.js',
  //         global: 'ReactDOM'
  //       }
  //     ]
  //   })
  // ].concat(htmlWebpackPlugins),
  // 第三方库，比如react，react-dom分离
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       commons: {
  //         chunks: 'all',
  //         test: /(react|react-dom)/,
  //         name: 'vendor',
  //       }
  //     }
  //   }
  // },
  // chunks参数说明：
  // async: 异步引入的库进行分离(默认值)；
  // initial: 同步引入的库进行分离；
  // all: 所有引入的库进行分离(推荐)；

  // 分离页面公共文件
  // optimization: {
  //   splitChunks: {
  //     minSize: 1000, // 设置了minSize为0，表示不会限制公共文件大小
  //     cacheGroups: {
  //       commons: {
  //         name: 'commons',
  //         chunks: 'all',
  //         minChunks: 3, // 设置了minChunks为2，表示只有公共文件引用超过2次，才会进行公共文件分离
  //       }
  //     }
  //   }
  // }
}
