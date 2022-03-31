const path = require('path');
const webpack = require('webpack');
// 清理构建目录
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    library: ['react', 'react-dom']
  },
  output: {
    path: path.resolve(__dirname, 'build/library'),
    filename: '[name].dll.js',
    library: '[name]' // 打包后对外暴露的类库名称
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DllPlugin({
      name: '[name]',
      path: path.resolve(__dirname, 'build/library/[name].json') // 生成的json文件的地址
    })
  ]
};