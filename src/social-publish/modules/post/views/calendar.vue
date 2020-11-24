<template>
	<div class="page-container" :class="{ 'page-container-collapse' : aside_collapse }">
		<div class="app-calendar" v-if="allowedCalendar">
			<div class="app-calendar-error" v-if="is_loading_error">
				<vue-error type="500"></vue-error>
			</div>
			<template v-else>
				<div class="page-container-aside app-calendar-left">
					<vue-calendar-account :loading="is_loading_page" v-model="calendar.social_ids"  :data="socials"/>
				</div>
				<div class="page-container-content app-calendar-right">
					<div class="page-container-wrapper">
						<div class="page-container-header bg-light-gray4">
							<div class="calendar-header">
								<a-button @click="headerAction('today')">{{ $t('post.calendar.label.today') }}</a-button>
								<a-button @click="headerAction('prev')" class="btn-arrow m-l-8"><sh-icon :icon="['far','chevron-left']" /></a-button>
								<a-button @click="headerAction('next')" class="btn-arrow m-l-8"><sh-icon :icon="['far','chevron-right']" /></a-button>
								<div class="d-inline-block m-l-8">
									<h3 class="m-0">{{ calendar.title }}</h3>
								</div>
								<div class="spacer"></div>
								<a-radio-group v-model="calendar.view" >
									<a-radio-button value="month">{{ $t('post.calendar.option.month') }}</a-radio-button>
									<a-radio-button value="week">{{ $t('post.calendar.option.week') }}</a-radio-button>
								</a-radio-group>
								<a-select  v-model="calendar.status" class="m-l-8">
									<a-select-option value="all">{{ $t('post.calendar.option.all_post') }}</a-select-option>
									<a-select-option value="published">{{ $t('post.calendar.option.published') }}</a-select-option>
									<a-select-option value="scheduled">{{ $t('post.calendar.option.scheduled') }}</a-select-option>
								</a-select>
								<a-button class="m-l-8" id="btn-create-post-in-calendar" type="primary" @click="showModalCreatePost">
									<sh-icon icon="paper-plane" />
									<span class="m-l-10">{{ $t('post.btn.create_post') }}</span>
								</a-button>
							</div>
						</div>
						<div class="page-container-body calendar-body">
							<transition mode="out-in" name="fade-in">
								<vue-calendar-month-view v-if="calendar.view == 'month'" key="month" v-model="calendar.date" :title.sync="calendar.title" :social-ids="calendar.social_ids" :loading="is_loading_page"   :status="calendar.status"  />
								<vue-calendar-week-view v-else-if="calendar.view == 'week'" key="week" v-model="calendar.date"  :title.sync="calendar.title" :social-ids="calendar.social_ids" :loading="is_loading_page"   :status="calendar.status"  />
							</transition>
						</div>
					</div>
				</div>
			</template>
		</div>
		<div class="app-calendar app-calendar-pricing" v-else >
			<div class="container">
				<div class="row">
					<div class="col col-12">
						<vue-pricing-calendar-popover />
					</div>
					<div class="col col-12 p-b-40">
						<vue-pricing-list-plan />
					</div>
					<div class="col col-12 p-b-40">
						<div class="text-center">
							<a @click="onClickPricing">
								{{ $t('post.calendar.content.link') }}
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from 'vuex'
import VueCalendarMonthView from '../components/calendar/vue-calendar-month-view'
import VueCalendarWeekView from '../components/calendar/vue-calendar-week-view'
import VueCalendarAccount from '../components/calendar/vue-calendar-account'
let today = moment().startOf('month')
export default {
	name : 'Calendar',
	components:{
		VueCalendarMonthView,
		VueCalendarWeekView,
		VueCalendarAccount
	},
	metaInfo(){
		return {
			title: 'Calendar'
		}
	},
    data(){
		return {
			is_loading_page : true,
			is_loading_error: false,
			calendar :{
				date: today,
				today : true,
				view : 'month',
				month : '',
				status : 'all',
				title : '',
				social_ids : []
			},
			calendarDates: {},
			socials: [],
		}
	},
	computed:{
		...mapGetters({
			time_setting : 'auth/getTimeSetting',
			aside_collapse : 'utils/getAsideCollapse',
			allowedCalendar : 'pricing/getAllowedCalendar'
		})
	},
	methods:{
		...mapActions({
			getSocialAccounts: "account/list",
		}),
		headerAction(action){
			this.$eventBus.$emit('calendar-action' , {action} )
		},
		showModalCreatePost(){
			this.$POST_Modals.showModalPost()
		},
		onClickPricing(){
			this.redirect({
				name : 'Pricing'
			})
		}
	},
	beforeCreate(){
		
	},
	mounted(){
		if( this.allowedCalendar ){
			this.getSocialAccounts().then((res)=>{
				let { status = false , data = null } = res.data
				if ( status && data ) {
					this.socials = data
					if( data.length ){
						this.calendar.social_ids = data.filter((item)=>item.connect_error == null).map((item)=>item.id)
					}
					var month  = moment()
					this.calendar.month  = month.format('YYYY-MM-DD')
					this.calendar.title = month.format('MMMM YYYY')
					
				}else{
					this.is_loading_error = 'empty'
				}
			})
			.catch((err)=>{
				this.is_loading_error = true
			})
			.finally(()=>{
				this.is_loading_page = false
			})
		}else{
			this.is_loading_page = false
		}
	}
	
}
</script>

