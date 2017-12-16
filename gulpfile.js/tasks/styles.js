const gulp = require('gulp');
const gutil = require('gulp-util');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
const merge = require('lodash/merge');
const errorHandler = require('../lib/error-handler');

const defaults = {
  sourceMap: true,
  sassOptions: {
    includePaths: ['node_modules'],
    precision: 5,
    outputStyle:
      process.env.NODE_ENV === 'production' ? 'compressed' : 'expanded',
  },
  autoprefixerOptions: {
    browsers: ['> 1%', 'last 2 versions', 'Firefox ESR'],
    flexbox: 'no-2009',
    cascade: false,
  },
};

const isMax = mq => /max-width/.test(mq);
const isMin = mq => /min-width/.test(mq);

const sortMediaQueries = (a, b) => {
  const A = a.replace(/\D/g, '');
  const B = b.replace(/\D/g, '');

  if (isMax(a) && isMax(b)) {
    return B - A;
  } else if (isMin(a) && isMin(b)) {
    return A - B;
  } else if (isMax(a) && isMin(b)) {
    return 1;
  } else if (isMin(a) && isMax(b)) {
    return -1;
  }

  return 1;
};

module.exports = function styles(options) {
  options = merge({}, defaults, options);

  const processors = [
    autoprefixer(options.autoprefixerOptions),
    mqpacker({sort: sortMediaQueries}),
  ];

  return gulp
    .src(options.src)
    .pipe(errorHandler())
    .pipe(options.sourceMap ? sourcemaps.init() : gutil.noop())
    .pipe(sass(options.sassOptions))
    .pipe(postcss(processors))
    .pipe(options.sourceMap ? sourcemaps.write('./') : gutil.noop())
    .pipe(gulp.dest(options.dest));
};
