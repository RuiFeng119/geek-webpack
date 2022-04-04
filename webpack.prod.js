'use strict';

const glob = require('glob');
const path = require('path');
const webpack = require('webpack');

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
// webpack构建日志提示插件
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
// 速度分析 speed-measure-webpack-plugin插件
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
// 体积分析 webpack-bundle-analyzer插件
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// 并行压缩插件
const TerserPlugin = require('terser-webpack-plugin');
// 添加js文件或css文件至htmlWebpackPlugin生成的html文件中
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
// 为模块提供中间缓存
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
// 删除未用到的css代码
const PurgeCSSPlugin = require('purgecss-webpack-plugin');

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

const smp = new SpeedMeasureWebpackPlugin();

const { entry, htmlWebpackPlugins } = setMPA();

const PATHS = {
  src: path.join(__dirname, 'src')
};

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
        include: path.resolve(__dirname, 'src'),
        use: 'babel-loader?cacheDirectory=true'
        // 多进程构建代码，该项目比较简单，所以使用thread-loader可能会使构建变慢
        // use: [
        //   {
        //     loader: 'thread-loader',
        //     options: {
        //       workers: 3
        //     }
        //   },
        //   'babel-loader'
        // ]
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
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8].[ext]' // ext表示资源后缀名，示例中图片和字体应用了后缀名
            }
          },
          {
            loader: 'image-webpack-loader',
          }
        ]
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
    ...htmlWebpackPlugins,
    new EslintWebpackPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    // new BundleAnalyzerPlugin()

    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, './build/library/library.json') // webpack会根据manifest文件信息，分析哪些模块不需要打包，而是直接从暴露出来的内容中获取
    }),
    new AddAssetHtmlPlugin(
      {
        filepath: path.resolve(__dirname, 'build/library/*.dll.js'),
      }
    ),
    new HardSourceWebpackPlugin(),
    new PurgeCSSPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true })
    })
  ],
  // devtool: 'source-map',

  optimization: {
    // usedExports: true,
    // splitChunks: {
    //   minSize: 0, // 设置了minSize为0，表示不会限制公共文件大小
    //   cacheGroups: {
    //     vendors: {
    //       test: /(react|react-dom)/,
    //       name: 'vendors',
    //       chunks: 'initial',
    //       priority: -10
    //     },
    //     commons: {
    //       name: 'commons',
    //       chunks: 'all',
    //       minChunks: 2,
    //       priority: -20
    //     }
    //   }
    // },
    // 多进程并行压缩代码，该项目比较简单，所以使用TerserPlugin反而会使构建变慢
    // minimizer: [
    //   new TerserPlugin({
    //     parallel: true, // 开启多进程
    //     cache: true // 启用文件缓存
    //   }),
    // ],
  },
  // stats: 'errors-only',
  resolve: {
    alias: {
      'react': path.resolve(__dirname, './node_modules/react/umd/react.production.min.js'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom/umd/react-dom.production.min.js')
    },
    extensions: ['.js'],
    mainFields: ['main']
  }
};

// 使用DllReferencePlugin和add-asset-html-webpack-plugin时，不应该使用smp.wrap({})，否则打包出来的dist中不包含library.dll.js文件，具体原因待查。
// 使用purgecss-webpack-plugin虽然未用到的css文件会会被删除，但是打包出来的dist中不包含字体文件，导致css字体不生效。
// 