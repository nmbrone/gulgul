const gulp = require('gulp');

module.exports = {
  addTask,
};

/**
 * Helper for more convenient registering Gulp tasks.
 * Provides 2 additional helpful things compared to gulp.task():
 *
 * 1. addTask('styles', func, args);
 *    func will be bound with args and passed to gulp.task().
 *
 * 2. addTask('name', func, {src: 'path/to/src', watch: true});
 *    will create additional 'styles:watch' task via gulp.watch() to automatically
 *    run 'styles' task whenever files on the path args.src has changed.
 *    args.watch also can be a path to watch files.
 *
 * @param {*} args - Arguments for gulp.task().
 */
function addTask(...args) {
  if (typeof args[1] === 'function' && args.length >= 3) {
    const [name, fn, options, ...rest] = args;

    if (options.watch) {
      const glob = typeof watch === 'boolean' ? options.src : options.watch;
      gulp.task(`${name}:watch`, () => gulp.watch(glob, [name]));
    }

    return gulp.task(name, fn.bind(undefined, options, ...rest));
  }

  return gulp.task(...args);
}