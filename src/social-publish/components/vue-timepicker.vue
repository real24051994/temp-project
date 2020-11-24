<template>
	<div class="time-picker">
		<a-select  v-model="hour" >
			<a-select-option v-for="item in hours" :key="item.id" :value="item.id"> {{ item.name }} </a-select-option>
		</a-select>
		<a-select  v-model="minute" >
			<a-select-option v-for="item in minutes" :key="item.id" :value="item.id"> {{ item.name }} </a-select-option>
		</a-select>
		<template v-if=" timeFormat == 12 ">
			<a-switch v-model="meridiem" checkedChildren="AM" unCheckedChildren="PM" defaultChecked />
		</template>
	</div>
</template>

<script>

export default {
  	props: {
  		value :{
			  
		},
		timeFormat:{
			type : [String,Number],
			default : 12
		},
		minuteStep:{
			type : [String,Number],
			default : 1
		},
  	},
	data(){
		return {
			hours : [],
			minutes : [],
		}
	},
  	computed: {
		time :{
			get(){
				return moment(this.value , 'HH:mm')
			},
			set(value){
				this.$emit('input' , value)
			}
		},
		hour : {
			get(){
				return this.time.isValid() ?  this.time.format( this.timeFormat == 12 ? 'hh' : 'HH') : "00"
			},
			set(value){
				this.updateHour(value)
			}
		},
		minute:{
			get(){
				return this.time.isValid() ? this.time.format('mm') : "00"
			},
			set(value){
				this.updateMinute(value)
			}
		},
		meridiem:{
			get(){
				return  this.time.isValid() ? this.time.format('a') == 'am' : true 
			},
			set(value){
				this.updateMeridiem(value)
			}
		}
	},
	methods:{
		updateHour( value ){
			let time = this.timeFormat  == 12 ? moment( value + ':' + this.minute + ' ' + `${this.meridiem ? 'am' : 'pm'}`  , 'hh:mm a').format('HH:mm') : (value + ':' + this.minute)
			this.$emit('input', time)
		},
		updateMinute( value ){
			let time = this.timeFormat  == 12 ? moment( this.hour + ':' + value  + ' ' + `${this.meridiem ? 'am' : 'pm'}`  , 'hh:mm a').format('HH:mm') : (this.hour + ':' + value )
			this.$emit('input', time)
		},
		updateMeridiem( value ){
			let time = this.timeFormat  == 12 ? moment( this.hour + ':' + this.minute + ' ' + `${ value ? 'am' : 'pm'}`  , 'hh:mm a').format('HH:mm') : (this.hour + ':' + this.minute)
			this.$emit('input', time)
		}
	},
	created(){
		if( this.timeFormat  == 12){
			for (let i = 1; i <= 12; i++) {
				this.hours.push({
					id : i == 12 ? '00' : (i < 10 ?  '0' + i : String(i)), 
					name : i < 10 ?  '0' + i : String(i)
				})
			}
		}else{
			for (let i = 0; i <= 23; i++) {
				this.hours.push({
					id : i < 10 ?  '0' + i : String(i), 
					name : i < 10 ?  '0' + i : String(i)
				})
			}
		}
		var minute_increase = 0;
		while (minute_increase < 60 ) {
			this.minutes.push({
				id : minute_increase < 10 ?  '0' + minute_increase : String(minute_increase), 
				name : minute_increase < 10 ?  '0' + minute_increase : String(minute_increase)
			})
			minute_increase += parseInt(this.minuteStep)
		}
	}
};


    
</script>

<style lang="scss">
	.time-picker {
		display: flex;
		flex-direction: row;
		// justify-content: left;
		box-sizing: border-box;
		padding: 0 16px;
		margin-bottom: 15px;
		.ant-select{
			width: 65px;
			margin-right: 8px;
		}
		.timezone{
			border-radius: 4px;
			height: 32px;
			line-height: 32px;
			background: #fff;
		}
		.ant-switch{
			border-radius: 4px;
			margin-right: 8px;
			height: 32px;
			background: #fff;
			border: 1px solid #d9d9d9;
			.ant-switch-inner{
				margin-left: 40px;
				margin-right: 6px;
				color: rgba(0, 0, 0, 0.65);
			}
			&::after{
				content: '';
				height: 28px;
				width: 26px;
				border-radius: 3px;
				background: #f2f2f2;
				border: 1px solid #d9d9d9;
				display: flex;
				align-items: center;
				justify-content: center;
				background-image: url('~@publish/assets/icons/grip-lines-vertical.svg');
				background-repeat: no-repeat;
				background-position: center center;
			}
		}
		.ant-switch-checked{
			background: #fff;
			.ant-switch-inner{
				margin-right: 40px;
				margin-left: 6px;
			}
		}
	}
</style>