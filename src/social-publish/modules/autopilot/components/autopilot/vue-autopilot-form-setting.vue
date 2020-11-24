<template>
	<div class="vue-autopilot-form-setting">
		<div class="row">
			<div class="col col-12">
				<h3>{{ $t('autopilot.form.label.setting') }}</h3>
			</div>
			<div class="col col-12 m-t-16">
				<div class="item-form-setting m-b-16" >
					<a-switch id="vue_autopilot_stop_autopilot" v-model="form.allow_repeat" />
					<label for="vue_autopilot_stop_autopilot" class="m-l-8">{{ $t('autopilot.form.switch.allow_repeat') }}</label>
				</div>
				<div class="item-form-setting" :class="{ 'is-disabled' : !form.allow_repeat}">
					<a-switch id="vue_autopilot_use_other_image" v-model="form.allow_rotate" :disabled="!form.allow_repeat" />
					<label for="vue_autopilot_use_other_image" class="m-l-8">{{ $t('autopilot.form.switch.allow_rotate') }}</label>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name : 'VueAutopilotSetting',
	props :{
		value:{
			type : Object,
			required : true,
		},
	},
	computed:{
		form :{
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
	.vue-autopilot-form-setting{
		.item-form-setting{
			label{
				font-style: normal;
				font-weight: normal;
				font-size: 14px;
				line-height: 22px;
				color :$text;
				user-select: none;
				cursor: pointer;
			}
			&.is-disabled{
				opacity: 0.5;
			}
		}
	}
</style>