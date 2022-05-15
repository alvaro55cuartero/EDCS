const net = require('net');

var server = net.createServer((socket)=>{

	socket.setEncoding('utf-8');
	socket.write("Welcome " + socket.name + "\n");
	console.log("Client connected");					
});

server.listen(55555);