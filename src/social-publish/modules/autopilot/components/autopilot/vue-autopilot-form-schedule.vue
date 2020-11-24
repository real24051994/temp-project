<template>
	<div class="vue-autopilot-form-schedule" :class="{'input-field-error' : validateTime.$invalid || validateDate.$invalid}">
		<div class="row">
			<div class="col col-12">
				<div class="d-inline-block">
					<h3>{{ $t('autopilot.form.label.scheduled') }}</h3>
				</div>
			</div>
			<div class="col col-12 m-t-16">
				<h4>{{ $t('autopilot.form.label.schedule_timezone') }}</h4>
				<a-select  v-model="timezone_selected" :filterOption="filterOption" showSearch placeholder="Search..."  optionFilterProp="children">
					<a-select-option v-for="(item,index) in timezones" :key="index" :value="item.id">{{ item.text }}</a-select-option>
				</a-select>
			</div>
			<div class="col col-12 m-t-16">
				<h4>{{ $t('autopilot.form.label.schedule_publish_time') }}</h4>
				<div class="list-time-of-day ">
					<div v-for="(item,index) in times" :key="item" class="ant-tag">
						<span v-html="mixinFormatTime(item)"></span>
						<i class="m-l-8" @click="removeTag(index)">
							<sh-icon :icon="['fal','times']" />
						</i>
					</div>
					<vue-autopilot-timepicker v-if="times.length  < validateTime.$params.maxLength.max"  v-model="times" >
						<template slot="btn-trigger">
							<a-button >
								{{ $t('autopilot.form.btn.add_publish_time') }}
							</a-button>
						</template>
					</vue-autopilot-timepicker>
				</div>
				<transition name="fade-in" mode="out-in">
					<div v-if="validateTime.$invalid && formstate" class="has-error m-t-8">
						<div class="ant-form-explain" v-if="!validateTime.required">
							{{ $t('autopilot.validate.require_time') }}
						</div>
					</div>
				</transition>
				<transition name="fade-in" mode="out-in">
					<div class="list-time-of-day-warning" v-if="show_warning && socialType == 'facebook'">
						<a class="btn-close" @click="show_warning = false">
							<sh-icon :icon="['fal','times']" />
						</a>
						<i class="m-r-8">
							<sh-icon icon="exclamation-square" />
						</i>
						{{ $t('autopilot.form.content.facebook_time_warning') }}
						
					</div>
				</transition>
			</div>
			<div class="col col-12 m-t-16">
				<h4>Day</h4>
				<div class="list-date-of-week">
					<div class="item-date ant-radio-group ant-radio-group-outline ant-radio-group-large" >
						<label class="ant-radio-button-wrapper" v-for="item in datesOfWeek" :key="item" @click="onSelect(item)" :class="{ 'ant-radio-button-wrapper-checked' : isChecked(item)}">
							<span>{{ item }}</span>
						</label>
					</div>
				</div>
				<transition name="fade-in" mode="out-in">
					<div v-if="validateDate.$invalid && formstate" class="has-error m-t-8">
						<div class="ant-form-explain" v-if="!validateDate.required">
							{{ $t('autopilot.validate.require_date') }}
						</div>
					</div>
				</transition>
			</div>
		</div>
	</div>
</template>
<script>
import VueAutopilotTimepicker from './vue-autopilot-timepicker'
import { mapState } from 'vuex';
import mixin_time_format from '@publish/mixins/time_format'
export default {
	name: 'AutopilotFormSchedule',
	mixins : [mixin_time_format],
	components:{
		VueAutopilotTimepicker
	},
	props:{
		time :{
			type : Array,
			required: true
		},
		date :{
			type : Array,
			required: true
		},
		validateTime:{
			type : Object,
			required : true
		},
		validateDate:{
			type : Object,
			required : true
		},
		formstate:{
			type : Boolean,
			default : false,
		},
		datesOfWeek: {
			type : Array,
			default : ()=>['Mon' ,'Tue','Wed' ,'Thu' ,'Fri' ,'Sat','Sun']
		},
		socialType :{
			type : String,
		},
		timezone : {
			required : true
		},
	},
	data(){
		return{
			show_warning: false,
			show_warning_int : this.time.length >= 3 ? true : false,
		}
	},
	computed:{
		...mapState({
			timezones : 'timezones'
		}),
		timezone_selected : {
			get(){
				return this.timezone 
			},
			set(value){
				this.$emit('update:timezone', value)
			}
		},
		times:{
			get(){
				return this.time 
			},
			set(value){
				this.$emit('update:time', value)
			}
		},
		dates:{
			get(){
				return this.date 
			},
			set(value){
				value.sort((a, b)=>{
					return this.datesOfWeek.indexOf(a) - this.datesOfWeek.indexOf(b)
				})
				this.$emit('update:date', value)
			}
		}
	},
	methods:{
		filterOption(input, option){
			return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
		},
		removeTag(index){
			this.times.splice(index , 1)
		},
		isChecked(date){
			return this.dates.indexOf(date) >= 0
		},
		onSelect(item){
			var index = this.dates.indexOf(item)
			if( index == -1){
				this.dates.push(item)
			}else{
				this.dates.splice(index,1)
			}
		}
	},
	watch : {
		times : function(value){
			if( value.length >= 3 && this.show_warning == false && this.show_warning_int == false ){
				this.show_warning =  true
				this.show_warning_int =  true
			}
		}
	}
}
</script>
<style lang="scss" scoped>
	.vue-autopilot-form-schedule{
		user-select: none;
		.ant-tag{
			@include a-button;
			line-height: 32px;
			margin-bottom: 8px;
			margin-right: 8px;
			min-width: 120px;
			cursor: default;
			i{
				color: #ccc;
				cursor: pointer;
				&:hover{
					color: $text;
				}
			}
		}
		.ant-select{
			width: 280px;
		}
		.list-time-of-day{
			&-warning{
				border: 1px solid #FFBB37;
				padding: 16px;
				border-radius: 4px;
				font-weight: 600;
				font-size: 14px;
				line-height: 22px;
				color: $warning;
				position: relative;
				i{
					font-size: 20px;
				}
				.btn-close{
					position: absolute;
					right: 10px;
					top: 5px;
					color: $text;
					&:hover{
						color: $primary-color;
					}
				}
			}
		}
		.ant-btn{
			min-width: 110px;
		}
		.list-date-of-week{
			display: flex;
			
			.item-date{
				.ant-radio-button-wrapper{
					height: 64px;
					width: 64px;
					display: inline-flex;
					align-items: center;
					justify-content: center;
					font-size: 14px;
				}
			}
		}
	}
</style>