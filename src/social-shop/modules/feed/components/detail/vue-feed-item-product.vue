<template>
	<div class="item-row" v-if="!intersected" key="none">
		<a-skeleton class="p-t-10" active :avatar="false" :title="false" :paragraph="{ rows: 2 , width : '100%' }"></a-skeleton>
	</div>
	
</template>

<script>
export default {
	name : 'ItemFeedProduct',
	props :{
		value : {
			type : Array,
			required: true
		},
		item : {
			type : Object,
			required: true
		},
		tableHeader : {
			type : Array,
			required: true,
		},
	},
	data(){
		return {
			intersected : false,
		}
	},
	computed :{
		selected :{
			get(){
				return this.value 
			},
			set(value){
				this.$emit('input', value)
			}
		}
	},
	mounted(){
		if ("IntersectionObserver" in window) {
			this.observer = new IntersectionObserver(entries => {
				const image = entries[0];
				if (image.isIntersecting) {
					this.intersected = true;
					this.observer.disconnect();
					this.$emit("intersect");
				}
			}, {});
			this.observer.observe(this.$el);
		}
	}
}
</script>

<style lang="scss">

</style>