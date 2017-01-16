const gulp = require('gulp');
const fb = require('./gulp-firebase-server-push');
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var del = require('del');
var replace = require('gulp-string-replace');
var run = require('gulp-run');

gulp.task('generate-service-worker', function(callback) {
  var path = require('path');
  var swPrecache = require('sw-precache');
  var rootDir = 'dist';

  swPrecache.write(path.join(rootDir, 'service-worker.js'), {
    staticFileGlobs: [
      `${rootDir}/elements/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff}`,
      `${rootDir}/images/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff}`,
      `${rootDir}/scripts/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff}`,
      `${rootDir}/index.html`,
      `${rootDir}/manifest.json`
    ],
    stripPrefix: rootDir,
    navigateFallback: `${rootDir}/index.html`,
    verbose: true
  }, callback);
});

gulp.task('generate-firebase', function () {
    return gulp.src('fb/firebase.json')
        .pipe(fb())
        .pipe(gulp.dest(''));
});

gulp.task('generate-prod-firebase', function () {
    return gulp.src('fb/firebase.json')
        .pipe(fb())
        .pipe(replace('src', 'dist'))
        .pipe(gulp.dest(''));
});

gulp.task('htmlmin', function() {
  var dollarAttribute = /\$=/;

  return gulp.src('src/**/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      removeEmptyAttributes: false,
      customAttrAssign: [ dollarAttribute ],
      minifyCSS: true,
      minifyJS: true
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('componentScripts', function() {
  return gulp.src('src/components/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/components'));
});

gulp.task('images', function() {
  return gulp.src([
    'src/images/**/*'
  ])
    .pipe(gulp.dest('dist/images'));
});

gulp.task('scripts', function() {
  return gulp.src([
    'src/scripts/**/*'
  ])
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task('elementScripts', function() {
  return gulp.src([
    'src/elements/**/*.js'
  ])
  .pipe(babel())
  .pipe(uglify())
  .pipe(gulp.dest('dist/elements'));
});

gulp.task('manifest', function() {
  return gulp.src([
    'src/manifest.json'
  ])
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function(done) {
  del.sync(['dist']);
  done();
});

gulp.task('replaceAnalytics', function(done) {
  return gulp.src('src/components/start-google-analytics-tracker/start-google-analytics-tracker.html')
    .pipe(replace("'scripts/analytics.js'", "'/scripts/analytics.js'"))
    .pipe(gulp.dest('src/components/start-google-analytics-tracker'));
});

gulp.task('default', [
  'clean',
  'replaceAnalytics',
  'generate-service-worker',
  'generate-firebase'
]);

gulp.task('prod', [
  'clean',
  'replaceAnalytics',
  'generate-service-worker',
  'generate-prod-firebase',
  'componentScripts',
  'elementScripts',
  'scripts',
  'htmlmin',
  'images',
  'manifest'
]);

gulp.task('deploy', ['prod'], function(done){
  run('firebase deploy').exec();
  done();
});

// gulp.watch('src/**/*', ['generate-service-worker']);
