const gulp = require('gulp');
const svgmin = require('gulp-svgmin');
const svgStore = require('gulp-svgstore');
const rename = require('gulp-rename');
const cheerio = require('gulp-cheerio');
const consolidate = require('gulp-consolidate');
const path = require('path');
const errorHandler = require('../../utils/error-handler');
const { isDev } = require('../../utils/env');
const { paths, tasks } = require('../../config');

/**
 *
 * @param {Object} $ - Cheerio instance.
 * @param {Object} symbol - Node
 * @returns {{name: string, ratio: number, fill: string}}
 */
const getSymbolData = ($, symbol) => {
  const viewBox = symbol.attr('viewBox');
  const size = viewBox
    ? viewBox.split(' ').splice(2)
    : [symbol.attr('width') || 1, symbol.attr('height') || 1];

  return {
    name: symbol.attr('id'),
    ratio: Math.ceil(size[0] / size[1] * 100) / 100,
  };
};

const cleanSymbolAttributes = ($, symbol, settings) => {
  const { secondaryColor } = settings;

  // if (lockedRe instanceof RegExp) {
  //   const id = symbol.attr('id');

  //   if (lockedRe.test(id)) {
  //     symbol.attr('id', id.replace(lockedRe, ''));
  //     return;
  //   }
  // }

  symbol
    .find('*')
    .map((i, el) => {
      const $el = $(el);
      const fill = $el.attr('fill') || '';
      if (fill.toLowerCase() === secondaryColor.toLowerCase()) {
        $el.attr('fill', 'currentColor');
      }
      return el;
    })
    .removeAttr('stroke')
    .removeAttr('opacity')
    .not('[fill="currentColor"]')
    .removeAttr('fill');
};

/**
 *
 * @param {Object} $ - Cheerio instance.
 * @param {Object} settings - Icon pack settings.
 * @param {Function} done - Callback.
 */
const processIconPack = ($, settings, done) => {
  const symbols = $('svg > symbol');
  const symbolsData = [];

  symbols.each((i, symbol) => {
    const $symbol = $(symbol);
    symbolsData.push(getSymbolData($, $symbol));
    cleanSymbolAttributes($, $symbol, settings);
  });

  const templateData = Object.assign({}, settings, {
    icons: symbolsData,
    spritePath: path.relative(paths.dest.previews, paths.dest.images),
    spriteName: settings.name,
  });

  gulp
    .src(path.resolve(__dirname, tasks.icons.stylesTemplate))
    .pipe(errorHandler())
    .pipe(consolidate('lodash', templateData))
    .pipe(rename({ basename: settings.name }))
    .pipe(gulp.dest(paths.src.stylesGen))
    .on('end', done);

  if (process.env.NODE_ENV === 'production') return;

  gulp
    .src(path.resolve(__dirname, tasks.icons.previewTemplate))
    .pipe(errorHandler())
    .pipe(consolidate('lodash', templateData))
    .pipe(rename({ basename: settings.name }))
    .pipe(gulp.dest(paths.dest.previews));
};

/**
 * @param {Object} settings
 * @param {string} settings.name           - Name of icon pack.
 * @param {string} settings.src            - Path to SVG icons.
 * @param {string} settings.iconClassName  - CSS class name.
 * @param {string} settings.secondaryColor - By default, we remove all 'fill' attributes
 *    from SVG to be able to set the color of icon via CSS, but if 'fill' is set to this value,
 *    we replace it with 'fill=currentColor'. This trick gives us the ability to have 'dual color' icons.
 */
const createIconPack = settings => {
  return gulp
    .src(settings.src)
    .pipe(errorHandler())
    .pipe(
      svgmin({
        js2svg: { pretty: true },
        plugins: [
          { removeDesc: true },
          { cleanupIDs: true },
          { mergePaths: false },
        ],
      })
    )
    .pipe(rename({ prefix: `${settings.iconClassName}-` }))
    .pipe(svgStore({ inlineSvg: false }))
    .pipe(
      cheerio({
        run: ($, file, done) => processIconPack($, settings, done),
        parserOptions: { xmlMode: true },
      })
    )
    .pipe(rename({ basename: settings.name }))
    .pipe(gulp.dest(paths.dest.images));
};

tasks.icons.packs.forEach(settings => {
  gulp.task('icons', () => createIconPack(settings));
});
