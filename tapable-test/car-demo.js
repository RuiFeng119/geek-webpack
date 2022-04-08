const { SyncHook, AsyncSeriesHook } = require('tapable');

class Car {
  constructor() {
    this.hooks = {
      accelerate: new SyncHook(['newSpeed']),
      break: new SyncHook(),
      calculateRoutes: new AsyncSeriesHook(['source', 'target', 'routesList'])
    };
  }
}

const myCar = new Car();

// 绑定同步钩子
myCar.hooks.break.tap('WarningLampPlugin', () => {
  console.log('WarningLampPlugin');
});

// 绑定同步钩子，并传参
myCar.hooks.accelerate.tap('LoggerPlugin', newSpeed => {
  console.log(`Accelerate to ${newSpeed}`);
});

// 绑定异步promise钩子
myCar.hooks.calculateRoutes.tapPromise('CalculateRoutes tapPromise', (source, target, routesList) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`tapPromise to ${source}, ${target}, ${routesList}`);
      resolve();
    }, 3000);
  });
});

// 执行同步钩子
myCar.hooks.break.call();
myCar.hooks.accelerate.call(100);

// 执行异步钩子
console.time('异步钩子执行');
myCar.hooks.calculateRoutes.promise('Async', 'hook', 'demo').then(() => {
  console.timeEnd('异步钩子执行');
}, err => {
  console.error(error);
  console.timeEnd('异步钩子执行');
});