<style lang='scss'>
	.app-calendar{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		&-loading ,&-error{
			height: 400px;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		&-left{
			
		}
		&-right{
			h2{
				font-weight: 600;
				font-size: 26px;
				line-height: 31px;
			}
		}
		.calendar{
			&-header{
				user-select: none;
				display: flex;
				align-items: center;
				padding: 16px 24px;
				.ant-radio-button-wrapper{
					min-width: 80px;
					text-align: center;
				}
				.ant-select{
					width: 130px;
				}
				.btn-arrow{
					border-color: transparent !important;
					background-color: transparent !important;
					padding: 0 ;
					width: 24px;
				}
			}
			&-body{
				position: relative;
				padding: 0;
			}
		}
		.list-account{
			&-header{
				display: flex;
				align-items: center;
				height: 60px;
				h3{
					font-style: normal;
					font-weight: 600;
					font-size: 16px;
					color: $text;
					margin: 0;
				}
			}
		}
	}
	.item-day-calendar-dropdown{
		width: 350px;
		&-menu{
			background: #fff;
			box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.2);
			border: 1px solid $border-color;
			padding: 0;
			&-header{
				height: 50px;
				display: flex;
				align-items: center;
				position: relative;
				padding: 0 16px;
				&-title{
					font-weight: 600;
					font-size: 20px;
					line-height: 24px;
				}
				&-close{
					position: absolute;
					top: 15px;
					right: 15px;
					z-index: 1;
					background: transparent;
					color: $text;
					border: none;
					cursor: pointer;
					opacity: 0.7;
					&:hover,&:focus{
						opacity: 1;
						background: transparent;
						color: $text;
						border: none;
						outline: none;
					}
				}
			}
			&-body{
				padding: 0;
				.item-event{
					min-height: 56px;
					padding: 9px 16px 0 16px ;
					margin-bottom: 4px;
					&:last-child{
						margin-bottom: 8px;
					}
					&-head{
						margin-bottom: 6px;
					}
					&-body{

					}
					&-time{
						font-size: 12px;
						height: auto;
						display: inline-block;
						padding: 0px 5px;
					}
					&-title{
						font-size: 14px;
					}
					&-icon{
						height: 14px;
						width: 14px;
					}
					&-social{
						height: 20px;
					}
				}
			}
			&-scroll{
				max-height: 280px;
				overflow: hidden auto;
			}
			.ant-dropdown-menu-item{
				background: #fff;
				padding: 0;
				cursor: default;
				border-radius: 6px;
				&:hover{
					background: #fff;
				}
			}
		}
	}
</style>