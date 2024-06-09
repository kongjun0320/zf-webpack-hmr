const http = require('http');
const express = require('express');
const updateCompiler = require('./utils/updateCompiler');
const webpackDevMiddleware = require('../../webpack-dev-middleware');

class Server {
  constructor(compiler, devServerArgs) {
    this.compiler = compiler;
    this.devServerArgs = devServerArgs;
    updateCompiler(compiler);
    // 开始启动 webpack 的编译
    this.setupHooks();
    this.setupApp();
    this.routes();
    this.setupDevMiddleware();
    this.createServer();
  }

  setupHooks() {
    // 监听编译成功的事件
    // 当 webpack 完成一次完整的编译之后，会触发的 done 这个钩子的回调函数执行
    // 编译成功后的成果描述(modules,chunks,files,assets,entries) 会放在 stats
    this.compiler.hooks.done.tap('webpack-dev-server', (stats) => {
      console.log('新的编译已经完成，新的 hash 值为 >>> ');
      console.log('stats.hash >>> ', stats.hash);
      // 保存一次的 stats 信息
      this._stats = stats;
    });
  }

  setupDevMiddleware() {
    this.middleware = webpackDevMiddleware(this.compiler);
    this.app.use(this.middleware);
  }

  setupApp() {
    // this.app 并不是一个服务，它本身其实只是一个路由中间件
    this.app = express();
  }

  routes() {
    if (this.devServerArgs.static.directory) {
      // 此目录会成为静态文件目录
      this.app.use(express.static(this.devServerArgs.static.directory));
    }
  }

  createServer() {
    this.server = http.createServer(this.app);
  }

  listen(port, host, callback) {
    this.server.listen(port, host, callback);
  }
}

module.exports = Server;
