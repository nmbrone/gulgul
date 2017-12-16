const path = require('path');
const webpack = require('webpack');
const mergeWith = require('lodash/mergeWith');
const gutil = require('gulp-util');
const notify = require('gulp-notify');
const paths = require('../paths');

module.exports = runWebpack;

const {NODE_ENV} = process.env;

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
  plugins: [
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   chunks: ['main'],
    //   minChunks(module) {
    //     return module.context && module.context.includes('node_modules');
    //   },
    // }),
    new webpack.EnvironmentPlugin({NODE_ENV: 'development'}),
  ],
  devtool: 'source-map',
  stats: {
    colors: true,
    chunks: false,
    modules: false,
  },
};

const developmentConfig = {
  performance: {
    hints: false,
    maxEntrypointSize: 1000000, // 1mb
    maxAssetSize: 1000000, // 1mb
  },
};

const productionConfig = {
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false,
      },
    }),
  ],
};

function runWebpack(options, cb) {
  let config;
  if (options.webpackConfigFile) {
    config = require(path.resolve(options.webpackConfigFile));
    if (typeof config === 'function') config = config();
  } else {
    config = customMerge(
      {},
      baseConfig,
      NODE_ENV === 'production' ? productionConfig : developmentConfig
    );
  }
  if (options.webpackWatch) {
    webpack(config).watch({ignored: /node_modules/}, compilationHandler);
    cb();
  } else {
    webpack(config, (...args) => {
      compilationHandler(...args);
      cb();
    });
  }
}

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
  gutil.log('[webpack]', stats.toString({colors: true, modules: false}));
}

function customMerge(...args) {
  return mergeWith(...args, (current, next) => {
    if (Array.isArray(current)) return current.concat(next);
  });
}
