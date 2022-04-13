const { runLoaders } = require('loader-runner');
const path = require('path');
const fs = require('fs');

runLoaders({
  resource: path.resolve(__dirname, './src/demo.txt'),
  loaders: [
    {
      loader: path.resolve(__dirname, './src/raw-loader.js'),
      options: {
        name: 'test'
      }
    }
  ],
  context: {
    minimize: true
  },
  readSource: fs.readFile.bind()
}, function (err, result) {
  err ? console.log(err) : console.log(result);
});
