const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const extractCss = new ExtractTextPlugin('index.css');

module.exports = {
  entry: {
    index: './app/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
    chunkFilename: 'chunk.[id].js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        // upstream files that only need to be copied
        include: [path.resolve(__dirname, 'node_modules')],
        test: /\.(eot|ttf|woff2?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader",
        query: {name: 'assets/[name].[md5:hash:hex:8].[ext]'},
      },
      {
        // upstream images
        include: [path.resolve(__dirname, 'node_modules')],
        test: /\.(jpg|png|svg)$/,
        use: [
          {
            loader: 'file-loader',
            query: {name: 'assets/[name].[md5:hash:hex:8].[ext]'},
          },
          'image-webpack-loader',
        ],
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        exclude: [path.resolve(__dirname, 'node_modules')],
        test: /\.(jpg|png|svg)$/,
        use: [
          {
            loader: 'file-loader',
            query: {name: '[path][name].[md5:hash:hex:8].[ext]'},
          },
          'image-webpack-loader',
        ],
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.less$/,
        loader: extractCss.extract({
          loader: ['css-loader?sourceMap', 'less-loader?sourceMap'],
        }),
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'babel-loader',
            query: {
              presets: ['es2015'],
              plugins: ['transform-runtime']
            }
          },
          'awesome-typescript-loader',
        ],
      },
    ],
  },
  plugins: [
    extractCss,
  ],
};
