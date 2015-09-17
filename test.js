
var deploy = require('./');

var gulp = require('gulp');

gulp.src('./test/1.html')
  .pipe(deploy({host:'index'}))
  .pipe(gulp.dest('./test/dist'));
