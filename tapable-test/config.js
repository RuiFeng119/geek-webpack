// 模拟插件执行
const Compiler = require('./Compiler');
const MyPlugin = require('./MyPlugin');

const compiler = new Compiler();
const myPlugin = new MyPlugin();
const options = {
  plugins: [myPlugin]
};
for (const plugin of options.plugins) {
  if (typeof plugin === 'function') {
    plugin.call(compiler, compiler);
  } else {
    plugin.apply(compiler);
  }
}
compiler.run();