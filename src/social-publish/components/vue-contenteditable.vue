<template>
	<div class="vue-tiptap">
		<editor-content class="vue-tiptap-editor" :editor="editor" />
	</div>
</template>
<script>
import ShortCode from "@publish/assets/tiptap/ShortCode";
import EnterHandler from "@publish/assets/tiptap/EnterHandler";
import { Editor, EditorContent, EditorMenuBar } from "tiptap";
import { Placeholder } from "tiptap-extensions";
import { replaceText } from 'tiptap-commands'
const sanitizeHtml = require('sanitize-html')
export default {
	components: {
		EditorContent,
		EditorMenuBar
	},

	props: {
		value: {
			type: [String, Object],
			required: true,
		},

		readOnly: {
			type: Boolean,
			default: false,
		},
		value : {
			type : String,
			required: true
		},
		onPaste : {
			type : Function,
			default : ()=>{
				return true 
			}
		},
		tags : {
			type : Array,
			default :  ()=>{
				return []
			}
		},
		placeholder : {
			type : String,
			default : 'Type something...'
		},
		allowNewLine :{
			type : Boolean,
			default : true,
		}
	},

	data() {
		return {
			editor: null,
			timeout : null 
		};
	},
	methods: {
		convertJsonToText(json){
			var result = ''
			if( json && json.hasOwnProperty('content')){
				json.content.forEach( row => {
					if( row.type == 'paragraph' && row.hasOwnProperty('content')){
						row.content.forEach((item)=>{
							if( item.type == 'text'){
								result += item.text
							}else if( item.type == 'shortcode'){
								result += '{{' + item.attrs.shortcode + '}}' 
							}
						})
					}
					result += '\n'
				});
			}
			return result 
		},
		convertTexttoHTML(text){
			var paragraphs,
				html = '',
				p;

			if (!text) {
				return '';
			}
			paragraphs = text.split(/[\r\n]+/g);
			if (paragraphs.length > 1) {
				for (p = 0; p < paragraphs.length; p += 1) {
					if (paragraphs[p] !== '') {
						html += '<p>' + this.htmlEntities(paragraphs[p]) + '</p>';
					}
				}
			} else {
				html = this.htmlEntities(paragraphs[0]);
			}
			var final =   html.replace(/{{(.*?)}}/gi, (temp)=>{
				var text = temp.replace('{{','').replace('}}','')
				if( this.tags.indexOf(text) >= 0 ){
					return `<spbshortcode shortcode="${text}" contenteditable="false">${text}</spbshortcode>`
				}
				return temp
			})
			return final
		},
		htmlEntities(str) {
            return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
		},
		onUpdate() {
			if( this.timeout ){
				clearTimeout(this.timeout)
			}
			this.timeout = setTimeout(() => {
				this.$emit('input', this.convertJsonToText(this.editor.getJSON()))
			}, 150);
		},
		addText(text){
			this.editor.view.dispatch(this.editor.state.tr.insertText(text));
		},
		addProductHashtag(payload){
			this.editor.commands.shortcode({ shortcode : payload })
			this.editor.view.dispatch(this.editor.state.tr.insertText(' '));
		},
		addShortCode(payload){
			this.editor.commands.shortcode({ shortcode : payload })
		},
		addProductTemplate(payload){
			var text = this.value  ? this.value + '\n' + payload  : this.value + payload
			var html = this.convertTexttoHTML(text)
			this.editor.setContent(html ,true)
		},
		addProductContent(payload){
			this.editor.setContent(this.convertTexttoHTML(this.value + payload) ,true)
		},
		addHashtag(payload){
			this.addText(payload + ' ')
		},
		addEmoji(payload){
			this.addText(payload)
		},
		removeContent(payload){
			var text = this.value 
			text = text.replace(payload , '')
			this.editor.setContent(this.convertTexttoHTML(text) ,true)
		}
	},
	created() {
		var extensions = [
			new Placeholder({
				emptyEditorClass: "is-editor-empty",
				emptyNodeClass: "is-empty",
				emptyNodeText: this.placeholder,
				showOnlyWhenEditable: true
			}),
			new ShortCode()
		]
		if( !this.allowNewLine ){
			extensions.push(new EnterHandler())
		}
		this.editor = new Editor({
			extensions : extensions , 
			content: this.convertTexttoHTML(this.value),
			onUpdate : this.onUpdate,
			editorProps: {
				transformPastedHTML: (html) => {
					return sanitizeHtml(html, {
						allowedTags: ['p', 'spbshortcode'],
						allowedAttributes: {
							'spbshortcode': ['shortcode'],
						},
					})
				},
				handlePaste : (EditorView , event)=>{
					if( !this.onPaste(event.clipboardData.getData('text/plain')) ){
						return true 
					}
				}
			},
		});

		if (this.read_only) {
			this.editor.setOptions({
				editable: false
			});
		}
	},
	beforeDestroy() {
		this.editor.destroy();
	},

	
};
</script>
<style lang="scss">
	.vue-tiptap{
		
		&-editor{
			.ProseMirror{
				&:focus{
					outline: none;
				}
				p{
					margin: 0 0 3px 0;
				}
				spbshortcode{
					color: $text;
					padding: 3px 6px;
					background-color: #ebebeb;
					border-radius: 4px;
					font-weight: 600;
					display: inline;
				}
			}
		}
	}
</style>