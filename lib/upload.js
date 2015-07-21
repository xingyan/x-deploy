'use strict';

var q = require('q');
var util = require('g-file');
var debug = require('g-debug');
var path = require('path');
var uploadDispatch = require('g-upload-image');

module.exports = function(file, str) {
  var deferred = q.defer();
  var fileUrl = util.isRelative(str.rel) ? path.resolve(path.dirname(file.path), str.rel) : str.rel;
  var result = null;
  if(util.isFile(fileUrl)) {
    uploadDispatch.upload({
      files: fileUrl
    }, function(err, data) {
      if(err) {
        debug.error('上传失败，原因是：' + err);
      }
      if(data) {
        for(var k in data) {
          str.cdn = data[k];
          debug.log('提示', '发送文件 ' + file.path + ' 中的静态文件：'  + str.rel + ' 成功，替换为 ' + data[k]);
        }
        result = str;
      }
      deferred.resolve(result);
    })
  } else {
    debug.warn('文件 ' + file.path + ' 中的静态文件：'  + str.rel + ' 不存在');
    deferred.resolve(result);
  }
  return deferred.promise;
}