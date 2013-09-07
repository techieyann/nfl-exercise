/**
* file: app/server.js
* creator: Ian McEachern
*
* This files creates the server and sends requests to the router.
*/

var http = require('http');
var url = require('url');

function start(route, handle, port){
	function onRequest(request, response){
		var pathname = url.parse(request.url).pathname;
		console.log('requested '+ pathname);

		route(handle, pathname, response);
	}

	http.createServer(onRequest).listen(port);

	console.log('Server running on port '+port);
}

exports.start = start;