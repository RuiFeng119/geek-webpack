const glob = require('glob');
const path = require('path');
// 提取css文件插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin');
// clean-webpack-plugin
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// webpack构建日志提示插件
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');


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
              remPrecision: 0, // px转成rem时，小数点位数
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
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css'
    }),
    new CleanWebpackPlugin(),
    new FriendlyErrorsWebpackPlugin()
  ].concat(htmlWebpackPlugins)
};