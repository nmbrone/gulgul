const gulp = require('gulp');
const errorHandler = require('../utils/error-handler');

module.exports = function copy(options) {
  return gulp
    .src(options.src)
    .pipe(errorHandler())
    .pipe(gulp.dest(options.dest));
};
