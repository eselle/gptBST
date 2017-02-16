/// <vs SolutionOpened='watch' />
var config = require('./config');
var localConfig = require('./localConfig');
var colors = require('colors');
var gulp = require('gulp');
var less = require('gulp-less');
var streamify = require('gulp-streamify');
var path = require('path');
var browserSync = require('browser-sync');
var watch = require("gulp-watch");
var minifyCss = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del = require('del');
var reload = browserSync.reload;

gulp.task('default', ['less', 'browserify', 'watch']);

gulp.task('clean:compiledStyles', function () {
    return del([
        'Areas/BridgeStreet/Assets/Local/Css/*.css',
        localConfig.websiteRoot + '/Areas/BridgeStreet/Assets/Local/Css/*css'
    ], { force: true });
});

gulp.task('clean:compiledScripts', function () {
    return del([
        'Areas/BridgeStreet/Assets/Local/Scripts/scripts.js',
        localConfig.websiteRoot + '/Areas/BridgeStreet/Assets/Local/Scripts/scripts.js'
    ], { force: true });
});

gulp.task('less', ['clean:compiledStyles'], function () {

    return gulp.src(config.less.src)
           .pipe(sourcemaps.init())
          .pipe(less())
          .pipe(minifyCss())
          .pipe(sourcemaps.write())
          .pipe(gulp.dest(config.less.dest))
          .pipe(gulp.dest(localConfig.websiteRoot + '\\Areas\\Bridgestreet\\Assets\\Local\\Css'))
          .pipe(browserSync.reload({
              stream: true
          }));
});

gulp.task('browserify', function () {
    var bundleStream = browserify(config.browserify.src).bundle();

    return bundleStream
        .pipe(source(config.browserify.outputName))
        .pipe(gulp.dest(config.browserify.dest))
        .pipe(gulp.dest(localConfig.websiteRoot + '\\Areas\\Bridgestreet\\Assets\\Local\\Scripts'));
})

gulp.task('watch', function () {
    watch(config.jsSource.src, [], function () {
        gulp.start('browserify');
    });
    gulp.watch(config.browserify.src, ['browserify']);

    //gulp.watch(config.jsSource.src, ['browserify']);
    gulp.watch(config.watch.src, ['less']);
});