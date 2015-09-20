
var deploy = require('./');

var gulp = require('gulp');

gulp.src('./test/1.html')
  .pipe(deploy({
    host: {
      max: 8,
      name: 'baidu.com',
      prefix: 'i'
    }
  }))
  .pipe(gulp.dest('./test/dist'));
