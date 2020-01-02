const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.ts('resources/ts/index.ts', 'public/js/app.js');
mix.ts('resources/ts/fit.ts', 'public/js/fit.js');
mix.ts('resources/ts/service-worker.ts', 'public');
mix.sass('resources/sass/index.scss', 'public/css/app.css');
mix.version();
