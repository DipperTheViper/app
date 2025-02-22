const http = require('http');

http.createServer(
	function(req,res){
		res.write("Trying to learn something new!");
		res.end();
}

).listen(3000);

console.log("server started!");
