/*
* file: app/router.js
* creator: Ian McEachern
*
* This is the router for the server. It checks the URL path, 
* and sends the appropriate data to the corresponding handler. 
* Failing that it 404s.
*/

function route(handle, pathname, response){
	console.log('routing request for ' + pathname);

	//Separate requested URL path into array (pathArray[0] will always be empty)
	var pathArray = pathname.split('/');
	var path = pathArray[1];
	var requested = null;
	if(pathArray.length > 2)
	{
		requested = pathArray[2];
	}

	//Check if handler is defined
	if(typeof handle[path] === 'function')
	{
		//Make sure to send the extra argument to the team and player handlers
		if(path == 'teams' || path == 'players')
		{
			handle[path](requested, response);
		}
		else
		{
			handle[path](response);
		}
		return;
	}
	//Not defined, 404!
	else
	{
		console.log('404ing request for ' + pathname);
		response.writeHead(404, {'Content-Type': 'text/plain'});
		response.write('404 not found..');
		response.end();
	}
}

exports.route = route;