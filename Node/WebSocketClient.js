const TCPClient = require('./TCPClient');
const Storage = require('./Storage.js');

class WebSocketClient {

	constructor(socket, user) {
		this.storage = storage;
		this.user = user;
		this.storage = Storage(user);

		this.socket = socket;
		this.socket.on("message", this.onMessage)
	}


	onMessage = async (message) => {
		let data = JSON.parse(message)
		console.log('received: %s', data);
		
		switch(data["cmd"])
		{
			case "connection":
				this.connection(data["host"], data["port"]);
			break;

			case "msg":
				this.message(data["msg"]);
			break;

			case "history":
				this.history(data["user"]);
			break;
			
			case "closeConnection":
				this.onCloseConnection();
			break;
		}
	};


	history = user => {
		console.log("Web client requesting history");

		data = this.storage.getHistory(user);
		console.log("history", data);
		let json = {
			cmd:"history", 
			history: msg
		}

		this.send(JSON.stringify(json));

	}


	message = msg => {
		console.log("Web client is sending a msg");

		let json = {
			user: user,
			cmd:"msg", 
			msg: msg
		}

		this.storage.storeMsg(this.tcpClient.remoteUser, json);

		this.tcpClient.sendEncrypted(JSON.stringify(json));
	}



	send(msg)
	{
		if (msg instanceof Object) msg = JSON.stringify(msg);
		this.socket.send(msg);
	}

}


module.exports = WebSocketClient;