<!-- #  Asset builder

**node** v6+ is required

## Tasks list:

Task name          | Description                                                      
-----------------: |:----------------------------------
`default`          | run `build:dev` and `watch` tasks
`build`            | build project for "production" environment (optimized code without sourcemaps) 
`build:dev`        | build project for "development" environment (not optimized code with sourcemaps)   
`watch`            | run all gulp file watchers                                     
`styles` 	         | compile \*.styl to \*.css with help of [postcss](https://github.com/postcss/postcss) (with [autoprefixer](https://github.com/postcss/autoprefixer) by default, but other [plugins](https://github.com/postcss/postcss#plugins) can be included as well) 
`scripts`          | concat separate .js files into one with [gulp-icnlude](https://www.npmjs.com/package/gulp-include) 
`webpack`          | compile .js sources into bundle file with [webpack](https://webpack.github.io/) and [babel](https://babeljs.io/)
`copy`             | copy common files from source into `./build` folder
`templates`        | compile [nunjucks](https://mozilla.github.io/nunjucks/) templates
`iconfonts`        | generate iconfonts from svg sources
`svgsprites`       | generate svg symbol sprites ([css-tricks](https://css-tricks.com/svg-sprites-use-better-icon-fonts/))
`sprites`           | generate png sprites with [spritesmith](https://github.com/Ensighten/spritesmith)
`imagemin`         | optimize all images (png, svg, jpeg, jpg, gif) in source folder.<br> Only new or changed (from the last run of this task) files will be touched. You can force optimization for all files with `imagemin:force` task
`server`           | run dev-server powered by [BrowserSync](https://www.browsersync.io/)
`clean`            | remove `./build` folder

## Tasks details

By default, each task (except `build`) will run in "development" environment, but you can run it in "production" with flag `--prod` (example: `gulp styles --prod`).

Tasks `iconfonts`, `svgsprites `, `sprites` can generate multiple sets. For more details look into the code, but the main idea is: we have a collection of descriptions (simple array). Each item in this collection is a simple js object that describes how a set should be named, which of source files need to be included in it, and other specific settings. For each set, we also create (automatically) a new namespaced gulp task. For example, if we have two sprite sets with names _"foo"_ and _"bar"_, then we get tasks called `sprites:foo` and `sprites:bar`. 

Almost all task also can be individually started in watch mode with suffix `:watch` (for example `sprites:watch`, or `scripts:watch`).

## SRC and DEST helpers

When projects folder structure is described in `gulpfile.js/config.js`, then we can use helpers SRC and DEST when we need to get an src or dest path. That allow us describe a structure of the project in one place, and make more structure-independent tasks. These helpers are simple functions, that returns path as string or array of strings (exactly what we need to pass to the gulp.src() or gulp.dest() functions). For more details look into the code.

Example usage:

```javascript
/* config.js */
const SRC = setupPathsGetters(joinPaths({
  scripts : 'js',
}, 'src'));

/* scripts.js */
SRC.scripts(); // => 'src/js'
SRC.scripts('**/*.js'); // => 'src/js/**/.*js'
SRC.scripts('**/*.js', '!/subfolder/**/*'); // => ['src/js/**/.*js', '!src/js/subfolder/**/*']
``` -->

# GulGul (WIP)

## [Configuration](gulpfile.js/config.js)

### Tasks

#### `icons`
##### `stylesTemplate: string`
Path to styles template (relative to task js file).

##### `previewTemplate: string`
Path to preview page template (relative to task js file).

##### `packs: IconPack[]`
A collection of icons packs options.

##### `IconPack.name: string`
Name of icon pack. Also used as a name for child task. For example, if `name = 'brand'` then for this icon pack will be available separate gulp task `icons:brand`.

##### `IconPack.src: string | string[]`
Path to *.svg files. Will be passed to the `gulp.src()`.

##### `IconPack.className: string`
Base css class name. Also used as a prefix for each icon in the pack.

##### `IconPack.secondaryColor?: string`
CSS color. Can be any color. During build process this color will be raplaced by 'currentColor'. This little trick gives us ability to use dual color icons. Later in css main color of icon can be set with 'fill' property, and secondary color with 'color' property.

##### `IconPack.ignoreCleanupFor?: string | string[] | RegExp | (symbol: Cheerio) => boolean`
Exclude some icons from cleanup process. During build process from each icon will be removed `fill`, `stroke` and `opacity` attributes. This is necessary in order to gain control over these properties from CSS. Ignored icons will be included in sprite as is.

##### `IconPack.ratioPrecision?: number`
Default `2`. Precision for icon size ratio.
