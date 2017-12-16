const gulp = require('gulp');
const svgmin = require('gulp-svgmin');
const svgStore = require('gulp-svgstore');
const rename = require('gulp-rename');
const cheerio = require('gulp-cheerio');
const consolidate = require('gulp-consolidate');
const round = require('lodash/round');
const merge = require('lodash/merge');
const path = require('path');
const errorHandler = require('../../lib/error-handler');

const defaults = {
  bundleName: 'icons',
  className: 'icon',
  secondaryColor: '',
  ignoreCleanupFor: null,
  ratioPrecision: 2,
  stylesTemplate: 'template.sass',
  previewTemplate: 'preview.html',
  stylesDest: '',
  previewDest: '',
  preview: true,
  svgMinOptions: {
    js2svg: {pretty: true},
    plugins: [{removeDesc: true}, {cleanupIDs: true}, {mergePaths: false}],
  },
  svgStoreOptions: {inlineSvg: false},
};

/**
 * @param {Cheerio} $
 * @param {Cheerio} symbol
 * @returns {{name: string, ratio: number, fill: string}}
 */
const getSymbolData = ($, symbol, options) => {
  const viewBox = symbol.attr('viewBox');
  const size = viewBox
    ? viewBox.split(' ').splice(2)
    : [symbol.attr('width') || 1, symbol.attr('height') || 1];

  return {
    name: symbol.attr('id'),
    ratio: round(size[0] / size[1], options.ratioPrecision),
  };
};

/**
 * @param {Cheerio} $
 * @param {Cheerio} symbol
 * @param {{}} options
 */
const cleanSymbolAttributes = ($, symbol, options) => {
  const {secondaryColor, ignoreCleanupFor} = options;
  const name = symbol.attr('id').replace(options.className + '-', '');

  if (ignoreCleanupFor) {
    if (ignoreCleanupFor instanceof RegExp && name.match(ignoreCleanupFor)) {
      return;
    }

    if (typeof ignoreCleanupFor === 'function' && ignoreCleanupFor(symbol)) {
      return;
    }

    if ([].concat(ignoreCleanupFor).includes(name)) {
      return;
    }
  }

  symbol
    .find('*')
    .map((i, el) => {
      const $el = $(el);
      const fill = $el.attr('fill') || '';
      if (
        secondaryColor &&
        secondaryColor.toLowerCase() === fill.toLowerCase()
      ) {
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
 * @param {Object} options - Icon pack options.
 * @param {Function} done - Callback.
 */
const processIconPack = ($, options, done) => {
  const symbols = $('svg > symbol');
  const symbolsData = [];

  symbols.each((i, symbol) => {
    const $symbol = $(symbol);
    symbolsData.push(getSymbolData($, $symbol, options));
    cleanSymbolAttributes($, $symbol, options);
  });

  const templateData = Object.assign({}, options, {
    icons: symbolsData,
    spritePath: path.relative(options.previewDest, options.dest),
    spriteName: options.bundleName,
  });

  if (options.stylesDest) {
    gulp
      .src(path.resolve(__dirname, options.stylesTemplate))
      .pipe(errorHandler())
      .pipe(consolidate('lodash', templateData))
      .pipe(rename({basename: options.bundleName, prefix: '_'}))
      .pipe(gulp.dest(options.stylesDest))
      .on('end', done);
  } else {
    done();
  }

  if (options.preview && options.previewDest) {
    gulp
      .src(path.resolve(__dirname, options.previewTemplate))
      .pipe(errorHandler())
      .pipe(consolidate('lodash', templateData))
      .pipe(rename({basename: options.bundleName}))
      .pipe(gulp.dest(options.previewDest));
  }
};

/**
 * @param {Object} options
 * @param {string} options.bundleName - Name of icon pack.
 * @param {string} options.src - Path to SVG icons.
 * @param {string} options.className - CSS class name.
 * @param {string} options.secondaryColor - By default, we remove all 'fill'
 *    attributes from SVG to be able to set the color of icon via CSS,
 *    but if 'fill' is set to this value, we replace it with 'fill=currentColor'.
 *    This trick gives us the ability to have 'dual color' icons.
 */
module.exports = function createIconPack(options) {
  options = merge({}, defaults, options);
  return gulp
    .src(options.src)
    .pipe(errorHandler())
    .pipe(svgmin(options.svgMinOptions))
    .pipe(rename({prefix: `${options.className}-`}))
    .pipe(svgStore(options.svgStoreOptions))
    .pipe(
      cheerio({
        run: ($, file, done) => processIconPack($, options, done),
        parserOptions: {xmlMode: true},
      })
    )
    .pipe(rename({basename: options.bundleName}))
    .pipe(gulp.dest(options.dest));
};
