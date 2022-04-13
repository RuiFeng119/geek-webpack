const loaderUtils = require('loader-utils');
const path = require('path');
const fs = require('fs');

module.exports = function (source) {

  // 关闭缓存
  this.cacheable(false);
  const { name } = loaderUtils.getOptions(this);
  console.log('name:', name);

  // 同步loader
  const json = JSON.stringify(source)
    .replace('foo', '')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
  // this.callback(null, json);


  // 异步loader
  const callback = this.async();
  fs.readFile(path.resolve(__dirname, './async.txt'), 'utf-8', (err, data) => {
    err ? callback(err, 'error') : callback(null, data);
  });
};
