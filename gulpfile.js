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

gulp.task('default', ['start'])
