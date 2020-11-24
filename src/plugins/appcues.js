export default class Appcues {
	constructor() {	
		this.app_id = null 
		this.appcues = null 
	}
	init(payload, callback){
		let { app_id = '' } = payload 
		this.app_id = app_id
		this.loadScript(()=>{
			if( typeof window.Appcues != 'undefined' ){
				this.appcues = window.Appcues
			}
			
			if( typeof callback == 'function'){
				callback()
			}
		})
	}
	loadScript(callback) {
		const script = document.createElement('script')
		script.async = true
		script.src = `https://fast.appcues.com/${this.app_id}.js`
		const firstScript = document.getElementsByTagName('script')[0]
		firstScript.parentNode.insertBefore(script, firstScript)
		script.onload = callback
	}
	update(){
		if( this.appcues ){
			console.log('update appcues');
			this.appcues.page()
		}
	}
}