// 模拟插件MyPlugin
module.exports = class MyPlugin {
  constructor() { }
  apply(compiler) {
    compiler.hooks.accelerate.tap('LoggerPlugin', newSpeed => {
      console.log(`Accelerate to ${newSpeed}`);
    });
    compiler.hooks.break.tap('WarningLampPlugin', () => {
      console.log('WarningLampPlugin');
    });
    compiler.hooks.calculateRoutes.tapPromise('CalculateRoutes TapAsync', (source, target, routesList) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log(`tapPromise to ${source}, ${target}, ${routesList}`)
          resolve();
        }, 3000);
      });
    });
  }
};
