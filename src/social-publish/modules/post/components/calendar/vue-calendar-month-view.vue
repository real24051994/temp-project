<template>
	<div class="vue-calendar vue-calendar-month-view">
		<div class="post-calendar" >
			<div class="post-calendar-body" >
				<div class="post-calendar-body-error" v-if="is_loading_error">
					<vue-error type="500"></vue-error>
				</div>
				<template v-else>
					<div class="post-calendar-wrapper">
						<div class="post-calendar-wrapper-header">
							<div class="post-calendar-wrapper-header-item" v-for="(item,index) in calendar.week" :key="`item_index_${index}`">
								{{ item }}
							</div>
						</div>
						<div class="post-calendar-wrapper-body">
							<template v-for="day in calendar.data" >
								<div class="item-day" :data-date="day.id" :class="dayClassName(day.date)"  :key="day.id" @dragover="dragover" @dragleave="dragleave" >
									<div class="item-day-content">
										<div class="item-day-header">
											<template v-if="calendar.today.format('YYYY-MM-DD') == day.date.format('YYYY-MM-DD')">
												Today, {{ day.date.format('MMM D') }}
											</template>
											<template v-else-if="day.date.format('DD') == '01'">
												{{ day.date.format('MMM D') }}
											</template>
											<template v-else>
												{{ day.date.format('D') }}
											</template>
										</div>
										<div class="item-day-body" v-if="day.date.startOf('day') >= calendar.today.startOf('day')">
											<draggable class="list-item-events" v-model="day.data" v-bind="calendar.options" @add="(event)=>onAdd(event,day.id)">
												<template v-for="( item, index) in day.data">
													<vue-calendar-event-item :data="item" :date="day.id" v-if="index < 2" :key="`item_date_index_${index}`" />
												</template>
											</draggable>
										</div>
										<div class="item-day-body" v-else>
											<div class="list-item-events">
												<template v-for="( item, index) in day.data">
													<vue-calendar-event-item :data="item" :date="day.id" v-if="index < 2" :key="`item_date_index_${index}`" />
												</template>
											</div>
										</div>
										<div class="item-day-footer">
											<a-dropdown  transitionName="none" maskTransitionName="none" v-model="day.visible" overlayClassName="item-day-calendar-dropdown" v-if="day.data.length > 2" :trigger="['click']" placement="topCenter" >
												<a class="btn-load-more" >
													+{{ day.data.length - 2}} more
												</a>
												<a-menu  slot="overlay" class="item-day-calendar-dropdown-menu">
													<a-menu-item key="1">
														<div class="item-day-calendar-dropdown-menu-header">
															<div class="item-day-calendar-dropdown-menu-header-title">
																{{ day.date.format('LL')}}
															</div>
															<button  class="item-day-calendar-dropdown-menu-header-close" @click="day.visible = false">
																<sh-icon :icon="['fal','times']" />
															</button>
														</div>
														<div class="item-day-calendar-dropdown-menu-body">
															<vue-simple class="item-day-calendar-dropdown-menu-scroll">
																<div  v-if="day.date.startOf('day') >= calendar.today.startOf('day')">
																	<draggable class="list-item-events" v-model="day.data" v-bind="calendar.options"  @add="(event)=>onAdd(event,day.id)">
																		<template v-for="( item, index) in day.data">
																			<vue-calendar-event-item @on-click-event="onClickItemEvent" :on-dropdown="true" :data="item" :date="day.id"  :key="`item_date_index_${index}`" />
																		</template>
																	</draggable>
																</div>
																<div v-else>
																	<div class="list-item-events">
																		<template v-for="( item, index) in day.data">
																			<vue-calendar-event-item  @on-click-event="onClickItemEvent"  :on-dropdown="true" :data="item" :date="day.id"  :key="`item_date_index_${index}`" />
																		</template>
																	</div>
																</div>
															</vue-simple>
														</div>
													</a-menu-item>
												</a-menu>
											</a-dropdown>
											<div class="spacer"></div>
											<a class="btn-create" @click="handleCreatePost(day.date)" v-if="day.date.startOf('day') >= calendar.today.startOf('day')">
												<sh-icon :icon="['fal','plus']" />
											</a>
										</div>
									</div>
								</div>
							</template>
						</div>
					</div>
				</template>
			</div>
		</div>
		<vue-calendar-modal-pick-time v-if="modal_pick_time.visible"  v-model="modal_pick_time" @cancel="handleCancelDate" @apply="handleApplyDate" />
	</div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import calendar_mixin from '../../mixins/calendar'
