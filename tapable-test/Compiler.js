// 模拟Compiler.js
const { SyncHook, AsyncSeriesHook } = require('tapable');

module.exports = class Compiler {
  constructor() {
    this.hooks = {
      accelerate: new SyncHook(['newSpeed']),
      break: new SyncHook(),
      calculateRoutes: new AsyncSeriesHook(['source', 'target', 'routesList'])
    };
  }

  run() {
    this.accelerate(100);
    this.break();
    this.calculateRoutes('Async', 'hook', 'demo');
  }
  accelerate(speed) {
    this.hooks.accelerate.call(speed);
  }
  break() {
    this.hooks.break.call();
  }
  calculateRoutes() {
    console.time('异步钩子执行');
    this.hooks.calculateRoutes.promise(...arguments).then(() => {
      console.log('success');
      console.timeEnd('异步钩子执行');
    }, err => {
      console.log(err);
      console.timeEnd('异步钩子执行');
    });
  }
};
