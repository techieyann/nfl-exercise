/*
* file: app/requestHandlers.js
* creator: Ian McEachern
*/

var fs = require('fs');

function index(response){
	console.log('"index" request handler called');

	loadFile('./index.html', 'text/html', response);
}

function teams(response){
	console.log('"index" request handler called');

	loadFile('./teams.html', 'text/html', response);
}

function players(response){
	console.log('"index" request handler called');

	loadFile('./players.html', 'text/html', response);
}

function favicon(response){
	console.log('"favicon" request handler called');

//source of favicon: http://images.fantasypros.com/images/experts/16x16/dlf.png
	var image = fs.readFileSync('./favicon.ico');
	response.writeHead(200, {'Content-Type': 'image/x-icon'});
	response.write(image, 'binary');
	response.end();
}

function loadFile(filename, type, response){
	fs.readFile(filename, 'binary', function(err, file){
		if(err)
		{
			response.writeHead(500, {'Content-Type': 'text/plain'});
			response.write(err);
			response.end();
			return;
		}

		response.writeHead(200, {'Content-Type': type});
		response.write(file, 'binary');
		response.end();
	});
}

exports.index = index;
exports.teams = teams;
exports.players = players;
exports.favicon = favicon;

