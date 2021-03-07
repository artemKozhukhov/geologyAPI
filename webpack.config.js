const path = require('path');
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'development',
  target: 'node',
  entry: path.resolve(__dirname, 'server.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.js'
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        './node_modules/swagger-ui-dist/swagger-ui.css',
        './node_modules/swagger-ui-dist/swagger-ui-bundle.js',
        './node_modules/swagger-ui-dist/swagger-ui-standalone-preset.js',
        './node_modules/swagger-ui-dist/favicon-16x16.png',
        './node_modules/swagger-ui-dist/favicon-32x32.png'
      ]
    })
  ]
}
