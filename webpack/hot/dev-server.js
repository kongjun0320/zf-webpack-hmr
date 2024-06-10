const hotEmitter = require('../../webpack/hot/emitter');

hotEmitter.on('webpackHotUpdate', (currentHash) => {
  console.log('dev-server 收到了最新的 Hash >>> ', currentHash);
});
