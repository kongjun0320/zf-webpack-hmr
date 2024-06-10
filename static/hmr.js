(() => {
  // 存放着我们的模块定义
  var webpackModules = {
    './src/index.js': (module) => {
      const render = () => {
        const title = webpackRequire('./src/title.js');
        root.innerText = title;
      };
      render();
      if (false) {
      }
    },
    './src/title.js': (module) => {
      module.exports = 'title1';
    },
  };
  // 模块执行后的缓存对象，key：模块 ID，值：模块的到处对象
  var webpackModuleCache = {};
  function webpackRequire(moduleId) {
    var cachedModule = webpackModuleCache[moduleId];
    // 看缓存里有没有
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    // 创建一个新模块对象
    var module = (webpackModuleCache[moduleId] = {
      exports: {},
    });
    // 调用模块的方法
    webpackModules[moduleId](module, module.exports, webpackRequire);
    // 导出一个对象
    return module.exports;
  }
  var webpackExports = {};
  (() => {
    webpackRequire('./src/index.js');
  })();
})();
