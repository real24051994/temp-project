<template>
	<div class="social-post-preview-image">
		<transition name="fade-in" mode="out-in">
			<div class="item-preview-image item-preview-image-1" v-if="data.length == 1">
				<div class="item-preview-image-box" v-for="item in data" :key="`index_1_${item.id}`" >
					<img  :src="item.src" alt="">
				</div>
			</div>
			<div class="item-preview-image item-preview-image-2" :class="`item-preview-image-${mode}`" v-else-if="data.length == 2">
				<div class="item-preview-image-box" v-for="(item, index) in data" :key="`index_1_${index}`"  >
					<template v-if="mode == 'vertical'">
						<div class="item-preview-image-box-inner" :style="{ 'background-image': 'url(' + item.src + ')' }">
							<img v-if="index == 0" src="@/assets/grid/249x500.png" alt="">
							<img v-if="index == 1" src="@/assets/grid/249x500.png" alt="">
						</div>
					</template>
					<template v-else-if="mode == 'horizontal'">
						<div class="item-preview-image-box-inner" :style="{ 'background-image': 'url(' + item.src + ')' }">
							<img v-if="index == 0" src="@/assets/grid/500x249.png" alt="">
							<img v-if="index == 1" src="@/assets/grid/500x249.png" alt="">
						</div>
					</template>
					<template v-else>
						<div class="item-preview-image-box-inner" :style="{ 'background-image': 'url(' + item.src + ')' }">
							<img v-if="index == 0" src="@/assets/grid/249x249.png" alt="">
							<img v-if="index == 1" src="@/assets/grid/249x249.png" alt="">
						</div>
					</template>
				</div>
			</div>
			<div class="item-preview-image item-preview-image-3" :class="`item-preview-image-${mode}`" v-else-if="data.length == 3">
				<div class="item-preview-image-box" v-for="(item, index) in data" :key="`index_1_${index}`"  >
					<template v-if="mode == 'vertical'">
						<div class="item-preview-image-box-inner" :style="{ 'background-image': 'url(' + item.src + ')' }">
							<img v-if="index == 0" src="@/assets/grid/249x500.png" alt="">
							<img v-if="index == 1" src="@/assets/grid/249x249.png" alt="">
							<img v-if="index == 2" src="@/assets/grid/249x249.png" alt="">
						</div>
					</template>
					<template v-else-if="mode == 'horizontal'">
						<div class="item-preview-image-box-inner" :style="{ 'background-image': 'url(' + item.src + ')' }">
							<img v-if="index == 0" src="@/assets/grid/500x249.png" alt="">
							<img v-if="index == 1" src="@/assets/grid/249x249.png" alt="">
							<img v-if="index == 2" src="@/assets/grid/249x249.png" alt="">
						</div>
					</template>
					<template v-else>
						<div class="item-preview-image-box-inner" :style="{ 'background-image': 'url(' + item.src + ')' }">
							<img v-if="index == 0" src="@/assets/grid/249x249.png" alt="">
							<img v-if="index == 1" src="@/assets/grid/249x249.png" alt="">
							<img v-if="index == 2" src="@/assets/grid/249x249.png" alt="">
						</div>
					</template>
				</div>
			</div>
			<div class="item-preview-image item-preview-image-4" :class="`item-preview-image-${mode}`" v-else-if="data.length == 4">
				<div class="item-preview-image-box" v-for="(item, index) in data" :key="`index_1_${index}`" >
					<div class="item-preview-image-box-inner" :style="{ 'background-image': 'url(' + item.src + ')' }">
						<template v-if="mode == 'vertical'">
							<div class="item-preview-image-box-inner" :style="{ 'background-image': 'url(' + item.src + ')' }">
								<img v-if="index == 0" src="@/assets/grid/333x500.png" alt="">
								<img v-if="index == 1" src="@/assets/grid/165x166.png" alt="">
								<img v-if="index == 2" src="@/assets/grid/165x166.png" alt="">
								<img v-if="index == 3" src="@/assets/grid/165x166.png" alt="">
							</div>
						</template>
						<template v-else-if="mode == 'horizontal'">
							<div class="item-preview-image-box-inner" :style="{ 'background-image': 'url(' + item.src + ')' }">
								<img v-if="index == 0" src="@/assets/grid/500x333.png" alt="">
								<img v-if="index == 1" src="@/assets/grid/165x166.png" alt="">
								<img v-if="index == 2" src="@/assets/grid/165x166.png" alt="">
								<img v-if="index == 3" src="@/assets/grid/165x166.png" alt="">
							</div>
						</template>
						<template v-else>
							<div class="item-preview-image-box-inner" :style="{ 'background-image': 'url(' + item.src + ')' }">
								<img src="@/assets/grid/249x249.png" alt="">
							</div>
						</template>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>
<script>
export default {
	name : 'PriviewImage',
	props:{
		data :{
			type : Array,
			required : true
		}
	},
	computed:{
		mode :{
			get(){
				if( this.data.length ){
					var item = this.data[0]
					if( item.ratio > 1.2){
						return 'horizontal'
					}else if( item.ratio < 0.8 ){
						return 'vertical'
					}
				}
				return 'square'
			}
		}
	}
}
</script>
<style lang="scss" scoped>
	
</style>