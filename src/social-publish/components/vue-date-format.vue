<template>
	<span v-html="`${timeFormat}&nbsp;&nbsp;${dateFormat}`"></span>
</template>
<script>
import { mapGetters } from 'vuex'
const momentTz      = require('moment-timezone');
export default {
	props:{
		value :{
			type : [String]
		},
		applyTimezone : {
			type : Boolean,
			default : true
		}
	},
	data (){
		return  {
			date : ''
		}
	},
	computed :{
		...mapGetters({
			time_setting : 'auth/getTimeSetting'
		}),
		time(){
			return this.applyTimezone ? momentTz.tz(this.value , this.time_setting.timezone) : moment(this.value) 
		},
		timeFormat(){
			if( this.time.isValid() ){
				return this.time.format( this.time_setting.time_format == 12 ? 'hh:mm A' : 'HH:mm' )	
			}
			return ''
		},
		dateFormat(){
			if( this.time.isValid() ){
				return this.time.format( this.time_setting.date_format )	
			}
			return ''
		}
	},
}
</script>