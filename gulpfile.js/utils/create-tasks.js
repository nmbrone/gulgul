const gulp = require('gulp');
const runSequence = require('run-sequence');

module.exports = createTasks;

/**
 * @param {string} baseName - Used as name for parent task,
 * and as prefix for child tasks.
 * @param {(Array|Object)} collection
 * @param {Function} [fn=noop] - Will be invoked for each item in a collection.
 */
function createTasks(baseName, options, fn = noop) {
  options = [].concat(options);
  const tasks = [];
  const watchTasks = [];
  const multiple = options.length > 1;

  options.forEach(opt => {
    validateOptions(opt, multiple);
    const task = multiple
      ? `${baseName}:${opt.id || opt.name || opt.bundleName}`
      : baseName;
    tasks.push(task);
    if (opt.deps) {
      gulp.task(task, cb =>
        runSequence(...opt.deps, () => {
          fn(opt, cb);
          cb();
        })
      );
    } else {
      gulp.task(task, cb => fn(opt, cb));
    }

    if (!opt.watch) return;
    const watchTask = `${task}:watch`;
    watchTasks.push(watchTask);
    const pathToWatch =
      Array.isArray(opt.watch) || typeof opt.watch === 'string'
        ? opt.watch
        : opt.src;
    gulp.task(watchTask, () => gulp.watch(pathToWatch, [task]));
  });

  if (!multiple) return;

  gulp.task(baseName, tasks);

  if (watchTasks.length) {
    gulp.task(`${baseName}:watch`, watchTasks);
  }
}

function validateOptions(options, multiple) {
  if (multiple && !(options.id || options.name || options.bundleName)) {
    throw new Error(
      'Options must contain "id", "name" or "bundleName" property'
    );
  }
  if (
    'watch' in options &&
    !(Array.isArray(options.watch) || typeof options.watch === 'string') &&
    !(Array.isArray(options.src) || typeof options.src === 'string')
  ) {
    throw new Error('Options must contain "src" property');
  }
}

function noop() {}
