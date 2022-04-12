const path = require('path');
const { getAST, getDependencies, transform } = require('./parser');

const AST = getAST(path.resolve(__dirname, '../src/index.js'));

console.log(getDependencies(AST));
console.log(transform(AST));