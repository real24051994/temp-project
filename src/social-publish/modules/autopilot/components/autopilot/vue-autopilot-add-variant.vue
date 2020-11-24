<template>
	<div class="vue-autopilot-add-variant">
		<a-dropdown placement="bottomRight" transitionName="none" maskTransitionName="none" :trigger="['click']"  class="vue-autopilot-add-variant-trigger" v-model="visible" >
			<slot name="btn-trigger">
				<a-button class="btn-trigger" id="btn-add-variant-autopilot">
					{/}
				</a-button>
			</slot>
			<a-menu slot="overlay" class="vue-autopilot-add-variant-menu" >
				<a-menu-item class="vue-autopilot-add-variant-menu-item" v-for="(item,index) in variants" :key="`item_index_${index}`" @click="onClick(item)">
					{{ item }}
				</a-menu-item>
			</a-menu>
		</a-dropdown>
	</div>
</template>
<script>
export default {
	name : 'VueAutipilotAddVariant',
	props :{
		variants :{
			type : Array,
			default : ()=>[]
		}
	},
	data(){
		return {
			visible : false,
		}
	},
	methods:{
		onClick(item){
			this.$emit('on-select' , item)
			this.visible = false
		}
	}
}
</script>
<style lang="scss">
	.vue-autopilot-add-variant{
		display: inline-block;
		position: relative;
		.btn-trigger{
			color: $primary-color;
			background-color: $light-blue2;
			border-color: $light-blue2;
			padding: 0;
			width: 32px;
		}
		&-menu{
			.ant-dropdown-menu{
				padding: 0;
				border: 1px solid $border-color;
				&-item{
					padding: 8px 16px;
					width: 200px;
					font-size: 13px;
					line-height: 18px;
					&:hover{
						background: #F3F3F3;
					}
				}
			}
		}
	}
</style>