'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var autoprefixer = require('gulp-autoprefixer');
var stylish = require('jshint-stylish');


// Sass Task
gulp.task('sass', function() {
  return gulp.src('./scss/*.scss')
        .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream());
});


// jshint Task
gulp.task('lint', function() {
  return gulp.src('./js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});


// Serve
gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: './'
    },
    port: 3333
  });
  gulp.watch('**/*.*', browserSync.reload);
  gulp.watch('./scss/*.scss', ['sass']);
  gulp.watch('./js/**/*.js', ['lint']);
});

gulp.task('dev', ['sass', 'lint', 'serve']);