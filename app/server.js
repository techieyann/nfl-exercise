/**
file: app/server.js
creator: Ian McEachern

This is a node app for displaying and filtering sample NFL data
 */

var http = require('http');

var server = http.createServer(function(req, res){
	res.writeHead(200, {"Content-Type": "text/plain"});
	res.end("hello world!");
});

server.listen(8080);

console.log("Server running on port 8080");