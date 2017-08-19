const gulp = require('gulp');

const validateOptions = options => {
  if (!options.name) {
    throw new Error('Options must contain "name" property');
  }
  if (
    'watch' in options &&
    !(Array.isArray(options.watch) || typeof options.watch === 'string') &&
    !(Array.isArray(options.src) || typeof options.src === 'string')
  ) {
    throw new Error('Options must contain "src" property');
  }
};

/**
 * Creates a separate gulp task (prefixed by [baseName])
 * for each options in a collection. Also, creates a one
 * parent task ([baseName]) to run them all at once.
 * @param {string} baseName - Used as name for parent task,
 * and as prefix for child tasks.
 * @param {(Array|Object)} collection
 * @param {Function} fn - Will be invoked for each item in a collection.
 */
module.exports = function createTasks(baseName, collection, fn) {
  if (!Array.isArray(collection)) {
    collection = Object.keys(collection).map(k =>
      Object.assign({}, { name: k }, collection[k])
    );
  }

  const tasks = [];
  const watchTasks = [];

  collection.forEach(options => {
    validateOptions(options);

    const task = `${baseName}:${options.name}`;
    tasks.push(task);
    gulp.task(task, () => fn(options));

    if (!options.watch) return;
    const watchTask = `${task}:watch`;
    watchTasks.push(watchTask);
    const pathToWatch =
      Array.isArray(options.watch) || typeof options.watch === 'string'
        ? options.watch
        : options.src;
    console.log(pathToWatch);
    gulp.task(watchTask, () => gulp.watch(pathToWatch, [task]));
  });

  gulp.task(baseName, tasks);

  if (watchTasks.length) {
    gulp.task(`${baseName}:watch`, watchTasks);
  }
};
