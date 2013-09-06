/**
file: app/server.js
creator: Ian McEachern

This is a node app for displaying and filtering sample NFL data
 */

var http = require('http');
var url = require('url');

function start(){
	function onRequest(req, res){
		var requestedPath = url.parse(req.url).pathname;
		console.log('requested '+requestedPath);
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write('hello world!');
		res.end();
	}

	http.createServer(onRequest).listen(8080);

	console.log('Server running on port 8080');
}

exports.start = start;