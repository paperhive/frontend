var gulp = require('gulp');
var gulpif = require('gulp-if');
var browserify = require('gulp-browserify');
var templateCache = require('gulp-angular-templatecache');
var del = require('del');
var less = require('gulp-less');

var debug = process.env.DEBUG || false;

var paths = {
  scripts: 'src/js/**/*.js',
  templates: 'src/templates/**/*.html',
  images: 'src/img/**/*',
  html: 'src/index.html',
  less: 'src/less/index.less'
};

// bundle js files + dependencies with browserify
gulp.task('js', ['clean', 'templates'], function () {
  return gulp.src('src/js/index.js')
    .pipe(browserify({
      debug: debug,
      insertGlobals: true,
      shim: {
        angular: {
          path: 'bower_components/angular/angular.js',
          exports: 'angular',
        },
        'angular-bootstrap': {
          path: 'bower_components/angular-bootstrap/ui-bootstrap.js',
          exports: 'angular',
          depends: {angular: 'angular'}
        },
        'angular-sanitize': {
          path: 'bower_components/angular-sanitize/angular-sanitize.js',
          exports: 'angular',
          depends: {angular: 'angular'}
        },
        'MathJax': {
          path: 'bower_components/MathJax/MathJax.js',
          exports: 'MathJax'
        }
      }
    }))
    .pipe(gulp.dest('build'));
});

// bundle html templates via angular's templateCache
gulp.task('templates', ['clean'], function () {
  return gulp.src(paths.templates, {base: 'src'})
    .pipe(templateCache({
      moduleSystem: 'Browserify',
      standalone: true,
      base: function(file) {
        return file.relative;
      }
    }))
    .pipe(gulp.dest('tmp'));
});

gulp.task('static', ['clean'], function () {
  return gulp.src([paths.images, paths.html], {base: 'src'})
    .pipe(gulp.dest('build'));
});

gulp.task('style', ['clean'], function () {
  return gulp.src(paths.less)
    .pipe(less())
    .pipe(gulp.dest('build'));
});

gulp.task('clean', function(cb) {
  del(['build', 'tmp'], cb);
});

gulp.task('default', ['js', 'templates', 'static', 'style']);
