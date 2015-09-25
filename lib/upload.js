/**
 * @file 上传文件的模块
 */

'use strict';

var
  /**
   * @desc promise
   */
  q = require('q'),

  /**
   * @desc 判断文件相关的工具包
   */
  util = require('g-file'),

  /**
   * @desc 提示信息的工具包
   */
  debug = require('g-debug'),

  /**
   * @desc path
   */
  path = require('path'),

  /**
   * @desc 发送静态文件的包
   */
  uploadDispatch = require('g-upload-image'),

  /**
   * @desc 解析url的包
   */
  urlUtil = require('wurl');

/**
 * @desc 上传文件
 * @param file gulp流中的file对象
 * @param str 上传文件的源路径
 * @returns {*|promise}
 */
module.exports = function(file, str, opts) {
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
          var resultUrl = data[k];
          if(opts && opts.host) {
            var host = urlUtil('hostname', data[k]),
              rUrl = opts.host.prefix + Math.max((Math.random() * opts.host.max >> 0), opts.host.min) + '.' + opts.host.name;
            resultUrl = data[k].replace(host, rUrl);
          }
          str.cdn = resultUrl;
          debug.log('提示', '发送文件 ' + file.path + ' 中的静态文件：'  + str.rel + ' 成功，替换为 ' + resultUrl);
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