
var deploy = require('./');

var gulp = require('gulp');

gulp.src('./test/1.html')
  .pipe(deploy({
    host: {
      max: 10,
      min: 5,
      name: 'yx-s.com',
      prefix: 'p'
    }
  }))
  .pipe(gulp.dest('./test/dist'));
