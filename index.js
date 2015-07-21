"use strict";

var through = require('through2');
var gutil = require('gulp-util');
var scanhtml = require('./lib/scan');
var upload = require('./lib/upload');
var path = require('path');
var q = require('q');
var _ = require('lodash');

var PLUGIN_NAME = 'gulp-x-deploy';
var debugReg = /[ \f\t\v]*<!--\s*debug\s+start\s*-->[\s\S]*?<!--\s*debug\s+end\s*-->[ \f\t\v]*/ig;


module.exports = function index(opts) {

  return through.obj(function (file, encoding, cb) {

    if (file.isNull()) {
      return cb(null, file)
    }
    if(file.isStream()) {
      return cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
    }

    var ext = path.extname(file.path);
    if(ext != '.html') {
      return cb(new gutil.PluginError(PLUGIN_NAME, 'Not support file: ' + file.path + ' !'))
    }
    var newHtml = file.contents.toString();
    newHtml = newHtml.replace(debugReg, '');
    q.fcall(function() {
      return scanhtml(file.contents.toString(), opts)
    })
    .then(function(output) {
        return q.all(_.flattenDeep([output['js'].map(function(js) {
          return upload(file, js);
        }), output['css'].map(function(css) {
          return upload(file, css);
        })]));
      })
    .then(function(result) {
        result.forEach(function(item) {
          if(item != null) {
            newHtml = newHtml.replace(item.str, (item.str.replace(item.rel, item.cdn)));
          }
        });
        try {
          file.contents = new Buffer(newHtml);
          cb(null, file);
        } catch (err) {
          cb(new gutil.PluginError(PLUGIN_NAME, err));
        }
      }.bind(this))
    .catch(function(msg) {
        debug.error(msg);
        cb(msg);
      });
  })
}
