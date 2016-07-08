'use strict';

var _ = require('lodash');
var CacheBuster = require('gulp-cachebust');
var cachebust = new CacheBuster();
var del = require('del');
var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var merge = require('merge-stream');
var rename = require('gulp-rename');
var streamify = require('gulp-streamify');
var template = require('gulp-template');
var uglify = require('gulp-uglify');

// dev environment is false by default
var dev = process.env.DEV || false;
var buildDir = dev ? 'build-dev' : 'build';

var config = require('./config.json');

var paths = {
  html: 'html/**/*.html',
  staticFiles: 'static/**/*',
  index: 'index.template.html',
  less: 'src/less/**/*.less',
  build: 'build/**/*'
};

var htmlminOpts = {
  collapseWhitespace: true,
  conservativeCollapse: true,
  removeComments: true
};

var htmlhintOpts = {
  'doctype-first': false,
  'title-require': false
};

// error handling, simplified version (without level) from
// http://www.artandlogic.com/blog/2014/05/error-handling-in-gulp/
function handleError(error) {
  gutil.log(error);
  process.exit(1);
}

/* TODO: run via package.json scripts
gulp.task('htmlhint', function() {
  return gulp.src([paths.index, paths.templates], {base: 'src'})
    .pipe(htmlhint(htmlhintOpts))
    .pipe(htmlhint.reporter())
    .pipe(htmlhint.failReporter());
});
*/

// bundle html templates via angular's templateCache
// The templates reference the static files, and since they are cachebusted,
// depend on them here.
gulp.task('html', function() {
  var templateCache = require('gulp-angular-templatecache');

  return gulp.src(paths.html, {base: './'})
    .pipe(dev ? gutil.noop() : htmlmin(htmlminOpts))
    .pipe(templateCache({
      moduleSystem: 'Browserify',
      standalone: true,
      base: function(file) {
        return file.relative;
      }
    }))
    .pipe(rename('html.js'))
    //.pipe(dev ? gutil.noop() : cachebust.references())
    .pipe(gulp.dest('build-tmp'));
});

// copy static files
gulp.task('static', [], function() {
  return gulp.src(paths.staticFiles)
    .pipe(imagemin({
      interlaced: true,  // gif
      multipass: true,  // svg
      progressive: true,  // jpg
      svgoPlugins: [{removeViewBox: false}, {minifyStyles: false}]
    }))
    //.pipe(dev ? gutil.noop() : cachebust.resources())
    .pipe(gulp.dest(buildDir + '/static'));
});

// store the shasum-appended directory name globally so we can use it as a
// template parameter for indexhtml.
var mathjaxDirSha = 'assets/mathjax';

var exec = require('child_process').exec;
gulp.task('vendorCacheBust', ['vendor'], function(cb) {
  // The reason for the existence of this task is that cache busting cannot be
  // applied to MathJax, i.e., every single file therein. The problem is that
  // we don't know where in the jungle of MathJax we need to replace
  // references.
  // As a workaround, we hash the entire MathJax directory, and append the hash
  // to the directory name.
  if (dev) {
    return cb();
  }
  exec(
    // This abomination computes a sha sum of a directory.
    'find build/assets/mathjax/ -type f -print0 | sort -z |' +
    ' xargs -0 sha1sum | sha1sum | sed \'s/ *-//\' | xargs echo -n',
    function(err, stdout, stderr) {
      var sha = stdout;

      // override from parent scope
      mathjaxDirSha = 'assets/mathjax.' + sha.substring(0,8);


      del('build/' + mathjaxDirSha).then(function () {
        // rename folder
        fs.rename(
          'build/assets/mathjax/',
          'build/' + mathjaxDirSha
        );
      }
      );
      cb(err);
    });
});

// copy vendor assets files
gulp.task('vendor', [], function() {
  var bootstrap = gulp.src('bower_components/bootstrap/fonts/*')
    //.pipe(dev ? gutil.noop() : cachebust.resources())
    .pipe(gulp.dest(buildDir + '/assets/bootstrap/fonts'));

  var fontawesome = gulp.src('bower_components/fontawesome/fonts/*')
    //.pipe(dev ? gutil.noop() : cachebust.resources())
    .pipe(gulp.dest(buildDir + '/assets/fontawesome/fonts'));

  var leaflet = gulp.src('bower_components/leaflet/dist/images/*')
    //.pipe(dev ? gutil.noop() : cachebust.resources())
    .pipe(gulp.dest(buildDir + '/assets/leaflet/images'));

  var mathjaxBase = 'bower_components/MathJax/';
  var mathjaxSrc = _.map([
    'MathJax.js',
    'config/TeX-AMS_HTML-full.js',
    'config/Safe.js',
    'extensions/Safe.js',
    'fonts/HTML-CSS/**/woff/*.woff',
    'jax/element/**',
    'jax/output/HTML-CSS/**'
  ], function(path) {
    return mathjaxBase + path;
  });
  var mathjax = gulp.src(mathjaxSrc, {base: mathjaxBase})
    .pipe(gulp.dest(buildDir + '/assets/mathjax'));

  var pdfjs = gulp.src('jspm_packages/github/mozilla/pdfjs-dist@1.5.274/build/pdf.worker.js')
    .pipe(dev ? gutil.noop() : streamify(uglify({
      // disable compression, otherwise pdf rendering fails!
      // see https://github.com/mozilla/pdf.js/wiki/Frequently-Asked-Questions#minified
      compress: false,
      preserveComments: 'license'
    })))
    //.pipe(dev ? gutil.noop() : cachebust.resources())
    .pipe(gulp.dest(buildDir + '/assets/pdfjs'));

  var roboto = gulp.src('bower_components/roboto-fontface/fonts/*')
    //.pipe(dev ? gutil.noop() : cachebust.resources())
    .pipe(gulp.dest(buildDir + '/assets/roboto/fonts'));

  return merge(bootstrap, fontawesome, leaflet,
               mathjax, pdfjs, roboto);
});

// copy index.html
// Depend on 'js' and 'style' since file names here are changed by the cache
// buster and referenced in index.html.
gulp.task('index', function() {
  return gulp.src(paths.index, {base: 'src'})
    .pipe(template({
      config: config,
      dev: dev
    }))
    .pipe(dev ? gutil.noop() : htmlmin(htmlminOpts))
    .pipe(rename('index.html'))
    .pipe(gulp.dest(dev ? 'build-dev' : 'build'));
});
