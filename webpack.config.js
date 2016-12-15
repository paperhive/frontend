const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const config = require('./config.json');

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
    alias: {
      // alias highlight.js to highlightjs
      // see https://github.com/s-panferov/awesome-typescript-loader/issues/249
      highlightjs: 'highlight.js',
    },
  },
  externals: {
    mathjax: 'MathJax',
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
        exclude: [path.resolve(__dirname, 'app/index.html')],
        loader: 'html-loader',
        query: {
          interpolate: 'require', // allow ${require(...)} in html
        },
      },
      {
        // files that only need to be copied
        exclude: [path.resolve(__dirname, 'node_modules')],
        test: /\.(ico|xml)?$/,
        loader: "file-loader",
        query: {name: '[path][name].[md5:hash:hex:8].[ext]'},
      },
      {
        // images that can be optimized
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
        // transpile ES6 dependencies with babel
        include: ['srch']
          .map(mod => path.resolve(__dirname, `./node_modules/${mod}`)),
        test: /\.js/,
        loader: 'babel-loader',
      },
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        query: {
          useBabel: true,
        },
      },
    ],
  },
  plugins: [
    extractCss,
    new CopyWebpackPlugin(
      [
        {
          from: 'node_modules/pdfjs-dist/build/pdf.worker.js',
          to: 'assets/pdfjs/',
        },
        {
          from: 'static/favicons/favicon.ico',
          to: '.',
        },
      ].concat([
        'MathJax.js',
        'config/TeX-AMS_HTML-full.js',
        'config/Safe.js',
        'extensions/Safe.js',
        'fonts/HTML-CSS/**/woff/*.woff',
        'jax/element/**',
        'jax/output/HTML-CSS/**'
      ].map(path => ({
        context: 'node_modules/mathjax',
        from: {glob: path},
        to: 'assets/mathjax',
      })))
    ),
    new HtmlWebpackPlugin({
      template: './app/index.html',
      config,
      dev: process.env.NODE_ENV !== 'production'
    }),
    new webpack.ProvidePlugin({
      'jQuery': 'jquery', // for javascript-detect-element-resize
      'window.jQuery': 'jquery', // for angular
    }),
  ],
  performance: { hints: false },
};
