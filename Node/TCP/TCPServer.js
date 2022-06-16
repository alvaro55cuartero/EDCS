const net = require("net");
const crypto = require("crypto")
const fs = require("fs");
const TCPClient = require('./TCPClient');


class TCPServer {

	constructor(ip, port, user) {
		this.contact = {
			user: user,
			port: port,
			host: ip
		}

		this.server = net.createServer();
		this.server.on("connection", this.onConnection);
	}


	onConnection = socket => {
		this.socket = new TCPClient(this.contact, null, socket);
		this.onConnectionExt(this.socket);
	}


	on = (type, cb) => {
		switch(type)
		{
			case "start":
				this.server.on("listening", cb);
			break;
			case "connection":
				this.onConnectionExt = cb;
			break;
			case "data":
				this.onDataExt = cb;
			break;
		}
	}

	listen = (cb) => {
		this.server.listen(this.contact.port, this.contact.host, ()=> {
			this.contact.host = this.server.address().address;

			this.ensureKeys();
			let privateKeyPath = `./Peers/${this.contact.user}/private.pem`;
			this.privateKey = fs.readFileSync(privateKeyPath, { encoding: 'utf-8' });
			
			cb(this.contact);
		});
	}

	ensureKeys = () => {
		let publicKeyPath = `./Peers/${this.contact.user}/public.pem`;
		let privateKeyPath = `./Peers/${this.contact.user}/private.pem`;

		if(!fs.existsSync(publicKeyPath))
		{
			console.log("Creating keys!")
			const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
				// The standard secure default length for RSA keys is 2048 bits
				modulusLength: 2048
			})

			const exportedPublicKeyBuffer = publicKey.export({ type: 'pkcs1', format: 'pem' })
			fs.writeFileSync(publicKeyPath, exportedPublicKeyBuffer, { encoding: 'utf-8' })

			const exportedPrivateKeyBuffer = privateKey.export({ type: 'pkcs1', format: 'pem' })
			fs.writeFileSync(privateKeyPath, exportedPrivateKeyBuffer, { encoding: 'utf-8' })
			
		}
	}
}


module.exports = TCPServer;

