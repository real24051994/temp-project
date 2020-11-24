const app_id = process.env.VUE_APP_CRISP_ID;

export default class Crisp {
	constructor() {
		this.data = null
	}
	init({ token = undefined, data = null }) {
		if (app_id) {
			this.data = data;
			window.CRISP_WEBSITE_ID = app_id
			window.CRISP_TOKEN_ID = token
			window.CRISP_READY_TRIGGER = () => {
				try {
					this.checkSession()
					this.update()
				} catch (error) {
				}
			};
			if (typeof window.$crisp == "undefined") {
				this.loadScript(() => {})
			}
		}
	}
	loadScript(callback) {
		const script = document.createElement("script")
		script.async = true
		script.src = "https://client.crisp.chat/l.js"
		document.getElementsByTagName("head")[0].appendChild(script)
		script.onload = callback
	}
	reset() {
		this.data = null
		window.CRISP_TOKEN_ID = undefined
		this.push(["do", "session:reset"])
	}
	checkSession(){
		var session = localStorage.getItem('socialhead-crisp-session-email')
		if( session ){
			if( window.CRISP_TOKEN_ID ){
				localStorage.setItem('socialhead-crisp-session-email' , this.data.hasOwnProperty('email') ? this.data.email : '')
			}else{
				localStorage.removeItem('socialhead-crisp-session-email')
				this.reset()
			}
		}else{
			if( window.CRISP_TOKEN_ID ){
				localStorage.setItem('socialhead-crisp-session-email' , this.data.hasOwnProperty('email') ? this.data.email : '')
			} 
		}
	}
	update() {
		if (this.data) {
			let { email = '' , name  = '' } = this.data 
			this.push(["set", "user:nickname", [name]])
			this.push(["set", "user:email", [email]])
			this.push(["set", "session:data", [[ `install_social_${process.env.VUE_APP_NAME}` , true ]]])
		}
	}
	push(payload) {
		if (typeof window.$crisp != "undefined" && typeof window.$crisp.push == "function") {
			window.$crisp.push(payload)
		}
	}
	show() {
		this.push(["do", "chat:show"])
	}
	hide() {
		this.push(["do", "chat:hide"])
	}
	toggle() {
		this.push(["do", "chat:toggle"])
	}
}