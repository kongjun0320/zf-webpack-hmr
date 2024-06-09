const http = require('http');
const express = require('express');
const io = require('socket.io');
const updateCompiler = require('./utils/updateCompiler');
const webpackDevMiddleware = require('../../webpack-dev-middleware');

class Server {
  constructor(compiler, devServerArgs) {
    this.sockets = [];
    this.compiler = compiler;
    this.devServerArgs = devServerArgs;
    updateCompiler(compiler);
    // 开始启动 webpack 的编译
    this.setupHooks();
    this.setupApp();
    this.routes();
    this.setupDevMiddleware();
    this.createServer();
    this.createSocketServer();
  }

  setupHooks() {
    // 监听编译成功的事件
    // 当 webpack 完成一次完整的编译之后，会触发的 done 这个钩子的回调函数执行
    // 编译成功后的成果描述(modules,chunks,files,assets,entries) 会放在 stats
    this.compiler.hooks.done.tap('webpack-dev-server', (stats) => {
      console.log('新的编译已经完成，新的 hash 值为 >>> ', stats.hash);
      // 以后每一次新的编译成功后，都要向客户端发送最新的 hash 值和 ok
      this.sockets.forEach((socket) => {
        socket.emit('hash', stats.hash);
        socket.emit('ok');
      });
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

  createSocketServer() {
    // webSocketServer 在通信之前要握手，握手的时候用的是 HTTP 协议
    const webSocketServer = io(this.server);
    // 监听客户端的连接
    webSocketServer.on('connection', (socket) => {
      console.log('一个新的 websocket 客户端已经连接上来了');
      // 把新的客户端添加到数组里，为了以后编译成功之后广播准备
      this.sockets.push(socket);
      // 监听客户端断开事件
      socket.on('disconnect', () => {
        const index = this.sockets.indexOf(socket);
        this.sockets.splice(index, 1);
      });
      // 如果以前已经编译过了，就把上一次的 hash 值和 ok 发给客户端
      if (this._stats) {
        socket.emit('hash', this._stats.hash);
        socket.emit('ok');
      }
    });
  }

  listen(port, host, callback) {
    this.server.listen(port, host, callback);
  }
}

module.exports = Server;
