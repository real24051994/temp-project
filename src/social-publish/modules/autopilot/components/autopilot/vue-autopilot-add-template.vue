<template>
	<div class="vue-autopilot-add-template">
		<a-dropdown transitionName="none" maskTransitionName="none"  :disabled="disabled"  :trigger="['click']"  class="vue-autopilot-add-template-trigger" v-model="visible" placement="bottomCenter" overlayClassName="z-index-500">
			<slot name="btn-trigger">
				<a-button class="btn-trigger" id="btn-add-template-autopilot" >
					{{ $t('autopilot.form.label.template') }}
				</a-button>
			</slot>
			<a-menu slot="overlay" class="vue-autopilot-add-template-menu" >
				<a-menu-item key="0" class="vue-autopilot-add-template-menu-header">
					<h4>{{ $t('autopilot.form.content.template_content') }}</h4>
				</a-menu-item>
				<a-menu-item key="1" class="vue-autopilot-add-template-menu-body" >
					<div class="vue-autopilot-add-template-menu-wrap" v-if="is_changing" key="change"></div>
					<div class="vue-autopilot-add-template-menu-wrap" v-else key="list">
						<vue-simple class="vue-autopilot-add-template-menu-container" >
							<template v-if="templates.length">
								<div class="vue-autopilot-add-template-menu-item" v-for="(item,index) in templates" :key="`item_index_${index}`" @click="onClick(item)">
									<div class="vue-autopilot-add-template-menu-item-wrap">
										<div v-html="item.html" class="vue-autopilot-add-template-menu-item-content"></div>
									</div>
								</div>
								<div v-if="!priority && plan.id == 'free'" class="vue-autopilot-add-template-menu-item-more">
									<span class="text-primary">+5 available Content Templates</span> are waiting for you 
									<div class="vue-autopilot-add-template-menu-item-popover" >	
										<div class="vue-autopilot-add-template-menu-item-popover-btn">
											<a-button type="primary" block @click="onClickPopover" class="btn-track-event btn-event-pricing" data-position="autopilot-popover" data-status="start-trial">
												Upgrade for Free
											</a-button>
										</div>
										<div class="vue-autopilot-add-template-menu-item-popover-more">
											<a @click="onClickPopover">
												View other premium functions
											</a>
										</div>
									</div>
								</div>
							</template>
							<template v-else>
								<div class="vue-autopilot-add-template-menu-item">
									{{ $t('autopilot.form.state.empty_template') }}
								</div>
							</template>
						</vue-simple>
					</div>
				</a-menu-item>
			</a-menu>
		</a-dropdown>
	</div>
</template>
<script>
import VueAutopilotContenteditable from './vue-autopilot-contenteditable'
import config from '@publish/modules/autopilot/config'
import { mapGetters } from 'vuex'
export default {
	name : 'VueAutipilotAddTemplate',
	components:{
		VueAutopilotContenteditable
	},
	props:{
		data :{
			type : Array
		},
		type:{
			type : String
		},
		disabled :{
			type : Boolean,
			default : false,
		}
	},
	data(){
		return {
			visible : false,
			is_changing : false,
			variants : [...config.product_variants,...config.discount_tags,...config.rate_tags],
		}
	},
	computed:{
		...mapGetters({
			'priority' : 'pricing/getPriorityUser',
			'plan'  : 'pricing/getUserPlan'
		}),
		templates(){
			var templates = JSON.parse(JSON.stringify(this.data))
			return templates.filter((item)=>{
				return item.social_type == this.type 
			}).map((item)=>{
				item['html'] = this.convertTexttoHTML(item.content)
				return item
			})
		}
	},
	methods:{
		onClick(item){
			this.$emit('on-select' , item)
			this.visible = false
		},
		onClickPopover(){
			this.redirect({
				name : 'Pricing'
			})
		},
		getContent(newcontent) {
			var arr = newcontent.replace(/ /g, '\u00a0').split('\n') 
			var html = ''
			arr.forEach(item => {
				html += item ? '<div>'+item+'</div>' : '<div><br></div>'
			});
			return   html.replace(/{{(.*?)}}/gi, (temp)=>{
				var text = temp.replace('{{','').replace('}}','')
				if( this.variants.indexOf(text) >= 0 )
					return `<b contenteditable="false">${text}</b>` 
				return temp
			})
		},
		convertTexttoHTML(text){
			text = text.replace(/ /g, '\u00a0')
			if( text.indexOf('\n') >= 0 ){
				var arr = text.split('\n')
				text = ''
				arr.forEach(item => {
					text += item ? '<div>'+item+'</div>' : '<div><br></div>'
				});
			}
			text =  text.replace(/{{(.*?)}}/gi, (temp)=>{
				var text = temp.replace('{{','').replace('}}','')
				if( this.variants.indexOf(text) >= 0 ){
					return `<b contenteditable="false">${text}</b>` 
				}
				return temp
			})
			return text
		},
	},
	watch :{
		type : function(value){
			this.is_changing = true 
			this.$nextTick(()=>{
				this.is_changing = false
			})
		}
	},
}
</script>
<style lang="scss">
	.vue-autopilot-add-template{
		display: inline-block;
		position: relative;
		
	}
	
	.vue-autopilot-add-template-menu{
		width: 500px;
		padding: 0;
		&-header{
			height: 60px;
			padding: 0 16px;
			background: #fff;
			display: flex;
			align-items: center;
			&:hover,&:focus{
				background: #fff;
			}
			h4{
				font-weight: 600;
				font-size: 20px;
				line-height: 24px;
				margin: 0;
			}
		}
		&-body{
			border: 1px solid $border-color;
			background: #fff;
			padding: 0;
			&:hover,&:focus{
				background: #fff;
			}
		}
		&-item{
			padding: 0 16px;
			margin-bottom: 16px;
			&:first-child{
				margin-top: 16px;
			}
			&-wrap{
				border: 1px solid $border-color;
				border-radius: 4px;
				overflow: hidden;
				cursor: pointer;
				transition: all 0.2s ease;
				background: #fff;
				&:hover{
					background: #f2f2f2;
				}
				.note-editing-area{
					pointer-events: none;
				}
			}
			&-content{
				min-height: 100px;
				padding: 8px;
				user-select: text;
				white-space: pre-wrap;
				overflow-wrap: break-word;
				font-size: 13px;
				b{
					display: inline-block;
					padding: 0 .4rem;
					margin-bottom: 4px;
					border-radius: 5px;
					font-size: .8rem;
					font-weight: 600;
					background: rgba(0,0,0,.1);
					color: rgba(0,0,0,.8);
					user-select: none;
					pointer-events: none;
				}
			}
			&-more{
				padding: 0 24px 24px 24px;
				text-align: center;
			}
			&-popover{
				&-title{
					font-weight: normal;
					font-size: 14px;
					line-height: 22px;
					margin-bottom: 8px;
				}
				&-btn{
					margin-bottom: 8px;
					.ant-btn{
						max-width: 200px;
					}
				}
				&-more{
					a{
						font-weight: normal;
						font-size: 14px;
						line-height: 17px;
						color: #828282;
						&:hover{
							color: $primary-color;
						}
					}
				}
			}
		}
		&-wrap{
			height: 300px;
			overflow: hidden;
		}
		&-container{
			height: 100%;
			overflow: hidden auto;
			.note-editor.note-frame .note-editing-area .note-editable{
				background: transparent;
			}
		}
		
	}
</style>