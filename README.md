# GulGul (WIP)

## Content
* [Configuration](#configuration)
* [Built in tasks](#built-in-tasks)
  * [templates](#templates)
  * [styles](#styles)
  * [webpack](#webpack)
  * [icons](#icons)
  * [server](#server)

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

- #### `templates`

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


- #### `styles`

  ##### `bundleName: string`
  Default `name`.

  ##### `sourceMap?: boolean`
  Default `true`.

  ##### `sassOptions?: Object`
  Default
  `{ precision: 5, outputStyle: process.env.NODE_ENV === 'production' ? 'compressed' : 'expanded', includePaths: ['node_modules'] }`

  ##### `autoprefixerOptions?: Object`
  Default `{ browsers: ['> 1%'], cascade: false }`.


- #### `webpack`

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


- #### `icons`

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


- #### `server`

  Default `{port: 3000, notify: false, ghostMode: false, open: false}`.

  Options for [browser-sync](https://browsersync.io/docs/options).
