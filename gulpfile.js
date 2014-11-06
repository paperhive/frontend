var gulp = require('gulp');
var gulpif = require('gulp-if');
var browserify = require('gulp-browserify');
var templateCache = require('gulp-angular-templatecache');
var del = require('del');
var less = require('gulp-less');
var merge = require('merge-stream');
var connect = require('gulp-connect');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');

var debug = process.env.DEBUG || false;

var paths = {
  js: 'src/js/**/*.js',
  templates: 'src/templates/**/*.html',
  images: 'src/img/**/*',
  html: 'src/index.html',
  less: 'src/less/**/*.less',
  build: 'build/**/*'
};

// bundle js files + dependencies with browserify
gulp.task('js', ['templates'], function () {
  return gulp.src('src/js/index.js')
    .pipe(browserify({
      debug: debug,
      shim: {
        angular: {
          path: 'bower_components/angular/angular.js',
          exports: 'angular',
        },
        'angular-bootstrap-tpls': {
          path: 'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
          exports: null,
          depends: {angular: 'angular'}
        },
        'angular-sanitize': {
          path: 'bower_components/angular-sanitize/angular-sanitize.js',
          exports: null,
          depends: {angular: 'angular'}
        },
        'MathJax': {
          path: 'bower_components/MathJax/MathJax.js',
          exports: 'MathJax'
        },
        'pdfjs': {
          path: 'bower_components/pdfjs-dist/build/pdf.combined.js',
          exports: 'PDFJS',
        },
        'highlightjs': {
          path: 'bower_components/highlightjs/highlight.pack.js',
          exports: 'hljs'
        },
      }
    }))
    .pipe(gulp.dest('build'));
});

// bundle html templates via angular's templateCache
gulp.task('templates', function () {
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

// copy static files
gulp.task('static', function () {
  var src = gulp.src([paths.images, paths.html], {base: 'src'})
    .pipe(gulp.dest('build'));
  var bootstrap = gulp.src('bower_components/bootstrap/fonts/*')
    .pipe(gulp.dest('build/assets/bootstrap/fonts'));
  var fontawesome = gulp.src('bower_components/fontawesome/fonts/*')
    .pipe(gulp.dest('build/assets/fontawesome/fonts'));
  return merge(src, bootstrap, fontawesome);
});

// compile less to css
gulp.task('style', function () {
  return gulp.src('src/less/index.less')
    .pipe(debug ? sourcemaps.init() : gutil.noop())
    .pipe(less())
    .pipe(debug ? sourcemaps.write() : gutil.noop())
    .pipe(gulp.dest('build'));
});

gulp.task('clean', function(cb) {
  del(['build/**/*', 'tmp/**/*'], cb);
});

// watch for changes
gulp.task('watch', ['default'], function () {
  gulp.watch([paths.js, paths.templates], ['js']);
  gulp.watch([paths.images, paths.html], ['static']);
  gulp.watch(paths.less, ['style']);
});

// serve with livereload
gulp.task('serve', ['serve:connect', 'watch', 'serve:watch']);

// serve built files
gulp.task('serve:connect', ['default'], function () {
  connect.server({
    root: 'build',
    livereload: true
  });
});

// live reload
gulp.task('serve:reload', function () {
  gulp.src(paths.build)
    .pipe(connect.reload());
});

// watch built files and initiate live reload
gulp.task('serve:watch', ['default'], function () {
  gulp.watch(paths.build, ['serve:reload']);
});


gulp.task('default', ['js', 'templates', 'static', 'style']);
