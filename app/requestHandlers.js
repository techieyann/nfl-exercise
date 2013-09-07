/*
* file: app/requestHandlers.js
* creator: Ian McEachern
*
* This is the meat of the application, writing the responses to the client.
*/

var fs = require('fs');

//Load and sort the team data. By conference, division, and finally name
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

//Load and sort the player data. By first then last name
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

//Find the teams with player data supplied
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

//Store the full name of the found teams hashed by the acronym, for player team display
var fullTeamName = new Array();
for(i=0; i<teamList.length; i++)
{
	for(j=0; j<teamsWithPlayers.length; j++)
	{
		if(teamList[i].Key == teamsWithPlayers[j])
		{
			fullTeamName[teamList[i].Key] = teamList[i].Name;
		}
	}
}

//Index handler
function index(response){
	console.log('"index" request handler called');

	writeHeader(response, 'Node.js NFL -- Home');
	response.write('<div class="hero-unit"><h1>Welcome</h1><p>Enjoy browsing the <a href="/players">player</a> and <a href="/teams">team</a> data.</p></div>');
	writeFooter(response);

}

//bootstrap.css handler
function css(response){
	console.log('"css" request handler called');

	loadFile('./bootstrap.css', 'text/css', response);
}

//bootstrap.js handler
function javascript(response){
	console.log('"javascript" request handler called');

	loadFile('./bootstrap.js', 'application/javascript', response);
}

//favicon.ico handler
function favicon(response){
	console.log('"favicon" request handler called');

//source of favicon: http://images.fantasypros.com/images/experts/16x16/dlf.png
	var image = fs.readFileSync('./favicon.ico');
	response.writeHead(200, {'Content-Type': 'image/x-icon'});
	response.write(image, 'binary');
	response.end();
}

