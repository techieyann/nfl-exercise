/*
* file: app/app.js
* creator: Ian McEachern
*/

var server = require('./server');
var router = require('./router');
var requestHandlers = require('./requestHandlers');

var handle = {};
handle['/'] = requestHandlers.index;
handle['/index'] = requestHandlers.index;
handle['/favicon.ico'] = requestHandlers.favicon;

var port = 8080;

server.start(router.route, handle, port);