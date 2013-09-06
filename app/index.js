/*
* file: app/index.js
* creator: Ian McEachern
* source of favicon: http://images.fantasypros.com/images/experts/16x16/dlf.png
*/

var server = require('./server');
var router = require('./router');

server.start(router.route);