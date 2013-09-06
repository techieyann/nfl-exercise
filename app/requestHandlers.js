/*
* file: app/requestHandlers.js
* creator: Ian McEachern
*/

var fs = require('fs');

function index(response){
	console.log('"index" request handler called');

	fs.readFile('./index.html', 'binary', function(err, file){
		if(err)
		{
			response.writeHead(500, {'Content-Type': 'text/plain'});
			response.write(err);
			response.end();
			return;
		}

		response.writeHead(200, {'Content-Type': 'text/html'});
		response.write(file, 'binary');
		response.end();
	});
}

function favicon(response){
	console.log('"favicon" request handler called');

//source of favicon: http://images.fantasypros.com/images/experts/16x16/dlf.png
	var image = fs.readFileSync('./favicon.ico');
	response.writeHead(200, {'Content-Type': 'image/x-icon'});
	response.write(image, 'binary');
	response.end();
}

exports.index = index;
exports.favicon = favicon;