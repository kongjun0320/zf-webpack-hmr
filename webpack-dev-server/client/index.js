const hotEmitter = require('../../webpack/hot/emitter');
// 通过 websocket 客户端连接服务器端
const socket = io();
// 当前最新的 hash 值
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
