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
    stylesTemplate: 'template.sass', // retative to task file
    previewTemplate: 'preview.html', // retative to task file
    packs: [
      {
        name: 'icons',
        src: path.join(paths.src.icons, 'main/*.svg'),
        iconClassName: 'icon',
        secondaryColor: '#9B9B9B',
      },
    ],
  },
};

module.exports = {
  paths,
  tasks,
};
