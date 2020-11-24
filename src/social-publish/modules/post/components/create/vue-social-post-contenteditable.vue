<template>
	<vue-contenteditable placeholder="Type something..." class="vue-post-contenteditable" :on-paste="onPasteContent" ref="editor" v-model="text" />
</template>

<script>
export default {
	name: 'PostContenteditable',
	props: {
		placeholder: {
			type : String,
			default : ''
		},
		value: {
			type : String,
			required : true
		},
		minHeight:{
			type : String,
			default: '150px'
		},
		onPaste: {
			type : Function,
		}
	},
	data() {
		return {
			product : '',
			input: '',
			search: '',
			position : null,
			editor : null,
			is_loading : false,
			id : this.$helper.createId(),
			is_adding : false,
		};
	},
	computed:{
		text : {
			get(){
				return this.value
			},
			set(value){
				this.$emit('input',  value);
			}
		}
	},
	methods: {
		onPasteContent(text){
			return this.onPaste(text)
		},
		addContentProduct( payload ){
			if( this.product ){
				let is_modify = false
				this.$refs.editor.removeContent(this.product)
			}
			var content  = `${payload.title}\nOrder product here: ${payload.link}`
			this.product = content
			this.$refs.editor.addProductContent(content)
		},
		addHashtag(payload){
			this.$refs.editor.addHashtag(payload)
		},
		addEmoji(payload){
			this.$refs.editor.addEmoji(payload)
		},
		removeContentProduct(update = true){
			if( this.product ){
				let is_modify = false
				this.$refs.editor.removeContent(this.product)
			}
			this.product = ''
		},
	},
};
</script>

<style lang="scss">
	.vue-post-contenteditable{
		padding: 0;
		.ProseMirror{
			min-height: 140px;
		}
	}
	.position-index{
		position: absolute;
		top: 15px;
		right: 15px;
	}
	.vue-editor{
		.note-editor.note-frame{
			border: none;
		}
		.modal{
			display: none;
		}
		.note-statusbar{
			display: none;
		}
		p{
			margin: 0;
		}
	}
</style>