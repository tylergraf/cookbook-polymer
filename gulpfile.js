const gulp = require('gulp');
const fb = require('./gulp-firebase-server-push');

gulp.task('generate-service-worker', function(callback) {
  var path = require('path');
  var swPrecache = require('sw-precache');
  var rootDir = 'src';

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
    return gulp.src('firebase.json')
        .pipe(fb())
        .pipe(gulp.dest('zz'));
});

gulp.task('default', ['generate-service-worker']);
gulp.task('default', ['generate-firebase']);

gulp.watch('src/**/*', ['default']);
