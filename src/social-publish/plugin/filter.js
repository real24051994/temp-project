import Vue from 'vue'
import timezones from '@/config/timezones.json'

Vue.filter('timezone', function(value){
	var item  = _.find( timezones , { id : value })
	if( item ){
		return item.text 
	}
	return value
})