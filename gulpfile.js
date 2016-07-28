'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

// Serve
gulp.task('serve', function() {
  
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
  gulp.watch("**/*.*", browserSync.reload);

});

gulp.task('default', ['serve']);