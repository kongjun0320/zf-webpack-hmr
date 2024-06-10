/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/title.js":
/*!**********************!*\
  !*** ./src/title.js ***!
  \**********************/
/***/ ((module) => {

module.exports = 'title111';


/***/ }),

/***/ "./webpack/hot/emitter.js":
/*!********************************!*\
  !*** ./webpack/hot/emitter.js ***!
  \********************************/
/***/ ((module) => {

class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(eventName, fn) {
    this.events[eventName] = fn;
  }

  emit(eventName, ...args) {
    this.events[eventName](...args);
  }
}

module.exports = new EventEmitter();


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!********************************************!*\
  !*** ./webpack-dev-server/client/index.js ***!
  \********************************************/
const hotEmitter = __webpack_require__(/*! ../../webpack/hot/emitter */ "./webpack/hot/emitter.js");
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

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!***********************************!*\
  !*** ./webpack/hot/dev-server.js ***!
  \***********************************/
const hotEmitter = __webpack_require__(/*! ../../webpack/hot/emitter */ "./webpack/hot/emitter.js");

hotEmitter.on('webpackHotUpdate', (currentHash) => {
  console.log('dev-server 收到了最新的 Hash >>> ', currentHash);
});

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
const render = () => {
  const title = __webpack_require__(/*! ./title.js */ "./src/title.js");
  document.getElementById('root').innerText = title;
};

render();

if (false) {}

})();

/******/ })()
;