import { UIElement, ColumnConstraint, ScrolleablePanel, NativeElement, Textarea, Row, Input, Button } from "./GUI/ProGUI.js";

export default class Page extends UIElement {
	
	constructor(parent, socket) {
		super(parent);

		this.socket = socket;

		this.setStyle("backgroundColor", "#343a40");
		this.setStyle("display", "block");
		this.setStyle("width", "100vw");
		this.setStyle("height", "100vh");

		let row = new Row(this);
		row.setStyle("height", "100%");

		let sidePanel = this.sidePanel(row);
		let chat = this.chat(row);



	
		this.socket.addEventListener("message", this.onDataSocket);
		
		this.updatedHistory = false;

		this.user; // you
		this.currentUser; // the other person

		this.send({cmd:"getContacts"});
	}


	sidePanel = (parent) => {
		let lateral = new UIElement(parent);
		lateral.setStyle("flexBasis", "20%");
		lateral.setStyle("borderRight", "solid")

		let box1 = new UIElement(lateral);
		box1.setDisplay("block");
		box1.setStyle("height", "33vh");
		box1.setStyle("paddingTop", "10%");
		box1.setStyle("backgroundColor", "#d7e3fc")
		box1.setStyle("borderBottom", "solid")
		box1.setStyle("textAlign", "center");
		

		this.welcome = new UIElement(box1);
		this.welcome.addClass(["bungee"]);
		this.welcome.setDisplay("block");
		this.welcome.innerHTML = `Welcome Back`;
		this.welcome.setStyle("fontSize", "20px");

		this.welcomeUser = new UIElement(box1);
		this.welcomeUser.addClass(["bungee"]);
		this.welcomeUser.setDisplay("block");
		this.welcomeUser.setStyle("fontSize", "20px");

		
		let box2 = new UIElement(lateral);
		box2.setDisplay("block")
		box2.setStyle("height", "34vh");
		box2.setStyle("backgroundColor", "#c1d3fe")
		box2.setStyle("borderBottom", "solid")
		box2.setStyle("paddingTop", "5%");
		box2.setStyle("paddingLeft", "15%");
		box2.setStyle("paddingRight", "15%");


		let box2_input1_title = new UIElement(box2);
		box2_input1_title.setDisplay("block");
		box2_input1_title.addClass(["bungee"]);
		box2_input1_title.setStyle("fontSize", "20px");
		box2_input1_title.innerHTML = `IP:`;


		this.inputIP = new Input(box2);
		this.inputIP.addClass(["lores"]);


		let box2_input2_title = new UIElement(box2);
		box2_input2_title.setDisplay("block");
		box2_input2_title.addClass(["bungee"]);
		box2_input2_title.setStyle("fontSize", "20px");
		box2_input2_title.innerHTML = `port:`;


		this.inputPort = new Input(box2);
		this.inputPort.addClass(["lores"]);

		let button = new Button(box2, "New Contact", ()=>{
			this.send({cmd:"addContact", host: this.inputIP.getValue(), port: this.inputPort.getValue()})
		});
		button.addClass(["lores"]);
		button.setStyle("width", "100%");
		button.setStyle("marginTop", "20px");
		button.setStyle("height", "40px");


		let box3 = new UIElement(lateral);
		box3.setDisplay("block")
		box3.setStyle("height", "33vh");
		box3.setStyle("backgroundColor", "#d7e3fc")
		box3.setStyle("paddingTop", "5%");


		let box3_title = new UIElement(box3);
		box3_title.setDisplay("Block")
		box3_title.addClass(["bungee"]);
		box3_title.setStyle("paddingLeft", "15%");
		box3_title.setStyle("paddingRight", "15%");
		box3_title.setStyle("fontSize", "20px");
		box3_title.setStyle("height", "20%");
		box3_title.innerHTML = `Contacts`;


		let list = this.list(box3);
	}

	list = (parent) => {
		this.list = new ScrolleablePanel(parent);
		this.list.setStyle("height","80%");
		this.list.setStyle("paddingLeft", "5%");
		this.list.setStyle("paddingRight", "5%");
	}


