const http = require('http');
const WS = require('ws');
const net = require("net");


class WebSocketServer {

	constructor(app, port, user) {
		
		this.connection;
		this.user = user;

		const server = http.createServer(app);
		this.server = new WS.Server({ server });
		
		this.server.on('connection', this.onConnection);
		this.server.on('close', this.onClose);
		this.server.on('error', this.onError);
		
		server.listen(port,() => {});

		this.onConnection = (host, port) => {};
		this.onMessage = (msg) => {};
		this.onCloseConnection = () => {};
		this.socket = undefined;

	}


	onConnection = async socket => {
		console.log("conection websocket")
		if (!this.socket)
		{
			console.log("WebClient connected!");
			this.socket = socket;
			this.socket.on("close", this.onCloseSocket);
			this.socket.on("message", this.onDataSocket);
			this.send({cmd:"connection", user:this.user});
		}
	}

	onCloseSocket = () => {
		console.log("WebClient disconnected!")
		this.socket = undefined;
	}

	onDataSocket = message => {
		let data = JSON.parse(message)
		console.log("Commando: ", data.cmd);
		switch(data["cmd"])
		{
			case "addContact":
				this.addContact(data["host"], data["port"]);
			break;

			case "history":
				this.history(this.user, data["user"]);
			break;

			case "getContacts":
				this.getContacts();
			break;

			case "msg":
				this.message(this.user, data["user"], data["msg"]);
			break;
			
			case "closeConnection":
				this.onCloseConnection();
			break;
		}
	}





	onClose = () => {
		console.log("WebClient disconnected!")
		this.socket = undefined;
	}

	onError = err => {
		console.log("WebClient disconnected! due to: ", err)
		this.socket = undefined;
	}

	send = (msg) => {
		if(!this.socket) return;
		if (msg instanceof Object) msg = JSON.stringify(msg)
		this.socket.send(msg);
	}



	on(type, cb) {
		switch(type)
		{
			case "addContact":
				this.addContact = cb;
			break;
			case "getConnections":
				this.getConnections = cb;
			break;
			case "history":
				this.history = cb;
			break;
			case "getContacts":
				this.getContacts = cb;
			break;
			case "message":
				this.message =cb;
			break;
		}
	}

	isConnected = () => {
		return this.socket != undefined;
	}


}


module.exports = WebSocketServer;

//start our server





