<template>
	<div class="vue-autopilot-form-review">
		<div class="form-group-content">
			<div class="row">
				<div class="col col-12">
					<h3>{{ $t('autopilot.form.label.review_setting') }}</h3>
				</div>
				<div class="col col-12 m-t-16">
					<h4 class="m-b-10">{{ $t('autopilot.form.label.review_rating') }}</h4>
					<a-radio-group name="radioRatingOption" v-model="form.rating_option">
						<a-radio :value="5" class="m-r-16">
							5 <i class="text-warning m-l-4"><sh-icon :icon="['fas','star']" /></i>
						</a-radio>
						<a-radio :value="4" class="m-r-16">
							4<i class="text-warning m-l-4"><sh-icon :icon="['fas','star']" /></i> and up
						</a-radio>
						<a-radio :value="3" class="m-r-16">
							3<i class="text-warning m-l-4"><sh-icon :icon="['fas','star']" /></i> and up
						</a-radio>
					</a-radio-group>
				</div>
				<div class="col col-12  m-t-16">
					<h4 class="m-b-10">{{ $t('autopilot.form.label.share_edited_review') }}</h4>
					<a-switch id="switch_update_enable" v-model="form.update_enable" /> 
					<label class="m-l-8" for="switch_update_enable">
						<template v-if="form.update_enable">
							{{ $t('autopilot.form.switch.share_edited_review.on') }}
						</template>
						<template v-else>
							{{ $t('autopilot.form.switch.share_edited_review.off') }}
						</template>
					</label>
				</div>
				<div class="col col-12  m-t-16">
					<h4 class="m-b-10">{{ $t('autopilot.form.label.share_review_with_image') }}</h4>
					<a-switch id="switch_review_priority" v-model="form.review_priority" /> 
					<label class="m-l-8" for="switch_review_priority">
						<template v-if="form.review_priority">
							{{ $t('autopilot.form.switch.share_review_with_image.on') }}
						</template>
						<template v-else>
							{{ $t('autopilot.form.switch.share_review_with_image.off') }}
						</template>
					</label>
				</div>
			</div>
		</div>
		<div class="form-group-content">
			<div class="row">
				<div class="col col-12">
					<h3>{{ $t('autopilot.form.label.scheduled') }}</h3>
				</div>
				<div class="col col-12  m-t-16">
					<h4 class="m-b-10">{{ $t('autopilot.form.label.schedule_time_interval') }}</h4>
					<div class="select-time-interval">
						<span>
							{{ $t('autopilot.form.content.review_time_interval') }}
						</span>
						<a-select v-model="form.time_interval">
							<a-select-option v-for="item in times" :alue="item.id" :key="item.id">
								{{ item.text }}
							</a-select-option>
						</a-select>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name : 'VueAutopilotFormReview',
	props:{
		value : {
			type : Object,
			required : true
		}
	},
	data(){
		return {
			times : [
				{ 
					id : 30 ,
					text : '30 minutes'
				},
				{ 
					id : 60 ,
					text : '1 hours'
				},
				{ 
					id : 180 ,
					text : '3 hours'
				},
				{ 
					id : 360 ,
					text : '6 hours'
				},
				{ 
					id : 720 ,
					text : '12 hours'
				}
			]
		}
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
	}
}
</script>
<style lang="scss">
	.vue-autopilot-form-review{
		.select-time-interval{
			.ant-select{
				width: 147px;
			}
		}
		&-popover{
			width: 425px;
			&-icon{
				font-size: 18px;
			}
		}
	}
</style>