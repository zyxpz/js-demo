const path = require('path');

const webpack = require('webpack');

const webpackMerge = require('webpack-merge');

const { entry } = require('../package.json');

const config = {
  entry: Object.assign({}, entry),
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '/dist').replace(/\/config/, ''),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [
          path.resolve(__dirname, 'node_modules')
        ],
        use: [
          'awesome-typescript-loader',
          'source-map-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
            },
          },
        ],
  
      },
      {
        test: /\.(png|jpg|gif|eot|ttf|woff|woff2|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
        },
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      }
    ]
  },
  optimization: {},
  plugins: []
}


const defaultConfig = {
  devtool: 'cheap-module-eval-source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  devServer: {
    host: 'localhost',
    port: '8080',
    stats: 'errors-only',
  },
  node: {
		global: true,
		crypto: 'empty',
		__dirname: true,
		__filename: true,
		Buffer: true,
		clearImmediate: false,
		setImmediate: false,
		fs: 'empty'
	},
	cache: true,
}

module.exports = {
  commonConfig: webpackMerge(
    config,
    defaultConfig
  )
}