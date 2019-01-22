(function() {
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const CleanWebpackPlugin = require('clean-webpack-plugin');
  const MiniCssExtractPlugin = require('mini-css-extract-plugin');

  module.exports = (env, argv) => ({
    'mode': argv.mode,
    'entry': path.resolve('src', 'app.js'),
    'output': {
      'filename': 'app.js',
      'path': path.resolve('dist')
    },
    'devServer': {
      'contentBase': path.resolve('dist'),
      'open': false
    },
    'plugins': [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
          'template': path.resolve('src', 'www', 'index.html'),
          'minify': true,
          'inject': true,
          'filename': 'index.html'
        }),
        new MiniCssExtractPlugin({
          'filename': argv.mode !== 'production' ? '[name].css' : '[name].[hash].css',
          'chunkFilename': argv.mode !== 'production' ? '[id].css' : '[id].[hash].css',
        })
    ],
    'module': {
      'rules': [
        {
          'test': /\.scss$/,
          'use': [
            argv.mode !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader'
          ]
        }
      ]
    }
  });
}());
