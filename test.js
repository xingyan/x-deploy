
var deploy = require('./');

var gulp = require('gulp');

gulp.src('./test/1.html')
  .pipe(deploy({
    host: 'baidu.com'
  }))
  .pipe(gulp.dest('./test/dist'));
