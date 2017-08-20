const server = require('browser-sync').create();
const merge = require('lodash/merge');

/**
 * Run local dev server with livereload.
 * Run with --no-open to prevent opening browser
 * Run with --port 8888 to change port to 8888
 * Run with --tunnel 'mysite' to share over www.mysite.localtunnel.me
 */

const defaults = {
  port: 3000,
  notify: false,
  ghostMode: false,
  open: false,
};

module.exports = function runServer(options) {
  server.init(merge({}, defaults, options));
};
