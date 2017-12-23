const gulp = require('gulp');
const rev = require('gulp-rev');
const filter = require('gulp-filter');
const revdel = require('gulp-rev-delete-original');
const revReplace = require('gulp-rev-replace');
const merge = require('lodash/merge');
const path = require('path');
const errorHandler = require('../lib/error-handler');

const defaults = {
  manifestFilename: 'asset-manifest.json',
  revReplaceOptions: {
    modifyUnreved: modify,
    modifyReved: modify,
  },
};

module.exports = function revision(options) {
  options = merge({}, defaults, options);
  const htmlFilter = filter(['**/*', '!**/*.html'], {restore: true});
  return gulp
    .src(options.src)
    .pipe(errorHandler())
    .pipe(htmlFilter)
    .pipe(rev())
    .pipe(revdel(options.revDeleteOptions))
    .pipe(htmlFilter.restore)
    .pipe(revReplace(options.revReplaceOptions))
    .pipe(gulp.dest(options.dest))
    .pipe(rev.manifest(options.manifestFilename, options.revOptions))
    .pipe(gulp.dest(options.dest));
};

// fix sourcemaps annotations
function modify(filename) {
  if (filename.endsWith('.map')) {
    return path.basename(filename);
  }
  return filename;
}
