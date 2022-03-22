// 压缩css资源
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

const merge = require('webpack-merge');

const baseConfig = require('./webpack.base');

const prodConfig = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: 'ignore-loader'
      },
      {
        test: /\.less$/,
        use: 'ignore-loader'
      }
    ]
  },
  plugins: [
    new OptimizeCssAssetsWebpackPlugin({
      assetNameRegExp: /\.css$/g, // 正则表达式，用于匹配需要压缩的文件名
      cssProcessor: require('cssnano') // 用于压缩和优化的css预处理器，默认是cssnano
    }),
  ],
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
  },
};
module.exports = merge(baseConfig, prodConfig);