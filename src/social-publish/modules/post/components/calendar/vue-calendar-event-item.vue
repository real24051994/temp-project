<template>
	<div class="item-event" :data-id="data.id" :data-date="date" :class="{'item-draggable' : data.status == 'scheduled'}" @click="onClick" >
		<div class="item-event-content">
			<div class="item-event-head">
				<div class="item-event-time" :class="{ 'time-over' : data.status == 'published'}">
					{{date_format}}
				</div>
				<div class="item-event-social">
					<template v-for="social in  data.social_type" >
						<span :class="`item-social social-${social}`" :key="social"></span>
					</template>
				</div>
			</div>
			<div class="item-event-body">
				<span class="item-event-icon">
					<template v-if="data.post_type == 'product'">
						<sh-icon v-if="data.sub_type == 'image'" icon="image" />
						<sh-icon v-else :icon="['fal' , 'link']" />
					</template>
					<template v-else-if="data.post_type == 'image'">
						<sh-icon :icon="['fal' , 'image']" />
					</template>
					<template v-else-if="data.post_type == 'link'">
						<sh-icon  :icon="['fal' , 'link']"/>
					</template>
					<template v-else-if="data.post_type == 'text'">
						<sh-icon  :icon="['fal' , 'font']"/>
					</template>
				</span> 
				<span class="item-event-title">
					{{ data.message  }}
				</span>
			</div>
		</div>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
	name : 'MonthViewItem',
	props:{
		data :{
			type : Object,
			required :true
		},
		date : {
			type : String
		},
	},
	computed:{
		...mapGetters({
			'time_setting' : 'auth/getTimeSetting',
		}),
		date_format(){
			return moment(this.data.start,'YYYY-MM-DD HH:mm:ss').format(this.time_setting.time_format == 12 ? 'hh:mm A' : 'HH:mm')
		}
	},
	methods :{
		onClick(){
			this.$POST_Modals.showModalPost({ post_id : this.data.id})
			this.$emit('on-click-event')
		},
	},
}
</script>
<style lang="scss">
	.item-event{
		background: transparent;
		color: $text;
		border-color: transparent;
		padding: 5px 8px;
		display: block;
		width: 100%;
		overflow: hidden;
		border-radius: 4px;
		cursor: pointer;
		&.item-draggable{
			// cursor: pointer;
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
			align-items: center;
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
				background: $light-gray3;
				color: $dark-gray3;
			}
		}
		&-title{
			@include col;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			color: #252627;
			line-height: 15px;
			font-size: 12px;
			opacity: 0.5;
		}
		&-icon{
			@include flex(15px);
			font-size: 14px;
			margin-right: 4px;
			// height: 14px;
			// width: 14px;
			display: flex;
			align-items: center;
			color: $light-gray1;
		}
		&-social{
			height: 18px;
			
		}
		&.item-draggable{
			.item-event-title{
				opacity: 1;
			}
		}
	}
</style>