import VuePostModal from '../components/vue-modal-plugin.vue'
const Modal = {
    install(Vue, options) {
        this.EventBus = new Vue()
        Vue.component('module-post-modals', VuePostModal)
        Vue.prototype.$POST_Modals = {
			showModalPost : (options = {})=>{
				Modal.EventBus.$emit('showModalPost', options)
			},
			hideModalPost :()=>{
				Modal.EventBus.$emit('hideModalPost')
			},
			showModalQueue : (options = {})=>{
				Modal.EventBus.$emit('showModalQueue', options)
			},
			hideModalQueue :()=>{
				Modal.EventBus.$emit('hideModalQueue')
			}
		}
    }
}

export default Modal