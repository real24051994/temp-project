import { mapActions , mapGetters } from 'vuex'
export default {
	data(){
		return {

		}
	},
	computed:{
		...mapGetters({
			time_setting : 'auth/getTimeSetting',
		}),
	},
	methods:{
		onClickItemEvent(){
			this.handleHideLoadMore()	
		},
		getDatesInGivenRange(startDate, endDate) {
			var dates = [];
			let start = startDate.clone()
			while (start.isBefore(endDate)) {
				dates.push(start.format('YYYY-MM-DD'));
				start.add(1, 'days');
			}
			return dates
		},
	},
	mounted(){

	}
}