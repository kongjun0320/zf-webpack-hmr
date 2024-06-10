const path = require('path');
const mime = require('mime');

/**
 * 这个 express 中间件负责提供产出文件的预览
 * 拦截 HTTP 请求，看看请求的文件是不是 webpack 打包出来的文件
 * 如果是的话，从硬盘上读出来，返回给客户端
 */
function wrapper({ fs, outputPath }) {
  return (req, res, next) => {
    let url = req.url;

    if (url === '/favicon.ico') return res.sendStatus(404);

    if (url === '/') {
      url = '/index.html';
    }
    // outputPath = path.resolve(__dirname, 'dist')
    // url = /main.js
    let filename = path.join(outputPath, url);

    try {
      let stat = fs.statSync(filename);
      if (stat.isFile()) {
        let content = fs.readFileSync(filename);
        res.setHeader('Content-Type', mime.getType(filename));
        res.send(content);
      } else {
        res.sendStatus(40);
      }
    } catch (error) {
      console.log('error >>> ', error);
      next(error);
      res.sendStatus(404);
    }
  };
}

module.exports = wrapper;
