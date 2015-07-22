# gulp-x-deploy
deploy static resource

## A Simple Example
可以直接这样调用
```js
var deploy = require('gulp-x-deploy');
var gulp = require('gulp');
  
gulp.src('./test/1.html')
  .pipe(deploy())
  .pipe(gulp.dest('dist/'));