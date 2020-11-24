<template>
	<a-modal transitionName="none" maskTransitionName="none" class="modal-calendar-pick-time" width="380px" :title="false" :visible="form.visible" :confirm-loading="form.is_loading" @ok="onApply" @cancel="onCancel" okText="Apply">
		<div class="ant-modal-header">
			<div class="ant-modal-title m-b-12">
				Select time
			</div>
			<div class="m-b-6"><label>Day</label></div>
			<a-input :placeholder="form.date"  :disabled="true" />
		</div>
		<div class="modal-body-pick-time">
			<div class="m-b-6"><label>Time {{ time_setting.timezone | timezone }}</label></div>
			<vue-timepicker v-model="form.time" :time-format="time_setting.time_format" :timezone="time_setting.timezone" ></vue-timepicker>
		</div>
	</a-modal>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
	name : 'ModalPickTime',
	props:{
		value :{
			type : Object
		}
	},
	data(){
		return {

		}
	},
	computed:{
		...mapGetters({
			time_setting : 'auth/getTimeSetting',
		}),
		form :{
			get(){
				return this.value
			},
			set(value){
				this.$emit('input' , value )
			}
		}
	},
	methods :{
		onApply(){
			this.$emit('apply')
		},
		onCancel(){
			this.$emit('cancel')
		}
	}
}
</script>
<style lang="scss">
	.modal-calendar-pick-time{
		label{
			font-weight: 600;
		}
		.modal-body-pick-time{
			padding: 20px 16px 0 16px;
			.time-picker{
				padding: 0;
			}
			
		}
	}
	
</style>