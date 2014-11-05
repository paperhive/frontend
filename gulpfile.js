var gulp = require('gulp');
var gulpif = require('gulp-if');
var browserify = require('gulp-browserify');
var templateCache = require('gulp-angular-templatecache');
var del = require('del');

var debug = process.env.DEBUG || false;

var paths = {
  scripts: 'src/js/**/*.js',
  templates: 'src/templates/**/*.html',
  images: 'src/img/**/*',
  html: 'src/index.html'
};

// bundle js files + dependencies with browserify
gulp.task('js', ['clean'], function () {
  return gulp.src('src/js/index.js')
    .pipe(browserify({
      debug: debug
    }))
    .pipe(gulp.dest('build'));
});

// bundle html templates via angular's templateCache
gulp.task('templates', ['clean'], function () {
  return gulp.src(paths.templates, {base: 'src'})
    .pipe(templateCache({
      moduleSystem: 'Browserify',
      base: function(file) {
        return file.relative;
      }
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('static', ['clean'], function () {
  return gulp.src([paths.images, paths.html], {base: 'src'})
    .pipe(gulp.dest('build'));
});

gulp.task('clean', function(cb) {
  del(['build'], cb);
});

gulp.task('default', ['js', 'templates', 'static']);
