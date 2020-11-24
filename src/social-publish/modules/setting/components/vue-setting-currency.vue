<template>
	<div class="vue-setting-time">
		<h3 class="vue-setting-title">
			{{ $t('setting.currency_setting.title') }}
		</h3>
		<div class="row m-t-24">
			<div class="col col-6 p-r-34">
				<div class="row m-0">
					<div class="col vue-setting-col vue-setting-col-label">
						<label for="" class="vue-setting-label">
							{{ $t('setting.currency_setting.currency_format') }}
						</label>
					</div>
					<div class="col vue-setting-col vue-setting-col-content">
						<a-select  v-model="currency" >
							<a-select-option v-for="(item,index) in data" :key="index" :value="item.id">
								{{ $t(`setting.currency_setting.option.${item.text}`) }}
							</a-select-option>
						</a-select>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
export default {
	name : 'SettingCurrency',
	props:{
		value :{
			type : [Number,String],
			required : true
		},
	},
	data(){
		return {
			data : [
				{
					id : 0,
					text : "default"
				},
				{
					id : 1,
					text : "symbol"
				},
				{
					id : 2,
					text : "code"
				},
				{
					id : 3,
					text : 'mix_1'
				},
				{
					id : 4,
					text : 'mix_2'
				}
			]
		}
	},
	computed:{
		currency : {
			get(){
				return this.value 
			},
			set(value){
				this.$emit('input', value)
			}
		}
	},
	methods:{
	}
}
</script>