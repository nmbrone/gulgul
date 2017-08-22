const gulp = require('gulp');
const nunjucksRender = require('gulp-nunjucks-render');
const frontMatter = require('gulp-front-matter');
const gutil = require('gulp-util');
const changed = require('gulp-changed');
const prettify = require('gulp-prettify');
const merge = require('lodash/merge');
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const errorHandler = require('../utils/error-handler');

function readLocales(dir) {
  return fs.readdirSync(dir).reduce((data, file) => {
    const filePath = path.join(dir, file);
    if (fs.lstatSync(filePath).isDirectory()) {
      return merge(data, readLocales(filePath));
    }
    switch (path.extname(filePath)) {
      case '.yml':
      case '.yaml':
        return merge(data, yaml.safeLoad(fs.readFileSync(filePath, 'utf-8')));
      case '.json':
        return merge(data, JSON.parse(fs.readFileSync(filePath, 'utf-8')));
      default:
        return data;
    }
  }, {});
}

module.exports = function renderHtml(options) {
  const defaults = {
    onlyChanged: false,
    manageEnvModule: null,
    pathToLocales: null,
    nunjucksOptions: {
      path: []
        .concat(options.src)
        .map(p => path.dirname(p).replace(/[/|\\]\*\*$/, '')),
      data: {},
      envOptions: {
        watch: false,
        trimBlocks: true,
        lstripBlocks: true,
        autoescape: false,
      },
    },
    prettifyOptions: {
      indent_size: 2,
      wrap_attributes: 'auto',
      preserve_newlines: true,
      end_with_newline: true,
    },
    changedOptions: { extension: '.html' },
  };

  options = merge({}, defaults, options);

  if (!options.nunjucksOptions.manageEnv && options.manageEnvModule) {
    options.nunjucksOptions.manageEnv = require(path.resolve(
      options.manageEnvModule
    ));
  }

  merge(options.nunjucksOptions.data, readLocales(options.pathToLocales));

  return gulp
    .src(options.src)
    .pipe(errorHandler())
    .pipe(
      options.onlyChanged
        ? changed(options.dest, options.changedOptions)
        : gutil.noop()
    )
    .pipe(frontMatter({ property: 'data' }))
    .pipe(nunjucksRender(options.nunjucksOptions))
    .pipe(prettify(options.prettifyOptions))
    .pipe(gulp.dest(options.dest));
};
