<template>
	<div class="vue-setting-time">
		<h3 class="vue-setting-title">
			{{ $t('setting.time_setting.title') }}
		</h3>
		<div class="row m-t-24">
			<div class="col col-6 p-r-34">
				<div class="row m-0">
					<div class="col vue-setting-col vue-setting-col-label">
						<label for="" class="vue-setting-label">
							{{ $t('setting.time_setting.timezone') }}
						</label>
					</div>
					<div class="col vue-setting-col vue-setting-col-content">
						<a-select  v-model="formdata.timezone" :filterOption="filterOption" showSearch placeholder="Search..."  optionFilterProp="children">
							<a-select-option v-for="(item,index) in timezones" :key="index" :value="item.id">{{ item.text }}</a-select-option>
						</a-select>
					</div>
				</div>
			</div>
			<div class="col col-12">
				<div class="row m-0">
					<div class="col vue-setting-col vue-setting-col-label"></div>
					<div class="col vue-setting-col vue-setting-col-content">
						<hr class="m-t-22 m-b-0">
					</div>
				</div>
			</div>
		</div>
		<div class="row m-t-24">
			<div class="col col-6 p-r-34">
				<div class="row m-0">
					<div class="col vue-setting-col vue-setting-col-label">
						<label for="" class="vue-setting-label">
							{{ $t('setting.time_setting.time_format') }}
						</label>
					</div>
					<div class="col vue-setting-col vue-setting-col-content">
						<a-select v-model="formdata.time_format" >
							<a-select-option value="12">12h</a-select-option>
							<a-select-option value="24">24h</a-select-option>
						</a-select>
					</div>
				</div>
			</div>
			<div class="col col-6 p-l-34">
				<div class="row m-0">
					<div class="col vue-setting-col vue-setting-col-label">
						<label for="" class="vue-setting-label">
							{{ $t('setting.time_setting.date_format') }}
						</label>
					</div>
					<div class="col vue-setting-col vue-setting-col-content">
						<a-select v-model="formdata.date_format" >
							<a-select-option v-for="item in date_format" :key="item" :value="item">{{setDate(item)}}</a-select-option>
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
	name : 'SettingTime',
	props:{
		value :{
			type : Object,
			required : true
		},
		disabled : {
			type : Boolean,
			default : false,
		}
	},
	data(){
		return {
			date_format : [
				'YYYY-MM-DD',
				'DD-MMM-YY',
				'MM-DD-YYYY',
				'MM/DD/YY',
				'MM/DD/YYYY',
				'MMM DD, YYYY',
				'DD/MM/YYYY',
				'DD-MM-YYYY',
			]
		}
	},
	computed:{
		...mapState({
			timezones : 'timezones'
		}),
		formdata : {
			get(){
				return this.value 
			},
			set(value){
				this.$emit('input', value)
			}
		}
	},
	methods:{
		filterOption(input, option){
			return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
		},
		setDate(format){
			return moment().format(format)
		},
		test(){
			var temp = {}
			$('#shop_timezone').find('option').each((index,item)=>{
				var id = $(item).val()
				temp[id] = item.text
			})
		}
	}
}
</script>