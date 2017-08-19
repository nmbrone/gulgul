const gulp = require('gulp');

/**
 * Creates a separate gulp task (prefixed by [baseName])
 * for each item in a collection. Also, creates a one
 * parent task ([baseName]) to run them all at once.
 * @param {string} baseName - Used as name for parent task,
 * and as prefix for child tasks.
 * @param {(Array|Object)} collection
 * @param {Function} fn - Will be invoked for each item in a collection.
 */
module.exports = function createNamedGulpTasks(baseName, collection, fn) {
  if (!Array.isArray(collection)) {
    collection = Object.keys(collection).map(k =>
      Object.assign({}, { name: k }, collection[k])
    );
  }

  const taskNames = collection.map(item => {
    if (!item.name) {
      throw new Error('Collection item must have "name" property');
    }
    const taskName = `icons:${item.name}`;
    gulp.task(taskName, () => fn(item));
    return taskName;
  });

  gulp.task(baseName, taskNames);
};
