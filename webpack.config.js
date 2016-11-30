const path = require('path');

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
    loaders: [
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.(jpg|png|svg)$/,
        loader: 'file-loader',
        query: {
          name: '[path][name].[md5:hash:hex:8].[ext]',
          context: './',
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
      },
    ],
  },
};
