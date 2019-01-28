(function() {
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const CleanWebpackPlugin = require('clean-webpack-plugin');
  const MiniCssExtractPlugin = require('mini-css-extract-plugin');


  let developmentExport = function(env, argv) {
    return {
      'mode': argv.mode,
      'entry': path.resolve('src', 'app.js'),
      'output': {
        'filename': 'app.js',
        'path': path.resolve('www')
      },
      'devServer': {
        'contentBase': path.resolve('www'),
        'open': false
      },
      'plugins': [
        new CleanWebpackPlugin(['www']),
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
    }
  };

  let libraryExport = {
    'mode': 'production',
    'entry': path.resolve('src', 'library.js'),
    'output': {
      'filename': 'awesome-image-switcher.js',
      'path': path.resolve('dist'),
      'library': 'awesome-image-switcher.js',
      'libraryTarget': 'umd',
      'umdNamedDefine': true
    },
    'plugins': [
      new CleanWebpackPlugin(['dist']),
      new MiniCssExtractPlugin({
        'filename': 'awesome-image-switcher.min.css',
        'chunkFilename': '[id].awesome-image-switcher.css',
      })
    ],
    'module': {
      'rules': [
        {
          'test': /\.scss$/,
          'use': [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader'
          ]
        }
      ]
    }
  };

  module.exports = [developmentExport, libraryExport];
}());
