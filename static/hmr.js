(() => {
  var webpackModules = {
    './src/index.js': () => {
      const render = () => {
        const title = webpackRequire('./src/title.js');
        document.getElementById('root').innerText = title;
      };
      render();
      if (false) {
      }
    },
    './src/title.js': (module) => {
      module.exports = 'title1';
    },
    './webpack/hot/emitter.js': (module) => {
      class EventEmitter {
        constructor() {
          this.events = {};
        }
        on(eventName, fn) {
          this.events[eventName] = fn;
        }
        emit(eventName, ...args) {
          this.events[eventName](...args);
        }
      }
      module.exports = new EventEmitter();
    },
  };
  var webpackModuleCache = {};
  function webpackRequire(moduleId) {
    var cachedModule = webpackModuleCache[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = (webpackModuleCache[moduleId] = {
      exports: {},
    });
    webpackModules[moduleId](module, module.exports, webpackRequire);
    return module.exports;
  }
  var webpackExports = {};
  (() => {
    const hotEmitter = webpackRequire('./webpack/hot/emitter.js');
    const socket = io();
    let currentHash;
    socket.on('hash', (hash) => {
      console.log('客户端接收到 hash 消息');
      currentHash = hash;
    });
    socket.on('ok', () => {
      console.log('客户端接收到 OK 消息');
      reloadApp();
    });
    function reloadApp() {
      hotEmitter.emit('webpackHotUpdate', currentHash);
    }
  })();
  (() => {
    const hotEmitter = webpackRequire('./webpack/hot/emitter.js');
    hotEmitter.on('webpackHotUpdate', (currentHash) => {
      console.log('dev-server 收到了最新的 Hash >>> ', currentHash);
    });
  })();
  (() => {
    webpackRequire('./src/index.js');
  })();
})();
