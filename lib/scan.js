'use strict';

var _ = require('lodash'),
  jsReg = /[ \f\t\v]*<script\s+[^>]*?src="(?!https?:)([^"]+\.js)"[^>]*?>[\s\S]*?<\/script>[ \f\t\v]*/ig,
  cssReg = /[ \f\t\v]*<link\s+[^>]*?href="(?!https?:)([^"]+\.css)"[^>]*?>[ \f\t\v]*/ig

module.exports = function(str) {
  var jsFiles = [],
    cssFile = [];
  str.replace(cssReg, function(all, value) {
      cssFile.push({
        str: _.trim(all),
        rel: _.trim(value)
      });
    })
    .replace(jsReg, function(all, value) {
      jsFiles.push({
        str: _.trim(all),
        rel: _.trim(value)
      });
    })
  return {
    js: jsFiles,
    css: cssFile
  };
}