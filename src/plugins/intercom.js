const custom_launcher_selector = '#vue-sidebar-intercom'
export default class Intercom {
	constructor(options) {	
		let { app_id  } = options 
		this.intercom = null 
		this.ready = false 
		this.visible = false 
		this.options = {
			app_id : app_id,
			// alignment : 'left',
			// horizontal_padding: 70,
			// vertical_padding: 0,
			custom_launcher_selector: custom_launcher_selector,
		}
		
	}
	init(payload){
		if( process.env.VUE_APP_INTERCOM == '1' ){
			if( typeof window.Intercom == 'function' ){
				this.onInit(payload)
			}else{
				this.loadScript(()=>{
					this.onInit(payload)
				})
			}
		}
	}
	onInit(payload) {
		this.update(payload)
		this.triggerIntercom('onShow' , ()=>{
			this.visible = true 
			$(custom_launcher_selector).addClass('is-open-intercom')
			$(custom_launcher_selector).removeClass('is-intercom-new-message')
		})
		this.triggerIntercom('onHide' , ()=>{
			this.visible = false 
			$(custom_launcher_selector).removeClass('is-open-intercom')
		})
		
		this.triggerIntercom('onUnreadCountChange', (unreadCount)=>{
			if( unreadCount ){
				$(custom_launcher_selector).addClass('is-intercom-new-message')
			}
		});
		$(window).on('click' , (event)=>{
			if( !$(event.target).is('#intercom-container , #intercom-container * , #vue-sidebar-intercom , #vue-sidebar-intercom *') && this.visible ){
				this.triggerIntercom('hide');
			}
		})
	}

	loadScript(callback) {
		const script = document.createElement('script')
		script.async = true
		script.src = `https://widget.intercom.io/widget/${this.options.app_id}`
		const firstScript = document.getElementsByTagName('script')[0]
		firstScript.parentNode.insertBefore(script, firstScript)
		script.onload = callback
	}
	update(payload){
		this.options = Object.assign( this.options , payload )
		this.triggerIntercom('update',this.options)
	}

	show(){
		this.triggerIntercom('show');
	}

	hide(){
		this.triggerIntercom('hide');
	}

	toggle(){
		if( this.visible ) {
			this.triggerIntercom('show');
		} else {
			this.triggerIntercom('hide');
		}
	}

	destroy(){
		this.triggerIntercom('shutdown');
	}

	triggerIntercom(...args){
		if ( typeof window.Intercom == 'function' ){
			window.Intercom(...args)
		}
	}
}