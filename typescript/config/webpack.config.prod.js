const webpack = require('webpack');

const webpackMerge = require('webpack-merge');

const { commonConfig } = require('./webpack.config.common');

const config = {
  mode: 'production'
}

module.exports = webpackMerge(
  config,
  commonConfig
)