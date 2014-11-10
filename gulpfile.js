var gulp = require('gulp');
var gulpif = require('gulp-if');
var source = require('vinyl-source-stream');
var less = require('gulp-less');
var merge = require('merge-stream');
var connect = require('gulp-connect');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var minifyCSS = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var _ = require('underscore');

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
// (and continue to do so on updates)
// see https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md
function js (watch) {
  var browserify = require('browserify');
  var shim = require('browserify-shim');
  var watchify = require('watchify');

  var browserify_args = _.extend(watchify.args, {debug: debug});
  var bundler = browserify('./src/js/index.js', browserify_args);

  // use shims defined in package.json via 'browser' and 'browserify-shim'
  // properties
  bundler.transform(shim);

  // register watchify
  if (watch) {
    bundler = watchify(bundler);
  }

  function rebundle () {
    return bundler.bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify error'))
      .pipe(source('index.js'))
      .pipe(debug ? gutil.noop() : streamify(uglify()))
      .pipe(gulp.dest('build'));
  }
  bundler.on('update', rebundle);

  return rebundle();
}

// bundle once
gulp.task('js', ['templates'], function () {
  return js(false);
});

// bundle with watch
gulp.task('js:watch', ['templates'], function () {
  return js(true);
});

// bundle html templates via angular's templateCache
gulp.task('templates', function () {
  var templateCache = require('gulp-angular-templatecache');

  return gulp.src(paths.templates, {base: 'src'})
    .pipe(debug ? gutil.noop() : minifyHTML())
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
  var html = gulp.src(paths.html, {base: 'src'})
    .pipe(debug ? gutil.noop() : minifyHTML())
    .pipe(gulp.dest('build'));
  var images = gulp.src(paths.images, {base: 'src'})
    .pipe(gulp.dest('build'));
  var bootstrap = gulp.src('bower_components/bootstrap/fonts/*')
    .pipe(gulp.dest('build/assets/bootstrap/fonts'));
  var fontawesome = gulp.src('bower_components/fontawesome/fonts/*')
    .pipe(gulp.dest('build/assets/fontawesome/fonts'));
  return merge(html, images, bootstrap, fontawesome);
});

// compile less to css
gulp.task('style', function () {
  return gulp.src('src/less/index.less')
    .pipe(debug ? sourcemaps.init() : gutil.noop())
    .pipe(less())
    .pipe(debug ? sourcemaps.write() : gutil.noop())
    .pipe(debug ? gutil.noop() : minifyCSS())
    .pipe(gulp.dest('build'));
});

gulp.task('clean', function(cb) {
  var del = require('del');

  del(['build/*', 'tmp/*'], cb);
});

// watch for changes
gulp.task('watch', ['default:watch'], function () {
  gulp.watch(paths.templates, ['templates']);
  gulp.watch([paths.images, paths.html], ['static']);
  gulp.watch(paths.less, ['style']);
});

// serve with livereload
gulp.task('serve', ['serve:connect', 'watch', 'serve:watch']);

// serve built files
gulp.task('serve:connect', ['default:watch'], function () {
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
gulp.task('serve:watch', ['default:watch'], function () {
  gulp.watch(paths.build, ['serve:reload']);
});


gulp.task('default', ['js', 'templates', 'static', 'style']);
gulp.task('default:watch', ['js:watch', 'templates', 'static', 'style']);
