const path = require('path');

// 从当前路径出发，得到一个绝对路径
// /Users/junkong/AiCherish/study-webpack/13-hmr/9000/a
console.log('path.resolve >>> ', path.resolve('a'));
// 解析模块路径
// /Users/junkong/AiCherish/study-webpack/13-hmr/9000/node_modules/webpack/lib/index.js
console.log('require.resolve >>> ', require.resolve('webpack'));