//Teams handler
function teams(requested, response){
	console.log('"teams" request handler called');

	//Team listing display
	if(requested == null)
	{
		writeHeader(response, 'Teams');
		response.write('<h1>Teams</h1>');

		var currentConference = null;
		var currentDivision = null;
		//flag for tracking div closures
		var conferenceChanged = false;
		for(i=0; i<teamList.length; i++)
		{
			var currentTeam = teamList[i];
			if(currentConference != currentTeam.Conference)
			{
				if(currentConference != null)
				{
					response.write('</div></div>');
				}
				conferenceChanged = true;
				currentConference = currentTeam.Conference;
				response.write('<h2>'+currentConference+'</h2><div class="row">');
			}
			if(currentDivision != currentTeam.Division)
			{
				if(currentDivision != null && !conferenceChanged)
				{
					response.write('</div>');
				}
				conferenceChanged = false;
				currentDivision = currentTeam.Division;
				response.write('<div class="span3"><h3>'+currentDivision+'</h3>');
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
		response.write('</div></div>');

	}
	//Display active players on requested team
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
		//Requested team was not found!
		if(team == null)
		{
			writeHeader(response, 'error');
			response.write('<h2>Team not found..</h2>');			
		}
		//Team was found!
		else
		{
			writeHeader(response, team.Name);
			response.write('<h2>Team: '+team.City+' '+team.Name+'</h2>');
			response.write('<h3>'+team.Conference+' '+team.Division+'</h3>');
			var activePlayers = new Array();

			//Find players that are active, on the appropriate team, and not 'ST'
			for(i=0; i<playerList.length; i++)
			{
				if(playerList[i].Active && playerList[i].PositionCategory != 'ST' && playerList[i].Team == team.Key)
				{
					activePlayers.push(playerList[i]);
				}
			}

			//Sort the active players by Position Category, Position, and finally Depth Order 
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
			response.write('<ul class="thumbnails">');
			for(i=0; i<activePlayers.length; i++)
			{
				var currentPlayer = activePlayers[i];
				if(currentPositionCat != currentPlayer.PositionCategory)
				{
					currentPositionCat = currentPlayer.PositionCategory;
					//translate Position Category to full english
					var offDef = '';
					if(currentPositionCat == 'OFF')
					{
						offDef = 'Offense';
					}
					if(currentPositionCat == 'DEF')
					{
						offDef = 'Defense';
					}
					response.write('</ul>');
					response.write('<h3>'+offDef+'</h3>');
					response.write('<ul class="thumbnails">');

				}
				response.write('<li class="span3">');
				writePlayer(response, currentPlayer, 'mini');
				response.write('</li>');
			}
			response.write('</ul>');
		}
	}
	//Activate the team nav link
	response.write('<script>document.getElementById("teams-nav").className += "active";</script>');
	writeFooter(response);
}

//Players handler
function players(requested, response){
	console.log('"players" request handler called');

	//No specific player requested
	if(requested == null)
	{	
		writeHeader(response, 'Players');
		response.write('<h1>Players</h1><ul class="thumbnails">');
		for(i=0; i<playerList.length; i++)
		{
			response.write('<li class="span3">');
			writePlayer(response, playerList[i], 'mini');
			response.write('</li>');
		}
		response.write('</ul>');
	}
	//Display requested player
	else
	{
		//Search for requested player
		var player = null;
		for(i=0; i<playerList.length; i++)
		{
			if(playerList[i].PlayerID == requested)
			{
				player = playerList[i];
				break;
			}
		}

		//Found requested player
		if(player != null)
		{
			var fullName = player.FirstName+' '+player.LastName;
			writeHeader(response, fullName);
			writePlayer(response, player, 'full');
		}

		//Didn't find requested player
		else
		{
			writeHeader(response, 'error');
			response.write('<h2>Player not found..</h2>');
		}

	}
	//Activate the player nav link
	response.write('<script>document.getElementById("players-nav").className += "active";</script>');
	writeFooter(response);	
}


exports.index = index;
exports.css = css;
exports.javascript = javascript;
exports.favicon = favicon;
exports.teams = teams;
exports.players = players;

//Header module, with dynamic title argument
function writeHeader(response, title)
{
	response.writeHead(200, {'Content-Type': 'text/html'});
	response.write('<!DOCTYPE html><html><head><title>Node.js NFL -- '+title+'</title>');
//css file(s)
	response.write('<link href="/bootstrap.css" rel="stylesheet" type="text/css" media="screen">');
//inline css
	response.write('<style>.rounded{border-radius:5px; -moz-border-radius:5px; -webkit-border-radius:5px;} .centered{margin:auto;}</style>');
	response.write('</head><body>');
//navbar
	response.write('<div class="navbar"><div class="navbar-inner"><a class="brand" href="/">Node.js NFL</a><ul class="nav pull-right"><li id="teams-nav"><a href="/teams">Teams</a></li><li id="players-nav"><a href="/players">Players</a></li></ul></div></div>');
	response.write('<div class="container">');
}

//Player display module, both full and mini as specified by type
function writePlayer(response, player, type)
{
	//Concatonate full player position
	var position = player.Position;
	if(player.DepthOrder != null)
	{
		position += player.DepthOrder;
	}

	if(type == 'full')
	{
		response.write('<img class="rounded pull-right" src="'+player.PhotoUrl+'">');
		response.write('<h2>Player: '+player.Name+'</h2>');
		response.write('<h4>'+position+' '+fullTeamName[player.Team]+'</h4>');
		response.write('Height: '+player.Height+'<br>');
		response.write('Weight: '+player.Weight+'<br>');
		response.write('Birthdate: '+player.BirthDate+'<br>');
		response.write('College: '+player.College+'<br>');
	}

	if(type == 'mini')
	{
		response.write('<div class="media"><img class="pull-left rounded" width="32" src="'+player.PhotoUrl+'">');
		response.write('<div class="media-body"><a href="/players/'+player.PlayerID+'">'+player.Name+'</a><br>');
		response.write('<div class="label">'+position+'</div> '+fullTeamName[player.Team]+'</div></div>');
	}
}

//Footer module
function writeFooter(response)
{
	response.write('<div class="text-center"><hr>Created by: Ian McEachern (<a href="https://github.com/TerraEclipse/nfl-exercise">Exercise</a> for <a href="http://terraeclipse.com">Terra Eclipse</a>)</div>');
	response.write('</div><script src="/bootstrap.js"></script>');
	response.write('</body></html>');
	response.end();
}

//File response module
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