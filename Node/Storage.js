const fs = require('fs'); 
const fsPromises = fs.promises;


class Storage {
	
	
	constructor(user) {
		this.user = user;
		
		let path = `./Peers/${this.user}`;
		if(!fs.existsSync(path))
			fs.mkdirSync(path);
	

		path = `./Peers/${this.user}/contacts.js`;
		if(!fs.existsSync(path))
			fs.writeFileSync(path, "[]");
	}

	getContacts = () => {
		let path = `./Peers/${this.user}/contacts.js`;
		let json  = JSON.parse(fs.readFileSync(path).toString());
		return json;
	}

	addContact = contact => {
		let path = `./Peers/${this.user}/contacts.js`;
		let json  = JSON.parse(fs.readFileSync(path).toString());
		json.push(contact);
		console.log(json);

		fs.writeFileSync(path, JSON.stringify(json, null, '\t'));
		return json;
	}

	assureContact = contact => {
		let path = `./Peers/${this.user}/contacts.js`;
		let json  = JSON.parse(fs.readFileSync(path).toString());
		
		for (let conta of json)
		{
			if (conta.user == contact.user) return json;
		}

		json.push(contact);
		fs.writeFileSync(path, JSON.stringify(json, null, '\t'));

		return json;
	}

	hasContact(user) {
		let path = `./Peers/${this.user}/contacts.js`;
		let json  = JSON.parse(fs.readFileSync(path).toString());


		for (contact of json)
		{
			if (contact.user == user) return true;
		}

		return false ;

	}

	getHistory = async user => {
		return await this.getData(user);
	}

	setUser = (user) => this.user = user;

	async storeMsg(user, msg) {

		let dataJson = await this.getData(user)
		dataJson.push(msg);
		let path = `./Peers/${this.user}/${user}.json`;
		fs.writeFileSync(path, JSON.stringify(dataJson, null, '\t'));
		return dataJson;
	}


	getData = async (user) => {
		let path = `./Peers/${this.user}/${user}.json`;
		if (!fs.existsSync(path)) {
			fs.writeFileSync(path, "[]");
			return [];
		}

		let dataJson  = await fsPromises.readFile(path);
		dataJson = dataJson.toString();
		if(dataJson == "") dataJson = "[]";
		dataJson = JSON.parse(dataJson);
		return dataJson;
	}
}

module.exports = Storage;
