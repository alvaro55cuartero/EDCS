const net = require('net');
const prompt = require('prompt-sync')();
//const port = prompt('Port: ');


var server = net.createServer((socket)=>{
	socket.setEncoding('utf-8');
	
	socket.on("data", data=>{
		console.log(data);
	});


	console.log("Client connected: " + socket.localAddress);					
});


server.listen(55555);