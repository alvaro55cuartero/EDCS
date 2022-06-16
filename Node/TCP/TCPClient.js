const net = require("net");
const crypto = require("crypto")
const fs = require("fs");

class TCPClient {

	constructor(contact, remoteContact, socket, cb, err) {
		this.contact = contact;
		this.remoteContact = remoteContact;


		if (!socket)
		{
			this.socket = net.connect({host:remoteContact.host, port:remoteContact.port});
			this.type = "client";

		} else {
			this.socket = socket;
			this.type = "server";
		}


		this.socket.on("connect", this.onConnection);
		this.socket.on("error", this.onError);
		this.socket.on("data", this.onData);


		console.log(this.contact)
		let privateKeyPath = `./Peers/${this.contact.user}/private.pem`;
		this.privateKey = fs.readFileSync(privateKeyPath, { encoding: 'utf-8' });

		this.onReadyExt = cb;
		this.onConnectExt = ()=> {};
		this.onDataExt;
		this.onCloseExt = err;


	}


	onConnection = () => {
		console.log(`Connection Established! host: ${this.remoteContact.host}, port: ${this.remoteContact.port}`);
		
		if (this.type == "client")
			this.connect("connection");
	}
	
	connect = type => {
		let publicKeyPath = `./Peers/${this.contact.user}/public.pem`;
		let publicKey = fs.readFileSync(publicKeyPath, { encoding: 'utf-8' })
		this.sendNoEncryption({cmd:type, contact:this.contact, publicKey: publicKey})
	}


	onError = err => {
		this.onCloseExt(err)
		console.log(`Connection Error! host: ${this.remoteContact.host}, port: ${this.remoteContact.port}, ${err}`);
	}


	send = msg => {
		if (msg instanceof Object) msg = JSON.stringify(msg);

		let criptext = this.encrypt(msg)

		let data = {
			cmd: "msg",
			msg: criptext,
			user: this.user
		}

		this.socket.write(JSON.stringify(data));
	}

	sendNoEncryption = msg => {
		if (msg instanceof Object) msg = JSON.stringify(msg);
		this.socket.write(msg);
	}



	on = (type, cb) => {
		switch(type)
		{
			case "ready":
				this.onReadyExt = cb;
			break;
			case "connect":
				this.onConnectExt = cb;
			break;
			case "data":
				this.onDataExt = cb;
			break;
			case "close":
				this.onCloseExt = cb;
			break;
				
		}
	}

	onData = data => {
		data = JSON.parse(data.toString());
		switch(data.cmd) {
			case "connection":
				this.remotePublicKey = data.publicKey;
				this.remoteContact = data.contact;
				this.connect("connectionRes");

				this.onConnectExt();
			break;

			case "connectionRes":
				this.remotePublicKey = data.publicKey;
				this.remoteContact = data.contact;
				this.onConnectExt();
			break;

			case "msg":
				data.msg = this.decrypt(Buffer.from(data.msg));
				this.onDataExt(data);
			break;
		}
	}


	encrypt = msg =>
	{
		let options = {
			key: this.remotePublicKey,
			padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
			oaepHash: 'sha256',
		};

		return crypto.publicEncrypt(options, Buffer.from(msg))
	}

	decrypt = msg => {
		let options = { 
			key: this.privateKey, 
			padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, 
			oaepHash: 'sha256' 
		};

		return crypto.privateDecrypt(options, Buffer.from(msg));
	}


}

module.exports = TCPClient;

