<template>
	<div class="vue-dashboard-statistic" v-if="is_loading">
		<div class="vue-dashboard-statistic-header d-flex">
			<h3>
				{{ $t('dashboard.title.overview') }}
			</h3>
			<div class="spacer"></div>
		</div>
		<div class="vue-dashboard-statistic-body d-flex is-loading">
			<div class="vue-dashboard-statistic-chart">
				<a-skeleton active :title="false" :paragraph="{ rows: 10 , width : '100%' }" />
			</div>
			<div class="vue-dashboard-statistic-data">
				<a-skeleton active :title="false" :paragraph="{ rows: 10 , width : '100%' }" />
			</div>
		</div>
	</div>
	<div class="vue-dashboard-statistic" v-else>
		<div class="vue-dashboard-statistic-header d-flex">
			<h3>
				{{ $t('dashboard.title.overview') }}
			</h3>
			<div class="spacer"></div>
			<a-select  v-model="filter.social_id" class="select-inline" >
				<a-select-option value="">
					<div class="select-account-item">
						<div class="item-name">{{ $t('dashboard.label.all_account_option') }}</div>
					</div>
				</a-select-option>
				<a-select-option v-for="(item,index) in socials" :key="index" :value="item.id">
					<div class="select-account-item">
						<div class="item-avatar">
							<img :src="item.avatar" alt="">
						</div>
						<div class="item-name">
							{{ item.name }}
						</div>
					</div>
				</a-select-option>
			</a-select>
			<a-select  v-model="filter.last_days" class="select-inline m-l-16" >
				<a-select-option v-for="(item,index) in date_range" :key="index" :value="item">
					{{ $t('dashboard.label.last_day' , { day : item }) }}
				</a-select-option>
			</a-select>
		</div>
		<div class="vue-dashboard-statistic-body d-flex">
			<div class="vue-dashboard-statistic-chart">
				<vue-dashboard-statistic-chart :label="data.chart_label"  :data="data.chart_data" />
			</div>
			<div class="vue-dashboard-statistic-data">
				<div class="item-data item-data-info m-b-8">
					<div class="item-data-icon">
						<sh-icon :icon="['far','clock']" />
					</div>
					<div class="item-data-content">
						{{ data.total_schedule_posts ? data.total_schedule_posts : 0 }}
						{{ $t('dashboard.insight.scheduled_post') }}
					</div>
				</div>
				<div class="item-data m-b-8">
					<div class="item-data-icon">
						<sh-icon :icon="['far','page-break']" />
					</div>
					<div class="item-data-content">
						{{ data.total_draft_posts ? data.total_draft_posts : 0 }}
						{{ $t('dashboard.insight.draft_post') }}
					</div>
				</div>
				<div class="item-data item-data-success m-b-8">
					<div class="item-data-icon">
						<sh-icon :icon="['far','robot']" />
					</div>
					<div class="item-data-content">
						{{ data.total_running_auto_pilot ? data.total_running_auto_pilot : 0 }}
						{{ $t('dashboard.insight.running_autopilot') }}
					</div>
				</div>
				<div class="item-error m-b-8">
					<div class="item-error-icon">
						<sh-icon :icon="['far','exclamation-circle']" />
					</div>
					<div class="item-error-content">
						{{ data.total_error_posts ? data.total_error_posts : 0 }}
						{{ $t('dashboard.insight.error_post') }}
					</div>
				</div>
				<div class="item-error">
					<div class="item-error-icon">
						<sh-icon :icon="['far','hourglass']" />
					</div>
					<div class="item-error-content">
						{{ data.total_pause_auto_pilot ? data.total_pause_auto_pilot : 0 }}
						{{ $t('dashboard.insight.pause_autopilot') }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import VueDashboardStatisticChart from './vue-dashboard-statistic-chart'
import { mapActions } from 'vuex'
export default {
	name : 'VueDashboardStatic',
	components:{
		VueDashboardStatisticChart
	},
	data(){
		return {
			is_loading_error : false,
			is_loading_page : true,
			is_loading : true ,
			socials: [],
			filter:{
				social_id :'',
				last_days : 7,
			},
			date_range : [7,14],
			data : null 
		}
	},
	methods :{
		...mapActions({
			getDashboardStatistic : 'dashboard/getDashboardStatistic',
			getSocialAccounts : 'account/list'
		}),
		getRange(startDate, endDate) {
			let fromDate = moment(startDate)
			let toDate = moment(endDate)
			let diff = toDate.diff(fromDate, 'days')
			let range = []
			for (let i = 0; i < diff; i++) {
				let date = moment(startDate).add(i, 'days')
				range.push({
					date : date.format('YYYY-MM-DD'),
					title : date.format('ddd'),
				})
			}
			range.push({
				date : toDate.format('YYYY-MM-DD'),
				title : toDate.format('ddd'),
			})
			return range
		},
		handleGetSocialAccount(){
			return new Promise((resolve, reject)=>{
				this.getSocialAccounts().then((res)=>{
					let { status = false , data = [] } = res.data
					if( status ){
						this.socials = data 
					} 
					resolve()
				})
				.catch((err)=>{
					reject()
				})
			});
		},
		handleGetStatistic(){
			return new Promise((resolve, reject)=>{
				this.is_loading = true
				this.getDashboardStatistic({
					social_id : this.filter.social_id,
					last_days :  this.filter.last_days,
				})
				.then((res)=>{
					let { status = false , data } = res.data 
					if( status ){
						let { from , to } = data.publish_posts
						var range = this.getRange(from , to)
						let  chart_label  = [] , chart_data  = [] , total_publish_post = 0 
						range.forEach((item,index)=>{
							var find = _.find(data.publish_posts.data , { date : item.date })
							var count = find ? find.total_publish_post : 0
							chart_label.push(item.date)
							chart_data.push(count)
							total_publish_post += count
						})
						this.data = Object.assign(data , { 
							chart_label , chart_data , total_publish_post
						}) 
						
					}else{
						this.data = null 
					}
					this.is_loading = false
					resolve()
				})
				.catch((err)=>{
					this.is_loading_error = true 
					this.is_loading = false
					resolve()
				})
			});
		}
	},
	watch :{
		filter : {
			handler : function(){
				this.handleGetStatistic()
			},	
			deep : true
		}
	},
	mounted(){
		Promise.all([ this.handleGetSocialAccount() , this.handleGetStatistic()]).then(() => {
			this.is_loading_page = false
		}).catch(()=>{
			this.is_loading_page = false
		})
	}
}
</script>
<style lang="scss">
	.vue-dashboard-statistic{
		
		&-header{
			margin-bottom: 16px;
			.ant-select{
				width: 200px;
			}
		}
		&-body{
			padding: 16px;
			background-color: $light-gray5;
			border-radius: 4px;
			&.is-loading{
				.vue-dashboard-statistic{
					&-chart,&-data{
						background-color: #fff;
						border-radius: 4px;
					}
				}
			}
		}
		&-chart{
			@include col;
			min-height: 265px;
			background-color: #fff;
			border-radius: 4px;
		}
		&-data{
			@include flex(285px);
			padding-left: 16px;
			min-height: 265px;
			.item-data{
				min-height: 56px;
				background-color: #fff;
				border-radius: 4px;
				padding: 8px;
				display: flex;
				align-items: center;
				color: #4F4F4F;
				font-weight: 600;
				&.item-data-info{
					color: $primary-color;
					.item-data-icon{
						background-color: $light-blue2;
					}
				}
				&.item-data-success{
					color: $success-color;
					.item-data-icon{
						background-color: $light-success2;
					}
				}
				&-icon{
					@include flex(40px);
					height: 40px;
					border-radius: 4px;
					background-color: $light-gray5;
					font-weight: 600;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 20px;
				}
				&-content{
					@include col;
					padding-left: 16px;
				}
			}
			.item-error{
				display: flex;
				color: $danger-color;
				font-weight: 600;
				&-icon{
					@include flex(16px);
					font-size: 16px;
				}
				&-content{
					@include col;
					padding-left: 8px;
				}
			}
		}
	}
	.select-account-item{
		display: flex;
		align-items: center;
		height: 30px;
		.item-avatar{
			width: 20px;
			height: 20px;
			overflow: hidden;
			border: 1px solid #CECECE;
			@include flex(20px);
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			img{
				max-width: 100%;
				max-height: 100%;
			}
		}
		.item-name{
			@include col;
			padding-left: 8px;
			color: #252627;
		}
	}
	.vue-dashboard-static-chart , .vue-dashboard-static-info{
		padding: 16px 16px 0 16px;
		border: 1px solid $border-color;
		position: relative;
		min-height: 100%;
		&-loading{
			min-height: 300px;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		&-header{
			display: flex;
			align-items: center;
			height: 40px;
			svg{
				font-size: 18px;
				color:$primary-color;
				margin-right: 8px;
			}
			.page-title{
				margin: 0;
			}
		}
		&-body{
			.item-static{
				display: flex;
				font-size: 14px;
				&-error{
					color : $danger;
				}
				&-icon{
					@include flex(30px);
				}
				&-content{
					@include flex(calc(100% - 30px));
				}
			}
		}
	}
</style>
