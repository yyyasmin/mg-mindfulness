const webpack = require('webpack');
const { merge } = require('webpack-merge');
const TerserPlugin = require("terser-webpack-plugin");
const common = require('./webpack.common.js');


module.exports = merge(common, {

  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  
  mode: 'production',
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: '[name].js.map',
      exclude: ['bundle.js']
    }),

  

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
});