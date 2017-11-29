const server = require('browser-sync').create();
const merge = require('lodash/merge');

const defaults = {
  port: 3000,
  notify: false,
  ghostMode: false,
  open: false,
};

module.exports = function runServer(options, cb) {
  server.init(merge({}, defaults, options));
  cb();
};
