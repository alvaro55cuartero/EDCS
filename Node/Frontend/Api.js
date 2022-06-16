let Config = {
	baseURL: "http://localhost:3000"
}





export default class API {
	



	static getMeta = {method: 'GET', headers: { 'Content-Type': 'application/json'}};
	static postMeta = (data) => {return {method: 'POST', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify(data)}};

	static async getChat(data) {
		return await fetch(`${Config.baseURL}/API/Chat`, API.postMeta(data))
		.then(response => response.json())
	}



/*
	static async postFiles() {
		return await fetch(`${Config.baseURL}/API/files`, API.postMeta({}))
		.then(response => response.json())
	}


	static async postLogin(data) {
		return await fetch(`${Config.baseURL}/API/password`, API.postMeta(data))
		.then(response => response.json())
	}
*/

}