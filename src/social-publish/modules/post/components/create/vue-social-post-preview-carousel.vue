<template>
	<div class="social-post-preview-carousel">
		<a-carousel  arrows>
			<div slot="prevArrow" class="custom-slick-arrow" style="left: 10px;zIndex: 1">
				<sh-icon :icon="['far','chevron-left']" />
			</div>
			<div slot="nextArrow" class="custom-slick-arrow" style="right: 10px">
				<sh-icon :icon="['far','chevron-right']" />
			</div>
			<div class="item-preview-image-box" v-for="item in data" :key="item.id" >
				<div class="item-preview-image-box-inner" :style="{ 'background-image': 'url(' + item.src + ')' }">
					<img  src="@/assets/grid/500x333.png" alt="">
				</div>
			</div>
		</a-carousel>
	</div>
</template>
<script>
export default {
	name : 'PriviewCarousel',
	props:{
		data :{
			type : Array,
			required : true
		}
	},
}
</script>
<style lang="scss">
	
	
</style>