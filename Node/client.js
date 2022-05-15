const net = require('net');
const prompt = require('prompt-sync')();

const crypto = require("crypto")

// The `generateKeyPairSync` method accepts two arguments:
// 1. The type ok keys we want, which in this case is "rsa"
// 2. An object with the properties of the key
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
	// The standard secure default length for RSA keys is 2048 bits
	modulusLength: 2048
})



var criptext = crypto.publicEncrypt(publicKey, Buffer.from("Este mensaje es privadisimo!!! :| "));
var ms = crypto.privateDecrypt(privateKey, criptext);
console.log(ms.toString());




/*

var running = true;

while (running)
{
	const task = prompt('> ');
	const args = task.split(" ");

	switch(args[0])
	{
		case "exit":
			running = false;
			break;

		case "connect":
		{

			const port = prompt('Port: ');
			var client = net.connect({port:55555}, () =>{
				console.log("client connected");
			});


			console.log(port);
		}
		break;
		
		case "server":
		{

			const port = prompt('Port: ');
			startServer(port);
			
		}
		break;
	}
}
*/

async function startServer(port)
{
	console.log("aaaaa");


	var server = net.createServer((conn)=>{
		console.log("Client connected");					
	});

	await server.listen(port);
}





var client = net.connect({port:55555}, () =>{
	console.log("client connected");
});


client.setEncoding('utf8');

client.on("data", (data)=>{
	console.log(data);
})


/*

var client = net.connect({port:55555}, () =>{
	console.log("client connected");
});

client.on("data", (data) => {
	console.log("[client] data: " + data);
});
*/