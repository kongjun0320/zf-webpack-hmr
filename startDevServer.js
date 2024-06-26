// 1、准备创建开发服务器
const webpack = require('webpack');
const config = require('./webpack.config');
const Server = require('./webpack-dev-server/lib/Server');

function startDevServer(compiler, config) {
  const devServerArgs = config.devServer || {};
  // 3、启动 HTTP 服务器，里面还会负责打包我们的项目并提供预览服务，通过它访问打包后的问题
  const server = new Server(compiler, devServerArgs);
  const { port = 9000, host = 'localhost' } = devServerArgs;
  server.listen(port, host, (err) => {
    console.log(`Project is running at http://${host}:${port}`);
  });
}

// 2、创建 compiler 实例
const compiler = webpack(config);

startDevServer(compiler, config);

module.exports = startDevServer;
