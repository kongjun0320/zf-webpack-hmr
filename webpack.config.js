const path = require('path');
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: false,
  entry: [
    path.resolve('./webpack-dev-server/client/index.js'),
    path.resolve('./webpack/hot/dev-server.js'),
    './src/index.js',
  ],
  output: {
    filename: '[name].js',
    // 默认的静态文件服务器
    path: path.resolve(__dirname, 'dist'),

    // 热更新的全局变量名
    // hotUpdateGlobal: ''
  },
  devServer: {
    hot: true, // 支持热更新
    port: 9000,
    // 除了打包后的资源外，额外的静态文件目录
    static: {
      directory: path.join(__dirname, 'static'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    // 此处可写可不写，因为如果 devServer.hot = true 的话，webpack 会自动添加
    // new HotModuleReplacementPlugin(),
  ],
};
