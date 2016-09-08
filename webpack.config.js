var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: path.join(__dirname, 'src'),
  devtool: debug ? "inline-sourcemap" : null,
  entry: {
    vendor: [
      'react',
      'react-dom'
    ],
    'tree': './main.jsx'
  },
  module: {
    loaders: [
      {
        test: [/\.jsx?$/, /\.es6$/],
        //test: /\\.jsx?$/, loader: 'babel', exclude: ['node_modules'],
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['transform-class-properties', 'transform-decorators-legacy'],
        }
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: path.join(__dirname,  'dist'),
    filename: '[name].min.js'
  },
  plugins: debug ? [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['tree', 'tree-vendor'],
      minChunks: 2
    })] :
    [new webpack.optimize.CommonsChunkPlugin({
      name: ['tree', 'tree-vendor'],
      minChunks: 2
    }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false })
    ]
};
