"use strict";

var gulp = require('gulp'),
	  concat = require('gulp-concat'),
	  uglify = require('gulp-uglify'),
	  rename = require('gulp-rename'),
	  sass = require('gulp-sass'),
	  maps = require('gulp-sourcemaps'),
	  del = require('del'),
	  autoprefixer = require('gulp-autoprefixer'),
	  browserSync = require('browser-sync').create(),
	  htmlreplace = require('gulp-html-replace'),
	  cssmin = require('gulp-cssmin');

gulp.task("concatScripts", function() {
	return gulp.src([
		'src/assets/js/vendor/jquery-3.3.1.slim.min.js',
		'src/assets/js/vendor/popper.min.js',
		'src/assets/js/vendor/bootstrap.min.js',
		'src/assets/js/functions.js'
	])
		.pipe(maps.init())
		.pipe(concat('main.js'))
		.pipe(maps.write('./'))
		.pipe(gulp.dest('src/assets/js'))
		.pipe(browserSync.stream());
});

gulp.task("minifyScripts", ["concatScripts"], function() {
  return gulp.src("src/assets/js/main.js")
	  .pipe(uglify())
	  .pipe(rename('main.min.js'))
	  .pipe(gulp.dest('dist/assets/js'));
});

gulp.task('compileSass', function() {
  return gulp.src("src/assets/css/main.scss")
    .pipe(maps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(maps.write('./'))
    .pipe(gulp.dest('src/assets/css'))
    .pipe(browserSync.stream());
});

gulp.task("minifyCss", ["compileSass"], function() {
  return gulp.src("src/assets/css/main.css")
    .pipe(cssmin())
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('dist/assets/css'));
});

gulp.task('watchFiles', function() {
  gulp.watch('src/assets/css/**/*.scss', ['compileSass']);
  gulp.watch('src/assets/js/*.js', ['concatScripts']);
})

gulp.task('clean', function() {
  del(['dist', 'src/assets/css/main.css*', 'src/assets/js/main*.js*']);
});

gulp.task('renameSources', function() {
  return gulp.src(['src/*.html', '**/*.php', '!dist', '!dist/**'])
    .pipe(htmlreplace({
      'js': 'assets/js/main.min.js',
      'css': 'assets/css/main.min.css'
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task("build", ['minifyScripts', 'minifyCss'], function() {
  return gulp.src([
		'src/*.html',
		'src/favicon.ico',
		"src/assets/img/**"
	], { base: './src'})
		.pipe(gulp.dest('dist'));
});

gulp.task('serve', ['watchFiles'], function(){
  browserSync.init({
  	server: "./src"
  });

  gulp.watch("src/assets/css/**/*.scss", ['watchFiles']);
  gulp.watch(['src/*.html', '*.php']).on('change', browserSync.reload);
});

gulp.task("default", ["clean", 'build'], function() {
  gulp.start('renameSources');
});