	chat = (parent) =>{
		let chat_panel = new UIElement(parent);
		chat_panel.setStyle("flexBasis", "80%");
		chat_panel.setStyle("backgroundColor", "#EDF2FB");

		let chat_col = new ColumnConstraint(chat_panel, "70%");
		chat_col.setStyle("height", "100vh");

		let chat_title = new UIElement(chat_col);
		chat_title.setDisplay("block");
		chat_title.addClass(["bungee"]);
		chat_title.setStyle("fontSize", "20px");
		chat_title.setStyle("height", "10%");

		chat_title.innerHTML = "Let's Chat";

		let chatPanel = new UIElement(chat_col);
		chatPanel.setDisplay("block");
		chatPanel.setStyle("border", "solid");
		chatPanel.setStyle("height", "70%");
		chatPanel.setStyle("boxShadow", "-10px 10px black");


		this.chatTitle = new UIElement(chatPanel);
		this.chatTitle.setDisplay("block");
		this.chatTitle.setStyle("backgroundColor", "#d7e3fc");
		this.chatTitle.setStyle("height", "10%");
		this.chatTitle.setStyle("borderBottom", "solid")


		this.chat = new ScrolleablePanel(chatPanel);
		this.chat.setDisplay("block");
		this.chat.setStyle("overflow", "auto");		
		this.chat.setStyle("height", "90%");
		this.chat.setStyle("backgroundColor", "#abc4ff");
		this.chat.setStyle("paddingLeft", "5%");
		this.chat.setStyle("paddingRight", "5%");
		this.chat.setStyle("paddingBottom", "5%");


		let chat_bar = new Row(chat_col);
		chat_bar.setStyle("height", "20%");
		chat_bar.setStyle("paddingTop", "5%");


		this.inputMsg = new Textarea(chat_bar);
		this.inputMsg.setFlexBasis("87%")
		
		let padding = new UIElement(chat_bar);
		padding.setFlexBasis("3%")

		this.buttonMsg = new Button(chat_bar, "enviar", this.sendMsg);
		this.buttonMsg.setFlexBasis("10%")
		this.buttonMsg.setStyle("width", "100%")
		this.buttonMsg.setStyle("height", "70%")
		this.buttonMsg.addClass(["lores"]);

	}


	sendMsg = () => {
		if(!this.currentUser) return;

		let msg = this.inputMsg.getValue();
		this.inputMsg.setValue("");
		this.send({"cmd":"msg", msg: msg, user: this.currentUser});
	}

	onDataSocket = cmd => 
	{
		cmd = JSON.parse(cmd.data);

		switch(cmd["cmd"]) {
			case "connection":
				this.user = cmd.user;
				this.welcomeUser.innerHTML = this.user;
				break;

			case "history":
				this.conversation = cmd.history;
				this.showConversation(cmd.remoteConection);
				break;

			case "msg":
				this.conversation = cmd.history;
				this.showConversation(cmd.remoteConection);
				break;

			case "contacts":
				this.list.innerHTML = "";
				cmd.contacts.forEach(contact=>{
					this.addToList(contact);
					if (this.currentUser == contact.user)
						this.updateState(contact.status)
				})

				break;
		}
	}

	addToList(data) {
		let button = new Button(this.list, "", ()=>{
			this.currentUser = data.user;
			this.send({"cmd":"history", user: data.user})
		});
		button.setStyle("width", "100%");
		button.setStyle("height", "50px");
		button.setStyle("marginTop", "20px");
		button.addClass(["lores"]);


		let row = new Row(button);
		let name = new UIElement(row, data.user)
		name.setStyle("flexBasis", "90%")

		let img = new NativeElement(row, "img");
		if (data.status == "conected")
			img.element.src = "./conected.svg";
		else 
			img.element.src = "./disconected.svg";

		img.style.flexBasis = "5%";

	}

	showConversation = (connection) => {
		if (this.currentUser != connection.contact.user) return;
		
		this.chatTitle.innerHTML = "";
		let row = new Row(this.chatTitle);
		row.setStyle("paddingTop", "1.3%")
		row.setStyle("marginLeft", "5%");

		this.imgState = new NativeElement(row, "img");
		this.imgState.style.flexBasis = "2%";
		this.updateState(connection.status);

		let name = new UIElement(row, connection.contact.user);
		name.setStyle("flexBasis", "50%");
		name.addClass(["lores"])

		this.chat.innerHTML = "";
		this.conversation.forEach(msg => {
			this.addMessage(msg.user, msg.msg);
		})
		this.chat.scrollTop = this.chat.scrollHeight - this.chat.clientHeight;
	}

	updateState = status => {

		if(!this.imgState) return;
		if (status == "conected")
			this.imgState.element.src = "./conected.svg";
		else 
			this.imgState.element.src = "./disconected.svg";

	}

	addMessage(user, msg) {

		let block = new Row(this.chat);

		let element = new UIElement(block);

		element.addClass(["lores"])

		if (user == this.user)
			element.addClass(["right"])
		else
			element.addClass(["left"])

		
		element.setStyle("maxWidth", "500px");
		element.setDisplay("inline-block");
		element.setStyle("backgroundColor", "#EDF2FB");
		element.setStyle("padding", "10px");
		element.setStyle("marginTop", "10px");
		
		let name = new UIElement(element, user + ":");
		name.setDisplay("block");
		name.setStyle("fontSize", "15px");
		name.setStyle("fontWeight", "bold");

		let text = new NativeElement(element, "pre");
		text.element.className = "lores";
		text.setStyle("whiteSpace","pre-wrap");
		text.element.innerHTML = msg;

	}


	newConnection = () => {
		let ip = this.inputIP.getValue();
		let port = this.inputPort.getValue();

		this.send({"cmd":"addContact", "host":ip, "port":port})
	}

	send(data) {
		if (data instanceof Object) data = JSON.stringify(data);
		this.socket.send(data);
	}
}

customElements.define("chat-page", Page);