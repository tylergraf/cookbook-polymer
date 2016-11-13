const gulp = require('gulp');
const nodemon = require('gulp-nodemon');

gulp.task('start', function () {
  nodemon({
    exec: 'npm start'
  , ext: 'js html'
  , ignore: 'public/'
  , env: { 'NODE_ENV': 'development' }
  })
});

gulp.task('generate-service-worker', function(callback) {
  var path = require('path');
  var swPrecache = require('sw-precache');
  var rootDir = 'src';

  swPrecache.write(path.join(rootDir, 'service-worker.js'), {
    staticFileGlobs: [rootDir + '/elements/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff}'],
    stripPrefix: rootDir,
    verbose: true
  }, callback);
});

gulp.task('default', ['generate-service-worker']);

gulp.watch('public/**/*', ['generate-service-worker']);
