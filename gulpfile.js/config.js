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

const tasks = {
  icons: {
    bundleName: 'icons',
    src: paths.src.icons + '/**/*.svg',
    dest: paths.dest.images,
    watch: true,
    className: 'icon',
    secondaryColor: '#9B9B9B',
    ignoreCleanupFor: /cup/,
    stylesDest: paths.src.stylesGen,
    previewDest: paths.dest.previews,
    preview: process.env.NODE_ENV !== 'production',
  },

  styles: {
    bundleName: 'main',
    src: paths.src.styles + '/main.sass',
    dest: paths.dest.styles,
    watch: paths.src.styles + '/**/*.{sass,scss}',
    sourceMap: true,
  },

  copy: {
    src: paths.src.static + '/*',
    dest: paths.dest.root,
  },

  templates: [
    {
      name: 'all',
      src: paths.src.templates + '/**/[^_]*.njk',
      dest: paths.dest.root,
      watch: [paths.src.templates + '/**/_*.njk', paths.src.locales + '**/*.*'],
      onlyChanged: false,
      pathToEnvModule: paths.src.templates + '/manage-env.js',
      pathToLocales: paths.src.locales,
    },
    {
      name: 'changed',
      src: paths.src.templates + '/**/[^_]*.njk',
      dest: paths.dest.root,
      watch: true,
      onlyChanged: true,
      pathToEnvModule: paths.src.templates + '/manage-env.js',
      pathToLocales: paths.src.locales,
    },
  ],

  webpack: [
    { name: 'run' },
    {
      name: 'watch',
      webpackWatch: true,
    },
  ],

  server: {
    server: [paths.dest.root, paths.src.root],
    files: [paths.dest.root],
    port: 3000,
  },

  revision: {
    src: [paths.dest.root + '/**/*.*', '!' + paths.dest.root + '/**/*.html'],
    dest: paths.dest.root,
    manifestFileName: 'asset-manifest.json',
  },

  clean: {
    src: [paths.dest.root, paths.src.stylesGen],
  },

  'build:dev': {
    deps: ['clean', 'icons', 'styles', 'copy', 'templates:all', 'webpack:run'],
  },

  build: {
    deps: ['build:dev', 'revision'],
  },

  default: {
    deps: ['build:dev', 'watch', 'server'],
  },

  watch: {
    deps: ['icons:watch', 'styles:watch', 'templates:watch', 'webpack:watch'],
  },
};

module.exports = {
  paths,
  tasks,
};
