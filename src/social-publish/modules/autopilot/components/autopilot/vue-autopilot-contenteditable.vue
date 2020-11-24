<template>
	<vue-contenteditable  placeholder="Type something..." :class="{'input-field-error input-field-error-focus' : isError }" class="vue-autopilot-contenteditable" ref="editor"  v-model="text" :tags="variants" />
</template>

<script>
export default {
	name: 'AutopilotContenteditable',
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
		disabled : {
			type : Boolean,
			default : false,
		},
		isError:{
			type : Boolean,
			required : true,
		},
		variants :{
			type : Array,
			default : ()=>[]
		}
	},
	data() {
		return {
			position : null,
			is_adding: false,
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
		},
	},
	methods: {
		addProductHashtag(payload){
			this.$refs.editor.addProductHashtag(payload)
		},
		addProductTemplate(payload){
			this.$refs.editor.addProductTemplate(payload)
		},
		addHashtag(payload){
			this.$refs.editor.addHashtag(payload)
		},
		addEmoji(payload){
			this.$refs.editor.addEmoji(payload)
		},
	},
};
</script>

<style lang="scss">
	.vue-autopilot-contenteditable{
		padding: 0;
		.ProseMirror{
			min-height: 140px;
		}
	}
</style>