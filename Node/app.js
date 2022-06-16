const TCPPeer = require('./TCP/TCPPeer');
const WebSocketServer = require('./WebSocketServer');
const express = require('express');
const app = express();
const Storage = require('./Storage.js');

const args = process.argv.slice(2);
let portWeb = Number(args[0]);
let portTCP = args[1];
let user = args[2];



app.use(express.static('Frontend'));

let contact = {}

let storage = new Storage(user);
let peer = new TCPPeer("192.168.1.20", portTCP, user);
let webSocket = new WebSocketServer(app, portWeb, user);


peer.on("connectionChange", ()=>{
	let connections = peer.getConnections();
	let contacts = storage.getContacts();
	console.log(connections)
	
	for (connection of connections)
	{
		storage.assureContact(connection.contact);
	}

	let json = {
		cmd:"contacts", 
		contacts: connections
	}

	webSocket.send(json);
})

peer.on("data", async (localUser, remoteUser, msg) => {
	let history = await storage.storeMsg(remoteUser, {user:remoteUser, msg:msg.msg.toString()});
	if (webSocket.isConnected())
	{
		let json = {
			cmd:"history", 
			history: history,
			remoteConection: peer.getConnection(remoteUser)
		}
		webSocket.send(json)
	}

})

peer.listen(async (contact)=>{
	contact = contact;
	let contacts = storage.getContacts();
	await peer.connectArray(contacts);
});








webSocket.on("addContact", async (host, port) => {
	peer.connect({host:host, port:port, user:""});
})

webSocket.on("history", async  (localUser, remoteUser)=> {

	let history = await storage.getHistory(remoteUser);
	let json = {
		cmd:"history", 
		history: history,
		remoteConection: peer.getConnection(remoteUser)
	}

	console.log(history)
	webSocket.send(json);
})

webSocket.on("getConnections", () => {
	return peer.getConnection();
})

webSocket.on("getContacts", async () => {
	let connections = peer.getConnections();
	let json = {
		cmd:"contacts", 
		contacts: connections
	}

	webSocket.send(json);
})


webSocket.on("message", async (localUser, remoteUser, msg) => {
	if (!peer.send(remoteUser, msg)) return

	let history = await storage.storeMsg(remoteUser, {user:localUser, msg:msg});


	let json = {
		cmd:"history", 
		history: history,
		remoteConection: peer.getConnection(remoteUser)
	}

	webSocket.send(json)
})




