import Vue from 'vue'
import { mapGetters } from 'vuex'
export default {
	computed: {
		...mapGetters({
			'time_setting' : 'auth/getTimeSetting',
		}),
	},
    methods:{
		mixinParseTimezone( time , format = 'YYYY-MM-DD HH:mm:ss' , format_target){
			return timezone.tz( time , format, true, this.time_setting.timezone).format(format_target ? format_target : format)
		},
		mixinParseTimezoneToUTC( time , format = 'YYYY-MM-DD HH:mm:ss' , format_target ){
			return timezone.tz( time , format, true, this.time_setting.timezone).utc().format(format_target ? format_target : format)
		},
		mixinParseTimeUTCtoTimezone(time, format = 'YYYY-MM-DD HH:mm:ss' , format_target ){
			return moment.utc(time , format).tz(this.time_setting.timezone).format(format_target ? format_target : format)
		},
		mixinFormatDateUTCtoTimezone(time = '', format = 'YYYY-MM-DD HH:mm:ss'){
			if( time ){
				var date = moment.utc(time , format).tz(this.time_setting.timezone)
				if( date.isValid() ){
					var time_format = date.format( this.time_setting.time_format == 12 ? 'hh:mm A' : 'HH:mm')
					var date_format = date.format( this.time_setting.date_format )	
					return  `${time_format} ${date_format}`
				}
			}
			return time 
		},
		mixinFormatTime(value, format = 'HH:mm'){
			if( value ){
				var date = moment(value , format)
				if( date.isValid() ){
					return  date.format(this.time_setting.time_format == 12 ? 'hh:mm A' : 'HH:mm')
				}
			}
			return value
		}
	},
}
