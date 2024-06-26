const render = () => {
  const title = require('./title.js');
  document.getElementById('root').innerText = title;
};

render();

if (module.hot) {
  // 当 title.js 模块发生修改的时候，执行 render 方法这个回调函数
  // 可以接收并处理哪些模块的变更
  module.hot.accept(['./title'], render);
}
