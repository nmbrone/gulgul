const runSequence = require('run-sequence');
const {addTask} = require('./lib/helpers');

const clean = require('./tasks/clean');
const copy = require('./tasks/copy');
const server = require('./tasks/server');
const styles = require('./tasks/styles');
const icons = require('./tasks/icons');
const revision = require('./tasks/revision');

// prettier-ignore
const paths = {
  src: {
    root      : 'src',
    scripts   : 'src/js',
    styles    : 'src/css',
    stylesGen : 'src/css/gen',
    templates : 'src/templates',
    locales   : 'src/templates/locales',
    static    : 'src/static',
    images    : 'src/static/img',
    fonts     : 'src/static/fonts',
    icons     : 'src/icons',
  },
  dest: {
    root      : 'build',
    assets    : 'build/assets',
    fonts     : 'build/assets/fonts',
    images    : 'build/assets/img',
    styles    : 'build/assets/css',
    scripts   : 'build/assets/js',
    previews  : 'build/assets/previews',
    html      : 'build',
  },
};

addTask('clean', clean, {
  src: [paths.dest.root, paths.src.stylesGen],
});

addTask('copy:public', copy, {
  src: 'public',
  dest: 'build',
});

addTask('revision', revision, {
  src: [paths.dest.root + '/**/*.*', '!' + paths.dest.root + '/**/*.html'],
  dest: paths.dest.root,
  manifestFileName: 'asset-manifest.json',
});

addTask('server', server, {
  server: [paths.dest.root],
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

addTask('default', cb => {
  return runSequence('clean', 'icons', 'styles', cb);
});
