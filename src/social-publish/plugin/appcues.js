export default class Appcues {
	constructor(options) {	
		let { app_id  } = options 
		this.app_id = app_id
		
	}
	init(callback){
		this.loadScript(()=>{
			if( typeof callback == 'function' ){
				callback()
			}
			this.onInit()
		})
	}
	onInit() {
		
	}
	onChange(){
		if( typeof window.Appcues == 'object' ){
			console.log('Appcues.page');
			window.Appcues.page()
		}
	}
	loadScript(callback) {
		const script = document.createElement('script')
		script.async = true
		script.src = `http://fast.appcues.com/${this.app_id}.js`
		const firstScript = document.getElementsByTagName('script')[0]
		firstScript.parentNode.insertBefore(script, firstScript)
		script.onload = callback
	}
}