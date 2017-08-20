const gulp = require('gulp');
const gutil = require('gulp-util');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
const merge = require('lodash/merge');
const errorHandler = require('../utils/error-handler');

const defaults = {
  bundleName: 'main',
  src: '',
  watch: '',
  sourceMap: true,
  sassOptions: {
    precision: 5,
    outputStyle:
      process.env.NODE_ENV === 'production' ? 'compressed' : 'expanded',
    includePaths: ['node_modules'],
  },
  autoprefixerOptions: {
    browsers: ['> 1%'],
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

const compileStyles = options => {
  options = merge({}, defaults, options);

  const processors = [
    autoprefixer(options.autoprefixerOptions),
    mqpacker({ sort: sortMediaQueries }),
  ];

  return gulp
    .src(options.src)
    .pipe(errorHandler())
    .pipe(options.sourceMap ? sourcemaps.init() : gutil.noop())
    .pipe(sass(options.sassOptions))
    .pipe(postcss(processors))
    .pipe(rename({ basename: options.bundleName }))
    .pipe(options.sourceMap ? sourcemaps.write('./') : gutil.noop())
    .pipe(gulp.dest(options.dest));
};

module.exports = compileStyles;
