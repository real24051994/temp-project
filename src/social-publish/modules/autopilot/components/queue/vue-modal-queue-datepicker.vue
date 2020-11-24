<template>
	<div class="vue-datetimepicker-container" :class="{ 'vue-datetimepicker-invalid' : invalid}">
		<a-dropdown  transitionName="none" maskTransitionName="none" :trigger="['click']" placement="topCenter" class="vue-datetimepicker" v-model="visible" @visibleChange="visibleChange">
			<a-button class="btn-block btn-trigger" :class="{ 'is-has-date' : is_date_time }">
				<template v-if="is_date_time">
					<vue-date-format v-model="is_time" :apply-timezone="false"  />
					<span class="btn-remove-time" @click.stop.prevent="clear()"> <sh-icon :icon="['far','times']" /></span>
				</template>
				<template v-else>
					{{ $t('queue.placeholder.timepicker') }}
				</template>
			</a-button>
			<a-menu slot="overlay" class="vue-datetimepicker-menu">
				<template v-if="menu_visible">
					<a-menu-item key="0" class="vue-datetimepicker-item item-datepicker">
						<div class="vue-datetimepicker-title">
							{{ $t('queue.label.publish_time') }}
						</div>
						<a-date-picker v-model="date" :open="visible" :showToday="false"  :getCalendarContainer="()=> $refs.datepicker" />
						<div class="vue-datetimepicker-wrapper" ref="datepicker"></div>
						<div class="vue-datetimepicker-time-title">
							{{ $t('queue.label.time') }} {{ time_setting.timezone | timezone }}
						</div>
						<vue-timepicker v-model="time" :time-format="time_setting.time_format" :timezone="time_setting.timezone" ></vue-timepicker>
					</a-menu-item>
					<a-menu-item key="1" class="vue-datetimepicker-item item-action" >
						<a-button class="btn-block" type="primary" @click="handleApply">
							{{ $t('queue.btn.apply_timepicker') }}
						</a-button>
					</a-menu-item>
				</template>
			</a-menu>
		</a-dropdown>
	</div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
export default {
	name : 'VueDateTimePicker',
	props:{
		value :{
			required : true 
		},
		invalid :{
			type : Boolean,
			default : true,
		},
	},
	data(){
		return {
			visible : false,
			menu_visible: false,
			date : '',
			time : ''
		}
	},
	computed: {
		time_setting : 'auth/getTimeSetting',
	},
	methods:{
		showPicker(){
			this.visible = ! this.visible
		},
		handleApply(){
			var date = this.date.format('YYYY-MM-DD')
			this.$emit('input', date + ' ' + this.time )
			this.visible = false
		},
		visibleChange(show){
			if( show ){
				this.menu_visible = true
				var date_time = this.value ?  moment(this.value , 'YYYY-MM-DD HH:mm') : moment().tz(this.time_setting.timezone)
				this.date = moment(date_time.format('YYYY-MM-DD') , 'YYYY-MM-DD') 
				this.time = date_time.format('HH:mm')
				
			}else{
				this.date = null
				this.time = ''
				setTimeout( ()=>{
					this.menu_visible = false
				}, 500);
			}
		},
		clear(){
			this.$emit('input','')
		}
	},
	computed:{
		...mapGetters({
			time_setting : 'auth/getTimeSetting'
		}),
		is_date_time(){
			return moment(this.value , 'YYYY-MM-DD HH:mm').isValid()
		},
		is_time(){
			return this.value
		}
	},
}
</script>
<style lang="scss">
	.vue-datetimepicker{
		&-container{
			position: relative;
			display: inline-block;
			min-width: 192px;
			.btn-trigger{
				min-width: 200px;
				.btn-remove-time{
					position: absolute !important;
					right: 0px;
					bottom: 0px;
					width: 32px;
					line-height: 30px;
					text-align: center;
					display: block;
					z-index: 1;
					pointer-events: auto;
					&:hover{
						color: $danger;
					}
				}
				&.is-has-date{
					padding-right: 35px;
				}
				&.ant-dropdown-open{
					color: $primary-color;
					background-color: #fff;
					border-color: $primary-color;
				}
			}
			
			
		}
		&-dropdown{
			> div{
				position: unset !important;
				top: auto !important;
				left: auto !important;
			}
			.ant-dropdown{
				top: auto !important;
				left: 50% !important;
				margin-left: -165px;
				bottom: 100%;
				margin-bottom: 15px;
				
			}
		}
		&-wrapper{
			> div{
				position: relative !important;
				top: auto !important;
				left: auto !important;
			}
			border-bottom: 1px solid $border-color;
			
		}
		&-menu{
			width: 320px;
			// &:after{
			// 	content: '';
			// 	width: 16px;
			// 	height: 16px;
			// 	background: #fff;
			// 	position: absolute;
			// 	left: 50%;
			// 	bottom: -8px;
			// 	transform: rotate(-45deg);
			// 	border-bottom: 1px solid #eee;
    		// 	border-left: 1px solid #eee;
			// }
		}
		&-title{
			font-weight: 600;
			font-size: 20px;
			padding: 16px;
		}
		&-time-title{
			font-weight: 600;
			font-size: 14px;
			padding: 16px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		&-item{
			
			&.ant-dropdown-menu-item{
				background: transparent !important;
				padding: 0;
				cursor: default;
			}
			&.item-action{
				padding: 8px 16px;
				text-align: right;
			}
			&.item-datepicker{
				// height: 400px;
				.ant-calendar-picker{
					display: none;
				}
				.ant-calendar-picker-container{
					top: auto !important;
					left: auto !important;
					position: relative !important;
					.ant-calendar-picker-container-content{
						box-shadow: none;
						width: 100%;
						.ant-calendar-header{
							border-top: 1px solid #e8e8e8;
							border-bottom: 1px solid #e8e8e8;
						}
					}
				}
				.ant-calendar-panel{
					.ant-calendar-input-wrap{
						display: none;
					}
				}
			}
		}
		&-invalid{
			.btn-trigger{
				color: $danger !important;
				border-color: $danger !important;
			}
		}
	}
</style>