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

## Configuration

The configuration file must exports `tasks` object. `tasks` is the place where all gulp tasks will be registered and optionally configured. In most cases, gulp task should run some usefull function. Such function can be exported from separate module under `tasks` directory. Module name must be the same as task name.

Each of tasks may run child tasks. This was implement in order to have the ability to build multiple icon packs or multiple CSS bundles for example. 

To create such a task simply define the task as an array of `options`. In that case, each `options` must contain one of `id` > `name` > `bundleName` field in order to properly set name for child task.

For example, if you need to build multiple CSS bundles, then you have to define task `styles` as:
```js
{
  styles: [ {bundleName: 'first', /*...*/},  { bundleName: 'second', /*...*/}]
}
```
Now for build one of the bundles separately you able to run separate task: `styles:first` or `styles:second`. And task `styles` will run them both.

Each task also may contain such fields:
- `src: string|string[]`
  Input path. Usually will be passed to `gulp.src()`;
- `dest: string`
  Output path. Usually will be passed to `gulp.dest()`;
- `watch: boolean|string|string[]`
  You can simply set this to `true`, and in this case, `src` will be used as a path to watch for file changes, or you can set custom path to watch (it will be provided to the `gulp.watch()`).
- `deps: string[]`
  An array of tasks to be executed and completed before your task will run. Will be passed to [`run-sequence`](https://www.npmjs.com/package/run-sequence).

### Built in tasks:

- ### `templates`

  ##### `onlyChanged?: boolean`
  Default `false`. 
  
  Render only changed templates.

  ##### `pathToEnvModule?: string`
  Default `null`. 
  
  Path to `manageEnv` module. More [here](https://www.npmjs.com/package/gulp-nunjucks-render#environment).

  ##### `pathToLocales?: string`
  Default `null`.

  Path to directory with locales for templates. All `.yml`, `.yaml` or `.json` files from here will be read, parsed, merged and passed into template via `nunjucksOptions.data`.

  ##### `nunjucksOptions?: Object`
  Default `{path: [/* src paths */], data: {/* localeData */}, envOptions: {watch: false, trimBlocks: true, lstripBlocks: true, autoescape: false}}`.

  Options for [gulp-nunjucks-render](https://www.npmjs.com/package/gulp-nunjucks-render#options).

  ##### `prettifyOptions?: Object`
  Default `{indent_size: 2, wrap_attributes: 'auto', preserve_newlines: true, end_with_newline: true,}`.

  Options for [gulp-prettify](https://www.npmjs.com/package/js-beautify#css--html) (HTML sections)

  ##### `changedOptions?: Object`
  Default `{ extension: '.html' }`.

  Options for [gulp-changed](https://www.npmjs.com/package/gulp-changed#options).


- ### `styles`

  ##### `bundleName: string`
  Default `name`.

  ##### `sourceMap?: boolean`
  Default `true`.

  ##### `sassOptions?: Object`
  Default
  `{ precision: 5, outputStyle: process.env.NODE_ENV === 'production' ? 'compressed' : 'expanded', includePaths: ['node_modules'] }`

  ##### `autoprefixerOptions?: Object`
  Default `{ browsers: ['> 1%'], cascade: false }`.


- ### `webpack`

  ##### `webpackWatch?: boolean`
  
  When `true` webpack will start in watch mode.

  ##### `webpackConfigFile?: string`

  Path to webpack configuration file. Specify your own [configuration](https://webpack.js.org/configuration/#options) file.
  Default configuration are defined inside `tasks/webpack.js` file.


  The simplest way to register `webpack` task is adding a field `webpack: {}` in tasks config. And with additional `watch` task: `webpack: { watch: 'path/to/scripts' }`. In this case, gulp watcher will run webpack whenever files changes.
  
  But the more efficient way is to let webpack watch for file changes by himself. To do that, split `webpack` task into two child tasks:
  ```js
  webpack: [{ name: 'run' }, { name: 'watch', webpackWatch: true }]
  ```
  Now you have `webpack:run` for the regular build and `webpack:watch` for watch mode:


- ### `icons`

  ##### `bundleName?: string`
  Default `icons`. 
  
  Name of icon bundle. Also used as the filename for generated images, styles and preview files.

  ##### `src: string|string[]`
  Path to *.svg files. Will be passed to the `gulp.src()`.

  ##### `dest: string`
  Path to where to store generated sprite. Will be passed to the `gulp.dest()`.

  ##### `stylesDest: string`
  Path to where to store generated styles. Will be passed to the `gulp.dest()`.

  ##### `previewDest?: string`
  Path to where to store generated html preview. Will be passed to the `gulp.dest()`.

  ##### `watch?: boolean|string|string[]`
  Default `false`. 
  
  You can simply set this to `true`, and in this case, `src` will be used as a path to watch for file changes, or you can set custom path to watch (it will be provided to the `gulp.watch()`).

  ##### `className: string`
  Default `icon`. 
  
  Base css class name. Also used as a prefix for each icon in the bundle.

  ##### `secondaryColor?: string`
  Default `''`. 
  
  CSS color. Can be any color. During build process this color will be raplaced by 'currentColor'. This little trick gives us ability to use dual color icons. Later in css main color of icon can be set with 'fill' property, and secondary color with 'color' property.

  ##### `ignoreCleanupFor?: string|string[]|RegExp|(symbol: Cheerio) => boolean`
  Exclude some icons from cleanup process. During build process from each icon will be removed `fill`, `stroke` and `opacity` attributes. This is necessary in order to gain control over these properties from CSS. Ignored icons will be included in sprite as is.

  ##### `ratioPrecision?: number`
  Default `2`. 
  
  Precision for icon size ratio.

  ##### `stylesTemplate: string`
  Path to styles template (relative to task js file).

  ##### `previewTemplate: string`
  Path to preview page template (relative to task js file).

  ##### `IconPack.preview?: boolean`
  Default `true`. 
  
  Toggle preview for icon bundle.


- ### `server`

  Default `{port: 3000, notify: false, ghostMode: false, open: false}`.

  Options for [browser-sync](https://browsersync.io/docs/options).
