/*
* file: app/requestHandlers.js
* creator: Ian McEachern
*/

var fs = require('fs');

var teamList = require('../data/Team.2012.json');
teamList.sort(function(a,b){
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

var playerList = require('../data/Player.2012.json');
playerList.sort(function(a,b){
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

var teamsWithPlayers = new Array();
teamsWithPlayers.push(playerList[0].Team);
var foundTeam = false;
for(i=1; i<playerList.length; i++)
{
	for(j=0; j<teamsWithPlayers.length; j++)
	{
		if(playerList[i].Team == teamsWithPlayers[j])
		{
			foundTeam = true;
			break;
		}
	}
	if(foundTeam == false)
	{
		teamsWithPlayers.push(playerList[i].Team);
	}
	foundTeam = false;
}

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

	if(requested == null)
	{
		writeHeader(response, 'Teams');
		response.write('<h1>Teams</h1>');
		var currentConference = null;
		var currentDivision = null;
		for(i=0; i<teamList.length; i++)
		{
			var currentTeam = teamList[i];
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
			var link = '';
			var linkEnd = '';
			for(j=0; j<teamsWithPlayers.length; j++)
			{
				if(teamsWithPlayers[j] == currentTeam.Key)
				{
					link = '<a href="/teams/'+currentTeam.Key+'">';	
					linkEnd = '</a>';
				}
			}
			response.write('<p>'+link+currentTeam.City+' '+currentTeam.Name+linkEnd+'</p>');
		}

	}
	else
	{
		var team = null;
		for(i=0; i<teamList.length; i++)
		{
			if(teamList[i].Key == requested)
			{
				team = teamList[i];
				break;
			}
		}
		if(team == null)
		{
			writeHeader(response, 'error');
			response.write('<h2>Team not found..</h2>');			
		}
		else
		{
			writeHeader(response, team.Name);
			response.write('<h2>Team: '+team.City+' '+team.Name+'</h2>');
			response.write('<h3>'+team.Conference+' '+team.Division+'</h3>');
			var activePlayers = new Array();
			for(i=0; i<playerList.length; i++)
			{
				if(playerList[i].Active && playerList[i].PositionCategory != 'ST' && playerList[i].Team == team.Key)
				{
					activePlayers.push(playerList[i]);
				}
			}
			activePlayers.sort(function(a,b){
				if(a.PositionCategory == b.PositionCategory)
				{
					if(a.Position == b.Position)
					{
						if(a.DepthOrder < b.DepthOrder)
						{
							return -1;
						}
						if(a.DepthOrder > b.DepthOrder)
						{
							return 1;
						}
						return 0;
					}
					if(a.Position < b.Position)
					{
						return -1;
					}
					if(a.Position > b.Position)
					{
						return 1;
					}
				}
				if(a.PositionCategory > b.Position)
				{
					return -1;
				}
				if(a.PositionCategory < b.Position)
				{
					return 1;
				}
			});
			var currentPositionCat = null;
			for(i=0; i<activePlayers.length; i++)
			{
				var currentPlayer = activePlayers[i];
				if(currentPositionCat != currentPlayer.PositionCategory)
				{
					currentPositionCat = currentPlayer.PositionCategory;
					var offDef = '';
					if(currentPositionCat == 'OFF')
					{
						offDef = 'Offense';
					}
					if(currentPositionCat == 'DEF')
					{
						offDef = 'Defense';
					}
					response.write('<h3>'+offDef+'</h3>');
				}
				writePlayer(response, currentPlayer, 'mini');
			}
		}
	}
	writeFooter(response);
}

function players(requested, response){
	console.log('"players" request handler called');


	if(requested == null)
	{


	
		writeHeader(response, 'Players');
		response.write('<h1>Players</h1>');
		for(i=0; i<playerList.length; i++)
		{
			writePlayer(response, playerList[i], 'mini');
		}

	}
	else
	{
		var player = null;
		for(i=0; i<playerList.length; i++)
		{
			if(playerList[i].PlayerID == requested)
			{
				player = playerList[i];
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