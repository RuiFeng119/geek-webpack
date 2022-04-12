const { getAST, getDependencies, transform } = require('./parser');
const path = require('path');
const fs = require('fs');

module.exports = class Compiler {
  constructor(options) {
    const { entry, output } = options;
    this.entry = entry;
    this.output = output;
    this.modules = [];
  }
  run() {
    const entryModule = this.buildModule(this.entry, true);

    this.modules.push(entryModule);
    this.modules.map(module => {
      module.dependencies.map(dependency => {
        this.modules.push(this.buildModule(dependency));
      });
    });
    // console.log(this.modules);

    this.emitFiles();

  };

  // 模块构建
  buildModule(filename, isEntry) {
    let ast;
    if (isEntry) {
      ast = getAST(filename);
    } else {
      const absolutePath = path.resolve(process.cwd(), './src', filename);
      ast = getAST(absolutePath);
    }
    return {
      filename,
      dependencies: getDependencies(ast),
      source: transform(ast)
    };

  };

  // 文件生成
  emitFiles() {
    const outputPath = path.resolve(this.output.path, this.output.filename);
    console.log(outputPath);

    let modules = '';

    this.modules.map(_module => {
      modules += `'${_module.filename}': function(require, module, exports) { ${_module.source} },`;
    });
    console.log(modules, modules.filename);

    const bundle = `(function(modules) {
        function require(filename) {
          var fn = modules[filename];
          var module = {exports: {}};

          fn(require, module, module.exports);

          return module.exports;
        }
        require('${this.entry}');
      })({${modules}})`;

    // console.log(bundle);
    fs.writeFileSync(outputPath, bundle, 'utf-8');
  };
};
