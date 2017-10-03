const gutil = require('gulp-util');
const { tasks } = require('./config');
const createTasks = require('./utils/create-tasks');
const withoutModule = [];

// use 'development' as default environment
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

Object.keys(tasks).forEach(name => {
  const options = tasks[name];
  const module = `./tasks/${name}`;
  try {
    var fn = require(module);
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND' && err.message.includes(module)) {
      withoutModule.push(name);
    } else {
      throw err;
    }
  }
  createTasks(name, options, fn);
});

gutil.log(
  `No modules for tasks: ${withoutModule
    .map(name => gutil.colors.cyan(name))
    .join(', ')}`
);

gutil.log(
  'Current environment:',
  gutil.colors.white.bgRed(' ' + process.env.NODE_ENV + ' ')
);
