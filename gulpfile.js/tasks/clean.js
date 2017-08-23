const del = require('del');
const gutil = require('gulp-util');

module.exports = function clean(options) {
  return del(options.src).then(paths => {
    gutil.log(
      `Deleted:\n${paths.map(p => gutil.colors.magenta(p)).join('\n')}`
    );
  });
};
