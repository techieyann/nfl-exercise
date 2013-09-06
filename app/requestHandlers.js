/*
* file: app/requestHandlers.js
* creator: Ian McEachern
*/

var fs = require('fs');

function hello(response){
	console.log('"hello" request handler called');

	response.writeHead(200, {'Content-Type': 'text/plain'});
	response.write('hello world!');
	response.end();
}

function favicon(response){
	console.log('"favicon" request handler called');

//source of favicon: http://images.fantasypros.com/images/experts/16x16/dlf.png
	var image = fs.readFileSync('./favicon.ico');
	response.writeHead(200, {'Content-Type': 'image/x-icon'});
	response.write(image, 'binary');
	response.end();
}

exports.hello = hello;
exports.favicon = favicon;