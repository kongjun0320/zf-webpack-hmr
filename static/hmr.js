(() => {
  // 当前最新的 hash 值
  var currentHash;
  // 上一次的 hash 值
  var lastHash;
  function hotCheck() {
    console.log('开始进行热更新的检查');
    hotDownloadManifest()
      .then((update) => {
        console.log('update >>> ', update);
        update.c.forEach((chunkId) => {
          hotDownloadUpdateChunk(chunkId);
        });
        lastHash = currentHash;
      })
      .catch((error) => {
        console.log('error >>> ', error);
        window.location.reload();
      });
  }

  function hotDownloadUpdateChunk(chunkId) {
    let script = document.createElement('script');
    script.src = `${chunkId}.${lastHash}.hot-update.js`;
    document.head.appendChild(script);
  }

  self['webpackHotUpdate'] = function (chunkId, moreModules) {
    hotAddUpdateChunk(chunkId, moreModules);
  };

  let hotUpdate = {};
  function hotAddUpdateChunk(chunkId, moreModules) {
    for (const moduleId in moreModules) {
      // 合并到模块定义对象里
      hotUpdate[moduleId] = webpackModules[moduleId] = moreModules[moduleId];
    }
    hotApply();
  }

  function hotApply() {
    for (const moduleId in hotUpdate) {
      // 获取到老的模块
      const oldModule = webpackModuleCache[moduleId];
      // 删除老的缓存
      delete webpackModuleCache[moduleId];
      // 入口模块就没有父亲
      if (oldModule.parents && oldModule.parents.size > 0) {
        const parents = oldModule.parents;
        parents.forEach((parent) => {
          parent.hot.check(moduleId);
        });
      }
    }
  }

  function hotDownloadManifest() {
    return fetch(`main.${lastHash}.hot-update.json`).then((response) =>
      response.json()
    );
  }

  var webpackModules = {
    './src/index.js': (module, exports, webpackRequire) => {
      const render = () => {
        const title = webpackRequire('./src/title.js');
        document.getElementById('root').innerText = title;
      };
      render();
      if (module.hot) {
        module.hot.accept(['./src/title.js'], render);
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
  function hotCreateModule() {
    let hot = {
      _acceptedDependencies: {}, // 接收的依赖对象
      // 接收依赖的变化，注册各个模块的回调函数
      accept(deps, callback) {
        for (let i = 0; i < deps.length; i++) {
          hot._acceptedDependencies[deps[i]] = callback;
        }
      },
      check(moduleId) {
        const callback = hot._acceptedDependencies[moduleId];
        callback && callback();
      },
    };
    return hot;
  }

  function hotCreateRequire(parentModuleId) {
    // 先判断父亲这个模块是否已经加载过了，如果还没有加载，那么就返回 webpackRequire
    var parentModule = webpackModuleCache[parentModuleId];
    if (!parentModule) return webpackRequire;

    var hotRequire = function (childModuleId) {
      parentModule.children.add(childModuleId); // 父亲添加一个儿子
      const childExports = webpackRequire(childModuleId);
      const childModule = webpackModuleCache[childModuleId];
      childModule.parents.add(parentModule); // 儿子找到父亲，添加进来
      return childExports;
    };

    return hotRequire;
  }

  function webpackRequire(moduleId) {
    var cachedModule = webpackModuleCache[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = (webpackModuleCache[moduleId] = {
      exports: {},
      hot: hotCreateModule(), // 每个模块都会多一个 hot 属性，用来注册热更新的回调
      parents: new Set(), // 父模块数组
      children: new Set(), // 子模块数组
    });
    webpackModules[moduleId](
      module,
      module.exports,
      hotCreateRequire(moduleId)
    );
    return module.exports;
  }
  var webpackExports = {};
  (() => {
    const hotEmitter = webpackRequire('./webpack/hot/emitter.js');
    const socket = io();
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
      // 第一次
      if (!lastHash) {
        lastHash = currentHash;
        console.log('这是第一次收到 hash 值，首次渲染 >>> ');
        return;
      }
      console.log('lastHash >>> ', lastHash, currentHash, '开始真正执行热更新');
      hotCheck();
    });
  })();
  (() => {
    return hotCreateRequire('./src/index.js')('./src/index.js');
  })();
})();
