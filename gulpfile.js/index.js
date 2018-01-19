const gulp = require('gulp');
const {addTask} = require('./lib/helpers');
const paths = require('./paths');

const clean = require('./tasks/clean');
const copy = require('./tasks/copy');
const server = require('./tasks/server');
const styles = require('./tasks/styles');
const icons = require('./tasks/icons');
const revision = require('./tasks/revision');
const webpack = require('./tasks/webpack');
const templates = require('./tasks/templates');

addTask('clean', clean, {
  src: [paths.dest.root, paths.src.stylesGen],
});

addTask('copy', copy, {
  src: paths.src.static + '/**/*',
  dest: paths.dest.root,
});

addTask('revision', revision, {
  src: paths.dest.root + '/**/*',
  dest: paths.dest.root,
  manifestFileName: 'asset-manifest.json',
});

addTask('server', server, {
  server: [paths.dest.root, paths.src.static],
  files: [paths.dest.root + '/**/*.(html|css|js)'],
});

addTask('styles', styles, {
  src: paths.src.styles + '/[^_]*.{sass,scss}',
  dest: paths.dest.styles,
  watch: paths.src.styles + '/**/*.{sass,scss}',
});

addTask('icons', icons, {
  bundleName: 'icons-sprite',
  src: paths.src.icons + '/**/*.svg',
  dest: paths.dest.images,
  watch: true,
  className: 'icon',
  secondaryColor: '#9B9B9B',
  ignoreCleanupFor: /cup/,
  stylesDest: paths.src.stylesGen,
  previewDest: paths.dest.previews,
  preview: process.env.NODE_ENV !== 'production',
});

addTask('views:all', templates, {
  src: paths.src.views + '/**/[^_]*.njk',
  dest: paths.dest.views,
  watch: paths.src.views + '/**/_*.njk',
});

addTask('views:only:changed', templates, {
  src: paths.src.views + '/**/[^_]*.njk',
  dest: paths.dest.views,
  watch: true,
  onlyChanged: true,
});

addTask('webpack', webpack, {});

addTask('webpack:watch', webpack, {
  webpackWatch: true,
});

addTask(
  'watch',
  gulp.parallel(
    'icons:watch',
    'styles:watch',
    'views:all:watch',
    'views:only:changed:watch',
    'webpack:watch'
  )
);

addTask(
  'build',
  (() => {
    const tasks = ['clean', 'icons', 'styles', 'webpack', 'views:all'];
    if (process.env.NODE_ENV === 'production') {
      tasks.push('copy', 'revision');
    }
    return gulp.series(...tasks);
  })()
);

addTask('default', gulp.series('clean', 'build', 'watch', 'server'));
