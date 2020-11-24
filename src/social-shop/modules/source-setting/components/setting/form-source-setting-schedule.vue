<template>
	<div class="form-source-setting-item">
		<div class="form-source-setting-item-label" v-if="showLabel">
			<h4>
				Schedule Sync
			</h4>
			<p class="m-b-0">
				Set a schedule for your product source updates. This schedule will be applied for this source only. 
			</p>
		</div>
		<div class="form-source-setting-item-content">
			<div class="form-source-setting-item-card">
				<div class="form-source-setting-item-card-body p-0">
					<div class="item-source-setting-schedule">
						<div class="item-source-setting-schedule-header">
							<div class="item-source-setting-schedule-description">
								<h5>Plan your update schedule</h5>
								<p>
									Select how often you want your inventory to be updated
								</p>
							</div>
							<div class="spacer"></div>
							<div class="item-source-setting-schedule-radio">
								<a-radio-group v-model="form.schedule">
									<a-radio value="hourly">
										Hourly
									</a-radio>
									<a-radio value="daily">
										Daily
									</a-radio>
									<a-radio value="weekly">
										Weekly
									</a-radio>
								</a-radio-group>
							</div>
						</div>
						<div class="item-source-setting-schedule-body">
							<transition name="fade-in" mode="out-in">
								<div class="item-source-setting-schedule-row" v-if="form.schedule == 'hourly'"  key="hourly">
									<div class="item-source-setting-schedule-col">
										<label>
											Repeat
										</label>
										<a-select v-model="form.auto_refresh_period_hourly" placeholder="Select hour">
											<a-select-option v-for="item in hourly_times" :key="item" :value="item">
												Every {{ item }} hours
											</a-select-option>
										</a-select>
										<transition name="fade-in" mode="out-in">
											<div class="text-danger m-b-10 m-t-10" v-if="validate.auto_refresh_period_hourly.$invalid && formstate">
												This field is required 
											</div>
										</transition>
									</div>
									<div class="item-source-setting-schedule-col col-small">
										<label for="auto_refresh_period">
											From
										</label>
										<span class="ant-input-affix-wrapper">
											<span class="ant-input-prefix">
												<sh-icon :icon="['fal','clock']" />
											</span>
											<input class="ant-input ant-input-time" id="auto_refresh_period" type='time' v-model="form.auto_refresh_at">
										</span>
										<transition name="fade-in" mode="out-in">
											<div class="text-danger m-b-10 m-t-10" v-if="validate.auto_refresh_at.$invalid && formstate">
												This field is required 
											</div>
										</transition>
									</div>
									<div class="item-source-setting-schedule-col col-large">
										<label>
											Timezone
										</label>
										<a-select v-model="form.timezone" placeholder="Select timezone">
											<a-select-option  v-for="item in timezones" :key="item.id" :value="item.id">
												{{ item.text }}
											</a-select-option>
										</a-select>
										<transition name="fade-in" mode="out-in">
											<div class="text-danger m-b-10 m-t-10" v-if="validate.timezone.$invalid && formstate">
												This field is required 
											</div>
										</transition>
									</div>
								</div>
								<div class="item-source-setting-schedule-row" v-else-if="form.schedule == 'daily'"  key="daily">
									<div class="item-source-setting-schedule-col">
										<label for="auto_refresh_period">
											At
										</label>
										<span class="ant-input-affix-wrapper">
											<span class="ant-input-prefix">
												<sh-icon :icon="['fal','clock']" />
											</span>
											<input class="ant-input ant-input-time" id="auto_refresh_period" type='time' v-model="form.auto_refresh_at">
										</span>
										<transition name="fade-in" mode="out-in">
											<div class="text-danger m-b-10 m-t-10" v-if="validate.auto_refresh_at.$invalid && formstate">
												This field is required 
											</div>
										</transition>
									</div>
									<div class="item-source-setting-schedule-col col-large">
										<label>
											Timezone
										</label>
										<a-select v-model="form.timezone" placeholder="Select timezone">
											<a-select-option  v-for="item in timezones" :key="item.id" :value="item.id">
												{{ item.text }}
											</a-select-option>
										</a-select>
										<transition name="fade-in" mode="out-in">
											<div class="text-danger m-b-10 m-t-10" v-if="validate.timezone.$invalid && formstate">
												This field is required 
											</div>
										</transition>
									</div>
								</div>
								<div class="item-source-setting-schedule-row" v-else-if="form.schedule == 'weekly'"  key="weekly">
									<div class="item-source-setting-schedule-col">
										<label>
											Repeat
										</label>
										<a-select v-model="form.auto_refresh_period_weekly"  placeholder="Select day">
											<a-select-option v-for="item in weekly_times" :key="item" :value="item">
												<span class="text-capitalize">Every {{ item }}</span>
											</a-select-option>
										</a-select>
										<transition name="fade-in" mode="out-in">
											<div class="text-danger m-b-10 m-t-10" v-if="validate.auto_refresh_period_weekly.$invalid && formstate">
												This field is required 
											</div>
										</transition>
									</div>
									<div class="item-source-setting-schedule-col col-small">
										<label for="auto_refresh_period">
											At
										</label>
										<span class="ant-input-affix-wrapper">
											<span class="ant-input-prefix">
												<sh-icon :icon="['fal','clock']" />
											</span>
											<input class="ant-input ant-input-time" id="auto_refresh_period" type='time' v-model="form.auto_refresh_at">
										</span>
										<transition name="fade-in" mode="out-in">
											<div class="text-danger m-b-10 m-t-10" v-if="validate.auto_refresh_at.$invalid && formstate">
												This field is required 
											</div>
										</transition>
									</div>
									<div class="item-source-setting-schedule-col col-large">
										<label>
											Timezone
										</label>
										<a-select v-model="form.timezone" placeholder="Select timezone">
											<a-select-option  v-for="item in timezones" :key="item.id" :value="item.id">
												{{ item.text }}
											</a-select-option>
										</a-select>
										<transition name="fade-in" mode="out-in">
											<div class="text-danger m-b-10 m-t-10" v-if="validate.timezone.$invalid && formstate">
												This field is required 
											</div>
										</transition>
									</div>
								</div>
							</transition>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import VueTimePicker from './vue-time-picker'
