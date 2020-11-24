<template>
	<div class="vue-autopilot-form-info">
		<div class="row">
			<div class="col col-12">
				<h3>{{ $t('autopilot.form.label.autopilot_name') }}</h3>
			</div>
			<div class="col col-12 m-t-16">
				<div class="ant-form-item-control" :class="{ 'has-error' : formstate && validate.$invalid }">
					<span class="ant-form-item-children">
						<input placeholder="Name" type="text" class="ant-input" :class="{'input-field-error-focus' : validate.$invalid }" v-model="name">
					</span>
					<transition name="fade-in" mode="out-in">
						<div class="ant-form-explain" v-if="formstate && validate.$invalid">
							<template v-if="!validate.required">
								{{ $t('autopilot.validate.require_name') }}
							</template>
						</div>
					</transition>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: 'AutopilotFormInfo',
	props:{
		value :{
			type : String,
			required : true 
		},
		validate:{
			type : Object,
			required : true,
		},
		formstate :{
			type : Boolean,
			default : false,
		},
	},
	computed:{
		name : {
			get(){
				return this.value 
			},
			set(value){
				this.$emit('input', value)
			}
		}
	}
}
</script>