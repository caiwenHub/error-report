const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, '../index.js'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[contenthash].bundle.js'
  },
  plugins: [
    new htmlWebpackPlugin({
      template: path.resolve(__dirname, '../test/index.html')
    })
  ],
  devtool: 'eval-source-map',
  devServer: {
    static: './dist'
  }
}