export default {
	name : 'SourceShedule',
	components : {
		VueTimePicker
	},
	props :{
		value :{
			type : Object,
		},
		formstate :{
			type : Boolean
		},
		validate :{
			type : Object,
		},
		showLabel : {
			type : Boolean,
			default : true
		}
	},
	data(){
		return {
			visible : false,
			hourly_times: [3,4,6,8,12],
			weekly_times : ['sunday' , 'monday' , 'tuesday' , 'wednesday' , 'thursday' , 'friday' , 'saturday'],
			last_hourly : '',
			last_weekly : ''
		}
	},
	computed:{
		...mapState({
			timezones : 'timezones'
		}),
		form :{
			get(){
				return this.value 
			},
			set(value){
				this.$emit('input', value)
			}
		}
	},
	methods :{

	},
	created(){
		if( this.form.timezone ){
			var find = _.find( this.timezones , { id : this.form.timezone})
			if( !find ){
				this.form.timezone = this.timezones.first().id
			}
		}
	}
}
</script>

<style lang="scss">
	.item-source-setting-schedule{
		&-header{
			padding: 8px 24px;
			border-bottom: 1px solid $border-color;
			display: flex;
			align-items: center;
		}
		&-body{
			padding: 8px 16px 24px 16px;
		}
		&-row{
			display: flex;
			align-items: flex-start;
		}
		&-col{
			@include flex(196px);
			padding: 0 8px;
			&.col-small{
				@include flex(130px)
			}
			&.col-large{
				@include flex(250px);
			}
			label{
				display: block;
				font-weight: 600;
				margin-bottom: 5px;
			}
			.ant-select{
				width: 100%;
			}
			.ant-input-time{
				padding-left: 35px;
				appearance:none;
				&::-webkit-inner-spin-button { display: none; }
				&::-webkit-calendar-picker-indicator { display: none; }
				&::-webkit-time-picker-indicator { display: none; }
			}
		}
	}
</style>