<template>
	<div class="vue-color-picker">
		<span class="ant-input-group-wrapper" ref="container">
			<span class="ant-input-wrapper ant-input-group">
				<a-dropdown transitionName="fade"  :getPopupContainer="trigger => trigger.parentNode" :trigger="['click']"  class="vue-color-picker-dropdown" v-model="visible" >
					<span class="ant-input-group-addon">
						<div class="vue-color-picker-preview" :style="{ backgroundColor : color }"></div>
					</span>
					<a-menu slot="overlay" class="vue-color-picker-menu" >
						<a-menu-item key="0" class="vue-color-picker-menu-item">
							<colorpicker v-model="color"></colorpicker>
						</a-menu-item>
					</a-menu>
				</a-dropdown>
				<input type="text" class="ant-input" v-model="color">
			</span>
		</span>
		
	</div>
</template>
<script>
import colorpicker from '@widget/assets/vendor/colorpicker/Index.vue'
export default {
	name : 'VueColorPicker',
	props:{
		value : {
			type : String,
			required : true
		},
		disabled :{
			type : Boolean,
			default : false,
		},
	},
	components:{
		colorpicker
	},
	data(){
		return {
			visible : false,
		}
	},
	computed:{
		color : {
			get(){
				return this.value
			},
			set(value){
				this.$emit('input', value)
			}
		}
	},
}
</script>
<style lang="scss">
	.vue-color-picker{
		display: flex;
		width: 100%;
		&-dropdown{

		}
		&-btn-trigger{
			.ant-input-group-wrapper{

			}
		}
		&-preview{
			width: 22px;
			height: 22px;
			border-radius: 50%;
			border: 1px solid #ddd;
		}
		&-menu{
			padding: 0;
			&-item{
				padding: 0;
			}
		}
	}
</style>