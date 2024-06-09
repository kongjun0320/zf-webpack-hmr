const path = require('path');

function updateCompiler(compiler) {
  const options = compiler.options;
  // 1、来自于 webpack-dev-server/client/index.js，它就是浏览器里的 websocket 客户端
  options.entry.main.import.unshift(require.resolve('../../client/index.js'));
  //   2、webpack/hot/dev-server.js 它用来在浏览器里监听发生的事件，进行后续更新逻辑
  options.entry.main.import.unshift(
    require.resolve('../../../webpack/hot/dev-server.js')
  );
  // console.log('options.entry >>> ', options.entry);
  // 把入口变更之后，你得通知 webpack 按新的入口进行编译
  compiler.hooks.entryOption.call(options.context, options.entry);
}

module.exports = updateCompiler;

/**
 * webpack4
 * entry: {
 *  main: ['./src/index.js']
 * }
 *
 * webpack5
 * entry: {
 *  main: {
 *      import: ['./src/index.js']
 * }
 * }
 */
