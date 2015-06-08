'use strict';

var gulp = require('gulp'),
  minifycss = require('gulp-minify-css'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  jshint = require('gulp-jshint'),
  jscs = require('gulp-jscs'),
  rename = require('gulp-rename'),
  notify = require('gulp-notify'),
  nodemon = require('gulp-nodemon'),
  del = require('del');

gulp.task('lint', function() {
  return gulp.src('public/js/**/*.js')
    .pipe(jscs())
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'));
});

gulp.task('scripts', function() {
  return gulp.src('public/js/**/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('public/dist/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('public/dist/js'));
    // .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('styles', function() {
  return gulp.src('public/stylesheets/*.css')
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('public/dist/stylesheets'));
    // .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('clean', function(cb) {
    del(['public/dist/js', 'public/dist/stylesheets'], cb);
});

gulp.task('start', function () {
  nodemon({
    script: 'bin/www',
    ext: 'js html',
    env: { 'NODE_ENV': 'development' },
    tasks: ['default-nodemon']
  });
});

gulp.task('default', ['clean'], function() {
  gulp.start('scripts', 'styles', 'start'); // took 'lint' out, should go before script
});

gulp.task('default-nodemon', ['clean'], function() {
  gulp.start('scripts', 'styles');
});
