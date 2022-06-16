const TCPServer = require('./TCPServer');
const TCPClient = require('./TCPClient');


class TCPPeer {
	
	constructor(ip, port, user) {

		this.contact;

		this.server = new TCPServer(ip, port, user);

		this.sockets = {};

		this.server.on("connection", this.onConnection);

	}

	listen = (cb) => {		
		this.server.listen((contact)=>{
			this.contact = contact; 
			cb(this.contact); 
		});
	}

	onConnection = async (socket) => {
		await this.newSocket(socket);
	}

	newSocket = async (socket) => {

		return new Promise((res, rej) => {

			socket.on("connect", () => {
				this.sockets[socket.remoteContact.user] = {
					status:"conected",
					contact: socket.remoteContact,
					socket: socket
				};
				
				this.connectionChangeExt();
				res();
			})

			socket.on("data", data => {
				this.onData(this.user, socket.remoteContact.user, data);
			})

			socket.on("close", () => {
				let user = socket.remoteContact.user;
				if (user == "") return;

				this.sockets[user] = {
					status:"disconected", 
					contact: socket.remoteContact,
					socket: null
				};
				this.connectionChangeExt();
				res();
			})
		});
	}

	connect = async (remoteContact) => {
		let socket = new TCPClient(this.contact, remoteContact, null);
		await this.newSocket(socket);
	}

	connectArray = async (contacts) => {		
		for (let i = 0; i < contacts.length; i++) {
			await this.connect(contacts[i]);
		}
	}

	getConnections()
	{
		let connections = Object.entries(this.sockets).map(([user, connection]) => {
			return {
				user: user,
				contact: connection.contact,
				status: connection.status
			}
		})

		return connections;
	}

	getConnection = user => {
		return {
			user: user,
			contact: this.sockets[user].contact,
			status: this.sockets[user].status
		}
	}

	send(user, msg)
	{
		if (!this.sockets[user].socket) return false;

		this.sockets[user].socket.send(msg);

		return true;
	}

	on = (type, cb) =>{
 		switch(type)
 		{
 			case "data":
 				this.onData = cb;
 			break;
 			case "start":
 				this.server.on("start", cb);
 			break;
 			case "connectionChange":
 				this.connectionChangeExt = cb;
 			break;
 		}
	}
}


module.exports = TCPPeer;
