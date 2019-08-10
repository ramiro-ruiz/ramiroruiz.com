// Updated gulpfile for the following article: https://www.smashingmagazine.com/2018/07/pattern-library-first-css/

'use strict';

const gulp         = require('gulp');
const fractal      = require('./fractal.js');
const logger       = fractal.cli.console;
const sourcemaps   = require('gulp-sourcemaps');
const sass         = require('gulp-sass');
const sassGlob     = require('gulp-sass-glob');
const postcss      = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano      = require('cssnano');
const plumber      = require('gulp-plumber');
const notify       = require('gulp-notify');
const path         = require('path');

// Copiles CSS for pattern library components
function scss(done) {
    return gulp.src('assets/scss/**/*.scss')
    .pipe(customPlumber('Error running Sass'))
    .pipe(sassGlob())
    .pipe(sourcemaps.init()) // initialize sourcemaps first
    .pipe(sass()) // compile SCSS to CSS
    .pipe(postcss([ autoprefixer(), cssnano() ])) // PostCSS plugins
    .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
    .pipe(gulp.dest('public/css', '../static'));
    done();
};

// Copiles CSS in hugo folder to use in the site
function scssHugo(done) {
    return gulp.src('assets/scss/**/*.scss')
    .pipe(customPlumber('Error running Sass'))
    .pipe(sassGlob())
    .pipe(sourcemaps.init()) // initialize sourcemaps first
    .pipe(sass()) // compile SCSS to CSS
    .pipe(postcss([ autoprefixer(), cssnano() ])) // PostCSS plugins
    .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
    .pipe(gulp.dest('../static/css'));
    done();
};

// Copiles CSS for the fractal theme
function scssFractal(done) {
    return gulp.src('assets/fractal/**/*.scss')
    .pipe(customPlumber('Error running Sass'))
    .pipe(sassGlob())
    .pipe(sourcemaps.init()) // initialize sourcemaps first
    .pipe(sass()) // compile SCSS to CSS
    .pipe(postcss([ autoprefixer(), cssnano() ])) // PostCSS plugins
    .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
    .pipe(gulp.dest('public/fractal'));
    done();
};

function watch(done) {
   gulp.watch([
        'components/**/*.scss',
        'assets/scss/**/*.scss',
        'assets/fractal/**/*.scss'
      ], gulp.series(scssHugo, scss, scssFractal));
    done();
};

function customPlumber(errTitle) {
    return plumber({
        errorHandler: notify.onError({
            title: errTitle || "Error running Gulp",
            message: "Error: <%= error.message %>",
        })
    });
}

function fractal_start(done) {
    const server = fractal.web.server({
        sync: true
    });
    server.on('error', err => logger.error(err.message));
    return server.start().then(() => {
        logger.success(`Fractal server is now running at ${server.url}`);
    });
    done();
};

gulp.task('default', gulp.series(fractal_start, scss, scssHugo, scssFractal, watch));
