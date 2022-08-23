const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const readDotEnv = require('./build/env');
const readExternals = require('./build/externals');
const packageJson = require('./package.json');

// 路径常量
const context = path.resolve(__dirname);
const outputPath = path.resolve(__dirname, './dist');
const srcPath = path.resolve(__dirname, './src');
const publicAssetsPath = path.resolve(__dirname, './public');

// 导出配置函数
module.exports = (startEnv, argv) => {
  const { env } = startEnv;
  const { mode } = argv;

  const isProd = mode !== 'development'; // 是否正式,用于区别打包
  const dotEnvProperties = readDotEnv(env); // 读取环境配置文件.env
  const devtool = isProd ? 'inline-cheap-module-source-map' : 'inline-cheap-module-source-map'; // sourcemap
  const styleLoader = isProd // 开发环境不抽取css文件
    ? MiniCssExtractPlugin.loader
    : {
        loader: 'style-loader',
        options: {
          esModule: true,
        },
      };
  const externals = readExternals(env); // 正式时排除打包,使用cdn链接

  return {
    mode,
    context,
    target: 'web',
    devtool,
    entry: {
      background: './src/background.js',
      options: './src/options.js',
      popup: './src/popup.js',
      contentScript: './src/contentScript.js',
    },
    output: {
      path: outputPath,
      filename: '[name].js',
      chunkFilename: 'chunk.[id].js',
      publicPath: dotEnvProperties.CONFIG_PUBLIC_PATH,
      assetModuleFilename: 'public/[name][ext]',
      crossOriginLoading: 'anonymous',
      clean: true,
      scriptType: 'text/javascript',
    },
    // cache: {
    //   type: 'filesystem',
    //   allowCollectingMemory: true,
    //   compression: 'gzip',
    // },
    module: {
      rules: [
        // vue文件处理
        {
          test: /\.vue$/,
          use: {
            loader: 'vue-loader',
            options: {},
          },
        },
        // js文件处理
        {
          test: /\.(js|msj|ts|jsx|tsx)$/,
          use: {
            loader: 'babel-loader',
            // options: {
            //   cacheDirectory: true,
            // },
          },
        },
        // css文件处理
        {
          test: /\.(css|less)$/,
          exclude: [/node_modules/],
          use: [
            styleLoader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: isProd,
                modules: {
                  mode: 'global',
                  auto: true,
                  localIdentName: '[local]_[hash:base64:8]',
                  exportLocalsConvention: 'camelCaseOnly',
                },
                importLoaders: 2,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    ['autoprefixer', {}],
                    ['postcss-import', {}],
                    [
                      'postcss-plugin-px2rem',
                      {
                        rootValue: 100,
                        exclude: /(node_modules)/i,
                        selectorBlackList: ['html', 'body', 'keep-px'],
                      },
                    ],
                  ],
                },
              },
            },
            {
              loader: 'less-loader',
              options: {
                sourceMap: isProd,
              },
            },
          ],
        },
        // 图片文件
        {
          test: /\.(png|jpg|gif|jpeg|svg|ttf|woff|woff2|otf|mp4|pdf)$/i,
          type: 'asset/resource',
          exclude: /(node_modules)/i,
        },
      ],
    },
    plugins: [
      new NodePolyfillPlugin({
        includeAliases: ['Buffer', 'crypto', 'stream', 'process', 'zlib', 'os', 'path'],
      }),
      // vue
      new VueLoaderPlugin(),
      // 对webpack注入定义变量
      new webpack.DefinePlugin({
        'process.env': JSON.stringify({
          mode,
          env,
          appEnv: dotEnvProperties,
          version: packageJson.version,
          __VUE_PROD_DEVTOOLS__: true,
        }),
      }),
      // html模板
      new HtmlWebpackPlugin({
        template: './popup.ejs',
        filename: 'popup.html',
        templateParameters: {
          mode,
          env,
          appEnv: JSON.stringify(dotEnvProperties),
        },
        minify: isProd,
        excludeChunks: ['background'],
        chunks: ['popup'],
      }),
      new HtmlWebpackPlugin({
        template: './options.ejs',
        filename: 'options.html',
        templateParameters: {
          mode,
          env,
          appEnv: JSON.stringify(dotEnvProperties),
        },
        minify: isProd,
        excludeChunks: ['background'],
        chunks: ['options'],
      }),
      // 提取css
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash:8].css',
      }),
      // 复制静态资源
      new CopyPlugin({
        patterns: [
          {
            from: 'public',
            to: 'public',
          },
          {
            from: 'manifest.json',
            to: 'manifest.json',
          },
        ],
      }),
    ],
    // 排除打包
    externals,
    // 解析相关
    resolve: {
      // 编译文件后缀
      extensions: ['.json', '.js', '.jsx', '.ts', '.tsx', '.css', '.less', '.vue'],
      // 别名
      alias: {
        '@': srcPath,
      },
    },
    // 开发环境配置
    devServer: {
      port: 1234,
      open: ['/popup.html'],
      historyApiFallback: true,
      allowedHosts: 'all',
      static: {
        directory: publicAssetsPath,
      },
    },
    // 打包优化
    optimization: {
      minimize: isProd,
      minimizer: [
        // https://github.com/webpack-contrib/terser-webpack-plugin
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            format: {
              comments: false, // 不输出注释
            },
          },
          extractComments: false, // 摘除注释
        }),
      ],
    },
  };
};
