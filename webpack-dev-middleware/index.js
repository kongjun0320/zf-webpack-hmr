const MemoryFileSystem = require('memory-fs');
const middleware = require('./middleware');
const fs = require('fs');

const memoryFileSystem = new MemoryFileSystem();
/**
 * webpack 开发中间件
 */
function webpackDevMiddleware(compiler) {
  // 1. 真正的以监听模式启动 webpack 编译
  compiler.watch({}, () => {
    console.log('监听到文件变化，webpack 重新开始编译 >>> ');
  });

  // 当 webpack 准备写入文件的时候，是用的 compiler.outputFileSystem 来写入
  //   const fs = (compiler.outputFileSystem = memoryFileSystem);
  // 2. 返回一个 express 中间件，用来预览我们产出的资源文件
  // 产出的文件并不是写在硬盘上的，为了提高性能，产出的文件是放在内存里，所以你在硬盘上看不见
  return middleware({ fs, outputPath: compiler.options.output.path });
}

module.exports = webpackDevMiddleware;
