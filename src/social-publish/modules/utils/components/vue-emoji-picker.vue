<template>
	<div class="vue-emoji-picker">
		<a-dropdown  transitionName="none" maskTransitionName="none" :trigger="['click']" placement="bottomCenter" class="vue-emoji-picker-trigger" v-model="visible" :overlayClassName="overlayClassName">
			<slot name="btn-trigger">
				<a-button class="btn-trigger">
					<sh-icon :icon="['far','smile']" />
				</a-button>
			</slot>
			<a-menu slot="overlay" class="vue-emoji-picker-menu">
				<a-menu-item key="0" class="vue-emoji-picker-item">
					<vue-emoji @on-select="onSelectEmoji"  />
				</a-menu-item>
			</a-menu>
		</a-dropdown>
	</div>
</template>
<script>
import VueEmoji from '@/assets/vendor/emoji-picker'
export default {
	name : 'VueEmojiPicker',
	components:{
		VueEmoji
	},
	props:{
		onSelectEmoji :{
			type : Function,
			defualt : ()=>{}
		},
		overlayClassName :{
			type : String,
			default : ''
		}
	},
	data(){
		return {
			visible : false
		}
	},
}
</script>
<style lang="scss">
	.vue-emoji-picker{
		display: inline-block;
		position: relative;
		user-select: none;
		&-menu{
			&.ant-dropdown-menu{
				padding: 0;
				box-shadow: none;
				.vue-emoji-picker-item{
					padding: 0;
				}
			}
		}
	}
	
</style>