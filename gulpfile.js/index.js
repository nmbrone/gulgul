const { tasks } = require('./config');
const gutil = require('gulp-util');
const createTasks = require('./utils/create-tasks');

const withoutModule = [];

Object.keys(tasks).forEach(name => {
  const options = tasks[name];
  const module = `./tasks/${name}`;
  try {
    var fn = require(module);
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND' && err.message.includes(module)) {
      withoutModule.push(name);
    } else {
      console.error(err);
    }
  }
  createTasks(name, options, fn);
});

gutil.log(
  `No modules for tasks: ${withoutModule
    .map(name => gutil.colors.cyan(name))
    .join(', ')}`
);
