const gulp = require('gulp');
const rev = require('gulp-rev');
const merge = require('lodash/merge');
const revdel = require('gulp-rev-delete-original');
const revReplace = require('gulp-rev-replace');
const errorHandler = require('../utils/error-handler');

const defaults = {
  manifestFilename: 'asset-manifest.json',
};

module.exports = function revision(options) {
  options = merge({}, defaults, options);
  return gulp
    .src(options.src)
    .pipe(errorHandler())
    .pipe(rev())
    .pipe(revdel(options.revDeleteOptions))
    .pipe(revReplace(options.revReplaceOptions))
    .pipe(gulp.dest(options.dest))
    .pipe(rev.manifest(options.manifestFilename, options.revOptions))
    .pipe(gulp.dest(options.dest));
};
