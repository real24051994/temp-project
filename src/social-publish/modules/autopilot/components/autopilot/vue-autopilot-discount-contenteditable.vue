<template>
	<div class="vue-autopilot-discount-contenteditable">
		<vue-contenteditable v-model="text" :allowNewLine="false" :tags="tags" class="vue-autopilot-discount-contenteditable-content" ref="editor" />
		<a-dropdown transitionName="none" maskTransitionName="none" :trigger="['click']"  class="vue-autopilot-add-variant-trigger" v-model="visible" >
			<slot name="btn-trigger">
				<a-button class="vue-autopilot-discount-contenteditable-btn">
					<sh-icon :icon="['far','file-alt']" />
				</a-button>
			</slot>
			<a-menu slot="overlay" class="vue-autopilot-discount-variant-menu" >
				<a-menu-item class="vue-autopilot-discount-variant-menu-item" v-for="(item,index) in tags" :key="`item_index_${index}`" @click="onClick(item)">
					{{ item }}
				</a-menu-item>
			</a-menu>
		</a-dropdown>
	</div>
</template>
<script>
export default {
	name : 'VueDiscountContent',
	props: {
  		value : {
			type : String,
			required: true
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
		}
  	},
	data(){
		return {
			is_loading : false,
			visible : false,
		}
	},
	computed :{
		text :{
			get(){
				return this.value 
			},
			set(value){
				this.$emit('input' , value)
			}
		}
	},
	methods:{
		onClick(item){
			this.$refs.editor.addShortCode(item)
			this.visible = false
		}
	},
	mounted() {

	}
}
</script>
<style lang="scss">
	.vue-autopilot-discount-contenteditable{
		position: relative;
		border:1px solid $border-color;
		border-radius: 4px;
		.ProseMirror{
			height: 32px;
			overflow: hidden;
			padding: 6px 11px;
			line-height: 20px;
			white-space:nowrap;
			p{
				margin: 0;
			}
		}
		&-btn{
			position: absolute;
			right: 0;
			top: 0;
			z-index: 1;
			border: none;
			&:hover,&:focus{
				border: none;
			}
		}
	}
	.vue-autopilot-discount-variant-menu{
		.ant-dropdown-menu{
			padding: 0;
			border: 1px solid $border-color;
			&-item{
				padding: 8px 16px;
				width: 218px;
				&:hover{
					background: #F3F3F3;
				}
			}
		}
	}
</style>