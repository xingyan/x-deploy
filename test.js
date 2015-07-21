
var deploy = require('./');

var gulp = require('gulp');

gulp.src('./test/1.html')
  .pipe(deploy())
  .pipe(gulp.dest('./test/dist'));
