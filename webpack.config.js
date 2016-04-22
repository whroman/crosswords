const path = require('path');
const webpack = require('webpack');
const BASE_PATH = path.join(__dirname);
const DIST_PATH = path.join(__dirname, 'public');

const prodJS = new webpack.optimize.UglifyJsPlugin({
    compress: {
        warnings: false
    },
    minimize: true,
    mangle: false
});

module.exports = {
  devtool: 'source-map',
  context: BASE_PATH,
  entry: './client/index.js',
  output: {
    path: DIST_PATH,
    publicPath: '/',
    filename: 'build.js'
  },
  plugins: [
    prodJS
  ],
  module: {
    // preLoaders: [
    //   {
    //     test: /\.js$/,
    //     loader: "eslint-loader",
    //     exclude: /node_modules/
    //   }
    // ],
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css?sourceMap', 'sass?sourceMap']
      }
    ]
  },
  sassLoader: {
    includePaths: [path.resolve(__dirname, "./node_modules/foundation-sites")]
  }
};