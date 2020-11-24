<template>
	<div class="vue-calendar vue-calendar-week-view">
		<div class="post-calendar" >
			<div class="post-calendar-body" >
				<div class="post-calendar-body-error" v-if="is_loading_error">
					<vue-error type="500"></vue-error>
				</div>
				<template v-else>
					<div class="post-calendar-body-title">
						<div class="item-day item-day-label">
							<div class="item-day-title">

							</div>
							<div class="item-day-time" v-for="item in calendar.hours" :key="item">
								{{ titleFormat(item) }}
							</div>
						</div>
					</div>
					<div class="post-calendar-body-content">
						<template v-for="day in calendar.data" >
							<div class="item-day" :key="day.id" :class="{ 'is-today' : isToday(day.date) }" >
								<div class="item-day-title">
									<div class="text-center">
										<strong>{{ day.date.format('ddd')}} </strong>
										<br>
										<span>{{ day.date.format('DD/MM')}}</span>
									</div>
								</div>
								<div class="item-day-time"  v-for="hour in day.data" :class="{ 'is-disabled' : hour.disabled }" :data-date="hour.id" :key="hour.id">
									<template v-if="hour.disabled">
										<div class="list-item-events">
											<template v-for="( item , index) in hour.data">
												<vue-calendar-event-item v-if="index < 1" :data="item" :date="hour.id"  :key="`item_date_index_${index}`" />
											</template>
										</div>
									</template>
									<template v-else>
										<draggable class="list-item-events" v-model="hour.data" v-bind="calendar.options"  @add="(event)=>onAdd(event,hour.id)">
											<template v-for="( item, index) in hour.data">
												<vue-calendar-event-item v-if="index < 1" :data="item" :date="hour.id"  :key="`item_date_index_${index}`" />
											</template>
										</draggable>
									</template>
									<div class="item-day-time-footer">
										<a-dropdown  transitionName="none" maskTransitionName="none" v-model="hour.visible" overlayClassName="item-day-calendar-dropdown" v-if="hour.data.length > 1" :trigger="['click']" placement="topCenter" >
											<a class="btn-load-more" >
												+{{ hour.data.length - 1}} more
											</a>
											<a-menu  slot="overlay" class="item-day-calendar-dropdown-menu">
												<a-menu-item key="1">
													<div class="item-day-calendar-dropdown-menu-header">
														<div class="item-day-calendar-dropdown-menu-header-title">
															{{ popupTitle(hour.id) }}
														</div>
														<button  class="item-day-calendar-dropdown-menu-header-close" @click="hour.visible = false">
															<sh-icon :icon="['fal','times']" />
														</button>
													</div>
													<div class="item-day-calendar-dropdown-menu-body">
														<vue-simple class="item-day-calendar-dropdown-menu-scroll">
															<template v-if="hour.disabled">
																<div class="list-item-events">
																	<template v-for="( item , index) in hour.data">
																		<vue-calendar-event-item @on-click-event="onClickItemEvent" :data="item" :date="hour.id"  :key="`item_date_index_${index}`" />
																	</template>
																</div>
															</template>
															<template v-else>
																<draggable class="list-item-events" v-model="hour.data" v-bind="calendar.options"  @add="(event)=>onAdd(event,hour.id)">
																	<template v-for="( item, index) in hour.data">
																		<vue-calendar-event-item @on-click-event="onClickItemEvent" :data="item" :date="hour.id"  :key="`item_date_index_${index}`" />
																	</template>
																</draggable>
															</template>
														</vue-simple>
													</div>
												</a-menu-item>
											</a-menu>
										</a-dropdown>
										<div class="spacer"></div>
										<a class="btn-create" v-if="!hour.disabled" @click="handleCreatePost(hour.id)" >
											<sh-icon :icon="['fal','plus']" />
										</a>
									</div>
								</div>
							</div>
						</template>
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
	name : 'VueCalendarWeekView',
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
				prev_item : null,
				next_item : null,
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
				hours: ['00:00' ,'01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'],
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
		...mapGetters({
			'time_setting' : 'auth/getTimeSetting',
		}),
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
			this.is_loading = true
			this.date = date
			this.calendar.month = date.month()
			this.calendar.year = date.year()
			var startDate = moment(date).startOf('week')
			var endDate = moment(date).endOf('week')
			this.calendar.start_date = startDate
			this.calendar.end_date = endDate
			this.calendar.dates = this.getDatesInGivenRange(startDate,endDate)
			var title = this.setCalendarTitle()
			if( this.heading != title ){
				this.heading = title 
			}
			this.getPost()
		},
		handleCreatePost(date){
			this.$POST_Modals.showModalPost({ date  , social_ids  : this.socialIds })
		},
		setCalendarTitle(){
			let startDate = this.calendar.start_date 
			let endDate = this.calendar.end_date
			let title = ''
			if( startDate.year() == endDate.year()){
				if( startDate.month() == endDate.month()){
					return `${startDate.format('MMMM')} ${startDate.format('D')} - ${endDate.format('D')} ${startDate.format('YYYY')}`
				}else{
					return `${startDate.format('MMMM')} ${startDate.format('D')} - ${endDate.format('MMMM')} ${endDate.format('D')} ${startDate.format('YYYY')}`
				}
			}else{
				return `${startDate.format('MMMM')} ${startDate.format('D')}, ${startDate.format('YYYY')} - ${endDate.format('MMMM')} ${endDate.format('D')} ${endDate.format('YYYY')}`
			}
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
						var now = moment().format('YYYY-MM-DD HH')
						this.calendar.dates.forEach( item => {
							let date_date = data && data.hasOwnProperty(item) ? data[item] : []
							let hours_in_day = []
							this.calendar.hours.forEach((hour)=>{
								var id = `${item} ${hour}`
								var date_time = moment(id ,'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH')
								hours_in_day.push({
									id : id,
									data : date_date.filter((el)=>{
										return date_time == moment(el.start, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH')
									}).sort((a,b)=>{
										return moment(a.start,'YYYY-MM-DD HH:mm:ss') - moment(b.start,'YYYY-MM-DD HH:mm:ss')
									}),
									disabled : date_time < now,
									visible : false
								})
							})
							
							calendar.push({
								date : moment(item,'YYYY-MM-DD'),
								id : item,
								visible : false,
								data : hours_in_day
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
		titleFormat(date){
			return moment(date,'HH:mm').format(this.time_setting.time_format == 12 ? 'h A' : 'HH:mm')
		},
		dateFormat(date){
			return moment(date,'HH:mm').format(this.time_setting.time_format == 12 ? 'hh A' : 'HH:mm')
		},
		popupTitle(time){
			return `${moment(time,'YYYY-MM-DD HH:mm').format(this.time_setting.time_format == 12 ? 'h A' : 'HH:mm')} - ${moment(time,'YYYY-MM-DD HH:mm').add(1 ,'hour').format(this.time_setting.time_format == 12 ? 'h A' : 'HH:mm')}`
		},
		onAdd(event , date){
			var id = event.clone.dataset.id
			var item = this.getItem( moment(date,'YYYY-MM-DD HH:mm') , id )
			this.handleHideLoadMore()
			if( item ){
				var clone_item = this.$clone(item)
				var new_time = moment(date,'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:') + moment(item.start,'YYYY-MM-DD HH:mm:ss').format('mm:ss')
				item['start'] = new_time
				this.showModalPickTime( clone_item , this.$clone(item) )
			}
		},
		dragover(){

		},
		dragleave(){

		},
		isToday(date){
			return date.format('YYYY-MM-DD') == moment().format('YYYY-MM-DD')
		},
		getItem(date,id){
			var item_date = _.find( this.calendar.data , { id : date.format('YYYY-MM-DD') })
			if( item_date ){
				var item_time = _.find(item_date.data, { id : date.format('YYYY-MM-DD HH:00') }  )
				if( item_time ){
					return _.find(item_time.data, (el)=>el.id == id  )
				}
			}
			return undefined
		},
		setItem( item , time){
			var item_date = moment(item.start,'YYYY-MM-DD HH:mm:ss')
			var new_date = moment(time,'YYYY-MM-DD HH:mm:ss')
			if( item_date.format('YYYY-MM-DD HH:mm:ss') != new_date.format('YYYY-MM-DD HH:mm:ss')){
				if( item_date.format('HH') == new_date.format('HH') ){
					var result = this.getItem(item_date, item.id )
					if( result ){
						result['start'] = time 
					}
					this.sortDataEvent(new_date)
				}else{
					this.removeItem( item_date , item.id)
					item['start'] = time
					this.addItem(item)
				}
			}else{
				this.sortDataEvent(new_date)
			}
		},
		addItem(item){
			var date = moment( item.start , 'YYYY-MM-DD HH:mm:ss')
			var item_date = _.find( this.calendar.data , { id : date.format('YYYY-MM-DD') })
			if( item_date ){
				var item_time = _.find(item_date.data, { id : date.format('YYYY-MM-DD HH:00') }  )
				if( item_time ){
					item_time.data.push(item)
					item_time.data.sort((a,b)=>{
						return moment(a.start,'YYYY-MM-DD HH:mm:ss') - moment(b.start,'YYYY-MM-DD HH:mm:ss')
					})
				}
			}
		},
		removeItem(date,id){
			var index_date = _.findIndex( this.calendar.data , { id : date.format('YYYY-MM-DD') })
			if( index_date >= 0  ){
				var index_time = _.findIndex(this.calendar.data[index_date].data, { id : date.format('YYYY-MM-DD HH:00') } )
				if( index_time >= 0 ){
					this.calendar.data[index_date].data[index_time].data = this.calendar.data[index_date].data[index_time].data.filter((item)=>item.id != id)
				}
			}
		},
		sortDataEvent(date){
			var item_date = _.find( this.calendar.data , { id : date.format('YYYY-MM-DD') })
			if( item_date ){
				var result = _.find(item_date.data, { id : date.format('YYYY-MM-DD HH:00') }  )
				if( result ){
					result.data.sort((a,b)=>{
						return moment(a.start,'YYYY-MM-DD HH:mm:ss') - moment(b.start,'YYYY-MM-DD HH:mm:ss')
					})
				}
			}
		},
		showModalPickTime( prev_item , next_item){
			this.modal_pick_time.prev_item = prev_item
			this.modal_pick_time.next_item = next_item
			var next_time = moment(next_item.start, 'YYYY-MM-DD HH:mm:ss')
			this.modal_pick_time.date = next_time.format('YYYY-MM-DD')
			this.modal_pick_time.time = next_time.format('HH:mm')
			this.modal_pick_time.visible = true
			
		},
		handleApplyDate(){
			if( this.modal_pick_time.next_item ){
				let date = this.modal_pick_time.date
				let start = `${date} ${this.modal_pick_time.time}:00`
				this.modal_pick_time.is_loading = true
				let id = this.modal_pick_time.next_item.id 
				this.updateCalendarPost({ id , start  }).then((res)=>{
					let { status  = false , message = '' } = res.data 
					if( status ){	
						this.toastSuccess({
							title : 'Success',
							message: 'Update Post Successfully'
						})
						this.setItem( this.modal_pick_time.next_item  , start )
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
			var next_date = moment(this.modal_pick_time.next_item.start , 'YYYY-MM-DD HH:mm:ss')
			this.removeItem( next_date , this.modal_pick_time.next_item.id)
			this.addItem(this.modal_pick_time.prev_item)
			this.modal_pick_time.visible = false
			this.handleResetModalPickTime()
		},
		handleResetModalPickTime(){
			this.modal_pick_time.visible = false
			this.modal_pick_time.prev_item = null
			this.modal_pick_time.next_item = null
			this.modal_pick_time.date = null 
			this.modal_pick_time.time = null 
			this.modal_pick_time.is_loading = false
		},
		handleHideLoadMore(){
			for (let index = 0; index < this.calendar.data.length; index++) {
				this.calendar.data[index].data = this.calendar.data[index].data.map(item=>{
					item['visible'] = false
					return item 
				})
			}
		},
		nextMonth(){
			if( this.is_loading ) return 
			var date = this.date.add(1, 'weeks')
			this.initCalendar(date)
		},
		prevMonth(){
			if( this.is_loading ) return 
			var date = this.date.add(-1, 'weeks')
			this.initCalendar(date)
		},
		currentMonth(){
			if( this.is_loading ) return 
			if( this.date.format('YYYY-MM-DD') != moment().format('YYYY-MM-DD')){
				this.initCalendar(moment())
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
		let date = moment().startOf('week')
		if( this.date && this.date.format('YYYY-MMMM') != moment().format('YYYY-MMMM')){
			date = this.date
		}
		this.initCalendar(date)
	},
	beforeDestroy(){
		this.$eventBus.$off('calendar-action' , this.onEventBus)
		this.$eventBus.$off('reload-list-post' , this.reload)
	}
}
</script>
<style lang="scss">
	.vue-calendar-week-view{
		.post-calendar{
			position: relative;
			width: 100%;
			padding: 0 24px;
			&-header{
				height: 46px;
				background: #F3F3F3;
				border-bottom: 1px solid $border-color;
				border-radius: 4px 4px 0px 0px;
				display: flex;
				&-item{
					@include flex(14.285714285714285714285714285714%);
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
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
				&-title{
					width: 50px;
					position: absolute;
					top: 0;
					left: 0;
					bottom: 0;
					z-index: 1;
				}
				&-content{
					position: relative;
					padding-left: 50px;
					display: flex;
				}
				.item-day{
					border: 1px solid $border-color;
					border-left-width: 0;
					padding: 0;
					@include flex(14.285714285714285714285714285714%);
					user-select: none;
					position: relative;
					background-color: #fff;
					&.is-today{
						background-color: #E7F3FE;
					}
					&:first-child{
						border-left-width: 1px;
					}
					&-label{
						@include flex(100%);
						border: none;
						.item-day{
							&-title{
								background: #fff;
							}
							&-time{
								border: none;
								font-size: 12px;
							}
						}
					}
					&-title{
						height: 63px;
						display: flex;
						align-items: center;
						justify-content: center;
						background: #F3F3F3;
						
					}
					&-time{
						height: 70px;
						// background: #fff;
						border-bottom: 1px solid $border-color;
						position: relative;
						&.is-disabled{
							
						}
						
						&-footer{
							height: 24px;
							position: absolute;
							bottom: 0;
							left: 0;
							right: 0;
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
								border-radius: 4px;
								display: inline-flex;
								align-items: center;
								justify-content: center;
								font-size: 12px;
								opacity: 0;
								visibility: hidden;
								transition: all 0.2s ease;
								color: $white;
								background-color: $primary-color;
							}
						}
						.list-item-events{
							height: 46px;
							overflow: hidden;
						}
						.item-event{

						}
						&:last-child{
							border-bottom-width: 0;
						}
						&:hover{
							.item-day-time-footer{
								.btn-create{
									opacity: 1;
									visibility: visible;
								}
							}
						}
					}
					&:hover{
						.item-day-footer .btn-create{
							opacity: 1;
							visibility: visible;
						}
					}
					
					&-dropdown{
						width: 350px;
						&-menu{
							background: #fff;
							box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.2);
							border: 1px solid $border-color;
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
								padding: 0 16px;
							}
							&-scroll{
								max-height: 200px;
								overflow: hidden auto;
							}
							.ant-dropdown-menu-item{
								background: #fff;
								padding: 0;
								cursor: default;
								&:hover{
									background: #fff;
								}
							}
						}
					}
				}
			}
		}
		.item-event{
			background: transparent;
			color: $text;
			border-color: transparent;
			padding: 5px 8px;
			display: block;
			width: 100%;
			overflow: hidden;
			// transition: all 0.1s ease;
			&.item-draggable{
				cursor: pointer;
			}
			&:hover{
				background: #f2f2f2;
				color: $text;
			}
			&-head{
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 4px;
			}
			&-body{
				display: flex;
			}
			&-time{
				font-weight: 600;
				font-size: 10px;
				height: 18px;
				display: inline-flex;
				align-items: flex-end;
				justify-content: center;
				border-radius: 4px;
				text-align: left;
				background: $primary-color;
				padding: 0 4px;
				color: #fff;
				&.time-over{
					background: #CECECE;
				}
			}
			&-title{
				@include col;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				color: #252627;
				line-height: 14px;
				font-size: 12px;
				opacity: 0.5;
			}
			&-icon{
				@include flex(15px);
				font-size: 14px;
				margin-right: 4px;
				height: 14px;
				width: 14px;
				display: flex;
				align-items: center;
				color: #CECECE;
			}
			&-social{
				
			}
			&.item-draggable{
				.item-event-title{
					opacity: 1;
				}
			}
		}
	}
</style>