import VueCalendarModalPickTime from './vue-calendar-modal-pick-time'
import VueCalendarEventItem from './vue-calendar-event-item.vue'
import draggable from 'vuedraggable'
export default {
	name : 'VueCalendarMonthView',
	mixins: [calendar_mixin],
	components:{
		VueCalendarModalPickTime,
		VueCalendarEventItem,
		draggable, 
	},
	props :{
		value :{
			required : true,
		},
		title :{
			type : String,
			required : true,
		},
		status : {
			type : String,
			required : true,
		},
		socialIds:{
			type : Array,
			required : true,
		},
		loading :{
			type : Boolean,
			default : false
		}
	},
	data(){
		return {
			is_loading : true,
			is_loading_error : false,
			cancel_request: null,
			modal_pick_time :{
				visible : false,
				is_loading : false,
				date : '',
				time : '',
				id: ''
			},
			calendar :{
				start_date : null,
				end_date : null,
				data : [],
				dates : [],
				today : moment(),
				month : null,
				year : null,
				week: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
				start_month : null,
				options : {
					group: 'events',
					sort : false,
					draggable: '.item-draggable',
				}
			},
			draggableValue: {
				handle: undefined
			}
		}
	},
	computed:{
		date:{
			get(){
				return this.value
			},
			set(value){
				this.$emit('input' , value)
			}
		},
		heading : {
			get(){
				return this.title
			},
			set(value){
				this.$emit('update:title' , value)
			}
		}
	},
	methods :{
		...mapActions({
			'getCalendarPost' : 'calendar/get',
			'updateCalendarPost' : 'calendar/update'
		}),
		initCalendar(date){
			var title = date.format('MMMM YYYY')
			if( this.heading != title ){
				this.heading = title 
			}
			this.is_loading = true
			this.date = date
			this.calendar.month = date.month()
			this.calendar.year = date.year()
			this.calendar.start_month = moment(date).startOf('month')
			var startDate = moment(date).startOf('month').startOf('week')
			if( startDate.month() == date.month() ){
				startDate.add(-7, 'days');
			}
			var endDate = moment(date).endOf('month').endOf('week')
			if( endDate.month() == date.month() ){
				endDate.add(7, 'days');
			}
			this.calendar.start_date = startDate
			this.calendar.end_date = endDate
			this.calendar.dates = this.getDatesInGivenRange(startDate,endDate)
			this.getPost()
		},
		handleCreatePost(date){
			this.$POST_Modals.showModalPost({ date : date.startOf('day').format('YYYY-MM-DD 00:00') , social_ids  : this.socialIds })
		},
		reload(){
			this.is_loading = true
			this.getPost()
		},
		getPost(){
			return new Promise((resolve, reject)=>{
				if (this.cancel_request) {
					this.cancel_request.cancel('Start new request, stop active request');
				}
				this.cancel_request = this.createAxiosCancelRequestToken()
				var formdata = {
					from : this.calendar.start_date.format('YYYY-MM-DD 00:00:00'),
					to : this.calendar.end_date.format('YYYY-MM-DD 23:59:59'),
					social_ids : this.socialIds,
					cancel_request_token : this.cancel_request.token
				}
				if( this.status != 'all'){
					formdata['status'] = this.status 
				}
				this.is_loading_error = false
				this.getCalendarPost(formdata).then((res)=>{
					let { status = false , data = null  } = res.data 
					if( status ){
						let calendar = []
						this.calendar.dates.forEach( item => {
							calendar.push({
								date : moment(item,'YYYY-MM-DD'),
								id : item,
								visible : false,
								data : data && data.hasOwnProperty(item) ? data[item] : []
							})
						})
						this.calendar.data = calendar
					}else{
						this.is_loading_error = true 
					}
					this.is_loading = false
				})
				.catch((err)=>{
					if ( !this.$axios.isCancel(err)) {
						this.is_loading_error = true 
						this.is_loading = false
					} 
				})
			});
		},
		
		dayClassName(date){
			var day = date.format('YYYY-MM-DD')
			var today = moment().format('YYYY-MM-DD')
			return {
				'is-today' : day == today ,
				'is-day-past' : day < today ,
				'is-day-future' : day > today ,
				'is-other-month' : date.month() != this.date.month()
			}
		},
		onAdd(event , date){
			var id = event.clone.dataset.id
			var item = this.getItem( date , id )
			this.handleHideLoadMore()
			if( item ){
				var result = moment(item.start , 'YYYY-MM-DD HH:mm:ss')
				this.showModalPickTime( date , id , result.format('HH:mm'))
			}
		},
		dragover(){

		},
		dragleave(){

		},
		getItem(date,id){
			var item = _.find( this.calendar.data , { id : date })
			if( item ){
				var result = _.find(item.data, (el)=>el.id == id  )
				return result
			}
			return result
		},
		setItem(date,id,time){
			var item = this.getItem(date,id)
			if( item ){
				item['start'] = time
			}
			var index = _.findIndex( this.calendar.data , { id : date })
			if( index >= 0 ){
				var item_index = _.findIndex( this.calendar.data[index].data , (el)=>el.id == id)
				if( item_index >= 0 ){
					this.calendar.data[index].data[item_index]['start'] = time
					this.calendar.data[index].data.sort((a,b)=>{
						return moment(a.start,'YYYY-MM-DD HH:mm:ss') - moment(b.start,'YYYY-MM-DD HH:mm:ss')
					})
				}
			}
		},
		removeItem(date,id){
			var index = _.findIndex( this.calendar.data , { id : date })
			if( index >= 0 ){
				var item_index = _.findIndex( this.calendar.data[index].data , (el)=>el.id == id)
				if( item_index >= 0 ){
					this.calendar.data[index].data.splice(item_index,1)
				}
			}
		},
		sortDataEvent(arr){
			arr.sort((a,b)=>{
				return moment(a.start,'YYYY-MM-DD HH:mm:ss') - moment(b.start,'YYYY-MM-DD HH:mm:ss')
			})
		},
		showModalPickTime(date , id , time){
			this.modal_pick_time.id = id
			this.modal_pick_time.date = date
			this.modal_pick_time.time = time
			this.modal_pick_time.visible = true
			
		},
		handleApplyDate(){
			if( this.modal_pick_time.id ){
				let date = this.modal_pick_time.date
				let start = `${date} ${this.modal_pick_time.time}:00`
				this.modal_pick_time.is_loading = true
				let id = this.modal_pick_time.id 
				this.updateCalendarPost({ id , start  }).then((res)=>{
					let { status  = false , message = '' } = res.data 
					if( status ){	
						this.toastSuccess({
							title : 'Success',
							message: 'Update Post Successfully'
						})
						this.setItem( date, id , start )
						this.handleResetModalPickTime()
					}else{
						this.showFormErrors(message)
					}
					this.modal_pick_time.is_loading = false
				})
				.catch(()=>{
					this.modal_pick_time.is_loading = false
				})
			}
		},
		handleCancelDate(){
			var current_item = this.getItem(this.modal_pick_time.date , this.modal_pick_time.id )
			current_item = this.$clone(current_item)
			this.removeItem(this.modal_pick_time.date , this.modal_pick_time.id)
			var date = moment(current_item.start , 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD')
			var index = _.findIndex(this.calendar.data , { id : date })
			if( index >= 0 ){
				this.calendar.data[index].data.push(current_item)
				this.calendar.data[index].data.sort((a,b)=>{
					return moment(a.start,'YYYY-MM-DD HH:mm:ss') - moment(b.start,'YYYY-MM-DD HH:mm:ss')
				})
			}
			this.modal_pick_time.visible = false
			this.handleResetModalPickTime()
		},
		handleResetModalPickTime(){
			this.modal_pick_time.visible = false
			this.modal_pick_time.date = null 
			this.modal_pick_time.time = null 
			this.modal_pick_time.id = null 
			this.modal_pick_time.is_loading = false
		},
		handleHideLoadMore(){
			for (let index = 0; index < this.calendar.data.length; index++) {
				if( this.calendar.data[index]['visible'] ){
					this.calendar.data[index]['visible'] = false
				}
			}
		},
		nextMonth(){
			if( this.is_loading ) return 
			var date = this.date.add(1, 'months').startOf('month')
			this.initCalendar(date)
		},
		prevMonth(){
			if( this.is_loading ) return 
			var date = this.date.add(-1, 'months').startOf('month')
			this.initCalendar(date)
		},
		currentMonth(){
			if( this.is_loading ) return 
			if( this.date.startOf('month').format('YYYY-MM') != moment().startOf('month').format('YYYY-MM')){
				this.initCalendar(moment().startOf('month'))
			}
		},
		onEventBus( payload ){
			let { action = '' } = payload 
			if( action == 'next'){
				this.nextMonth()
			}else if( action == 'prev' ){
				this.prevMonth()
			}else if( action == 'today'){
				this.currentMonth()
			}
		},
	},
	watch :{
		'socialIds' : function(){
			this.reload()
		},
		'status' : function(){
			this.reload()
		}
	},
	created(){
		this.$eventBus.$on('calendar-action' , this.onEventBus)
		this.$eventBus.$on('reload-list-post' , this.reload)
		
	},
	mounted(){
		let date = this.date ? this.date : moment().startOf('month')
		this.initCalendar(date)
	},
	beforeDestroy(){
		this.$eventBus.$off('calendar-action' , this.onEventBus)
		this.$eventBus.$off('reload-list-post' , this.reload)
	}
}
</script>
<style lang="scss">
	$day-disabled: #F7F8FA;
	$today : #EBF1FF;
	$disabled-opacity : 0.6;
	.vue-post-calendar-popup{
		position: absolute;
	}
	.vue-calendar-month-view{
		.post-calendar{
			position: relative;
			width: 100%;

			&-body{
				position: relative;
				&-loading ,&-error{
					height: 400px;
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				.drag-over{
					background-color: #bce8f1;
					* {
						pointer-events: none;
					}
				}
				.post-calendar-wrapper{
					&-header{
						height: 38px;
						background: #ffffff;
						border-top: 1px solid $border-color;
						border-bottom: 1px solid $border-color;
						// border-radius: 4px 4px 0px 0px;
						display: flex;
						
						&-item{
							@include flex(14.285714285714285714285714285714%);
							display: flex;
							align-items: center;
							// justify-content: center;
							padding: 0 16px;
							font-weight: 600;
							border-left: 1px solid $border-color;
							&:first-child{
								border-left: 0px;
							}
							&:last-child{
								border-right: 0px;
							}
						}
					}
					&-body{
						display: flex;
						flex-wrap: wrap;
					}
				}
				.item-day{
					height: 150px;
					border-left: 1px solid $border-color;
					border-bottom: 1px solid $border-color;
					padding: 0;
					@include flex(14.285714285714285714285714285714%);
					user-select: none;
					position: relative;
					background-color: #fff;
					&:hover{
						.item-day-footer .btn-create{
							opacity: 1;
							visibility: visible;
						}
					}
					&:nth-child(7n + 1){
						border-left-width: 0px;
					}
					&-header{
						height: 23px;
						padding: 0 8px;
						font-size: 12px;
						font-weight: 600;
						text-align: right;
						color: $dark-gray1;
						display: flex;
						align-items: center;
						justify-content: flex-end;
					}
					&-body{
						.list-item-events{
							height: 94px;
							overflow: hidden;
							padding: 0 4px;
						}

					}
					&-footer{
						height: 32px;
						position: relative;
						padding: 0 5px;
						display: flex;
						align-items: center;
						.btn-load-more{
							font-size: 12px;
							&:hover{
								text-decoration: underline;
							}
						}
						.btn-create{
							height: 22px;
							width: 22px;
							border-radius: 50px;
							display: inline-flex;
							align-items: center;
							justify-content: center;
							font-size: 12px;
							color: $white;
							background-color: $primary-color;
							opacity: 0;
							visibility: hidden;
							transition: all 0.2s ease;
						}
					}
					&.is-today{
						background-color: $today;
						.item-day-header{
							color: $primary-color;
						}
					}
					&.is-day-past{
						background-color: $day-disabled;
						.item-day-header{
							opacity: 0.2;
						}
					}
					&.is-other-month{
						.item-day-header{
							opacity: 0.2;
						}
					}
				}
			}
		}
	}
	
	
</style>