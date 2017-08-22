// prettier-ignore
const paths = {
  src: {
    root      : 'src',
    scripts   : 'src/js',
    styles    : 'src/css',
    stylesGen : 'src/css/gen',
    templates : 'src/templates',
    locales   : 'src/templates/locales',
    images    : 'src/img',
    fonts     : 'src/fonts',
    icons     : 'src/icons',
  },
  dest: {
    root      : 'build',
    fonts     : 'build/fonts',
    images    : 'build/img',
    styles    : 'build/css',
    scripts   : 'build/js',
    previews  : 'build/previews',
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

  copy: [
    {
      name: 'fonts',
      src: paths.src.fonts + '/**/*.{woff,woff2,eot,ttf}',
      dest: paths.dest.fonts,
    },
    {
      name: 'images',
      src: paths.src.images + '/**/*.{jpg,jpeg,png,gif,svg}',
      dest: paths.dest.images,
    },
  ],

  templates: [
    {
      name: 'changed',
      src: paths.src.templates + '/**/[^_]*.{njk}',
      dest: paths.dest.root,
      watch: true,
      onlyChanged: true,
      manageEnvModule: paths.src.templates + '/manage-env.js',
      pathToLocales: paths.src.locales,
    },
    {
      name: 'all',
      src: paths.src.templates + '/**/[^_]*.{njk,}',
      dest: paths.dest.root,
      watch: paths.src.templates + '/**/_*.{njk}',
      onlyChanged: false,
      manageEnvModule: paths.src.templates + '/manage-env.js',
      pathToLocales: paths.src.locales,
    },
  ],

  server: {
    server: [paths.dest.root, paths.src.root],
    files: [paths.dest.root],
    port: 3000,
  },

  clean: {
    src: [paths.dest.root, paths.src.stylesGen],
  },

  build: {
    deps: ['clean', 'icons', 'styles', 'copy', 'templates:all'],
  },

  default: {
    deps: ['build', 'watch', 'server'],
  },

  watch: {
    deps: ['icons:watch', 'styles:watch', 'templates:watch'],
  },
};

module.exports = {
  paths,
  tasks,
};
