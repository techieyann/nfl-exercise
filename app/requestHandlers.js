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

function favicon(response){
	console.log('"favicon" request handler called');

//source of favicon: http://images.fantasypros.com/images/experts/16x16/dlf.png
	var image = fs.readFileSync('./favicon.ico');
	response.writeHead(200, {'Content-Type': 'image/x-icon'});
	response.write(image, 'binary');
	response.end();
}

function teams(requested, response){
	console.log('"teams" request handler called');
	var teams = require('../data/Team.2012.json');

	if(requested == null)
	{
		teams.sort(function(a,b){
			if(a.Conference == b.Conference)
			{
				if(a.Division == b.Division)
				{
					if(a.Name < b.Name)
					{
						return -1;
					}
					if(a.Name > b.Name)
					{
						return 1;
					}
				}
				if(a.Division < b.Division)
				{
					return -1;
				}
				if(a.Division > b.Division)
				{
					return 1;		
				}
			}
			if(a.Conference < b.Conference)
			{
				return -1;
			}
			if(a.Conference > b.Conference)
			{
				return 1;
			}
		});
	
	
		writeHeader(response, 'Teams');
		response.write('<h1>Teams</h1>');
		var currentConference = null;
		var currentDivision = null;
		for(i=0; i<teams.length; i++)
		{
			var currentTeam = teams[i];
			if(currentConference != currentTeam.Conference)
			{
				currentConference = currentTeam.Conference;
				response.write('<h2>'+currentConference+'</h2>');
			}
			if(currentDivision != currentTeam.Division)
			{
				currentDivision = currentTeam.Division;
				response.write('<h3>'+currentDivision+'</h3>');
			}
			response.write('<p>'+currentTeam.Name+'</p>');
		}
		writeFooter(response);
	}
}

function players(requested, response){
	console.log('"players" request handler called');
	var players = require('../data/Player.2012.json');

	if(requested == null)
	{
		players.sort(function(a,b){
			if(a.FirstName == b.FirstName)
			{
				if(a.LastName == b.LastName)
				{
					return 0;
				}
				if(a.LastName < b.LastName)
				{
					return -1;
				}
				if(a.LastName > b.LastName)
				{
					return 1;
				}			
			}
			if(a.FirstName < b.FirstName)
			{
				return -1;
			}
			if(a.FirstName > b.FirstName)
			{
				return 1;
			}			
		});

	
		writeHeader(response, 'Players');
		response.write('<h1>Players</h1>');
		for(i=0; i<players.length; i++)
		{
			writePlayer(response, players[i], 'mini');
		}

	}
	else
	{
		var player = null;
		for(i=0; i<players.length; i++)
		{
			if(players[i].PlayerID == requested)
			{
				player = players[i];
				break;
			}
		}
		if(player != null)
		{
			var fullName = player.FirstName+' '+player.LastName;
			writeHeader(response, fullName);
			writePlayer(response, player, 'full');
		}
		else
		{
			writeHeader(response, 'error');
			response.write('<h2>Player not found..</h2>');
		}

	}
	writeFooter(response);	
}





exports.index = index;
exports.css = css;
exports.javascript = javascript;
exports.favicon = favicon;
exports.teams = teams;
exports.players = players;


function writeHeader(response, title)
{
	response.writeHead(200, {'Content-Type': 'text/html'});
	response.write('<doctype HTML><html><head><title>Node.js NFL -- '+title+'</title>');
	response.write('<link href="bootstrap.css" rel="stylesheet" type="text/css">');
	response.write('<script src="bootstrap.js"></script>');
	response.write('</head><body><a href="/">Node.js NFL</a><a href="/teams">Teams</a><a href="/players">Players</a>');
}

function writePlayer(response, player, type)
{
	var fullName = player.FirstName+' '+player.LastName;
	if(type == 'full')
	{
		response.write('<h2>Player: '+fullName+'</h2>');
	}
	if(type == 'mini')
	{
		response.write('<p><a href="/players/'+player.PlayerID+'">'+fullName+'</a><p>');
	}
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