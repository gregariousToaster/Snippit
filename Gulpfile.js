var gulp  = require('gulp'),
  concat  = require('gulp-concat'),
  jshint  = require('gulp-jshint'),
  nodemon = require('gulp-nodemon'),
  uglify  = require('gulp-uglify');

gulp.task('start', function () {
  nodemon({
    script: 'app.js',
    ext: 'js html',
    env: { 'NODE_ENV' : 'development' }
  });
});