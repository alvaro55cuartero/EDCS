import { Router } from "./Router/ProRouter.js";
import Page from "./Page.js";





let socket = new WebSocket(`ws://${location.hostname}:${location.port}/`);
socket.addEventListener('open', event => {
	new Page(document.body, socket)
});

socket.addEventListener("error", err => { console.log(err); });
socket.addEventListener("close", err => { console.log(err); });




