const path = require('path');

const fs = require('fs');

const webpack = require('webpack');

const webpackMerge = require('webpack-merge');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const {
  commonConfig
} = require('./webpack.config.common');

const {
  entry
} = require('../package.json');

let arr = [];
for (const k in entry) {
  const fileContent = returnFile({directory: entry[k]});
  if (/.html/.test(fileContent)) {
    console.log(fileContent)
    const filePath = `${k}.js`
    console.log(entry[k].split('/'))
  } else {
    arr.push(
      new HtmlWebpackPlugin({
        filename: `empty.html`,
        chunks: [],
        inject: false,
        template: path.join(__dirname, '/templates/index.html').replace(/\/config/, '')
      })
    )
  }

  
}

const config = {
  mode: 'development',
  plugins: [
    ...arr
  ]
}

function returnFile(params) {
  const {
    directory
  } = params;
  
  return fs.readFileSync(directory, {
    encoding: 'utf-8'
  })
}

module.exports = webpackMerge(
  config,
  commonConfig
)