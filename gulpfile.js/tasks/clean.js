const del = require('del');
const gutil = require('gulp-util');

module.exports = function clean(options) {
  return del(options.src).then(paths => {
    gutil.log('Deleted:', gutil.colors.magenta(paths.join('\n')));
  });
};
