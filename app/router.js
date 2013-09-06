/*
* file: app/router.js
* creator: Ian McEachern
*/

function route(handle, pathname, response){
	console.log('routing request for ' + pathname);

	if(typeof handle[pathname] === 'function')
	{
		handle[pathname](response);
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