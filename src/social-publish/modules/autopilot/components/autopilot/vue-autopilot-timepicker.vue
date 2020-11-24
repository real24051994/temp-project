<template>
	<div class="vue-autopilot-timepicker" >
		<a-dropdown  transitionName="none" maskTransitionName="none" class="vue-autopilot-timepicker-dropdown" :trigger="['click']"  v-model="visible" @visibleChange="visibleChange">
			<slot name="btn-trigger">
				<a-button class="btn-block btn-trigger">
					{{ $t('autopilot.form.label.time_picker') }}
				</a-button>
			</slot>
			<a-menu slot="overlay" class="vue-autopilot-timepicker-menu">
				<a-menu-item key="0" class="vue-autopilot-timepicker-item">
					<div class="vue-autopilot-timepicker-title">
						{{ $t('autopilot.form.label.time_picker_label') }}
					</div>
					<vue-timepicker :minute-step="15"  v-model="time" :time-format="time_setting.time_format" :timezone="time_setting.timezone"></vue-timepicker>
					<div class="vue-autopilot-timepicker-action">
						<a-button @click="onCancel">
							{{ $t('autopilot.form.btn.cancel_modal_pick_time') }}
						</a-button>
						<a-button class="m-l-16" type="primary" @click="handleApply">
							{{ $t('autopilot.form.btn.apply_modal_pick_time') }}
						</a-button>
					</div>
				</a-menu-item>
			</a-menu>
		</a-dropdown>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
	name : 'VueDateTimePicker',
	props:{
		value : {
			type : Array,
		}
	},
	data(){
		return {
			visible : false,
			menu_visible: false,
			minute_step : 15,
			time : '00:00'
		}
	},
	computed :{
		...mapGetters({
			time_setting : 'auth/getTimeSetting'
		}),
		data : {
			get(){
				return this.value 
			},
			set(value){
				this.$emit('input', value)
			}
		}
	},
	methods:{
		showPicker(){
			this.visible = ! this.visible
		},
		handleApply(){
			if( this.data.indexOf(this.time) == -1){
				this.data.push(this.time)
			}
			this.visible = false
		},
		visibleChange(show){
			
		},
		onCancel(){
			this.visible = false
		},
		clear(){
			this.$emit('input','')
		}
	},
	created(){

	}
}
</script>
<style lang="scss">
	.vue-autopilot-timepicker{
		display: inline-block;
		position: relative;
	}
	.vue-autopilot-timepicker-menu{
		padding: 0;
		border-radius: 4px;
		.time-picker{
			padding: 0;
			margin-bottom: 20px;
		}
		.vue-autopilot-timepicker{
			&-title{
				margin-bottom: 10px;
				font-weight: 600;
				font-size: 14px;
			}
			&-item{
				padding: 16px;
				width: 300px;
				background-color: transparent;
				&:hover{
					background-color: transparent;
				}
			}
			&-action{
				display: flex;
				align-items: center;
				justify-content: flex-end;
			}
		}
		.ant-dropdown-menu{
			padding: 0;
			border: 1px solid $border-color;
			
		}
	}
	
</style>