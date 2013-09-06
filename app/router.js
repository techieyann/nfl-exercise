/*
* file: app/router.js
* creator: Ian McEachern
*/

function route(handle, pathname, response){
	console.log('routing request for ' + pathname);

	var pathArray = pathname.split('/');
	var path = pathArray[1];
	var requested = null;
	if(pathArray.length > 2)
	{
		requested = pathArray[2];
	}

	if(typeof handle[path] === 'function')
	{
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
	else
	{
		console.log('404ing request for ' + pathname);
		response.writeHead(404, {'Content-Type': 'text/plain'});
		response.write('404 not found..');
		response.end();
	}
}

exports.route = route;