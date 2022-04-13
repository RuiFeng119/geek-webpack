const loaderUtils = require('loader-utils');

module.exports = function (source) {
  console.log('loader A 执行');

  const url = loaderUtils.interpolateName(this, '[name].ext', source);
  console.log(url);
  this.emitFile(url, source);
  return source;
};
