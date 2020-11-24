import VueModalConfirmDialog from './vue-confirm.vue'
const ConfirmDialog = {
    install(Vue, options) {
        this.EventBus = new Vue()
        Vue.component('vue-modal-confirm-dialog', VueModalConfirmDialog)
        Vue.prototype.$confirm = function(options){
			ConfirmDialog.EventBus.$emit('showModalConfirmDialog', options)
		}
    }
}

export default ConfirmDialog