/*
* file: app/requestHandlers.js
* creator: Ian McEachern
*/

var fs = require('fs');

function index(response){
	console.log('"index" request handler called');

	writeHeader(response, 'Node.js NFL -- Home');
	response.write('<h1>here are some instructions</h1>');
	writeFooter(response);

}

function css(response){
	console.log('"css" request handler called');

	loadFile('./bootstrap.css', 'text/css', response);
}

function javascript(response){
	console.log('"javascript" request handler called');

	loadFile('./bootstrap.js', 'application/javascript', response);
}

function teams(requested, response){
	console.log('"teams" request handler called');

	writeHeader(response, 'Node.js NFL -- Teams');
	response.write('<h1>Teams</h1>');
	writeFooter(response);

}

function players(requested, response){
	console.log('"players" request handler called');

	writeHeader(response, 'Node.js NFL -- Players');
	response.write('<h1>Players</h1>');
	writeFooter(response);
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
exports.css = css;
exports.javascript = javascript;
exports.teams = teams;
exports.players = players;
exports.favicon = favicon;

function writeHeader(response, title)
{
	response.writeHead(200, {'Content-Type': 'text/html'});
	response.write('<doctype HTML><html><head><title>'+title+'</title>');
	response.write('<link href="bootstrap.css" rel="stylesheet" type="text/css">');
	response.write('<script src="bootstrap.js"></script>');
	response.write('</head><body><a href="/">Node.js NFL</a><a href="/teams">Teams</a><a href="/players">Players</a>');
}

function writeFooter(response)
{
	response.write('</body></html>');
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