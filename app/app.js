/*
* file: app/app.js
* creator: Ian McEachern
* 
* This is the main application file.
*/

//Load the necessary files
var server = require('./server');
var router = require('./router');
var requestHandlers = require('./requestHandlers');

//Set functions for specific requests
var handle = {};
handle[''] = requestHandlers.index;
handle['index'] = requestHandlers.index;
handle['bootstrap.css'] = requestHandlers.css;
handle['bootstrap.js'] = requestHandlers.javascript;
handle['teams'] = requestHandlers.teams;
handle['players'] = requestHandlers.players;
handle['favicon.ico'] = requestHandlers.favicon;

//Set port to listen on
var port = 8080;

//Start the server
server.start(router.route, handle, port);