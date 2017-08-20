const { tasks } = require('./config');
const gutil = require('gulp-util');
const createTasks = require('./utils/create-tasks');

Object.keys(tasks).forEach(name => {
  const options = tasks[name];
  const module = `./tasks/${name}`;
  try {
    var fn = require(module);
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND' && err.message.includes(module)) {
      gutil.log(`No module for task: '${gutil.colors.cyan(name)}'`);
    } else {
      console.error(err);
    }
  }
  createTasks(name, options, fn);
});
