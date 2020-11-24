<template>
	<div>
		<slot></slot>
	</div>
</template>

<script>
import SimpleBar from 'simplebar'; 
import 'simplebar/dist/simplebar.css';
export default {
	name: 'SimpleBar',
	data(){
		return {
			simple : null,
			options :{
				autoHide: false
			}
		}
	},
  	mounted() {
  		this.simple = new SimpleBar(this.$el, {
			
		});
	},
	beforeUpdate() {
		this.simple = new SimpleBar(this.$el, {});
	},
}
</script>