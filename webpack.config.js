const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { resolve } = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { DefinePlugin } = require('webpack');

const pkg = require('./package.json');

/**
 * @param {Record<string, any>} env
 * @param {Record<string, any>} args
 * @returns {Promise<import('webpack').Configuration>}
 */
module.exports = async (env, args) => {
  const mode = args.mode || 'production';
  const isProd = mode === 'production';
  const isDevServer = env.WEBPACK_SERVE || false;
  const version = pkg.version + isProd ? '' : '+dev';
  const distPath = resolve(__dirname, 'dist');

  return {
    devtool: isProd ? false : 'eval-source-map',
    entry: resolve(__dirname, 'src', 'main.ts'),
    output: {
      path: distPath,
      filename: `bundle.${isProd ? 'min' : 'dev'}.js`,
      chunkFilename: 'chunks/[id].[contenthash].js',
      assetModuleFilename: 'asset-modules/[hash][ext][query]'
    },
    optimization: isProd
      ? {
          minimizer: [
            new TerserPlugin({
              terserOptions: {}
            })
          ]
        }
      : undefined,
    resolve: {
      extensions: ['.ts', '.js']
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          loader: 'ts-loader'
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: !isProd
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: !isProd
              }
            }
          ]
        },
        {
          test: /\.(gif|png|jpe?g|svg|xml|glsl|woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource'
        }
      ]
    },
    plugins: [
      !isDevServer ? new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['**/*'] }) : undefined,
      isProd
        ? new MiniCssExtractPlugin({
            filename: `bundle.${isProd ? 'min' : 'dev'}.css`,
            chunkFilename: `chunks/[id].[contenthash].css`
          })
        : undefined,
      new DefinePlugin({
        VERSION: JSON.stringify(version)
      }),
      new HtmlWebpackPlugin({
        template: resolve(__dirname, 'src', 'index.html'),
        meta: {
          viewport: 'width=device-width, initial-scale=1.0'
        }
      }),
      !isDevServer
        ? new CopyPlugin({
            patterns: [{ from: 'src/assets', to: 'assets', globOptions: { ignore: ['.gitignore'] } }]
          })
        : undefined
    ].filter(Boolean),
    devServer: {
      client: {
        overlay: {
          warnings: false
        }
      },
      hot: false,
      host: '0.0.0.0', // Docker compatability.
      static: [resolve(__dirname, 'src')]
    }
  };
};
