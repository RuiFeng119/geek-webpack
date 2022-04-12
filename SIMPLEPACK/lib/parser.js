// 解析AST语法树；分析依赖

const fs = require('fs');
const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const { transformFromAst } = require('babel-core');

module.exports = {
  // 将代码转换成AST，参数path指文件路径
  getAST: path => {
    const source = fs.readFileSync(path, 'utf-8');
    return babylon.parse(source, {
      sourceType: 'module'
    });
  },

  // 分析依赖
  getDependencies: ast => {
    const dependencies = [];
    traverse(ast, {
      ImportDeclaration: ({ node }) => {
        dependencies.push(node.source.value);
      }
    });
    return dependencies;
  },

  // AST生成源码
  transform: ast => {
    const { code } = transformFromAst(ast, null, {
      presets: ['env']
    });
    return code;
  }


};
