const path = require('path');
const webpack = require('webpack');
const mergeWith = require('lodash/mergeWith');
const gutil = require('gulp-util');
const notify = require('gulp-notify');
const { paths } = require('../config');

const baseConfig = {
  context: path.resolve(paths.src.scripts),

  entry: './main.js',

  output: {
    path: path.resolve(paths.dest.scripts),
    filename: '[name].js',
    publicPath: '/js/',
  },

  resolve: {
    extensions: ['.js', '.json'],
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(paths.src.root),
        use: ['babel-loader', 'eslint-loader'],
      },
    ],
  },

  // plugins: [
  //   new webpack.optimize.CommonsChunkPlugin({
  //     name: 'vendor',
  //     chunks: ['main'],
  //     minChunks(module) {
  //       return module.context && module.context.includes('node_modules');
  //     },
  //   }),
  // ],

  stats: {
    colors: true,
    chunks: false,
    modules: false,
  },
};

const developmentConfig = {
  devtool: '#source-map',

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],

  performance: {
    hints: false,
    maxEntrypointSize: 1000000, // 1mb
    maxAssetSize: 1000000, // 1mb
  },
};

const productionConfig = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
  ],
};

function compilationHandler(err, stats) {
  const notifier = notify.onError({
    title: 'Webpack error',
    message: '<%= error.message %>',
    sound: 'Submarine',
  });
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    notifier.call(undefined, err);
    return;
  }
  const info = stats.toJson();
  if (stats.hasErrors()) {
    notifier.call(undefined, new Error(info.errors.join()));
  }
  gutil.log('[webpack]', stats.toString({ colors: true, modules: false }));
}

function merge() {
  return mergeWith(...arguments, (current, next) => {
    if (Array.isArray(current)) return current.concat(next);
  });
}

module.exports = function runWebpack(options, cb) {
  const config = merge(
    {},
    baseConfig,
    process.env.NODE_ENV === 'production' ? productionConfig : developmentConfig
  );
  if (options.webpackWatch) {
    webpack(config).watch({ ignored: /node_modules/ }, compilationHandler);
    cb();
  } else {
    webpack(config, (...args) => {
      compilationHandler(...args);
      cb();
    });
  }
};
