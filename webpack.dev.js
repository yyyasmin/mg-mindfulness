const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');

let mode = process.env.NODE_ENV || 'development';

console.log("IN webpack.dev mode: ", mode)


module.exports = merge(common, {
  mode: mode,
  devtool: (mode === 'development') ? 'source-map' : false,

  devServer: {
    static: './dist'
  }
});