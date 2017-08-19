const path = require('path');

// prettier-ignore
const paths = {
  src: {
    root      : 'src',
    scripts   : 'src/js',
    styles    : 'src/css',
    stylesGen : 'src/css/gen',
    templates : 'src/templates',
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
    stylesTemplate: 'template.sass',
    previewTemplate: 'preview.html',
    packs: [
      {
        name: 'icons',
        src: path.join(paths.src.icons, '**/*.svg'),
        className: 'icon',
        secondaryColor: '#9B9B9B',
        ignoreCleanupFor: /cup/,
      },
      {
        name: 'icons-brand',
        src: path.join(paths.src.icons, 'second/*.svg'),
        className: 'icon-brand',
        ratioPrecision: 5,
      },
    ],
  },
};

module.exports = {
  paths,
  tasks,
};
